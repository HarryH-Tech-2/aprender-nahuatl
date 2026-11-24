import type { MetadataRoute } from 'next';
import { LESSONS } from '@/content/lessons';
import { SITE_URL, TOOLS } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/curso', ...LESSONS.map((l) => `/curso/${l.slug}`),
    '/herramientas', ...TOOLS.map((t) => t.href), '/palabra-del-dia',
    '/juegos', '/juegos/memorama', '/juegos/lluvia',
    '/acerca', '/contacto', '/privacidad', '/terminos',
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : p.startsWith('/curso') ? 0.9 : 0.6 }));
}
