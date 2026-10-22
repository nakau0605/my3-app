import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '特定商取引法に基づく表記 | MY 3（マイスリー）',
  description: 'MY 3（マイスリー）Proプランの販売に関する、特定商取引法に基づく表記です。',
};

const ROWS: Array<[string, React.ReactNode]> = [
  ['販売事業者', '請求があった場合、遅滞なく開示いたします。'],
  ['運営責任者', '請求があった場合、遅滞なく開示いたします。'],
  ['所在地', '請求があった場合、遅滞なく開示いたします。'],
  ['電話番号', '請求があった場合、遅滞なく開示いたします。'],
  ['お問い合わせ', <Link key="c" href="/contact" style={{ color: '#4B7BEC', fontWeight: 700 }}>お問い合わせフォーム</Link>],
  ['販売価格', 'Proプラン：月額480円（税込）'],
  ['商品代金以外の必要料金', 'なし（インターネット接続料金・通信料金はお客様のご負担となります）'],
  ['支払方法', 'クレジットカード決済（Stripe）'],
  ['支払時期', '初回お申し込み時に決済され、以降は毎月同日に自動更新されます。'],
  ['サービス提供時期', '決済完了後、速やかにご利用いただけます（反映まで数分かかる場合があります）。'],
  ['解約・キャンセル', 'ダッシュボードの「プラン管理・解約」からいつでも解約できます。解約後も、お支払い済みの期間の末日までご利用いただけます。'],
  ['返金', 'デジタルサービスの性質上、決済後の返金には原則として応じられません。ただし、当社の責めに帰すべき事由がある場合はこの限りではありません。'],
  ['動作環境', '最新の主要ブラウザ（Chrome / Safari / Edge / Firefox）'],
];

export default function TokushohoPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FD' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '40px 16px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#4B7BEC', fontWeight: 700, marginBottom: '24px', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            トップページに戻る
          </Link>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px 32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1C1C1E', margin: '0 0 24px' }}>特定商取引法に基づく表記</h1>
            <dl style={{ margin: 0 }}>
              {ROWS.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 200px) 1fr', gap: '16px', padding: '16px 0', borderBottom: '1px solid #EEF1F6' }}>
                  <dt style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1C1C1E' }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: '0.9rem', color: '#48484A', lineHeight: 1.7 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
