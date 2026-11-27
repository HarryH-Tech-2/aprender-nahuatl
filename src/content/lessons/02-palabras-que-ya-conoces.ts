import { build, choice, info, matchOf, meaningOf, w, wordFor, write, blank, type Lesson } from '../types';

const ahuacatl = w('ahuacatl', 'ahuacatl', 'aguacate');
const tomatl = w('tomatl', 'tomatl', 'tomate');
const chilli = w('chilli', 'chilli', 'chile');
const etl = w('etl', 'etl', 'frijol');
const elotl = w('elotl', 'elotl', 'elote');
const tamalli = w('tamalli', 'tamalli', 'tamal');
const molli = w('molli', 'molli', 'mole, salsa');
const coyotl = w('coyotl', 'coyotl', 'coyote');
const tecolotl = w('tecolotl', 'tecolotl', 'tecolote, búho');
const papalotl = w('papalotl', 'papalotl', 'mariposa', 'De aquí viene «papalote».');
const mecatl = w('mecatl', 'mecatl', 'mecate, cuerda');
const petlatl = w('petlatl', 'petlatl', 'petate');
const comalli = w('comalli', 'comalli', 'comal');
const tianquiztli = w('tianquiztli', 'tianquiztli', 'tianguis, mercado');
const chapolin = w('chapolin', 'chapolin', 'chapulín');
const tzictli = w('tzictli', 'tzictli', 'chicle');
const michin = w('michin', 'michin', 'pescado, pez');

const comida = [ahuacatl, tomatl, chilli, etl, elotl, tamalli];
const animales = [coyotl, tecolotl, papalotl, chapolin, michin];
const cosas = [mecatl, petlatl, comalli, tianquiztli, tzictli];
const vocab = [...comida, molli, ...animales, ...cosas];

export const lesson02: Lesson = {
  n: 2,
  slug: 'palabras-que-ya-conoces',
  sign: 'Ehecatl',
  title: 'Palabras que ya conoces',
  subtitle: 'El náhuatl que usas todos los días sin darte cuenta',
  intro:
    'Ehecatl, el viento, lleva las palabras de un lugar a otro. El náhuatl le regaló al español de México cientos de ellas: aguacate, tianguis, papalote, apapachar. Con ellas vas a aprender cómo terminan los sustantivos en náhuatl.',
  minutes: 15,
  access: 'member',
  vocab,
  steps: [
    info(
      'Hablas más náhuatl de lo que crees',
      'Cuando pides un taco de *aguacate* con *chile* en el *tianguis*, tres de esas palabras son náhuatl. El español de México está lleno de *nahuatlismos*.\n\nCasi siempre el cambio es el mismo: la terminación *-tl* del náhuatl se volvió *-te* en español.',
      [
        { nah: 'ahuacatl', es: 'aguacate' },
        { nah: 'coyotl', es: 'coyote' },
        { nah: 'mecatl', es: 'mecate' },
      ],
    ),
    choice('Si «tomatl» es tomate y «coyotl» es coyote, ¿qué será «elotl»?', ['elote', 'helado', 'olote'], 0),
    meaningOf(ahuacatl, comida),
    matchOf(comida.slice(0, 5)),
    info(
      'La terminación del sustantivo',
      'En náhuatl, un sustantivo «suelto» lleva una terminación que no significa nada por sí sola: solo avisa «soy un sustantivo». Tiene cuatro formas según cómo acabe la raíz:\n\n*-tl* después de vocal: *coyo-tl*, *a-tl*.\n*-tli* después de consonante: *tianquiz-tli*, *tzic-tli*.\n*-li* después de l: *tamal-li*, *chil-li*.\n*-in* en unas cuantas palabras, muchas de animales: *chapol-in*, *mich-in*.\n\nLo importante es la *raíz*: lo que queda al quitar la terminación. Con las raíces se arman palabras nuevas.',
    ),
    choice('¿Qué terminación le toca a la raíz «coyo-»?', ['-tl', '-tli', '-li'], 0, { explain: 'La raíz termina en vocal: coyo-tl.' }),
    choice('¿Y a la raíz «tamal-»?', ['-li', '-tl', '-in'], 0, { explain: 'Después de l va -li: tamal-li. Por eso se escribe con doble l.' }),
    build('aguacate', ['ahuaca', 'tl'], ['tli', 'li']),
    build('tianguis', ['tianquiz', 'tli'], ['tl', 'in']),
    build('chapulín', ['chapol', 'in'], ['tl', 'li']),
    info(
      'En español: -te, -le y -l',
      'Al pasar al español, *-tl* se volvió *-te* (*tomatl* → tomate), y *-li* se quedó en *-l* o *-le* (*tamalli* → tamal, *molli* → mole, *chilli* → chile).\n\nAlgunas palabras cambiaron más: *tzictli* es «chicle» y *tianquiztli* es «tianguis».',
      [
        { nah: 'tamalli', es: 'tamal' },
        { nah: 'molli', es: 'mole' },
        { nah: 'tzictli', es: 'chicle' },
      ],
    ),
    choice('¿Qué palabra del español viene de «tzictli»?', ['chicle', 'chile', 'chisme'], 0),
    wordFor(chilli, [chilli, molli, tamalli]),
    meaningOf(etl, comida),
    build('tamal', ['tamal', 'li'], ['tl', 'tli']),
    info(
      'Animales con nombre náhuatl',
      'El *coyotl*, el *tecolotl* y el *chapolin* conservaron su nombre. Otros cambiaron de significado: *papalotl* es «mariposa», y por parecerse a una, la cometa de papel se llamó *papalote*.',
      [
        { nah: 'papalotl', es: 'mariposa (→ papalote)' },
        { nah: 'tecolotl', es: 'búho (→ tecolote)' },
        { nah: 'michin', es: 'pez (→ Michoacán, «lugar de pescadores»)' },
      ],
    ),
    meaningOf(papalotl, animales),
    matchOf(animales),
    wordFor(tecolotl, animales),
    info(
      'Raíz + raíz = palabra nueva',
      'El náhuatl arma palabras pegando raíces, como bloques. La primera pierde su terminación y la última la conserva:\n\n*ahuaca-tl* + *mol-li* = *ahuaca-mol-li*, «salsa de aguacate». ¿Te suena? Es el *guacamole*.\n\nEsta es la idea más importante de todo el curso: las palabras largas del náhuatl son piezas cortas pegadas.',
      [
        { nah: 'ahuacamolli', es: 'guacamole (aguacate + salsa)' },
        { nah: 'chilmolli', es: 'salsa de chile (→ chimole)' },
      ],
    ),
    build('guacamole (salsa de aguacate)', ['ahuaca', 'mol', 'li'], ['tl', 'chil']),
    build('salsa de chile', ['chil', 'mol', 'li'], ['ahuaca', 'tl']),
    choice('En «ahuacamolli», ¿qué palabra perdió su terminación?', ['ahuacatl', 'molli', 'ninguna'], 0, {
      explain: 'Solo la última raíz lleva terminación: ahuaca-mol-li.',
    }),
    matchOf(cosas),
    meaningOf(petlatl, cosas),
    wordFor(tianquiztli, cosas),
    blank('Nicnequi ce tamalli ica ___.', 'Quiero un tamal con mole.', ['molli', 'mecatl', 'coyotl'], 0, 'No te preocupes por el resto de la frase: los verbos llegan en la lección 6.'),
    write('chile', 'chilli'),
    write('coyote', 'coyotl'),
    write('frijol', 'etl'),
    info(
      '¡Cualli!',
      'Ya reconoces las cuatro terminaciones (*-tl, -tli, -li, -in*) y sabes que las palabras se arman con raíces. En el sitio tienes una lista con cerca de cien nahuatlismos para seguir descubriendo.\n\nSiguiente signo: *Calli*, la casa. Ahí aprenderás a decir «yo soy».',
    ),
  ],
};
