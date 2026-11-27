# Paid course: a stronger lesson 1 and Stripe checkout for lessons 2–8

Date: 2026-11-27. Status: awaiting approval.

## Intent

Harry wants lesson 1 to be compelling enough that learners finish it wanting more, and to end in a real purchase of the full course. Today lesson 1 is behind an email gate, has no audio, ends with a plain score screen, and lessons 2–8 are a demand test ("not open yet, join the list"). There is no payment code. All eight lessons are already written.

Success: real sales of the full course, measurable in Stripe and GA4, from people who just finished lesson 1.

## Goals

- Lesson 1 starts immediately (no email gate) and ends with a clear, appealing offer to buy the rest.
- Two plans, both sold through Stripe Checkout (hosted): **Mensual MXN $89/mes** and **De por vida MXN $299 pago único**. Lifetime is labelled "mejor valor". **[Harry: both plans; prices are Claude's proposal, not yet objected to]**
- Either plan unlocks lessons 2–8 and every lesson added later (signs 9–20).
- Access follows Stripe: webhooks grant it on payment and remove it when a subscription ends; a lifetime purchase never expires.
- Buyers manage or cancel a subscription through Stripe's customer portal, linked from `/cuenta`.

## Non-goals

- Audio. **[Harry: launch without audio]** AI TTS does not pronounce Nahuatl reliably (tl, x, ll, saltillo — exactly what lesson 1 teaches), so no generated audio. A native-speaker recording can be added later.
- OXXO / cash payments: the Stripe account is UK-registered, and OXXO needs a Mexican account. **[Harry: UK account]**
- An embedded payment form or Payment Links. **[Harry: hosted Checkout]**
- Coupons, trials, regional pricing, other currencies, team plans.
- Writing lessons 9–20.
- Server-side protection of lesson content. **[Harry: a locked screen is enough]** Lessons 2–8 stay in the client bundle; `canAccess()` decides only what the UI shows. Someone reading the JS can see the content, and that is accepted.

## Anti-goals

- Taking money without granting access, or granting access without payment (e.g. trusting the browser's return URL instead of the webhook).
- Misleading "free" copy: the site currently promises a free course in titles, the homepage hero ("Gratis · sin registro"), FAQs, JSON-LD and `llms.txt`. After this change none of it may imply lessons 2–8 are free.
- Breaking what works: the free tools, games, phrases pages, lesson intro pages (still indexable) and per-variant progress all keep working for everyone.

## Constraints

- Next.js 16 (read `node_modules/next/dist/docs/` before writing route handlers — this version differs from older docs). Vercel hosting; Supabase already connected in Vercel (URL, anon and service-role keys present in Preview and Production). `NEXT_PUBLIC_ACCOUNTS_ENABLED` is not yet set; this work turns accounts on.
- Existing pieces to build on: `profiles.plan` column (default `'free'`, learners cannot change it — trigger in `0001_profiles.sql`); `canAccess()` in `src/lib/access.ts` is the single gate; each lesson has `access: 'free' | 'member'`; `RELEASED_LESSONS` in `src/lib/release.ts`; the sign-in dialog (Google + email link) and local→account progress merge already exist.
- Harry is creating the Stripe account; until keys exist, the site must build and behave sensibly (no buy buttons, or a clear "pronto" state), the same way it handles missing Supabase config today.
- Harry pushes and deploys himself. Nothing gets pushed or deployed without his say-so.
- Content is Mexican Spanish; Nahuatl forms follow the existing per-variant conventions and are flagged for speaker review.

## Approaches considered

1. **Stripe Checkout, hosted — chosen.** Redirect to Stripe's page, return to the site; webhooks set access; customer portal for cancellations. Least code, Stripe handles cards/Apple Pay/Google Pay/Link, MXN display, renewals and SCA.
2. Embedded payment form (Payment Element). More seamless, but more code and edge cases (failed cards, 3-D Secure) for a small conversion gain. Rejected.
3. Payment Links. Almost no code, but matching payments to accounts is fragile and cancellations don't revoke access automatically. Rejected.

Pricing model options were one-time only, monthly only, or both; Harry chose **both**.

## The design

### Lesson 1

- Remove the email gate before lesson 1 (`SignupForm mode="start"`). The waitlist table and API stay for existing data but are no longer in the learner path.
- New opening hook (first 1–2 steps): "ya dices náhuatl todos los días" — place names the learner already says (*México, Chapultepec, Xochimilco, Coyoacán, Tlaxcala*) and what they mean, as an info card plus one quick exercise. Then the existing pronunciation and greetings content. **[Claude's call]** Place names, not loanwords, because lesson 2 already opens with loanwords (aguacate, tomate, chile…) and must not feel like a rerun right after purchase; place names also lead naturally into the tl/x/tz sounds.
- New closing payoff: a short guided mini-conversation the learner completes (greet, ask how someone is, ask a name, give theirs, thank, say goodbye), built from existing exercise types, in both variants.
- Keep the lesson about 15 minutes and within the content test rules (≥20 steps, all answers valid in both variants).
- The final info card teases what's next (e.g. lesson 4: counting in base 20 like the Mexica) instead of only lesson 2.

### The offer (end of lesson 1)

```
        [Cipactli lit]
   ¡Cualli! Encendiste Cipactli
   Terminaste con 87% al primer intento.

   ○ ○ ○ ○ ○ ○ ○   ← the next 7 signs, with one line each on what they teach

   ┌ De por vida ── mejor valor ┐  ┌ Mensual ─────────┐
   │ MXN $299, pago único       │  │ MXN $89 / mes    │
   │ Lecciones 2–8 + las nuevas │  │ Cancela cuando   │
   │ [Desbloquear el curso]     │  │ quieras [Elegir] │
   └────────────────────────────┘  └──────────────────┘
   Pago seguro con Stripe · tarjeta, Apple Pay, Google Pay
```

- A plan button opens the sign-in dialog if signed out, then continues to Checkout once signed in. Signed-in learners go straight to Checkout.
- The same offer shows when someone without access tries to start lessons 2–8 (replacing the "not open yet" screen), and on `/curso` near the wheel.
- Lesson intro pages for 2–8 stay public and indexable; their start button leads to the offer when the learner has no access.
- Lifetime members see none of this. Monthly members see only a small "Pásate a de por vida" option on `/cuenta`. **[Claude's call]** Buying lifetime while subscribed cancels the subscription immediately in the webhook (no credit for months already paid; stated on the button), so nobody keeps paying monthly after paying for lifetime. Checkout refuses a second purchase of the plan someone already has.
- Members can open any lesson 2–8 directly, in either variant; the wheel still highlights the suggested next lesson. **[Claude's call]** Someone who pays should not be blocked by the one-at-a-time chain (e.g. buying from `/curso` before finishing lesson 1, or after switching variant). Non-members keep the existing chain for lesson 1.

### Purchase flow

- `POST /api/checkout` (signed-in only, verifies the Supabase session): creates a Checkout Session for the chosen plan (`mode: 'subscription'` or `'payment'`), with `client_reference_id` = user id and a Stripe customer reused per user. Returns the URL; the browser redirects.
- Tax: **[Harry: prices include IVA]** both Stripe prices use `tax_behavior: 'inclusive'` and Checkout uses `automatic_tax`, so buyers pay exactly MXN $299 / $89 and Stripe Tax computes the 16% IVA inside it. Checkout collects the buyer's country as Stripe Tax requires. Registering with SAT and adding the registration in Stripe Tax is Harry's step (README). Offer cards and `/terminos` say "IVA incluido".
- Success URL returns to the site with a "¡Bienvenido al curso!" state that waits for the webhook to land (polls the profile briefly) and then links to lesson 2. Cancel URL returns to the offer.
- `POST /api/stripe/webhook` (signature verified): on `checkout.session.completed` grant access; on `customer.subscription.updated/deleted` set access from the subscription status; lifetime purchases are never revoked by subscription events. A full refund (`charge.refunded`) or a lost dispute (`charge.dispute.closed` with status lost) removes the access that payment granted. **[Claude's call]** Idempotent.
- `POST /api/billing-portal` (signed-in): opens Stripe's customer portal; `/cuenta` shows plan status and a "Gestionar suscripción" link for monthly members.

### Data

- New migration `0003_billing.sql`: add `stripe_customer_id` and a record of how access was granted (`plan` values `free | monthly | lifetime`, plus subscription id/status as needed). Only the service role writes these. The existing guard trigger only protects `plan`, so `0003` extends it to every billing column. **[Claude's call]**
- `canAccess()` becomes: free lessons → everyone; member lessons → `plan` is `monthly` (active) or `lifetime`. Lessons 2–8 change to `access: 'member'`. `RELEASED_LESSONS` goes to 8 (or is removed in favour of `access`).
- Config: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, `NEXT_PUBLIC_ACCOUNTS_ENABLED=1`. Without the Stripe keys, offers show "Muy pronto" instead of buy buttons.

### Copy and legal

- Replace "curso gratis" wording with "lección 1 gratis / curso completo" across titles, descriptions, hero, FAQs, Course JSON-LD (add `offers` with both prices) and `llms.txt`. Tools, games and phrases stay described as free.
- `/terminos`: add a section on prices, renewal, cancellation and refunds; `/privacidad`: disclose Stripe as payment processor. Operator-specific legal wording (refund policy, seller name/address) uses the existing `[PENDIENTE: …]` markers for Harry to fill.

### Analytics

- GA4 events: `view_offer`, `begin_checkout` (plan), `purchase` (plan, value, currency) fired on the success page after access is confirmed.

### Setup Harry does (written into the README)

1. Create the UK Stripe account; create one product with two MXN prices (monthly recurring, one-time), both tax-inclusive; copy the price ids. Turn on Stripe Tax and add the Mexico registration once registered with SAT.
2. Add the Stripe env vars and `NEXT_PUBLIC_ACCOUNTS_ENABLED=1` in Vercel.
3. Add the webhook endpoint in Stripe for the events above; copy its signing secret.
4. Enable the customer portal in Stripe.
5. Run `0001_profiles.sql` (if not already) and `0003_billing.sql` in the Supabase SQL editor; check auth redirect URLs and Google provider.

## Left to the builder

- Exact lesson 1 wording and step order, within the shape above.
- Component structure, file names, how the success page waits for the webhook.
- Exact schema columns in `0003_billing.sql`.
- Testing approach: unit tests for `canAccess` and webhook event → access mapping; Stripe test mode with the Stripe CLI for the end-to-end flow.
- The waitlist: what to do with existing sign-ups (an export query in the README is enough; sending an announcement email is Harry's call).
