import { NextResponse } from 'next/server';

/**
 * Amazon URLからASINを正規表現で抽出
 */
function extractAsin(url: string): string | null {
  const match = url.match(/(?:dp|gp\/product|d)\/([A-Z0-9]{10})/i) ||
                url.match(/ASIN\/([A-Z0-9]{10})/i) ||
                url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
  return match ? match[1].toUpperCase() : null;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 });
    }

    const trimmedUrl = url.trim();
    const asin = extractAsin(trimmedUrl);

    // デモ用またはフォールバック用の既知アイテムマッピング
    const KNOWN_ASINS: Record<string, { title: string; imageUrl: string }> = {
      'B082TXXCGF': {
        title: 'HHKB Professional HYBRID Type-S 墨 英語配列',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      },
      'B0B1475Q6B': {
        title: 'Logicool MX Master 3S ワイヤレス マウス 静音',
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      },
      'B0CHWRXH8B': {
        title: 'Apple AirPods Pro 第2世代 (USB-C)',
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      },
      'B084Z1XF4W': {
        title: 'コンテックス MOKU Mサイズ サウナタオル',
        imageUrl: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
      },
      'B010LOU2QY': {
        title: 'カリタ Kalita 波佐見焼 ドリッパー HA 101',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      },
      'B0C3MBKFFM': {
        title: 'Anker Prime Wall Charger 67W 3ポート急速充電器',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      },
    };

    if (asin && KNOWN_ASINS[asin]) {
      return NextResponse.json({
        success: true,
        asin,
        title: KNOWN_ASINS[asin].title,
        imageUrl: KNOWN_ASINS[asin].imageUrl,
        source: 'preset-match',
      });
    }

    // OGPスクレイピング試行（User-Agent偽装）
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(trimmedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                             html.match(/<title>(.*?)<\/title>/i);
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

        let title = ogTitleMatch ? ogTitleMatch[1].replace(/(\s*\|\s*Amazon.*$|\s*-\s*Amazon.*$)/, '').trim() : '';
        let imageUrl = ogImageMatch ? ogImageMatch[1] : '';

        if (title || imageUrl) {
          return NextResponse.json({
            success: true,
            asin: asin || 'UNKNOWN',
            title: title || 'Amazon 商品',
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            source: 'scraped',
          });
        }
      }
    } catch {
      // タイムアウトやブロック時はフォールバックへ
    }

    // 取得失敗またはブロック時の親切なフォールバック
    return NextResponse.json({
      success: true,
      asin: asin || 'GENERIC',
      title: asin ? `Amazon アイテム (ASIN: ${asin})` : 'お気に入りのアイテム',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      source: 'fallback',
      message: 'Amazonのセキュリティ保護のため基本情報を設定しました。タイトルと画像はお好みで修正できます。',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || '取得に失敗しました' }, { status: 500 });
  }
}
