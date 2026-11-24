'use client';
import { useState } from 'react';
import { useAppState } from '../AppState';
import { MAX_NUMBER, toNahuatl } from '@/lib/numbers';
import { VARIANT_NAMES } from '@/lib/variant';

function Dot() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <circle cx="12" cy="12" r="8" fill="var(--color-cochineal)" stroke="var(--color-ink)" strokeWidth="2.5" />
    </svg>
  );
}
function Flag() {
  return (
    <svg viewBox="0 0 32 44" width="32" height="44" aria-hidden>
      <path d="M7 3v38" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M8.5 5h19v17h-19z" fill="var(--color-stucco)" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8.5 10.5h19M8.5 16h19" stroke="var(--color-turquoise)" strokeWidth="2.5" />
    </svg>
  );
}
function Feather() {
  return (
    <svg viewBox="0 0 32 52" width="32" height="52" aria-hidden>
      <path d="M16 50V16" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M16 3c7 5 10 13 8 22l-8 9-8-9C6 16 9 8 16 3z"
        fill="var(--color-jade)" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path d="M16 12v20M11 18l5 5 5-5M10 25l6 6 6-6" stroke="var(--color-ink)" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function Glyphs({ count, children, label }: { count: number; children: React.ReactNode; label: string }) {
  if (!count) return null;
  return (
    <div>
      <p className="text-sm font-bold">{label}</p>
      <div className="mt-1 flex flex-wrap items-end gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={i % 5 === 4 ? 'mr-3' : ''}>{children}</span>
        ))}
      </div>
    </div>
  );
}

export function NumberTool() {
  const { variant } = useAppState();
  const [value, setValue] = useState('421');
  const result = toNahuatl(value, variant);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <div>
        <label className="label" htmlFor="numero">Escribe un número del 1 al {MAX_NUMBER.toLocaleString('es-MX')}</label>
        <input
          id="numero" className="field text-2xl font-bold" inputMode="numeric" autoComplete="off" value={value}
          aria-describedby="numero-ayuda" onChange={(e) => setValue(e.target.value)}
        />
        <p id="numero-ayuda" className="mt-2 text-sm">Variante: {VARIANT_NAMES[variant]}. Puedes cambiarla arriba.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[7, 13, 20, 52, 100, 400, 2026].map((n) => (
            <button key={n} type="button" className="btn btn-sm btn-plain" onClick={() => setValue(String(n))}>{n}</button>
          ))}
        </div>
      </div>

      <div className="plate p-5 sm:p-6" aria-live="polite">
        {!result.ok ? (
          <p className="text-lg font-bold">{result.error}</p>
        ) : (
          <>
            <p className="text-sm font-bold">{result.value.toLocaleString('es-MX')} en náhuatl</p>
            <p lang="nah" className="nah-big mt-1 text-cochineal">{result.words}</p>

            {variant === 'huasteca' && result.value >= 220 && (
              <p className="mt-2 text-sm">
                Forma reconstruida: en la Huasteca, hoy los números grandes casi siempre se dicen en español.
              </p>
            )}

            <h2 className="mt-6 text-xl">Cómo se arma</h2>
            <ul className="mt-2 space-y-1.5">
              {result.parts.map((p) => (
                <li key={p.value} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="w-16 text-right font-bold tabular-nums">{p.value.toLocaleString('es-MX')}</span>
                  <span lang="nah" className="nah text-lg">{p.words}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-xl">En glifos mexicas</h2>
            <div className="mt-3 space-y-4">
              <Glyphs count={result.glyphs.feathers} label="Plumas: 400 cada una"><Feather /></Glyphs>
              <Glyphs count={result.glyphs.flags} label="Banderas: 20 cada una"><Flag /></Glyphs>
              <Glyphs count={result.glyphs.dots} label="Puntos: 1 cada uno"><Dot /></Glyphs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
