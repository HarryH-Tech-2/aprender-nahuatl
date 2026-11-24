'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { emptyProgress, mergeProgress, parseProgress, type Progress } from '@/lib/progress';
import { getProgress, setProgress, subscribeProgress, useHydrated, useProgress } from '@/lib/store';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';
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
  signOut: () => Promise<void>;
  signInOpen: boolean;
  openSignIn: (open: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [account, setAccount] = useState<Account | null>(null);
  const [signInOpen, openSignIn] = useState(false);
  const syncedFor = useRef<string | null>(null);

  // Account: on sign-in, merge this device's progress with the account's, then keep saving.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        syncedFor.current = null;
        setAccount(null);
        return;
      }
      if (syncedFor.current === user.id) return;
      syncedFor.current = user.id;
      const name = (user.user_metadata?.full_name as string | undefined) ?? null;
      // Deferred so we never call Supabase from inside its own auth callback.
      setTimeout(async () => {
        const { data: row } = await supabase.from('profiles').select('plan, progress, display_name').eq('id', user.id).maybeSingle();
        const merged = mergeProgress(getProgress(), parseProgress(row?.progress));
        setProgress(merged);
        await supabase.from('profiles').upsert({
          id: user.id,
          display_name: row?.display_name ?? name,
          variant: merged.variant,
          progress: merged,
        });
        setAccount({ id: user.id, email: user.email ?? null, name: row?.display_name ?? name, plan: row?.plan ?? 'free' });
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Save to the account shortly after each change.
  const accountId = account?.id;
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !accountId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeProgress(() => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        // Never write after sign-out (signing out resets this device's progress).
        const { data } = await supabase.auth.getSession();
        if (data.session?.user.id !== accountId) return;
        const p = getProgress();
        await supabase.from('profiles').update({ progress: p, variant: p.variant }).eq('id', accountId);
      }, 1200);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [accountId]);

  const update = useCallback((fn: (p: Progress) => Progress) => setProgress(fn), []);
  const setVariant = useCallback((v: Variant) => setProgress((p) => ({ ...p, variant: v })), []);
  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
    // Leave nothing of this account on a shared device, but remember the chosen variant.
    setProgress((p) => ({ ...emptyProgress(), variant: p.variant }));
  }, []);

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
      signOut,
      signInOpen,
      openSignIn,
    }),
    [progress, hydrated, setVariant, update, account, signOut, signInOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
