import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '利用規約 | MY 3（マイスリー）',
  description: 'MY 3（マイスリー）の利用規約です。本サービスの利用条件を定めています。',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FD' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 16px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              color: '#4B7BEC',
              fontWeight: 700,
              marginBottom: '24px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            トップページに戻る
          </Link>

          {/* Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EEF3FE',
                  color: '#4B7BEC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                  利用規約
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>
                  制定日: 2026年10月1日 / 最終更新日: 2026年10月19日
                </p>
              </div>
            </div>

            <div style={{ fontSize: '0.92rem', lineHeight: 1.8, color: '#334155' }}>
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第1条（適用）
                </h2>
                <p>
                  本利用規約（以下「本規約」）は、「MY 3」（以下「当サービス」）が提供するすべてのサービスにおける利用条件を定めるものです。利用者の皆様（以下「ユーザー」）には、本規約に同意した上で当サービスをご利用いただきます。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第2条（サービス概要）
                </h2>
                <p>
                  当サービスは、ユーザーが愛用する商品やおすすめアイテム（最大3点）を自由にセレクトし、コメントやテーマカラーを設定して専用の紹介ページ（URL）を作成・共有できるキュレーションプラットフォームです。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第3条（アフィリエイトリンクおよび収益化）
                </h2>
                <p>
                  1. ユーザーは、自身が保有するAmazonアソシエイト等のアフィリエイトID・URLを当サービス内の紹介ページに設定することができます。
                  <br />
                  2. ユーザーが独自のアソシエイトIDを設定していない場合、当サービス運営者が保有するアソシエイトIDが自動的に付与され、サービスの維持運営費用に充当されるものとします。
                  <br />
                  3. 当サービスはAmazon.co.jpおよびアフィリエイトプログラムの公式運営者ではなく、Amazonアソシエイト・プログラムの参加者として規約に準拠した運営を行っています。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第4条（禁止事項）
                </h2>
                <p>ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません：</p>
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <li>法令または公序良俗に違反する行為、犯罪行為に関連する行為</li>
                  <li>知的財産権、肖像権、プライバシー権、名誉その他の権利または利益を侵害する行為</li>
                  <li>過度に暴力的、差別的、または公序良俗に反するテキスト・画像の投稿</li>
                  <li>虚偽または詐欺的な商品宣伝、違法な医薬品や危険物の紹介</li>
                  <li>当サービスのサーバーやネットワークの機能を破壊したり妨害したりする行為</li>
                  <li>その他、当サービス運営者が不適切と判断する行為</li>
                </ul>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第5条（コンテンツの削除および公開停止）
                </h2>
                <p>
                  当サービス運営者は、投稿内容が本規約に違反していると判断した場合、事前通知なく該当ページの削除、非公開化、または編集を行うことができるものとします。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第6条（免責事項）
                </h2>
                <p>
                  1. 当サービスは、紹介されている商品・サービスの品質、性能、安全性、およびユーザー間の取引に関して一切の保証を行いません。商品の購入等はユーザー自身の判断と責任において行われるものとします。
                  <br />
                  2. 当サービスは、システムの保守、障害、天災、その他不可抗力によって生じた損害について、一切の責任を負いません。
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  第7条（規約の変更）
                </h2>
                <p>
                  当サービス運営者は、必要と判断した場合には、ユーザーに事前予告することなく本規約を変更することができるものとします。変更後の規約は、当サービス上に掲載された時点より効力を生じるものとします。
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
