'use client';
import { useMemo, useRef, useState } from 'react';
import { useAppState } from '../AppState';
import { vocabFor } from '@/lib/dictionary';
import { recordGame } from '@/lib/progress';
import { shuffle } from '@/lib/shuffle';
import { useSessionSeed } from '@/lib/store';
import { pick } from '@/lib/variant';

const PAIRS = 8;

export function Memorama() {
  const { progress, variant, update, hydrated } = useAppState();
  const seed = useSessionSeed();
  const [round, setRound] = useState(0);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completed = progress[variant].completed;

  const cards = useMemo(() => {
    const words = shuffle(vocabFor(completed), seed + round * 101).slice(0, PAIRS);
    return shuffle(
      words.flatMap((w) => [
        { id: w.id, side: 'nah' as const, text: pick(w.nah, variant) },
        { id: w.id, side: 'es' as const, text: w.es },
      ]),
      seed + round * 53,
    );
    // The deck is dealt once per round; finishing a lesson mid-game must not reshuffle it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, round, variant]);

  if (!hydrated) return <p className="font-bold">Repartiendo las cartas…</p>;

  const pairs = cards.length / 2;
  const won = matched.length === pairs;
  const points = Math.max(10, 100 - (moves - pairs) * 4);
  const best = progress[variant].games.memorama;

  function flip(i: number) {
    if (open.length === 2 || open.includes(i) || matched.includes(cards[i].id)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const total = moves + 1;
    setMoves(total);
    const [a, b] = next.map((x) => cards[x]);
    if (a.id === b.id) {
      const all = [...matched, a.id];
      setMatched(all);
      setOpen([]);
      if (all.length === pairs) update((p) => recordGame(p, variant, 'memorama', Math.max(10, 100 - (total - pairs) * 4)));
    } else {
      timer.current = setTimeout(() => setOpen([]), 1100);
    }
  }

  function again() {
    if (timer.current) clearTimeout(timer.current);
    setRound((r) => r + 1);
    setOpen([]);
    setMatched([]);
    setMoves(0);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-bold">
        <p>Movimientos: {moves}</p>
        <p>Parejas: {matched.length} de {pairs}</p>
        {best !== undefined && <p>Tu mejor puntaje: {best}</p>}
        <button type="button" className="btn btn-sm btn-plain ml-auto" onClick={again}>Repartir de nuevo</button>
      </div>

      <ul className="mx-auto mt-5 grid max-w-xl grid-cols-4 gap-2 sm:gap-3">
        {cards.map((c, i) => {
          const isMatched = matched.includes(c.id);
          const faceUp = isMatched || open.includes(i);
          return (
            <li key={`${round}-${i}`}>
              <button
                type="button"
                lang={faceUp && c.side === 'nah' ? 'nah' : undefined}
                aria-label={faceUp ? c.text : `Carta ${i + 1}, boca abajo`}
                disabled={isMatched}
                onClick={() => flip(i)}
                className={`tile aspect-[4/5] w-full !min-h-0 !px-1 text-[clamp(0.7rem,3.1vw,1.1rem)] leading-tight [overflow-wrap:anywhere] ${
                  isMatched ? 'is-right' : faceUp ? (c.side === 'nah' ? '!bg-maize-soft' : '') : '!bg-cochineal'
                }`}
              >
                {faceUp ? c.text : <span aria-hidden className="display text-2xl text-maize sm:text-4xl">?</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div role="status" className="mt-6 min-h-20">
        {won && (
          <div className="plate pop p-5">
            <p className="display text-2xl">¡Cualli! {points} puntos</p>
            <p className="mt-1">Encontraste las {pairs} parejas en {moves} movimientos.</p>
            <button type="button" className="btn btn-red mt-4" onClick={again}>Jugar otra vez</button>
          </div>
        )}
      </div>
    </div>
  );
}
