'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppState } from './AppState';
import { VARIANT_NAMES, VARIANTS } from '@/lib/variant';

const NAV = [
  { href: '/curso', label: 'Curso' },
  { href: '/frases', label: 'Frases' },
  { href: '/herramientas', label: 'Herramientas' },
  { href: '/juegos', label: 'Juegos' },
  { href: '/guia', label: 'Guía' },
];

export function VariantSwitch({ dark = false }: { dark?: boolean }) {
  const { variant, setVariant } = useAppState();
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <span className="sr-only">Variante de náhuatl</span>
      <select
        className={
          dark
            ? 'cursor-pointer rounded-full border border-amate/30 bg-white/5 px-3 py-1.5 text-sm font-bold text-amate hover:border-maize [&>option]:text-ink'
            : 'rounded-lg border-[3px] border-ink bg-stucco px-2 py-1.5 font-bold'
        }
        value={variant}
        onChange={(e) => setVariant(e.target.value as (typeof VARIANTS)[number])}
      >
        {VARIANTS.map((v) => (
          <option key={v} value={v}>{VARIANT_NAMES[v]}</option>
        ))}
      </select>
    </label>
  );
}

function AccountLink() {
  const { accountsEnabled, account, openSignIn } = useAppState();
  if (!accountsEnabled) return null;
  const cls = 'text-sm font-bold text-amate/85 underline-offset-4 hover:text-maize hover:underline';
  return account ? (
    <Link href="/cuenta" className={cls}>Mi cuenta</Link>
  ) : (
    <button type="button" className={cls} onClick={() => openSignIn(true)}>Iniciar sesión</button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inLesson = pathname.endsWith('/jugar');
  const overHero = pathname === '/' && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 text-amate transition-[background-color,box-shadow] duration-300 ${
        overHero ? 'bg-transparent' : scrolled || open ? 'bg-basalt/95 shadow-[0_8px_30px_rgba(0,0,0,.35)] backdrop-blur-md' : 'bg-basalt'
      }`}
    >
      <div className="wrap flex h-16 items-center gap-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/img/icono.png" alt="" width={40} height={40} priority
            className="rounded-[10px] ring-2 ring-maize/70 transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="display text-xl leading-none tracking-wide">
            Aprender <span className="text-maize">Náhuatl</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const current = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={current ? 'page' : undefined}
                className="group relative px-3 py-2 font-bold text-amate/85 transition-colors hover:text-white aria-[current=page]:text-white"
              >
                {n.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-0.5 h-[3px] origin-left scale-x-0 rounded-full bg-maize transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                />
              </Link>
            );
          })}
          </nav>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          {/* Not during a lesson: switching variant there would restart it. */}
          {!inLesson && <VariantSwitch dark />}
          <AccountLink />
          {!inLesson && (
            <Link href="/curso/sonidos-y-saludos" className="btn-gold">
              Empezar gratis
            </Link>
          )}
        </div>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-amate/30 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-amate transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-amate transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-amate transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      <div aria-hidden className={`codex-stripe h-1 transition-opacity duration-300 ${overHero ? 'opacity-0' : ''}`} />

      {/* Mobile menu: animates open by growing its grid row from 0fr to 1fr. */}
      <div
        id="menu-movil"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="wrap flex flex-col gap-4 py-5">
            <nav aria-label="Principal" className="flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="display border-b border-amate/10 py-3 text-2xl text-amate hover:text-maize"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            {!inLesson && <VariantSwitch dark />}
            <AccountLink />
            {!inLesson && (
              <Link href="/curso/sonidos-y-saludos" onClick={() => setOpen(false)} className="btn btn-red">
                Empezar gratis
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
