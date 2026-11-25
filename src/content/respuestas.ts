/**
 * Short answer pages for the most searched "¿cómo se dice … en náhuatl?" questions, served at /frases/[slug].
 * Every Nahuatl form here already appears in a lesson, in /frases or in the day signs (same spelling, same
 * variant split). Do not add forms that the course does not teach: they have not been checked.
 * In `body`, *word* marks Nahuatl.
 */
export type Fila = { es: string; central: string; huasteca?: string; note?: string };

export type Respuesta = {
  slug: string;
  /** <title>, at most 60 characters. */
  title: string;
  /** Meta description, at most 155 characters. */
  description: string;
  h1: string;
  /** The direct answer, shown first and quotable as-is. */
  lead: string;
  /** The headline forms. Omitted for list pages. */
  answer?: { central: string; huasteca: string };
  body: string[];
  tableTitle: string;
  /** When rows have no Huasteca form, the single Nahuatl column uses this header. */
  singleColumn?: string;
  rows: Fila[];
  dialogue?: { central: string; huasteca: string; es: string }[];
  lesson: number;
  faq: [string, string][];
};

export const RESPUESTAS: Respuesta[] = [
  {
    slug: 'hola-en-nahuatl',
    title: 'Hola en náhuatl: cómo saludar (niltze y piyali)',
    description:
      '«Hola» en náhuatl se dice «niltze» en náhuatl central y «piyali» en el de la Huasteca. Cómo se pronuncia, cómo responder y otros saludos.',
    h1: '¿Cómo se dice «hola» en náhuatl?',
    lead: '«Hola» se dice «niltze» en náhuatl central (también se oye «pialli») y «piyali» en náhuatl de la Huasteca.',
    answer: { central: 'Niltze', huasteca: 'Piyali' },
    body: [
      '*Niltze* se lee «nil-tse»: la *tz* suena como en «pizza». En *piyali* todas las letras se leen como en español.',
      'Después del saludo casi siempre viene la pregunta *¿quen ticah?* (centro) o *¿quenin tiitztoc?* (Huasteca), «¿cómo estás?». La respuesta más sencilla es *cualli*, «bien», que sirve en las dos variantes.',
      '*Niltze* es un saludo de uso moderno en el náhuatl central; no aparece en los textos clásicos, pero es el que hoy se oye y se enseña.',
    ],
    tableTitle: 'Saludos y despedidas en náhuatl',
    rows: [
      { es: 'Hola', central: 'Niltze', huasteca: 'Piyali', note: 'En el centro también se oye «pialli».' },
      { es: '¿Cómo estás?', central: '¿Quen ticah?', huasteca: '¿Quenin tiitztoc?' },
      { es: 'Bien', central: 'Cualli', huasteca: 'Cualli' },
      { es: 'Bien, gracias', central: 'Cualli, tlazohcamati', huasteca: 'Cualli, tlazcamati' },
      { es: '¿Cómo te llamas?', central: '¿Tlen motoca?', huasteca: '¿Tlen motocah?' },
      { es: 'Me llamo Citlali', central: 'Notoca Citlali', huasteca: 'Notocah Citlali' },
      { es: 'Nos vemos', central: 'Titottazqueh', huasteca: 'Timoittazceh' },
      { es: 'Buen camino', central: 'Ma cualli ohtli', huasteca: 'Ma cualli ohtli', note: 'Despedida de uso moderno.' },
    ],
    dialogue: [
      { central: '—Niltze. ¿Quen ticah?', huasteca: '—Piyali. ¿Quenin tiitztoc?', es: '—Hola. ¿Cómo estás?' },
      { central: '—Cualli, tlazohcamati.', huasteca: '—Cualli, tlazcamati.', es: '—Bien, gracias.' },
    ],
    lesson: 1,
    faq: [
      ['¿Cómo se dice «hola» en náhuatl?', 'En náhuatl central se dice «niltze» (también se oye «pialli») y en náhuatl de la Huasteca, «piyali».'],
      ['¿Cómo se responde a un saludo en náhuatl?', 'Con «cualli», que quiere decir «bien». Para agradecer se agrega «tlazohcamati» (centro) o «tlazcamati» (Huasteca).'],
      ['¿Cómo se dice «adiós» en náhuatl?', '«Nos vemos» se dice «titottazqueh» en náhuatl central y «timoittazceh» en el de la Huasteca. «Ma cualli ohtli», «buen camino», es una despedida de uso moderno.'],
    ],
  },
  {
    slug: 'gracias-en-nahuatl',
    title: 'Gracias en náhuatl: tlazohcamati y tlazcamati',
    description:
      '«Gracias» en náhuatl se dice «tlazohcamati» en náhuatl central y «tlazcamati» en el de la Huasteca. Cómo se pronuncia y cómo usarlo.',
    h1: '¿Cómo se dice «gracias» en náhuatl?',
    lead: '«Gracias» se dice «tlazohcamati» en náhuatl central y «tlazcamati» en náhuatl de la Huasteca.',
    answer: { central: 'Tlazohcamati', huasteca: 'Tlazcamati' },
    body: [
      '*Tlazohcamati* se lee «tla-soh-ca-ma-ti». La *tl* es un solo sonido: una t que se suelta por los lados de la lengua. La *z* suena «s» y la *h* marca un pequeño corte de aire.',
      'Para contestar «bien, gracias» basta con poner *cualli* antes: *cualli, tlazohcamati* en el centro o *cualli, tlazcamati* en la Huasteca.',
    ],
    tableTitle: 'Respuestas útiles en náhuatl',
    rows: [
      { es: 'Gracias', central: 'Tlazohcamati', huasteca: 'Tlazcamati' },
      { es: 'Bien, gracias', central: 'Cualli, tlazohcamati', huasteca: 'Cualli, tlazcamati' },
      { es: 'Bien', central: 'Cualli', huasteca: 'Cualli' },
      { es: 'Sí / No', central: 'Quemah / Ahmo', huasteca: 'Quena / Axcanah' },
      { es: 'No sé', central: 'Ahmo nicmati', huasteca: 'Axnicmati' },
    ],
    dialogue: [
      { central: '—Niltze. ¿Quen ticah?', huasteca: '—Piyali. ¿Quenin tiitztoc?', es: '—Hola. ¿Cómo estás?' },
      { central: '—Cualli, tlazohcamati.', huasteca: '—Cualli, tlazcamati.', es: '—Bien, gracias.' },
    ],
    lesson: 1,
    faq: [
      ['¿Cómo se dice «gracias» en náhuatl?', 'En náhuatl central se dice «tlazohcamati» y en náhuatl de la Huasteca, «tlazcamati».'],
      ['¿Cómo se pronuncia «tlazohcamati»?', '«Tla-soh-ca-ma-ti»: la tl es un solo sonido, la z suena como «s» y la h marca un pequeño corte de aire.'],
      ['¿Cómo se dice «bien, gracias» en náhuatl?', '«Cualli, tlazohcamati» en náhuatl central y «cualli, tlazcamati» en náhuatl de la Huasteca.'],
    ],
  },
  {
    slug: 'te-quiero-en-nahuatl',
    title: 'Te quiero en náhuatl: nimitztlazohtla y nimitzicnelia',
    description:
      '«Te quiero» o «te amo» en náhuatl se dice «nimitztlazohtla» en náhuatl central y «nimitzicnelia» en el de la Huasteca. Cómo se arma la palabra.',
    h1: '¿Cómo se dice «te quiero» en náhuatl?',
    lead: '«Te quiero» se dice «nimitztlazohtla» en náhuatl central y «nimitzicnelia» en náhuatl de la Huasteca. La misma palabra sirve para «te amo».',
    answer: { central: 'Nimitztlazohtla', huasteca: 'Nimitzicnelia' },
    body: [
      'En náhuatl, «te quiero» es una sola palabra que lleva adentro a las dos personas: *ni-* (yo) + *mitz-* (a ti) + el verbo. En el centro el verbo es *tlazohtla*; en la Huasteca, *icnelia*.',
      'El náhuatl no separa «querer» y «amar» como el español: el mismo verbo cubre las dos cosas, así que *nimitztlazohtla* sirve para decir «te quiero» y «te amo».',
      'Las mismas piezas arman otras frases: *nimitzitta* es «te veo» y *tinechitta*, «me ves». Cambia *mitz-* (a ti) por *nech-* (a mí) y *ni-* (yo) por *ti-* (tú).',
    ],
    tableTitle: 'Frases de cariño en náhuatl',
    rows: [
      { es: 'Te quiero / te amo', central: 'Nimitztlazohtla', huasteca: 'Nimitzicnelia' },
      { es: 'Te veo', central: 'Nimitzitta', huasteca: 'Nimitzitta' },
      { es: 'Me ves', central: 'Tinechitta', huasteca: 'Tinechitta' },
      { es: 'Mi mamita', central: 'Nonantzin', huasteca: 'Nonantzin' },
    ],
    lesson: 6,
    faq: [
      ['¿Cómo se dice «te amo» en náhuatl?', 'En náhuatl central se dice «nimitztlazohtla» y en náhuatl de la Huasteca, «nimitzicnelia». Es la misma palabra que «te quiero».'],
      ['¿Qué quiere decir «nimitztlazohtla»?', 'Quiere decir «te quiero» o «te amo». Se arma con ni- (yo), mitz- (a ti) y el verbo tlazohtla (querer, amar).'],
      ['¿Cómo se dice «te veo» en náhuatl?', '«Nimitzitta», en las dos variantes: ni- (yo) + mitz- (a ti) + itta (ver).'],
    ],
  },
  {
    slug: 'animales-en-nahuatl',
    title: 'Animales en náhuatl: nombres con su significado',
    description:
      'Cómo se dicen perro, gato, jaguar, águila, conejo, venado, serpiente y otros animales en náhuatl, con los nombres de los signos del calendario mexica.',
    h1: 'Animales en náhuatl',
    lead: 'Perro se dice «chichi» o «itzcuintli», gato «mizton», jaguar «ocelotl», águila «cuauhtli», conejo «tochtli» y serpiente «coatl».',
    body: [
      'Muchos animales dan nombre a los veinte signos del tonalpohualli, el calendario mexica de 260 días: *cipactli* (caimán), *coatl* (serpiente), *ocelotl* (jaguar), *cuauhtli* (águila). Esos nombres son los del náhuatl clásico.',
      'Para hablar de tus mascotas, el curso usa *chichi* (perro) y *mizton* (gato). Con el posesivo *no-* («mi») quedan *nochichi*, «mi perro», y *nomizton*, «mi gato».',
      'Alguno se quedó en el español de México: *coatl*, «serpiente» y también «gemelo», dio «cuate».',
    ],
    tableTitle: 'Nombres de animales en náhuatl',
    singleColumn: 'Náhuatl',
    rows: [
      { es: 'Perro', central: 'Chichi', note: 'También itzcuintli, el signo 10.' },
      { es: 'Mi perro', central: 'Nochichi' },
      { es: 'Gato', central: 'Mizton' },
      { es: 'Mi gato', central: 'Nomizton' },
      { es: 'Caimán', central: 'Cipactli', note: 'Signo 1.' },
      { es: 'Lagartija', central: 'Cuetzpalin', note: 'Signo 4.' },
      { es: 'Serpiente', central: 'Coatl', note: 'Signo 5.' },
      { es: 'Venado', central: 'Mazatl', note: 'Signo 7.' },
      { es: 'Conejo', central: 'Tochtli', note: 'Signo 8.' },
      { es: 'Mono', central: 'Ozomahtli', note: 'Signo 11.' },
      { es: 'Jaguar', central: 'Ocelotl', note: 'Signo 14.' },
      { es: 'Águila', central: 'Cuauhtli', note: 'Signo 15.' },
      { es: 'Zopilote', central: 'Cozcacuauhtli', note: 'Signo 16.' },
    ],
    lesson: 5,
    faq: [
      ['¿Cómo se dice «perro» en náhuatl?', '«Chichi» es la palabra de uso diario; «itzcuintli» es el nombre del décimo signo del calendario. «Mi perro» se dice «nochichi».'],
      ['¿Cómo se dice «gato» en náhuatl?', '«Mizton». «Mi gato» se dice «nomizton».'],
      ['¿Cómo se dice «jaguar» en náhuatl?', '«Ocelotl». Es el signo 14 del tonalpohualli, el señor de la noche y del monte.'],
    ],
  },
];

export const respuestaBySlug = (slug: string) => RESPUESTAS.find((r) => r.slug === slug);
