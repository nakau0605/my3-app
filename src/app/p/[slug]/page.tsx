'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Share2, 
  ShieldAlert, 
  Palette, 
  Eye, 
  MousePointerClick, 
  ArrowLeft,
  Crown,
  ExternalLink,
  Heart
} from 'lucide-react';
import { MOCK_PAGES } from '@/data/mockData';
import { THEMES, THEME_LIST } from '@/themes';
import { ThemeId, My5Item } from '@/types';
import ItemCard from '@/components/ItemCard';
import CollageOGPModal from '@/components/CollageOGPModal';
import ReportModal from '@/components/ReportModal';
import ProModal from '@/components/ProModal';
import Icon from '@/components/Icon';
import { fetchMy3PageBySlug, incrementPageViews, deleteMy3Page } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';

export default function UserMy5Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  // 型の土台としてのみ使用（表示データはすべてDB由来）
  const shapeBase = MOCK_PAGES[0];
  const { user } = useAuth();

  const [dbData, setDbData] = useState<{ page: any; items: any[] } | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeId>('minimal');
  const [showOgpModal, setShowOgpModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const result = await fetchMy3PageBySlug(resolvedParams.slug);
        if (!isMounted) return;
        if (result) {
          setDbData(result);
          if (result.page.theme_id && THEMES[result.page.theme_id as ThemeId]) {
            setActiveTheme(result.page.theme_id as ThemeId);
          }
          incrementPageViews(resolvedParams.slug);
        } else {
          setNotFoundState(true);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setNotFoundState(true);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [resolvedParams.slug]);

  if (!dbData) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        {notFoundState ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>ページが見つかりません</h1>
            <Link href="/" className="btn btn-primary btn-sm">トップへ戻る</Link>
          </div>
        ) : (
          <span>読み込み中...</span>
        )}
      </div>
    );
  }

  const isOwner = !!user && dbData.page.user_id === user.id;

  const handleDelete = async () => {
    if (!window.confirm('このMY 3ページを削除します。元に戻せません。よろしいですか？')) return;
    const res = await deleteMy3Page(dbData.page.id);
    if (res.success) {
      window.location.href = '/dashboard';
    } else {
      alert('削除に失敗しました: ' + res.error);
    }
  };

  const pageTitle = dbData.page.title;
  const pageDescription = dbData.page.description;
  const pageCategory = dbData.page.category;
  const authorName = dbData.page.author_name;
  const authorAvatar = dbData.page.author_avatar || '/icon.png';
  const isPro = !!dbData.page.is_pro;
  const viewsCount = dbData.page.views || 0;
  const clicksCount = (dbData.items || []).reduce((s: number, it: any) => s + (it.clicks || 0), 0) || (dbData.page.clicks || 0);
  const customBg = dbData.page.bg_color;
  const customCard = dbData.page.card_color;

  const displayItems: My5Item[] = dbData.items.map((it, idx) => ({
    id: it.id || `item-${idx}`,
    name: it.name,
    comment: it.comment,
    imageUrl: it.image_url,
    amazonUrl: it.amazon_url,
    asin: it.asin || '',
    category: it.category || 'セレクト',
    affiliateTag: dbData.page.affiliate_tag,
  }));

  return (
    <div 
      className={`theme-${activeTheme}`} 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: customBg || '#F8F9FD', 
        paddingBottom: '90px',
        transition: 'background-color 0.3s ease',
      }}
    >
      
      {/* Top Floating Controls Bar (Apple Frosted Glass) */}
      <div style={{
        position: 'sticky',
        top: 68,
        zIndex: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '10px 16px',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Back link */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }} id="back-to-home">
            <ArrowLeft size={16} />
            <span>トップへ</span>
          </Link>

          {/* Theme Quick Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            padding: '2px',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Palette size={14} /> テーマ試着:
            </span>
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                id={`switch-theme-${t.id}`}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeTheme === t.id ? '#4B7BEC' : '#FFFFFF',
                  color: activeTheme === t.id ? '#FFFFFF' : '#48484A',
                  border: activeTheme === t.id ? '1px solid #4B7BEC' : '1px solid #EAECEF',
                  boxShadow: activeTheme === t.id ? '0 2px 8px rgba(75, 123, 236, 0.3)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{t.name.split(' ')[0]}</span>
                {t.badge === 'Pro' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon name="star" size={12} fill color={activeTheme === t.id ? '#FEF3C7' : '#E85A71'} />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Share & Report Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isOwner && (
              <>
                <Link href={`/create?edit=${dbData.page.slug}`} className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 14px' }} id="owner-edit-btn">
                  編集
                </Link>
                <button onClick={handleDelete} className="btn btn-sm" style={{ fontSize: '0.8rem', padding: '6px 14px', color: '#E85A71', border: '1px solid #E85A71', background: '#fff' }} id="owner-delete-btn">
                  削除
                </button>
              </>
            )}
            <button
              onClick={() => setShowOgpModal(true)}
              className="btn btn-coral btn-sm"
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              id="open-ogp-share-btn"
            >
              <Share2 size={14} />
              <span>OGPシェア</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                color: 'var(--text-muted)',
                padding: '8px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #EAECEF',
              }}
              title="不適切コンテンツの通報"
              id="open-report-btn"
            >
              <ShieldAlert size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Page Curator Content */}
      <div className="container-narrow" style={{ paddingTop: '40px' }}>
        
        {/* Profile Header (Apple Squircle Card) */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          padding: '36px 28px',
          border: '1px solid #EAECEF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          textAlign: 'center',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Avatar with Halo */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              padding: '3px',
              background: isPro 
                ? 'linear-gradient(135deg, #4B7BEC 0%, #E85A71 100%)' 
                : '#EAECEF',
              boxShadow: isPro ? '0 6px 20px rgba(75, 123, 236, 0.25)' : 'none',
            }}>
              <img
                src={authorAvatar}
                alt={authorName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            {isPro && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#E85A71',
                color: '#fff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                <Crown size={14} />
              </div>
            )}
          </div>

          {/* Author Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
              {authorName}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              @{resolvedParams.slug}
            </span>
          </div>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.65,
            marginBottom: '16px',
          }}>
            {pageDescription}
          </p>

          {/* Category & Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="badge badge-tag" style={{ fontSize: '0.75rem' }}>
              {pageCategory}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} /> {viewsCount.toLocaleString()} views
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MousePointerClick size={14} /> {clicksCount.toLocaleString()} clicks
            </span>
          </div>
        </header>

        {/* Page Title & Philosophy */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '28px 24px',
          borderRadius: '28px',
          backgroundColor: customCard || '#FFFFFF',
          border: '1px solid #EAECEF',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#4B7BEC',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
            fontFamily: 'var(--font-en)',
          }}>
            MY CURATED 3
          </span>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            lineHeight: 1.35,
            color: customCard === '#1F2937' ? '#FFFFFF' : '#1C1C1E',
            marginBottom: '10px',
          }}>
            {pageTitle}
          </h1>
          <p style={{
            fontSize: '0.92rem',
            lineHeight: 1.65,
            color: customCard === '#1F2937' ? '#94A3B8' : 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            {pageDescription}
          </p>
        </div>

        {/* The 3 Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {displayItems.slice(0, 3).map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index}
              themeId={activeTheme}
              authorIsPro={isPro}
              cardColor={customCard}
            />
          ))}
        </div>

        {/* Banner Ad Section (Only for Free Plan) */}
        {!isPro && (
          <div style={{
            marginTop: '40px',
            padding: '24px',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              SPONSORED / ADSENSE
            </span>
            <div style={{
              padding: '20px',
              backgroundColor: '#F7F8FC',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              <p style={{ fontSize: '0.88rem', color: '#1C1C1E', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="lightbulb" size={18} color="#F59E0B" fill />
                <span>あなたも「偏愛3選」を作って、プロフィールに貼ってみませんか？</span>
              </p>
              <Link href="/create" className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
                無料で自分のMY 3を作る
              </Link>
            </div>
            <button
              onClick={() => setShowProModal(true)}
              style={{
                marginTop: '12px',
                fontSize: '0.78rem',
                color: '#E85A71',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
              id="hide-ads-upsell-btn"
            >
              ※ この広告を非表示にしたい場合はProプラン（¥480/月）へ
            </button>
          </div>
        )}

        {/* Bottom CTA for Viewers */}
        <div style={{
          marginTop: '56px',
          textAlign: 'center',
          padding: '44px 24px',
          borderRadius: '32px',
          backgroundColor: '#4B7BEC',
          color: '#FFFFFF',
          boxShadow: '0 16px 40px rgba(75, 123, 236, 0.25)',
        }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '8px' }}>
            あなただけの「偏愛3選」を作りませんか？
          </h3>
          <p style={{ fontSize: '0.88rem', opacity: 0.95, maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            厳選3アイテムを選ぶだけ。あなたのこだわりや審美眼が美しくまとまり、誰かの次の熱狂になります。
          </p>
          <Link href="/create" className="btn btn-coral" id="bottom-create-btn" style={{ minWidth: '220px' }}>
            <Sparkles size={16} />
            <span>今すぐ無料でMY 3を作成</span>
          </Link>
        </div>

      </div>

      {/* Modals */}
      {showOgpModal && (
        <CollageOGPModal
          pageData={{
            ...shapeBase,
            id: dbData.page.id,
            slug: resolvedParams.slug,
            title: pageTitle,
            description: pageDescription,
            category: pageCategory,
            items: displayItems,
            author: {
              ...shapeBase.author,
              name: authorName,
              avatarUrl: authorAvatar,
              isPro: isPro,
            }
          }}
          onClose={() => setShowOgpModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          pageTitle={pageTitle}
          pageSlug={resolvedParams.slug}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showProModal && (
        <ProModal onClose={() => setShowProModal(false)} />
      )}
    </div>
  );
}
