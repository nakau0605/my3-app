import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'MY 3（マイスリー）| あなたの偏愛で、あなたを語るデジタル名刺',
  description: '3つのアイテムで、あなたを語る。あなたの偏愛が、誰かの次の熱狂になる。プロフィールに貼るだけで、洗練されたこだわりショーケースが完成するキュレーションツール。',
  keywords: ['MY 3', 'マイスリー', '偏愛3選', '愛用品', 'デジタル名刺', 'デスクツアー', 'ガジェット', 'リンクインバイオ', 'キュレーション'],
  openGraph: {
    title: 'MY 3（マイスリー）| あなたの偏愛で、あなたを語るデジタル名刺',
    description: '3つのアイテムで、あなたを語る。あなたの偏愛が、誰かの次の熱狂になる。',
    url: 'https://www.my3select.jp',
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
