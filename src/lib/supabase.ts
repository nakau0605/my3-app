import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアント（環境変数が未設定の場合はnull安全に動作）
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DbPage {
  id: string;
  user_id?: string | null;
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
  likes?: number;
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
  clicks?: number;
  created_at: string;
}

const ALLOWED_AMAZON_HOSTS = ['amazon.co.jp', 'amazon.com', 'amzn.to', 'amzn.asia'];

/** Amazon系ドメインのURLかどうか検証 */
export function isAmazonUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_AMAZON_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
}

/** 有効なアイテムURL（Amazon, YouTube, Spotify, Webリンク等）の検証 */
export function isValidItemUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const h = parsed.hostname.toLowerCase();
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) return false;
    if (/^10\./.test(h) || /^192\.168\./.test(h) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h)) return false;
    return true;
  } catch {
    return false;
  }
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
 * MY 3ページとアイテム3件を一括保存（ログイン必須）
 */
export async function saveMy3Page(
  page: Omit<DbPage, 'id' | 'views' | 'clicks' | 'created_at'>,
  items: Array<Omit<DbItem, 'id' | 'page_id' | 'created_at'>>
): Promise<{ success: boolean; slug?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabaseクライアントが初期化されていません。' };
  }

  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'ログインが必要です。' };
    if (items.some((i) => !isValidItemUrl(i.amazon_url))) {
      return { success: false, error: '有効なURL（Amazon、YouTube、Spotify、Webサイトなど）を入力してください。' };
    }

    // 1. ページ作成
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
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
    // 注: 失敗時の巻き戻し用に page.id を保持

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
      await supabase.from('pages').delete().eq('id', pageData.id);
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
 * 閲覧数（PV）をインクリメント（RPC経由。1セッション1ページ1回）
 */
export async function incrementPageViews(slug: string) {
  if (!supabase) return;
  try {
    const key = `viewed:${slug}`;
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    }
    await supabase.rpc('increment_page_views', { p_slug: slug });
  } catch (err) {
    console.error('Increment views error:', err);
  }
}

/**
 * アイテム（Amazonリンク）のクリック数をインクリメント（RPC経由）
 */
export async function incrementItemClick(itemId: string) {
  if (!supabase || !itemId) return;
  try {
    await supabase.rpc('increment_item_click', { p_item_id: itemId });
  } catch (err) {
    console.error('Increment click error:', err);
  }
}

/**
 * ページの共感（スキ / いいね）数をインクリメント（RPC経由）
 */
export async function incrementPageLikes(slug: string): Promise<number | null> {
  if (!supabase || !slug) return null;
  try {
    const { data, error } = await supabase.rpc('increment_page_likes', { p_slug: slug });
    if (error) {
      console.warn('incrementPageLikes error:', error);
      return null;
    }
    return typeof data === 'number' ? data : null;
  } catch (err) {
    console.error('RPC increment_page_likes exception:', err);
    return null;
  }
}

/** 自分のProステータス */
export async function fetchMyProfile(userId: string): Promise<{ is_pro: boolean } | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('is_pro').eq('id', userId).maybeSingle();
  return data ? { is_pro: !!data.is_pro } : { is_pro: false };
}

/** 自分のページ一覧（items付き） */
export async function fetchMyPages(userId: string): Promise<Array<DbPage & { items: DbItem[] }>> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('pages')
    .select('*, items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((p: any) => ({
    ...p,
    items: (p.items || []).sort((a: DbItem, b: DbItem) => a.order_index - b.order_index),
  }));
}

/** ページ更新（アイテムは order_index ごとに更新） */
export async function updateMy3Page(
  pageId: string,
  page: Partial<Pick<DbPage, 'title' | 'description' | 'category' | 'theme_id' | 'bg_color' | 'card_color' | 'font_family' | 'affiliate_tag'>>,
  items: Array<Omit<DbItem, 'id' | 'page_id' | 'created_at'>>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabaseが初期化されていません。' };
  if (items.some((i) => !isValidItemUrl(i.amazon_url))) {
    return { success: false, error: '有効なURL（Amazon、YouTube、Spotify、Webサイトなど）を入力してください。' };
  }
  const { error } = await supabase.from('pages').update(page).eq('id', pageId);
  if (error) return { success: false, error: error.message };
  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx];
    const { error: e } = await supabase
      .from('items')
      .update({
        name: it.name,
        comment: it.comment,
        image_url: it.image_url,
        amazon_url: it.amazon_url,
        asin: it.asin || null,
        category: it.category || 'アイテム',
      })
      .eq('page_id', pageId)
      .eq('order_index', idx);
    if (e) return { success: false, error: e.message };
  }
  return { success: true };
}

/** ページ削除（itemsはカスケード or 先に削除） */
export async function deleteMy3Page(pageId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabaseが初期化されていません。' };
  await supabase.from('items').delete().eq('page_id', pageId);
  const { error } = await supabase.from('pages').delete().eq('id', pageId);
  return error ? { success: false, error: error.message } : { success: true };
}

/** お問い合わせ・通報の保存 */
export async function submitContactMessage(input: {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  page_slug?: string;
  kind?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabaseが初期化されていません。' };
  const { error } = await supabase.from('contact_messages').insert({
    name: input.name || null,
    email: input.email || null,
    message: (input.subject ? `[${input.subject}] ` : '') + input.message,
    page_slug: input.page_slug || null,
    kind: input.kind || 'contact',
  });
  return error ? { success: false, error: error.message } : { success: true };
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
