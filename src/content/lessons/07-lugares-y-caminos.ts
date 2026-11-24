import { blank, build, choice, info, matchOf, meaningOf, order, w, wordFor, write, type Lesson } from '../types';

const tepetl = w('tepetl', 'tepetl', 'cerro');
const mazatl = w('mazatl', 'mazatl', 'venado');
const tochtli = w('tochtli', 'tochtli', 'conejo');
const cuahuitl = w('cuahuitl', 'cuahuitl', 'árbol, madera');
const tetl = w('tetl', 'tetl', 'piedra');
const xalli = w('xalli', 'xalli', 'arena');
const milli = w('milli', 'milli', 'milpa, sementera');
const ohtli = w('ohtli', 'ohtli', 'camino');
const altepetl = w('altepetl', 'altepetl', 'pueblo, ciudad');
const acatl = w('acatl', 'acatl', 'caña, carrizo');
const nochtli = w('nochtli', 'nochtli', 'tuna');
const ehecatl = w('ehecatl', 'ehecatl', 'viento');
const nichanti = w('nichanti', 'nichanti', 'vivo (en un lugar)');
const canin = w('canin', 'canin', '¿dónde?');

const naturaleza = [tepetl, mazatl, tochtli, cuahuitl, tetl];
const naturaleza2 = [xalli, milli, ohtli, acatl, nochtli];
const vocab = [...naturaleza, ...naturaleza2, altepetl, ehecatl, nichanti, canin];

export const lesson07: Lesson = {
  n: 7,
  slug: 'lugares-y-caminos',
  sign: 'Mazatl',
  title: 'Lugares y caminos',
  subtitle: 'Cómo leer los nombres del mapa de México',
  intro:
    'Mazatl, el venado, conoce todos los caminos del monte. Miles de pueblos y ciudades de México tienen nombre náhuatl, y casi todos se arman igual: una o dos raíces y una terminación de lugar. Después de esta lección no vas a ver el mapa igual.',
  minutes: 15,
  access: 'free',
  vocab,
  steps: [
    info(
      'El mapa habla náhuatl',
      'Mazatlán, Xochimilco, Chapultepec, Tlalpan, Coyoacán… Todos estos nombres dicen algo. Se construyen con lo que ya sabes: una raíz sin su terminación, y al final una pieza que significa «lugar».\n\n*maza-tl* (venado) + *-tlan* (lugar de) = *Mazatlan*, «lugar de venados».',
    ),
    matchOf(naturaleza),
    meaningOf(mazatl, naturaleza),
    wordFor(tepetl, naturaleza),
    info(
      'Cuatro terminaciones de lugar',
      'Con cuatro piezas lees la mayoría de los nombres:\n\n*-co* o *-c* «en»: *Mexih-co*, *Chapoltepe-c*\n*-tlan* «lugar de, junto a»: *Maza-tlan*\n*-pan* «sobre, en»: *Tlal-pan*\n*-can* «lugar donde»: *Coyohua-can*\n\nSe usa *-c* después de vocal y *-co* después de consonante.\n\nEn español se deformaron un poco: *-tlan* acabó en *-tlán*, *-tla* o *-lan*; *-pan* a veces en *-pa*.',
      [
        { nah: 'Mazatlan', es: 'Mazatlán: lugar de venados' },
        { nah: 'Tlalpan', es: 'Tlalpan: sobre la tierra' },
        { nah: 'Tepoztlan', es: 'Tepoztlán: lugar del cobre' },
      ],
    ),
    build('lugar de venados', ['Maza', 'tlan'], ['tl', 'co']),
    build('sobre la tierra', ['Tlal', 'pan'], ['li', 'tlan']),
    choice('¿Qué significa «-tlan» al final de un nombre?', ['lugar de', 'grande', 'agua'], 0),
    choice('«Tochtlan» dio nombre a Tuxtla. ¿Qué significa?', ['lugar de conejos', 'lugar de tunas', 'lugar de piedras'], 0, {
      explain: 'tochtli (conejo) + -tlan.',
    }),
    info(
      'En el cerro de…',
      'La palabra más común en los nombres de lugar es *tepetl*, «cerro». Con *-c* da *-tepec*, «en el cerro de…».\n\n*chapol-in* + *tepe-tl* + *-c* = *Chapoltepec*, «en el cerro del chapulín».\n*eheca-tl* + *tepe-tl* + *-c* = *Ehecatepec*, «en el cerro del viento».\n\n¡Ehecatl! El signo de la lección 2.',
      [
        { nah: 'Chapoltepec', es: 'Chapultepec' },
        { nah: 'Ehecatepec', es: 'Ecatepec' },
        { nah: 'Coatepec', es: 'en el cerro de la serpiente' },
      ],
    ),
    build('en el cerro del chapulín', ['Chapol', 'tepe', 'c'], ['tl', 'in']),
    build('en el cerro del viento', ['Eheca', 'tepe', 'c'], ['tl', 'tlan']),
    choice('¿Qué significa «Coatepec»? (coatl = serpiente)', ['en el cerro de la serpiente', 'lugar de coyotes', 'sobre el agua'], 0),
    matchOf(naturaleza2),
    meaningOf(xalli, naturaleza2),
    wordFor(ohtli, naturaleza2),
    info(
      'Xochimilco y Acapulco',
      'Con tres piezas salen nombres famosos:\n\n*xochi-tl* (flor) + *mil-li* (milpa) + *-co* = *Xochimilco*, «en la sementera de flores».\n\n*aca-tl* (carrizo) + *-pol* (grandote) + *-co* = *Acapolco*, «en los carrizos grandes».\n\nY el más famoso: *Tenochtitlan* lleva *te-tl* (piedra) y *noch-tli* (tuna): «junto al nopal de la piedra».',
    ),
    build('en la sementera de flores', ['Xochi', 'mil', 'co'], ['tl', 'pan']),
    build('en los carrizos grandes', ['Aca', 'pol', 'co'], ['tl', 'tlan']),
    choice('¿Qué raíz NO está en «Tenochtitlan»?', ['atl (agua)', 'tetl (piedra)', 'nochtli (tuna)'], 0),
    info(
      'Altepetl: agua y cerro',
      'La palabra para «pueblo» o «ciudad» es *altepetl*: *a-tl* (agua) + *tepe-tl* (cerro). Para los nahuas, un pueblo era eso: un cerro con su manantial.\n\nY *Mexihco* se suele explicar como *metz-tli* (luna) + *xic-tli* (ombligo) + *-co*: «en el ombligo de la luna».',
      [{ nah: 'altepetl', es: 'pueblo, ciudad (agua-cerro)' }, { nah: 'Mexihco', es: 'México' }],
    ),
    build('pueblo (agua + cerro)', ['al', 'tepe', 'tl'], ['co', 'tlan']),
    choice('¿De qué dos palabras viene «altepetl»?', ['agua y cerro', 'casa y camino', 'piedra y tuna'], 0),
    info(
      '¿Dónde vives?',
      'Ahora úsalo para hablar de ti. *Chanti* es «vivir en un lugar» (¿recuerdas *nochan*, mi hogar?).\n\n*Nichanti Xochimilco.* Vivo en Xochimilco.\n*¿Canin tichanti?* ¿Dónde vives?\n\nLos nombres de lugar ya llevan su «en» adentro, así que no se añade nada.',
      [
        { nah: '—¿Canin tichanti?', es: '—¿Dónde vives?' },
        { nah: '—Nichanti Mexihco.', es: '—Vivo en México.' },
      ],
    ),
    order('Vivo en Mazatlán', ['Nichanti', 'Mazatlan'], ['Tichanti']),
    order('¿Dónde vives?', ['¿Canin', 'tichanti?'], ['nichanti?']),
    blank('___chanti Tlalpan.', 'Vivo en Tlalpan.', ['Ni', 'Ti', 'No'], 0),
    meaningOf(canin, [canin, nichanti, altepetl]),
    write('cerro', 'tepetl'),
    write('camino', 'ohtli'),
    write('vivo en México', 'nichanti mexihco'),
    info(
      '¡Cualli!',
      'Ya lees el mapa. En la herramienta *¿Qué significa tu ciudad?* tienes decenas de nombres desarmados pieza por pieza: busca el tuyo.\n\nÚltimo signo de esta primera vuelta: *Tochtli*, el conejo. Vas a juntar todo en una conversación.',
    ),
  ],
};
