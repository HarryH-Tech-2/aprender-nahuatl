'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppState } from './AppState';

/** Pages that can be read without choosing a variant first. */
const QUIET = ['/', '/acerca', '/contacto', '/privacidad', '/terminos', '/cuenta', '/herramientas', '/juegos', '/tu-signo', '/nahuatlismos', '/toponimos'];

export function VariantChooser() {
  const { hydrated, hasChosenVariant, setVariant } = useAppState();
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const show = hydrated && !hasChosenVariant && !QUIET.includes(pathname);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (show && !d.open) d.showModal();
    if (!show && d.open) d.close();
  }, [show]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="elige-variante"
      onCancel={(e) => e.preventDefault()}
      className="plate m-auto w-[min(34rem,calc(100vw-2rem))] p-6 backdrop:bg-ink/60"
    >
      <h2 id="elige-variante" className="text-3xl">¿Qué náhuatl quieres aprender?</h2>
      <p className="mt-2">El náhuatl cambia de una región a otra. Puedes cambiar de variante cuando quieras; tu avance se guarda por separado.</p>
      <div className="mt-5 grid gap-4">
        <button type="button" className="tile flex-col !items-start !text-left" onClick={() => setVariant('central')}>
          <span className="display text-xl">Náhuatl central</span>
          <span className="mt-1 text-base font-normal">
            El del Valle de México, Puebla y Milpa Alta; el más cercano al náhuatl clásico y a los nombres de lugares.
          </span>
        </button>
        <button type="button" className="tile flex-col !items-start !text-left" onClick={() => setVariant('huasteca')}>
          <span className="display text-xl">Náhuatl de la Huasteca</span>
          <span className="mt-1 text-base font-normal">
            El de Veracruz, Hidalgo y San Luis Potosí: la variante con más hablantes hoy.
          </span>
        </button>
      </div>
      <button type="button" className="mt-5 font-bold underline underline-offset-4" onClick={() => setVariant('central')}>
        No sé, elige por mí
      </button>
    </dialog>
  );
}
