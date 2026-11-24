import type { Metadata } from 'next';
import { LessonList } from '@/components/LessonList';
import { SignWheel } from '@/components/SignWheel';

export const metadata: Metadata = {
  title: 'Curso de náhuatl: ocho lecciones interactivas',
  description:
    'El curso completo: ocho lecciones gratuitas para aprender náhuatl desde cero, cada una con un signo del tonalpohualli. Sonidos, saludos, números, familia, verbos y lugares.',
  alternates: { canonical: '/curso' },
};

export default function CursoPage() {
  return (
    <div className="wrap py-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="prose-col">
          <h1 className="text-4xl sm:text-5xl">El curso</h1>
          <p className="mt-4 text-lg">
            El tonalpohualli, la cuenta de los días, tiene veinte signos. Cada lección que terminas enciende uno.
            Empiezas por Cipactli, el caimán, y avanzas en orden: cada lección abre la siguiente.
          </p>
          <p className="mt-3">
            Hoy hay ocho lecciones, de unos quince minutos cada una. Los doce signos restantes llegarán después.
          </p>
        </div>
        <SignWheel />
      </div>

      <h2 className="mt-14 text-3xl">Las lecciones</h2>
      <div className="mt-6">
        <LessonList />
      </div>
    </div>
  );
}
