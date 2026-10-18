'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      backgroundColor: '#F7F8FC',
      marginTop: 'auto',
      padding: '60px 0 calc(60px + env(safe-area-inset-bottom))',
      color: 'var(--text-secondary)',
      fontSize: '0.88rem',
      position: 'relative',
      zIndex: 10,
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '44px',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4B7BEC 0%, #E85A71 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
                fontFamily: 'var(--font-en)',
              }}>
                3
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#1C1C1E', fontFamily: 'var(--font-en)' }}>
                MY 3
              </span>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              あなたの偏愛3選が、誰かの買い物になり、あなたの収益になる。
              プロフィールに貼るだけで完成する、最も手軽な1ペラ・キュレーションプラットフォーム。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#1C1C1E', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 700 }}>
              サービス案内
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/#ranking">注目のMY 3</Link></li>
              <li><Link href="/create">新しいMY 3を作成</Link></li>
              <li><Link href="/#plans">Proプランのご案内</Link></li>
              <li><Link href="/dashboard">アクセス・収益ダッシュボード</Link></li>
            </ul>
          </div>

          {/* Amazon Affiliate Compliance */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B7BEC', marginBottom: '12px' }}>
              <ShieldCheck size={18} />
              <h4 style={{ color: '#1C1C1E', fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                ガイドラインと透明性
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>
              ※ 当サイト「MY 3」はAmazonアソシエイト・プログラムの参加者です。適格販売により紹介料を得ています。
              ユーザーが自身のアソシエイトIDを設定していない場合、運営側のIDが自動補完され、サービスの無償運営維持に充当されます。
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © 2026 MY 3 (my3.app). All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>利用規約</a>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>プライバシーポリシー</a>
            <a href="#" style={{ color: 'var(--text-secondary)' }}>不適切コンテンツの通報</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
