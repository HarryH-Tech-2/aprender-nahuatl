import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';
import { Breadcrumbs, Faq, JsonLd } from '@/components/Seo';
import { LESSONS } from '@/content/lessons';
import { RESPUESTAS, respuestaBySlug } from '@/content/respuestas';
import { AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';

const UPDATED = '2026-11-25';

export function generateStaticParams() {
  return RESPUESTAS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<'/frases/[slug]'>): Promise<Metadata> {
  const r = respuestaBySlug((await params).slug);
  if (!r) return {};
  return {
    title: { absolute: r.title },
    description: r.description,
    alternates: { canonical: `/frases/${r.slug}` },
    openGraph: {
      type: 'article',
      title: r.title,
      description: r.description,
      images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'Ilustración de Tenochtitlan al estilo de los códices' }],
    },
  };
}

/** Render *word* as a Nahuatl word. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 ? <em key={i} lang="nah" className="nah">{part}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

export default function Page({ params }: PageProps<'/frases/[slug]'>) {
  // Read the slug inside Suspense (Cache Components), like the lesson pages; unknown slugs 404.
  return (
    <Suspense fallback={<div className="wrap py-16 font-bold">Cargando…</div>}>
      <Respuesta params={params} />
    </Suspense>
  );
}

async function Respuesta({ params }: { params: Promise<{ slug: string }> }) {
  const r = respuestaBySlug((await params).slug);
  if (!r) notFound();
  const lesson = LESSONS[r.lesson - 1];
  const single = r.rows.every((f) => !f.huasteca);
  const others = RESPUESTAS.filter((x) => x.slug !== r.slug);

  return (
    <div className="wrap py-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: r.h1,
          description: r.description,
          url: `${SITE_URL}/frases/${r.slug}`,
          inLanguage: 'es-MX',
          dateModified: UPDATED,
          image: `${SITE_URL}/img/og.jpg`,
          author: AUTHOR,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/icono.png` } },
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        }}
      />
      <Breadcrumbs trail={[['/frases', 'Frases en náhuatl'], [`/frases/${r.slug}`, r.h1.replace(/^¿|\?$/g, '')]]} />

      <div className="prose-col mt-6">
        <h1 className="text-4xl sm:text-5xl">{r.h1}</h1>
        <p className="mt-4 text-lg">{r.lead}</p>
      </div>

      {r.answer && (
        <div className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="plate p-5">
            <p className="text-sm font-bold uppercase tracking-wide opacity-70">Náhuatl central</p>
            <p lang="nah" className="nah display mt-1 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-tight [overflow-wrap:normal]">{r.answer.central}</p>
          </div>
          <div className="plate p-5">
            <p className="text-sm font-bold uppercase tracking-wide opacity-70">Náhuatl de la Huasteca</p>
            <p lang="nah" className="nah display mt-1 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-tight [overflow-wrap:normal]">{r.answer.huasteca}</p>
          </div>
        </div>
      )}

      <div className="prose-col mt-8 space-y-4">
        {r.body.map((p) => <p key={p}><Rich text={p} /></p>)}
      </div>

      <section aria-labelledby="tabla" className="mt-12">
        <h2 id="tabla" className="text-3xl">{r.tableTitle}</h2>
        <div className="plate-flat mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left">
            <caption className="sr-only">{r.tableTitle}, con su traducción al español</caption>
            <thead className="bg-amate-deep">
              <tr>
                <th scope="col" className="px-4 py-3">Español</th>
                <th scope="col" className="px-4 py-3">{single ? (r.singleColumn ?? 'Náhuatl') : 'Náhuatl central'}</th>
                {!single && <th scope="col" className="px-4 py-3">Náhuatl de la Huasteca</th>}
              </tr>
            </thead>
            <tbody>
              {r.rows.map((f) => (
                <tr key={f.es} className="border-t-2 border-ink/10 align-top">
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    {f.es}
                    {f.note && <span className="block text-sm opacity-70">{f.note}</span>}
                  </th>
                  <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.central}</span></td>
                  {!single && <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.huasteca}</span></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {r.dialogue && (
        <section aria-labelledby="ejemplo" className="mt-12">
          <h2 id="ejemplo" className="text-3xl">Un ejemplo de plática</h2>
          <div className="mt-5 grid max-w-3xl gap-4 sm:grid-cols-2">
            {(['central', 'huasteca'] as const).map((vr) => (
              <div key={vr} className="plate-flat p-4">
                <p className="text-sm font-bold uppercase tracking-wide opacity-70">{vr === 'central' ? 'Náhuatl central' : 'Náhuatl de la Huasteca'}</p>
                {r.dialogue!.map((d) => (
                  <p key={d.es} className="mt-2">
                    <span lang="nah" className="nah block">{d[vr]}</span>
                    <span className="text-sm opacity-80">{d.es}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="prose-col mt-12 space-y-3">
        <p>
          Practícalo en la{' '}
          <Link className="font-bold underline underline-offset-4" href={`/curso/${lesson.slug}`}>lección {lesson.n}: {lesson.title}</Link>{' '}
          del curso gratis, o mira todas las <Link className="font-bold underline underline-offset-4" href="/frases">frases en náhuatl</Link>.
        </p>
        <p className="rounded-xl border-2 border-dashed border-ink/50 p-3 text-sm">
          <strong>Contenido en revisión.</strong> Estas formas vienen del curso, que aún no ha sido revisado por hablantes nativos.{' '}
          <Link className="underline underline-offset-4" href="/acerca#como-hacemos">Cómo hacemos el contenido</Link>.
        </p>
      </div>

      <Faq items={r.faq} />

      <nav aria-label="Más respuestas" className="mt-14">
        <h2 className="text-2xl">También te puede interesar</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((x) => (
            <li key={x.slug}>
              <Link href={`/frases/${x.slug}`} className="inline-block rounded-full border-2 border-ink bg-stucco px-4 py-1.5 font-bold hover:bg-maize-soft">
                {x.h1.replace(/^¿Cómo se dice |\?$/g, '')}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
