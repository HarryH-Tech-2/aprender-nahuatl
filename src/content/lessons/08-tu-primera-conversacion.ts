import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const tlen = w('tlen', 'tlen', '¿qué?');
const aquin = w('aquin', v('aquin', 'ahquiya'), '¿quién?');
const canin = w('canin', 'canin', '¿dónde?');
const quezqui = w('quezqui', 'quezqui', '¿cuántos?');
const quemman = w('quemman', 'quemman', '¿cuándo?');
const huan = w('huan', v('ihuan', 'huan'), 'y');
const xihuitl = w('xihuitl', 'xihuitl', 'año');
const nicpia = w('nicpia', v('nicpia', 'nicpiya'), 'tengo');
const axcan = w('axcan', v('axcan', 'naman'), 'hoy, ahora');
const moztla = w('moztla', 'moztla', 'mañana');
const yalhua = w('yalhua', v('yalhua', 'yalhuaya'), 'ayer');
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
        'Ya conoces dos: *¿tlen?* (¿qué?) y *¿canin?* (¿dónde?). Estas son las demás:\n\n*¿aquin?* ¿quién?\n*¿quezqui?* ¿cuántos?\n*¿quemman?* ¿cuándo?\n*¿quen?* ¿cómo? (como en *¿quen ticah?*)\n\nVan al principio de la pregunta, igual que en español.',
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
      v(
        'Junta la palabra de pregunta con un verbo de la lección 6:\n\n*¿Tlen ticnequi?* ¿Qué quieres?\n*Nicnequi atl.* Quiero agua.\n\nPara unir dos cosas se usa *ihuan*, «y»: *tlaxcalli ihuan etl*, «tortilla y frijol». (En otras regiones se acorta a *huan*.)',
        'Junta la palabra de pregunta con un verbo de la lección 6:\n\n*¿Tlen ticnequi?* ¿Qué quieres?\n*Nicnequi atl.* Quiero agua.\n\nPara unir dos cosas se usa *huan*, «y»: *tlaxcalli huan etl*, «tortilla y frijol».',
      ),
      [
        { nah: '—¿Tlen ticnequi?', es: '—¿Qué quieres?' },
        { nah: v('—Nicnequi tamalli ihuan atl.', '—Nicnequi tamalli huan atl.'), es: '—Quiero tamal y agua.' },
      ],
    ),
    order('¿Qué quieres?', ['¿Tlen', 'ticnequi?'], ['nicnequi?']),
    order('Quiero tortilla y frijol', ['Nicnequi', 'tlaxcalli', huan.nah, 'etl'], ['tlen'], undefined, [v('Nicnequi etl ihuan tlaxcalli', 'Nicnequi etl huan tlaxcalli')]),
    blank('Nicnequi tamalli ___ atl.', 'Quiero tamal y agua.', [huan.nah, 'tlen', 'canin'], 0),
    info(
      '¿Quién es?',
      v(
        'Para preguntar por una persona: *¿Aquin yehhuatl?*, «¿quién es ella?» o «¿quién es él?».\n\nLa respuesta usa las palabras de familia: *Yehhuatl nonan*, «ella es mi mamá».',
        'Para preguntar por una persona: *¿Ahquiya ya?*, «¿quién es ella?» o «¿quién es él?».\n\nLa respuesta usa las palabras de familia: *Ya nonanan*, «ella es mi mamá».',
      ),
    ),
    order('¿Quién es ella?', [v('¿Aquin', '¿Ahquiya'), v('yehhuatl?', 'ya?')], [v('tehhuatl?', 'ta?')]),
    order('Ella es mi mamá', [v('Yehhuatl', 'Ya'), v('nonan', 'nonanan')], [v('monan', 'monanan')], undefined, [v('nonan Yehhuatl', 'nonanan Ya')]),
    choice('Te preguntan quién es alguien y es tu amigo. ¿Qué respondes?', [
      v('Yehhuatl nocniuh', 'Ya nohuampoh'), v('Yehhuatl mocniuh', 'Ya mohuampoh'), v('Nehhuatl nocniuh', 'Na nohuampoh'),
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
    order('Tengo veinte años', [nicpia.nah, 'cempohualli', 'xihuitl'], ['ompohualli'], undefined, [v('cempohualli xihuitl nicpia', 'cempohualli xihuitl nicpiya')]),
    choice('¿Cuántos años dice que tiene?', ['40', '20', '15'], 0, { nah: v('Nicpia ompohualli xihuitl.', 'Nicpiya ompohualli xihuitl.') }),
    info(
      'Hoy, mañana, ayer',
      v(
        'Tres palabras para ubicarte en el tiempo: *axcan* (hoy, ahora), *moztla* (mañana), *yalhua* (ayer).\n\nY dos para medir: *miec* (mucho) y *tepitzin* (un poquito).\n\n*Axcan nitequiti miec.* Hoy trabajo mucho.',
        'Tres palabras para ubicarte en el tiempo: *naman* (hoy, ahora), *moztla* (mañana), *yalhuaya* (ayer).\n\nY dos para medir: *miac* (mucho) y *quentzin* (un poquito).\n\n*Naman nitequiti miac.* Hoy trabajo mucho.',
      ),
    ),
    matchOf(tiempo),
    meaningOf(moztla, tiempo),
    wordFor(axcan, tiempo),
    order('Hoy trabajo mucho', [v('Axcan', 'Naman'), 'nitequiti', miec.nah], ['moztla'], undefined, [v('Axcan miec nitequiti', 'Naman miac nitequiti')]),
    blank(v('Nitlahtoa nahuatl zan ___.', 'Nitlahtoa nahuatl zan ___.'), 'Hablo náhuatl solo un poquito.', [tepitzin.nah, miec.nah, axcan.nah], 0, 'Una frase muy útil para empezar cualquier plática.'),
    info(
      'La plática completa',
      v(
        'Lee esta conversación. Ya entiendes cada pieza:\n\n—Niltze. ¿Quen ticah?\n—Cualli, tlazohcamati. ¿Tlen motoca?\n—Notoca Citlali. ¿Ihuan tehhuatl?\n—Notoca Tonatiuh. ¿Canin tichanti?\n—Nichanti Tlalpan.\n—¿Titemachtiani?\n—Quemah, nitemachtiani. Ma cualli ohtli.\n—Titottazqueh.',
        'Lee esta conversación. Ya entiendes cada pieza:\n\n—Piyali. ¿Quenin tiitztoc?\n—Cualli, tlazcamati. ¿Tlen motocah?\n—Notocah Citlali. ¿Huan ta?\n—Notocah Tonatiuh. ¿Canin tichanti?\n—Nichanti Tlalpan.\n—¿Titlamachtihquetl?\n—Quena, nitlamachtihquetl. Ma cualli ohtli.\n—Timoittazceh.',
      ),
    ),
    choice('En la plática, ¿dónde vive Tonatiuh?', ['En Tlalpan', 'En Puebla', 'En Mazatlán'], 0),
    choice('¿A qué se dedica Tonatiuh?', ['Es maestro', 'Es médico', 'Es estudiante'], 0),
    choice('¿Qué quiere decir?', ['¿Y tú?', '¿Y él?', '¿Quién eres?'], 0, { nah: v('¿Ihuan tehhuatl?', '¿Huan ta?') }),
    meaningOf(buencamino, [buencamino, miec, quemman]),
    info(
      'Ahora tú',
      'Responde como si platicaras con alguien. Cualquier nombre de lugar sirve; aquí practicamos con frases fijas.',
    ),
    write('¿cómo te llamas?', v('tlen motoca | tlein motoca | quen motoca', 'tlen motocah | quenin motocah')),
    write('quiero agua', 'nicnequi atl | atl nicnequi'),
    write('¿dónde vives?', 'canin tichanti | can tichanti'),
    write('y', v('ihuan | huan', 'huan')),
    info(
      '¡Cualli! Ocho signos',
      'Completaste los primeros ocho signos del tonalpohualli. Puedes saludar, presentarte, hablar de tu familia, contar, decir qué haces y dónde vives, y leer los nombres del mapa.\n\nLo que sigue es practicar con gente. Busca hablantes, canciones, radios comunitarias. *Ma cualli ohtli*: buen camino.',
    ),
  ],
};
