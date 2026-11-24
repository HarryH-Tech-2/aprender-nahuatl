import Image from 'next/image';
import Link from 'next/link';
import { LessonList } from '@/components/LessonList';
import { SignWheel } from '@/components/SignWheel';
import { ToolGrid } from '@/components/ToolGrid';
import { WordOfDay } from '@/components/tools/WordOfDay';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const FAQ: [string, string][] = [
  ['¿De verdad es gratis?', 'Sí. Las ocho lecciones, los juegos y las herramientas son gratuitos y no piden tarjeta. Tampoco necesitas registrarte para empezar.'],
  ['¿Necesito saber algo antes?', 'Solo español. El curso empieza desde cero: primero cómo suenan las letras, luego saludos, y de ahí en adelante.'],
  ['¿Cuánto tiempo toma?', 'Cada lección dura unos quince minutos. Con una al día terminas el curso en poco más de una semana; lo que sigue es repasar y practicar con gente.'],
  ['¿Qué variante del náhuatl enseña?', 'Dos: el náhuatl central, cercano al clásico y a los nombres de lugares, y el de la Huasteca, que es el que más se habla hoy. Eliges una al empezar y puedes cambiar cuando quieras.'],
  ['¿El náhuatl todavía se habla?', 'Sí. Es la lengua indígena con más hablantes en México: más de un millón y medio de personas, sobre todo en Puebla, Veracruz, Hidalgo, Guerrero y San Luis Potosí.'],
  ['¿Por qué no hay audio?', 'Porque todavía no tenemos grabaciones de hablantes, y una voz de computadora pronuncia mal la tl y el saltillo. Preferimos explicarte los sonidos con cuidado que enseñártelos mal. El audio llegará.'],
  ['¿Quién revisa el contenido?', 'Las lecciones están en revisión y aún no han pasado por hablantes nativos, así que puede haber errores. Si encuentras uno, escríbenos: lo corregimos.'],
  ['¿Se guarda mi avance?', 'Se guarda en tu navegador desde el primer momento. Si creas una cuenta, te sigue en cualquier dispositivo.'],
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Curso de náhuatl para hablantes de español',
    description: 'Ocho lecciones interactivas y gratuitas para aprender náhuatl desde cero, en náhuatl central y de la Huasteca.',
    inLanguage: 'es-MX',
    isAccessibleForFree: true,
    url: `${SITE_URL}/curso`,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero: the art sits to the right; its empty paper is where the headline goes. */}
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-[#e4b26a]">
        <div className="relative aspect-[16/10] w-full md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[66%] md:[mask-image:linear-gradient(to_right,transparent,black_22%)]">
          <Image
            src="/img/hero.webp" alt="Tenochtitlan al amanecer, pintada al estilo de los códices: dos personas platican frente al lago"
            fill priority sizes="(max-width: 768px) 100vw, 66vw" className="object-cover object-[78%_center] md:object-right"
          />
        </div>
        <div className="wrap relative py-8 md:py-20 lg:py-28">
          <div className="md:max-w-[38%]">
            <h1 className="text-[clamp(2.9rem,11vw,5.25rem)] leading-[0.95]">Aprende náhuatl</h1>
            <p className="mt-4 text-xl font-bold leading-snug">
              La lengua de Tenochtitlan sigue viva. Empieza a hablarla hoy, quince minutos a la vez.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/curso/sonidos-y-saludos" className="btn btn-red">Empezar la lección 1</Link>
              <span className="font-bold">Gratis y sin registro</span>
            </div>
          </div>
        </div>
      </section>
      <div className="greca greca-red" aria-hidden />

      <section className="wrap grid gap-8 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="prose-col">
          <h2 className="text-3xl sm:text-4xl">Ya sabes más náhuatl de lo que crees</h2>
          <p className="mt-4 text-lg">
            Aguacate, chocolate, tianguis, apapachar. Xochimilco, Chapultepec, Popocatépetl. El náhuatl está en lo que comes y
            en el mapa por donde caminas. Este curso parte de ahí: de lo que ya conoces.
          </p>
          <ul className="mt-5 space-y-3">
            <li><strong>Lecciones cortas que se juegan.</strong> Armas palabras con piezas, unes parejas, ordenas frases. Nada de memorizar tablas.</li>
            <li><strong>Dos variantes.</strong> Náhuatl central o de la Huasteca: tú eliges, y puedes comparar.</li>
            <li><strong>Hecho para México.</strong> Todo explicado en español de aquí, con ejemplos de aquí.</li>
          </ul>
        </div>
        <WordOfDay />
      </section>

      <section id="curso" className="border-y-[3px] border-ink bg-amate-deep">
        <div className="wrap py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div className="prose-col">
              <h2 className="text-3xl sm:text-4xl">Veinte signos, un camino</h2>
              <p className="mt-4 text-lg">
                El curso sigue el tonalpohualli, la cuenta de los días. Cada lección lleva un signo, y cada signo que terminas
                se enciende en la rueda. Hoy hay ocho lecciones; las otras doce vienen en camino.
              </p>
              <Link href="/curso" className="btn mt-6">Ver el curso completo</Link>
            </div>
            <SignWheel />
          </div>
          <div className="mt-12"><LessonList /></div>
        </div>
      </section>

      <section className="wrap py-14">
        <div className="prose-col">
          <h2 className="text-3xl sm:text-4xl">Herramientas para jugar con el idioma</h2>
          <p className="mt-3 text-lg">¿Cómo se dice 2026 en náhuatl? ¿Qué significa Coyoacán? ¿Cuál es tu signo en el calendario mexica?</p>
        </div>
        <div className="mt-8"><ToolGrid /></div>
      </section>

      <section className="on-dark">
        <div className="greca" aria-hidden />
        <div className="wrap grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[14px] border-[3px] border-amate">
            <Image
              src="/img/familia.webp" alt="Una abuela nahua enseña a su nieta junto a la milpa, pintadas al estilo de los códices"
              width={1400} height={788} sizes="(max-width: 1024px) 100vw, 50vw" className="block h-auto w-full"
            />
          </div>
          <div className="prose-col">
            <h2 className="text-3xl sm:text-4xl">El náhuatl hoy</h2>
            <p className="mt-4 text-lg">
              No es una lengua muerta ni un recuerdo de museo. Más de un millón y medio de personas la hablan en casa, en la
              milpa, en la radio y en el salón de clases. Es la lengua indígena más hablada de México.
            </p>
            <p className="mt-3">
              Cambia de región en región, como cualquier lengua viva. Por eso aquí puedes aprender dos variantes: la{' '}
              <strong className="text-maize">central</strong>, la del Valle de México, Puebla y Milpa Alta, y la de la{' '}
              <strong className="text-maize">Huasteca</strong>, la de Veracruz, Hidalgo y San Luis Potosí.
            </p>
            <p className="mt-3">Aprenderla, aunque sea un poco, es una forma de respeto hacia quienes la han mantenido viva.</p>
            <Link href="/acerca" className="mt-5 inline-block font-bold underline">Cómo está hecho este curso</Link>
          </div>
        </div>
      </section>

      <section className="wrap py-14">
        <h2 className="text-3xl sm:text-4xl">Preguntas frecuentes</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="plate-flat group">
              <summary className="flex items-center justify-between gap-4 p-4 text-lg font-bold">
                {q}
                <span aria-hidden className="display text-2xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <Link href="/curso/sonidos-y-saludos" className="btn btn-red">Empezar la lección 1</Link>
          <p lang="nah" className="display text-2xl text-cochineal">Ma cualli ohtli</p>
          <p>Buen camino.</p>
        </div>
      </section>
    </>
  );
}
