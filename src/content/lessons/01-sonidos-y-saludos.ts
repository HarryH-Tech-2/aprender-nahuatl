import { blank, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

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
    'Cipactli, el caimán, es el primer signo: el comienzo de todo. Aquí aprendes a leer el náhuatl en voz alta —la tl, la x, el saltillo—, a saludar, dar las gracias y decir cómo te llamas. Y terminas con tu primera plática en náhuatl.',
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
      'Ya dices náhuatl todos los días',
      'Antes de aprender una sola palabra, ya hablas náhuatl. Miles de lugares de México tienen nombre náhuatl: colonias, pueblos, cerros, estados. Y cada nombre es una pequeña descripción del lugar.\n\nMuchas veces los decimos sin saber qué significan. Al terminar esta lección vas a leerlos bien, con sus sonidos de verdad: la *x* de *Xochimilco*, la *tl* de *Tlaxcala*.',
      [
        { nah: 'Chapultepec', es: 'en el cerro del chapulín' },
        { nah: 'Xochimilco', es: 'en la sementera de flores' },
        { nah: 'Coyoacán', es: 'lugar de los que tienen coyotes' },
        { nah: 'Tlaxcala', es: 'lugar de tortillas' },
      ],
    ),
    choice('¿Qué quiere decir «Xochimilco»?', ['En la sementera de flores', 'Lugar de canales', 'En el ombligo de la luna'], 0, {
      explain: 'Xochi- viene de xochitl, «flor», una palabra que vas a volver a ver en esta lección. Y milli es la sementera, el campo sembrado.',
    }),
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
        'Para saludar di *niltze* (también oirás *pialli*). Para preguntar cómo está alguien: *¿quen ticah?* La respuesta más sencilla es *cualli*, «bien».\n\nPara dar las gracias: *tlazohcamati*. Y para despedirte: *titottazqueh*, «nos vemos».',
        'Para saludar di *piyali*. Para preguntar cómo está alguien: *¿quenin tiitztoc?* La respuesta más sencilla es *cualli*, «bien».\n\nPara dar las gracias: *tlazcamati*. Y para despedirte: *timoittazceh*, «nos vemos».',
      ),
      [
        { nah: v('—Niltze. ¿Quen ticah?', '—Piyali. ¿Quenin tiitztoc?'), es: '—Hola. ¿Cómo estás?' },
        { nah: v('—Cualli, tlazohcamati.', '—Cualli, tlazcamati.'), es: '—Bien, gracias.' },
      ],
    ),
    meaningOf(hola, saludos),
    meaningOf(quentica, saludos),
    wordFor(gracias, saludos),
    matchOf(saludos),
    blank(v('—¿Quen ticah? —___, tlazohcamati.', '—¿Quenin tiitztoc? —___, tlazcamati.'), '—¿Cómo estás? —Bien, gracias.', ['Cualli', 'Atl', v('Ahmo', 'Axcanah')], 0),
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
    order('Me llamo Citlali', [v('Notoca', 'Notocah'), 'Citlali'], [v('Motoca', 'Motocah')], 'no- es «mi»; mo- es «tu».', [v('Citlali Notoca', 'Citlali Notocah')]),
    choice('Alguien te pregunta tu nombre. ¿Qué te dijo?', [motoca.nah, quentica.nah, nosvemos.nah], 0),
    write('gracias', v('tlazohcamati | nitlazohcamati', 'tlazcamati | tlazohcamati')),
    write('agua', 'atl'),
    write('casa', 'calli'),
    meaningOf(nosvemos, saludos),
    choice('Te despides de una amiga. ¿Qué le dices?', [nosvemos.nah, hola.nah, motoca.nah], 0),
    info(
      'Tu primera plática',
      'Ya tienes todo lo que necesitas para platicar. Lee este encuentro en voz alta: Citlali te saluda, tú le contestas, se presentan y se despiden.\n\nLuego te toca a ti: Citlali dice su parte y tú eliges la tuya.',
      [
        { nah: v('—Niltze. ¿Quen ticah?', '—Piyali. ¿Quenin tiitztoc?'), es: 'Citlali: «Hola. ¿Cómo estás?»' },
        { nah: v('—Cualli, tlazohcamati.', '—Cualli, tlazcamati.'), es: 'Tú: «Bien, gracias.»' },
        { nah: v('—¿Tlen motoca?', '—¿Tlen motocah?'), es: 'Citlali: «¿Cómo te llamas?»' },
        { nah: v('—Notoca… (tu nombre). ¿Tlen motoca?', '—Notocah… (tu nombre). ¿Tlen motocah?'), es: 'Tú: «Me llamo… ¿Y tú cómo te llamas?»' },
        { nah: v('—Notoca Citlali.', '—Notocah Citlali.'), es: 'Citlali: «Me llamo Citlali.»' },
        { nah: v('—Tlazohcamati, Citlali. Titottazqueh.', '—Tlazcamati, Citlali. Timoittazceh.'), es: 'Tú: «Gracias, Citlali. Nos vemos.»' },
      ],
    ),
    choice(
      'Citlali te saluda y te pregunta cómo estás. ¿Qué le contestas?',
      [v('Cualli, tlazohcamati.', 'Cualli, tlazcamati.'), v('¿Tlen motoca?', '¿Tlen motocah?'), v('Titottazqueh.', 'Timoittazceh.')],
      0,
      { nah: v('—Niltze. ¿Quen ticah?', '—Piyali. ¿Quenin tiitztoc?'), explain: 'Bien, gracias: cualli para decir cómo estás y luego las gracias.' },
    ),
    choice(
      'Citlali quiere saber tu nombre. ¿Cómo empiezas tu respuesta?',
      [v('Notoca…', 'Notocah…'), v('Motoca…', 'Motocah…'), v('¿Quen ticah?', '¿Quenin tiitztoc?')],
      0,
      { nah: v('—¿Tlen motoca?', '—¿Tlen motocah?'), explain: 'no- es «mi»: «mi nombre es…». Después dices tu nombre.' },
    ),
    blank(
      v('—Notoca… ¿Tlen ___?', '—Notocah… ¿Tlen ___?'),
      'Ya dijiste tu nombre. Ahora pregúntale el suyo: «Me llamo… ¿Y tú cómo te llamas?»',
      [v('motoca', 'motocah'), v('notoca', 'notocah'), 'cualli'],
      0,
      'mo- es «tu»: «¿cuál es tu nombre?».',
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
    info(
      '¡Cualli! Primer signo completado',
      'Ya puedes leer náhuatl en voz alta, saludar, presentarte y sostener tu primera plática. *Cualli* significa «bien» y «bueno»: lo vas a oír cada vez que aciertes.\n\nLo que sigue: descubrir decenas de palabras que ya usas sin saberlo, decir quién eres, y contar como los mexicas, de veinte en veinte.',
    ),
  ],
};
