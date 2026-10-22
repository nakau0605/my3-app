import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.my3select.jp';
  const staticRoutes = ['', '/explore', '/create', '/terms', '/privacy', '/tokushoho', '/contact'].map((p) => ({
    url: base + p,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.5,
  }));

  let pages: MetadataRoute.Sitemap = [];
  if (supabase) {
    const { data } = await supabase.from('pages').select('slug, created_at').order('created_at', { ascending: false }).limit(5000);
    pages = (data || []).map((p: any) => ({
      url: `${base}/p/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }
  return [...staticRoutes, ...pages];
}
