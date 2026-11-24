'use client';
import { useState } from 'react';
import { useAppState } from '../AppState';
import { PRONUNCIACION } from '@/content/pronunciacion';
import { markKnown } from '@/lib/progress';
import { shuffle } from '@/lib/shuffle';
import { useSessionSeed } from '@/lib/store';
import { pick } from '@/lib/variant';

function Quiz() {
  const { progress, variant, update } = useAppState();
  const seed = useSessionSeed();
  const known = progress[variant].known;
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);

  const pending = PRONUNCIACION.filter((p) => !known.includes(p.id));
  const pool = pending.length ? pending : PRONUNCIACION;
  const target = pool[(seed + round * 7) % pool.length];
  const options = shuffle(
    [target, ...shuffle(PRONUNCIACION.filter((p) => p.id !== target.id), seed + round).slice(0, 2)],
    seed + round * 13,
  );
  const answered = chosen !== null;

  function choose(id: string) {
    if (answered) return;
    setChosen(id);
    if (id === target.id) update((p) => markKnown(p, variant, target.id, true));
  }

  return (
    <section className="plate p-5 sm:p-6" aria-labelledby="prueba">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="prueba" className="text-2xl">Prueba rápida</h2>
        <p className="font-bold">{known.filter((k) => PRONUNCIACION.some((p) => p.id === k)).length} de {PRONUNCIACION.length} dominados</p>
      </div>
      <p className="mt-3">¿Cómo suena esta letra?</p>
      <p lang="nah" className="nah-big text-cochineal">{target.letters}</p>
      <div className="mt-4 grid gap-3">
        {options.map((o) => (
          <button
            key={o.id} type="button" disabled={answered}
            className={`tile !justify-start !text-left !text-base !font-normal ${answered && o.id === target.id ? 'is-right' : answered && o.id === chosen ? 'is-wrong' : ''}`}
            onClick={() => choose(o.id)}
          >
            {pick(o.sounds, variant)}
          </button>
        ))}
      </div>
      <div role="status" className="mt-4 flex min-h-12 flex-wrap items-center gap-4">
        {answered && (
          <>
            <span className="font-bold">
              {chosen === target.id ? '¡Cualli!' : 'Casi.'} Ejemplo: <span lang="nah" className="nah">{pick(target.example, variant)}</span>, «{target.exampleEs}».
            </span>
            <button type="button" className="btn btn-sm" onClick={() => { setChosen(null); setRound((r) => r + 1); }}>Otra</button>
          </>
        )}
      </div>
    </section>
  );
}

export function PronunciationGuide() {
  const { progress, variant, update, hydrated } = useAppState();
  const known = progress[variant].known;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-start">
      <ul className="grid gap-4 sm:grid-cols-2">
        {PRONUNCIACION.map((p) => {
          const isKnown = known.includes(p.id);
          return (
            <li key={p.id} className={`plate-flat p-4 ${isKnown ? '!bg-jade-soft' : ''}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p lang="nah" className="display text-3xl text-cochineal">{p.letters}</p>
                <p className="text-right"><span lang="nah" className="nah">{pick(p.example, variant)}</span> <span className="text-sm">«{p.exampleEs}»</span></p>
              </div>
              <p className="mt-2">{pick(p.sounds, variant)}</p>
              {p.tip && <p className="mt-1 text-sm opacity-80">{pick(p.tip, variant)}</p>}
              <label className="mt-3 flex items-center gap-2 text-sm font-bold">
                <input
                  type="checkbox" className="h-5 w-5 accent-[var(--color-jade)]" checked={isKnown} disabled={!hydrated}
                  onChange={(e) => update((pr) => markKnown(pr, variant, p.id, e.target.checked))}
                />
                Ya la domino
              </label>
            </li>
          );
        })}
      </ul>
      <div className="lg:sticky lg:top-4">{hydrated && <Quiz />}</div>
    </div>
  );
}
