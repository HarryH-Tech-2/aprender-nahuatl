'use client';
import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { useConsent } from '@/lib/consent';

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set AND the visitor accepted analytics cookies.
 * Until then no Google script is requested at all. Page views on client-side navigation are picked up by
 * GA4's enhanced measurement (browser history events).
 */
export function Analytics() {
  const consent = useConsent();
  if (!GA_ID || consent !== 'granted') return null;
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
