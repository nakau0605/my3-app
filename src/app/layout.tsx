import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'MY 3（マイスリー）| あなたの偏愛3選が、誰かの買い物になり、あなたの収益になる',
  description: 'プロフィールに貼るだけ。3つ選ぶだけで洗練されたアフィリエイトページが完成する1ペラ・キュレーションツール。雑誌風・ポラロイド風・ダークモードに1タップで着せ替え。',
  keywords: ['MY 3', 'マイスリー', 'アフィリエイト', 'キュレーション', '偏愛3選', 'Amazonアソシエイト', 'リンク集'],
  openGraph: {
    title: 'MY 3（マイスリー）| 偏愛3選が、収益になる',
    description: 'プロフィールにリンクを貼るだけ。3つのお気に入りで収益が発生する手軽な1ペラサイト作成ツール。',
    url: 'https://my3.app',
    siteName: 'MY 3',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <Navbar />
        <main style={{ flex: 1, minHeight: 'calc(100vh - 68px)' }}>
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
