import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs, Faq } from '@/components/Seo';
import { LESSONS } from '@/content/lessons';
import { TEMAS } from '@/content/frases-temas';
import { RESPUESTAS } from '@/content/respuestas';

export const metadata: Metadata = {
  title: { absolute: 'Frases en náhuatl: saludos, gracias y te quiero' },
  description:
    'Frases básicas en náhuatl con traducción: hola, ¿cómo estás?, gracias, me llamo, te quiero y preguntas útiles. En náhuatl central y de la Huasteca.',
  alternates: { canonical: '/frases' },
};

const FAQ: [string, string][] = [
  ['¿Cómo se dice «hola» en náhuatl?', 'En náhuatl central se dice «niltze» (también se oye «pialli») y en náhuatl de la Huasteca, «piyali».'],
  ['¿Cómo se dice «gracias» en náhuatl?', 'En náhuatl central se dice «tlazohcamati» y en náhuatl de la Huasteca, «tlazcamati».'],
  ['¿Cómo se dice «te quiero» en náhuatl?', 'En náhuatl central se dice «nimitztlazohtla» y en náhuatl de la Huasteca, «nimitzicnelia». Se arma con ni- (yo), mitz- (a ti) y el verbo.'],
  ['¿Cómo se dice «¿cómo estás?» en náhuatl?', 'En náhuatl central se dice «¿quen ticah?» y en náhuatl de la Huasteca, «¿quenin tiitztoc?». La respuesta más sencilla es «cualli», bien.'],
  ['¿Cómo se dice «me llamo» en náhuatl?', 'Se dice «notoca» seguido de tu nombre en náhuatl central, y «notocah» en náhuatl de la Huasteca. Literalmente significa «mi nombre».'],
  ['¿Cómo se dice «mamá» en náhuatl?', '«Mi mamá» es «nonan» en náhuatl central y «nonanan» en náhuatl de la Huasteca. «Tonantzin» quiere decir «nuestra madrecita».'],
];

export default function Page() {
  return (
    <div className="wrap py-10">
      <Breadcrumbs trail={[['/frases', 'Frases en náhuatl']]} />
      <div className="prose-col mt-6">
        <h1 className="text-4xl sm:text-5xl">Frases en náhuatl con su traducción</h1>
        <p className="mt-4 text-lg">
          Las frases que más se buscan, ordenadas por tema y en las dos variantes que enseña el curso: el{' '}
          <strong>náhuatl central</strong> y el <strong>náhuatl de la Huasteca</strong>. Cuando coinciden, es la misma frase.
        </p>
        <p className="mt-3">
          Para pronunciarlas: la <em className="nah">x</em> suena «sh», la <em className="nah">tl</em> es un solo sonido y la{' '}
          <em className="nah">h</em> marca un pequeño corte de aire. Lo explica la{' '}
          <Link className="font-bold underline underline-offset-4" href="/pronunciacion">guía de pronunciación</Link>.
        </p>
      </div>

      <nav aria-label="Respuestas rápidas" className="mt-6">
        <p className="font-bold">Respuestas rápidas:</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {RESPUESTAS.map((r) => (
            <li key={r.slug}>
              <Link href={`/frases/${r.slug}`} className="inline-block rounded-full border-2 border-ink bg-maize-soft px-4 py-1.5 font-bold hover:bg-maize">
                {r.h1.replace(/^¿Cómo se dice |\?$/g, '')}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Temas" className="mt-8 flex flex-wrap gap-2">
        {TEMAS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="rounded-full border-2 border-ink bg-stucco px-4 py-1.5 font-bold hover:bg-maize-soft">
            {t.title}
          </a>
        ))}
      </nav>

      {TEMAS.map((t) => {
        const lesson = LESSONS[t.lesson - 1];
        return (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-h`} className="mt-14 scroll-mt-24">
            <h2 id={`${t.id}-h`} className="text-3xl">{t.title} en náhuatl</h2>
            <p className="prose-col mt-3">{t.intro}</p>
            <div className="plate-flat mt-5 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left">
                <caption className="sr-only">{t.title} en español, náhuatl central y náhuatl de la Huasteca</caption>
                <thead className="bg-amate-deep">
                  <tr>
                    <th scope="col" className="px-4 py-3">Español</th>
                    <th scope="col" className="px-4 py-3">Náhuatl central</th>
                    <th scope="col" className="px-4 py-3">Náhuatl de la Huasteca</th>
                  </tr>
                </thead>
                <tbody>
                  {t.items.map((f) => (
                    <tr key={f.es} className="border-t-2 border-ink/10 align-top">
                      <th scope="row" className="px-4 py-2.5 font-normal">
                        {f.es}
                        {f.note && <span className="block text-sm opacity-70">{f.note}</span>}
                      </th>
                      <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.central}</span></td>
                      <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.huasteca}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm">
              Practícalas en la{' '}
              <Link className="font-bold underline underline-offset-4" href={`/curso/${lesson.slug}`}>lección {lesson.n}: {lesson.title}</Link>.
            </p>
          </section>
        );
      })}

      <Faq items={FAQ} title="Preguntas frecuentes sobre frases en náhuatl" />
    </div>
  );
}
