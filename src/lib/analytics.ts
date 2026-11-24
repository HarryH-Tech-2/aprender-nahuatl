/** GA4 measurement ID (G-XXXXXXX). Analytics stays off when it is not set. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

type Gtag = (command: 'event', name: string, params?: Record<string, string | number | boolean>) => void;

/** Send a GA4 event. Does nothing when analytics is off or blocked. */
export function track(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', name, params);
}
