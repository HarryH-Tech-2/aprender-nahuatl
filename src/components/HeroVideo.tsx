'use client';
import { useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'an.heroIntro.v1';

type Phase = 'intro' | 'world';

/**
 * Home hero background. On the first visit of a session the temple doors open (intro clip, played once) and
 * the scene crossfades into a seamless loop of the Aztec world beyond them. Later visits in the same session go
 * straight to the world. People who ask for reduced motion get the still of the world, nothing plays.
 * Moving content longer than 5 s must be pausable, hence the button.
 */
export function HeroVideo() {
  const intro = useRef<HTMLVideoElement>(null);
  const world = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show the world still without playing anything.
      const t = setTimeout(() => setPhase('world'), 0);
      return () => clearTimeout(t);
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Storage blocked: just play the intro.
    }
    // Mark it seen only once it actually starts (inside the timeout), so a cancelled first run of this effect
    // (React StrictMode in dev) does not skip the intro.
    const t = setTimeout(() => {
      if (seen) {
        setPhase('world');
        world.current?.play().catch(() => {});
      } else {
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch {
          // Ignore.
        }
        intro.current?.play().catch(() => {
          // Autoplay blocked: skip to the world still/loop.
          setPhase('world');
        });
      }
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
        className={`${common} hero-drift ${phase === 'world' ? 'opacity-100' : 'opacity-0'} ${playing && phase === 'world' ? '' : '[animation-play-state:paused]'}`}
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
        className={`${common} ${phase === 'intro' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
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
