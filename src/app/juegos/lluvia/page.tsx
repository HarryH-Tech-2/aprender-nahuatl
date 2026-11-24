import type { Metadata } from 'next';
import Link from 'next/link';
import { Lluvia } from '@/components/games/Lluvia';

export const metadata: Metadata = {
  title: 'Lluvia de palabras en náhuatl',
  description: 'Un juego rápido para repasar vocabulario náhuatl: elige el significado de cada palabra antes de que toque el suelo.',
  alternates: { canonical: '/juegos/lluvia' },
};

export default function Page() {
  return (
    <div className="wrap max-w-3xl py-8">
      <p className="text-sm font-bold"><Link href="/juegos" className="underline underline-offset-4">Juegos</Link> / Lluvia de palabras</p>
      <h1 className="mt-2 text-4xl">Lluvia de palabras</h1>
      <div className="mt-6"><Lluvia /></div>
    </div>
  );
}
