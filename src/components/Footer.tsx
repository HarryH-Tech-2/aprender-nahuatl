import Image from 'next/image';
import Link from 'next/link';
import { SIGNS } from '@/content/signs';
import { TOOLS } from '@/lib/site';
import { CookiePreferencesLink } from './CookieBanner';

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Aprender',
    links: [
      ['/curso/sonidos-y-saludos', 'Lección 1: Sonidos y saludos'],
      ['/curso', 'Curso de náhuatl gratis'],
      ['/guia', 'Guía para aprender náhuatl'],
      ['/frases', 'Frases en náhuatl'],
      ['/juegos', 'Juegos'],
      ['/palabra-del-dia', 'Palabra del día'],
    ],
  },
  { title: 'Herramientas', links: TOOLS.map((t) => [t.href, t.title]) },
  {
    title: 'El sitio',
    links: [
      ['/acerca', 'Acerca del curso'],
      ['/contacto', 'Contacto'],
      ['/privacidad', 'Aviso de privacidad'],
      ['/terminos', 'Términos de uso'],
    ],
  },
];

export function Footer() {
  // The 20 day-signs twice over, so the band can scroll forever without a gap.
  const band = [...SIGNS, ...SIGNS];
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#1a1613] text-amate">
      <div aria-hidden className="codex-stripe h-1.5" />

      {/* A slow procession of the 20 day-signs. */}
      <div aria-hidden className="group relative overflow-hidden border-b border-amate/10 py-6">
        <div className="marquee flex w-max gap-5 group-hover:[animation-play-state:paused]">
          {band.map((s, i) => (
            <Image
              key={i} src={s.img} alt="" width={128} height={128} sizes="64px"
              className="h-16 w-16 rounded-2xl opacity-60 grayscale-[60%] transition duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1a1613]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1a1613]" />
      </div>

      <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p lang="nah" className="display text-[clamp(2.5rem,6vw,4rem)] leading-none text-maize">Ma cualli ohtli</p>
          <p className="mt-2 text-lg text-amate/80">«Que tengas buen camino».</p>
          <p className="mt-6 max-w-sm leading-relaxed text-amate/75">
            Un curso gratuito para acercarse al náhuatl, la lengua indígena más hablada de México, en español y desde cero.
          </p>
          <Link href="/curso/sonidos-y-saludos" className="btn btn-red mt-7">Empezar la lección 1</Link>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-4 text-sm font-bold text-maize">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-[0.95rem] text-amate/80 transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-amate/10">
        <div className="wrap flex flex-col gap-3 py-6 text-sm text-amate/65 md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="text-amate/90">Contenido en revisión.</strong> Las lecciones aún no las revisan hablantes nativos.{' '}
            <Link className="underline underline-offset-4 hover:text-white" href="/contacto">Avísanos de un error</Link>.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <CookiePreferencesLink className="underline underline-offset-4 hover:text-white" />
            <p>© 2026 aprendernahuatl.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
