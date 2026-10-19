import { ImageResponse } from 'next/og';
import { fetchMy3PageBySlug } from '@/lib/supabase';
import { MOCK_PAGES } from '@/data/mockData';

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

  // Supabaseまたはモックからデータを取得
  let title = 'あなたの偏愛3選';
  let authorName = 'クリエイター';
  let items: Array<{ name: string; imageUrl: string }> = [];

  try {
    const dbData = await fetchMy3PageBySlug(slug);
    if (dbData && dbData.page) {
      title = dbData.page.title || title;
      authorName = dbData.page.author_name || authorName;
      items = (dbData.items || []).slice(0, 3).map((it) => ({
        name: it.name || 'アイテム',
        imageUrl: it.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      }));
    }
  } catch (err) {
    console.error('OGP Fetch Error:', err);
  }

  // フォールバック（モックデータ）
  if (items.length === 0) {
    const mock = MOCK_PAGES.find((p) => p.slug === slug) || MOCK_PAGES[0];
    title = mock.title;
    authorName = mock.author.name;
    items = mock.items.slice(0, 3).map((it) => ({
      name: it.name,
      imageUrl: it.imageUrl,
    }));
  }

  // 3つに満たない場合の穴埋め
  while (items.length < 3) {
    items.push({
      name: 'おすすめアイテム',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F172A',
          backgroundImage: 'radial-gradient(circle at 10% 10%, #1E293B 0%, #0F172A 70%), radial-gradient(circle at 90% 90%, #312E81 0%, #0F172A 60%)',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4B7BEC 0%, #E85A71 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '24px',
              }}
            >
              3
            </div>
            <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              MY 3
            </span>
            <span
              style={{
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '999px',
                color: '#CBD5E1',
                marginLeft: '8px',
              }}
            >
              偏愛3選シェア
            </span>
          </div>

          <div
            style={{
              fontSize: '18px',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>by</span>
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{authorName}</span>
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px 0' }}>
          <h1
            style={{
              fontSize: title.length > 30 ? '38px' : '46px',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#FFFFFF',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h1>
        </div>

        {/* 3 Item Cards Preview */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '12px',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
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

              {/* Badge & Item Name */}
              <div
                style={{
                  width: '100%',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#4B7BEC',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 900,
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: '14px',
            color: '#64748B',
            marginTop: '8px',
          }}
        >
          <span>my3select.jp</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
