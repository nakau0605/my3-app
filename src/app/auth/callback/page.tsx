'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      if (!supabase) {
        router.replace('/');
        return;
      }

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error_description') || searchParams.get('error');

        if (error) {
          console.error('OAuth Callback Error:', error);
          setErrorMessage(decodeURIComponent(error));
          setTimeout(() => router.replace('/'), 3000);
          return;
        }

        // PKCE認証コードをSupabaseセッションに交換
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('exchangeCodeForSession error:', exchangeError);
            setErrorMessage('認証セッションの取得に失敗しました。');
            setTimeout(() => router.replace('/'), 3000);
            return;
          }
          if (data?.session) {
            // ログイン成功 → マイページへ遷移
            router.replace('/dashboard');
            return;
          }
        }

        // ハッシュフラグメント (#access_token=...) または既存セッションの確認
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/dashboard');
        } else {
          // 何もない場合はトップへ
          router.replace('/');
        }
      } catch (err: any) {
        console.error('Callback exception:', err);
        router.replace('/');
      }
    };

    processAuth();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8F9FD',
      fontFamily: 'sans-serif',
      padding: '20px',
    }}>
      {errorMessage ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '420px',
        }}>
          <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '8px' }}>
            ログイン処理エラー
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
            {errorMessage}
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '12px' }}>
            まもなくトップページに戻ります...
          </p>
        </div>
      ) : (
        <>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4B7BEC 0%, #E85A71 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite',
          }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '8px' }}>
            ログイン完了中...
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
            アカウント情報を確認してマイページへ移動しています。少々お待ちください。
          </p>
        </>
      )}
    </div>
  );
}
