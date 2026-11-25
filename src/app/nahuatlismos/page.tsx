import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPage } from '@/components/ToolPage';
import { NahuatlismosList } from '@/components/tools/Lists';

export const metadata: Metadata = {
  title: { absolute: 'Nahuatlismos: más de 100 palabras que vienen del náhuatl' },
  description: 'Aguacate, chocolate, tianguis, apapachar, cuate, papalote: la lista de palabras del español de México que vienen del náhuatl, con su origen y significado.',
  alternates: { canonical: '/nahuatlismos' },
};

export default function Page() {
  return (
    <ToolPage
      sign={20}
      href="/nahuatlismos"
      title="Nahuatlismos"
      faq={[
        ['¿Qué es un nahuatlismo?', 'Es una palabra que el español tomó del náhuatl, como aguacate (ahuacatl), chocolate, tomate (tomatl), chile (chilli) o tianguis (tianquiztli).'],
        ['¿Cuántas palabras del español vienen del náhuatl?', 'Cientos, sobre todo en el español de México: nombres de comida, animales, plantas, objetos de la casa y muchos lugares. Algunas, como chocolate, tomate o aguacate, pasaron a casi todos los idiomas del mundo.'],
      ]}
      lead={
        <p>
          Palabras que usas todos los días y que el español de México tomó del náhuatl. Cada una con la palabra original y lo que
          quería decir. La <Link className="font-bold underline" href="/curso/palabras-que-ya-conoces">lección 2</Link> usa varias para
          enseñarte cómo terminan los sustantivos.
        </p>
      }
    >
      <NahuatlismosList />
    </ToolPage>
  );
}
