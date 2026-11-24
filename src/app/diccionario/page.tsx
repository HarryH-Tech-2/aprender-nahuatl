import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { DictionaryList } from '@/components/tools/Lists';

export const metadata: Metadata = {
  title: 'Diccionario náhuatl-español del curso',
  description: 'Todo el vocabulario del curso, en náhuatl central y de la Huasteca, con búsqueda en náhuatl y en español.',
  alternates: { canonical: '/diccionario' },
};

export default function Page() {
  return (
    <ToolPage
      sign={13}
      title="Diccionario del curso"
      lead={<p>Todas las palabras que enseñan las lecciones, en las dos variantes, lado a lado. No es un diccionario completo del náhuatl: es tu vocabulario de trabajo.</p>}
    >
      <DictionaryList />
    </ToolPage>
  );
}
