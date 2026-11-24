import type { Metadata } from 'next';
import Link from 'next/link';
import { WordOfDay } from '@/components/tools/WordOfDay';

export const metadata: Metadata = {
  title: 'Palabra del día en náhuatl',
  description: 'Una palabra en náhuatl cada día, con su significado en español y la lección donde se aprende.',
  alternates: { canonical: '/palabra-del-dia' },
};

export default function Page() {
  return (
    <div className="wrap max-w-3xl py-10">
      <h1 className="text-4xl sm:text-5xl">Palabra del día</h1>
      <p className="mt-3 text-lg">Una palabra del curso cada día. Cambia a la medianoche, hora del centro de México.</p>
      <div className="mt-8"><WordOfDay big /></div>
      <p className="mt-8">
        ¿Quieres más? Todas están en el <Link className="font-bold underline" href="/diccionario">diccionario del curso</Link>.
      </p>
    </div>
  );
}
