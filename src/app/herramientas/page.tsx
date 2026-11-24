import type { Metadata } from 'next';
import { ToolGrid } from '@/components/ToolGrid';

export const metadata: Metadata = {
  title: 'Herramientas gratuitas para aprender náhuatl',
  description: 'Convertidor de números, guía de pronunciación, tu signo del tonalpohualli, significado de nombres de lugares, nahuatlismos y diccionario.',
  alternates: { canonical: '/herramientas' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col">
        <h1 className="text-4xl sm:text-5xl">Herramientas</h1>
        <p className="mt-3 text-lg">Para jugar con el náhuatl fuera de las lecciones. Todas son gratuitas y no piden registro.</p>
      </div>
      <div className="mt-8"><ToolGrid /></div>
    </div>
  );
}
