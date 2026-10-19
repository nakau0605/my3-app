'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, CheckCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '一般のお問い合わせ',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('すべての必須項目を入力してください。');
      return;
    }
    setLoading(true);

    // 簡易送信完了シミュレーション（将来的なAPI連携に対応）
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FD' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 16px 80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              color: '#4B7BEC',
              fontWeight: 700,
              marginBottom: '24px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            トップページに戻る
          </Link>

          {/* Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EEF3FE',
                  color: '#4B7BEC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                  お問い合わせ・通報窓口
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>
                  サービスに関するご質問、ご要望、不適切コンテンツの通報はこちらから承ります。
                </p>
              </div>
            </div>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '16px',
                  border: '1px solid #BBF7D0',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
                  送信が完了しました
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#15803D', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
                  お問い合わせいただきありがとうございます。内容を確認のうえ、必要に応じて運営事務局よりご連絡いたします。
                </p>
                <Link
                  href="/"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    backgroundColor: '#4B7BEC',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  トップページへ戻る
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    お問い合わせ種別 <span style={{ color: '#E85A71' }}>*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FD',
                      fontSize: '0.9rem',
                      color: '#1C1C1E',
                    }}
                  >
                    <option value="一般のお問い合わせ">一般のお問い合わせ</option>
                    <option value="機能へのご要望・改善提案">機能へのご要望・改善提案</option>
                    <option value="不適切なコンテンツ・著作権侵害の通報">不適切なコンテンツ・著作権侵害の通報</option>
                    <option value="提携・タイアップに関するお問い合わせ">提携・タイアップに関するお問い合わせ</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    お名前（またはニックネーム） <span style={{ color: '#E85A71' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="山田 太郎"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FD',
                      fontSize: '0.9rem',
                      color: '#1C1C1E',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    メールアドレス <span style={{ color: '#E85A71' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FD',
                      fontSize: '0.9rem',
                      color: '#1C1C1E',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    お問い合わせ内容 <span style={{ color: '#E85A71' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="詳細な内容や、通報の場合は対象URLをご記入ください。"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FD',
                      fontSize: '0.9rem',
                      color: '#1C1C1E',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: '#4B7BEC',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    boxShadow: '0 8px 20px rgba(75, 123, 236, 0.25)',
                  }}
                >
                  <Send size={18} />
                  <span>{loading ? '送信中...' : '送信する'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
