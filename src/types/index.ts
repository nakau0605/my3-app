export interface My5Item {
  id: string;
  name: string;
  comment: string;
  imageUrl: string;
  amazonUrl: string;
  asin?: string;
  affiliateTag?: string; // ユーザー自身のアソシエイトID（空なら運営IDが補完）
  clickCount?: number;
  category?: string;
}

export type ThemeId = 
  | 'minimal'     // ミニマル（標準・クリーン）
  | 'magazine'    // 雑誌風（エディトリアル・洗練）
  | 'polaroid'    // ポラロイド風（レトロ・写真枠・手書き）
  | 'dark'        // スリークダーク（ネオン・サイバー・高級感）
  | 'neopop'      // ネオポップ（Y2K・カラフル・ボールド）
  | 'craft';      // 和モダン・クラフト（アースカラー・上質）

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  badge: 'Free' | 'Pro';
  previewBg: string;
  previewCard: string;
  fontFamily: string;
  accentColor: string;
}

export interface My5PageData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    handle: string;
    bio: string;
    avatarUrl: string;
    isPro: boolean;
    socialLinks?: {
      x?: string;
      instagram?: string;
      note?: string;
    };
  };
  themeId: ThemeId;
  fontId?: string; // 5種類のフォント選択（Pro限定）
  customColors?: {
    backgroundColor?: string;
    cardColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  items: My5Item[]; // 厳選3アイテム
  createdAt: string;
  views: number;
  clicks: number;
  likes?: number;
  isOfficial?: boolean;
}

export type My3Item = My5Item;
export type My3PageData = My5PageData;

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  defaultComment: string;
  imageUrl: string;
  amazonUrl: string;
  asin: string;
}
