'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  Flame, 
  ArrowRight, 
  Crown, 
  Filter, 
  Sparkles, 
  Layers,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { THEMES } from '@/themes';
import { fetchRecentMy3Pages } from '@/lib/supabase';

interface ExplorePageItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  themeId: keyof typeof THEMES;
  views: number;
  clicks: number;
  createdAt: string;
  items: Array<{ id: string; name: string; comment: string; imageUrl: string }>;
  author: { name: string; avatarUrl: string; handle: string; isPro: boolean };
}

export default function ExplorePage() {
  const [allPages, setAllPages] = useState<ExplorePageItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchRecentMy3Pages(100).then((rows) => {
      setAllPages(
        rows.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          category: p.category,
          themeId: (THEMES[p.theme_id as keyof typeof THEMES] ? p.theme_id : 'sleek') as keyof typeof THEMES,
          views: p.views || 0,
          clicks: (p.items || []).reduce((s, it) => s + (it.clicks || 0), 0),
          createdAt: p.created_at,
          items: (p.items || []).map((it) => ({ id: it.id, name: it.name, comment: it.comment, imageUrl: it.image_url })),
          author: { name: p.author_name, avatarUrl: p.author_avatar || '/icon.png', handle: p.slug, isPro: !!p.is_pro },
        }))
      );
      setLoaded(true);
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'views' | 'clicks'>('recommended');

  const categories = [
    'ALL',
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

  const filteredPages = useMemo(() => {
    return allPages.filter((page) => {
      // Category filter
      if (selectedCategory !== 'ALL' && page.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = page.title.toLowerCase().includes(query);
        const inDesc = page.description.toLowerCase().includes(query);
        const inAuthor = page.author.name.toLowerCase().includes(query);
        const inItems = page.items.some(
          it => it.name.toLowerCase().includes(query) || it.comment.toLowerCase().includes(query)
        );
        return inTitle || inDesc || inAuthor || inItems;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'clicks') return b.clicks - a.clicks;
      return 0; // recommended default
    });
  }, [allPages, selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FD', padding: '36px 0 100px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-tag" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              <Compass size={16} /> DISCOVER ALL CURATIONS
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#1C1C1E', marginBottom: '12px' }}>
            みんなの <span style={{ color: '#4B7BEC' }}>偏愛3選</span> を探索
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            「注目のMY 3」だけでなく、サウナ、ガジェット、キャンプ、料理、推し活、読書など、<br />
            さまざまな趣味とこだわりを持つ一般ユーザーのリストを自由に見つけられます。
          </p>
        </div>

        {/* Search & Filter Toolbar (Apple HIG Clean Bar) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px 24px',
          border: '1px solid #EAECEF',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Top Search Input & Sort Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            {/* Search Input */}
            <div style={{
              flex: 1,
              minWidth: '240px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={18} color="#8E8E93" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="気になるキーワード、アイテム名、キュレーター名で検索..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  borderRadius: 'var(--radius-pill)',
                  background: '#F8F9FD',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.92rem',
                  color: '#1C1C1E',
                }}
                id="explore-search-input"
              />
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={16} color="#48484A" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-pill)',
                  background: '#F8F9FD',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1C1C1E',
                  cursor: 'pointer',
                }}
                id="explore-sort-select"
              >
                <option value="recommended">おすすめ順</option>
                <option value="views">閲覧数が多い順</option>
                <option value="clicks">クリック数が多い順</option>
                <option value="newest">新着順</option>
              </select>
            </div>
          </div>

          {/* Horizontal Scrolling Category Pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedCategory === cat ? '#4B7BEC' : '#F8F9FD',
                  color: selectedCategory === cat ? '#FFFFFF' : '#48484A',
                  border: selectedCategory === cat ? '1px solid #4B7BEC' : '1px solid #E2E8F0',
                  boxShadow: selectedCategory === cat ? '0 2px 8px rgba(75, 123, 236, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                id={`explore-cat-${cat}`}
              >
                {cat === 'ALL' ? 'すべてのジャンル' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            該当する偏愛リスト: <strong style={{ color: '#1C1C1E' }}>{filteredPages.length}</strong> 件
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ fontSize: '0.8rem', color: '#E85A71', textDecoration: 'underline' }}
            >
              検索条件をクリア
            </button>
          )}
        </div>

        {/* 5-Item Collage Cards Grid (All Pages) */}
        {filteredPages.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}>
            {filteredPages.map((page) => (
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
                    background: 'rgba(255, 255, 255, 0.92)',
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
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category & Pro */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
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
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#1C1C1E',
                      lineHeight: 1.45,
                      marginBottom: '8px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4B7BEC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1C1C1E';
                    }}
                    >
                      {page.title}
                    </h3>
                  </Link>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '18px',
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
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-light)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={page.author.avatarUrl}
                        alt={page.author.name}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>
                          {page.author.name}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                          @{page.author.handle}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/p/${page.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      id={`explore-view-btn-${page.id}`}
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
            border: '1px solid #EAECEF',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '8px' }}>
              {loaded ? '該当する偏愛3選がまだありません' : '読み込み中...'}
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              別のキーワードを試すか、あなた自身の「偏愛3選」を投稿してみませんか？
            </p>
            <Link href="/create" className="btn btn-coral">
              <span>MY 3を新しく作成する</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
