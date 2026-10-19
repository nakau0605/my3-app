import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'プライバシーポリシー | MY 3（マイスリー）',
  description: 'MY 3（マイスリー）のプライバシーポリシーです。個人情報の取り扱い、Cookie利用、アフィリエイトプログラム参加について定めています。',
};

export default function PrivacyPage() {
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
                <Lock size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                  プライバシーポリシー
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>
                  制定日: 2026年10月1日 / 最終更新日: 2026年10月19日
                </p>
              </div>
            </div>

            <div style={{ fontSize: '0.92rem', lineHeight: 1.8, color: '#334155' }}>
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  1. 個人情報の収集・利用目的
                </h2>
                <p>
                  当サービス「MY 3」（以下「当サイト」）では、お問い合わせやサービス利用時に、お名前（ニックネーム）、メールアドレス等の個人情報をご提供いただく場合があります。
                  収集した個人情報は、お問い合わせへの回答や必要な情報の提供にのみ利用し、これら以外の目的では利用いたしません。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  2. Amazonアソシエイト・プログラムに関する明記
                </h2>
                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#92400E',
                    fontWeight: 500,
                  }}
                >
                  「当サイト（MY 3 / my3select.jp）は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。」
                </div>
                <p style={{ marginTop: '12px' }}>
                  第三者（Amazon等の広告配信事業者）がコンテンツおよび宣伝を提供し、訪問者から直接データを収集し、訪問者のブラウザにCookieを設定またはこれを認識する場合があります。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  3. Cookie（クッキー）およびアクセス解析
                </h2>
                <p>
                  当サイトでは、サービスの改善、トラフィック分析、および広告効果測定のためにCookieを使用することがあります。
                  Cookieはブラウザの設定によって無効化することが可能です。無効化した場合、一部の機能が正常に動作しない場合があります。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  4. 個人情報の第三者提供
                </h2>
                <p>
                  当サイトは、法令に基づく場合を除き、ご本人の同意を得ることなく個人情報を第三者に開示・提供することはありません。
                </p>
              </section>

              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  5. 免責事項
                </h2>
                <p>
                  当サイトに掲載されている情報について、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が混入したり、情報の更新が遅れる場合があります。
                  当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                  また、当サイトからのリンクやバナー等によって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '10px' }}>
                  6. プライバシーポリシーの改定
                </h2>
                <p>
                  当サイトは、法令の制定・改定等により、本プライバシーポリシーを適宜見直し、予告なく変更することがあります。変更された最新のプライバシーポリシーは、当サイト上に掲載された時点で効力を生じるものとします。
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
