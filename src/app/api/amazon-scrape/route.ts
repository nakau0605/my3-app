import { NextRequest, NextResponse } from 'next/server';

function extractAsin(url: string): string | null {
  const match = url.match(/(?:dp|gp\/product|d)\/([A-Z0-9]{10})/i) ||
                url.match(/ASIN\/([A-Z0-9]{10})/i) ||
                url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
  return match ? match[1].toUpperCase() : null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  return handleScrape(url);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return handleScrape(body.url);
  } catch {
    return NextResponse.json({ success: false, error: '不正なリクエストです' }, { status: 400 });
  }
}

async function handleScrape(rawUrl: string | null | undefined) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return NextResponse.json({ success: false, error: 'URLが指定されていません' }, { status: 400 });
  }

  const trimmedUrl = rawUrl.trim();
  let targetUrl: URL;
  try {
    targetUrl = new URL(trimmedUrl);
  } catch {
    return NextResponse.json({ success: false, error: '有効なURLを入力してください' }, { status: 400 });
  }

  const asin = extractAsin(trimmedUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      // 1. タイトル
      let title = '';
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                           html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:title["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        title = ogTitleMatch[1];
      } else {
        const titleTagMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleTagMatch && titleTagMatch[1]) {
          title = titleTagMatch[1];
        }
      }

      // クリーニング
      if (title) {
        title = title
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/^Amazon\s*\|\s*/i, '')
          .replace(/^Amazon\.co\.jp\s*:\s*/i, '')
          .replace(/\s*:\s*(本|家電＆カメラ|パソコン・周辺機器|ホーム＆キッチン|ファッション|ビューティー|ドラッグストア|食品・飲料・お酒|ホビー|スポーツ＆アウトドア|DIY・工具).*$/i, '')
          .replace(/\s*-\s*Amazon\.co\.jp$/i, '')
          .replace(/\s*\|\s*Amazon$/i, '')
          .trim();
      }

      // 2. 画像
      let imageUrl = '';
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i) ||
                           html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1]) {
        imageUrl = ogImageMatch[1];
      } else {
        const landingImageMatch = html.match(/id=["']landingImage["'][^>]*data-old-hires=["'](.*?)["']/i) ||
                                  html.match(/id=["']landingImage["'][^>]*src=["'](.*?)["']/i);
        if (landingImageMatch && landingImageMatch[1]) {
          imageUrl = landingImageMatch[1];
        }
      }

      if (title || imageUrl) {
        return NextResponse.json({
          success: true,
          item: {
            title: title || (asin ? `Amazon商品 (${asin})` : 'お気に入りのアイテム'),
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            asin: asin || '',
          },
        });
      }
    }
  } catch (fetchErr) {
    console.warn('Scraping error / fallback triggered:', fetchErr);
  }

  // フォールバック
  return NextResponse.json({
    success: true,
    item: {
      title: asin ? `Amazon商品 (${asin})` : 'おすすめアイテム',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      asin: asin || '',
    },
    message: '商品名や画像はお好みで編集・アップロードできます。',
  });
}
