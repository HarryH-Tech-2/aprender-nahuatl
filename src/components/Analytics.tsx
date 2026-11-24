import Script from 'next/script';
import { ANALYTICS_ON, GA_ID, GTM_ID } from '@/lib/analytics';

/**
 * Google Consent Mode defaults, set before any Google script runs. Until the visitor accepts,
 * analytics_storage is "denied": no analytics cookies, only cookieless pings that still count the visit.
 * Advertising signals are always denied (the site shows no ads).
 */
const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('an.consent.v1')}catch(e){}
gtag('consent','default',{analytics_storage:c==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`;

/** Google Tag Manager (or a bare GA4 tag when no container is configured), with Consent Mode. */
export function Analytics() {
  if (!ANALYTICS_ON) return null;
  if (GTM_ID) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`${CONSENT_DEFAULTS}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    );
  }
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`${CONSENT_DEFAULTS}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}

/** Tag Manager's fallback for visitors without JavaScript; goes right after <body>. */
export function AnalyticsNoScript() {
  if (!ANALYTICS_ON || !GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager"
      />
    </noscript>
  );
}
