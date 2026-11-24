/**
 * Analytics configuration.
 *
 * - GTM_ID: Google Tag Manager container. GA4 is configured inside the container (a "Google tag" with the
 *   property's G- measurement ID). This is what the live site uses.
 * - GA_ID: optional direct GA4 measurement ID, used only when there is no GTM container.
 *
 * Analytics runs only on the production deployment (Vercel sets NEXT_PUBLIC_VERCEL_ENV=production), so local
 * development and preview deployments never send data. Set NEXT_PUBLIC_ANALYTICS_FORCE=1 to test it elsewhere.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WQ6ZGHMT';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const ANALYTICS_ON =
  (Boolean(GTM_ID) || Boolean(GA_ID)) &&
  (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_FORCE === '1');

type Gtag = (command: 'event', name: string, params?: Record<string, string | number | boolean>) => void;

/**
 * Send a custom event. With Tag Manager it becomes a dataLayer event (trigger: Custom Event with the same name);
 * with a bare GA4 tag it is a gtag event. Does nothing when analytics is off or blocked.
 */
export function track(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined' || !ANALYTICS_ON) return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };
  if (GTM_ID) {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: name, ...params });
  } else {
    w.gtag?.('event', name, params);
  }
}
