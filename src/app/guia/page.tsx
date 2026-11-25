import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs, Faq, JsonLd } from '@/components/Seo';
import { AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';

const TITLE = 'Cómo aprender náhuatl desde cero: guía para principiantes';
const UPDATED = '2026-11-24';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description:
    'Guía para aprender náhuatl si hablas español: qué variante elegir, cómo se pronuncia, cómo funciona la gramática, un plan de cuatro semanas y recursos.',
  alternates: { canonical: '/guia' },
  // Setting openGraph here replaces the site default, so the share image must be repeated.
  openGraph: {
    type: 'article',
    title: TITLE,
    images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'Ilustración de Tenochtitlan al estilo de los códices' }],
  },
};

const FAQ: [string, string][] = [
  [
    '¿Por dónde empiezo a aprender náhuatl?',
    'Empieza por la pronunciación y los saludos: con unos pocos sonidos nuevos (tl, tz, x y el saltillo) ya puedes leer cualquier palabra. Después aprende los prefijos de persona (ni- yo, ti- tú) y los posesivos (no- mi, mo- tu), que aparecen en casi todas las frases.',
  ],
  [
    '¿Cuánto tiempo al día debo estudiar náhuatl?',
    'Quince minutos diarios funcionan mejor que una sesión larga a la semana. Con ese ritmo, en cuatro semanas puedes saludar, presentarte, contar, hablar de tu familia y entender cómo se arman los verbos.',
  ],
  [
    '¿Puedo aprender náhuatl solo, sin maestro?',
    'Puedes aprender las bases por tu cuenta con un curso en línea, pero para hablar con soltura necesitas escuchar y practicar con hablantes. Busca radios comunitarias, grupos de conversación o cursos de universidades y casas de cultura de tu región.',
  ],
  [
    '¿El náhuatl clásico y el moderno son el mismo idioma?',
    'Son la misma lengua en distintas épocas. El náhuatl clásico es el que se escribió en el siglo XVI en el centro de México; las variantes modernas descienden de él y de otras formas regionales, y cambiaron en vocabulario, pronunciación y algunas terminaciones.',
  ],
  [
    '¿Qué es el saltillo en náhuatl?',
    'Es un pequeño corte de aire, parecido al que se hace entre las sílabas de «oh-oh». Se escribe con h: «ahmo» (no), «quemah» (sí). En la Huasteca suena más bien como una jota muy suave.',
  ],
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="mt-14 scroll-mt-24 text-3xl">{children}</h2>;
}

const TOC: [string, string][] = [
  ['por-que', 'Por qué aprender náhuatl'],
  ['variante', 'Qué variante elegir'],
  ['pronunciacion', 'Cómo se pronuncia'],
  ['gramatica', 'Cómo funciona la gramática'],
  ['plan', 'Un plan de cuatro semanas'],
  ['errores', 'Errores comunes al empezar'],
  ['recursos', 'Recursos para seguir'],
];

export default function Page() {
  return (
    <article className="wrap py-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: TITLE,
          inLanguage: 'es-MX',
          datePublished: UPDATED,
          dateModified: UPDATED,
          author: AUTHOR,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/icono.png` } },
          image: `${SITE_URL}/video/world-poster.webp`,
          mainEntityOfPage: `${SITE_URL}/guia`,
        }}
      />
      <Breadcrumbs trail={[['/guia', 'Guía para aprender náhuatl']]} />

      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,40rem)_1fr]">
        <div className="space-y-4 text-lg leading-relaxed [&_li]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:space-y-2">
          <h1 className="text-4xl sm:text-5xl">{TITLE}</h1>
          <p className="text-base opacity-75">Actualizada el 24 de noviembre de 2026</p>

          <p className="plate-flat p-5 text-lg">
            <strong>En resumen:</strong> para aprender náhuatl desde cero, elige una variante (central o de la Huasteca), aprende
            primero los pocos sonidos que no existen en español, luego los prefijos que dicen quién hace qué (ni-, ti-, no-, mo-),
            y practica quince minutos al día con frases completas. Lo que más ayuda después es escuchar a hablantes.
          </p>

          <H2 id="por-que">Por qué aprender náhuatl</H2>
          <p>
            El náhuatl es la lengua indígena más hablada de México: más de 1.6 millones de personas lo usan en su casa, su trabajo y
            su comunidad, según el Censo 2020 del INEGI. También es la lengua de Tenochtitlan, de la poesía de Nezahualcóyotl y de
            los códices, y la que dio nombre a cientos de lugares del país.
          </p>
          <p>
            Aprenderlo te deja entender de dónde vienen palabras que usas a diario, como <em className="nah">aguacate</em>,{' '}
            <em className="nah">tianguis</em> o <em className="nah">apapachar</em>, leer el mapa de México con otros ojos y, sobre
            todo, acercarte con respeto a las personas que han mantenido viva la lengua a pesar de siglos de discriminación.
          </p>

          <H2 id="variante">Qué variante elegir</H2>
          <p>
            El náhuatl cambia de región en región; el INALI reconoce 30 variantes. Para empezar conviene elegir una y no mezclar.
          </p>
          <ul>
            <li>
              <strong>Náhuatl central</strong>, cercano al clásico: elígelo si te interesan la historia, los códices, la poesía
              antigua o el significado de los nombres de lugares.
            </li>
            <li>
              <strong>Náhuatl de la Huasteca</strong>, de Veracruz, Hidalgo y San Luis Potosí: elígelo si quieres hablar con
              hablantes de hoy; es la variante con más hablantes.
            </li>
            <li>
              Si tu familia o tu comunidad habla otra variante (de Guerrero, de la Sierra Norte de Puebla, de Morelos…), lo mejor
              es aprender esa.
            </li>
          </ul>
          <p>
            En el <Link className="font-bold underline underline-offset-4" href="/curso">curso</Link> puedes elegir cualquiera de las
            dos y cambiar cuando quieras; tu avance se guarda por separado.
          </p>

          <H2 id="pronunciacion">Cómo se pronuncia</H2>
          <p>
            La buena noticia para quien habla español: casi todas las letras suenan igual. Hay cuatro vocales (a, e, i, o) y la fuerza
            de la voz va casi siempre en la penúltima sílaba. Solo hay que aprender unos pocos sonidos nuevos:
          </p>
          <ul>
            <li><strong>tl</strong> es un solo sonido: una t que se suelta por los lados de la lengua. <em className="nah">Atl</em> no es «atle».</li>
            <li><strong>tz</strong> suena «ts», como en pizza: <em className="nah">tzopilotl</em>, zopilote.</li>
            <li><strong>x</strong> suena «sh»: <em className="nah">xochitl</em> se dice «sho-chitl».</li>
            <li><strong>ll</strong> es una ele larga, nunca «y»: <em className="nah">calli</em> es «cal-li».</li>
            <li><strong>h</strong> es el saltillo, un corte de aire: <em className="nah">ahmo</em>, no.</li>
          </ul>
          <p>
            Todas las letras, con ejemplos y una prueba, están en la{' '}
            <Link className="font-bold underline underline-offset-4" href="/pronunciacion">guía del alfabeto náhuatl</Link>.
          </p>

          <H2 id="gramatica">Cómo funciona la gramática</H2>
          <p>
            El náhuatl es una lengua <strong>aglutinante</strong>: arma palabras largas pegando piezas cortas. Una sola palabra puede
            ser una oración completa. Si entiendes tres ideas, entiendes la mayor parte de lo básico:
          </p>
          <ol>
            <li>
              <strong>Los sustantivos llevan una terminación</strong> (-tl, -tli, -li o -in) que se cae al combinarlos:{' '}
              <em className="nah">ahuaca-tl</em> + <em className="nah">mol-li</em> = <em className="nah">ahuacamolli</em>, guacamole.
            </li>
            <li>
              <strong>Un prefijo dice quién:</strong> <em className="nah">ni-</em> yo, <em className="nah">ti-</em> tú. No hay verbo
              «ser»: <em className="nah">nicihuatl</em> es «soy mujer».
            </li>
            <li>
              <strong>Otro prefijo dice de quién es algo:</strong> <em className="nah">no-</em> mi, <em className="nah">mo-</em> tu,{' '}
              <em className="nah">i-</em> su: <em className="nah">nocal</em>, mi casa.
            </li>
          </ol>
          <p>
            Los verbos llevan adentro incluso a quién se dirige la acción: <em className="nah">ni-mitz-itta</em> es «te veo». Por eso
            el curso enseña con ejercicios en los que armas las palabras pieza por pieza.
          </p>

          <H2 id="plan">Un plan de cuatro semanas</H2>
          <p>Con quince minutos al día:</p>
          <ol>
            <li><strong>Semana 1:</strong> pronunciación, saludos y presentarte. <Link className="underline" href="/curso/sonidos-y-saludos">Lección 1</Link> y <Link className="underline" href="/curso/palabras-que-ya-conoces">lección 2</Link>.</li>
            <li><strong>Semana 2:</strong> «yo soy, tú eres» y los números de veinte en veinte. <Link className="underline" href="/curso/yo-soy-tu-eres">Lección 3</Link> y <Link className="underline" href="/curso/contar-de-veinte-en-veinte">lección 4</Link>.</li>
            <li><strong>Semana 3:</strong> la familia, lo mío y lo tuyo, y los verbos en presente. <Link className="underline" href="/curso/mi-casa-mi-familia">Lección 5</Link> y <Link className="underline" href="/curso/que-haces">lección 6</Link>.</li>
            <li><strong>Semana 4:</strong> nombres de lugares y tu primera conversación. <Link className="underline" href="/curso/lugares-y-caminos">Lección 7</Link> y <Link className="underline" href="/curso/tu-primera-conversacion">lección 8</Link>.</li>
          </ol>
          <p>
            Los días que no toque lección nueva, repasa con los <Link className="font-bold underline underline-offset-4" href="/juegos">juegos</Link> y
            la <Link className="font-bold underline underline-offset-4" href="/palabra-del-dia">palabra del día</Link>.
          </p>

          <H2 id="errores">Errores comunes al empezar</H2>
          <ul>
            <li>Leer la <strong>x</strong> como j o como ks. En náhuatl casi siempre es «sh».</li>
            <li>Decir «atle» o «tepetle»: la <strong>tl</strong> final no lleva vocal.</li>
            <li>Leer la <strong>ll</strong> como «y»: <em className="nah">calli</em> no es «cayi».</li>
            <li>Traducir palabra por palabra. En náhuatl, una palabra puede ser una oración entera.</li>
            <li>Mezclar variantes: elige una y quédate con ella al principio.</li>
          </ul>

          <H2 id="recursos">Recursos para seguir</H2>
          <ul>
            <li>El <Link className="font-bold underline underline-offset-4" href="/curso">curso gratuito de Aprender Náhuatl</Link>, con las ocho lecciones de esta guía.</li>
            <li>El <Link className="font-bold underline underline-offset-4" href="/diccionario">diccionario del curso</Link> y las <Link className="font-bold underline underline-offset-4" href="/frases">frases básicas</Link>.</li>
            <li>El Gran Diccionario Náhuatl de la UNAM, para buscar palabras del náhuatl clásico.</li>
            <li>Los materiales del IDIEZ, para el náhuatl de la Huasteca.</li>
            <li>La Huiquipedia, la Wikipedia escrita en náhuatl, para leer textos reales.</li>
            <li>Radios comunitarias y grupos de conversación de tu región, para escuchar la lengua viva.</li>
          </ul>

          <div className="pt-6">
            <Link href="/curso/sonidos-y-saludos" className="btn btn-red">Empezar la lección 1</Link>
          </div>
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="En esta guía" className="plate-flat sticky top-24 p-5">
            <p className="font-bold">En esta guía</p>
            <ol className="mt-3 space-y-2 text-[0.95rem]">
              {TOC.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="underline-offset-4 hover:text-cochineal hover:underline">{label}</a></li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>

      <Faq items={FAQ} />
    </article>
  );
}
