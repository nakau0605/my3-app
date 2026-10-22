-- ============================================================================
-- MY 3 データベース セキュリティ強化 & 機能拡張 (migration v2)
-- Supabase の「SQL Editor」に全文を貼り付けて「Run」を押してください。
-- 何度実行しても壊れないように作ってあります(再実行OK)。
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles: ユーザーごとのプラン情報 (Pro課金状態はここだけが真実)
--    クライアント(ブラウザ)からは読み取りのみ。書き込みはStripe Webhook(サーバー)だけ。
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_pro BOOLEAN NOT NULL DEFAULT false,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "自分のプロフィールのみ閲覧可能" ON public.profiles;
CREATE POLICY "自分のプロフィールのみ閲覧可能" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 新規ユーザー登録時に profiles を自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 既存ユーザー分を作成
INSERT INTO public.profiles (id) SELECT id FROM auth.users ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. pages / items に持ち主(user_id)とクリック数を追加
-- ----------------------------------------------------------------------------
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS clicks INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_pages_user_id ON public.pages(user_id);

-- 1ページにつきアイテムは3つ(0,1,2)まで
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'items_page_order_unique') THEN
        ALTER TABLE public.items ADD CONSTRAINT items_page_order_unique UNIQUE (page_id, order_index);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'items_order_range') THEN
        ALTER TABLE public.items ADD CONSTRAINT items_order_range CHECK (order_index BETWEEN 0 AND 2);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. 古い「誰でも書き換え可能」ポリシーを全て撤去し、「持ち主だけ」に置き換え
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "誰でもMY 3を閲覧可能" ON public.pages;
DROP POLICY IF EXISTS "誰でもMY 3を作成可能" ON public.pages;
DROP POLICY IF EXISTS "誰でもMY 3を更新可能 (PV/クリック用)" ON public.pages;
DROP POLICY IF EXISTS "誰でもアイテムを閲覧可能" ON public.items;
DROP POLICY IF EXISTS "誰でもアイテムを作成可能" ON public.items;

DROP POLICY IF EXISTS "pages_select_all" ON public.pages;
DROP POLICY IF EXISTS "pages_insert_own" ON public.pages;
DROP POLICY IF EXISTS "pages_update_own" ON public.pages;
DROP POLICY IF EXISTS "pages_delete_own" ON public.pages;
CREATE POLICY "pages_select_all" ON public.pages FOR SELECT USING (true);
CREATE POLICY "pages_insert_own" ON public.pages FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pages_update_own" ON public.pages FOR UPDATE TO authenticated
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pages_delete_own" ON public.pages FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "items_select_all" ON public.items;
DROP POLICY IF EXISTS "items_insert_own" ON public.items;
DROP POLICY IF EXISTS "items_update_own" ON public.items;
DROP POLICY IF EXISTS "items_delete_own" ON public.items;
CREATE POLICY "items_select_all" ON public.items FOR SELECT USING (true);
CREATE POLICY "items_insert_own" ON public.items FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.user_id = auth.uid()));
CREATE POLICY "items_update_own" ON public.items FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.user_id = auth.uid()));
CREATE POLICY "items_delete_own" ON public.items FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- 4. 改ざん防止トリガー
--    - is_pro は profiles から自動決定(ブラウザから偽装できない)
--    - 無料ユーザーは最大3ページ
--    - ブラウザ(authenticated)からは views / clicks / slug / user_id を変更できない
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.pages_before_write()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_is_pro BOOLEAN;
    v_count INTEGER;
BEGIN
    SELECT COALESCE(is_pro, false) INTO v_is_pro FROM public.profiles WHERE id = NEW.user_id;
    v_is_pro := COALESCE(v_is_pro, false);

    IF TG_OP = 'INSERT' THEN
        NEW.views := 0;
        NEW.clicks := 0;
        IF NOT v_is_pro THEN
            SELECT COUNT(*) INTO v_count FROM public.pages WHERE user_id = NEW.user_id;
            IF v_count >= 3 THEN
                RAISE EXCEPTION '無料プランで作成できるMY 3は3つまでです。Proプランにアップグレードしてください。';
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF session_user = 'authenticated' OR session_user = 'anon' OR current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
            NEW.views := OLD.views;
            NEW.clicks := OLD.clicks;
            NEW.slug := OLD.slug;
            NEW.user_id := OLD.user_id;
            NEW.created_at := OLD.created_at;
        END IF;
    END IF;

    NEW.is_pro := v_is_pro;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pages_before_write ON public.pages;
CREATE TRIGGER trg_pages_before_write
    BEFORE INSERT OR UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.pages_before_write();

CREATE OR REPLACE FUNCTION public.items_before_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.clicks := 0;
    ELSIF session_user = 'authenticated' OR session_user = 'anon' OR current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
        NEW.clicks := OLD.clicks;
        NEW.page_id := OLD.page_id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_items_before_write ON public.items;
CREATE TRIGGER trg_items_before_write
    BEFORE INSERT OR UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.items_before_update();

-- ----------------------------------------------------------------------------
-- 5. PV・クリックの安全なカウントアップ関数 (誰でも「+1」だけ可能)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_page_views(p_slug TEXT)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    UPDATE public.pages SET views = views + 1 WHERE slug = p_slug;
$$;

CREATE OR REPLACE FUNCTION public.increment_item_click(p_item_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_page_id UUID;
BEGIN
    UPDATE public.items SET clicks = clicks + 1 WHERE id = p_item_id RETURNING page_id INTO v_page_id;
    IF v_page_id IS NOT NULL THEN
        UPDATE public.pages SET clicks = clicks + 1 WHERE id = v_page_id;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_page_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_item_click(UUID) TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 6. お問い合わせ・通報の保存先 (書き込みは誰でも可、読み取りは管理者(あなた)だけ)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind TEXT NOT NULL,
    name TEXT,
    email TEXT,
    message TEXT NOT NULL,
    page_slug TEXT,
    user_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT contact_message_len CHECK (char_length(message) BETWEEN 1 AND 4000),
    CONSTRAINT contact_name_len CHECK (name IS NULL OR char_length(name) <= 200),
    CONSTRAINT contact_email_len CHECK (email IS NULL OR char_length(email) <= 320),
    CONSTRAINT contact_kind_len CHECK (char_length(kind) <= 100)
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_insert_anyone" ON public.contact_messages;
CREATE POLICY "contact_insert_anyone" ON public.contact_messages
    FOR INSERT TO anon, authenticated WITH CHECK (true);
-- SELECT ポリシーは意図的に作りません(Supabaseの管理画面からのみ閲覧)

-- ----------------------------------------------------------------------------
-- 7. 画像アップロードを「ログイン済みユーザーのみ・5MBまで・画像のみ」に制限
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "誰でも画像をアップロード可能" ON storage.objects;
DROP POLICY IF EXISTS "ログインユーザーのみ画像アップロード" ON storage.objects;
CREATE POLICY "ログインユーザーのみ画像アップロード" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'item-images');

UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'item-images';

-- ----------------------------------------------------------------------------
-- 8. 【任意だけど推奨】これまでのテスト投稿(持ち主なし)をあなたのアカウントに紐づける
--    → ダッシュボードから編集・削除できるようになります。
--    ※ 先にGoogleログインを1回済ませてから実行してください(ユーザーが作られるため)。
-- ----------------------------------------------------------------------------
UPDATE public.pages
SET user_id = (SELECT id FROM auth.users WHERE email = 'nakauyusuke0605@gmail.com' LIMIT 1)
WHERE user_id IS NULL
  AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'nakauyusuke0605@gmail.com');
