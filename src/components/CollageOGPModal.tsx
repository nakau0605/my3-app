'use client';

import React, { useRef } from 'react';
import { X, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { My5PageData } from '@/types';

interface Props {
  pageData: My5PageData;
  onClose: () => void;
}

export default function CollageOGPModal({ pageData, onClose }: Props) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${pageData.slug}` : `https://my5.app/p/${pageData.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = `私の偏愛3選「${pageData.title}」を公開しました！ #MY3 #偏愛3選\n`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#0F172A',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
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
            padding: '8px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
          id="close-ogp-modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} color="#F59E0B" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em' }}>
            AUTO-GENERATED OGP
          </span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          動的OGPサムネイル＆SNSシェア
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          X（Twitter）等でシェアした際、3つのアイテムが自動で美しくワイドにコラージュされて表示されます。
        </p>

        {/* 3-Item Collage Preview Graphic (どう森ウィジェット風 × オーガニッククラフト) */}
        <div style={{
          width: '100%',
          aspectRatio: '1.91 / 1',
          background: 'linear-gradient(145deg, #88B2CE 0%, #6E97B1 50%, #527A93 100%)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 12px 30px rgba(45, 75, 95, 0.3)',
          position: 'relative',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Inner Widget Canvas */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FAF5EC',
            borderRadius: '18px',
            padding: '12px 16px',
            border: '2px solid #E6DCCD',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {/* OGP Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  backgroundColor: '#E76F51',
                  color: '#FAF5EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                }}>
                  3
                </div>
                <span style={{ color: '#3A2E2B', fontSize: '0.95rem', fontWeight: 900 }}>MY 3</span>
                <span style={{
                  background: '#D8F3DC',
                  border: '1px solid #B7E4C7',
                  padding: '1px 6px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  color: '#2D6A4F',
                  fontWeight: 800,
                }}>
                  偏愛コレクション
                </span>
              </div>

              <div style={{
                background: '#F1E8DC',
                border: '1.5px dashed #C8B6A2',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.68rem',
                color: '#6B5446',
                fontWeight: 700,
              }}>
                ⚓ by {pageData.author.name}
              </div>
            </div>

            {/* Title */}
            <h4 style={{
              color: '#342622',
              fontSize: '1rem',
              fontWeight: 900,
              lineHeight: 1.25,
              margin: '4px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {pageData.title}
            </h4>

            {/* 3 Items Collage Row (どう森スロット風パステル) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              alignItems: 'center',
            }}>
              {pageData.items.slice(0, 3).map((item, idx) => {
                const colors = [
                  { bg: '#EBF3F5', border: '#C5DCE3', badge: '#E07A5F' },
                  { bg: '#FCF7EC', border: '#E9DEC7', badge: '#E9C46A' },
                  { bg: '#EDF5F0', border: '#C9E2D2', badge: '#81B29A' },
                ][idx % 3];
                return (
                  <div key={item.id || idx} style={{
                    backgroundColor: colors.bg,
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{
                        background: colors.badge,
                        color: '#FAF5EC',
                        fontSize: '0.58rem',
                        fontWeight: 900,
                        padding: '1px 5px',
                        borderRadius: '6px',
                      }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: '#8E7B70' }}>✦</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#E5DCCE',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <p style={{
                      fontSize: '0.62rem',
                      color: '#3A2E2B',
                      fontWeight: 800,
                      marginTop: '4px',
                      marginBottom: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}>
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.62rem',
              color: '#8A776D',
              fontWeight: 700,
              paddingTop: '2px',
              borderTop: '1px solid #EAE1D3',
            }}>
              <span>3つのアイテムで、あなたを語る</span>
              <span>my3select.jp 🌿</span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={handleShareX}
            className="btn btn-primary"
            style={{
              flex: 1,
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            id="share-to-x-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Xでシェアする</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            id="copy-link-btn"
          >
            {copied ? <Check size={18} color="#34D399" /> : <Copy size={18} />}
            <span>{copied ? 'コピー完了！' : 'URLをコピー'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
