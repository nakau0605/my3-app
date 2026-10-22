'use client';

import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, Shield, ArrowRight, CreditCard } from 'lucide-react';

import { signInWithGoogle } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';

interface Props {
  onClose: () => void;
}

export default function ProModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [success] = useState(false);
  const { user } = useAuth();

  const STRIPE_PAYMENT_URL = 'https://buy.stripe.com/fZufZh1yn6w78A0gNe8AE00';

  const handleStripeCheckout = async () => {
    setLoading(true);
    if (!user) {
      // 購入者とアカウントを紐づけるため先にログイン
      await signInWithGoogle();
      return;
    }
    const params = new URLSearchParams({ client_reference_id: user.id });
    if (user.email) params.set('prefilled_email', user.email);
    window.location.href = `${STRIPE_PAYMENT_URL}?${params.toString()}`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(245, 158, 11, 0.15)',
          position: 'relative',
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
          id="close-pro-modal"
        >
          <X size={18} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
            }}>
              <Sparkles size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Proプランへようこそ！
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              Stripe決済が正常にシミュレートされました。<br />
              限定テーマ（雑誌風・ポラロイド・ネオポップ等）の使い放題、広告非表示、アイテム別詳細クリック分析が解放されました！
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              さっそくPro機能を試す
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-pro" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                <Sparkles size={14} /> MY 3 PRO
              </span>
              <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>
                Stripe Billing 連携
              </span>
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              購入率（CVR）を最大化する<br />
              <span className="gradient-text">洗練されたデザインを手に入れよう</span>
            </h3>

            {/* ROI Pitch from Specs */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Zap size={22} color="#F59E0B" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: '#FDE68A', margin: 0, lineHeight: 1.5 }}>
                <strong>月額わずか480円。</strong> デザインを整えて購入率が上がれば、月に1〜2個売れるだけで月額費用は一瞬でペイできます。
              </p>
            </div>

            {/* Price & Features */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '16px',
            }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF' }}>¥480</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ 月（税込）</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                いつでも解約可能
              </span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                '雑誌風・ポラロイド・ネオポップ・クラフトなど全限定テーマ解放',
                'あなたのページ内の運営側バナー広告を「完全非表示」に',
                'アイテムごとの個別クリック数・CTRを詳細可視化',
                'MY 3作成ページ数「無制限」（無料版は3つまで）',
                '背景色・カラム（ボックス）色の自由カラーカスタマイズ',
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(52, 211, 153, 0.2)',
                    color: '#34D399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              id="stripe-checkout-btn"
            >
              <CreditCard size={18} />
              <span>{loading ? '移動中...' : user ? 'StripeでProに登録する（¥480/月）' : 'GoogleでログインしてProに登録'}</span>
              <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '10px' }}>
              ※ クレジットカード決済（Stripe）。解約はダッシュボードの「プラン管理」からいつでもできます。決済後、Pro機能が反映されるまで数分かかる場合があります。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
