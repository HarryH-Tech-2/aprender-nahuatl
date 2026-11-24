'use client';
import { useSyncExternalStore } from 'react';
import { parseSignup, type StoredSignup } from './waitlist';

/** Remembers on this device that the learner already joined the waitlist, so they are not asked again. */
const KEY = 'an.signup.v1';
const INTEREST_KEY = 'an.interest.v1';

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

let cachedRaw: string | null | undefined;
let cached: StoredSignup | null = null;
function read(): StoredSignup | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parseSignup(raw);
  }
  return cached;
}

export function saveSignup(email: string) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ email, at: new Date().toISOString().slice(0, 10) }));
  } catch {
    // Storage blocked: they will be asked again next visit.
  }
  listeners.forEach((l) => l());
}

export function useSignup(): StoredSignup | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** True the first time this device asks for a given locked lesson; used to record interest once per lesson. */
export function firstInterest(lesson: number): boolean {
  try {
    const seen: unknown = JSON.parse(window.localStorage.getItem(INTEREST_KEY) ?? '[]');
    const list = Array.isArray(seen) ? seen.filter((x) => typeof x === 'number') : [];
    if (list.includes(lesson)) return false;
    window.localStorage.setItem(INTEREST_KEY, JSON.stringify([...list, lesson]));
    return true;
  } catch {
    return true;
  }
}
