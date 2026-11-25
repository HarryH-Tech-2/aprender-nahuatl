'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'world';

/**
 * Home hero background. On every visit the temple doors open (intro clip, played once per page load) and the
 * scene crossfades into a seamless loop of the city beyond them. People who ask for reduced motion get the still
 * of the city straight away (CSS hides the doors, so there is no flash of them first) and nothing plays.
 * Moving content longer than 5 s must be pausable, hence the button.
 */
export function HeroVideo() {
  const intro = useRef<HTMLVideoElement>(null);
  const world = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => setPhase('world'), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      intro.current?.play().catch(() => {
        // Autoplay blocked: show the city instead of frozen doors.
        setPhase('world');
      });
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function toWorld() {
    setPhase('world');
    world.current?.play().catch(() => {});
  }

  function toggle() {
    const v = phase === 'intro' ? intro.current : world.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  }

  const common = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000';
  return (
    <>
      <video
        ref={world}
        className={`${common} motion-reduce:opacity-100 ${phase === 'world' ? 'opacity-100' : 'opacity-0'}`}
        poster="/video/world-poster.webp"
        muted loop playsInline preload="auto" aria-hidden tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/video/world-960.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/world.mp4" type="video/mp4" />
      </video>
      <video
        ref={intro}
        className={`${common} motion-reduce:hidden ${phase === 'intro' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        poster="/video/intro-poster.webp"
        muted playsInline preload="auto" aria-hidden tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => phase === 'intro' && setPlaying(false)}
        onEnded={toWorld}
      >
        <source src="/video/intro-960.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/intro.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-black/45 text-white backdrop-blur-sm hover:bg-black/65"
        aria-label={playing ? 'Pausar el video' : 'Reproducir el video'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
          {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
        </svg>
      </button>
    </>
  );
}
