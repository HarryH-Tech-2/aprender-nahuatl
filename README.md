# aprendernahuatl.com

A site, in Mexican Spanish, for learning Nahuatl: an 8-lesson interactive course in two variants (Central and Huasteca; lesson 1 free, the full course paid), plus free tools and two games. Next.js on Vercel, with optional accounts on Supabase.

Design: `docs/superpowers/specs/2026-11-24-aprendernahuatl-design.md`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (logic and content checks)
npm run lint
npm run build
```

No environment variables are needed. Without them the sign-in buttons are hidden and progress is saved in the browser.

## Where things are

| Path | What |
|------|------|
| `src/content/lessons/` | The eight lessons, one file each. Every Nahuatl string is either a plain string (same in both variants) or `v('central form', 'huasteca form')`. |
| `src/content/` | Day-signs, pronunciation guide, place names, nahuatlismos. |
| `src/lib/` | Logic with tests: numbers, tonalpohualli, answer checking, progress, access. |
| `src/lib/access.ts` | The one place that decides who can open a lesson. Paid access is decided here (plus each lesson's `access` field). |
| `src/lib/legal.ts` | Contact email and operator name for the legal pages. **Empty: fill in before launch.** |
| `src/components/lesson/` | The lesson player and the six exercise types. |
| `supabase/migrations/` | Database setup for accounts. |
| `scripts/process-images.mjs` | Turns raw generated PNGs into the web images in `public/img`. |

## Before launch

1. Have a Nahuatl speaker or teacher review every lesson, in both variants. Until then keep the "Contenido en revisión" notes (footer, lesson pages, `/acerca`).
2. Fill in `src/lib/legal.ts` (seller name and address, contact email) and the refund policy in `/terminos` (search for `política de reembolsos`), and have the privacy notice and terms reviewed. Remove their "Borrador" boxes.
3. Turn on accounts (below) and set up payments ("Pagos (Stripe)" below).

## Hosting on Vercel

1. Put the repository on GitHub and import it at vercel.com (framework: Next.js, defaults are fine).
2. In the Vercel project: **Storage → Marketplace → Supabase → Create**. This creates the database and adds the environment variables. Check that these three exist (rename or add if the integration used other names):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Open the Supabase dashboard from Vercel → **SQL Editor** → paste and run `supabase/migrations/0001_profiles.sql`.
4. Supabase → **Authentication → URL Configuration**: set Site URL to `https://aprendernahuatl.com` and add `https://aprendernahuatl.com/cuenta` (and `http://localhost:3000/cuenta` for local testing) to Redirect URLs.
5. Supabase → **Authentication → Providers → Google**: enable it and paste a client ID and secret created in Google Cloud Console (OAuth consent screen + "Web application" credentials, with the callback URL Supabase shows you).
6. Email links work out of the box but Supabase's built-in sender is rate-limited; for real traffic add your own SMTP under **Authentication → Emails**.
7. Redeploy so the new variables take effect.

## Domain (Namecheap → Vercel)

1. Vercel project → **Settings → Domains** → add `aprendernahuatl.com` and `www.aprendernahuatl.com`.
2. Namecheap → Domain List → Manage → **Advanced DNS**. Remove the default parking records, then add the records Vercel shows. They are normally:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
3. Wait for Vercel to show the domain as valid (minutes to a few hours). HTTPS is automatic.

## Course waitlist (demand test)

- The waitlist records sign-ups and lesson interest through `/api/waitlist`. The old "not open yet" gate (`RELEASED_LESSONS`) is gone: lessons 2-8 now sell the paid plan.
- Storage: run `supabase/migrations/0002_waitlist.sql`; needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel. Until those exist, learners are let in and nothing is stored (only GA4 counts).
- Reports: the SQL file has queries for sign-ups per week and interest per locked lesson. GA4 events: `sign_up` (source, variant) and `lesson_interest` (lesson, variant).

## Google Analytics 4 (through Google Tag Manager)

The site loads Tag Manager container `GTM-WQ6ZGHMT` (src/lib/analytics.ts), only on the Vercel production deployment. GA4 itself is set up inside the container:

1. tagmanager.google.com, container GTM-WQ6ZGHMT: Tags, New, **Google tag**, Tag ID = the GA4 property's measurement ID (`G-...`, from GA4 Admin, Data streams). Trigger: **Initialization - All Pages**. Leave consent settings at "Not set": the site sends Google Consent Mode defaults itself.
2. Custom events (optional): Triggers, New, **Custom Event**, event name `lesson_complete|game_over`, "Use regex matching" on. Tags, New, **Google Analytics: GA4 Event**, measurement ID the same `G-...`, event name `{{Event}}`, event parameters `lesson`, `lesson_number`, `variant`, `score`, `game` from Data Layer Variables of the same names. Fire on that trigger.
3. **Submit** and **Publish** the container.
4. Check with Tag Manager's Preview mode on the live site, then GA4, Reports, Realtime.

Consent: until a visitor accepts the cookie banner, `analytics_storage` is denied (no cookies; cookieless pings still count the visit).

## Google Search Console

Preferred: a Domain property (covers https, http, www and every page).

1. search.google.com/search-console, Add property, Domain, `aprendernahuatl.com`.
2. Google shows a `TXT` record. In Namecheap, Advanced DNS, add a TXT record with host `@` and that value.
3. Click Verify (DNS can take from minutes to a few hours).
4. Sitemaps, submit `https://aprendernahuatl.com/sitemap.xml` (only once the site is live).
5. Settings, Associations: link the Search Console property to the GA4 property.

Alternative: a URL-prefix property verified by HTML tag. Put the tag's `content` value in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy.

## Pagos (Stripe)

Lesson 1 is free; lessons 2-8 need a paid plan: **Mensual** MXN $89/mes or **De por vida** MXN $299 (pago único), both IVA incluido (`PRICES` in `src/lib/plan.ts`). Payment methods: card (including Apple Pay and Google Pay) and Link; no OXXO. Accounts are required to buy, so finish the Supabase setup above first.

### Setup

1. **Stripe account and prices.** Create the (UK) Stripe account. Create one product with two MXN prices, both **tax-inclusive**: a monthly recurring price (89) and a one-time price (299). Copy both price ids (`price_...`). Turn on Stripe Tax and add the Mexico registration once you are registered with SAT.
2. **Vercel environment variables** (then redeploy): `NEXT_PUBLIC_ACCOUNTS_ENABLED=1`, `STRIPE_SECRET_KEY` (`sk_...`), `STRIPE_WEBHOOK_SECRET` (step 3), `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, and `NEXT_PUBLIC_CHECKOUT_ENABLED=1` once the other four Stripe values are set. Until the flag is on, the buy buttons stay off.
3. **Webhook.** Stripe Dashboard, Developers, Webhooks, add endpoint `https://www.aprendernahuatl.com/api/stripe/webhook` with exactly these events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.closed`. Copy its signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
4. **Customer portal.** Stripe, Settings, Billing, Customer portal: enable it (the "Gestionar suscripción" button in Mi cuenta opens it).
5. **Database.** In the Supabase SQL editor run `supabase/migrations/0001_profiles.sql` (if not already) and then `0003_billing.sql` (`0002_waitlist.sql` is only for the old waitlist). Check the auth redirect URLs and the Google provider (see Hosting on Vercel).

### Stripe settings to respect

- **No free trials and no 100%-off coupons or promotion codes.** Access is granted only when the checkout session has `payment_status = 'paid'`; a trial or fully discounted checkout is "no_payment_required" and would never unlock the lessons.
- In Billing settings leave **failed-payment retries (Smart Retries / dunning) on**. The site keeps access while a subscription is `past_due` and removes it when it ends as `canceled` or `unpaid`.
- Refunding or losing a dispute on the lifetime payment removes access (`charge.refunded`, `charge.dispute.closed`).

### Testing locally

1. Use test-mode keys and test-mode price ids in `.env.local`, plus `NEXT_PUBLIC_CHECKOUT_ENABLED=1`.
2. Run `npm run dev` and, in another terminal, `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Put the `whsec_...` it prints in `STRIPE_WEBHOOK_SECRET` and restart the dev server.
3. Buy with test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 9995` (declined, insufficient funds), any future expiry, any CVC. Check the plan in Mi cuenta and the `profiles` table.

### Waitlist export

Existing waitlist sign-ups (decide yourself whether to email them about the launch). In the Supabase SQL editor:

```sql
select email, variant, created_at from waitlist order by created_at;
```
