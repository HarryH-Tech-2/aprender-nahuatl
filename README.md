# aprendernahuatl.com

A free site, in Mexican Spanish, for learning Nahuatl: an 8-lesson interactive course in two variants (Central and Huasteca), tools and two games. Next.js on Vercel, with optional accounts on Supabase.

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
| `src/lib/access.ts` | The one place that decides who can open a lesson. Paid plans later change only this (plus each lesson's `access` field). |
| `src/lib/legal.ts` | Contact email and operator name for the legal pages. **Empty: fill in before launch.** |
| `src/components/lesson/` | The lesson player and the six exercise types. |
| `supabase/migrations/` | Database setup for accounts. |
| `scripts/process-images.mjs` | Turns raw generated PNGs into the web images in `public/img`. |

## Before launch

1. Have a Nahuatl speaker or teacher review every lesson, in both variants. Until then keep the "Contenido en revisión" notes (footer, lesson pages, `/acerca`).
2. Fill in `src/lib/legal.ts` and have the privacy notice and terms reviewed. Remove their "Borrador" boxes.
3. Turn on accounts (below).

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

## Adding a paid plan later

Each lesson has `access: 'free' | 'member'` and each profile has `plan` (only the server can change it). To charge: mark lessons `member`, add Stripe checkout, and have a Stripe webhook set `plan = 'member'` using the service-role key.
