'use client';
import { useMemo, useState } from 'react';
import type { Step } from '@/content/types';
import { isCorrect, normalize } from '@/lib/answers';
import { shuffle } from '@/lib/shuffle';
import { pick, type Variant } from '@/lib/variant';

type Common = {
  variant: Variant;
  seed: number;
  /** True once the step has been answered; inputs freeze and show the result. */
  locked: boolean;
  /** Report the result. `answer` is the right answer to show if it was wrong. */
  onAnswer: (correct: boolean, answer: string) => void;
};

function CheckButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="btn btn-red mt-6 w-full sm:w-auto" disabled={disabled} onClick={onClick}>
      Comprobar
    </button>
  );
}

// ---- multiple choice and fill-the-blank -------------------------------

export function ChoiceExercise({ step, variant, seed, locked, onAnswer }: Common & { step: Extract<Step, { type: 'choice' | 'blank' }> }) {
  const order = useMemo(() => shuffle(step.options.map((_, i) => i), seed), [step, seed]);
  const [selected, setSelected] = useState<number | null>(null);
  const answerText = pick(step.options[step.answer], variant);

  return (
    <div>
      {step.type === 'blank' ? (
        <>
          <p className="font-bold">Completa la frase</p>
          <p lang="nah" className="nah-big mt-3">
            {pick(step.sentence, variant).replace('___', locked ? answerText : '_____')}
          </p>
          <p className="mt-2 text-lg">{step.es}</p>
        </>
      ) : (
        <>
          <p className="text-xl font-bold">{step.prompt}</p>
          {step.nah && <p lang="nah" className="nah-big mt-3">{pick(step.nah, variant)}</p>}
        </>
      )}
      <div role="radiogroup" aria-label="Opciones" className="mt-6 grid gap-3 sm:grid-cols-2">
        {order.map((i) => {
          const state = !locked ? '' : i === step.answer ? 'is-right' : i === selected ? 'is-wrong' : '';
          return (
            <button
              key={i} type="button" role="radio" aria-checked={selected === i} disabled={locked}
              className={`tile ${state}`} onClick={() => setSelected(i)}
            >
              {pick(step.options[i], variant)}
            </button>
          );
        })}
      </div>
      {!locked && <CheckButton disabled={selected === null} onClick={() => onAnswer(selected === step.answer, answerText)} />}
    </div>
  );
}

// ---- match pairs --------------------------------------------------------

export function MatchExercise({ step, variant, seed, locked, onAnswer }: Common & { step: Extract<Step, { type: 'match' }> }) {
  const left = useMemo(() => shuffle(step.pairs.map((_, i) => i), seed), [step, seed]);
  const right = useMemo(() => shuffle(step.pairs.map((_, i) => i), seed + 7), [step, seed]);
  const [pickedLeft, setPickedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);

  function chooseRight(i: number) {
    if (pickedLeft === null || locked) return;
    if (i === pickedLeft) {
      const next = [...matched, i];
      setMatched(next);
      setPickedLeft(null);
      setWrong(null);
      if (next.length === step.pairs.length) onAnswer(mistakes === 0, '');
    } else {
      setWrong([pickedLeft, i]);
      setMistakes((m) => m + 1);
      setPickedLeft(null);
    }
  }

  return (
    <div>
      <p className="text-xl font-bold">Une cada palabra con su significado</p>
      <p className="mt-1">Toca una palabra en náhuatl y luego su traducción.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="grid gap-3">
          {left.map((i) => (
            <button
              key={i} type="button" lang="nah" disabled={matched.includes(i) || locked}
              aria-pressed={pickedLeft === i}
              className={`tile ${matched.includes(i) ? 'is-right' : wrong?.[0] === i ? 'is-wrong' : ''}`}
              onClick={() => { setPickedLeft(i); setWrong(null); }}
            >
              {pick(step.pairs[i].nah, variant)}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {right.map((i) => (
            <button
              key={i} type="button" disabled={matched.includes(i) || locked}
              className={`tile !font-normal ${matched.includes(i) ? 'is-right' : wrong?.[1] === i ? 'is-wrong' : ''}`}
              onClick={() => chooseRight(i)}
            >
              {step.pairs[i].es}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="mt-4 min-h-6 font-bold">
        {wrong && 'Esa pareja no va. Prueba otra.'}
      </p>
    </div>
  );
}

// ---- build a word / order a sentence -------------------------------------

export function TilesExercise({ step, variant, seed, locked, onAnswer }: Common & { step: Extract<Step, { type: 'build' | 'order' }> }) {
  const joiner = step.type === 'build' ? '' : ' ';
  const bank = useMemo(
    () => shuffle([...step.pieces, ...(step.extra ?? [])].map((p, id) => ({ id, text: pick(p, variant) })), seed),
    [step, variant, seed],
  );
  const [picked, setPicked] = useState<number[]>([]);
  const target = step.pieces.map((p) => pick(p, variant)).join(joiner);
  const text = (id: number) => bank.find((b) => b.id === id)!.text;
  const given = picked.map(text).join(joiner);

  return (
    <div>
      <p className="font-bold">{step.prompt}</p>
      <p className="mt-2 text-2xl font-bold">{step.es}</p>

      <div
        aria-label="Tu respuesta" aria-live="polite"
        className={`mt-6 flex min-h-[4.5rem] flex-wrap items-center rounded-xl border-[3px] border-dashed border-ink/60 bg-stucco/60 p-2.5 ${step.type === 'build' ? 'gap-0.5' : 'gap-2'}`}
      >
        {picked.length === 0 && <span className="px-2 opacity-60">Toca las piezas en orden</span>}
        {picked.map((id) => (
          <button
            key={id} type="button" lang="nah" disabled={locked} className="tile !min-h-12"
            aria-label={`Quitar ${text(id)}`} onClick={() => setPicked((p) => p.filter((x) => x !== id))}
          >
            {text(id)}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {bank.map((b) => {
          const used = picked.includes(b.id);
          return (
            <button
              key={b.id} type="button" lang="nah" disabled={used || locked}
              className={`tile ${used ? 'is-used' : ''}`} onClick={() => setPicked((p) => [...p, b.id])}
            >
              {b.text}
            </button>
          );
        })}
      </div>
      {!locked && <CheckButton disabled={picked.length === 0} onClick={() => onAnswer(normalize(given) === normalize(target), target)} />}
    </div>
  );
}

// ---- type the answer ------------------------------------------------------

export function TypeExercise({ step, variant, locked, onAnswer }: Common & { step: Extract<Step, { type: 'type' }> }) {
  const [value, setValue] = useState('');
  const accepted = step.accepted[variant];
  const submit = () => onAnswer(isCorrect(value, accepted), accepted[0]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!locked && value.trim()) submit(); }}>
      <label htmlFor="respuesta" className="block text-xl font-bold">{step.prompt}</label>
      <input
        id="respuesta" lang="nah" className="field mt-5" value={value} readOnly={locked}
        autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="done"
        placeholder="Escribe aquí" onChange={(e) => setValue(e.target.value)}
      />
      <p className="mt-2 text-sm opacity-75">No importan las mayúsculas ni los signos.</p>
      {!locked && <button type="submit" className="btn btn-red mt-4 w-full sm:w-auto" disabled={!value.trim()}>Comprobar</button>}
    </form>
  );
}
