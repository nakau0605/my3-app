'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Compass, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: '注目', href: '/', icon: Flame },
    { label: '探索', href: '/explore', icon: Compass },
    { label: '作る', href: '/create', icon: PlusCircle, isHighlight: true },
    { label: 'マイ解析', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="mobile-bottom-bar" style={{
      display: 'none',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'saturate(180%) blur(20px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '8px 16px calc(10px + env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isHighlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                id="mobile-nav-create"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  color: '#FFFFFF',
                  marginTop: '-22px',
                  minWidth: '64px',
                  minHeight: '64px',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E85A71 0%, #D84A61 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(232, 90, 113, 0.45)',
                  border: '3px solid #FFFFFF',
                  transition: 'transform 0.15s ease',
                }}>
                  <PlusCircle size={28} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E85A71' }}>{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                color: isActive ? '#4B7BEC' : '#8E8E93',
                padding: '6px 14px',
                borderRadius: '16px',
                minWidth: '56px',
                minHeight: '48px',
                transition: 'color 0.2s, background-color 0.2s',
                textDecoration: 'none',
                background: isActive ? 'rgba(75, 123, 236, 0.08)' : 'transparent',
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#4B7BEC' : '#8E8E93'} />
              <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 800 : 600 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
