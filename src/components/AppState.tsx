'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { emptyProgress, type Progress } from '@/lib/progress';
import { getProgress, setProgress, subscribeProgress, useHydrated, useProgress } from '@/lib/store';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';
import { reconcile } from '@/lib/sync';
import type { Variant } from '@/lib/variant';

export type Account = { id: string; email: string | null; name: string | null; plan: string };

type AppState = {
  progress: Progress;
  /** The variant in use; `central` until the learner chooses. */
  variant: Variant;
  /** False until the learner has picked a variant. */
  hasChosenVariant: boolean;
  hydrated: boolean;
  setVariant: (v: Variant) => void;
  update: (fn: (p: Progress) => Progress) => void;
  accountsEnabled: boolean;
  account: Account | null;
  /** True when the last attempt to save to the account failed. */
  syncFailed: boolean;
  retrySync: () => void;
  /** Resolves to false when the sign-out did not go through. Pass false to skip the final save (after deleting the account). */
  signOut: (save?: boolean) => Promise<boolean>;
  signInOpen: boolean;
  openSignIn: (open: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}

const SAVE_DELAY = 1200;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [account, setAccount] = useState<Account | null>(null);
  const [syncFailed, setSyncFailed] = useState(false);
  const [signInOpen, openSignIn] = useState(false);

  /** The signed-in user this device is syncing for; null when signed out. */
  const userId = useRef<string | null>(null);
  const userName = useRef<string | null>(null);
  /** True while sync itself is writing local progress, so that write does not schedule another sync. */
  const applying = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const running = useRef<Promise<void> | null>(null);

  /**
   * Bring this device and the account to the same progress: read the account, merge, write whichever
   * side is behind. Safe to call at any time; does nothing when signed out, and never writes when the
   * read fails or the user changed while a request was in flight.
   */
  const sync = useCallback(async (): Promise<void> => {
    if (running.current) await running.current;
    const run = (async () => {
      const supabase = getSupabase();
      const id = userId.current;
      if (!supabase || !id) return;
      const read = await supabase.from('profiles').select('plan, progress, display_name').eq('id', id).maybeSingle();
      if (userId.current !== id) return;
      if (read.error) {
        setSyncFailed(true);
        return;
      }
      const { writeLocal, writeRemote } = reconcile(getProgress(), { ok: true, progress: read.data?.progress ?? null });
      if (writeLocal) {
        applying.current = true;
        setProgress(writeLocal);
        applying.current = false;
      }
      const row = read.data;
      if (row) setAccount((a) => (a && a.id === id ? { ...a, plan: row.plan ?? 'free', name: row.display_name ?? a.name } : a));
      if (!writeRemote && row) {
        setSyncFailed(false);
        return;
      }
      const latest = getProgress();
      const write = row
        ? await supabase.from('profiles').update({ progress: latest, variant: latest.variant }).eq('id', id)
        : await supabase.from('profiles').insert({ id, display_name: userName.current, progress: latest, variant: latest.variant });
      if (userId.current !== id) return;
      setSyncFailed(Boolean(write.error));
    })();
    running.current = run;
    try {
      await run;
    } finally {
      if (running.current === run) running.current = null;
    }
  }, []);

  // Follow the Supabase session.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        const had = userId.current;
        userId.current = null;
        clearTimeout(timer.current);
        setAccount(null);
        setSyncFailed(false);
        // Signed out here, in another tab, or by an expired session: leave nothing of that
        // account on a shared device, but remember the chosen variant.
        if (had) setProgress((p) => ({ ...emptyProgress(), variant: p.variant }));
        return;
      }
      if (userId.current === user.id) return;
      userId.current = user.id;
      userName.current = (user.user_metadata?.full_name as string | undefined) ?? null;
      setAccount({
        id: user.id,
        email: user.email ?? null,
        name: userName.current,
        plan: 'free',
      });
      // Deferred so Supabase is never called from inside its own auth callback.
      setTimeout(() => void sync(), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [sync]);

  // Save to the account shortly after each change made on this device (or in another tab).
  useEffect(() => {
    return subscribeProgress(() => {
      if (!userId.current || applying.current) return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void sync(), SAVE_DELAY);
    });
  }, [sync]);

  const update = useCallback((fn: (p: Progress) => Progress) => setProgress(fn), []);
  const setVariant = useCallback((v: Variant) => setProgress((p) => ({ ...p, variant: v })), []);
  const retrySync = useCallback(() => void sync(), [sync]);

  const signOut = useCallback(async (save = true): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) return true;
    // Flush anything not yet saved, then end the session on this device.
    clearTimeout(timer.current);
    if (save) await sync();
    await supabase.auth.signOut({ scope: 'local' });
    const { data } = await supabase.auth.getSession();
    // The device's progress is cleared by the auth listener once the session is really gone.
    return !data.session;
  }, [sync]);

  const value = useMemo<AppState>(
    () => ({
      progress,
      variant: progress.variant ?? 'central',
      hasChosenVariant: progress.variant !== null,
      hydrated,
      setVariant,
      update,
      accountsEnabled: supabaseConfigured,
      account,
      syncFailed,
      retrySync,
      signOut,
      signInOpen,
      openSignIn,
    }),
    [progress, hydrated, setVariant, update, account, syncFailed, retrySync, signOut, signInOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
