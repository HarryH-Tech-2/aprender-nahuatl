'use client';
import { useSyncExternalStore } from 'react';
import { emptyProgress, parseProgress, type Progress } from './progress';

/** Progress lives in localStorage; this tiny store keeps React in sync with it. */
const KEY = 'an.progress.v1';
const EMPTY = emptyProgress();
let state: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): Progress {
  try {
    return parseProgress(JSON.parse(window.localStorage.getItem(KEY) ?? 'null'));
  } catch {
    return emptyProgress();
  }
}

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  state = read();
  // Another tab changed the progress: pick it up, so this tab never saves a stale copy over it.
  window.addEventListener('storage', (e) => {
    if (e.key !== null && e.key !== KEY) return;
    state = read();
    listeners.forEach((l) => l());
  });
}

export function getProgress(): Progress {
  load();
  return state;
}

export function setProgress(next: Progress | ((p: Progress) => Progress)) {
  load();
  state = typeof next === 'function' ? next(state) : next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: keep going with in-memory progress.
  }
  listeners.forEach((l) => l());
}

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribeProgress, getProgress, () => EMPTY);
}

const noop = () => () => {};
/** False on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

let seed = 0;
const getSeed = () => (seed ||= 1 + Math.floor(Math.random() * 1e9));
/** A random number that stays the same for this visit (0 on the server). Used to shuffle answers. */
export function useSessionSeed(): number {
  return useSyncExternalStore(noop, getSeed, () => 0);
}
