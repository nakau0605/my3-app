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

        {/* 3-Item Collage Preview Graphic */}
        <div style={{
          width: '100%',
          aspectRatio: '1.91 / 1',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #311042 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          position: 'relative',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* OGP Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: 'var(--brand-gradient)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}>MY 3</span>
                <span style={{ color: '#E2E8F0', fontSize: '0.8rem', fontWeight: 600 }}>
                  @{pageData.author.handle}
                </span>
              </div>
              <h4 style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                lineHeight: 1.3,
                maxWidth: '420px',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              }}>
                {pageData.title}
              </h4>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 10px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              fontSize: '0.7rem',
              color: '#fff',
              fontWeight: 700,
            }}>
              偏愛3選
            </div>
          </div>

          {/* 3 Items Collage Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            alignItems: 'center',
            marginTop: '12px',
          }}>
            {pageData.items.slice(0, 3).map((item, idx) => (
              <div key={item.id || idx} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '-4px',
                  background: '#0F172A',
                  color: '#38BDF8',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #38BDF8',
                }}>
                  {idx + 1}
                </div>
                <div style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#F1F5F9',
                }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <p style={{
                  fontSize: '0.65rem',
                  color: '#0F172A',
                  fontWeight: 700,
                  marginTop: '4px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '8px',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.7)',
          }}>
            my5.app/@{pageData.author.handle}
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
