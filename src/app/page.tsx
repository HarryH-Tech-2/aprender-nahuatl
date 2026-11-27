import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HeroVideo } from '@/components/HeroVideo';
import { LessonList } from '@/components/LessonList';
import { SignWheel } from '@/components/SignWheel';
import { ToolGrid } from '@/components/ToolGrid';
import { WordOfDay } from '@/components/tools/WordOfDay';
import { LESSONS } from '@/content/lessons';
import { FRASES, PALABRAS } from '@/content/frases';
import { toNahuatl } from '@/lib/numbers';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Aprende náhuatl: curso en línea desde cero, lección 1 gratis' },
  description:
    'Curso de náhuatl en español: lección 1 gratis y curso completo de 8 lecciones interactivas, con frases, números y pronunciación. Náhuatl central o de la Huasteca, desde cero.',
  alternates: { canonical: '/' },
};

/** Number words 1–10 in both variants, from the same generator the number tool uses. */
const NUMEROS = Array.from({ length: 10 }, (_, i) => {
  const c = toNahuatl(i + 1, 'central');
  const h = toNahuatl(i + 1, 'huasteca');
  return { n: i + 1, central: c.ok ? c.words : '', huasteca: h.ok ? h.words : '' };
});

const PASOS: { title: string; body: string; href: string; link: string }[] = [
  {
    title: 'Aprende a leerlo en voz alta',
    body: 'El náhuatl se escribe con letras que ya conoces. Basta con dominar unos pocos sonidos nuevos: la tl, la tz, la x que suena «sh» y el saltillo.',
    href: '/pronunciacion',
    link: 'Guía de pronunciación',
  },
  {
    title: 'Empieza por lo que ya sabes',
    body: 'Aguacate, tianguis y Chapultepec son náhuatl. Partir de las palabras que ya usas hace que la gramática se entienda sola.',
    href: '/curso/palabras-que-ya-conoces',
    link: 'Lección 2: Palabras que ya conoces',
  },
  {
    title: 'Arma palabras con piezas',
    body: 'El náhuatl pega prefijos y raíces para formar oraciones completas en una sola palabra: ni-mitz-itta, «te veo». Una vez que ves las piezas, todo encaja.',
    href: '/curso',
    link: 'Las ocho lecciones',
  },
  {
    title: 'Repasa un poco cada día',
    body: 'Quince minutos diarios rinden más que una tarde a la semana. Los juegos y la palabra del día están para eso.',
    href: '/juegos',
    link: 'Juegos para repasar',
  },
];

const FAQ: [string, string][] = [
  [
    '¿Qué es el náhuatl?',
    'El náhuatl es una lengua indígena de México, de la familia yuto-nahua. Fue la lengua de los mexicas y de Tenochtitlan, y hoy la hablan más de 1.6 millones de personas, lo que la hace la lengua indígena más hablada del país.',
  ],
  [
    '¿Se puede aprender náhuatl gratis en línea?',
    'En parte. En Aprender Náhuatl la lección 1, los juegos y las herramientas son gratis y están en español. El curso completo, con las ocho lecciones, cuesta MXN $89 al mes o MXN $299 una sola vez, de por vida (IVA incluido).',
  ],
  [
    '¿Es difícil aprender náhuatl?',
    'Para quien habla español, la pronunciación es sencilla: casi todas las letras suenan igual. Lo nuevo es la gramática, porque las palabras se forman pegando piezas. Una vez que entiendes ese sistema, avanzar es rápido.',
  ],
  [
    '¿Cuánto tiempo se tarda en aprender náhuatl?',
    'Con quince minutos al día terminas este curso inicial en poco más de una semana y puedes saludar, presentarte, contar y hablar de tu familia. Conversar con soltura toma meses de práctica con hablantes.',
  ],
  [
    '¿Cómo se dice «gracias» en náhuatl?',
    'En náhuatl central se dice «tlazohcamati» y en náhuatl de la Huasteca, «tlazcamati». Para responder «de nada» o simplemente «bien», se usa «cualli».',
  ],
  [
    '¿Cómo se dice «te quiero» en náhuatl?',
    'En náhuatl central se dice «nimitztlazohtla» y en náhuatl de la Huasteca, «nimitzicnelia». Las dos se arman igual: ni- (yo) + mitz- (a ti) + el verbo.',
  ],
  [
    '¿Dónde se habla náhuatl hoy?',
    'Sobre todo en Puebla, Veracruz, Hidalgo, San Luis Potosí y Guerrero, y también en el Estado de México, Tlaxcala, Morelos, Oaxaca y la Ciudad de México, además de comunidades migrantes en Estados Unidos.',
  ],
  [
    '¿Náhuatl, mexicano o azteca: cuál es el nombre correcto?',
    '«Náhuatl» es el nombre más usado. Muchos hablantes llaman a su lengua «mexicano» o «mexicanoh». «Azteca» se refiere a un pueblo, no a la lengua: no existe un «idioma azteca» aparte del náhuatl.',
  ],
  [
    '¿Qué variante de náhuatl conviene aprender?',
    'Depende de para qué. El náhuatl central sirve para leer textos clásicos y entender los nombres de lugares; el de la Huasteca es el que más se habla hoy. En este curso eliges una y puedes cambiar cuando quieras.',
  ],
  [
    '¿El náhuatl es una lengua oficial de México?',
    'Sí. Desde 2003 la Ley General de Derechos Lingüísticos de los Pueblos Indígenas reconoce al náhuatl y a las demás lenguas indígenas como lenguas nacionales, con la misma validez que el español.',
  ],
  [
    '¿Por qué el curso no tiene audio?',
    'Porque todavía no tenemos grabaciones de hablantes, y una voz de computadora pronuncia mal la tl y el saltillo. Preferimos explicarte los sonidos con cuidado que enseñártelos mal. El audio llegará.',
  ],
  [
    '¿Quién revisa el contenido?',
    'Las lecciones están en revisión y aún no han pasado por hablantes nativos, así que puede haber errores. Si encuentras uno, escríbenos: lo corregimos.',
  ],
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es-MX',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Curso de náhuatl para hablantes de español',
    description:
      'Curso interactivo para aprender náhuatl desde cero: pronunciación, saludos, números, familia, verbos, nombres de lugares y conversación. En náhuatl central y de la Huasteca.',
    url: `${SITE_URL}/curso`,
    inLanguage: 'es-MX',
    isAccessibleForFree: false,
    educationalLevel: 'Principiante',
    coursePrerequisites: 'Ninguno. Solo hablar español.',
    teaches: ['Pronunciación del náhuatl', 'Saludos y frases básicas', 'Números en náhuatl', 'Prefijos de persona y posesión', 'Verbos en presente', 'Nombres de lugares de México'],
    numberOfLessons: LESSONS.length,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    offers: [
      { '@type': 'Offer', category: 'Subscription', price: '89', priceCurrency: 'MXN', url: `${SITE_URL}/curso` },
      { '@type': 'Offer', category: 'Paid', price: '299', priceCurrency: 'MXN', url: `${SITE_URL}/curso` },
    ],
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'PT2H' },
    hasPart: LESSONS.map((l) => ({
      '@type': 'LearningResource',
      name: `Lección ${l.n}: ${l.title}`,
      url: `${SITE_URL}/curso/${l.slug}`,
      timeRequired: `PT${l.minutes}M`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

function SectionHead({ id, title, children }: { id?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-[48rem]">
      <h2 id={id} className="text-3xl sm:text-4xl">{title}</h2>
      {children && <div className="mt-4 space-y-3 text-lg">{children}</div>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero: a symmetrical temple scene with everything centred over it; the navbar floats on top. */}
      <section className="relative isolate -mt-[68px] flex min-h-[min(100svh,56rem)] items-center justify-center overflow-hidden bg-[#120d09] text-white">
        <HeroVideo />
        {/* Darken the middle for the text, and fade the bottom into the page. */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_50%_52%,rgba(10,6,3,.72),rgba(10,6,3,.25)_70%,transparent)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amate via-amate/60 to-transparent" />

        <div className="wrap relative flex flex-col items-center pb-28 pt-36 text-center">
          <h1 className="flex flex-col items-center [text-shadow:0_4px_30px_rgba(0,0,0,.6)]">
            <span className="font-sans text-[clamp(2.75rem,9vw,6.5rem)] font-normal leading-none tracking-tight text-white">Aprende</span>
            <span className="hero-gold display -mt-1 text-[clamp(3.5rem,13vw,9rem)] leading-[0.95]">náhuatl</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.7)] sm:text-xl">
            De Tenochtitlan a tu calle: la lengua de los mexicas sigue viva en más de un millón y medio de voces. Aprende a
            hablarla con lecciones interactivas, desde cero y en español. La primera es gratis.
          </p>
          <Link href="/curso/sonidos-y-saludos" className="hero-cta group mt-10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#3a2410]/70 bg-[#1a1008]">
              <Image src="/img/icono.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
            </span>
            <span className="text-left">
              <span className="block text-xl font-bold leading-tight">Empezar el curso</span>
              <span className="block text-sm opacity-80">Lección 1 gratis · sin registro. Central o Huasteca.</span>
            </span>
          </Link>
          <Link href="/curso" className="mt-5 text-sm font-bold text-white/85 underline underline-offset-4 hover:text-maize">
            Ver las 8 lecciones
          </Link>
        </div>
      </section>

      {/* Answer-first definition: what AI answers and featured snippets quote. */}
      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1.25fr_1fr] lg:items-start" aria-labelledby="que-es">
        <SectionHead id="que-es" title="¿Qué es el náhuatl?">
          <p>
            <strong>El náhuatl es una lengua indígena de México, de la familia yuto-nahua.</strong> Fue la lengua de los mexicas y
            de Tenochtitlan, y la lengua franca de buena parte de Mesoamérica. Hoy la hablan más de 1.6 millones de personas: es la
            lengua indígena más hablada del país.
          </p>
          <p>
            No es una sola forma de hablar. El INALI reconoce 30 variantes, que cambian de una región a otra como cambia el español
            entre Sonora y Yucatán. Este curso enseña dos: el <strong>náhuatl central</strong>, cercano al clásico, y el{' '}
            <strong>náhuatl de la Huasteca</strong>, el de más hablantes hoy.
          </p>
        </SectionHead>
        <dl className="plate-flat divide-y-2 divide-ink/10 text-base">
          {[
            ['Hablantes', '1,651,958 personas de 3 años o más (INEGI, Censo 2020)'],
            ['Dónde', 'Puebla, Veracruz, Hidalgo, San Luis Potosí, Guerrero y otros estados'],
            ['Familia', 'Yuto-nahua, emparentada con lenguas del norte de México y EE. UU.'],
            ['Variantes', '30, según el Catálogo de las Lenguas Indígenas Nacionales del INALI'],
            ['Estatus', 'Lengua nacional, con la misma validez que el español (ley de 2003)'],
            ['Alfabeto', 'Latino; cuatro vocales y sonidos como tl, tz y el saltillo'],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-3">
              <dt className="font-bold">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y-[3px] border-ink bg-stucco" aria-labelledby="como-aprender">
        <div className="wrap py-16">
          <SectionHead id="como-aprender" title="Cómo aprender náhuatl desde cero">
            <p>
              Si hablas español, ya tienes la mitad del camino. Este es el orden que sigue el curso, y el que te recomendamos. Para más
              detalle, lee la{' '}
              <Link className="font-bold underline underline-offset-4" href="/guia">guía completa para aprender náhuatl desde cero</Link>.
            </p>
          </SectionHead>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <li key={p.title} className="border-t-[3px] border-ink pt-4">
                <p className="display text-4xl text-cochineal" aria-hidden>{i + 1}</p>
                <h3 className="mt-2 text-xl">{p.title}</h3>
                <p className="mt-2">{p.body}</p>
                <Link href={p.href} className="mt-3 inline-block font-bold underline underline-offset-4">{p.link}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="curso" className="bg-amate-deep" aria-labelledby="curso-titulo">
        <div className="wrap py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <SectionHead id="curso-titulo" title="Un curso de náhuatl en ocho lecciones">
              <p>
                Cada lección dura unos quince minutos y lleva el nombre de un signo del tonalpohualli, la cuenta de los días
                mexica. Lees una explicación corta, practicas y armas palabras con piezas; al terminar, el signo se enciende en la rueda.
              </p>
              <p>Tu avance se guarda en el navegador desde el primer minuto. Las otras doce lecciones vienen en camino.</p>
            </SectionHead>
            <SignWheel />
          </div>
          <div className="mt-12"><LessonList /></div>
        </div>
      </section>

      <section className="wrap py-16" aria-labelledby="frases">
        <SectionHead id="frases" title="Frases básicas en náhuatl">
          <p>
            Para saludar, presentarte y dar las gracias. Las dos columnas muestran cómo se dice en cada variante; cuando coinciden,
            es la misma frase.
          </p>
        </SectionHead>
        <div className="plate-flat mt-8 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">Frases básicas en español, náhuatl central y náhuatl de la Huasteca</caption>
            <thead className="bg-amate-deep">
              <tr>
                <th scope="col" className="px-4 py-3">Español</th>
                <th scope="col" className="px-4 py-3">Náhuatl central</th>
                <th scope="col" className="px-4 py-3">Náhuatl de la Huasteca</th>
              </tr>
            </thead>
            <tbody>
              {FRASES.map((f) => (
                <tr key={f.es} className="border-t-2 border-ink/10">
                  <th scope="row" className="px-4 py-2.5 font-normal">{f.es}</th>
                  <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.central}</span></td>
                  <td className="px-4 py-2.5"><span lang="nah" className="nah">{f.huasteca}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Más de 40 frases, por tema, en{' '}
          <Link className="font-bold underline underline-offset-4" href="/frases">frases en náhuatl</Link>. Las aprendes con ejercicios en la{' '}
          <Link className="font-bold underline underline-offset-4" href="/curso/sonidos-y-saludos">lección 1: Sonidos y saludos</Link>.
        </p>
      </section>

      <section className="border-y-[3px] border-ink bg-stucco" aria-labelledby="numeros">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHead id="numeros" title="Los números del 1 al 10 en náhuatl">
            <p>
              El náhuatl cuenta de veinte en veinte, con los dedos de manos y pies. Del 1 al 5 hay nombres propios; del 6 al 9 se dice
              «cinco y uno», «cinco y dos»…; y el 10, <em className="nah">mahtlactli</em>, son las dos manos.
            </p>
            <p>
              Veinte es <em className="nah">cempohualli</em>, «una cuenta», y 400 es <em className="nah">centzontli</em>, «una
              cabellera»: por eso el cenzontle es el pájaro de las cuatrocientas voces.
            </p>
            <p>
              <Link className="font-bold underline underline-offset-4" href="/numeros">Convierte cualquier número al náhuatl</Link>
            </p>
          </SectionHead>
          <ol className="plate-flat grid grid-cols-1 divide-y-2 divide-ink/10 sm:grid-cols-2 sm:divide-y-0">
            {NUMEROS.map((x) => (
              <li key={x.n} className="flex items-baseline gap-4 px-4 py-2.5 sm:border-b-2 sm:border-ink/10">
                <span className="display w-8 text-right text-2xl">{x.n}</span>
                <span>
                  <span lang="nah" className="nah block text-lg">{x.central}</span>
                  {x.huasteca !== x.central && <span className="block text-sm">Huasteca: <span lang="nah">{x.huasteca}</span></span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start" aria-labelledby="palabras">
        <div>
          <SectionHead id="palabras" title="Palabras en náhuatl que ya usas">
            <p>
              El español de México tomó cientos de palabras del náhuatl. Casi siempre la terminación <em className="nah">-tl</em> se
              volvió <em>-te</em>: <em className="nah">tomatl</em>, tomate; <em className="nah">coyotl</em>, coyote.
            </p>
          </SectionHead>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {PALABRAS.map(([es, nah, gloss]) => (
              <li key={es} className="flex flex-wrap items-baseline gap-x-2 border-b-2 border-ink/10 py-2">
                <strong>{es}</strong>
                <span>de</span>
                <span lang="nah" className="nah">{nah}</span>
                <span className="text-sm opacity-80">({gloss})</span>
              </li>
            ))}
          </ul>
          <p className="mt-5">
            <Link className="font-bold underline underline-offset-4" href="/nahuatlismos">Ver más de 100 nahuatlismos</Link>
            {' '}o descubre{' '}
            <Link className="font-bold underline underline-offset-4" href="/toponimos">qué significa el nombre de tu ciudad</Link>.
          </p>
        </div>
        <WordOfDay />
      </section>

      <section className="border-t-[3px] border-ink bg-amate-deep" aria-labelledby="herramientas">
        <div className="wrap py-16">
          <SectionHead id="herramientas" title="Herramientas gratuitas">
            <p>¿Cómo se dice 2026 en náhuatl? ¿Qué significa Coyoacán? ¿Cuál es tu signo en el calendario mexica?</p>
          </SectionHead>
          <div className="mt-8"><ToolGrid /></div>
        </div>
      </section>

      <section className="on-dark" aria-labelledby="hoy">
        <div className="greca" aria-hidden />
        <div className="wrap grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[14px] border-[3px] border-amate">
            <Image
              src="/img/familia.webp" alt="Una abuela nahua enseña a su nieta junto a la milpa, pintadas al estilo de los códices"
              width={1400} height={788} sizes="(max-width: 1024px) 100vw, 50vw" className="block h-auto w-full"
            />
          </div>
          <div className="max-w-[44rem]">
            <h2 id="hoy" className="text-3xl sm:text-4xl">El náhuatl hoy: una lengua viva</h2>
            <p className="mt-4 text-lg">
              No es una lengua muerta ni un recuerdo de museo. Se habla en casa, en la milpa, en el mercado, en la radio comunitaria
              y en las escuelas bilingües. Hay poesía, rap y novelas escritas en náhuatl.
            </p>
            <p className="mt-3">
              Pero cada generación la hablan menos niños: muchas familias dejaron de enseñarla por la discriminación que sufrieron.
              Aprenderla, aunque sea un poco, y usarla con respeto ayuda a que vuelva a ser motivo de orgullo.
            </p>
            <Link href="/acerca" className="mt-5 inline-block font-bold underline">Cómo está hecho este curso</Link>
          </div>
        </div>
      </section>

      <section className="wrap py-16" aria-labelledby="preguntas">
        <h2 id="preguntas" className="text-3xl sm:text-4xl">Preguntas frecuentes sobre el náhuatl</h2>
        <div className="mt-8 grid gap-3 lg:grid-cols-2 lg:items-start">
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq plate-flat transition-colors">
              <summary className="flex items-center justify-between gap-4 p-4 text-lg font-bold">
                <h3 className="font-sans text-lg font-bold">{q}</h3>
                <span aria-hidden className="faq-icon display text-2xl text-cochineal">+</span>
              </summary>
              <p className="px-4 pb-5 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 max-w-4xl text-sm">
          <h2 className="font-sans text-base font-bold">Fuentes</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>INEGI, Censo de Población y Vivienda 2020: hablantes de lenguas indígenas.</li>
            <li>INALI, Catálogo de las Lenguas Indígenas Nacionales (2008).</li>
            <li>Ley General de Derechos Lingüísticos de los Pueblos Indígenas (2003).</li>
            <li>Michel Launey, Introducción a la lengua y a la literatura náhuatl; Frances Karttunen, An Analytical Dictionary of Nahuatl.</li>
            <li>Materiales del Instituto de Docencia e Investigación Etnológica de Zacatecas (IDIEZ) para el náhuatl de la Huasteca.</li>
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-5">
          <Link href="/curso/sonidos-y-saludos" className="btn btn-red">Empezar la lección 1</Link>
          <p lang="nah" className="display text-2xl text-cochineal">Ma cualli ohtli</p>
          <p>Buen camino.</p>
        </div>
      </section>
    </>
  );
}
