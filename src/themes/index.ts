import { ThemeConfig, ThemeId } from '@/types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: '無駄を削ぎ落とした洗練された白基調。どんなアイテムにも自然に調和。',
    badge: 'Free',
    previewBg: '#F8FAFC',
    previewCard: '#FFFFFF',
    fontFamily: '"Plus Jakarta Sans", "Noto Sans JP", sans-serif',
    accentColor: '#0F172A',
  },
  dark: {
    id: 'dark',
    name: 'Sleek Dark',
    description: 'ガジェットやサウナにマッチする重厚感。ネオンとすりガラスの高級感。',
    badge: 'Free',
    previewBg: '#090D16',
    previewCard: '#131B2E',
    fontFamily: '"Outfit", "Noto Sans JP", sans-serif',
    accentColor: '#38BDF8',
  },
  magazine: {
    id: 'magazine',
    name: 'Magazine Editorial',
    description: 'POPEYEやGINZAのような雑誌の紙面風。美しい余白と上品な明朝体。',
    badge: 'Pro',
    previewBg: '#FAF8F5',
    previewCard: '#FFFFFF',
    fontFamily: '"Shippori Mincho", "Noto Serif JP", serif',
    accentColor: '#C2410C',
  },
  polaroid: {
    id: 'polaroid',
    name: 'Polaroid & Retro',
    description: '白いフォトフレームと手書き風コメント。愛着がダイレクトに伝わるデザイン。',
    badge: 'Pro',
    previewBg: '#F3EFE6',
    previewCard: '#FFFFFF',
    fontFamily: '"Yomogi", "Zen Maru Gothic", sans-serif',
    accentColor: '#EA580C',
  },
  neopop: {
    id: 'neopop',
    name: 'Neo Pop / Y2K',
    description: 'スマホWebデザインアワード受賞作に多い、太枠とポップな配色で目を引く旬なスタイル。',
    badge: 'Pro',
    previewBg: '#FFFBEB',
    previewCard: '#FFFFFF',
    fontFamily: '"Plus Jakarta Sans", "Noto Sans JP", sans-serif',
    accentColor: '#7C3AED',
  },
  craft: {
    id: 'craft',
    name: 'Craft & Artisan',
    description: 'クラフトビールや珈琲、器などこだわり派に捧ぐ、自然なアースカラーと質感。',
    badge: 'Pro',
    previewBg: '#EDE8E1',
    previewCard: '#F7F4EF',
    fontFamily: '"Shippori Mincho", "Noto Serif JP", serif',
    accentColor: '#065F46',
  },
};

export const THEME_LIST = Object.values(THEMES);

/**
 * 運営者のデフォルトAmazonアソシエイトID
 * 仕様書: ユーザーが空欄にした場合、システム側で自動付与して運営収益に変換
 */
export const DEFAULT_PLATFORM_AFFILIATE_TAG = 'nakauyusuke06-22';

/**
 * Amazon URLにアフィリエイトタグを付与・補完する関数
 */
export function buildAffiliateUrl(originalUrl: string, userTag?: string): { url: string; appliedTag: string; isPlatformTag: boolean } {
  try {
    const targetTag = (userTag && userTag.trim().length > 0) 
      ? userTag.trim() 
      : DEFAULT_PLATFORM_AFFILIATE_TAG;
    const isPlatform = targetTag === DEFAULT_PLATFORM_AFFILIATE_TAG;

    if (!originalUrl) return { url: '#', appliedTag: targetTag, isPlatformTag: isPlatform };

    const parsed = new URL(originalUrl);
    // Amazonドメインであれば tag パラメータを更新
    if (parsed.hostname.includes('amazon.')) {
      parsed.searchParams.set('tag', targetTag);
      return { url: parsed.toString(), appliedTag: targetTag, isPlatformTag: isPlatform };
    }

    // amzn.to などの短縮URLの場合（実際はリダイレクト先で付与されるか、クエリ付与）
    parsed.searchParams.set('tag', targetTag);
    return { url: parsed.toString(), appliedTag: targetTag, isPlatformTag: isPlatform };
  } catch {
    return { 
      url: originalUrl || '#', 
      appliedTag: userTag || DEFAULT_PLATFORM_AFFILIATE_TAG, 
      isPlatformTag: !userTag 
    };
  }
}
