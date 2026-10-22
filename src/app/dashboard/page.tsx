'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  Crown,
  Lock,
  BarChart3,
  Pencil,
  Trash2,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import ProModal from '@/components/ProModal';
import { useAuth } from '@/lib/useAuth';
import { signInWithGoogle, signOut, fetchMyPages, deleteMy3Page, DbPage, DbItem } from '@/lib/supabase';

type MyPage = DbPage & { items: DbItem[] };

const PORTAL_URL = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || '';

export default function DashboardPage() {
  const { user, isPro, loading } = useAuth();
  const [pages, setPages] = useState<MyPage[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [showProModal, setShowProModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPagesLoading(false);
      return;
    }
    fetchMyPages(user.id).then((p) => {
      setPages(p);
      setPagesLoading(false);
    });
  }, [user]);

  const pageClicks = (p: MyPage) => p.items.reduce((s, it) => s + (it.clicks || 0), 0);
  const totalViews = pages.reduce((a, p) => a + (p.views || 0), 0);
  const totalClicks = pages.reduce((a, p) => a + pageClicks(p), 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = async (p: MyPage) => {
    if (!window.confirm(`「${p.title}」を削除します。元に戻せません。よろしいですか？`)) return;
    const res = await deleteMy3Page(p.id);
    if (res.success) setPages((prev) => prev.filter((x) => x.id !== p.id));
    else alert('削除に失敗しました: ' + res.error);
  };

  const card: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid #EAECEF',
    boxShadow: 'var(--shadow-sm)',
  };

  if (loading || (user && pagesLoading)) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>読み込み中...</div>;
  }

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ ...card, textAlign: 'center', maxWidth: '440px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '10px' }}>ログインが必要です</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
            ダッシュボードでは、あなたのMY 3の閲覧数・クリック数を確認できます。
          </p>
          <button onClick={() => signInWithGoogle()} className="btn btn-primary" id="dashboard-login-btn">
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  const maxPages = isPro ? Infinity : 3;
  const allItems = pages.flatMap((p) => p.items.map((it) => ({ ...it, pageTitle: p.title }))).sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FD', padding: '40px 0 90px' }}>
      <div className="container">
        {/* User Profile Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 24px',
          border: '1px solid #EAECEF',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user.user_metadata?.full_name || 'ユーザー'}
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1C1C1E' }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'ユーザー'}
                </span>
                {isPro ? (
                  <span className="badge badge-pro" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    <Crown size={11} /> PRO
                  </span>
                ) : (
                  <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.7rem', padding: '2px 8px' }}>
                    FREE
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              if (window.confirm('ログアウトしますか？')) {
                await signOut();
                window.location.href = '/';
              }
            }}
            className="btn btn-secondary btn-sm"
            id="mypage-logout-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#EF4444',
              borderColor: '#FCA5A5',
              padding: '8px 14px',
            }}
          >
            <LogOut size={15} />
            <span>ログアウト</span>
          </button>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-tag" style={{ fontSize: '0.75rem' }}>MY PAGE & ANALYTICS</span>
              {isPro ? (
                <span className="badge badge-pro" style={{ fontSize: '0.75rem' }}><Crown size={12} /> PRO MEMBER</span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#48484A', fontSize: '0.75rem' }}>FREE PLAN</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>マイページ</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              あなたが作成したMY 3ページの管理と、反響（閲覧数・クリック数）を確認できます。
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {isPro && PORTAL_URL && (
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" id="manage-plan-btn" style={{ display: 'flex', gap: '6px' }}>
                <Settings size={14} /> プラン管理・解約
              </a>
            )}
            <Link href="/create" className="btn btn-coral btn-sm" id="dashboard-create-btn">
              <PlusCircle size={16} />
              <span>新しいMY 3を作る</span>
            </Link>
          </div>
        </div>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>累計ページビュー（PV）</span>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#EEF3FE', color: '#4B7BEC' }}><Eye size={20} /></div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C1E', lineHeight: 1 }}>{totalViews.toLocaleString()}</div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Amazonリンクのクリック数</span>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#FDEEF0', color: '#E85A71' }}><MousePointerClick size={20} /></div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C1E', lineHeight: 1 }}>{totalClicks.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: '#2ECC71', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <TrendingUp size={16} /> クリック率 {ctr}%
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>共感・パートナー反響</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px' }}>
              あなたの偏愛リストへの関心が高まっています。反響がさらに拡大すると、公認パートナーや収益化機能のアンロック案内が届きます。
            </p>
            <div style={{ fontSize: '0.78rem', color: '#4B7BEC', fontWeight: 700 }}>
              ★ トラフィック成長中
            </div>
          </div>
        </div>

        {/* Upsell */}
        {!isPro && (
          <div style={{ background: 'linear-gradient(135deg, #FDEEF0 0%, #FAF2EB 100%)', border: '1px solid #FCD2D8', borderRadius: '24px', padding: '28px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '650px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '4px' }}>洗練された限定テーマで、あなたの世界観をさらに美しく表現しませんか？</h3>
              <p style={{ fontSize: '0.88rem', color: '#48484A', margin: 0, lineHeight: 1.55 }}>
                雑誌風・ポラロイド・ネオポップなどの限定テーマ、広告非表示、アイテム別詳細分析、ページ数無制限が解放されます。
              </p>
            </div>
            <button onClick={() => setShowProModal(true)} className="btn btn-coral" id="dashboard-upsell-pro-btn">
              Proプランの詳細を見る（¥480/月）
            </button>
          </div>
        )}

        {/* Pages */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
              公開中のMY 3一覧 ({pages.length}{isPro ? '' : '/3'} ページ)
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>無料プランは最大3つまで（Proは無制限）</span>
          </div>

          {pages.length === 0 ? (
            <div style={{ ...card, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>まだMY 3がありません。最初の1ページを作ってみましょう。</p>
              <Link href="/create" className="btn btn-primary btn-sm">MY 3を作る</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pages.map((page) => (
                <div key={page.id} style={{ ...card, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-tag" style={{ fontSize: '0.72rem' }}>{page.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>テーマ: {page.theme_id}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '6px' }}>{page.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span>{(page.views || 0).toLocaleString()} PV</span>
                      <span>{pageClicks(page).toLocaleString()} クリック</span>
                      <span>my3select.jp/p/{page.slug}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleCopy(page.slug)} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '6px' }} id={`copy-page-url-${page.id}`}>
                      {copiedSlug === page.slug ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                      <span>{copiedSlug === page.slug ? 'コピー完了' : 'URLコピー'}</span>
                    </button>
                    <Link href={`/create?edit=${page.slug}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '6px' }} id={`edit-page-${page.id}`}>
                      <Pencil size={14} /> <span>編集</span>
                    </Link>
                    <Link href={`/p/${page.slug}`} target="_blank" className="btn btn-primary btn-sm" style={{ display: 'flex', gap: '6px' }} id={`view-live-page-${page.id}`}>
                      <span>ページを見る</span> <ExternalLink size={14} />
                    </Link>
                    <button onClick={() => handleDelete(page)} className="btn btn-sm" style={{ display: 'flex', gap: '6px', color: '#E85A71', border: '1px solid #E85A71', background: '#fff' }} id={`delete-page-${page.id}`}>
                      <Trash2 size={14} /> <span>削除</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isPro && pages.length >= maxPages && (
            <p style={{ fontSize: '0.82rem', color: '#E85A71', marginTop: '10px' }}>無料プランの上限（3ページ）に達しています。追加するにはProプランが必要です。</p>
          )}
        </div>

        {/* Item analytics */}
        <div style={{ ...card, borderRadius: '28px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={22} color="#4B7BEC" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>アイテム別クリック分析（ランキング）</h2>
            </div>
            {!isPro && <span className="badge badge-pro" style={{ fontSize: '0.72rem' }}><Lock size={12} /> PRO限定詳細分析</span>}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            「どの商品が最もタップされているか」を確認し、配置順の改善に活かせます。
          </p>

          {allItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>データがまだありません。</p>
          ) : (
            <div style={{ filter: isPro ? 'none' : 'blur(4px)', opacity: isPro ? 1 : 0.4, pointerEvents: isPro ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allItems.slice(0, 10).map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '16px', background: '#F8F9FD', border: '1px solid #EAECEF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#1C1C1E', color: '#FFF', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.pageTitle}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2ECC71' }}>{(item.clicks || 0).toLocaleString()} 回</span>
                </div>
              ))}
            </div>
          )}

          {!isPro && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(3px)', padding: '24px', textAlign: 'center' }}>
              <Lock size={26} color="#E85A71" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1C1C1E', marginBottom: '6px' }}>アイテム別クリック分析はProプランで解放</h3>
              <button onClick={() => setShowProModal(true)} className="btn btn-coral btn-sm" id="unlock-analytics-btn" style={{ marginTop: '12px' }}>
                Proプランで分析を解放（¥480/月）
              </button>
            </div>
          )}
        </div>
      </div>

      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
