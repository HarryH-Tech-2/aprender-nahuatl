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
      title="Números en náhuatl"
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
