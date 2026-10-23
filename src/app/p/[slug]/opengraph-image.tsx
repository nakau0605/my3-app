import { ImageResponse } from 'next/og';
import { fetchMy3PageBySlug } from '@/lib/supabase';

export const runtime = 'nodejs';
export const alt = 'MY 3 偏愛3選シェア';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let title = '私の偏愛3選';
  let description = '3つのアイテムで、あなたを語る。';
  let authorName = 'クリエイター';
  let items: Array<{ name: string; imageUrl: string }> = [];

  try {
    const dbData = await fetchMy3PageBySlug(slug);
    if (dbData && dbData.page) {
      title = dbData.page.title || title;
      description = dbData.page.description || description;
      authorName = dbData.page.author_name || authorName;
      items = (dbData.items || []).slice(0, 3).map((it) => ({
        name: it.name || 'アイテム',
        imageUrl: it.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      }));
    }
  } catch (err) {
    console.error('OGP Fetch Error:', err);
  }

  // 3つに満たない場合の穴埋め
  const placeholderImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
  ];
  while (items.length < 3) {
    items.push({
      name: `お気に入り #${items.length + 1}`,
      imageUrl: placeholderImages[items.length % placeholderImages.length],
    });
  }

  // どうぶつの森ウィジェット風のスロットカラーパレット（白と黒を完全排除したくすみパステル）
  const slotThemes = [
    { bg: '#EBF3F5', border: '#C5DCE3', badgeBg: '#E07A5F', badgeText: '#FAF4EB' }, // ペールアクア & テラコッタ
    { bg: '#FCF7EC', border: '#E9DEC7', badgeBg: '#E9C46A', badgeText: '#3D312A' }, // ペールミモザ & マスタード
    { bg: '#EDF5F0', border: '#C9E2D2', badgeBg: '#81B29A', badgeText: '#FAF4EB' }, // ペールセージ & グリーン
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          // 外枠背景：くすみオーシャンブルー〜セージの優しいグラデーション（参考画像1 & 3）
          backgroundColor: '#6C93AB',
          backgroundImage: 'linear-gradient(145deg, #88B2CE 0%, #6E97B1 50%, #527A93 100%)',
          padding: '28px 36px',
          fontFamily: 'sans-serif',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* メインウィジェットキャンバス（どう森ウィジェット風のたっぷりした角丸カード、ミルククリーム色 #FAF6EE） */}
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EC', // 白ではなく温かいエクリュ・ミルククリーム
            borderRadius: '38px',
            padding: '30px 38px 24px',
            border: '3px solid #E6DCCD', // モカサンドのソフトボーダー
            boxShadow: '0 20px 45px rgba(38, 65, 82, 0.22)',
            position: 'relative',
          }}
        >
          {/* 上部ヘッダー部：ロゴ、お題バッジ、消印風スタンプ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* 左側：ブランド＆コレクションバッジ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '14px',
                  backgroundColor: '#E76F51', // テラコッタコーラル
                  color: '#FAF5EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '22px',
                  boxShadow: '0 4px 10px rgba(231, 111, 81, 0.3)',
                }}
              >
                3
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: '#3A2E2B', // 深みのあるエスプレッソブラウン
                  }}
                >
                  MY 3
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#2D6A4F',
                    backgroundColor: '#D8F3DC', // ペールミント
                    border: '1.5px solid #B7E4C7',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    letterSpacing: '0.02em',
                  }}
                >
                  偏愛コレクション
                </span>
              </div>
            </div>

            {/* 右側：切手・消印風スタンプ（参考画像3） */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '24px',
                backgroundColor: '#F1E8DC',
                border: '2px dashed #C8B6A2',
                color: '#6B5446',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <span>⚓</span>
              <span>by {authorName}</span>
            </div>
          </div>

          {/* 中央：タイトル部（ローストエスプレッソ色） */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '12px 0 16px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 28 ? '36px' : '44px',
                fontWeight: 900,
                lineHeight: 1.25,
                color: '#342622', // 黒を排除した深みのある焙煎コーヒー色
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: '15px',
                  color: '#6D5B52', // モカブラウン
                  margin: '6px 0 0 0',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* 下部：3つのスロットカード（参考画像1のどう森天気カード風 ✕ 参考画像2の3連ステップ風） */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {items.map((item, idx) => {
              const theme = slotThemes[idx % slotThemes.length];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    backgroundColor: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '24px',
                    padding: '12px',
                    boxShadow: '0 8px 18px rgba(65, 50, 40, 0.06)',
                    position: 'relative',
                  }}
                >
                  {/* カード上部：ナンバリングチップ */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      padding: '0 4px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: theme.badgeBg,
                        color: theme.badgeText,
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>ITEM</span>
                      <span>#{idx + 1}</span>
                    </div>

                    <span style={{ fontSize: '12px', color: '#8E7B70' }}>✦</span>
                  </div>

                  {/* アイテム写真（角丸＆サンドトーンの枠） */}
                  <div
                    style={{
                      width: '100%',
                      height: '136px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#E5DCCE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* アイテム名 */}
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#3A2E2B', // エスプレッソ
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 最下部フッター：ドメイン表記 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              paddingTop: '6px',
              borderTop: '1px solid #EAE1D3',
              fontSize: '11px',
              color: '#8A776D',
              fontWeight: 700,
            }}
          >
            <span>3つのアイテムで、あなたを語る</span>
            <span>my3select.jp 🌿</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
