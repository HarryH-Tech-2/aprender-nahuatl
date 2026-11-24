'use client';
import { Fragment } from 'react';
import { useAppState } from './AppState';
import { pick, type V } from '@/lib/variant';

/** A Nahuatl word or phrase in the learner's variant. */
export function Nah({ v, className = 'nah' }: { v: V; className?: string }) {
  const { variant } = useAppState();
  return <span lang="nah" className={className}>{pick(v, variant)}</span>;
}

/** Plain text in the learner's variant (for Spanish explanations that differ by variant). */
export function Varies({ v }: { v: V }) {
  const { variant } = useAppState();
  return <>{pick(v, variant)}</>;
}

/** Renders lesson text: blank lines split paragraphs, *word* marks Nahuatl. */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i}>
          {para.split('\n').map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {line.split(/(\*[^*]+\*)/).map((bit, k) =>
                bit.startsWith('*') && bit.endsWith('*') && bit.length > 2 ? (
                  <em key={k} lang="nah" className="nah">{bit.slice(1, -1)}</em>
                ) : (
                  <Fragment key={k}>{bit}</Fragment>
                ),
              )}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
