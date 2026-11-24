import { useSyncExternalStore } from 'react';

/** The visitor's answer about analytics cookies; null until they answer. */
export type Consent = 'granted' | 'denied' | null;

const KEY = 'an.consent.v1';

export function parseConsent(raw: string | null): Consent {
  return raw === 'granted' || raw === 'denied' ? raw : null;
}

let reopened = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

function read(): Consent {
  try {
    return parseConsent(window.localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

type Gtag = (command: 'consent', action: 'update', params: Record<string, string>) => void;

/** Record the visitor's answer. Withdrawing consent also clears the Google Analytics cookies already set. */
export function setConsent(value: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the answer lasts for this visit only.
  }
  reopened = false;
  if (value === 'denied') {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    gtag?.('consent', 'update', { analytics_storage: 'denied' });
    for (const c of document.cookie.split(';')) {
      const name = c.split('=')[0].trim();
      if (name.startsWith('_ga')) {
        const host = window.location.hostname;
        document.cookie = `${name}=; Max-Age=0; path=/`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host.replace(/^www\./, '')}`;
      }
    }
  }
  notify();
}

/** Show the banner again (from the footer's "Preferencias de cookies"). */
export function reopenConsent() {
  reopened = true;
  notify();
}

/** The stored answer (null on the server and until answered). */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** True when the banner was reopened to change a previous answer. */
export function useConsentReopened(): boolean {
  return useSyncExternalStore(subscribe, () => reopened, () => false);
}
