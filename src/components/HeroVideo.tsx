'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Full-bleed background video for the home hero. It plays muted and looped, never starts for people who
 * ask for reduced motion, and has a visible pause control (moving content longer than 5 s must be pausable).
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.play().catch(() => {
      // Autoplay blocked (data saver, low power): the poster stays, the button still works.
    });
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }

  return (
    <>
      <video
        ref={ref}
        className={`hero-drift absolute inset-0 h-full w-full object-cover ${playing ? '' : '[animation-play-state:paused]'}`}
        poster="/video/hero-poster.webp"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/video/hero-960.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
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
