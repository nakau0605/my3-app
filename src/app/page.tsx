'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Check, 
  Heart, 
  ShoppingCart, 
  ExternalLink,
  Crown,
  Zap,
  Layers,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Share2,
  Compass,
  Search,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { MOCK_PAGES } from '@/data/mockData';
import { THEMES } from '@/themes';
import { My5PageData, ThemeId } from '@/types';
import ProModal from '@/components/ProModal';
import Icon from '@/components/Icon';
import { fetchRecentMy3Pages } from '@/lib/supabase';

export default function HomePage() {
  const [showProModal, setShowProModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('すべて');
  const [dbPages, setDbPages] = useState<My5PageData[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadPages() {
      try {
        const pages = await fetchRecentMy3Pages(20);
        if (isMounted && pages.length > 0) {
          const mapped: My5PageData[] = pages.map((p) => {
            const validTheme: ThemeId = (p.theme_id && THEMES[p.theme_id as ThemeId])
              ? (p.theme_id as ThemeId)
              : 'minimal';

            return {
              id: p.id,
              slug: p.slug,
              title: p.title,
              description: p.description || '',
              category: p.category || '総合',
              themeId: validTheme,
              views: p.views || 0,
              clicks: p.clicks || 0,
              createdAt: p.created_at,
              customColors: {
                backgroundColor: p.bg_color,
                cardColor: p.card_color,
              },
              author: {
                name: p.author_name || 'クリエイター',
                handle: p.slug,
                avatarUrl: p.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                bio: p.description || '',
                isPro: p.is_pro || false,
              },
              items: (p.items || []).map((it, idx) => ({
                id: it.id || `item-${idx}`,
                name: it.name,
                comment: it.comment || '',
                imageUrl: it.image_url,
                amazonUrl: it.amazon_url,
                asin: it.asin || '',
                category: it.category || 'セレクト',
              })),
            };
          });
          setDbPages(mapped);
        }
      } catch (err) {
        console.error('Failed to load recent pages from Supabase', err);
      }
    }
    loadPages();
    return () => { isMounted = false; };
  }, []);

  const categories = [
    'すべて',
    'ガジェット & ワーク',
    'サウナ & ウェルネス',
    '暮らし & カフェ',
    '推し活 & ライフ',
    'キャンプ & アウトドア',
    '料理 & グルメ',
    '美容 & スキンケア',
    '本 & カルチャー',
    '旅行 & ライフ',
    '健康 & ワーク',
  ];

  // DBの新規投稿とモックデータをマージ（DBの最新投稿が一番上に表示される）
  const combinedPages = [
    ...dbPages,
    ...MOCK_PAGES.filter(mp => !dbPages.some(dp => dp.slug === mp.slug)),
  ];

  // 編集部厳選の「注目のMY 3」（トップ4件）
  const featuredPages = combinedPages.slice(0, 4);

  // 全投稿（注目のMY 3以外の投稿も含め、検索・ジャンルに対応）
  const allFilteredPages = combinedPages.filter((page) => {
    const matchesCategory = activeCategoryFilter === 'すべて' || page.category === activeCategoryFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesTitle = page.title.toLowerCase().includes(q);
    const matchesDesc = page.description.toLowerCase().includes(q);
    const matchesAuthor = page.author.name.toLowerCase().includes(q) || page.author.handle.toLowerCase().includes(q);
    const matchesItems = page.items.some(
      (item) => item.name.toLowerCase().includes(q) || item.comment.toLowerCase().includes(q) || (item.category?.toLowerCase() || '').includes(q)
    );

    return matchesCategory && (matchesTitle || matchesDesc || matchesAuthor || matchesItems);
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>

      {/* =========================================================================
          HERO SECTION (irop.jp style with Sky Blue & Vertical Text & Organic Curves)
          ========================================================================= */}
      <section style={{
        backgroundColor: '#4B7BEC',
        color: '#FFFFFF',
        padding: '50px 0 90px',
        position: 'relative',
        overflow: 'hidden',
        borderBottomLeftRadius: '48px',
        borderBottomRightRadius: '48px',
      }}>
        {/* Background Decorative Rings */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '40px',
            alignItems: 'center',
          }} className="hero-grid">

            {/* Vertical Japanese Editorial Text (irop.jp signature style) */}
            <div className="vertical-text" style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)',
              color: '#FFFFFF',
              height: '380px',
              fontFamily: 'var(--font-sans)',
              textShadow: '0 2px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 2.2,
              letterSpacing: '0.28em',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ display: 'inline-block' }}>偏愛の３選が</span>
              <span style={{ display: 'inline-block' }}>誰かの買い物になる</span>
            </div>

            {/* Hero Main Graphic & Pitch */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              
              {/* Central Oval Frame with 3 Curated Items (irop capsule look) */}
              <div style={{
                width: '100%',
                maxWidth: '520px',
                borderRadius: '160px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '40px 32px 46px',
                boxShadow: '0 20px 50px rgba(47, 85, 164, 0.35)',
                color: '#1C1C1E',
                position: 'relative',
              }}>
                <h1 style={{
                  fontSize: 'clamp(1.45rem, 2.6vw, 1.95rem)',
                  fontWeight: 900,
                  lineHeight: 1.38,
                  letterSpacing: '-0.02em',
                  marginBottom: '28px',
                  color: '#1C1C1E',
                }}>
                  3つ選ぶだけで、<br />
                  <span style={{ color: '#E85A71' }}>あなただけのセレクトショップ</span>が完成。
                </h1>

                {/* 3-Item Miniature Preview Large Cards */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '32px',
                }}>
                  {MOCK_PAGES[0].items.slice(0, 3).map((item, i) => (
                    <div key={item.id} style={{
                      width: 'clamp(88px, 22vw, 116px)',
                      height: 'clamp(102px, 24vw, 130px)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                      border: '3px solid #FFFFFF',
                      backgroundColor: '#F3F4F6',
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: 'rgba(28, 28, 30, 0.75)',
                        color: '#FFFFFF',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        zIndex: 2,
                      }}>
                        {i + 1}
                      </div>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>

                {/* CTA inside Oval */}
                <Link
                  href="/create"
                  className="btn btn-coral"
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    margin: '0 auto',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    padding: '16px 28px',
                    borderRadius: '40px',
                    boxShadow: '0 10px 24px rgba(232, 90, 113, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  id="hero-create-btn"
                >
                  <Sparkles size={20} />
                  <span>無料でMY3を作成</span>
                  <ArrowRight size={20} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1. 注目のMY 5 (TODAY'S PICKUP - 編集部厳選のトップ4)
          ========================================================================= */}
      <section id="ranking" style={{ padding: '64px 0 40px', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Flame size={20} color="#E85A71" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#E85A71', letterSpacing: '0.05em', fontFamily: 'var(--font-en)' }}>
                  FEATURED PICKUPS
                </span>
              </div>
              <h2 className="section-header-en" style={{ margin: 0, fontSize: '2.1rem' }}>
                注目の <span style={{ color: '#4B7BEC' }}>MY 3</span>
              </h2>
              <p className="section-header-jp">
                運営アルゴリズムが選んだニッチで熱量あふれる一般ユーザーの偏愛3選
              </p>
            </div>

          </div>

          {/* 3-Item Collage Cards Grid (注目の4件) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {featuredPages.map((page, rankIdx) => (
              <div
                key={page.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* 3-item collage header */}
                <Link href={`/p/${page.slug}`} style={{ display: 'block', position: 'relative' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    height: '150px',
                    gap: '2px',
                    backgroundColor: '#F1F4F9',
                    overflow: 'hidden',
                  }}>
                    {page.items.slice(0, 3).map((item, idx) => (
                      <div key={item.id} style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '6px',
                          left: '6px',
                          background: 'rgba(28, 28, 30, 0.75)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-en)',
                        }}>
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ranking / Pick Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: rankIdx === 0 ? '#E85A71' : '#1C1C1E',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Flame size={12} />
                    <span>PICK #{rankIdx + 1}</span>
                  </div>

                  {/* Theme Badge Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.72rem',
                    color: '#1C1C1E',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                    テーマ: {THEMES[page.themeId].name.split(' ')[0]}
                  </div>
                </Link>

                {/* Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-tag" style={{ fontSize: '0.72rem' }}>
                      {page.category}
                    </span>
                    {page.author.isPro && (
                      <span className="badge badge-pro" style={{ fontSize: '0.65rem' }}>
                        <Crown size={12} /> PRO
                      </span>
                    )}
                  </div>

                  <Link href={`/p/${page.slug}`}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#1C1C1E',
                      lineHeight: 1.45,
                      marginBottom: '8px',
                      transition: 'color 0.2s',
                    }}>
                      {page.title}
                    </h3>
                  </Link>

                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {page.description}
                  </p>

                  {/* Author Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-light)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={page.author.avatarUrl}
                        alt={page.author.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>
                          {page.author.name}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                          @{page.author.handle}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/p/${page.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      id={`view-card-btn-${page.id}`}
                    >
                      <span>3選を見る</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. みんなのMY 3（注目のMY 3以外の投稿も自由に探索・検索）
          ========================================================================= */}
      <section id="all-curations" style={{
        padding: '50px 0 90px',
        backgroundColor: '#F7F8FC',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container">
          
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={22} color="#4B7BEC" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4B7BEC', letterSpacing: '0.05em', fontFamily: 'var(--font-en)' }}>
                EXPLORE ALL POSTS
              </span>
            </div>
            
            <div>
              <h2 className="section-header-en" style={{ margin: 0, fontSize: '2.1rem' }}>
                みんなの <span style={{ color: '#E85A71' }}>MY 3</span>
              </h2>
              <p className="section-header-jp">
                ソロキャンプ、調味料、スキンケア、本棚、旅道具など、厳選3選の偏愛リストをチェック！
              </p>
            </div>
          </div>

          {/* Search Box (Touch & Mobile Friendly) */}
          <div style={{
            position: 'relative',
            marginBottom: '20px',
            maxWidth: '680px',
          }}>
            <Search size={20} color="#8E8E93" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="アイテム名、ブランド、キーワードで検索（例: キャンプ、調味料、HHKB、姿勢）"
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '48px',
                paddingRight: '16px',
                borderRadius: '16px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
              }}
              id="top-explore-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#EAECEF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                }}
              >
                <Icon name="close" size={14} color="#666" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '28px',
            WebkitOverflowScrolling: 'touch',
          }}>
            {categories.map((cat) => {
              const isSelected = activeCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    background: isSelected ? '#1C1C1E' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#48484A',
                    border: isSelected ? '1px solid #1C1C1E' : '1px solid #EAECEF',
                    boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minHeight: '38px',
                  }}
                  id={`all-filter-${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results Count & Current Active Filter Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            <div>
              <span>該当投稿: </span>
              <strong style={{ color: '#1C1C1E', fontSize: '1rem' }}>{allFilteredPages.length}</strong> 件
              {activeCategoryFilter !== 'すべて' && (
                <span style={{ marginLeft: '8px', color: '#4B7BEC' }}>
                  ({activeCategoryFilter})
                </span>
              )}
              {searchQuery && (
                <span style={{ marginLeft: '8px', color: '#E85A71' }}>
                  「{searchQuery}」の検索結果
                </span>
              )}
            </div>
            {(activeCategoryFilter !== 'すべて' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategoryFilter('すべて');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4B7BEC',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                フィルターをリセット
              </button>
            )}
          </div>

          {/* Cards Grid: ALL 10 Curations Displayed */}
          {allFilteredPages.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {allFilteredPages.map((page) => (
                <div
                  key={page.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #EAECEF',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* 3-item collage header */}
                  <Link href={`/p/${page.slug}`} style={{ display: 'block', position: 'relative' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      height: '150px',
                      gap: '2px',
                      backgroundColor: '#F1F4F9',
                      overflow: 'hidden',
                    }}>
                      {page.items.slice(0, 3).map((item, idx) => (
                        <div key={item.id} style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            left: '6px',
                            background: 'rgba(28, 28, 30, 0.75)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-en)',
                          }}>
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Theme Badge Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      color: '#1C1C1E',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}>
                      テーマ: {THEMES[page.themeId].name.split(' ')[0]}
                    </div>
                  </Link>

                  {/* Content */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-tag" style={{ fontSize: '0.72rem' }}>
                        {page.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {page.author.isPro && (
                          <span className="badge badge-pro" style={{ fontSize: '0.65rem' }}>
                            <Crown size={12} /> PRO
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {page.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    <Link href={`/p/${page.slug}`}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#1C1C1E',
                        lineHeight: 1.45,
                        marginBottom: '8px',
                        transition: 'color 0.2s',
                      }}>
                        {page.title}
                      </h3>
                    </Link>

                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {page.description}
                    </p>

                    {/* Author Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-light)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={page.author.avatarUrl}
                          alt={page.author.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>
                            {page.author.name}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                            @{page.author.handle}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/p/${page.slug}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      >
                        <span>3選を見る</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px dashed #D1D5DB',
            }}>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '8px' }}>
                該当するMY 3が見つかりませんでした
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                検索ワードを変えるか、フィルターをリセットしてお試しください。
              </p>
              <button
                onClick={() => {
                  setActiveCategoryFilter('すべて');
                  setSearchQuery('');
                }}
                className="btn btn-primary btn-sm"
              >
                フィルターをリセット
              </button>
            </div>
          )}

          {/* Explore Hub Callout Banner */}
          <div style={{
            marginTop: '40px',
            padding: '28px',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '4px' }}>
                あなたも偏愛3選を公開してみませんか？
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                AmazonアソシエイトURLを貼るだけで、3分であなたのマイページが完成します。
              </p>
            </div>
            <Link href="/create" className="btn btn-coral">
              <Sparkles size={18} />
              <span>無料でMY 3を作成する</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ABOUT SECTION (irop.jp style with Fuchsia/Coral Pink & Organic Shape)
          ========================================================================= */}
      <section style={{
        backgroundColor: '#E85A71',
        color: '#FFFFFF',
        padding: '90px 0 110px',
        position: 'relative',
        borderTopLeftRadius: '56px',
        borderTopRightRadius: '56px',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
            gap: '48px',
            alignItems: 'center',
          }} className="about-grid">
            
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-en)', fontWeight: 800, fontSize: '1.8rem', display: 'block' }}>
                  About
                </span>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.9 }}>
                  MY 3 とは
                </span>
              </div>

              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 900,
                lineHeight: 1.35,
                marginBottom: '24px',
              }}>
                あなたの偏愛3選を、<br />
                誰かに届けるための場所。
              </h2>

              <div style={{ fontSize: '0.92rem', lineHeight: 1.8, opacity: 0.95, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p>
                  有名なインフルエンサーの真似をする必要はありません。<br />
                  本当に毎日使っているもの、お金をかけてよかったもの。そんな等身大の「偏愛」こそが、誰かにとって最も信頼できる買い物情報になります。
                </p>
                <p>
                  複雑なアフィリエイト設定やブログのメンテナンスはすべてシステムに任せて、<br />
                  あなたはお気に入りの3つを選ぶだけ。
                </p>
              </div>

              <div style={{ marginTop: '36px' }}>
                <Link href="/create" className="btn btn-secondary" style={{ backgroundColor: '#FFFFFF', color: '#E85A71' }}>
                  <span>今すぐ無料で偏愛をキュレーションする</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Colorful Curator Avatar Tiles (irop signature graphic grid) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              {[
                { label: 'ガジェット', bg: '#4B7BEC', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                { label: 'サウナー', bg: '#B87B44', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                { label: '珈琲器具', bg: '#8E7CC3', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
                { label: '推し活', bg: '#F7B731', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
                { label: 'デスク環境', bg: '#2ECC71', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80' },
                { label: 'ミニマリスト', bg: '#2F55A4', img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=200&q=80' },
              ].map((tile, i) => (
                <div key={i} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '12px',
                  textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    margin: '0 auto 8px',
                    overflow: 'hidden',
                    border: '2px solid #FFFFFF',
                  }}>
                    <img src={tile.img} alt={tile.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURES SECTION (irop.jp style with Warm Camel & 3 Oval Pillars)
          ========================================================================= */}
      <section id="features" style={{
        backgroundColor: '#B87B44',
        color: '#FFFFFF',
        padding: '90px 0 110px',
        position: 'relative',
        borderTopLeftRadius: '56px',
        borderTopRightRadius: '56px',
        marginTop: '-36px',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontFamily: 'var(--font-en)', fontWeight: 800, fontSize: '2.2rem', display: 'block' }}>
              Features
            </span>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', opacity: 0.9 }}>
              MY 3 の特徴
            </span>
          </div>

          {/* 3 Oval Cards (irop.jp signature pill shape) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {/* Feature 01 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '240px',
                borderRadius: '120px',
                aspectRatio: '1 / 1.35',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                marginBottom: '24px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80"
                  alt="Amazon URL Scrape"
                  style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-en)', fontSize: '1.25rem', fontWeight: 800, opacity: 0.8 }}>
                01
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>
                URLを貼るだけ自動取得
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '280px' }}>
                Amazonリンクを貼り付けるだけで画像と商品名を自動取得。短縮URL（amzn.to）にも完全対応。
              </p>
            </div>

            {/* Feature 02 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '240px',
                borderRadius: '120px',
                aspectRatio: '1 / 1.35',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                marginBottom: '24px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
                  alt="1-Tap Theme Switching"
                  style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-en)', fontSize: '1.25rem', fontWeight: 800, opacity: 0.8 }}>
                02
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>
                1タップ着せ替え
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '280px' }}>
                雑誌風、ポラロイド、ネオポップなど、完成されたモダンテーマをワンタップで反映できます。
              </p>
            </div>

            {/* Feature 03 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '240px',
                borderRadius: '120px',
                aspectRatio: '1 / 1.35',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                marginBottom: '24px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80"
                  alt="Automated Monetization"
                  style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-en)', fontSize: '1.25rem', fontWeight: 800, opacity: 0.8 }}>
                03
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>
                アフィリエイトID自動補完
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '280px' }}>
                自身のアソシエイトIDはもちろん、空欄でも運営IDが自動補完され、規約違反やリンク切れゼロ。
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          USER STEPS (irop.jp style with Sky Blue & Alternating Oval Rows)
          ========================================================================= */}
      <section style={{
        backgroundColor: '#4B7BEC',
        color: '#FFFFFF',
        padding: '90px 0 110px',
        position: 'relative',
        borderTopLeftRadius: '56px',
        borderTopRightRadius: '56px',
        marginTop: '-36px',
      }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontFamily: 'var(--font-en)', fontWeight: 800, fontSize: '2.2rem', display: 'block' }}>
              User Steps
            </span>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', opacity: 0.9 }}>
              ご利用の流れ
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '24px 28px',
            }}>
              <div style={{
                width: '100px',
                height: '70px',
                borderRadius: '35px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                flexShrink: 0,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80"
                  alt="Step 1"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                  STEP 01
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 4px' }}>
                  Amazonから5つの偏愛アイテムを選ぶ
                </h3>
                <p style={{ fontSize: '0.82rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
                  URLをコピーして貼るだけ。画像と商品名が自動でセットされます。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '24px 28px',
            }}>
              <div style={{
                width: '100px',
                height: '70px',
                borderRadius: '35px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                flexShrink: 0,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80"
                  alt="Step 2"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                  STEP 02
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 4px' }}>
                  熱い一言コメント ＆ テーマ着せ替え
                </h3>
                <p style={{ fontSize: '0.82rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
                  なぜこれが好きなのかを一言添え、好みのテーマを1タップで選びます。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '24px 28px',
            }}>
              <div style={{
                width: '100px',
                height: '70px',
                borderRadius: '35px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                flexShrink: 0,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=200&q=80"
                  alt="Step 3"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                  STEP 03
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 4px' }}>
                  SNSプロフィールに貼って収益化
                </h3>
                <p style={{ fontSize: '0.82rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
                  自動生成された美しいOGP画像とともにXやインスタでシェア。購入されたら紹介料が発生します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRICING PLANS (Apple HIG Clean Squircle Cards)
          ========================================================================= */}
      <section id="plans" style={{ padding: '90px 0 100px', backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="section-header-en">Pricing Plans</h2>
            <p className="section-header-jp">プランのご案内</p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              まずは無料から。月1〜2個売れればProプラン代は簡単にペイできます。
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}>
            {/* Free Plan */}
            <div style={{
              borderRadius: '28px',
              padding: '36px 28px',
              border: '1px solid var(--border-card)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <span className="badge" style={{ backgroundColor: '#F2F4F8', color: '#48484A', marginBottom: '14px' }}>
                  FREE
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '6px' }}>
                  無料プラン
                </h3>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '16px' }}>
                  ¥0 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ 永久無料</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  まずは手軽に自分の偏愛3選を公開してみたい方に最適。
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px' }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 最大 3 ページまで作成可能
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px' }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 自身のアソシエイト設定可能
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px' }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 標準テーマ利用可能
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px' }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> ページ全体の累計PV数表示
                  </li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#E85A71' }}>●</span> ページ内に運営バナー広告が表示されます
                  </li>
                </ul>
              </div>

              <Link href="/create" className="btn btn-secondary" style={{ width: '100%' }}>
                無料で始める
              </Link>
            </div>

            {/* Pro Plan */}
            <div style={{
              borderRadius: '28px',
              padding: '36px 28px',
              border: '2px solid #E85A71',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 16px 40px rgba(232, 90, 113, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '28px',
                background: '#E85A71',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(232, 90, 113, 0.3)',
              }}>
                おすすめ
              </div>

              <div>
                <span className="badge badge-pro" style={{ marginBottom: '14px' }}>
                  <Crown size={12} /> PRO PLAN
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '6px' }}>
                  プレミアムプラン
                </h3>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#E85A71', marginBottom: '16px' }}>
                  ¥480 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ 月（税込）</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  デザインを整えて購入率を高め、本格的に収益化したい方へ。
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px', fontWeight: 700 }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 作成ページ数「無制限」
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px', fontWeight: 700 }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 雑誌風・ポラロイド等全テーマ使い放題
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px', fontWeight: 700 }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> ページ内広告の「完全非表示」
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px', fontWeight: 700 }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> アイテム別詳細クリック分析
                  </li>
                  <li style={{ fontSize: '0.88rem', color: '#1C1C1E', display: 'flex', gap: '8px', fontWeight: 700 }}>
                    <Check size={18} color="#2ECC71" strokeWidth={3} /> 背景色・アクセントカラーの自由変更
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowProModal(true)}
                className="btn btn-coral"
                style={{ width: '100%' }}
                id="home-pricing-pro-btn"
              >
                Proプランを試す（¥480/月）
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Modal */}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .vertical-text {
            writing-mode: horizontal-tb !important;
            height: auto !important;
            text-align: center !important;
            margin-bottom: 20px;
          }
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
