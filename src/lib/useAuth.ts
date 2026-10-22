'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, fetchMyProfile } from './supabase';

/** ログイン状態とProステータスを返すフック */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    const apply = async (u: User | null) => {
      if (!active) return;
      setUser(u);
      if (u) {
        const p = await fetchMyProfile(u.id);
        if (active) setIsPro(!!p?.is_pro);
      } else {
        setIsPro(false);
      }
      if (active) setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      apply(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isPro, loading };
}
