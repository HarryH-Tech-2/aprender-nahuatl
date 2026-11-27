# Paid Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lesson 1 opens without a gate and ends in a Stripe Checkout offer (MXN $89/mes or MXN $299 de por vida, IVA incluido) that unlocks lessons 2–8.

**Architecture:** Access lives in `profiles.plan` (`free | monthly | lifetime`), written only by a signature-verified Stripe webhook through a pure, tested state machine (`src/lib/billing.ts`). The browser asks `/api/checkout` for a hosted Checkout URL and `/api/billing-portal` for Stripe's portal; the UI gate is a pure `lessonGate()` function. Lesson content stays in the client bundle (locked screen only, by Harry's choice).

**Tech Stack:** Next.js 16.4 (App Router, read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` before writing route handlers), React 19, Supabase JS 2, `stripe` npm 23.x (server only), Vitest 5.

**Spec:** `docs/superpowers/specs/2026-11-27-paid-course-design.md`

## Global Constraints

- Prices: Mensual **MXN $89/mes**, De por vida **MXN $299 pago único**, both "IVA incluido"; lifetime labelled "mejor valor". Copy shows `$89` / `$299` with "MXN".
- Stripe: hosted Checkout only; `automatic_tax: { enabled: true }`; prices are tax-inclusive (set in the Stripe dashboard); `locale: 'es-419'`. No OXXO.
- Lesson 1 stays `access: 'free'`; lessons 2–8 become `access: 'member'`. Tools, games, phrases, dictionary stay free and are still described as free.
- Without `STRIPE_SECRET_KEY` (server) or `NEXT_PUBLIC_CHECKOUT_ENABLED=1` (client) the site builds and offers show "Muy pronto" instead of buy buttons. Without accounts configured, the same.
- Only the service role writes billing columns. Never trust the success URL to grant access.
- Copy is Mexican Spanish. New Nahuatl forms in both variants, consistent with existing lesson 1 forms.
- Do not push or deploy. Commit locally per task; message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `AGENTS.md` block re-added by `next dev` may appear as a diff; leave it or commit it, don't fight it.

## Review Focus

1. A member opens a lesson on a fresh device: the account's plan has not loaded yet. Expect "Cargando…", never a flash of the offer or a refusal. (Task 1 `lessonGate` test with `planLoaded: false`.)
2. Webhooks arrive twice or out of order (`customer.subscription.updated` before `checkout.session.completed`). Expect the same final state as in-order delivery. (Task 2 tests.)
3. A monthly member buys lifetime; Stripe then sends `customer.subscription.deleted` for the cancelled monthly plan. Expect plan stays `lifetime`. (Task 2 test.)
4. A signed-out learner clicks a plan, signs in by email link (which may land in another tab on `/cuenta`). Expect checkout to resume once signed in, within 30 minutes. (Task 1 `readPendingPlan` test; Task 4 wiring.)
5. A lifetime member (or a monthly member choosing monthly again) reaches `/api/checkout`. Expect 409, no second charge. (Task 1 `canBuy` test; Task 3 uses it.)

---

### Task 1: Plans, access and the lesson gate (pure logic)

**Files:**
- Create: `src/lib/plan.ts`, `src/lib/plan.test.ts`
- Modify: `src/lib/access.ts`, `src/lib/logic.test.ts` (existing `canAccess` assertions), `src/content/lessons/02-…08-*.ts` (`access: 'member'`), `src/content/content.test.ts:22-26`
- Delete: `src/lib/release.ts`; remove its assertions from `src/lib/waitlist.test.ts` (keep the waitlist ones)

**Interfaces:**
- Produces (`src/lib/plan.ts`):
  - `type Plan = 'free' | 'monthly' | 'lifetime'`; `type PaidPlan = 'monthly' | 'lifetime'`
  - `PRICES: Record<PaidPlan, { mxn: number; label: string }>` = `{ monthly: { mxn: 89, label: 'Mensual' }, lifetime: { mxn: 299, label: 'De por vida' } }`
  - `parsePlan(x: unknown): Plan` (unknown → `'free'`)
  - `isMember(profile: { plan: string } | null): boolean`
  - `canBuy(current: Plan, wanted: PaidPlan): boolean`
  - `PENDING_PLAN_KEY = 'an.pendingPlan.v1'`; `encodePendingPlan(plan: PaidPlan, now: number): string`; `readPendingPlan(raw: string | null, now: number): PaidPlan | null` (expires after 30 min)
- Produces (`src/lib/access.ts`):
  - `canAccess(profile, lesson)` unchanged signature; member lessons → `isMember(profile)`
  - `type Gate = 'loading' | 'play' | 'offer' | 'finish-previous'`
  - `lessonGate(args: { lesson: { n: number; access: 'free' | 'member' }; account: { plan: string; planLoaded: boolean } | null; progress: Progress; variant: Variant; lessons: { n: number; slug: string }[] }): Gate`

- [ ] **Step 1: Write failing tests in `src/lib/plan.test.ts`**

```ts
it('isMember', () => {
  expect(isMember(null)).toBe(false);
  expect(isMember({ plan: 'free' })).toBe(false);
  expect(isMember({ plan: 'monthly' })).toBe(true);
  expect(isMember({ plan: 'lifetime' })).toBe(true);
  expect(isMember({ plan: 'member' })).toBe(false); // old placeholder value is not a plan
});
it('canBuy', () => {
  expect(canBuy('free', 'monthly')).toBe(true);
  expect(canBuy('free', 'lifetime')).toBe(true);
  expect(canBuy('monthly', 'lifetime')).toBe(true);
  expect(canBuy('monthly', 'monthly')).toBe(false);
  expect(canBuy('lifetime', 'monthly')).toBe(false);
  expect(canBuy('lifetime', 'lifetime')).toBe(false);
});
it('pending plan survives 30 minutes, not longer, and rejects garbage', () => {
  const raw = encodePendingPlan('lifetime', 1_000);
  expect(readPendingPlan(raw, 1_000 + 29 * 60_000)).toBe('lifetime');
  expect(readPendingPlan(raw, 1_000 + 31 * 60_000)).toBe(null);
  expect(readPendingPlan('garbage', 0)).toBe(null);
  expect(readPendingPlan(JSON.stringify({ plan: 'free', at: 0 }), 0)).toBe(null);
  expect(readPendingPlan(null, 0)).toBe(null);
});
it('parsePlan', () => {
  expect(parsePlan('lifetime')).toBe('lifetime');
  expect(parsePlan('member')).toBe('free');
  expect(parsePlan(undefined)).toBe('free');
});
```

And `lessonGate` tests (in the same file or `logic.test.ts`), with `lessons` = the real `LESSONS` and `emptyProgress()`:

```ts
const l1 = { n: 1, access: 'free' as const }, l2 = { n: 2, access: 'member' as const }, l3 = { n: 3, access: 'member' as const };
expect(lessonGate({ lesson: l1, account: null, progress: p0, variant: 'central', lessons })).toBe('play');
expect(lessonGate({ lesson: l2, account: null, progress: p0, variant: 'central', lessons })).toBe('offer');
expect(lessonGate({ lesson: l2, account: { plan: 'free', planLoaded: true }, ... })).toBe('offer');
expect(lessonGate({ lesson: l2, account: { plan: 'lifetime', planLoaded: false }, ... })).toBe('loading');
expect(lessonGate({ lesson: l3, account: { plan: 'monthly', planLoaded: true }, progress: p0, ... })).toBe('play'); // members skip the chain
expect(lessonGate({ lesson: l1, account: { plan: 'free', planLoaded: false }, ... })).toBe('play'); // free lessons never wait
```

Plus a free lesson n>1 that is not unlocked → `'finish-previous'` (use a synthetic `{ n: 2, access: 'free' }`).

- [ ] **Step 2: Run `npx vitest run src/lib/plan.test.ts` — expect FAIL (module not found).**
- [ ] **Step 3: Implement `src/lib/plan.ts` and `lessonGate`/`canAccess` in `src/lib/access.ts`.** Order in `lessonGate`: free lesson → chain check (`isUnlocked`) → `play`/`finish-previous`; member lesson → no account → `offer`; `!planLoaded` → `loading`; member → `play`; else `offer`.
- [ ] **Step 4: Set `access: 'member'` in lessons 2–8; change the content test to "lesson 1 is free, lessons 2–8 are member". Delete `release.ts` and its test lines.** (Player still imports `isReleased` — leave Player compiling by deleting those two lines and the `LockedLesson` branch now; Task 4 rewrites the gate.)
- [ ] **Step 5: `npx vitest run` — all pass; `npx tsc --noEmit` clean.**
- [ ] **Step 6: Commit** "Plans and lesson gate: lessons 2–8 are member lessons".

---

### Task 2: Billing state machine, Stripe event mapping, migration

**Files:**
- Create: `src/lib/billing.ts`, `src/lib/billing.test.ts`, `src/lib/stripe-events.ts`, `src/lib/stripe-events.test.ts`, `supabase/migrations/0003_billing.sql`
- Modify: `package.json` (add `stripe` ^23 dependency)

**Interfaces:**
- Consumes: `Plan` from Task 1.
- Produces (`src/lib/billing.ts`):
  - `type BillingState = { plan: Plan; subscriptionId: string | null; lifetimePaymentIntent: string | null }`
  - `type BillingEvent =`
    `| { kind: 'checkout_completed'; mode: 'subscription'; subscriptionId: string }`
    `| { kind: 'checkout_completed'; mode: 'payment'; paymentIntentId: string }`
    `| { kind: 'subscription_changed'; subscriptionId: string; status: string }`
    `| { kind: 'payment_revoked'; paymentIntentId: string }`
  - `nextBilling(current: BillingState, e: BillingEvent): { next: BillingState; cancelSubscription: string | null }`
  - `ACTIVE_SUB_STATUSES = ['active', 'trialing', 'past_due']`
- Produces (`src/lib/stripe-events.ts`):
  - `type MappedEvent = { userId: string | null; customerId: string | null; event: BillingEvent }`
  - `toBillingEvent(e: Stripe.Event): MappedEvent | null` — handles `checkout.session.completed` (only `payment_status === 'paid'`; userId from `client_reference_id`), `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded` (only when `amount_refunded === amount`), `charge.dispute.closed` (only `status === 'lost'`). Everything else → `null`. Ids may be string or expanded object; take `.id` when object.

Rules for `nextBilling` (each must be idempotent — applying the same event twice gives the same result):
- checkout payment → `plan: 'lifetime'`, `lifetimePaymentIntent` set, `subscriptionId: null`; if current had a `subscriptionId`, return it as `cancelSubscription`.
- checkout subscription → if current is lifetime: unchanged, `cancelSubscription` = the new id (should not happen; Checkout refuses it). Else `plan: 'monthly'`, `subscriptionId` set.
- subscription_changed → if lifetime, or `subscriptionId` differs from current (incl. current null): unchanged. Else `monthly` when status in `ACTIVE_SUB_STATUSES`, otherwise `free` with `subscriptionId: null`.
- payment_revoked → if it matches `lifetimePaymentIntent`: `free`, both ids null. Otherwise unchanged (a refunded monthly charge does not lock access; Harry cancels the subscription in Stripe, which sends `subscription.deleted`).

- [ ] **Step 1: Write failing tests in `billing.test.ts`** covering, with `free0 = { plan: 'free', subscriptionId: null, lifetimePaymentIntent: null }`:
  - free + checkout subscription `sub_1` → monthly/sub_1, cancel null
  - monthly/sub_1 + checkout payment `pi_1` → lifetime/pi_1, subscriptionId null, cancel `sub_1`
  - then + subscription_changed `sub_1` `canceled` → still lifetime (Review Focus 3)
  - monthly/sub_1 + subscription_changed `sub_1` `past_due` → monthly; `unpaid` → free
  - free + subscription_changed `sub_1` `active` → unchanged free (out-of-order, Review Focus 2); followed by checkout subscription `sub_1` → monthly
  - every event applied twice equals applied once (loop over a list of (state, event) pairs)
  - lifetime/pi_1 + payment_revoked `pi_1` → free; + payment_revoked `pi_other` → unchanged
- [ ] **Step 2: Run, expect FAIL. Step 3: implement. Step 4: run, expect PASS.**
- [ ] **Step 5: `stripe-events.test.ts`** — build minimal event objects cast to `Stripe.Event` and assert: paid checkout in payment mode → `{ userId: 'u1', customerId: 'cus_1', event: { kind: 'checkout_completed', mode: 'payment', paymentIntentId: 'pi_1' } }`; unpaid checkout → null; partial refund → null; full refund → `payment_revoked`; dispute `won` → null, `lost` → `payment_revoked` with the dispute's `payment_intent`; `invoice.paid` → null. Implement; pass.
- [ ] **Step 6: Write `0003_billing.sql`:** add `stripe_customer_id text unique`, `stripe_subscription_id text`, `lifetime_payment_intent text`; `plan` check `in ('free','monthly','lifetime')` (update any non-matching rows to `'free'` first); replace `profiles_guard()` so learners (`authenticated`/`anon`) cannot change `plan` or any of the three new columns (copy `old` values back); replace the insert policy so a learner's insert requires `plan = 'free'` and all three columns null. Header comment: run after `0001`, idempotent (`if not exists` / `create or replace` / `drop policy if exists`).
- [ ] **Step 7: `npm install stripe@^23`; `npx vitest run`; `npx tsc --noEmit`. Commit** "Billing state machine, Stripe event mapping and billing migration".

---

### Task 3: Server routes — checkout, billing portal, webhook

**Files:**
- Create: `src/lib/stripe.ts`, `src/lib/auth-server.ts`, `src/app/api/checkout/route.ts`, `src/app/api/billing-portal/route.ts`, `src/app/api/stripe/webhook/route.ts`
- Modify: `src/app/api/delete-account/route.ts` (use `userFromRequest`), `.env.example`

**Interfaces:**
- Consumes: `getSupabaseAdmin()` (`src/lib/supabase-admin.ts`), `canBuy`, `parsePlan`, `PaidPlan` (Task 1), `nextBilling`, `toBillingEvent` (Task 2).
- Produces:
  - `src/lib/stripe.ts` (server only — add `import 'server-only'` if the package is present, otherwise a comment): `getStripe(): Stripe | null`; `priceId(plan: PaidPlan): string | null` from `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_LIFETIME`.
  - `src/lib/auth-server.ts`: `userFromRequest(request: Request): Promise<{ id: string; email: string | null } | null>` — Bearer token → `admin.auth.getUser(token)` (the pattern already in `delete-account`).
  - `POST /api/checkout` body `{ plan: PaidPlan }`, header `Authorization: Bearer <access token>` → `200 { url }` | `400` bad plan | `401` | `409 { error: 'already' }` | `503` not configured.
  - `POST /api/billing-portal` (same auth) → `200 { url }` | `401` | `404` no customer | `503`.
  - `POST /api/stripe/webhook` → `200` handled or ignored | `400` bad signature | `500` DB failure (so Stripe retries).

- [ ] **Step 1: `stripe.ts`, `auth-server.ts`; refactor `delete-account` to use `userFromRequest` (behaviour unchanged).**
- [ ] **Step 2: Checkout route.** Read the caller's profile (`plan`, `stripe_customer_id`) with the admin client; `canBuy(parsePlan(row.plan), plan)` else 409. Create the Stripe customer if missing (`email`, `metadata: { user_id }`) and save its id on the profile before creating the session. Session: `mode` `'subscription'` for monthly / `'payment'` for lifetime; one line item with `priceId(plan)`; `customer`; `client_reference_id: user.id`; `metadata: { user_id, plan }` (also on `subscription_data`/`payment_intent_data`); `automatic_tax: { enabled: true }`; `customer_update: { address: 'auto' }`; `billing_address_collection: 'auto'`; `locale: 'es-419'`; `allow_promotion_codes: false`; `success_url: ${origin}/curso/bienvenida?session_id={CHECKOUT_SESSION_ID}`; `cancel_url: ${origin}/curso?compra=cancelada`. `origin` = `new URL(request.url).origin`.
- [ ] **Step 3: Billing portal route.** `stripe.billingPortal.sessions.create({ customer, return_url: ${origin}/cuenta, locale: 'es-419' })`.
- [ ] **Step 4: Webhook route.** `const body = await request.text()`; `stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature'), STRIPE_WEBHOOK_SECRET)` → 400 on throw. `toBillingEvent`; null → 200. Find the profile by `userId` (checkout) else by `stripe_customer_id`; none → log and 200. On checkout also store `customerId` if the row has none. Compute `nextBilling`, update `plan`, `stripe_subscription_id`, `lifetime_payment_intent`; DB error → 500. If `cancelSubscription`, `stripe.subscriptions.cancel(id)` after the update (ignore "already canceled" errors). Route must not be statically optimised (it reads the request body, so it is dynamic; confirm in the Next 16 route docs).
- [ ] **Step 5: Add to `.env.example`** with one-line comments: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, `NEXT_PUBLIC_CHECKOUT_ENABLED` ("set to 1 once the four Stripe values are in Vercel").
- [ ] **Step 6: Verify** `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean with no Stripe env vars set; `curl -X POST localhost:3000/api/checkout` on `npm run dev` returns 503. Commit "Stripe checkout, billing portal and webhook routes".

---

### Task 4: The offer, the gate and the account screens (client)

**Files:**
- Create: `src/components/Offer.tsx`, `src/lib/checkout-client.ts`, `src/app/curso/bienvenida/page.tsx` (+ a client component it renders)
- Modify: `src/components/AppState.tsx`, `src/components/lesson/Player.tsx`, `src/components/SignWheel.tsx`, `src/components/AccountPanel.tsx`, `src/app/curso/page.tsx` (render `<Offer context="curso" />` under the wheel)
- Delete: `src/components/lesson/SignupGate.tsx`, `src/lib/signup-store.ts` (waitlist API routes, `waitlist.ts` and its tests stay)

**Interfaces:**
- Consumes: `lessonGate`, `isMember`, `PRICES`, `canBuy`, `PENDING_PLAN_KEY`, `encodePendingPlan`, `readPendingPlan` (Task 1); the API routes (Task 3).
- Produces:
  - `Account` gains `planLoaded: boolean` (false until the first profile read; set true on read success, and on read failure keep false only until `syncFailed` — then true with plan `'free'` so the UI doesn't spin forever). `account.plan` is set via `parsePlan`.
  - `AppState` gains `refreshAccount: () => Promise<void>` (runs `sync`).
  - `checkout-client.ts`: `startCheckout(plan: PaidPlan): Promise<'redirected' | 'error' | 'already'>`; `openBillingPortal(): Promise<'redirected' | 'error'>` — both read the access token from `getSupabase().auth.getSession()` and `window.location.assign(url)`.
  - `checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === '1' && supabaseConfigured` exported from `checkout-client.ts`.
  - `<Offer context: 'lesson-end' | 'locked' | 'curso' />`

- [ ] **Step 1: AppState** — `planLoaded`, `refreshAccount`, `parsePlan`.
- [ ] **Step 2: Offer component** per the spec sketch: the 7 upcoming signs (`SignBadge`, locked state) each with its lesson `subtitle`; two plan cards — De por vida first with a "mejor valor" tag, "MXN $299 · pago único · IVA incluido", button "Desbloquear el curso"; Mensual "MXN $89 al mes · IVA incluido · cancela cuando quieras", button "Elegir mensual"; footer "Pago seguro con Stripe · tarjeta, Apple Pay, Google Pay". Lines: "Lecciones 2 a 8 y todas las que vienen (signos 9 al 20)". Renders `null` for members. When `!checkoutEnabled`: same cards, buttons replaced by "Muy pronto". Click flow: signed out → `localStorage[PENDING_PLAN_KEY] = encodePendingPlan(plan, Date.now())`, `openSignIn(true)`; signed in → `startCheckout`. An effect (in `AppStateProvider` or a small `<PendingCheckout />` mounted in the layout) runs when `account?.planLoaded` becomes true: `readPendingPlan`, clear the key, and if `canBuy` → `startCheckout`. Errors show "No pudimos abrir el pago. Inténtalo de nuevo." `track('view_offer', { context })` once per mount; `track('begin_checkout', { plan, value, currency: 'MXN' })` on click.
- [ ] **Step 3: Player** — replace the access/unlock branch and the waitlist lines with `lessonGate`: `loading` → existing "Cargando la lección…"; `offer` → heading "Sigue con el curso completo" + `<Offer context="locked" />`; `finish-previous` → existing message. Finished screen: when the next lesson exists and `lessonGate` for it would be `offer`, replace the "Siguiente" button with `<Offer context="lesson-end" />` (keep "Ver el curso"); remove the "No pierdas tu avance" box in that case (the offer already asks for sign-in).
- [ ] **Step 4: SignWheel** — add `SignState` `'open'` (label "disponible", rendered like `next` without the glow) for members' uncompleted lessons other than the suggested next; for non-members lessons 2–8 keep `locked` with label "curso completo". `next` for members = first uncompleted lesson.
- [ ] **Step 5: Bienvenida page** (`robots: { index: false }`): polls `refreshAccount()` every 2 s for up to 30 s until `isMember(account)`; then "¡Bienvenida, bienvenido al curso completo!" + button to the first uncompleted lesson ≥2 and `track('purchase', { plan, value, currency: 'MXN', transaction_id: session_id })` once per `session_id` (guard in `sessionStorage`). On timeout: "Tu pago se está confirmando. Recarga esta página en un minuto; si no se abre el curso, escríbenos." with the contact link. Signed-out visitor: prompt to sign in.
- [ ] **Step 6: AccountPanel** — show "Plan: Gratis / Mensual / De por vida". Monthly: "Gestionar suscripción" (`openBillingPortal`) and "Pásate a de por vida — MXN $299" with the note "Tu plan mensual se cancela al instante; los meses ya pagados no se reembolsan." (`startCheckout('lifetime')`). Lifetime: "Tienes el curso completo para siempre." Free: link to `/curso#curso-completo` (give the `/curso` offer that id).
- [ ] **Step 7: Verify in the browser** (`npm run dev`, no Stripe vars, `NEXT_PUBLIC_ACCOUNTS_ENABLED` unset then `=1` locally if Supabase vars are pulled — otherwise test signed-out only): lesson 1 starts with no email form; finishing it shows the offer with "Muy pronto"; `/curso/palabras-que-ya-conoces/jugar` shows the offer; `/curso` shows the offer; phone width 375 px and desktop. Set `NEXT_PUBLIC_CHECKOUT_ENABLED=1` and check that clicking a plan while signed out opens the sign-in dialog. `npm test`, `npm run lint`. Commit "Course offer at the end of lesson 1; lessons 2–8 open with a plan".

---

### Task 5: Lesson 1 rewrite

**Files:**
- Modify: `src/content/lessons/01-sonidos-y-saludos.ts`

**Interfaces:** Consumes the existing step helpers in `src/content/types.ts` and the toponym data in `src/content/toponimos.ts` (meanings must match it).

- [ ] **Step 1: New opening.** Keep the current welcome card first. Insert as step 2 an info card titled "Ya dices náhuatl todos los días" with examples *Chapultepec* — «en el cerro del chapulín», *Xochimilco* — «en la sementera de flores», *Coyoacán* — «lugar de los que tienen coyotes», *Tlaxcala* — «lugar de tortillas», and body explaining that thousands of place names in Mexico are Nahuatl and that by the end of the lesson they will read them right. Step 3: a `choice` "¿Qué quiere decir «Xochimilco»?" with the right meaning first and two plausible wrong ones (`explain` points at *xochitl*, which appears again later).
- [ ] **Step 2: New closing.** Before the final card, add "Tu primera plática": an info card with a 6-line dialogue (greet, ¿cómo estás?, bien gracias, ¿cómo te llamas?, me llamo…, nos vemos) in both variants using only the lesson's words, then 4 exercises where the learner supplies each of their own turns (`blank` or `choice`, prompt shows the other person's line).
- [ ] **Step 3: Final card.** Retitle "¡Cualli! Primer signo completado" body to: what they can now do (read aloud, greet, introduce themselves, hold a first plática), then the teaser: "Lo que sigue: descubrir decenas de palabras que ya usas sin saberlo, decir quién eres, y contar como los mexicas, de veinte en veinte."
- [ ] **Step 4:** Keep ≈15 minutes: if the lesson exceeds 38 steps, drop the weakest duplicate drills (e.g. one of the two `meaningOf(nosvemos…)`/farewell items). Update the `intro` to mention the plática. `npx vitest run src/content` passes. Play the lesson once in each variant in the browser. Commit "Lesson 1: place-name hook and a first conversation".

---

### Task 6: Copy, structured data, legal, README

**Files:**
- Modify: every file from `grep -rln -i "gratis" src/app src/components public/llms.txt` that describes the course; `src/app/curso/[slug]/page.tsx` and `src/components/Seo.tsx` (Course JSON-LD); `src/app/terminos/page.tsx`, `src/app/privacidad/page.tsx`, `src/lib/legal.ts` (new pending fields if needed); `README.md`

- [ ] **Step 1: Copy.** "curso gratis" / "8 lecciones gratis" → "lección 1 gratis" / "curso completo"; home hero sublabel "Gratis · sin registro" → "Lección 1 gratis · sin registro". FAQs that say the course is free get rewritten to say lesson 1, the tools and games are free, and the full course is MXN $89/mes or MXN $299 de por vida. Tools/games/phrases copy that says *they* are free stays.
- [ ] **Step 2: JSON-LD.** Course: `isAccessibleForFree: false`, `offers` = two `Offer` (`price: '89'` with `category: 'Subscription'`, `price: '299'` with `category: 'Paid'`, `priceCurrency: 'MXN'`). Lesson 1's page may keep a free marker; lessons 2–8 not.
- [ ] **Step 3: Legal.** `/terminos`: section "Precios y pagos" — prices with IVA incluido, monthly renews until cancelled from Mi cuenta, lifetime covers current and future lessons for the life of the site, upgrade cancels monthly without refund of paid months, refunds per `[PENDIENTE: política de reembolsos]`, seller `[PENDIENTE: nombre y dirección del vendedor]`. `/privacidad`: Stripe processes payments; the site stores only the Stripe customer id and plan, never card data.
- [ ] **Step 4: README.** New "Pagos (Stripe)" section with the spec's five setup steps, exact webhook events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.closed`), endpoint `https://www.aprendernahuatl.com/api/stripe/webhook`, the env var list, running `0001` then `0003`, local testing with `stripe listen --forward-to localhost:3000/api/stripe/webhook` and test cards, and a SQL query to export the waitlist (`select email, variant, created_at from waitlist order by created_at`; check column names in `0002_waitlist.sql`).
- [ ] **Step 5:** `npm run build`; commit "Copy, structured data and terms for the paid course".

---

### Task 7: Verification

- [ ] `npm test`, `npm run lint`, `npm run build` clean.
- [ ] Browser pass at 375 px and desktop: home, `/curso`, lesson 1 end to end in both variants, offer on lesson 2, `/cuenta` signed out, bienvenida page signed out.
- [ ] Fresh whole-branch review; fix real findings; commit.
- [ ] Report: what's verified, and what can't be until Harry creates the Stripe account (real checkout, webhook, portal, tax) — offer to run the Stripe CLI test-mode pass once test keys exist.
