'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAppState } from './AppState';
import { ANALYTICS_ON } from '@/lib/analytics';
import { reopenConsent, setConsent, useConsent, useConsentReopened } from '@/lib/consent';
import { pick, type V } from '@/lib/variant';

// "¿Sí o no?" in the learner's variant (lesson 1 vocabulary).
const TITLE: V = { central: '¿Quemah o ahmo?', huasteca: '¿Quena o axcanah?' };

/**
 * Cookie consent for Google Analytics, styled as a codex panel. Shown only when analytics is configured,
 * until the visitor answers (or reopens it from the footer). Accept and reject are equally easy.
 */
export function CookieBanner() {
  const { hydrated, variant } = useAppState();
  const consent = useConsent();
  const reopened = useConsentReopened();
  if (!ANALYTICS_ON || !hydrated || (consent !== null && !reopened)) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookies-titulo"
      aria-describedby="cookies-texto"
      className="cookie-in fixed inset-x-3 bottom-3 z-50 overflow-hidden rounded-2xl border-2 border-maize/70 bg-[#1a1613] text-amate shadow-[0_20px_60px_rgba(0,0,0,.55)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[27rem]"
    >
      <div aria-hidden className="codex-stripe h-1.5" />
      <div aria-hidden className="greca h-3 opacity-60 [background-size:24px_12px]" />
      <div className="flex gap-4 p-5">
        <span className="sign hidden h-16 w-16 shrink-0 !border-maize/70 sm:block">
          <Image src="/img/signos/08-tochtli.webp" alt="" width={128} height={128} sizes="64px" />
        </span>
        <div>
          <h2 id="cookies-titulo" lang="nah" className="display text-2xl leading-tight text-maize">{pick(TITLE, variant)}</h2>
          <p className="mt-0.5 text-sm text-amate/70">«¿Sí o no?»</p>
          <p id="cookies-texto" className="mt-3 text-[0.95rem] leading-relaxed text-amate/90">
            Usamos Google Analytics para saber cuántas personas aprenden con nosotros y qué lecciones sirven más. Si aceptas, usa
            cookies. Si no, no guarda cookies y solo cuenta tu visita de forma anónima. No mostramos publicidad.{' '}
            <Link href="/privacidad" className="font-bold text-maize underline underline-offset-4">Aviso de privacidad</Link>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pb-5">
        <button type="button" className="btn btn-red !border-2 !shadow-none" onClick={() => setConsent('granted')}>
          Aceptar
        </button>
        <button
          type="button"
          className="btn !border-2 !border-amate/60 !bg-transparent !text-amate !shadow-none hover:!bg-white/10"
          onClick={() => setConsent('denied')}
        >
          Rechazar
        </button>
      </div>
    </section>
  );
}

/** Footer link that reopens the banner. Hidden when analytics is not configured. */
export function CookiePreferencesLink({ className = '' }: { className?: string }) {
  if (!ANALYTICS_ON) return null;
  return (
    <button type="button" className={className} onClick={reopenConsent}>
      Preferencias de cookies
    </button>
  );
}
