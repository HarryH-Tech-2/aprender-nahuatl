'use client';
import { useEffect, useState } from 'react';

const COLORS = ['#b3261e', '#14857f', '#e8ad1c', '#2c7a4b', '#fdf7e6'];

/** A one-shot burst of codex-coloured confetti from the centre of its parent. Decorative. */
export function Burst({ pieces = 22, spread = 140 }: { pieces?: number; spread?: number }) {
  return (
    <div aria-hidden className="burst">
      {Array.from({ length: pieces }, (_, i) => {
        const angle = (i / pieces) * Math.PI * 2 + ((i * 37) % 10) / 20;
        const dist = spread * (0.6 + ((i * 53) % 10) / 25);
        return (
          <span
            key={i}
            className={i % 3 === 0 ? 'is-round' : ''}
            style={{
              background: COLORS[i % COLORS.length],
              '--x': `${Math.cos(angle) * dist}px`,
              '--y': `${Math.sin(angle) * dist - spread * 0.35}px`,
              '--r': `${(i * 67) % 360}deg`,
              animationDelay: `${(i % 4) * 25}ms`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

/** A cacao bean: the Mexica used them as money, so they are this course's points. */
export function CacaoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 16 22" width={size * (16 / 22)} height={size} className="inline-block shrink-0">
      <ellipse cx="8" cy="11" rx="6.5" ry="9.5" fill="#7b3f1d" stroke="#17110c" strokeWidth="2" />
      <path d="M8 3.5v15" stroke="#c98a4b" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Counts from 0 up to `value` once, quickly; jumps straight to it for reduced motion. */
export function CountUp({ value, ms = 900 }: { value: number; ms?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = duration ? Math.min(1, (t - start) / duration) : 1;
      setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <>{shown}</>;
}
