import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const tlen = w('tlen', 'tlen', '¿qué?');
const aquin = w('aquin', v('aquin', 'ahquiya'), '¿quién?');
const canin = w('canin', 'canin', '¿dónde?');
const quezqui = w('quezqui', 'quezqui', '¿cuántos?');
const quemman = w('quemman', 'quemman', '¿cuándo?');
const huan = w('huan', 'huan', 'y');
const xihuitl = w('xihuitl', 'xihuitl', 'año');
const nicpia = w('nicpia', v('nicpia', 'nicpiya'), 'tengo');
const axcan = w('axcan', 'axcan', 'hoy, ahora');
const moztla = w('moztla', 'moztla', 'mañana');
const yalhua = w('yalhua', 'yalhua', 'ayer');
const miec = w('miec', v('miec', 'miac'), 'mucho, muchos');
const tepitzin = w('tepitzin', v('tepitzin', 'quentzin'), 'un poquito');
const buencamino = w('ma-cualli-ohtli', 'ma cualli ohtli', '¡buen camino!');

const preguntas = [tlen, aquin, canin, quezqui, quemman];
const tiempo = [axcan, moztla, yalhua, miec, tepitzin];
const vocab = [...preguntas, huan, xihuitl, nicpia, ...tiempo, buencamino];

export const lesson08: Lesson = {
  n: 8,
  slug: 'tu-primera-conversacion',
  sign: 'Tochtli',
  title: 'Tu primera conversación',
  subtitle: 'Preguntas, respuestas y todo junto',
  intro:
    'Tochtli, el conejo, es signo de fiesta: toca celebrar. Con las palabras para preguntar —qué, quién, dónde, cuántos— vas a juntar todo lo aprendido en una plática de verdad, de principio a fin.',
  minutes: 18,
  access: 'free',
  vocab,
  steps: [
    info(
      'Las palabras para preguntar',
      v(
        'Ya conoces dos: *¿tlen?* (¿qué?) y *¿canin?* (¿dónde?). Estas son las demás:\n\n*¿aquin?* ¿quién?\n*¿quezqui?* ¿cuántos?\n*¿quemman?* ¿cuándo?\n*¿quen?* ¿cómo? (como en *¿quen tica?*)\n\nVan al principio de la pregunta, igual que en español.',
        'Ya conoces dos: *¿tlen?* (¿qué?) y *¿canin?* (¿dónde?). Estas son las demás:\n\n*¿ahquiya?* ¿quién?\n*¿quezqui?* ¿cuántos?\n*¿quemman?* ¿cuándo?\n*¿quenin?* ¿cómo? (como en *¿quenin tiitztoc?*)\n\nVan al principio de la pregunta, igual que en español.',
      ),
    ),
    matchOf(preguntas),
    meaningOf(aquin, preguntas),
    meaningOf(quezqui, preguntas),
    wordFor(canin, preguntas),
    wordFor(tlen, preguntas),
    info(
      '¿Qué quieres?',
      'Junta la palabra de pregunta con un verbo de la lección 6:\n\n*¿Tlen ticnequi?* ¿Qué quieres?\n*Nicnequi atl.* Quiero agua.\n\nPara unir dos cosas se usa *huan*, «y»: *tlaxcalli huan etl*, «tortilla y frijol».',
      [
        { nah: '—¿Tlen ticnequi?', es: '—¿Qué quieres?' },
        { nah: '—Nicnequi tamalli huan atl.', es: '—Quiero tamal y agua.' },
      ],
    ),
    order('¿Qué quieres?', ['¿Tlen', 'ticnequi?'], ['nicnequi?']),
    order('Quiero tortilla y frijol', ['Nicnequi', 'tlaxcalli', 'huan', 'etl'], ['tlen']),
    blank('Nicnequi tamalli ___ atl.', 'Quiero tamal y agua.', ['huan', 'tlen', 'canin'], 0),
    info(
      '¿Quién es?',
      v(
        'Para preguntar por una persona: *¿Aquin yehuatl?*, «¿quién es ella?» o «¿quién es él?».\n\nLa respuesta usa las palabras de familia: *Yehuatl nonan*, «ella es mi mamá».',
        'Para preguntar por una persona: *¿Ahquiya ya?*, «¿quién es ella?» o «¿quién es él?».\n\nLa respuesta usa las palabras de familia: *Ya nonanan*, «ella es mi mamá».',
      ),
    ),
    order('¿Quién es ella?', [v('¿Aquin', '¿Ahquiya'), v('yehuatl?', 'ya?')], [v('tehuatl?', 'ta?')]),
    order('Ella es mi mamá', [v('Yehuatl', 'Ya'), v('nonan', 'nonanan')], [v('monan', 'monanan')]),
    choice('Te preguntan quién es alguien y es tu amigo. ¿Qué respondes?', [
      v('Yehuatl nocniuh', 'Ya nohuampoh'), v('Yehuatl mocniuh', 'Ya mohuampoh'), v('Nehuatl nocniuh', 'Na nohuampoh'),
    ], 0),
    info(
      '¿Cuántos años tienes?',
      v(
        '«Tener» se dice con *pia*: *nicpia*, «(lo) tengo». Y *xihuitl* es «año».\n\n*¿Quezqui xihuitl ticpia?* ¿Cuántos años tienes?\n*Nicpia cempohualli xihuitl.* Tengo veinte años.',
        '«Tener» se dice con *piya*: *nicpiya*, «(lo) tengo». Y *xihuitl* es «año».\n\n*¿Quezqui xihuitl ticpiya?* ¿Cuántos años tienes?\n*Nicpiya cempohualli xihuitl.* Tengo veinte años.',
      ),
    ),
    build('tengo', ['ni', 'c', v('pia', 'piya')], ['ti', 'mitz']),
    order('¿Cuántos años tienes?', ['¿Quezqui', 'xihuitl', v('ticpia?', 'ticpiya?')], [v('nicpia?', 'nicpiya?')]),
    order('Tengo veinte años', [nicpia.nah, 'cempohualli', 'xihuitl'], ['ompohualli']),
    choice('¿Cuántos años dice que tiene?', ['40', '20', '15'], 0, { nah: v('Nicpia ompohualli xihuitl.', 'Nicpiya ompohualli xihuitl.') }),
    info(
      'Hoy, mañana, ayer',
      v(
        'Tres palabras para ubicarte en el tiempo: *axcan* (hoy, ahora), *moztla* (mañana), *yalhua* (ayer).\n\nY dos para medir: *miec* (mucho) y *tepitzin* (un poquito).\n\n*Axcan nitequiti miec.* Hoy trabajo mucho.',
        'Tres palabras para ubicarte en el tiempo: *axcan* (hoy, ahora), *moztla* (mañana), *yalhua* (ayer).\n\nY dos para medir: *miac* (mucho) y *quentzin* (un poquito).\n\n*Axcan nitequiti miac.* Hoy trabajo mucho.',
      ),
    ),
    matchOf(tiempo),
    meaningOf(moztla, tiempo),
    wordFor(axcan, tiempo),
    order('Hoy trabajo mucho', ['Axcan', 'nitequiti', miec.nah], ['moztla']),
    blank(v('Nitlahtoa nahuatl zan ___.', 'Nitlahtoa nahuatl zan ___.'), 'Hablo náhuatl solo un poquito.', [tepitzin.nah, miec.nah, 'axcan'], 0, 'Una frase muy útil para empezar cualquier plática.'),
    info(
      'La plática completa',
      v(
        'Lee esta conversación. Ya entiendes cada pieza:\n\n—Niltze. ¿Quen tica?\n—Cualli, tlazohcamati. ¿Tlen motoca?\n—Notoca Citlali. ¿Huan tehuatl?\n—Notoca Tonatiuh. ¿Canin tichanti?\n—Nichanti Tlalpan. Nochan Puebla.\n—¿Titemachtiani?\n—Quemah, nitemachtiani. Ma cualli ohtli.\n—Timoittazqueh.',
        'Lee esta conversación. Ya entiendes cada pieza:\n\n—Piyali. ¿Quenin tiitztoc?\n—Cualli, tlazcamati. ¿Tlen motocah?\n—Notocah Citlali. ¿Huan ta?\n—Notocah Tonatiuh. ¿Canin tichanti?\n—Nichanti Tlalpan. Nochan Huejutla.\n—¿Titlamachtihquetl?\n—Quena, nitlamachtihquetl. Ma cualli ohtli.\n—Timoittazceh.',
      ),
    ),
    choice('En la plática, ¿dónde vive Citlali?', ['En Tlalpan', v('En Puebla', 'En Huejutla'), 'En Mazatlán'], 0),
    choice('¿A qué se dedica Citlali?', ['Es maestra', 'Es médica', 'Es estudiante'], 0),
    choice('«¿Huan tehuatl?» / «¿Huan ta?» quiere decir…', ['¿Y tú?', '¿Y él?', '¿Quién eres?'], 0),
    meaningOf(buencamino, [buencamino, miec, quemman]),
    info(
      'Ahora tú',
      'Responde como si platicaras con alguien. Cualquier nombre de lugar sirve; aquí practicamos con frases fijas.',
    ),
    write('¿cómo te llamas?', v('tlen motoca', 'tlen motocah')),
    write('quiero agua', 'nicnequi atl'),
    write('¿dónde vives?', 'canin tichanti'),
    write('y', 'huan'),
    info(
      '¡Cualli! Ocho signos',
      'Completaste los primeros ocho signos del tonalpohualli. Puedes saludar, presentarte, hablar de tu familia, contar, decir qué haces y dónde vives, y leer los nombres del mapa.\n\nLo que sigue es practicar con gente. Busca hablantes, canciones, radios comunitarias. *Ma cualli ohtli*: buen camino.',
    ),
  ],
};
