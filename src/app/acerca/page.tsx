import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs, JsonLd } from '@/components/Seo';
import { AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Acerca de este curso',
  description: 'Qué es Aprender Náhuatl, qué variantes enseña, cómo hacemos y revisamos el contenido, nuestras fuentes y qué falta por hacer.',
  alternates: { canonical: '/acerca' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Acerca de este curso',
          url: `${SITE_URL}/acerca`,
          inLanguage: 'es-MX',
          mainEntity: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/icono.png` },
            description: 'Curso en línea para aprender náhuatl central y de la Huasteca desde el español: lección 1 gratis y curso completo de pago.',
            knowsLanguage: ['es-MX', 'nah'],
            founder: AUTHOR,
          },
          author: AUTHOR,
        }}
      />
      <Breadcrumbs trail={[['/acerca', 'Acerca de este curso']]} />
      <div className="prose-col mt-6 space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl">
        <h1 className="text-4xl sm:text-5xl">Acerca de este curso</h1>
        <p className="text-lg">
          Aprender Náhuatl es un curso en línea para que cualquier persona que hable español pueda dar sus primeros pasos en
          náhuatl de forma entretenida, desde el celular. Para empezar solo pedimos un correo.
        </p>

        <h2 id="quien" className="scroll-mt-24">Quién hace este sitio</h2>
        <p>
          <a className="font-bold underline" href="https://www.linkedin.com/in/harry-harrison/" rel="author noopener" target="_blank">
            Harry Harrison
          </a>{' '}
          creó Aprender Náhuatl para que cualquier hispanohablante pueda empezar con la lengua: la lección 1, las herramientas y los juegos son gratis. No es hablante
          nativo: las lecciones se escribieron a partir de gramáticas y diccionarios publicados, y buscamos hablantes y docentes
          que las revisen.
        </p>

        <h2>Qué náhuatl enseñamos</h2>
        <p>
          El náhuatl no es una sola forma de hablar: cambia de una región a otra. El curso ofrece dos variantes y guarda tu
          avance por separado en cada una.
        </p>
        <p>
          <strong>Náhuatl central.</strong> Se basa en el náhuatl clásico, el del Valle de México en el siglo XVI, escrito con
          la ortografía tradicional sin marcas de vocal larga. Es el más cercano a los nombres de lugares y a las palabras que
          pasaron al español, y se parece a lo que hoy se habla en Milpa Alta y partes de Puebla y Morelos.
        </p>
        <p>
          <strong>Náhuatl de la Huasteca.</strong> Es la variante con más hablantes hoy, en Veracruz, Hidalgo y San Luis Potosí.
          Procuramos seguir la ortografía que usan los materiales del Instituto de Docencia e Investigación Etnológica de Zacatecas (IDIEZ).
        </p>

        <p>
          Algunas formas del náhuatl central que enseñamos son usos modernos y no del náhuatl clásico: <em className="nah">niltze</em> como
          saludo, <em className="nah">tlen</em> en lugar de <em className="nah">tlein</em>, o <em className="nah">ma cualli ohtli</em> como despedida.
          Las elegimos porque son las que hoy se oyen y se enseñan.
        </p>

        <h2>Lo que todavía falta</h2>
        <p>
          <strong>El contenido está en revisión.</strong> Las lecciones se escribieron a partir de gramáticas y diccionarios
          publicados, pero todavía no las ha revisado un hablante nativo ni un maestro de la lengua. Puede haber errores, sobre
          todo en la variante de la Huasteca. Si eres hablante o docente y quieres ayudar a corregir,{' '}
          <Link className="font-bold underline" href="/contacto">escríbenos</Link>.
        </p>
        <p>
          <strong>No hay audio.</strong> Preferimos no usar voces sintéticas, que pronuncian mal sonidos como la tl. Queremos
          grabar a hablantes; mientras tanto, la <Link className="font-bold underline" href="/pronunciacion">guía de pronunciación</Link> explica
          cada sonido.
        </p>
        <p>
          <strong>Son ocho lecciones.</strong> El tonalpohualli tiene veinte signos; los otros doce están por escribirse.
        </p>

        <h2 id="como-hacemos" className="scroll-mt-24">Cómo hacemos el contenido</h2>
        <p>
          <strong>Una sola fuente.</strong> Cada palabra y cada frase en náhuatl del sitio sale de las lecciones del curso, de
          la lista de frases o de los nombres de los signos del calendario. Las páginas de frases, el diccionario y las
          respuestas rápidas no inventan formas nuevas: una prueba automática revisa que todo lo que publican ya esté en el
          curso, con la misma ortografía y la misma variante.
        </p>
        <p>
          <strong>Las dos variantes, por separado.</strong> Cuando el náhuatl central y el de la Huasteca dicen algo distinto,
          mostramos las dos formas; cuando coinciden, una sola.
        </p>
        <p>
          <strong>Correcciones.</strong> Si encuentras un error, <Link className="font-bold underline" href="/contacto">escríbenos</Link>.
          Corregimos la lección y, con ella, todas las páginas que usan esa palabra.
        </p>

        <h2>Fuentes</h2>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            Número de hablantes: INEGI, Censo de Población y Vivienda 2020 (1,651,958 personas de 3 años o más hablan
            náhuatl).
          </li>
          <li>
            Ortografía del náhuatl de la Huasteca: la que usan los materiales del Instituto de Docencia e Investigación
            Etnológica de Zacatecas (IDIEZ).
          </li>
          <li>Correlación del tonalpohualli con nuestro calendario: la de Alfonso Caso.</li>
        </ul>

        <h2>Las ilustraciones</h2>
        <p>
          Los glifos y las ilustraciones se generaron con inteligencia artificial, inspirados en el estilo de los códices
          mexicas. No son reproducciones de ningún códice.
        </p>

        <h2>El calendario</h2>
        <p>
          La herramienta <Link className="font-bold underline" href="/tu-signo">Tu signo</Link> usa la correlación de Alfonso Caso
          para el tonalpohualli. Es una forma de acercarse a la cultura, no una predicción.
        </p>
      </div>
    </div>
  );
}
