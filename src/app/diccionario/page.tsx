import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { DictionaryList } from '@/components/tools/Lists';

export const metadata: Metadata = {
  title: { absolute: 'Diccionario náhuatl-español básico: más de 100 palabras' },
  description: 'Más de 100 palabras básicas en náhuatl central y de la Huasteca: saludos, números, familia, verbos y lugares. Busca en náhuatl o en español.',
  alternates: { canonical: '/diccionario' },
};

export default function Page() {
  return (
    <ToolPage
      sign={13}
      href="/diccionario"
      title="Diccionario náhuatl-español"
      lead={<p>Todas las palabras que enseñan las lecciones, en las dos variantes, lado a lado. No es un diccionario completo del náhuatl: es tu vocabulario de trabajo.</p>}
    >
      <DictionaryList />
    </ToolPage>
  );
}
