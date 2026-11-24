import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { PronunciationGuide } from '@/components/tools/PronunciationGuide';

export const metadata: Metadata = {
  title: 'Pronunciación del náhuatl: cómo suenan tl, tz, x y el saltillo',
  description: 'Guía de pronunciación del náhuatl para hablantes de español: las 18 letras y combinaciones, con ejemplos y una prueba rápida.',
  alternates: { canonical: '/pronunciacion' },
};

export default function Page() {
  return (
    <ToolPage
      sign={2}
      title="Guía de pronunciación"
      lead={<p>El náhuatl se escribe con letras que ya conoces, pero algunas suenan distinto. Con estas dieciocho puedes leer cualquier palabra en voz alta. Marca las que ya dominas o ponte a prueba.</p>}
    >
      <PronunciationGuide />
    </ToolPage>
  );
}
