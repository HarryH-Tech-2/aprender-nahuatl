import type { Metadata } from 'next';
import { LessonList } from '@/components/LessonList';
import { SignWheel } from '@/components/SignWheel';
import { Breadcrumbs, Faq } from '@/components/Seo';

export const metadata: Metadata = {
  title: { absolute: 'Curso de náhuatl gratis en línea: 8 lecciones desde cero' },
  description:
    'Ocho lecciones gratis para aprender náhuatl desde cero, cada una con un signo del tonalpohualli: sonidos, saludos, números, familia, verbos y lugares.',
  alternates: { canonical: '/curso' },
};

export default function CursoPage() {
  return (
    <div className="wrap py-10">
      <Breadcrumbs trail={[['/curso', 'Curso de náhuatl']]} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="prose-col">
          <h1 className="mt-4 text-4xl sm:text-5xl">Curso de náhuatl gratis</h1>
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

      <Faq
        items={[
          ['¿El curso de náhuatl es gratis?', 'Sí. Solo te pedimos tu correo para empezar, sin tarjeta ni pagos. Tu avance se guarda en tu navegador.'],
          ['¿Qué aprendo en el curso?', 'A pronunciar el náhuatl, saludar y presentarte, contar de veinte en veinte, hablar de tu familia, usar verbos en presente, leer nombres de lugares y sostener una conversación sencilla.'],
          ['¿Cuánto dura cada lección?', 'Unos quince minutos. Cada lección mezcla explicaciones cortas con ejercicios: opción múltiple, unir parejas, armar palabras con piezas, ordenar frases y escribir.'],
          ['¿Necesito saber náhuatl antes?', 'No. El curso empieza desde cero y está explicado en español de México.'],
        ]}
      />
    </div>
  );
}
