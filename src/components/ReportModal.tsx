'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

import { submitContactMessage } from '@/lib/supabase';

interface Props {
  pageTitle: string;
  pageSlug?: string;
  onClose: () => void;
}

export default function ReportModal({ pageTitle, pageSlug, onClose }: Props) {
  const [reason, setReason] = useState('copyright');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const res = await submitContactMessage({
      kind: 'report:' + reason,
      page_slug: pageSlug,
      message: `対象: ${pageTitle}\n${details || '(詳細なし)'}`,
    });
    setSending(false);
    if (res.success) setSubmitted(true);
    else setError('送信に失敗しました。時間をおいて再度お試しください。');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#0F172A',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
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
          id="close-report-modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34D399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              通報を受け付けました
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              ご協力ありがとうございます。運営チームにてコンテンツ内容を精査し、利用規約やガイドラインに違反している場合は速やかに非公開等の措置を実施いたします。
            </p>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginBottom: '8px' }}>
              <ShieldAlert size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                CONTENT REPORT
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              不適切なコンテンツの通報
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              対象ページ: 「<strong style={{ color: '#fff' }}>{pageTitle}</strong>」
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '8px' }}>
                通報の理由
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
                id="report-reason-select"
              >
                <option value="copyright" style={{ background: '#0F172A' }}>著作権・肖像権の侵害（画像の無断転載等）</option>
                <option value="spam" style={{ background: '#0F172A' }}>スパム・詐欺・不正アフィリエイト行為</option>
                <option value="inappropriate" style={{ background: '#0F172A' }}>公序良俗に反する・成人向けコンテンツ</option>
                <option value="misleading" style={{ background: '#0F172A' }}>虚偽情報・誤認を招く悪質な記載</option>
                <option value="other" style={{ background: '#0F172A' }}>その他</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '8px' }}>
                具体的な詳細・問題箇所
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="問題となるアイテムや規約違反の内容をご記入ください..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  resize: 'none',
                }}
                id="report-details-textarea"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                キャンセル
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1, background: '#DC2626' }}
                disabled={sending}
                id="submit-report-btn"
              >
                {sending ? '送信中...' : '通報を送信'}
              </button>
            </div>
            {error && <p style={{ color: '#F87171', fontSize: '0.8rem', marginTop: '10px' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
