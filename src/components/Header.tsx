'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppState } from './AppState';
import { VARIANT_NAMES, VARIANTS } from '@/lib/variant';

const NAV = [
  { href: '/curso', label: 'Curso' },
  { href: '/herramientas', label: 'Herramientas' },
  { href: '/juegos', label: 'Juegos' },
  { href: '/acerca', label: 'Acerca' },
];

export function VariantSwitch() {
  const { variant, setVariant } = useAppState();
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <span className="sr-only">Variante de náhuatl</span>
      <select
        className="rounded-lg border-[3px] border-ink bg-stucco px-2 py-1.5 font-bold"
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

function AccountButton() {
  const { accountsEnabled, account, openSignIn } = useAppState();
  if (!accountsEnabled) return null;
  return account ? (
    <Link href="/cuenta" className="btn btn-sm btn-plain">Mi cuenta</Link>
  ) : (
    <button type="button" className="btn btn-sm btn-plain" onClick={() => openSignIn(true)}>Iniciar sesión</button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inLesson = pathname.endsWith('/jugar');

  return (
    <header className="border-b-[3px] border-ink bg-amate">
      <div className="wrap flex items-center gap-3 py-2.5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/img/icono.png" alt="" width={44} height={44} className="rounded-[10px] border-[3px] border-ink" priority />
          <span className="display text-xl leading-none sm:text-2xl">Aprender<br className="sm:hidden" /> Náhuatl</span>
        </Link>

        {!inLesson && (
          <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname.startsWith(n.href) ? 'page' : undefined}
                className="rounded-lg px-3 py-2 font-bold hover:bg-maize-soft aria-[current=page]:bg-maize-soft"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {/* Not during a lesson: switching variant there would restart it. */}
          {!inLesson && <VariantSwitch />}
          <AccountButton />
        </div>

        <button
          type="button"
          className="btn btn-sm btn-plain ml-auto lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      {open && (
        <div id="menu-movil" className="wrap flex flex-col gap-3 border-t-[3px] border-ink py-4 lg:hidden">
          <nav aria-label="Principal" className="flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-lg font-bold hover:bg-maize-soft">
                {n.label}
              </Link>
            ))}
          </nav>
          {!inLesson && <VariantSwitch />}
          <AccountButton />
        </div>
      )}
    </header>
  );
}
