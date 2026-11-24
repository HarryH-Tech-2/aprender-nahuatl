import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SIGNS } from '@/content/signs';

export const metadata: Metadata = {
  title: 'Juegos para practicar náhuatl',
  description: 'Memorama y lluvia de palabras: dos juegos gratuitos para repasar el vocabulario náhuatl que vas aprendiendo.',
  alternates: { canonical: '/juegos' },
};

const GAMES = [
  { href: '/juegos/memorama', title: 'Memorama', blurb: 'Encuentra las parejas: cada palabra en náhuatl con su significado. Sin prisa.', sign: 11 },
  { href: '/juegos/lluvia', title: 'Lluvia de palabras', blurb: 'Las palabras caen del cielo. Atrapa su significado antes de que toquen el suelo.', sign: 19 },
];

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col">
        <h1 className="text-4xl sm:text-5xl">Juegos</h1>
        <p className="mt-3 text-lg">
          Dos maneras de repasar. Usan las palabras de las lecciones que ya terminaste; si apenas empiezas, juegas con las de la lección 1.
        </p>
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {GAMES.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="plate flex h-full items-center gap-5 p-5 hover:bg-maize-soft">
              <span className="sign w-24 shrink-0" style={{ aspectRatio: '1' }}>
                <Image src={SIGNS[g.sign - 1].img} alt="" width={192} height={192} sizes="96px" />
              </span>
              <span>
                <span className="display block text-2xl">{g.title}</span>
                <span className="mt-1 block">{g.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
