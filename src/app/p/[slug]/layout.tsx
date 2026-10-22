import { Metadata } from 'next';
import { fetchMy3PageBySlug } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let title = 'あなたの偏愛3選';
  let description = '3つのアイテムで、あなたを語る。あなたの偏愛が、誰かの次の熱狂になる。MY 3（マイスリー）';
  let authorName = 'クリエイター';

  try {
    const dbData = await fetchMy3PageBySlug(slug);
    if (dbData && dbData.page) {
      title = dbData.page.title || title;
      description = dbData.page.description || description;
      authorName = dbData.page.author_name || authorName;
    } else {
      notFound();
    }
  } catch (err) {
    // notFound() は例外を投げるため再スロー
    if (err && typeof err === 'object' && 'digest' in err) throw err;
    console.error('Metadata fetch error:', err);
  }

  const fullTitle = `${title} | by ${authorName} - MY 3`;
  const pageUrl = `https://www.my3select.jp/p/${slug}`;
  const ogImageUrl = `https://www.my3select.jp/p/${slug}/opengraph-image`;

  return {
    title: fullTitle,
    description: description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: pageUrl,
      siteName: 'MY 3（マイスリー）',
      type: 'article',
      locale: 'ja_JP',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default function My3PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
