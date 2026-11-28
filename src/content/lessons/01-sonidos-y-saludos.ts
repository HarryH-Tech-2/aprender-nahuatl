import { blank, choice, info, matchOf, order, v, w, type Lesson } from '../types';

const hola = w('hola', v('niltze', 'piyali'), 'hola', 'En el centro también se oye «pialli».');
const quentica = w('quen-tica', v('¿quen ticah?', '¿quenin tiitztoc?'), '¿cómo estás?');
const cualli = w('cualli', 'cualli', 'bien, bueno');
const gracias = w('tlazohcamati', v('tlazohcamati', 'tlazcamati'), 'gracias');
const si = w('quemah', v('quemah', 'quena'), 'sí');
const no = w('ahmo', v('ahmo', 'axcanah'), 'no');
const notoca = w('notoca', v('notoca', 'notocah'), 'mi nombre es');
const motoca = w('tlen-motoca', v('¿tlen motoca?', '¿tlen motocah?'), '¿cómo te llamas?');
const nosvemos = w('titottazqueh', v('titottazqueh', 'timoittazceh'), 'nos vemos');
const atl = w('atl', 'atl', 'agua');
const xochitl = w('xochitl', 'xochitl', 'flor');
const calli = w('calli', 'calli', 'casa');
const tepetl = w('tepetl', 'tepetl', 'cerro');
const tletl = w('tletl', v('tletl', 'tlitl'), 'fuego');
const tonalli = w('tonalli', 'tonalli', 'día, calor del sol');

const sonidos = [atl, xochitl, calli];
const saludos = [hola, quentica, cualli, gracias, nosvemos];
const vocab = [hola, quentica, cualli, gracias, si, no, notoca, motoca, nosvemos, atl, xochitl, calli, tepetl, tletl, tonalli];

export const lesson01: Lesson = {
  n: 1,
  slug: 'sonidos-y-saludos',
  sign: 'Cipactli',
  title: 'Sonidos y saludos',
  subtitle: 'Cómo suena el náhuatl y cómo decir hola',
  intro:
    'Cipactli, el caimán, es el primer signo: el comienzo de todo. Aquí aprendes a leer el náhuatl en voz alta —la tl, la x, el saltillo—, a saludar, dar las gracias y decir cómo te llamas. Y terminas con tu primera plática en náhuatl.',
  minutes: 8,
  access: 'free',
  vocab,
  steps: [
    info(
      '¡Niltze! Ya dices náhuatl',
      v(
        'El náhuatl lo hablan hoy más de un millón y medio de personas en México. Elegiste el *náhuatl central*, el más cercano al de Tenochtitlan.\n\nY ya lo dices todos los días: miles de lugares tienen nombre náhuatl, y cada nombre describe el lugar. Al terminar esta lección vas a leerlos con sus sonidos de verdad.',
        'El náhuatl lo hablan hoy más de un millón y medio de personas en México. Elegiste el *náhuatl de la Huasteca*, la variante con más hablantes hoy.\n\nY ya lo dices todos los días: miles de lugares tienen nombre náhuatl, y cada nombre describe el lugar. Al terminar esta lección vas a leerlos con sus sonidos de verdad.',
      ),
      [
        { nah: 'Chapultepec', es: 'en el cerro del chapulín' },
        { nah: 'Xochimilco', es: 'en la sementera de flores' },
        { nah: 'Tlaxcala', es: 'lugar de tortillas' },
      ],
    ),
    choice('¿Qué quiere decir «Xochimilco»?', ['En la sementera de flores', 'Lugar de canales', 'En el ombligo de la luna'], 0, {
      explain: 'Xochi- viene de xochitl, «flor», una palabra que vas a volver a ver en esta lección. Y milli es la sementera, el campo sembrado.',
    }),
    info(
      'Cuatro vocales y un ritmo',
      'El náhuatl tiene cuatro vocales: *a, e, i, o*. Suenan igual que en español.\n\nLa fuerza de la voz casi siempre cae en la *penúltima sílaba*. Por eso no hacen falta acentos escritos.',
      [
        { nah: 'CA-lli', es: 'casa' },
        { nah: 'XO-chitl', es: 'flor' },
      ],
    ),
    choice('¿Dónde va la fuerza de la voz en «xochitl»?', ['XO-chitl', 'xo-CHITL'], 0, {
      explain: 'En la penúltima sílaba. La tl final no cuenta como sílaba aparte.',
    }),
    info(
      'La x, la tl y la tz',
      'La *x* suena «sh», como cuando pides silencio: *xochitl* se dice «SHO-chitl».\n\nLa *tl* es UN solo sonido: pon la lengua como para decir «t» y suelta el aire por los lados. Al final no lleva vocal: *atl* no es «atle». Y la *tz* suena «ts», como en *pizza*.',
      [{ nah: 'xochitl', es: 'flor' }, { nah: 'atl', es: 'agua' }],
    ),
    choice('¿Cómo suena la x de «xochitl»?', ['Como «sh»', 'Como la j de «jarra»', 'Como «ks» en «taxi»'], 0),
    info(
      'La ll y el saltillo',
      v(
        'La *ll* NO suena «y»: es una ele larga. *Calli* se dice «cal-li».\n\nLa *h* es el *saltillo*: un pequeño corte de aire, como en «oh-oh». Se oye en *tlazohcamati* (gracias).',
        'La *ll* NO suena «y»: es una ele larga. *Calli* se dice «cal-li».\n\nLa *h* en la Huasteca suena como una jota muy suavecita, casi un soplo. Se oye en *notocah* (mi nombre).',
      ),
    ),
    matchOf(sonidos),
    info(
      'Saludar',
      v(
        'Para saludar: *niltze*. Para preguntar cómo está alguien: *¿quen ticah?* La respuesta más sencilla: *cualli*, «bien».\n\nGracias es *tlazohcamati*, y para despedirte: *titottazqueh*, «nos vemos».',
        'Para saludar: *piyali*. Para preguntar cómo está alguien: *¿quenin tiitztoc?* La respuesta más sencilla: *cualli*, «bien».\n\nGracias es *tlazcamati*, y para despedirte: *timoittazceh*, «nos vemos».',
      ),
      [
        { nah: v('—Niltze. ¿Quen ticah?', '—Piyali. ¿Quenin tiitztoc?'), es: '—Hola. ¿Cómo estás?' },
        { nah: v('—Cualli, tlazohcamati.', '—Cualli, tlazcamati.'), es: '—Bien, gracias.' },
      ],
    ),
    matchOf(saludos),
    blank(v('—¿Quen ticah? —___, tlazohcamati.', '—¿Quenin tiitztoc? —___, tlazcamati.'), '—¿Cómo estás? —Bien, gracias.', ['Cualli', 'Atl', v('Ahmo', 'Axcanah')], 0),
    info(
      'Sí, no y tu nombre',
      v(
        '*Quemah* es «sí» y *ahmo* es «no».\n\nPara decir tu nombre: *notoca* + tu nombre, «mi-nombre». Para preguntar: *¿tlen motoca?*, «¿cuál es tu-nombre?». *no-* es «mi» y *mo-* es «tu».',
        '*Quena* es «sí» y *axcanah* es «no».\n\nPara decir tu nombre: *notocah* + tu nombre, «mi-nombre». Para preguntar: *¿tlen motocah?*, «¿cuál es tu-nombre?». *no-* es «mi» y *mo-* es «tu».',
      ),
      [
        { nah: v('—¿Tlen motoca?', '—¿Tlen motocah?'), es: '—¿Cómo te llamas?' },
        { nah: v('—Notoca Citlali.', '—Notocah Citlali.'), es: '—Me llamo Citlali.' },
      ],
    ),
    order('Me llamo Citlali', [v('Notoca', 'Notocah'), 'Citlali'], [v('Motoca', 'Motocah')], 'no- es «mi»; mo- es «tu».', [v('Citlali Notoca', 'Citlali Notocah')]),
    info(
      'Tu primera plática',
      'Lee este encuentro en voz alta. Luego te toca a ti cerrar la plática.',
      [
        { nah: v('—Niltze. ¿Quen ticah?', '—Piyali. ¿Quenin tiitztoc?'), es: 'Citlali: «Hola. ¿Cómo estás?»' },
        { nah: v('—Cualli, tlazohcamati. ¿Tlen motoca?', '—Cualli, tlazcamati. ¿Tlen motocah?'), es: 'Tú: «Bien, gracias. ¿Cómo te llamas?»' },
        { nah: v('—Notoca Citlali.', '—Notocah Citlali.'), es: 'Citlali: «Me llamo Citlali.»' },
      ],
    ),
    choice(
      'Citlali te dice su nombre. Dale las gracias y despídete.',
      [
        v('Tlazohcamati, Citlali. Titottazqueh.', 'Tlazcamati, Citlali. Timoittazceh.'),
        v('Niltze, Citlali. ¿Quen ticah?', 'Piyali, Citlali. ¿Quenin tiitztoc?'),
        v('Notoca Citlali.', 'Notocah Citlali.'),
      ],
      0,
      { nah: v('—Notoca Citlali.', '—Notocah Citlali.'), explain: '¡Lo lograste! Tu primera plática completa en náhuatl.' },
    ),
  ],
};
