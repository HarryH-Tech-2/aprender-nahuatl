import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { PronunciationGuide } from '@/components/tools/PronunciationGuide';

export const metadata: Metadata = {
  title: { absolute: 'Alfabeto náhuatl y pronunciación: tl, tz, x y saltillo' },
  description: 'El alfabeto náhuatl explicado para hispanohablantes: las 18 letras y combinaciones, cómo suena cada una, ejemplos y una prueba rápida. Gratis.',
  alternates: { canonical: '/pronunciacion' },
};

export default function Page() {
  return (
    <ToolPage
      sign={2}
      href="/pronunciacion"
      title="Alfabeto y pronunciación del náhuatl"
      faq={[
        ['¿Cuántas letras tiene el alfabeto náhuatl?', 'En la escritura tradicional que usa este curso se necesitan unas 18 letras y combinaciones: cuatro vocales (a, e, i, o) y consonantes como c/qu, ch, cu, h, hu, l, ll, m, n, p, t, tl, tz, x, y, z. No se usan b, d, f, g, j, ñ, r ni v en palabras nativas.'],
        ['¿Cómo se pronuncia la tl en náhuatl?', 'La tl es un solo sonido: se pone la lengua como para decir t y se suelta el aire por los lados, como una l sin voz. Al final de palabra no lleva vocal: atl, no «atle».'],
        ['¿Cómo suena la x en náhuatl?', 'Suena «sh», como cuando pides silencio. Xochitl se dice «sho-chitl» y Mexihco se decía «Me-shih-co».'],
        ['¿Dónde va el acento en náhuatl?', 'Casi siempre en la penúltima sílaba, por eso no se escriben acentos: CA-lli, XO-chitl, te-POZ-tli.'],
      ]}
      lead={<p>El náhuatl se escribe con letras que ya conoces, pero algunas suenan distinto. Con estas dieciocho puedes leer cualquier palabra en voz alta. Marca las que ya dominas o ponte a prueba.</p>}
    >
      <PronunciationGuide />
    </ToolPage>
  );
}
