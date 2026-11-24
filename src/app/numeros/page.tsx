import type { Metadata } from 'next';
import Link from 'next/link';
import { Prose, ToolPage } from '@/components/ToolPage';
import { NumberTool } from '@/components/tools/NumberTool';

export const metadata: Metadata = {
  title: 'Números en náhuatl: convertidor del 1 al 7,999',
  description: 'Escribe cualquier número y míralo en náhuatl, con su desglose de veinte en veinte y en glifos mexicas: puntos, banderas y plumas.',
  alternates: { canonical: '/numeros' },
};

export default function Page() {
  return (
    <ToolPage
      sign={4}
      href="/numeros"
      title="Números en náhuatl"
      faq={[
        ['¿Cuáles son los números del 1 al 10 en náhuatl?', 'En náhuatl central: ce (1), ome (2), yei (3), nahui (4), macuilli (5), chicuace (6), chicome (7), chicuei (8), chiucnahui (9) y mahtlactli (10). En la Huasteca, 3 es eyi y 8 es chicueyi.'],
        ['¿Cómo se dice 20 en náhuatl?', 'Veinte es cempohualli, «una cuenta». El náhuatl cuenta de veinte en veinte: 40 es ompohualli, 60 yepohualli y 100 macuilpohualli (cinco veintenas).'],
        ['¿Por qué el náhuatl cuenta de 20 en 20?', 'Porque su sistema es vigesimal: cuenta con los dedos de las manos y de los pies. 400 (veinte veintenas) se dice centzontli y 8,000 se representaba con una bolsa de copal.'],
      ]}
      lead={<p>Escribe un número y míralo en palabras, armado pieza por pieza, y dibujado como lo anotaban los mexicas.</p>}
    >
      <NumberTool />
      <Prose>
        <h2>Cómo cuenta el náhuatl</h2>
        <p>
          El sistema es vigesimal: en lugar de agrupar de diez en diez, agrupa de veinte en veinte, los dedos de manos y pies.
          Hay nombres propios para 5 (<em className="nah">macuilli</em>), 10 (<em className="nah">mahtlactli</em>),
          15 (<em className="nah">caxtolli</em>), 20 (<em className="nah">cempohualli</em>, «una cuenta») y
          400 (<em className="nah">centzontli</em>, «una cabellera»). Todo lo demás se arma sumando y multiplicando.
        </p>
        <h2>Los glifos</h2>
        <p>
          En los códices de tributos, un punto vale 1, una bandera vale 20 y una pluma vale 400. Para anotar 421 se dibujaba
          una pluma, una bandera y un punto. Había un cuarto signo, la bolsa de copal, para 8,000.
        </p>
        <h2>Una nota sobre las variantes</h2>
        <p>
          El náhuatl central une las partes con <em className="nah">on-</em> e <em className="nah">ipan</em>; el de la Huasteca usa{' '}
          <em className="nah">huan</em>, «y». Hoy, en el habla diaria, los números grandes casi siempre se dicen en español;
          las formas en náhuatl se enseñan en las escuelas bilingües. La <Link className="font-bold underline" href="/curso/contar-de-veinte-en-veinte">lección 4</Link> lo explica paso a paso.
        </p>
      </Prose>
    </ToolPage>
  );
}
