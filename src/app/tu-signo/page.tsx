import type { Metadata } from 'next';
import { Prose, ToolPage } from '@/components/ToolPage';
import { SignoTool } from '@/components/tools/SignoTool';

export const metadata: Metadata = {
  title: 'Tu signo azteca: calcula tu día en el tonalpohualli',
  description: 'Pon tu fecha de nacimiento y descubre tu signo y tu número en el tonalpohualli, el calendario de 260 días de los mexicas. Gratis y sin registro.',
  alternates: { canonical: '/tu-signo' },
};

export default function Page() {
  return (
    <ToolPage
      sign={17}
      title="Tu signo del tonalpohualli"
      lead={<p>Cada día del calendario mexica tiene un número del 1 al 13 y uno de veinte signos. Pon tu fecha de nacimiento y descubre el tuyo.</p>}
    >
      <SignoTool />
      <Prose>
        <h2>Qué es el tonalpohualli</h2>
        <p>
          <em className="nah">Tonalpohualli</em> quiere decir «cuenta de los días» (<em className="nah">tonalli</em>, día;{' '}
          <em className="nah">pohualli</em>, cuenta). Combina trece números con veinte signos, así que tarda 260 días en repetirse.
          A cada recién nacido se le daba el nombre de su día: por eso hay personajes que se llaman 8 Venado o 1 Caña.
        </p>
        <h2>Cómo se calcula</h2>
        <p>
          Usamos la correlación de Alfonso Caso, la más aceptada: toma como referencia la caída de Tenochtitlan, que fue el día
          1 Coatl (13 de agosto de 1521 en el calendario juliano de la época; 23 de agosto en el nuestro), y cuenta los días
          desde ahí sin interrupciones. Existen otras correlaciones que dan resultados distintos, y los estudiosos discuten si
          el calendario antiguo hacía ajustes por los años bisiestos.
        </p>
        <p>
          Tómalo como lo que es: una puerta de entrada a la cultura nahua, no un horóscopo. Las descripciones de cada signo son
          un resumen de lo que cuentan las fuentes antiguas.
        </p>
      </Prose>
    </ToolPage>
  );
}
