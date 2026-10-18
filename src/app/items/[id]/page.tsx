'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ExternalLink, Sparkles, ShoppingCart, Tag } from 'lucide-react';
import { MOCK_PAGES } from '@/data/mockData';
import { My5Item, My5PageData } from '@/types';
import { buildAffiliateUrl } from '@/themes';

export default function ItemCrossConnectionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const targetQuery = decodeURIComponent(resolvedParams.id);

  // 対象アイテムを検索
  let foundItem: My5Item | undefined;
  const matchingPages: { page: My5PageData; item: My5Item }[] = [];

  for (const page of MOCK_PAGES) {
    for (const item of page.items) {
      const matchAsin = item.asin && item.asin.toUpperCase() === targetQuery.toUpperCase();
      const matchSlug = item.name.replace(/\s+/g, '-').toLowerCase() === targetQuery.toLowerCase();
      const matchPartial = item.name.toLowerCase().includes(targetQuery.toLowerCase());

      if (matchAsin || matchSlug || matchPartial) {
        if (!foundItem) foundItem = item;
        matchingPages.push({ page, item });
      }
    }
  }

  // フォールバック（見つからない場合はサンプル最初のアイテムを使用）
  const displayItem = foundItem || MOCK_PAGES[0].items[4]; // AirPods Pro
  const relatedPages = matchingPages.length > 0 ? matchingPages : [
    { page: MOCK_PAGES[0], item: displayItem },
    { page: MOCK_PAGES[3], item: displayItem },
  ];

  const { url: affiliateUrl } = buildAffiliateUrl(displayItem.amazonUrl);

  return (
    <div style={{ minHeight: '100vh', padding: '36px 0 80px' }}>
      <div className="container-narrow">
        {/* Back Link */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }} id="back-from-item">
          <ArrowLeft size={16} />
          <span>トップへ戻る</span>
        </Link>

        {/* Item Header Hero */}
        <div className="card-glass" style={{
          padding: '28px',
          borderRadius: '24px',
          marginBottom: '36px',
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            flexShrink: 0,
            boxShadow: 'var(--shadow-md)',
          }}>
            <img
              src={displayItem.imageUrl}
              alt={displayItem.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-tag" style={{ fontSize: '0.7rem' }}>
                {displayItem.category || '注目アイテム'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} /> {relatedPages.length}人のMY 3に登録中
              </span>
            </div>

            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: 1.4 }}>
              {displayItem.name}
            </h1>

            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-amazon btn-sm"
              style={{ display: 'inline-flex', gap: '6px' }}
              id="item-hero-amazon-btn"
            >
              <ShoppingCart size={14} />
              <span>Amazonで見る</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Section: Who has this in their MY 3 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} color="#A855F7" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              このアイテムを偏愛するキュレーターたち
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            同じアイテムを選んだユーザーの「他の2選」をチェックして、趣味の合う人を見つけよう。
          </p>
        </div>

        {/* Curators List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {relatedPages.map(({ page, item }, idx) => (
            <div
              key={idx}
              className="card-glass"
              style={{
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href={`/p/${page.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={page.author.avatarUrl}
                    alt={page.author.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid var(--border-subtle)',
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {page.author.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      @{page.author.handle}
                    </span>
                  </div>
                </Link>

                <Link href={`/p/${page.slug}`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                  この人のMY 3を見る
                </Link>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px 14px',
                borderRadius: '10px',
                borderLeft: '3px solid #6366F1',
              }}>
                <p style={{ fontSize: '0.85rem', color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
                  「{item.comment}」
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
              }}>
                <span>掲載リスト:</span>
                <Link href={`/p/${page.slug}`} style={{ color: '#818CF8', textDecoration: 'underline' }}>
                  {page.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
