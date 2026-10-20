import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアント（環境変数が未設定の場合はnull安全に動作）
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DbPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  theme_id: string;
  bg_color: string;
  card_color: string;
  font_family: string;
  affiliate_tag?: string;
  author_name: string;
  author_avatar: string;
  views: number;
  clicks: number;
  is_pro: boolean;
  created_at: string;
}

export interface DbItem {
  id: string;
  page_id: string;
  order_index: number;
  name: string;
  comment: string;
  image_url: string;
  amazon_url: string;
  asin?: string;
  category?: string;
  created_at: string;
}

/**
 * Googleアカウントでログイン
 */
export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error('Supabaseが初期化されていません') };
  const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.my3select.jp';
  const redirectTo = `${redirectOrigin}/auth/callback`;

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

/**
 * ログアウト
 */
export async function signOut() {
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * 現在のログインユーザーを取得
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * 画像ファイルをSupabase Storage ('item-images') にアップロード
 */
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.error('Storage error:', err);
    return null;
  }
}

/**
 * MY 3ページとアイテム3件を一括保存
 */
export async function saveMy3Page(
  page: Omit<DbPage, 'id' | 'views' | 'clicks' | 'created_at'>,
  items: Array<Omit<DbItem, 'id' | 'page_id' | 'created_at'>>
): Promise<{ success: boolean; slug?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabaseクライアントが初期化されていません。' };
  }

  try {
    // 1. ページ作成
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert({
        slug: page.slug,
        title: page.title,
        description: page.description,
        category: page.category || '総合',
        theme_id: page.theme_id || 'sleek',
        bg_color: page.bg_color || '#F8F9FD',
        card_color: page.card_color || '#FFFFFF',
        font_family: page.font_family || 'Zen Kaku Gothic New',
        affiliate_tag: page.affiliate_tag || null,
        author_name: page.author_name || '匿名クリエイター',
        author_avatar: page.author_avatar,
        is_pro: page.is_pro || false,
      })
      .select()
      .single();

    if (pageError || !pageData) {
      console.error('Page insert error:', pageError);
      return { success: false, error: pageError?.message || 'ページの作成に失敗しました。' };
    }

    // 2. アイテム3件作成
    const itemsToInsert = items.map((item, idx) => ({
      page_id: pageData.id,
      order_index: idx,
      name: item.name,
      comment: item.comment,
      image_url: item.image_url,
      amazon_url: item.amazon_url,
      asin: item.asin || null,
      category: item.category || 'アイテム',
    }));

    const { error: itemsError } = await supabase
      .from('items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Items insert error:', itemsError);
      return { success: false, error: itemsError.message };
    }

    return { success: true, slug: pageData.slug };
  } catch (err: any) {
    console.error('Unexpected save error:', err);
    return { success: false, error: err.message || '予期せぬエラーが発生しました。' };
  }
}

/**
 * スラッグからページとアイテムを取得
 */
export async function fetchMy3PageBySlug(slug: string): Promise<{ page: DbPage; items: DbItem[] } | null> {
  if (!supabase) return null;

  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pageError || !page) return null;

    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true });

    if (itemsError || !items) return null;

    return { page, items };
  } catch (err) {
    console.error('Fetch page error:', err);
    return null;
  }
}

/**
 * 閲覧数（PV）をインクリメント
 */
export async function incrementPageViews(slug: string) {
  if (!supabase) return;
  try {
    const { data } = await supabase
      .from('pages')
      .select('views')
      .eq('slug', slug)
      .single();

    if (data) {
      await supabase
        .from('pages')
        .update({ views: (data.views || 0) + 1 })
        .eq('slug', slug);
    }
  } catch (err) {
    console.error('Increment views error:', err);
  }
}

/**
 * クリック数をインクリメント
 */
export async function incrementPageClicks(slug: string) {
  if (!supabase) return;
  try {
    const { data } = await supabase
      .from('pages')
      .select('clicks')
      .eq('slug', slug)
      .single();

    if (data) {
      await supabase
        .from('pages')
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq('slug', slug);
    }
  } catch (err) {
    console.error('Increment clicks error:', err);
  }
}

/**
 * 最新のMY 3ページ一覧を取得
 */
export async function fetchRecentMy3Pages(limit = 12): Promise<Array<DbPage & { items: DbItem[] }>> {
  if (!supabase) return [];
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*, items(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !pages) return [];

    // 各ページのitemsをorder_index順に整列
    return pages.map((p: any) => ({
      ...p,
      items: (p.items || []).sort((a: DbItem, b: DbItem) => a.order_index - b.order_index),
    }));
  } catch (err) {
    console.error('Fetch recent pages error:', err);
    return [];
  }
}
