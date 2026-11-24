import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';

/**
 * Google Analytics 4. Loads only when NEXT_PUBLIC_GA_ID is set (so never in local development by default).
 * Page views on client-side navigation are picked up by GA4's enhanced measurement (browser history events).
 */
export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
