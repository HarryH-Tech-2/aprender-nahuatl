import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const cochi = w('cochi', 'cochi', 'duerme');
const tlacua = w('tlacua', 'tlacua', 'come');
const atli = w('atli', 'atli', 'bebe agua');
const tequiti = w('tequiti', 'tequiti', 'trabaja');
const cuica = w('cuica', v('cuica', 'huica'), 'canta');
const choca = w('choca', 'choca', 'llora');
const huetzca = w('huetzca', 'huetzca', 'ríe');
const tlahtoa = w('tlahtoa', 'tlahtoa', 'habla');
const nehnemi = w('nehnemi', 'nehnemi', 'camina');
const nicnequi = w('nicnequi', 'nicnequi', 'lo quiero');
const niccua = w('niccua', 'niccua', 'lo como');
const niquitta = w('niquitta', 'niquitta', 'lo veo');
const nicmati = w('nicmati', 'nicmati', 'lo sé');
const tequiero = w('nimitztlazohtla', v('nimitztlazohtla', 'nimitzicnelia'), 'te quiero');

const verbos1 = [cochi, tlacua, atli, tequiti, cuica];
const verbos2 = [choca, huetzca, tlahtoa, nehnemi, cuica];
const conObjeto = [nicnequi, niccua, niquitta, nicmati, tequiero];
const vocab = [cochi, tlacua, atli, tequiti, cuica, choca, huetzca, tlahtoa, nehnemi, ...conObjeto];

export const lesson06: Lesson = {
  n: 6,
  slug: 'que-haces',
  sign: 'Miquiztli',
  title: '¿Qué haces?',
  subtitle: 'Verbos en presente, «lo quiero» y «no quiero»',
  intro:
    'Miquiztli no es un signo de mal agüero: marca el fin de una etapa y el inicio de otra. Hasta aquí nombrabas cosas; desde aquí cuentas lo que pasa. Los verbos usan los mismos prefijos ni- y ti- que ya conoces.',
  minutes: 18,
  access: 'free',
  vocab,
  steps: [
    info(
      'Los mismos prefijos',
      'Buenas noticias: los verbos llevan los prefijos que ya sabes.\n\n*ni-cochi* duermo\n*ti-cochi* duermes\n*cochi* duerme\n\nEl verbo «pelón», sin prefijo, es la forma de él o ella. Así aparece en los diccionarios: *cochi* = «(él, ella) duerme».',
    ),
    matchOf(verbos1),
    meaningOf(cochi, verbos1),
    meaningOf(tequiti, verbos1),
    build('duermo', ['ni', 'cochi'], ['ti', 'h']),
    build('trabajas', ['ti', 'tequiti'], ['ni', 'an']),
    choice('¿Qué significa?', ['comes', 'como', 'come'], 0, { nah: 'titlacua' }),
    choice('¿Qué significa?', ['canta', 'canto', 'cantas'], 0, { nah: cuica.nah }),
    info(
      'Más de uno',
      v(
        'El plural del verbo se marca con una *-h* al final (un saltillo), igual que en los sustantivos:\n\n*ti-cochi-h* dormimos\n*an-cochi-h* ustedes duermen\n*cochi-h* ellos duermen',
        'El plural del verbo se marca con una *-h* al final:\n\n*ti-cochi-h* dormimos\n*in-cochi-h* ustedes duermen\n*cochi-h* ellos duermen',
      ),
      [
        { nah: 'ticochi', es: 'duermes' },
        { nah: 'ticochih', es: 'dormimos' },
      ],
    ),
    build('cantamos', ['ti', cuica.nah, 'h'], ['ni', 'tl']),
    choice('¿Qué significa «tequitih»?', ['ellos trabajan', 'él trabaja', 'yo trabajo'], 0),
    matchOf(verbos2),
    wordFor(huetzca, verbos2),
    meaningOf(nehnemi, verbos2),
    info(
      'Verbos que piden «algo»',
      'Hay verbos que se quedan cortos si no dices *qué*: querer, ver, comer algo. En náhuatl ese «lo» va DENTRO del verbo, entre el prefijo y la raíz, como *-c-*:\n\n*ni-c-nequi* lo quiero\n*ti-c-nequi* lo quieres\n*qui-nequi* lo quiere (aquí es *qui-*)\n\nSi además nombras la cosa, la pones después: *nicnequi atl*, «(lo) quiero agua».\n\nAntes de *e* o *i*, la *c* se escribe *qu* para que suene igual: *ni-qu-itta*, «lo veo».',
      [
        { nah: 'Nicnequi atl.', es: 'Quiero agua.' },
        { nah: 'Ticcua tamalli.', es: 'Comes tamal.' },
        { nah: 'Niquitta tepetl.', es: 'Veo el cerro.' },
      ],
    ),
    build('lo quiero', ['ni', 'c', 'nequi'], ['ti', 'qui']),
    build('lo quieres', ['ti', 'c', 'nequi'], ['ni', 'mo']),
    order('Quiero agua', ['Nicnequi', 'atl'], ['Ticnequi'], undefined, ['atl Nicnequi']),
    blank('Ti___cua tlaxcalli.', 'Comes tortilla.', ['c', 'ni', 'mo'], 0),
    info(
      'Tlacua: comer «algo»',
      '¿Y si no quieres decir qué comes? Entonces el hueco se llena con *tla-*, «algo»:\n\n*ni-tla-cua* como (algo)\n*ni-c-cua tamalli* como tamal\n\nPor eso *tlacua* es «come», a secas. Muchos verbos empiezan con ese *tla-*.',
    ),
    choice('¿Cuál dice «como tamal»?', ['Niccua tamalli', 'Nitlacua tamalli', 'Nicochi tamalli'], 0, {
      explain: 'Cuando dices qué comes, usas -c-. Tla- es para «algo», sin decir qué.',
    }),
    info(
      'Tú y yo dentro del verbo',
      v(
        'El hueco también puede ser una persona:\n\n*-nech-* a mí\n*-mitz-* a ti\n\n*ni-mitz-itta* te veo\n*ti-nech-itta* me ves\n\nY la frase que todo mundo quiere aprender: *nimitztlazohtla*, «te quiero».',
        'El hueco también puede ser una persona:\n\n*-nech-* a mí\n*-mitz-* a ti\n\n*ni-mitz-itta* te veo\n*ti-nech-itta* me ves\n\nY la frase que todo mundo quiere aprender: *nimitzicnelia*, «te quiero». (En el centro se dice *nimitztlazohtla*.)',
      ),
    ),
    build('te veo', ['ni', 'mitz', 'itta'], ['nech', 'ti']),
    build('me ves', ['ti', 'nech', 'itta'], ['mitz', 'ni']),
    build('te quiero', ['ni', 'mitz', v('tlazohtla', 'icnelia')], ['nech', 'ti']),
    matchOf(conObjeto),
    meaningOf(nicmati, conObjeto),
    info(
      'Decir que no',
      v(
        'Para negar se pone *ahmo* antes del verbo:\n\n*Ahmo nicochi.* No duermo.\n*Ahmo nicnequi chilli.* No quiero chile.\n*Ahmo nicmati.* No sé.',
        'Para negar se le pega *ax-* al verbo:\n\n*Axnicochi.* No duermo.\n*Axnicnequi chilli.* No quiero chile.\n*Axnicmati.* No sé.\n\n*Axcanah* es el «no» suelto, el que usas para responder una pregunta.',
      ),
    ),
    order('No quiero chile', [v('Ahmo nicnequi', 'Axnicnequi'), 'chilli'], [v('Ahmo ticnequi', 'Axticnequi'), 'atl']),
    choice('¿Cómo dices «no sé»?', [v('Ahmo nicmati', 'Axnicmati'), 'Nicmati', v('Ahmo ticmati', 'Axticmati')], 0),
    info(
      '¿Qué haces?',
      'La pregunta que da nombre a la lección: *¿Tlen ticchihua?* Viene de *chihua*, «hacer»: *ti-c-chihua*, «lo haces».',
      [
        { nah: '—¿Tlen ticchihua?', es: '—¿Qué haces?' },
        { nah: '—Nitequiti.', es: '—Trabajo.' },
      ],
    ),
    order('¿Qué haces?', ['¿Tlen', 'ticchihua?'], ['nicchihua?']),
    blank('—¿Tlen ticchihua? —___tlacua.', '—¿Qué haces? —Como.', ['Ni', 'Ti', 'Mo'], 0),
    write('duermo', 'nicochi'),
    write('quiero agua', 'nicnequi atl | atl nicnequi'),
    write('te quiero', 'nimitztlazohtla | nimitzicnelia'),
    info(
      '¡Cualli!',
      'Este fue el salto más grande del curso: ya armas verbos con sujeto y objeto adentro. *Ni-mitz-itta*: tres piezas, una oración.\n\nSiguiente signo: *Mazatl*, el venado. Vamos a recorrer el mapa de México leyendo sus nombres.',
    ),
  ],
};
