import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos para avisar de un error en las lecciones, proponer una mejora o colaborar como hablante o docente.',
  alternates: { canonical: '/contacto' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col space-y-4">
        <h1 className="text-4xl sm:text-5xl">Contacto</h1>
        <p className="text-lg">¿Encontraste un error? ¿Hablas náhuatl y quieres ayudar a revisar? ¿Tienes una idea? Escríbenos.</p>
        <p className="plate p-5 text-xl font-bold">
          {CONTACT_EMAIL ? <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : '[PENDIENTE: correo de contacto]'}
        </p>
        <p>
          Si es por un error en una lección, dinos cuál lección, en qué variante (central o Huasteca) y cuál sería la forma
          correcta. Nos ayuda mucho saber de dónde eres o dónde aprendiste.
        </p>
      </div>
    </div>
  );
}
