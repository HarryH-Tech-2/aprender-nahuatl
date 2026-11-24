'use client';
import { useState } from 'react';
import { useAppState } from '../AppState';
import { vocabFor } from '@/lib/dictionary';
import { recordGame } from '@/lib/progress';
import { shuffle } from '@/lib/shuffle';
import { useSessionSeed } from '@/lib/store';
import { pick } from '@/lib/variant';

const LIVES = 3;

/** Restarts when the variant changes, so a game never mixes two variants' words. */
export function Lluvia() {
  const { variant } = useAppState();
  return <LluviaGame key={variant} />;
}

function LluviaGame() {
  const { progress, variant, update, hydrated } = useAppState();
  const seed = useSessionSeed();
  const [game, setGame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [last, setLast] = useState('');

  if (!hydrated) return <p className="font-bold">Preparando la lluvia…</p>;

  const pool = vocabFor(progress[variant].completed);
  const deck = shuffle(pool, seed + game * 977);
  const word = deck[round % deck.length];
  const options = shuffle(
    [word, ...shuffle(pool.filter((w) => w.id !== word.id && w.es !== word.es), seed + round * 17 + game).slice(0, 2)],
    seed + round * 29 + game,
  );
  const seconds = Math.max(2.6, 7.5 - score * 0.3);
  const over = lives === 0;
  const best = progress[variant].games.lluvia;

  function start() {
    setGame((g) => g + 1);
    setRound(0);
    setScore(0);
    setLives(LIVES);
    setLast('');
    setPlaying(true);
  }

  function miss(reason: string) {
    const left = lives - 1;
    setLives(left);
    setLast(`${reason} «${pick(word.nah, variant)}» es «${word.es}».`);
    if (left === 0) {
      setPlaying(false);
      update((p) => recordGame(p, variant, 'lluvia', score));
    } else setRound((r) => r + 1);
  }

  function choose(id: string) {
    if (id !== word.id) return miss('No era esa.');
    setScore((s) => s + 1);
    setLast('¡Cualli!');
    setRound((r) => r + 1);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-bold">
        <p>Puntos: {score}</p>
        <p aria-label={`Vidas: ${lives}`}>Vidas: <span aria-hidden className="text-cochineal">{'●'.repeat(lives)}{'○'.repeat(LIVES - lives)}</span></p>
        {best !== undefined && <p>Tu récord: {best}</p>}
      </div>

      <div className="plate-flat relative mt-4 h-72 overflow-hidden !bg-turquoise-soft sm:h-80">
        {playing ? (
          <p
            key={`${game}-${round}`}
            lang="nah"
            className="falling display absolute inset-x-0 top-0 px-3 text-center text-4xl text-ink [--drop:15rem] sm:[--drop:17rem]"
            style={{ animationDuration: `${seconds}s` }}
            onAnimationEnd={() => miss('Se te fue.')}
          >
            {pick(word.nah, variant)}
          </p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            {over ? (
              <>
                <p className="display text-3xl">Se acabó la lluvia: {score} {score === 1 ? 'punto' : 'puntos'}</p>
                <button type="button" className="btn btn-red" onClick={start}>Jugar otra vez</button>
              </>
            ) : (
              <>
                <p className="text-lg">Las palabras caen. Elige su significado antes de que toquen el suelo. Tienes tres vidas y cada vez caen más rápido.</p>
                <button type="button" className="btn btn-red" onClick={start}>Empezar</button>
              </>
            )}
          </div>
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-3 bg-jade" />
      </div>

      <p role="status" className="mt-3 min-h-7 font-bold">{last}</p>

      {playing && (
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {options.map((o) => (
            <button key={`${round}-${o.id}`} type="button" className="tile !font-normal" onClick={() => choose(o.id)}>
              {o.es}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
