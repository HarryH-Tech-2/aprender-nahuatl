import type { Metadata } from 'next';
import Link from 'next/link';
import { Memorama } from '@/components/games/Memorama';

export const metadata: Metadata = {
  title: 'Memorama en náhuatl',
  description: 'Juega memorama con palabras en náhuatl y su significado en español. Gratis, para repasar el vocabulario del curso.',
  alternates: { canonical: '/juegos/memorama' },
};

export default function Page() {
  return (
    <div className="wrap max-w-3xl py-8">
      <p className="text-sm font-bold"><Link href="/juegos" className="underline underline-offset-4">Juegos</Link> / Memorama</p>
      <h1 className="mt-2 text-4xl">Memorama</h1>
      <p className="mt-2">Voltea dos cartas. Si una es la palabra en náhuatl y la otra su significado, se quedan. Menos movimientos, más puntos.</p>
      <div className="mt-6"><Memorama /></div>
    </div>
  );
}
