'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, PlusCircle, LayoutDashboard, UserCheck, Flame, Compass } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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

          <Link href="/dashboard" style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          }} id="nav-dashboard">
            <LayoutDashboard size={16} color="#8E7CC3" />
            <span>ダッシュボード</span>
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/create" className="btn btn-primary btn-sm" id="nav-btn-create" style={{ display: 'flex', gap: '6px', padding: '8px 16px' }}>
                <PlusCircle size={16} />
                <span className="nav-btn-text">MY 3を作る</span>
              </Link>

              <button
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                title="Googleアカウント（ログイン中）"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                }}
                id="nav-user-toggle"
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--color-blue)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  G
                </div>
                <UserCheck size={14} color="#2ECC71" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="btn btn-secondary btn-sm"
              id="nav-btn-login"
              style={{ display: 'flex', gap: '8px' }}
            >
              <span>ログイン</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
