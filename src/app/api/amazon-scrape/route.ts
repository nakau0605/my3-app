import { NextRequest, NextResponse } from 'next/server';

function extractAsin(url: string): string | null {
  const match = url.match(/(?:dp|gp\/product|d)\/([A-Z0-9]{10})/i) ||
                url.match(/ASIN\/([A-Z0-9]{10})/i) ||
                url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
  return match ? match[1].toUpperCase() : null;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
}

function isPrivateIpOrHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) return true;
  if (/^10\./.test(h) || /^192\.168\./.test(h) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h)) return true;
  return false;
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

  if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
    return NextResponse.json({ success: false, error: 'HTTPまたはHTTPSのURLを入力してください' }, { status: 400 });
  }

  const hostname = targetUrl.hostname.toLowerCase();
  if (isPrivateIpOrHost(hostname)) {
    return NextResponse.json({ success: false, error: '無効なURLです' }, { status: 400 });
  }

  // 1. YouTube の場合
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    const ytId = extractYouTubeId(trimmedUrl);
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(trimmedUrl)}&format=json`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        return NextResponse.json({
          success: true,
          kind: 'youtube',
          item: {
            title: data.title || 'YouTube動画',
            imageUrl: data.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ''),
            category: 'YouTube',
            url: trimmedUrl,
          },
        });
      }
    } catch {}

    if (ytId) {
      return NextResponse.json({
        success: true,
        kind: 'youtube',
        item: {
          title: 'YouTube動画',
          imageUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          category: 'YouTube',
          url: trimmedUrl,
        },
      });
    }
  }

  // 2. Spotify の場合
  if (hostname.includes('spotify.com')) {
    try {
      const oembedRes = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(trimmedUrl)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        return NextResponse.json({
          success: true,
          kind: 'spotify',
          item: {
            title: data.title || 'Spotify 楽曲 / プレイリスト',
            imageUrl: data.thumbnail_url || '',
            category: '音楽 / Spotify',
            url: trimmedUrl,
          },
        });
      }
    } catch {}
    return NextResponse.json({
      success: true,
      kind: 'spotify',
      item: {
        title: 'Spotify プレイリスト / 楽曲',
        imageUrl: '',
        category: '音楽 / Spotify',
        url: trimmedUrl,
      },
    });
  }

  // 3. Amazon の場合
  const isAmazon = ['amazon.co.jp', 'amazon.com', 'amzn.to', 'amzn.asia'].some(
    (a) => hostname === a || hostname.endsWith('.' + a)
  );

  let asin = isAmazon ? extractAsin(trimmedUrl) : null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (isAmazon) {
      try {
        const finalHost = new URL(response.url).hostname.toLowerCase();
        if (['amazon.co.jp', 'amazon.com', 'amzn.to', 'amzn.asia'].some((a) => finalHost === a || finalHost.endsWith('.' + a))) {
          asin = extractAsin(response.url) || asin;
        }
      } catch {}
    }

    if (response.ok) {
      const html = await response.text();

      // タイトル抽出
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

      // 画像抽出
      let imageUrl = '';
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i) ||
                           html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1]) {
        imageUrl = ogImageMatch[1];
      } else if (isAmazon) {
        const landingImageMatch = html.match(/id=["']landingImage["'][^>]*data-old-hires=["'](.*?)["']/i) ||
                                  html.match(/id=["']landingImage["'][^>]*src=["'](.*?)["']/i);
        if (landingImageMatch && landingImageMatch[1]) {
          imageUrl = landingImageMatch[1];
        }
      }

      const canonicalLink = isAmazon
        ? (asin ? `https://www.amazon.co.jp/dp/${asin}` : trimmedUrl)
        : trimmedUrl;

      if (title || imageUrl) {
        return NextResponse.json({
          success: true,
          kind: isAmazon ? 'amazon' : 'web',
          item: {
            title: title || (asin ? `Amazon商品 (${asin})` : targetUrl.hostname),
            imageUrl: imageUrl || '',
            asin: asin || '',
            amazonUrl: canonicalLink,
            url: canonicalLink,
            category: isAmazon ? 'アイテム' : 'Webサイト',
          },
        });
      }
    }
  } catch (fetchErr) {
    console.warn('Scraping error:', fetchErr);
  }

  // フォールバック
  const canonicalLink = isAmazon && asin ? `https://www.amazon.co.jp/dp/${asin}` : trimmedUrl;
  return NextResponse.json({
    success: true,
    kind: isAmazon ? 'amazon' : 'web',
    item: {
      title: asin ? `Amazon商品 (${asin})` : '',
      imageUrl: '',
      asin: asin || '',
      amazonUrl: canonicalLink,
      url: canonicalLink,
      category: isAmazon ? 'アイテム' : 'Webサイト',
    },
    message: 'タイトルや画像が取得できませんでした。手動で入力・アップロードしてください。',
  });
}
