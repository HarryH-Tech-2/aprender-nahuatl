import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPage } from '@/components/ToolPage';
import { ToponimosList } from '@/components/tools/Lists';

export const metadata: Metadata = {
  title: { absolute: '¿Qué significa tu ciudad? Nombres de lugares en náhuatl' },
  description: 'El significado de México, Xochimilco, Chapultepec, Oaxaca, Acapulco y decenas de lugares más con nombre náhuatl, desarmados pieza por pieza.',
  alternates: { canonical: '/toponimos' },
};

export default function Page() {
  return (
    <ToolPage
      sign={7}
      href="/toponimos"
      title="¿Qué significa tu ciudad?"
      faq={[
        ['¿Qué significa México en náhuatl?', 'Mexihco suele explicarse como «en el ombligo de la luna»: metztli (luna) + xictli (ombligo) + -co (en). Hay otras explicaciones, como «lugar de los mexicas».'],
        ['¿Qué significa -tlán en los nombres de lugares?', 'Viene del sufijo náhuatl -tlan, «lugar de» o «junto a»: Mazatlán es «lugar de venados». Después de l se vuelve -lan, como en Tollan (Tula).'],
        ['¿Qué significa -tepec?', 'Viene de tepetl (cerro) + -c (en): «en el cerro de». Chapultepec es «en el cerro del chapulín».'],
      ]}
      lead={
        <p>
          Miles de lugares de México tienen nombre náhuatl, y casi todos se arman igual: una o dos raíces y una terminación de
          lugar. Aquí están desarmados. (Un detalle: después de l, -tlan se vuelve -lan, como en Tollan o Tlaxcallan.) En la{' '}
          <Link className="font-bold underline" href="/curso/lugares-y-caminos">lección 7</Link> aprendes a leerlos por tu cuenta.
        </p>
      }
    >
      <ToponimosList />
    </ToolPage>
  );
}
