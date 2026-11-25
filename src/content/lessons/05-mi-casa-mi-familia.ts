import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const nocal = w('nocal', 'nocal', 'mi casa (el edificio)');
const nochan = w('nochan', 'nochan', 'mi hogar');
const nonan = w('nonan', v('nonan', 'nonanan'), 'mi mamá');
const notah = w('notah', v('notah', 'notatah'), 'mi papá');
const nocone = w('noconeuh', v('noconeuh', 'nocone'), 'mi hijo, mi hija');
const amigo = w('nocniuh', v('nocniuh', 'nohuampoh'), 'mi amigo, mi amiga');
const nochichi = w('nochichi', 'nochichi', 'mi perro');
const nomizton = w('nomizton', 'nomizton', 'mi gato');
const notlal = w('notlal', 'notlal', 'mi tierra');
const notlaxcal = w('notlaxcal', 'notlaxcal', 'mi tortilla');
const nantli = w('nantli', v('nantli', 'nanan'), 'mamá, madre');
const tahtli = w('tahtli', v('tahtli', 'tatah'), 'papá, padre');
const chichi = w('chichi', 'chichi', 'perro');
const mizton = w('mizton', 'mizton', 'gato');
const tlaxcalli = w('tlaxcalli', 'tlaxcalli', 'tortilla');
const tlalli = w('tlalli', 'tlalli', 'tierra');

const sueltas = [nantli, tahtli, chichi, mizton, tlaxcalli];
const mias = [nocal, nonan, notah, nochichi, nomizton];
const mias2 = [nochan, nocone, amigo, notlal, notlaxcal];
const vocab = [...sueltas, tlalli, ...mias, ...mias2];

export const lesson05: Lesson = {
  n: 5,
  slug: 'mi-casa-mi-familia',
  sign: 'Coatl',
  title: 'Mi casa, mi familia',
  metaDescription:
    'Mío, tuyo, suyo, nuestro. Cómo decir «mi casa» y «tu familia» en náhuatl: el sustantivo suelta su terminación y lleva un prefijo posesivo.',
  subtitle: 'Mío, tuyo, suyo, nuestro',
  intro:
    'Coatl, la serpiente, cambia de piel. Las palabras en náhuatl también: cuando algo es «de alguien», el sustantivo suelta su terminación y se pone un prefijo. Aquí aprendes a hablar de tu casa, tu familia y tus mascotas.',
  minutes: 15,
  access: 'free',
  vocab,
  steps: [
    info(
      'La palabra cambia de piel',
      'En la lección 1 dijiste *notoca*, «mi nombre». Ahí estaba el secreto: *no-* significa «mi».\n\nPara decir que algo es de alguien se hacen dos cosas:\n\n1. Se quita la terminación (*-tl, -tli, -li*).\n2. Se pone el prefijo del dueño.\n\n*cal-li* (casa) → *no-cal* (mi casa)',
      [
        { nah: 'calli → nocal', es: 'casa → mi casa' },
        { nah: 'tlaxcalli → notlaxcal', es: 'tortilla → mi tortilla' },
        { nah: 'tlalli → notlal', es: 'tierra → mi tierra' },
      ],
    ),
    build('mi casa', ['no', 'cal'], ['li', 'tl']),
    build('mi tortilla', ['no', 'tlaxcal'], ['li', 'mo']),
    choice('¿Qué le pasó a «tlalli» en «notlal»?', ['Perdió la terminación -li', 'Ganó una terminación', 'No cambió'], 0),
    matchOf(sueltas),
    info(
      'Los dueños',
      v(
        'Estos son los prefijos de posesión:\n\n*no-* mi\n*mo-* tu\n*i-* su (de él, de ella)\n*to-* nuestro\n*amo-* su (de ustedes)\n*in-* su (de ellos)',
        'Estos son los prefijos de posesión:\n\n*no-* mi\n*mo-* tu\n*i-* su (de él, de ella)\n*to-* nuestro\n*inmo-* su (de ustedes)\n*inin-* su (de ellos)',
      ),
      [
        { nah: 'nocal', es: 'mi casa' },
        { nah: 'mocal', es: 'tu casa' },
        { nah: 'ical', es: 'su casa' },
        { nah: 'tocal', es: 'nuestra casa' },
      ],
    ),
    choice('¿Qué significa?', ['tu casa', 'mi casa', 'su casa'], 0, { nah: 'mocal' }),
    choice('¿Qué significa?', ['nuestra casa', 'tu casa', 'mi casa'], 0, { nah: 'tocal' }),
    build('su casa (de ella)', ['i', 'cal'], ['no', 'li']),
    build('nuestra tierra', ['to', 'tlal'], ['mo', 'li']),
    blank(v('___toca Xochitl.', '___tocah Xochitl.'), 'Mi nombre es Xóchitl.', ['No', 'Mo', 'I'], 0),
    info(
      'La familia',
      v(
        'A la familia casi nunca se le nombra «suelta»: una mamá siempre es la mamá de alguien. Por eso estas palabras se aprenden ya con dueño:\n\n*nonan* mi mamá (de *nantli*)\n*notah* mi papá (de *tahtli*)\n*noconeuh* mi hijo o hija (de *conetl*)\n*nocniuh* mi amigo, mi hermano\n\nCuando la raíz termina en vocal, muchas veces se añade *-uh* al final: *cone-tl* → *no-cone-uh*.',
        'A la familia casi nunca se le nombra «suelta»: una mamá siempre es la mamá de alguien. Por eso estas palabras se aprenden ya con dueño:\n\n*nonanan* mi mamá\n*notatah* mi papá\n*nocone* mi hijo o hija (de *conetl*)\n*nohuampoh* mi amigo, mi compañero',
      ),
    ),
    matchOf(mias),
    meaningOf(nonan, mias),
    wordFor(notah, mias),
    choice('¿Cómo dices «tu mamá»?', [v('monan', 'monanan'), v('nonan', 'nonanan'), v('inan', 'inanan')], 0),
    choice('¿Cómo dices «su papá» (de él)?', [v('itah', 'itatah'), v('motah', 'motatah'), v('notah', 'notatah')], 0),
    info(
      'Tonantzin',
      'Seguro conoces esta palabra: *Tonantzin*. Ahora puedes leerla por dentro:\n\n*to-* nuestra + *nan* madre + *-tzin* (cariño y respeto)\n\n«Nuestra madrecita venerada». El final *-tzin* se le pone a quien quieres o respetas; por eso muchos nombres lo llevan: *Cuauhtemoctzin*, *Tonatiuhtzin*.',
      [{ nah: 'Tonantzin', es: 'nuestra madrecita' }, { nah: 'nonantzin', es: 'mi mamita' }],
    ),
    build('nuestra madrecita', ['to', 'nan', 'tzin'], ['no', 'tli']),
    choice('¿Qué le añade «-tzin» a una palabra?', ['Cariño y respeto', 'Plural', 'Tamaño grande'], 0),
    info(
      'Hogar y mascotas',
      '*Nocal* es mi casa, el edificio. *Nochan* es mi hogar, el lugar de donde soy. Para decir de dónde eres o dónde está tu casa se usa *nochan*.\n\nLas mascotas también tienen dueño: *nochichi* (mi perro), *nomizton* (mi gato).',
      [
        { nah: 'Nochan Puebla.', es: 'Mi hogar es Puebla. / Soy de Puebla.' },
        { nah: '¿Canin mochan?', es: '¿Dónde está tu casa? / ¿De dónde eres?' },
      ],
    ),
    matchOf(mias2),
    meaningOf(nochan, mias2),
    wordFor(nochichi, [nochichi, nomizton, nocal]),
    order('Mi hogar es Oaxaca', ['Nochan', 'Oaxaca'], ['Mochan']),
    order('¿De dónde eres?', ['¿Canin', 'mochan?'], ['nochan?']),
    info(
      'El perro de Juan',
      'Para decir de quién es algo, se dice primero la cosa con *i-* («su») y luego el dueño:\n\n*ichichi Juan*: «su-perro Juan», o sea, «el perro de Juan».',
      [
        { nah: 'ichichi Juan', es: 'el perro de Juan' },
        { nah: v('inan Citlali', 'inanan Citlali'), es: 'la mamá de Citlali' },
        { nah: v('ical nocniuh', 'ical nohuampoh'), es: 'la casa de mi amigo' },
      ],
    ),
    order('el gato de María', ['imizton', 'María'], ['nomizton'], undefined, ['María imizton']),
    blank('___chichi Juan.', 'El perro de Juan.', ['I', 'No', 'To'], 0),
    write('mi casa', 'nocal | nochan'),
    write('tu casa', 'mocal'),
    write('mi perro', 'nochichi'),
    write('mi mamá', v('nonan | nonantzin', 'nonanan | nonan')),
    info(
      '¡Cualli!',
      'Ya sabes decir de quién es cada cosa: *no-, mo-, i-, to-*. Y de paso entendiste por qué se dice *Tonantzin*.\n\nSiguiente signo: *Miquiztli*. Suena serio, pero es la lección más movida: los verbos.',
    ),
  ],
};
