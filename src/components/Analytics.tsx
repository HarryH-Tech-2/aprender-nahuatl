import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';

/**
 * Google Analytics 4 with Google Consent Mode (advanced). Loads for every visitor when NEXT_PUBLIC_GA_ID is set.
 * Until the visitor accepts, analytics_storage is "denied": GA sets no cookies and sends only cookieless pings,
 * which still count the visit and feed GA4's behavioural modelling. Accepting switches cookies on; rejecting
 * keeps them off (see lib/consent.ts). Page views on client-side navigation come from enhanced measurement.
 */
export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('an.consent.v1')}catch(e){}
gtag('consent','default',{analytics_storage:c==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
