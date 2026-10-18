'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Users, Tag, ShoppingCart } from 'lucide-react';
import { My5Item, ThemeId } from '@/types';
import { buildAffiliateUrl } from '@/themes';

interface Props {
  item: My5Item;
  index: number;
  themeId: ThemeId;
  authorIsPro?: boolean;
  cardColor?: string;
}

export default function ItemCard({ item, index, themeId, authorIsPro, cardColor }: Props) {
  const { url: affiliateUrl, appliedTag, isPlatformTag } = buildAffiliateUrl(item.amazonUrl, item.affiliateTag);
  const itemSlug = encodeURIComponent(item.name.replace(/\s+/g, '-'));
  const isDarkCard = cardColor === '#1F2937' || cardColor === '#2C2623' || cardColor === '#111827';

  return (
    <article 
      className={`card-apple theme-${themeId}`}
      style={{
        borderRadius: '28px',
        padding: '24px',
        backgroundColor: cardColor || '#FFFFFF',
        color: isDarkCard ? '#FFFFFF' : '#1C1C1E',
        border: '1px solid #EAECEF',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Top Header: Solid Number Badge & Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Black solid badge (irop style) */}
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1C1C1E',
            color: '#FFFFFF',
            fontFamily: 'var(--font-en)',
            fontWeight: 900,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}>
            {index + 1}
          </div>

          {item.category && (
            <span className="badge badge-tag" style={{ fontSize: '0.72rem' }}>
              {item.category}
            </span>
          )}
        </div>

        {/* Affiliate Tag Badge */}
        <div style={{
          fontSize: '0.72rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: isPlatformTag ? 'var(--text-muted)' : '#2ECC71',
          background: isPlatformTag ? '#F2F4F8' : '#EBF9F1',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 700,
        }} title={isPlatformTag ? '運営公式サポートID適用中' : 'ユーザー自身のアソシエイトID適用中'}>
          <Tag size={12} />
          <span>{isPlatformTag ? '公式リンク' : '公認パートナー'}</span>
        </div>
      </div>

      {/* Main Image in Capsule / Oval Shape */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 11',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#F8F9FD',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>

      {/* Item Title & Passionate One-Word Review */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: isDarkCard ? '#FFFFFF' : '#1C1C1E',
          lineHeight: 1.4,
        }}>
          {item.name}
        </h3>

        {/* The "One-word Passionate Review" */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '16px',
          backgroundColor: isDarkCard ? '#111827' : '#F7F8FC',
          borderLeft: '4px solid #4B7BEC',
        }}>
          <p style={{
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: isDarkCard ? '#E2E8F0' : '#2C3E50',
            margin: 0,
            fontWeight: 500,
          }}>
            「{item.comment}」
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-light)',
      }}>
        {/* Amazon Purchase Button */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-amazon"
          style={{
            width: '100%',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.92rem',
          }}
          id={`buy-amazon-${item.id || index}`}
        >
          <ShoppingCart size={16} />
          <span>Amazonで詳細・価格を見る</span>
          <ExternalLink size={14} />
        </a>

        {/* Item-Centric Cross-Link */}
        <Link
          href={`/items/${item.asin || itemSlug}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            padding: '6px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#4B7BEC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          id={`cross-link-${item.id || index}`}
        >
          <Users size={14} />
          <span>このアイテムをMY 3に入れている他の人を見る</span>
        </Link>
      </div>
    </article>
  );
}
