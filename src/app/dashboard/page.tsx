'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  PlusCircle, 
  Crown, 
  Lock,
  BarChart3,
  Layers
} from 'lucide-react';
import { MOCK_PAGES } from '@/data/mockData';
import ProModal from '@/components/ProModal';
import Icon from '@/components/Icon';

export default function DashboardPage() {
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const userPages = MOCK_PAGES.slice(0, 2);

  const totalViews = userPages.reduce((acc, p) => acc + p.views, 0);
  const totalClicks = userPages.reduce((acc, p) => acc + p.clicks, 0);
  const estimatedRevenue = Math.round(totalClicks * 68);

  const handleCopy = (slug: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/p/${slug}` : `https://my5.app/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FD', padding: '40px 0 90px' }}>
      <div className="container">
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '36px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-tag" style={{ fontSize: '0.75rem' }}>
                ANALYTICS & CONTROL
              </span>
              {isPro ? (
                <span className="badge badge-pro" style={{ fontSize: '0.75rem' }}>
                  <Crown size={12} /> PRO MEMBER
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#48484A', fontSize: '0.75rem' }}>
                  FREE PLAN
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
              マイダッシュボード
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              あなたのMY 3の閲覧数・クリック数・推定収益を可視化します。
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsPro(!isPro)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
              id="toggle-pro-demo-btn"
            >
              {isPro ? 'Freeプラン表示に切替' : 'Proプラン表示に切替'}
            </button>

            <Link href="/create" className="btn btn-coral btn-sm" id="dashboard-create-btn">
              <PlusCircle size={16} />
              <span>新しいMY 3を作る</span>
            </Link>
          </div>
        </div>

        {/* Big KPI Metrics (Apple HIG clean squircle cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}>
          {/* Card 1: Views */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAECEF',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>累計ページビュー（PV）</span>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#EEF3FE', color: '#4B7BEC' }}>
                <Eye size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C1E', lineHeight: 1 }}>
              {totalViews.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2ECC71', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <TrendingUp size={16} /> 先週比 +18.4%
            </div>
          </div>

          {/* Card 2: Clicks */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAECEF',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>累計クリック数（CV）</span>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#FDEEF0', color: '#E85A71' }}>
                <MousePointerClick size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C1E', lineHeight: 1 }}>
              {totalClicks.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2ECC71', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <TrendingUp size={16} /> 平均クリック率 13.4%
            </div>
          </div>

          {/* Card 3: Estimated Revenue */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAECEF',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>推定発生紹介料（目安）</span>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#FEF9EB', color: '#B87B44' }}>
                <Sparkles size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#B87B44', lineHeight: 1 }}>
              ¥{estimatedRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              ※ Amazonアソシエイト実績による概算
            </div>
          </div>
        </div>

        {/* Pro Upsell Banner (irop coral/pink style) */}
        {!isPro && (
          <div style={{
            background: 'linear-gradient(135deg, #FDEEF0 0%, #FAF2EB 100%)',
            border: '1px solid #FCD2D8',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '650px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#E85A71',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(232, 90, 113, 0.35)',
              }}>
                <Crown size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '4px' }}>
                  デザインを強化して、購入率（CVR）をさらに引き上げませんか？
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#48484A', margin: 0, lineHeight: 1.55 }}>
                  雑誌風・ポラロイド・ネオポップなどの限定テーマで信頼感をアップ。広告も完全非表示に。月1〜2個売れるだけで月額480円は元が取れます！
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowProModal(true)}
              className="btn btn-coral"
              id="dashboard-upsell-pro-btn"
            >
              Proプランの詳細を見る（¥480/月）
            </button>
          </div>
        )}

        {/* Created Pages List */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
              公開中のMY 3一覧 ({userPages.length}/3 ページ使用中)
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              無料プランは最大3つまで（Proは無制限）
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {userPages.map((page) => (
              <div
                key={page.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px 28px',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-tag" style={{ fontSize: '0.72rem' }}>
                      {page.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      テーマ: {page.themeId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '6px' }}>
                    {page.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="visibility" size={15} color="var(--text-secondary)" />
                      {page.views.toLocaleString()} PV
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="ads_click" size={15} color="var(--text-secondary)" />
                      {page.clicks.toLocaleString()} クリック
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="link" size={15} color="var(--text-secondary)" />
                      my5.app/p/{page.slug}
                    </span>
                  </div>
                </div>

                {/* Page Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleCopy(page.slug)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', gap: '6px' }}
                    id={`copy-page-url-${page.id}`}
                  >
                    {copiedSlug === page.slug ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                    <span>{copiedSlug === page.slug ? 'コピー完了' : 'URLコピー'}</span>
                  </button>

                  <Link
                    href={`/p/${page.slug}`}
                    target="_blank"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', gap: '6px' }}
                    id={`view-live-page-${page.id}`}
                  >
                    <span>ページを見る</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item-level Click Analytics */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          padding: '32px',
          border: '1px solid #EAECEF',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={22} color="#4B7BEC" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                アイテム別クリック分析（ランキング）
              </h2>
            </div>
            {!isPro && (
              <span className="badge badge-pro" style={{ fontSize: '0.72rem' }}>
                <Lock size={12} /> PRO限定詳細分析
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            「どの商品が最もタップされ、買われているか」を特定し、配置順の改善に活かせます。
          </p>

          <div style={{
            filter: isPro ? 'none' : 'blur(4px)',
            opacity: isPro ? 1 : 0.4,
            pointerEvents: isPro ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {userPages[0].items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: '#F8F9FD',
                  border: '1px solid #EAECEF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Black solid badge (irop style) */}
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#1C1C1E',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-en)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {index + 1}
                  </div>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ASIN: {item.asin || 'B082TXXCGF'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2ECC71' }}>
                    {item.clickCount || 120} 回
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    クリック率 29.4%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lock Overlay if Free */}
          {!isPro && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(3px)',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FDEEF0',
                color: '#E85A71',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '6px' }}>
                アイテム別クリック分析はProプランで解放
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '20px' }}>
                どのアイテムが一番人気かを知ることで、5つの順番を並び替えて売上を最大化できます。
              </p>
              <button onClick={() => setShowProModal(true)} className="btn btn-coral btn-sm" id="unlock-analytics-btn">
                Proプランで分析を解放（¥480/月）
              </button>
            </div>
          )}
        </div>
      </div>

      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
