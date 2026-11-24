import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acerca de este curso',
  description: 'Qué es Aprender Náhuatl, qué variantes enseña, cómo se escribió el contenido y qué falta por hacer.',
  alternates: { canonical: '/acerca' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl">
        <h1 className="text-4xl sm:text-5xl">Acerca de este curso</h1>
        <p className="text-lg">
          Aprender Náhuatl es un curso gratuito para que cualquier persona que hable español pueda dar sus primeros pasos en
          náhuatl de forma entretenida, desde el celular, sin registrarse.
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
