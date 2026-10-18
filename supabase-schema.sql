-- MY 3 (マイスリー) データベース構築スクリプト
-- Supabaseの「SQL Editor」に貼り付けて「Run」を押すだけで完了します

-- 1. ページテーブル (MY 3の投稿データ)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT '総合',
    theme_id TEXT DEFAULT 'sleek',
    bg_color TEXT DEFAULT '#F8F9FD',
    card_color TEXT DEFAULT '#FFFFFF',
    font_family TEXT DEFAULT 'Zen Kaku Gothic New',
    affiliate_tag TEXT,
    author_name TEXT DEFAULT '匿名クリエイター',
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    is_pro BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. アイテムテーブル (各ページに属する3つの商品)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    name TEXT NOT NULL,
    comment TEXT,
    image_url TEXT,
    amazon_url TEXT NOT NULL,
    asin TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. インデックス作成 (検索・URLアクセス高速化)
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_items_page_id ON public.items(page_id);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON public.pages(created_at DESC);

-- 4. Row Level Security (RLS) の設定 (誰でも閲覧可能、誰でも作成可能)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でもMY 3を閲覧可能" ON public.pages FOR SELECT USING (true);
CREATE POLICY "誰でもMY 3を作成可能" ON public.pages FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でもMY 3を更新可能 (PV/クリック用)" ON public.pages FOR UPDATE USING (true);

CREATE POLICY "誰でもアイテムを閲覧可能" ON public.items FOR SELECT USING (true);
CREATE POLICY "誰でもアイテムを作成可能" ON public.items FOR INSERT WITH CHECK (true);

-- 5. 画像保存用ストレージバケットの作成 (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージのアクセス許可ポリシー
CREATE POLICY "誰でも画像を閲覧可能" ON storage.objects FOR SELECT USING (bucket_id = 'item-images');
CREATE POLICY "誰でも画像をアップロード可能" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-images');
