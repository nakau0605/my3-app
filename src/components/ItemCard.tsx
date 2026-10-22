'use client';

import React from 'react';
import { ExternalLink, Tag, ShoppingCart, Play, Headphones, Globe } from 'lucide-react';
import { My5Item, ThemeId } from '@/types';
import { buildAffiliateUrl } from '@/themes';
import { incrementItemClick } from '@/lib/supabase';

interface Props {
  item: My5Item;
  index: number;
  themeId: ThemeId;
  authorIsPro?: boolean;
  cardColor?: string;
}

function getLinkMeta(rawUrl: string, affiliateUrl: string) {
  const urlLower = (rawUrl || '').toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return {
      type: 'youtube',
      badge: 'YouTube',
      label: 'YouTubeで見る',
      url: rawUrl,
      icon: Play,
      btnStyle: {
        background: '#FF0000',
        color: '#FFFFFF',
      },
    };
  }

  if (urlLower.includes('spotify.com')) {
    return {
      type: 'spotify',
      badge: 'Spotify',
      label: 'Spotifyで聴く',
      url: rawUrl,
      icon: Headphones,
      btnStyle: {
        background: '#1DB954',
        color: '#FFFFFF',
      },
    };
  }

  const isAmazon = urlLower.includes('amazon') || urlLower.includes('amzn.to') || urlLower.includes('amzn.asia');
  if (isAmazon) {
    return {
      type: 'amazon',
      badge: 'Amazon',
      label: 'Amazonで詳細を見る',
      url: affiliateUrl,
      icon: ShoppingCart,
      btnStyle: {
        background: '#FF9900',
        color: '#111827',
      },
    };
  }

  return {
    type: 'web',
    badge: 'Web',
    label: 'リンク先を見る',
    url: rawUrl,
    icon: Globe,
    btnStyle: {
      background: '#4B7BEC',
      color: '#FFFFFF',
    },
  };
}

export default function ItemCard({ item, index, themeId, cardColor }: Props) {
  const { url: affiliateUrl } = buildAffiliateUrl(item.amazonUrl, item.affiliateTag);
  const isDarkCard = cardColor === '#1F2937' || cardColor === '#2C2623' || cardColor === '#111827';
  const meta = getLinkMeta(item.amazonUrl, affiliateUrl);
  const ActionIcon = meta.icon;

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

        {/* Media / Platform Badge */}
        <div style={{
          fontSize: '0.72rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: meta.type === 'amazon' ? '#D97706' : meta.type === 'youtube' ? '#DC2626' : meta.type === 'spotify' ? '#059669' : '#4B7BEC',
          background: meta.type === 'amazon' ? '#FEF3C7' : meta.type === 'youtube' ? '#FEE2E2' : meta.type === 'spotify' ? '#D1FAE5' : '#EEF3FE',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 700,
        }}>
          <Tag size={12} />
          <span>{meta.badge}</span>
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
        {item.imageUrl ? (
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
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>画像なし</div>
        )}
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
        {item.comment && (
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
        )}
      </div>

      {/* Action Row */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-light)',
      }}>
        {/* Dynamic Action Button */}
        <a
          href={meta.url}
          target="_blank"
          rel={meta.type === 'amazon' ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
          onClick={() => { if (item.id && !item.id.startsWith('item-')) incrementItemClick(item.id); }}
          className="btn"
          style={{
            width: '100%',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.92rem',
            fontWeight: 800,
            padding: '12px 18px',
            ...meta.btnStyle,
          }}
          id={`open-link-${item.id || index}`}
        >
          <ActionIcon size={16} />
          <span>{meta.label}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
