import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const yo = w('nehhuatl', v('nehhuatl', 'na'), 'yo');
const tu = w('tehhuatl', v('tehhuatl', 'ta'), 'tú');
const el = w('yehhuatl', v('yehhuatl', 'ya'), 'él, ella');
const nosotros = w('tehhuantin', v('tehhuantin', 'tohhuantin'), 'nosotros');
const ustedes = w('amehhuantin', v('amehhuantin', 'inmohhuantin'), 'ustedes');
const ellos = w('yehhuantin', v('yehhuantin', 'inihhuantin'), 'ellos, ellas');
const tlacatl = w('tlacatl', 'tlacatl', 'persona, hombre');
const cihuatl = w('cihuatl', 'cihuatl', 'mujer');
const conetl = w('conetl', 'conetl', 'niño, niña');
const telpochtli = w('telpochtli', v('telpochtli', 'telpocatl'), 'muchacho');
const ichpochtli = w('ichpochtli', v('ichpochtli', 'ichpocatl'), 'muchacha');
const maestro = w('temachtiani', v('temachtiani', 'tlamachtihquetl'), 'maestro, maestra');
const mexihcatl = w('mexihcatl', 'mexihcatl', 'mexicano, mexicana');
const ticitl = w('ticitl', v('ticitl', 'tepahtihquetl'), 'médico, curandero');

const pronombres = [yo, tu, el, nosotros, ustedes, ellos];
const gente = [tlacatl, cihuatl, conetl, telpochtli, ichpochtli];
const oficios = [maestro, mexihcatl, ticitl];
const vocab = [...pronombres, ...gente, ...oficios];

export const lesson03: Lesson = {
  n: 3,
  slug: 'yo-soy-tu-eres',
  sign: 'Calli',
  title: 'Yo soy, tú eres',
  subtitle: 'Los prefijos de persona y las palabras-oración',
  intro:
    'Calli, la casa: el lugar donde uno es quien es. En náhuatl no existe el verbo «ser». Para decir «soy mexicana» basta pegarle un prefijo al sustantivo. Una sola palabra, una oración completa.',
  minutes: 15,
  access: 'free',
  vocab,
  steps: [
    info(
      'Una palabra, una oración',
      'En español dices «yo soy mujer»: tres palabras. En náhuatl dices *nicihuatl*: una.\n\nNo hay verbo «ser». En su lugar, el sustantivo lleva un *prefijo* que dice quién:\n\n*ni-* yo\n*ti-* tú\n(nada) él o ella',
      [
        { nah: 'nicihuatl', es: 'soy mujer' },
        { nah: 'ticihuatl', es: 'eres mujer' },
        { nah: 'cihuatl', es: 'es mujer / mujer' },
      ],
    ),
    choice('¿Qué significa?', ['soy persona', 'eres persona', 'es persona'], 0, { nah: 'nitlacatl' }),
    choice('¿Qué significa?', ['eres mexicana', 'soy mexicana', 'es mexicana'], 0, { nah: 'timexihcatl' }),
    build('soy mexicano', ['ni', 'mexihcatl'], ['ti', 'an']),
    build('eres mujer', ['ti', 'cihuatl'], ['ni', 'tl']),
    matchOf(gente),
    meaningOf(conetl, gente),
    wordFor(cihuatl, gente),
    info(
      'Los pronombres',
      v(
        'Como el prefijo ya dice quién, el pronombre no hace falta. Se usa para dar énfasis, igual que en español «YO soy mexicano».\n\n*nehhuatl* yo · *tehhuatl* tú · *yehhuatl* él, ella\n\nEn el habla diaria se acortan: *neh*, *teh*, *yeh*.',
        'Como el prefijo ya dice quién, el pronombre no hace falta. Se usa para dar énfasis, igual que en español «YO soy mexicano».\n\n*na* yo · *ta* tú · *ya* él, ella\n\nSon mucho más cortos que en el náhuatl central (*nehhuatl, tehhuatl, yehhuatl*).',
      ),
      [
        { nah: v('Nehhuatl nimexihcatl.', 'Na nimexihcatl.'), es: 'Yo soy mexicano.' },
        { nah: v('¿Tehhuatl titemachtiani?', '¿Ta titlamachtihquetl?'), es: '¿Tú eres maestra?' },
      ],
    ),
    meaningOf(yo, pronombres),
    meaningOf(tu, pronombres),
    wordFor(el, pronombres),
    order('Yo soy mexicana', [yo.nah, 'nimexihcatl'], ['timexihcatl'], undefined, [v('nimexihcatl nehhuatl', 'nimexihcatl na')]),
    blank(v('Tehhuatl ___cihuatl.', 'Ta ___cihuatl.'), 'Tú eres mujer.', ['ti', 'ni', 'an'], 0),
    blank(v('Nehhuatl ___tlacatl.', 'Na ___tlacatl.'), 'Yo soy persona.', ['ni', 'ti', 'mo'], 0),
    info(
      'Oficios y gentilicios',
      v(
        'Funciona con cualquier sustantivo: *temachtiani* es «maestro» (literalmente «el que enseña a la gente»), así que *nitemachtiani* es «soy maestro».\n\nEl náhuatl no distingue masculino y femenino: *temachtiani* es maestro o maestra; *mexihcatl*, mexicano o mexicana.',
        'Funciona con cualquier sustantivo: *tlamachtihquetl* es «maestro» (literalmente «el que enseña»), así que *nitlamachtihquetl* es «soy maestro».\n\nEl náhuatl no distingue masculino y femenino: *tlamachtihquetl* es maestro o maestra; *mexihcatl*, mexicano o mexicana.',
      ),
    ),
    build('soy maestra', ['ni', maestro.nah], ['ti']),
    matchOf([maestro, mexihcatl, ticitl, telpochtli, ichpochtli]),
    choice('¿Cómo dices «eres maestro»?', [v('titemachtiani', 'titlamachtihquetl'), v('nitemachtiani', 'nitlamachtihquetl'), maestro.nah], 0),
    info(
      'Nosotros, ustedes, ellos',
      v(
        'Para el plural cambian dos cosas: el prefijo y el final de la palabra.\n\n*ti-…-h* nosotros\n*an-…-h* ustedes\n(nada)*…-h* ellos\n\nEl sustantivo pierde su *-tl* y toma la marca de plural *-h* (un saltillo): *tlaca-tl* → *tlaca-h*. Otros sustantivos usan *-meh* o *-tin*.\n\nOjo: «nosotros» usa el mismo *ti-* que «tú». La *-h* final es la que marca la diferencia.',
        'Para el plural cambian dos cosas: el prefijo y el final de la palabra.\n\n*ti-…-meh* nosotros\n*in-…-meh* ustedes\n(nada)*…-meh* ellos\n\nEl sustantivo pierde su *-tl* y toma la marca de plural *-meh*: *tlaca-tl* → *tlaca-meh*.\n\nOjo: «nosotros» usa el mismo *ti-* que «tú». El plural del final es el que marca la diferencia.',
      ),
      [
        { nah: v('titlacah', 'titlacameh'), es: 'somos personas' },
        { nah: v('ancihuah', 'incihuameh'), es: 'ustedes son mujeres' },
        { nah: v('tlacah', 'tlacameh'), es: 'son personas / personas' },
      ],
    ),
    build('somos personas', ['ti', 'tlaca', v('h', 'meh')], ['ni', 'tl']),
    build('ustedes son mujeres', [v('an', 'in'), 'cihua', v('h', 'meh')], ['ni', 'tl']),
    choice('¿Qué significa?', ['somos mujeres', 'eres mujer', 'son mujeres'], 0, { nah: v('ticihuah', 'ticihuameh') }),
    meaningOf(nosotros, pronombres),
    wordFor(ellos, pronombres),
    matchOf(pronombres.slice(0, 5)),
    info(
      'Un plural especial: los niños',
      'Algunos plurales repiten la primera sílaba. El de *conetl* (niño) es *coconeh* en las dos variantes: «niños».\n\nAsí que *ticoconeh* es «somos niños».',
      [{ nah: 'coconeh', es: 'niños, niñas' }, { nah: 'ticoconeh', es: 'somos niños' }],
    ),
    choice('¿Qué significa «coconeh»?', ['niños', 'cocos', 'coyotes'], 0),
    write('soy mujer', 'nicihuatl'),
    write('eres persona', 'titlacatl'),
    write('yo', v('nehhuatl | nehuatl | neh | nehhua', 'na | nah | naha')),
    info(
      '¡Cualli!',
      'Ya puedes decir quién eres con una sola palabra. Recuerda los tres prefijos: *ni-* yo, *ti-* tú, y nada para él o ella. Vuelven en cada lección.\n\nSiguiente signo: *Cuetzpalin*, la lagartija. Toca contar… de veinte en veinte.',
    ),
  ],
};
