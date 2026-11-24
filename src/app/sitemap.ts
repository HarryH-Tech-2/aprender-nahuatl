import type { MetadataRoute } from 'next';
import { LESSONS } from '@/content/lessons';
import { SITE_URL, TOOLS } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', '/curso', ...LESSONS.map((l) => `/curso/${l.slug}`), '/guia', '/frases',
    '/herramientas', ...TOOLS.map((t) => t.href), '/palabra-del-dia',
    '/juegos', '/juegos/memorama', '/juegos/lluvia',
    '/acerca', '/contacto', '/privacidad', '/terminos',
  ];
  const lastModified = new Date('2026-11-24');
  return paths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : p.startsWith('/curso') || p === '/guia' || p === '/frases' ? 0.9 : 0.6,
  }));
}
