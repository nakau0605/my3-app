'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      router.push('/');
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        router.push('/');
      }
    });

    // 3秒経過しても遷移しない場合はトップへ
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
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
        ログイン処理中...
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
        Googleアカウントの認証を確認しています。少々お待ちください。
      </p>
    </div>
  );
}
