import type { Metadata, Viewport } from 'next';
import { Alfa_Slab_One, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';
import { AppStateProvider } from '@/components/AppState';
import { PendingCheckout } from '@/components/PendingCheckout';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VariantChooser } from '@/components/VariantChooser';
import { SignInDialog } from '@/components/SignInDialog';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { Analytics, AnalyticsNoScript } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';

// Display: a heavy slab that echoes the thick ink outlines of the codices.
const display = Alfa_Slab_One({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-display', display: 'swap' });
// Body: built for letter-by-letter legibility, which matters when every tl, tz and h counts.
const body = Atkinson_Hyperlegible({ weight: ['400', '700'], subsets: ['latin', 'latin-ext'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Aprende náhuatl gratis: curso interactivo en español', template: `%s | ${SITE_NAME}` },
  description:
    'Curso interactivo y gratuito para aprender náhuatl desde cero, en español de México. Ocho lecciones, náhuatl central y de la Huasteca, juegos y herramientas.',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: SITE_NAME,
    images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'Ilustración de Tenochtitlan al estilo de los códices' }],
  },
  twitter: { card: 'summary_large_image' },
  // Search Console HTML-tag verification (not needed if the domain is verified by DNS).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = { themeColor: '#f6e8c9' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-MX" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <AnalyticsNoScript />
        <a href="#contenido" className="btn btn-sm sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50">
          Saltar al contenido
        </a>
        <AppStateProvider>
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
          <VariantChooser />
          <SignInDialog />
          <PendingCheckout />
          <CookieBanner />
        </AppStateProvider>
        <Analytics />
      </body>
    </html>
  );
}
