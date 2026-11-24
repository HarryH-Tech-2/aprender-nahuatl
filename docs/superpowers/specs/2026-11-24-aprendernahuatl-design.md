# aprendernahuatl.com — design

Date: 2026-11-24. Status: awaiting approval.

Labels: **[Harry]** = decided by Harry in conversation. **[Call]** = my proposal, not yet confirmed by him.

## Intent

A website where people (mostly in Mexico) learn the Nahuatl language in a fun, interactive way. **[Harry]** Modelled on https://www.learnhieroglyphics.com/: a short themed course with a visible progress map, surrounded by free interactive tools. **[Harry]**

## Goals

- Site name and domain: aprendernahuatl.com. **[Harry]**
- All interface and teaching text in Mexican Spanish (tú form, Mexican vocabulary, no vosotros). **[Harry]**
- Teach both Central Nahuatl (Classical base, modern spelling) and Huasteca Nahuatl, with a switch. **[Harry]**
- Accounts, so progress follows the learner across devices. **[Harry]**
- Everything free at launch. **[Harry]**
- Built so a $4.99/month subscription (with an MXN equivalent) can be added later without restructuring. **[Harry]**
- A learner can start lesson 1 within seconds of landing, with no sign-up. **[Call]** (the reference site does this)

## Non-goals (v1)

- Payments, pricing page, Stripe. **[Harry]** (later)
- Store / gifts. **[Harry]**
- Free-text translator Spanish ⇄ Nahuatl. **[Call]** No reliable engine exists; a wrong translator damages trust. A small searchable dictionary replaces it.
- Recorded audio. **[Call]** No recordings exist and a Spanish text-to-speech voice mispronounces tl, tz and the saltillo. The data model carries an optional audio file per item so recordings by a speaker can be dropped in later. Pronunciation is taught in writing by comparison with Mexican Spanish sounds.
- Blog, teachers' page, tutor chatbot, embeddable widgets, English or other interface languages. **[Call]**

## Anti-goals

- Teaching wrong Nahuatl. All course content must be reviewed by a speaker or teacher before public launch; the site shows a discreet "contenido en revisión" note until Harry removes it. **[Call]**
- Presenting Nahuatl as a dead "Aztec" language. Copy treats it as a living language with about 1.7 million speakers, while still using the pre-Hispanic heritage as a hook. **[Call]**
- Copying the reference site's text, images or branding. Only its structure is the model.

## Constraints

- Never `git push`, deploy or submit to search engines without Harry's explicit say-so. Local commits are fine.
- Windows dev machine, Node 22.
- The site must be fully usable without Firebase keys (progress in the browser only), so it can be built and tested before Harry creates the Firebase project.

## Approaches considered

1. **Next.js + Firebase (Auth + Firestore) — chosen.** Same kind of site as the reference; server-rendered pages for search; local-first progress that syncs on sign-in; Stripe subscription can be added later via a webhook writing an entitlement field on the user document. Firebase chosen because Harry already has Firebase tooling installed. **[Call]** — Harry handed over the technical choices; Supabase is an equal swap if he prefers.
2. Static site with browser-only progress. Simpler, but no real accounts and subscriptions later would mean rework. Rejected: accounts are a goal.
3. Hosted course platform. Payments built in, but cannot do the interactive lessons, tools or variant switch. Rejected.

## The design

### Stack **[Call]**

- Next.js (App Router, TypeScript), Tailwind CSS, no component library.
- Firebase Auth (Google sign-in and email link) and Firestore, client SDK only. No server-side secrets in v1.
- Vitest for unit tests of the logic (number converter, calendar, answer checking, progress merge). Playwright optional, left to the builder.
- Hosting undecided (see Open items); nothing in v1 may depend on a specific host beyond "can run Next.js".

### Variants

- Two variant ids: `central` and `huasteca`.
- Every Nahuatl string in content is an object `{ central: string, huasteca: string }`; the forms may be identical. Explanatory Spanish text may also vary per variant where grammar differs (optional per-variant override).
- Spelling: `central` uses modern spelling without macrons (k/w are NOT used; c/qu, hu/uh, tz, tl, x, h for saltillo). `huasteca` uses the IDIEZ-style spelling (c/qu, hu/uh, h, tz, tl, x). **[Call]** The builder writing content should follow Launey / Karttunen for Central and IDIEZ materials for Huasteca.
- First visit: a one-screen chooser ("¿Qué náhuatl quieres aprender?") with a two-line description of each and "no sé, elige por mí" → `central`. Switchable any time from the header. Stored locally and on the account.
- Progress is tracked per variant (finishing lesson 3 in Central does not mark it done in Huasteca). **[Call]**

### Course

Theme **[Call]**: the tonalpohualli (the 20 day-signs). Each lesson is a day-sign; the progress map is a wheel of 20 signs. Completed signs are lit in colour, the next one glows, the rest are carved stone grey. v1 ships 8 lessons (signs 1–8); signs 9–20 show as "próximamente".

| # | Sign | Lesson | Teaches |
|---|------|--------|---------|
| 1 | Cipactli | Sonidos y saludos | The alphabet, tl / tz / x / hu / saltillo, stress; greetings and thanks |
| 2 | Ehecatl | Palabras que ya conoces | Nahuatl words inside Mexican Spanish; noun endings -tl, -tli, -li, -in |
| 3 | Calli | Yo soy, tú eres | Subject prefixes ni-, ti-, an-; "nouns as sentences"; plural |
| 4 | Cuetzpalin | Contar de veinte en veinte | Numbers 1–20, then base-20 up to 400 |
| 5 | Coatl | Mi casa, mi familia | Possessive prefixes no-, mo-, i-, to-; family and home words |
| 6 | Miquiztli | ¿Qué haces? | Present-tense verbs, object prefixes, negation |
| 7 | Mazatl | Lugares y caminos | Locative endings -co, -tlan, -pan, -c; reading place names |
| 8 | Tochtli | Tu primera conversación | Questions, putting it together in a short dialogue |

Each lesson is roughly 15 minutes: 20–30 steps mixing short explanation cards with exercises. Exercise types (v1):

1. Multiple choice (Nahuatl → Spanish and the reverse)
2. Match pairs
3. Build the word from pieces (prefix + stem + ending tiles) — the signature exercise, because Nahuatl is built this way
4. Arrange words into a sentence
5. Type the answer (lenient: case, accents and surrounding spaces ignored; accepted alternatives listed per item)
6. Fill the blank

Wrong answers are re-queued at the end of the lesson. Finishing shows a summary, lights the sign on the wheel, and — if the learner is not signed in — invites them to create an account to keep their progress. All 8 lessons are open in order (each unlocks the next). Lesson content lives in typed data files in the repo, one per lesson, not in the database.

Each lesson carries an `access` field (`free` | `member`); in v1 every lesson is `free`. A single `canAccess(user, lesson)` function is the only gate, so payments later change one place. **[Call]**

### Free tools **[Call]**

Nahuatl has no script to decode, so the reference site's tools are replaced by equivalents with the same "play with it and share it" appeal:

- **Guía de pronunciación** (`/pronunciacion`): every letter and digraph, a Spanish comparison, example word, plus a self-test ("0 de 18 dominados").
- **Números en náhuatl** (`/numeros`): type any number 1–7,999; shows the Nahuatl words, the base-20 breakdown, and the Mexica glyph notation (dots, flags for 20, feathers for 400) drawn as SVG.
- **Tu signo del tonalpohualli** (`/tu-signo`): enter a birth date; shows your day-sign and number (Caso correlation: the fall of Tenochtitlan, 13 Aug 1521 in the Julian calendar = 23 Aug 1521 Gregorian, is the day 1 Coatl; birth dates are entered as Gregorian. The page states which correlation it uses and that others exist), its meaning, and a shareable card. This stands in for the name translator.
- **¿Qué significa tu ciudad?** (`/toponimos`): about 80 Mexican place names of Nahuatl origin, searchable, each broken into its parts (Chapultepec = chapul-in + tepe-tl + -c, "en el cerro del chapulín").
- **Nahuatlismos** (`/nahuatlismos`): about 100 everyday Mexican Spanish words from Nahuatl with origin and meaning.
- **Diccionario** (`/diccionario`): every word taught in the course, searchable both ways, both variants shown.
- **Palabra del día** (on the home page and `/palabra-del-dia`): deterministic by date, from the course vocabulary.

### Games **[Call]**

Two in v1, both drawing on vocabulary the learner has already unlocked:

- **Memorama**: classic Mexican memory game, pairs of Nahuatl word and Spanish meaning.
- **Lluvia de palabras**: words fall; type or pick the meaning before they land. Speed rises.

### Pages

`/` home · `/curso` the wheel and lesson list · `/curso/[slug]` lesson intro (readable, indexable) · `/curso/[slug]/jugar` lesson player · the tool pages above · `/juegos`, `/juegos/memorama`, `/juegos/lluvia` · `/cuenta` account · `/acerca` · `/contacto` · `/privacidad` · `/terminos`.

Home page, top to bottom: hero (headline "Aprende náhuatl", one line of copy, button "Empieza la lección 1" + "Gratis · sin registro"), palabra del día, why learn (3 cards), the course wheel with the 8 lessons, the tools grid, short "el náhuatl hoy" section (living language, where it is spoken, the two variants), FAQ, footer.

Header: logo, Curso, Herramientas (menu), Juegos, Acerca · variant switch · "Iniciar sesión" / avatar · "Empezar".

### Look and feel **[Call]**

Not a copy of the reference's Egyptian look. Direction: codex-inspired — warm amate-paper background, ink-black text, accents drawn from codex pigments (cochineal red, turquoise, maize yellow, jade green). A characterful display serif for headings, a clean sans for body. Day-sign glyphs as original, simple SVG line drawings in a consistent style (not traced from any codex facsimile or third-party artwork). No stock photos in v1. Mobile first: most Mexican users will be on phones. The builder should use the frontend-design skill.

Tone: warm, encouraging, a little playful, Mexican ("¡Órale!", "¡Bien hecho!"), never solemn. Nahuatl praise words taught and reused ("¡Cualli!").

### Accounts and data

- Anonymous by default. Progress is kept in `localStorage`.
- Sign in with Google or email link. On first sign-in, local progress is merged into the account (union of completed lessons, max of scores/streaks); afterwards Firestore is the source of truth with the local copy as offline cache.
- Firestore: one document per user, `users/{uid}`: `displayName`, `variant`, `createdAt`, `plan: "free"` (reserved for payments), `progress: { central: {...}, huasteca: {...} }` holding completed lesson ids, best score per lesson, pronunciation self-test state, streak (current, longest, last active date), game high scores. Security rules: a user can read and write only their own document, and cannot write `plan`.
- `/cuenta`: name, variant, progress summary, sign out, delete account (deletes the document and the auth user).
- If Firebase config env vars are absent, sign-in UI is hidden and everything else works.

### SEO basics

Per-page Spanish titles and descriptions, `lang="es-MX"`, sitemap, robots, Open Graph image, structured data for the course and FAQ. No submission to search engines.

## Left to the builder

- Exact lesson scripts, vocabulary lists and exercise items, within the syllabus above (each item flagged for speaker review).
- Component structure, state management, file layout.
- Exact palette values, fonts, glyph drawings, animations.
- Copy for all pages, in Mexican Spanish.
- Test selection beyond the logic listed under Stack.

## Open items for Harry (none block building)

1. Create a Firebase project and supply the web config, when ready to turn accounts on.
2. Where to host (Vercel, Firebase App Hosting, other).
3. Find a Nahuatl speaker/teacher to review content, and to record audio later.
4. Contact email address to show on `/contacto`.
5. Name of the person or company that operates the site, for `/privacidad` and `/terminos`. Until supplied, those pages are drafted with clearly marked placeholders and must be completed before launch.
6. Analytics. **[Call]** v1 ships with no analytics or tracking, so no cookie banner is needed; adding it later is a separate decision.
