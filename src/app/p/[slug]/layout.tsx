import { Metadata } from 'next';
import { fetchMy3PageBySlug } from '@/lib/supabase';
import { MOCK_PAGES } from '@/data/mockData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let title = 'あなたの偏愛3選';
  let description = '偏愛3選が、誰かの買い物になり、あなたの収益になる。MY 3（マイスリー）';
  let authorName = 'クリエイター';

  try {
    const dbData = await fetchMy3PageBySlug(slug);
    if (dbData && dbData.page) {
      title = dbData.page.title || title;
      description = dbData.page.description || description;
      authorName = dbData.page.author_name || authorName;
    } else {
      const mock = MOCK_PAGES.find((p) => p.slug === slug);
      if (mock) {
        title = mock.title;
        description = mock.description;
        authorName = mock.author.name;
      }
    }
  } catch (err) {
    console.error('Metadata fetch error:', err);
  }

  const fullTitle = `${title} | by ${authorName} - MY 3`;
  const pageUrl = `https://www.my3select.jp/p/${slug}`;

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
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
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
