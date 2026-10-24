-- ============================================================================
-- MY 3: 共感（スキ / いいね）機能の追加 (migration v3)
-- Supabase の「SQL Editor」に貼り付けて「Run」を押してください。
-- ============================================================================

-- 1. pages テーブルに likes カラムを追加
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

-- 2. 共感（スキ）の安全なカウントアップ関数 (ログイン不要で誰でも+1可能)
CREATE OR REPLACE FUNCTION public.increment_page_likes(p_slug TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_likes INTEGER;
BEGIN
    UPDATE public.pages 
    SET likes = COALESCE(likes, 0) + 1 
    WHERE slug = p_slug
    RETURNING likes INTO v_likes;
    
    RETURN v_likes;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_page_likes(TEXT) TO anon, authenticated;
