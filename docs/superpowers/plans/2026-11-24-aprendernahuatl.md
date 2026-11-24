# aprendernahuatl.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free, Mexican-Spanish website that teaches Central and Huasteca Nahuatl through an 8-lesson interactive course, tools and games, with optional accounts.

**Architecture:** Next.js App Router site. All course content is typed data in the repo; every Nahuatl string carries both variants. Progress is local-first (`localStorage`) and syncs to one Supabase `profiles` row per user when signed in. Pure logic (numbers, calendar, answer checking, progress merge) lives in `src/lib` with unit tests; pages are thin.

**Tech Stack:** Next.js (App Router, TypeScript, `src/`), Tailwind CSS v4, Vitest, `@supabase/supabase-js` + `@supabase/ssr`, Vercel hosting. Images generated with Higgsfield (Harry's instruction, 2026-11-24 — supersedes the spec's "original SVG drawings" for the day-sign glyphs and adds hero/section art).

**Spec:** `docs/superpowers/specs/2026-11-24-aprendernahuatl-design.md`

## Global Constraints

- All UI and teaching text in Mexican Spanish, tú form; `lang="es-MX"`.
- Variant ids exactly `central` and `huasteca`; default `central`.
- Every lesson `access: 'free'` in v1; `canAccess(profile, lesson)` is the only gate.
- Site fully usable when `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are absent (sign-in UI hidden).
- No analytics, no payments, no store, no free-text translator, no audio playback (optional `audio?: string` field only).
- "Contenido en revisión" note visible site-wide (footer) and on lesson pages.
- Never `git push`, deploy, or submit to search engines. Local commits only.
- No copying of the reference site's text or images.
- Tonalpohualli anchor: Gregorian 1521-08-23 = 1 Coatl (Caso).
- Number tool range: 1–7,999.

## Review Focus

1. Corrupt or old-shape `localStorage` progress → site loads with empty progress, never crashes.
2. Typed answers with different case, accents, trailing punctuation or extra spaces → accepted.
3. Switching variant mid-course → progress shown is that variant's own; nothing lost from the other.
4. Birth dates before 1521, leap days, and today → correct sign, no off-by-one from time zones.
5. Number input of 0, negatives, decimals, text, > 7,999 → friendly Spanish message, no crash.

Tests for 1 and 3 live in Task 4; 2, 4, 5 in Task 2.

---

## File map

```
src/app/                      routes (see spec "Pages")
src/components/               Header, Footer, VariantSwitch, VariantChooser, SignWheel, Greca,
                              lesson/ (Player + one file per exercise type), games/, tools/
src/content/types.ts          content types
src/content/signs.ts          the 20 day-signs
src/content/lessons/NN-slug.ts   one per lesson; index.ts exports LESSONS
src/content/pronunciacion.ts, toponimos.ts, nahuatlismos.ts
src/lib/variant.ts numbers.ts tonalpohualli.ts answers.ts daily.ts
        dictionary.ts progress.ts access.ts supabase.ts
src/lib/*.test.ts             unit tests
supabase/migrations/0001_profiles.sql
public/img/                   Higgsfield images
```

### Task 1: Scaffold, theme and shell

**Files:** project root via `create-next-app`; `src/app/layout.tsx`, `globals.css`, `src/components/{Header,Footer,Greca}.tsx`, `vitest.config.ts`.

- [ ] Scaffold Next.js (TypeScript, Tailwind, App Router, `src/`, no Turbopack flags needed) into the existing repo without deleting `docs/`; add Vitest with `npm test` = `vitest run`.
- [ ] Theme tokens in `globals.css`: amate `#f1e4c8`, ink `#1b1410`, basalt `#26221f`, cochineal `#b3261e`, turquoise `#1a8f8a`, maize `#e2a620`, jade `#2f7d4f`. Load the frontend-design skill before styling. Display + body fonts via `next/font`.
- [ ] `Greca` = repeating step-fret SVG divider. Header and Footer per spec (footer carries the "contenido en revisión" note).
- [ ] Verify: `npm run build` succeeds. Commit.

### Task 2: Pure logic

**Files:** `src/lib/{variant,numbers,tonalpohualli,answers,daily}.ts` + tests.

**Produces:**
```ts
// variant.ts
export type Variant = 'central' | 'huasteca';
export type V = string | { central: string; huasteca: string };
export function pick(v: V, variant: Variant): string;
// numbers.ts
export type NumberResult = { ok: true; words: string; parts: { value: number; words: string }[];
  glyphs: { feathers: number; flags: number; dots: number } } | { ok: false; error: string };
export function toNahuatl(input: string | number, variant: Variant): NumberResult;
// tonalpohualli.ts
export function tonalli(year: number, month: number, day: number): { number: number; signIndex: number }; // signIndex 0..19, 0 = Cipactli
// answers.ts
export function normalize(s: string): string;
export function isCorrect(given: string, accepted: string[]): boolean;
// daily.ts
export function dailyIndex(dateISO: string, length: number): number;
```

- [ ] Tests first, then implement. Assertions that pin the spec:
  - `toNahuatl(1,'central').words === 'ce'`; 11 → `mahtlactli once`; 15 → `caxtolli`; 20 → `cempohualli`; 35 → `cempohualli oncaxtolli`; 40 → `ompohualli`; 100 → `macuilpohualli`; 400 → `centzontli`; 421 → `centzontli ipan cempohualli once`; 7999 ok; glyphs for 421 = `{feathers:1, flags:1, dots:1}`.
  - Huasteca joins with `huan`: 11 → `mahtlactli huan ce`; 21 → `cempohualli huan ce`.
  - `0`, `-3`, `2.5`, `'abc'`, `8000`, `''` → `ok:false` with a Spanish message.
  - `tonalli(1521,8,23)` → `{number:1, signIndex:4}` (Coatl); `tonalli(1521,8,24)` → `{number:2, signIndex:5}`; 260 days later equals the anchor; `tonalli(1500,2,29)` does not throw; results identical regardless of process time zone (use `Date.UTC` day counts).
  - `isCorrect(' Tlazohcamati! ', ['tlazohcamati'])`, `isCorrect('PIALLI', ['pialli'])`, `isCorrect('cuálli', ['cualli'])` true; `isCorrect('', ['x'])` false.
  - `dailyIndex` is stable for a date and within `[0,length)`.
- [ ] Number algorithm: units 1–19 built on 5/10/15 bases with `on-`/`om-` (om before vowel-initial `ome`, `ei`→`omei`; `on` otherwise; `ommahtlactli`), multiples of 20 as `<n>pohualli` using combining stems (cem, om, e/ex[huasteca], nauh, macuil, chicuacem, chicom, chicue, chiucnauh, mahtlac, mahtlactli once…, caxtol), 400s as `<n>tzontli`; levels joined by `ipan` (central) / `huan` (huasteca).
- [ ] `npm test` passes. Commit.

### Task 3: Content

**Files:** `src/content/types.ts`, `signs.ts`, `lessons/*.ts`, `pronunciacion.ts`, `toponimos.ts`, `nahuatlismos.ts`, `src/lib/dictionary.ts`, `src/content/content.test.ts`.

**Produces:**
```ts
export type Word = { id: string; nah: V; es: string; note?: string; audio?: string };
export type Step =
  | { type: 'info'; title: string; body: string; examples?: { nah: V; es: string }[] }
  | { type: 'choice'; prompt: string; nah?: V; options: V[]; answer: number; explain?: string }
  | { type: 'match'; pairs: { nah: V; es: string }[] }
  | { type: 'build'; prompt: string; pieces: V[]; answer: number[]; result: V; explain?: string }
  | { type: 'order'; prompt: string; words: V[]; answer: number[] }
  | { type: 'type'; prompt: string; accepted: { central: string[]; huasteca: string[] }; explain?: string }
  | { type: 'blank'; sentence: V; options: V[]; answer: number; es: string };
export type Lesson = { n: number; slug: string; sign: string; title: string; subtitle: string;
  intro: string; minutes: number; access: 'free' | 'member'; vocab: Word[]; steps: Step[] };
export const LESSONS: Lesson[];            // 8
export const SIGNS: { n: number; nah: string; es: string; meaning: string; img: string }[]; // 20
export function dictionary(): Word[];      // all lesson vocab, de-duplicated by id
```

- [ ] Write the 8 lessons per the spec's syllabus table: 20–30 steps each, 10–15 vocab words each, all six exercise types used across the course, `build` in lessons 2–7. Central after Launey/Karttunen without macrons; Huasteca after IDIEZ spelling. Where unsure of a Huasteca form, prefer forms shared with Central and say so in `note`.
- [ ] `pronunciacion.ts` 18 entries; `toponimos.ts` ≈80; `nahuatlismos.ts` ≈100.
- [ ] `content.test.ts`: 8 lessons, slugs unique, every `answer` index in range, every `build`/`order` answer is a permutation subset of its pieces, every `type` step has ≥1 accepted answer per variant, every lesson has ≥20 steps and `access==='free'`, 20 signs.
- [ ] Tests pass. Commit.

### Task 4: Progress, variant state, access

**Files:** `src/lib/{progress,access}.ts` + tests, `src/components/{AppState,VariantChooser,VariantSwitch}.tsx`.

**Produces:**
```ts
export type VariantProgress = { completed: string[]; best: Record<string, number>;
  known: string[]; games: Record<string, number> };
export type Progress = { v: 1; variant: Variant | null; central: VariantProgress; huasteca: VariantProgress;
  streak: { current: number; longest: number; last: string | null } };
export function emptyProgress(): Progress;
export function parseProgress(raw: unknown): Progress;          // never throws
export function mergeProgress(a: Progress, b: Progress): Progress;
export function completeLesson(p: Progress, variant: Variant, slug: string, score: number, todayISO: string): Progress;
export function isUnlocked(p: Progress, variant: Variant, lessonN: number): boolean; // n===1 or previous completed
export function canAccess(profile: { plan: string } | null, lesson: { access: 'free' | 'member' }): boolean;
// AppState.tsx: <AppStateProvider>, useAppState(): { progress, variant, setVariant, update(fn), user, signOut }
```

- [ ] Tests: `parseProgress` of `null`, `'garbage'`, `{v:0}`, and a partial object all return valid progress; merge = union of `completed`/`known`, max of `best`/`games`/streak `longest`; completing in `central` leaves `huasteca` untouched; streak increments on consecutive days, resets after a gap, unchanged on same day; `isUnlocked` chain; `canAccess(null,{access:'free'})` true, `canAccess({plan:'free'},{access:'member'})` false.
- [ ] `AppStateProvider` loads from `localStorage` key `an.progress.v1` after mount, saves on change. `VariantChooser` modal shows when `variant === null` on course/lesson/tool pages (not blocking the home page read); "No sé, elige por mí" → `central`.
- [ ] Tests pass. Commit.

### Task 5: Course pages and lesson player

**Files:** `src/app/curso/page.tsx`, `curso/[slug]/page.tsx`, `curso/[slug]/jugar/page.tsx`, `src/components/SignWheel.tsx`, `src/components/lesson/*`.

- [ ] `SignWheel`: 20 signs on a ring (Sun-Stone style); states done / next / locked / próximamente (9–20); links to lesson intro.
- [ ] Lesson intro page: server-rendered, indexable; title, intro, vocabulary table in the current variant, "Empezar" button.
- [ ] Player: one step at a time, progress bar, check → feedback (correct / shows right answer + `explain`) → continue; wrong steps re-queued once at the end; score = first-try correct / gradable steps; on finish call `completeLesson`, show summary, next-lesson link, and sign-up invitation when signed out and Supabase is configured. Locked lessons redirect to `/curso`.
- [ ] Verify in browser: complete lesson 1 end to end in both variants. Commit.

### Task 6: Tools

**Files:** `src/app/{pronunciacion,numeros,tu-signo,toponimos,nahuatlismos,diccionario,palabra-del-dia}/page.tsx`, `src/components/tools/*`.

- [ ] Each page: server-rendered explanatory copy + client widget. Numbers shows words, breakdown, SVG glyphs (dot = 1, flag = 20, feather = 400; bars not used). Tu signo shows number + sign + meaning + a shareable card (Web Share API with copy-link fallback) and names the Caso correlation. Pronunciation self-test stores `known` in progress.
- [ ] Verify each in browser. Commit.

### Task 7: Games

**Files:** `src/app/juegos/{page,memorama/page,lluvia/page}.tsx`, `src/components/games/*`.

- [ ] Vocabulary pool = vocab of completed lessons, falling back to lesson 1 if none. Memorama: 8 pairs, counts moves, best score saved. Lluvia: words fall, pick one of 3 meanings, 3 lives, speed rises, high score saved. Respect `prefers-reduced-motion` (lluvia becomes timed cards).
- [ ] Verify in browser. Commit.

### Task 8: Accounts

**Files:** `src/lib/supabase.ts`, `supabase/migrations/0001_profiles.sql`, `src/app/cuenta/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/api/delete-account/route.ts`, `src/components/SignInDialog.tsx`, `.env.example`, `README.md`.

- [ ] `supabaseConfigured: boolean` and `getSupabase()` (browser client or `null`).
- [ ] Migration: `profiles(id uuid pk references auth.users on delete cascade, display_name text, variant text, plan text not null default 'free', progress jsonb not null default '{}', created_at timestamptz default now())`; RLS select/insert/update own row; trigger rejecting changes to `plan` unless `service_role`.
- [ ] Sign-in dialog: Google and email magic link. On sign-in: fetch row, `mergeProgress(local, remote)`, upsert; afterwards debounce-save progress on change.
- [ ] `/cuenta`: name, variant, progress summary, sign out, delete account (server route using `SUPABASE_SERVICE_ROLE_KEY`, verifying the caller's session).
- [ ] README: local run, env vars, Vercel + Supabase Marketplace steps, Google OAuth, Namecheap DNS records for Vercel (A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`, or as Vercel's domain screen instructs).
- [ ] Verify: with no env vars the site builds and shows no sign-in UI. Commit. (Live sign-in cannot be verified until Harry creates the Supabase project — say so.)

### Task 9: Images, home, static pages, SEO

**Files:** `public/img/*`, `src/app/page.tsx`, `acerca`, `contacto`, `privacidad`, `terminos`, `sitemap.ts`, `robots.ts`, `opengraph-image`.

- [ ] Higgsfield: check balance and cost first. Generate hero art, 20 day-sign glyphs in one consistent codex style (flat pigment colours, heavy black outline, amate background), OG image. Convert to WebP, sized for use. If credits or quality fall short, fall back to simple SVG glyph tiles and report it.
- [ ] Home page per spec order. Legal pages with clearly marked `[PENDIENTE: …]` operator placeholders. Metadata, sitemap, robots, FAQ + Course JSON-LD.
- [ ] Commit.

### Task 10: Verification

- [ ] `npm test`, `npm run lint`, `npm run build` all clean.
- [ ] Browser pass at phone and desktop widths: home, wheel, a full lesson, each tool, both games, variant switch, corrupt-localStorage reload.
- [ ] Fresh reviewer over the whole branch; fix real findings. Final commit. Report what is and isn't verified.
