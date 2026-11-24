import { blank, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const hola = w('hola', v('niltze', 'piyali'), 'hola', 'En el centro también se oye «pialli».');
const quentica = w('quen-tica', v('¿quen tica?', '¿quenin tiitztoc?'), '¿cómo estás?');
const cualli = w('cualli', 'cualli', 'bien, bueno');
const gracias = w('tlazohcamati', v('tlazohcamati', 'tlazcamati'), 'gracias');
const si = w('quemah', v('quemah', 'quena'), 'sí');
const no = w('ahmo', v('ahmo', 'axcanah'), 'no');
const notoca = w('notoca', v('notoca', 'notocah'), 'mi nombre es');
const motoca = w('tlen-motoca', v('¿tlen motoca?', '¿tlen motocah?'), '¿cómo te llamas?');
const nosvemos = w('timoittazqueh', v('timoittazqueh', 'timoittazceh'), 'nos vemos');
const atl = w('atl', 'atl', 'agua');
const xochitl = w('xochitl', 'xochitl', 'flor');
const calli = w('calli', 'calli', 'casa');
const tepetl = w('tepetl', 'tepetl', 'cerro');
const tletl = w('tletl', v('tletl', 'tlitl'), 'fuego');
const tonalli = w('tonalli', 'tonalli', 'día, calor del sol');

const sonidos = [atl, xochitl, calli, tepetl, tletl];
const saludos = [hola, quentica, cualli, gracias, nosvemos];
const vocab = [hola, quentica, cualli, gracias, si, no, notoca, motoca, nosvemos, atl, xochitl, calli, tepetl, tletl, tonalli];

export const lesson01: Lesson = {
  n: 1,
  slug: 'sonidos-y-saludos',
  sign: 'Cipactli',
  title: 'Sonidos y saludos',
  subtitle: 'Cómo suena el náhuatl y cómo decir hola',
  intro:
    'Cipactli, el caimán, es el primer signo: el comienzo de todo. Aquí aprendes a leer el náhuatl en voz alta —la tl, la x, el saltillo— y a saludar, dar las gracias y decir cómo te llamas.',
  minutes: 15,
  access: 'free',
  vocab,
  steps: [
    info(
      '¡Niltze! Bienvenida, bienvenido',
      v(
        'El náhuatl no es una lengua del pasado: hoy la hablan más de un millón y medio de personas en México. Es la lengua de Nezahualcóyotl y también la de miles de familias en Puebla, Veracruz, Hidalgo, Guerrero, San Luis Potosí y la Ciudad de México.\n\nElegiste el *náhuatl central*, el más cercano al que se hablaba en Tenochtitlan y al que dio nombre a media geografía del país. Vamos paso a paso. Lo primero: aprender a leerlo en voz alta.',
        'El náhuatl no es una lengua del pasado: hoy la hablan más de un millón y medio de personas en México. Es la lengua de Nezahualcóyotl y también la de miles de familias en Veracruz, Hidalgo, San Luis Potosí, Puebla y Guerrero.\n\nElegiste el *náhuatl de la Huasteca*, la variante con más hablantes hoy. Vamos paso a paso. Lo primero: aprender a leerlo en voz alta.',
      ),
    ),
    info(
      'Cuatro vocales y un ritmo',
      'El náhuatl tiene cuatro vocales: *a, e, i, o*. Suenan igual que en español. La letra *u* nunca va sola: solo aparece pegada a otra letra (*cu, hu, qu, uh*).\n\nEl ritmo es muy regular: la fuerza de la voz casi siempre cae en la *penúltima sílaba*. Por eso no hacen falta acentos escritos.',
      [
        { nah: 'CA-lli', es: 'casa' },
        { nah: 'XO-chitl', es: 'flor' },
        { nah: 'TE-petl', es: 'cerro' },
      ],
    ),
    choice('¿Dónde va la fuerza de la voz en «xochitl»?', ['XO-chitl', 'xo-CHITL'], 0, {
      explain: 'En la penúltima sílaba. La tl final no cuenta como sílaba aparte.',
    }),
    info(
      'La x suena «sh»',
      'En náhuatl la *x* suena como la «sh» del inglés *she*, o como cuando pides silencio: «shhh».\n\nTú ya la dices así en algunos nombres: *Xola*, *Xel-Há*, *mixiote*. Entonces *xochitl* se dice «SHO-chitl».',
      [{ nah: 'xochitl', es: 'flor' }, { nah: 'Mexihco', es: 'México (se decía «Me-SHIH-co»)' }],
    ),
    choice('¿Cómo suena la x de «xochitl»?', ['Como «sh»', 'Como la j de «jarra»', 'Como «ks» en «taxi»'], 0),
    info(
      'tl y tz: dos letras, un solo sonido',
      'La *tl* es el sonido más famoso del náhuatl. Es UN solo sonido: pon la lengua como para decir «t» y suelta el aire por los lados, como una «l» sin voz. Al final de palabra no lleva vocal: *atl* no es «atle» ni «al».\n\nLa *tz* suena «ts», como en *pizza* o en *Tzintzuntzan*.',
      [{ nah: 'atl', es: 'agua' }, { nah: 'tepetl', es: 'cerro' }, { nah: 'tzopilotl', es: 'zopilote' }],
    ),
    choice('¿Cómo se pronuncia la tl al final de «atl»?', ['Un solo sonido, sin vocal después', 'Como «atle»', 'Como «al», sin la t'], 0),
    info(
      'll, hu, cu y el saltillo',
      v(
        'La *ll* NO suena «y»: es una ele larga. *Calli* se dice «cal-li».\n\n*hu* y *uh* suenan como la «u» de *huevo*: *huey* (grande). *cu* y *uc* suenan «kw», como en *cuatro*. La *c* y la *qu* funcionan como en español (*ca, que, qui, co*) y la *z* suena «s».\n\nLa *h* es el *saltillo*: un pequeño corte de aire, como el que haces entre las dos sílabas de «oh-oh». Se oye en *ahmo* (no) y *tlazohcamati* (gracias).',
        'La *ll* NO suena «y»: es una ele larga. *Calli* se dice «cal-li».\n\n*hu* y *uh* suenan como la «u» de *huevo*: *huey* (grande). *cu* y *uc* suenan «kw», como en *cuatro*. La *c* y la *qu* funcionan como en español (*ca, que, qui, co*) y la *z* suena «s».\n\nLa *h* en la Huasteca suena como una jota muy suavecita, casi un soplo. Se oye en *axcanah* (no) y *notocah* (mi nombre).',
      ),
    ),
    choice('¿Cómo se pronuncia «calli»?', ['«cal-li», con la ele larga', '«cayi», como en español', '«cachi»'], 0),
    choice('La «hu» de «huey» suena como…', ['la u de «huevo»', 'una jota', 'una b'], 0),
    matchOf(sonidos),
    meaningOf(xochitl, sonidos),
    wordFor(atl, sonidos),
    info(
      'Saludar',
      v(
        'Para saludar di *niltze* (también oirás *pialli*). Para preguntar cómo está alguien: *¿quen tica?* La respuesta más sencilla es *cualli*, «bien».\n\nPara dar las gracias: *tlazohcamati*. Y para despedirte: *timoittazqueh*, «nos vemos».',
        'Para saludar di *piyali*. Para preguntar cómo está alguien: *¿quenin tiitztoc?* La respuesta más sencilla es *cualli*, «bien».\n\nPara dar las gracias: *tlazcamati*. Y para despedirte: *timoittazceh*, «nos vemos».',
      ),
      [
        { nah: v('—Niltze. ¿Quen tica?', '—Piyali. ¿Quenin tiitztoc?'), es: '—Hola. ¿Cómo estás?' },
        { nah: v('—Cualli, tlazohcamati.', '—Cualli, tlazcamati.'), es: '—Bien, gracias.' },
      ],
    ),
    meaningOf(hola, saludos),
    meaningOf(quentica, saludos),
    wordFor(gracias, saludos),
    matchOf(saludos),
    blank(v('—¿Quen tica? —___, tlazohcamati.', '—¿Quenin tiitztoc? —___, tlazcamati.'), '—¿Cómo estás? —Bien, gracias.', ['Cualli', 'Atl', v('Ahmo', 'Axcanah')], 0),
    info(
      'Sí, no y tu nombre',
      v(
        '*Quemah* es «sí» y *ahmo* es «no».\n\nPara decir tu nombre: *notoca* + tu nombre. Literalmente es «mi-nombre». Y para preguntar: *¿tlen motoca?*, «¿cuál es tu-nombre?».\n\nFíjate: *no-* es «mi» y *mo-* es «tu». Lo vas a ver muchísimo.',
        '*Quena* es «sí» y *axcanah* es «no».\n\nPara decir tu nombre: *notocah* + tu nombre. Literalmente es «mi-nombre». Y para preguntar: *¿tlen motocah?*, «¿cuál es tu-nombre?».\n\nFíjate: *no-* es «mi» y *mo-* es «tu». Lo vas a ver muchísimo.',
      ),
      [
        { nah: v('—¿Tlen motoca?', '—¿Tlen motocah?'), es: '—¿Cómo te llamas?' },
        { nah: v('—Notoca Citlali.', '—Notocah Citlali.'), es: '—Me llamo Citlali.' },
      ],
    ),
    wordFor(si, [si, no, cualli]),
    meaningOf(no, [no, si, gracias]),
    order('Me llamo Citlali', [v('Notoca', 'Notocah'), 'Citlali'], [v('Motoca', 'Motocah')], 'no- es «mi»; mo- es «tu».'),
    choice('Alguien te pregunta tu nombre. ¿Qué te dijo?', [motoca.nah, quentica.nah, nosvemos.nah], 0),
    write('gracias', gracias.nah),
    write('agua', 'atl'),
    write('casa', 'calli'),
    meaningOf(nosvemos, saludos),
    choice('Te despides de una amiga. ¿Qué le dices?', [nosvemos.nah, hola.nah, motoca.nah], 0),
    info(
      '¡Cualli! Primer signo completado',
      'Ya sabes leer náhuatl en voz alta, saludar, agradecer y presentarte. *Cualli* significa «bien» y «bueno»: lo vas a oír cada vez que aciertes.\n\nEn la siguiente lección vas a descubrir que ya conocías decenas de palabras en náhuatl… sin saberlo.',
    ),
  ],
};
