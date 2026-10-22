'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, PlusCircle, LayoutDashboard, UserCheck, Flame, Compass, LogOut } from 'lucide-react';
import { supabase, signInWithGoogle, signOut } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    // 初回ユーザー取得
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 認証状態の変化をリスン
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert('Googleログインに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'saturate(180%) blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      transition: 'background-color 0.3s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Brand Logo in irop & Apple style */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} id="nav-logo">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4B7BEC 0%, #E85A71 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 900,
            fontSize: '1.2rem',
            fontFamily: 'var(--font-en)',
            boxShadow: '0 4px 12px rgba(75, 123, 236, 0.25)',
          }}>
            3
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontWeight: 900,
                fontSize: '1.3rem',
                letterSpacing: '-0.02em',
                color: '#1C1C1E',
                fontFamily: 'var(--font-en)',
              }}>
                MY 3
              </span>
              <span className="badge badge-tag" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                BETA
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1, fontWeight: 500 }}>
              偏愛3選が、誰かの買い物になる
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }} className="nav-desktop-links">
          <Link href="/#ranking" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          }} id="nav-ranking">
            <Flame size={16} color="#E85A71" />
            <span>注目のMY 3</span>
          </Link>

          <Link href="/explore" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          }} id="nav-explore">
            <Compass size={16} color="#4B7BEC" />
            <span>みんなのMY 3</span>
          </Link>

          <Link href="/#features" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            transition: 'color 0.2s',
          }} id="nav-features">
            特徴
          </Link>

          <Link href="/#plans" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            transition: 'color 0.2s',
          }} id="nav-plans">
            料金プラン
          </Link>

          <Link href="/mypage" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          }} id="nav-dashboard">
            <LayoutDashboard size={16} color="#8E7CC3" />
            <span>マイページ</span>
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/create" className="btn btn-primary btn-sm" id="nav-btn-create" style={{ display: 'flex', gap: '6px', padding: '8px 16px' }}>
            <PlusCircle size={16} />
            <span className="nav-btn-text">MY 3を作る</span>
          </Link>

          {user ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/mypage"
                className="btn btn-secondary btn-sm"
                id="nav-btn-mypage"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                <LayoutDashboard size={14} color="#8E7CC3" />
                <span>マイページ</span>
              </Link>

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '999px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
                id="nav-user-menu-btn"
                title="アカウントメニュー"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.user_metadata?.full_name || 'ユーザー'}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.user_metadata?.full_name || 'マイページ'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #E2E8F0',
                  minWidth: '200px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>ログイン中のアカウント</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/mypage"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#334155',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#F8F9FD',
                    }}
                  >
                    <LayoutDashboard size={16} color="#8E7CC3" />
                    マイページ（管理画面）
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#EF4444',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <LogOut size={16} />
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              id="nav-btn-google-login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#1E293B',
              }}
            >
              {/* Google G Logo SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{loading ? '接続中...' : 'Googleでログイン'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
