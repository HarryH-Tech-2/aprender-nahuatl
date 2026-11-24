import { blank, build, choice, info, matchOf, meaningOf, order, v, w, wordFor, write, type Lesson } from '../types';

const n1 = w('ce', 'ce', 'uno');
const n2 = w('ome', 'ome', 'dos');
const n3 = w('yei', v('yei', 'eyi'), 'tres');
const n4 = w('nahui', 'nahui', 'cuatro');
const n5 = w('macuilli', 'macuilli', 'cinco');
const n6 = w('chicuace', 'chicuace', 'seis');
const n7 = w('chicome', 'chicome', 'siete');
const n8 = w('chicuei', v('chicuei', 'chicueyi'), 'ocho');
const n9 = w('chiucnahui', 'chiucnahui', 'nueve');
const n10 = w('mahtlactli', 'mahtlactli', 'diez');
const n15 = w('caxtolli', 'caxtolli', 'quince');
const n20 = w('cempohualli', 'cempohualli', 'veinte');
const n40 = w('ompohualli', 'ompohualli', 'cuarenta');
const n400 = w('centzontli', 'centzontli', 'cuatrocientos');

const uno5 = [n1, n2, n3, n4, n5];
const seis10 = [n6, n7, n8, n9, n10];
const grandes = [n10, n15, n20, n40, n400];
const vocab = [...uno5, ...seis10, n15, n20, n40, n400];

export const lesson04: Lesson = {
  n: 4,
  slug: 'contar-de-veinte-en-veinte',
  sign: 'Cuetzpalin',
  title: 'Contar de veinte en veinte',
  subtitle: 'Los números y el sistema vigesimal',
  intro:
    'Cuetzpalin, la lagartija, es signo de abundancia. Los nahuas contaban con manos y pies: de cinco en cinco hasta veinte, y de veinte en veinte hasta cuatrocientos. Una vez que ves el patrón, los números se arman solos.',
  minutes: 15,
  access: 'free',
  vocab,
  steps: [
    info(
      'Del uno al cinco',
      v(
        'Los primeros cinco números hay que aprenderlos de memoria:\n\n*ce* 1 · *ome* 2 · *yei* 3 · *nahui* 4 · *macuilli* 5\n\n*Macuilli* viene de *maitl*, «mano»: cinco es «una mano».',
        'Los primeros cinco números hay que aprenderlos de memoria:\n\n*ce* 1 · *ome* 2 · *eyi* 3 · *nahui* 4 · *macuilli* 5\n\n*Macuilli* viene de *maitl*, «mano»: cinco es «una mano».',
      ),
    ),
    matchOf(uno5),
    meaningOf(n2, uno5),
    meaningOf(n4, uno5),
    wordFor(n5, uno5),
    wordFor(n3, uno5),
    info(
      'Del seis al nueve: cinco y algo',
      v(
        'Aquí empieza el truco. Seis es «cinco y uno», siete es «cinco y dos»… El «cinco y» se dice *chicua-* o *chic-*:\n\n*chicua-ce* 6 (5+1)\n*chic-ome* 7 (5+2)\n*chicu-ei* 8 (5+3)\n*chiuc-nahui* 9 (5+4)\n\nY diez es *mahtlactli*: las dos manos.',
        'Aquí empieza el truco. Seis es «cinco y uno», siete es «cinco y dos»… El «cinco y» se dice *chicua-* o *chic-*:\n\n*chicua-ce* 6 (5+1)\n*chic-ome* 7 (5+2)\n*chicu-eyi* 8 (5+3)\n*chiuc-nahui* 9 (5+4)\n\nY diez es *mahtlactli*: las dos manos.',
      ),
    ),
    build('siete (cinco y dos)', ['chic', 'ome'], ['ce', 'nahui']),
    build('seis (cinco y uno)', ['chicua', 'ce'], ['ome', 'nahui']),
    build('nueve (cinco y cuatro)', ['chiuc', 'nahui'], ['ome', 'ce']),
    choice('Si «chicome» es 5+2, ¿cuánto es «chicuace»?', ['6', '8', '9'], 0),
    matchOf(seis10),
    wordFor(n10, seis10),
    info(
      'Del once al diecinueve',
      v(
        'Se dice el diez y se le suma con *on-* («y»): *mahtlactli once* es 11, «diez y uno».\n\nEl quince tiene nombre propio: *caxtolli*. Del 16 al 19 se le suma igual: *caxtolli once* es 16.\n\nAntes de *o* y de *m*, *on-* se vuelve *om-*: *omome* (y dos), *omei* (y tres).',
        'Se dice el diez y se le suma con *huan* («y»): *mahtlactli huan ce* es 11, «diez y uno».\n\nEl quince tiene nombre propio: *caxtolli*. Del 16 al 19 se le suma igual: *caxtolli huan ce* es 16.\n\nEn el náhuatl central antiguo se decía con *on-*: *mahtlactli once*.',
      ),
      [
        { nah: v('mahtlactli omome', 'mahtlactli huan ome'), es: '12' },
        { nah: 'caxtolli', es: '15' },
        { nah: v('caxtolli onnahui', 'caxtolli huan nahui'), es: '19' },
      ],
    ),
    order('once (diez y uno)', ['mahtlactli', v('once', 'huan ce')], [v('omome', 'huan ome')]),
    order('dieciséis (quince y uno)', ['caxtolli', v('once', 'huan ce')], ['mahtlactli']),
    choice('¿Cuánto es?', ['13', '8', '17'], 0, { nah: v('mahtlactli omei', 'mahtlactli huan eyi') }),
    choice('¿Cuánto es?', ['17', '12', '7'], 0, { nah: v('caxtolli omome', 'caxtolli huan ome') }),
    info(
      'Veinte: una cuenta completa',
      'Veinte son todos los dedos de manos y pies: una persona completa. Se dice *cempohualli*, «una cuenta» (*cem-* uno + *pohualli* cuenta).\n\nDe ahí en adelante se cuentan veintenas:\n\n*cem-pohualli* 20 (1×20)\n*om-pohualli* 40 (2×20)\n*macuil-pohualli* 100 (5×20)\n\nEl francés hace algo parecido: 80 es *quatre-vingts*, «cuatro veintes».',
    ),
    build('veinte (una cuenta)', ['cem', 'pohualli'], ['om', 'tzontli']),
    build('cuarenta (dos cuentas)', ['om', 'pohualli'], ['cem', 'macuil']),
    build('cien (cinco cuentas)', ['macuil', 'pohualli'], ['om', 'ce']),
    choice('¿Cuánto es «nauhpohualli»? (nauh- viene de nahui)', ['80', '24', '400'], 0, { explain: '4 × 20 = 80.' }),
    choice('¿Cuánto es?', ['21', '40', '12'], 0, { nah: v('cempohualli once', 'cempohualli huan ce') }),
    info(
      'Cuatrocientos: tantos como cabellos',
      v(
        'Veinte veintenas son 400: *centzontli*, de *tzontli*, «cabello». Cuatrocientos era tanto que también quería decir «muchísimos».\n\nPor eso el *cenzontle* se llama así: es el ave de las «cuatrocientas voces».\n\nPara sumar a los cientos se usa *ipan* («sobre»): *centzontli ipan macuilli* es 405.',
        'Veinte veintenas son 400: *centzontli*, de *tzontli*, «cabello». Cuatrocientos era tanto que también quería decir «muchísimos».\n\nPor eso el *cenzontle* se llama así: es el ave de las «cuatrocientas voces».\n\nHoy, para números grandes, en la Huasteca casi siempre se usan los del español. Los nombres en náhuatl se están recuperando en las escuelas.',
      ),
    ),
    build('cuatrocientos', ['cen', 'tzontli'], ['pohualli', 'om']),
    choice('¿Por qué el cenzontle se llama así?', ['Por sus «cuatrocientas voces»', 'Porque vive cien años', 'Porque pone veinte huevos'], 0),
    matchOf(grandes),
    info(
      'Contar cosas',
      'El número va antes de la cosa, y las cosas (lo que no está vivo) no cambian en plural: *ome calli* es «dos casas», no hace falta más.',
      [
        { nah: 'ce xochitl', es: 'una flor' },
        { nah: 'ome calli', es: 'dos casas' },
        { nah: 'macuilli tamalli', es: 'cinco tamales' },
      ],
    ),
    order('dos casas', ['ome', 'calli'], ['ce']),
    blank('Nicnequi ___ tamalli.', 'Quiero cinco tamales.', ['macuilli', 'mahtlactli', 'ome'], 0),
    write('uno', 'ce'),
    write('dos', 'ome'),
    write('cinco', 'macuilli'),
    write('veinte', 'cempohualli'),
    info(
      '¡Cualli!',
      'Ya tienes el sistema completo: cinco, diez, quince, veinte, cuatrocientos. En la herramienta *Números en náhuatl* puedes escribir cualquier cantidad y verla armada, con todo y los glifos mexicas.\n\nSiguiente signo: *Coatl*, la serpiente. Vas a hablar de tu casa y tu familia.',
    ),
  ],
};
