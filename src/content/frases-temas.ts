/**
 * Phrases for the /frases page, grouped by topic. Every form comes from a lesson (same spelling,
 * same variant split), so the page and the course never disagree.
 */
export type FraseTema = {
  id: string;
  title: string;
  intro: string;
  lesson: number;
  items: { es: string; central: string; huasteca: string; note?: string }[];
};

export const TEMAS: FraseTema[] = [
  {
    id: 'saludos',
    title: 'Saludos y despedidas',
    intro: 'Para empezar y terminar cualquier plática. «Cualli» sirve para responder casi todo: quiere decir «bien» y «bueno».',
    lesson: 1,
    items: [
      { es: 'Hola', central: 'Niltze', huasteca: 'Piyali', note: 'En el centro también se oye «pialli».' },
      { es: '¿Cómo estás?', central: '¿Quen ticah?', huasteca: '¿Quenin tiitztoc?' },
      { es: 'Bien', central: 'Cualli', huasteca: 'Cualli' },
      { es: 'Bien, gracias', central: 'Cualli, tlazohcamati', huasteca: 'Cualli, tlazcamati' },
      { es: 'Gracias', central: 'Tlazohcamati', huasteca: 'Tlazcamati' },
      { es: 'Nos vemos', central: 'Titottazqueh', huasteca: 'Timoittazceh' },
      { es: 'Buen camino', central: 'Ma cualli ohtli', huasteca: 'Ma cualli ohtli', note: 'Despedida de uso moderno.' },
    ],
  },
  {
    id: 'presentarse',
    title: 'Presentarte',
    intro: 'El prefijo «no-» quiere decir «mi» y «mo-», «tu»: «notoca» es literalmente «mi nombre».',
    lesson: 1,
    items: [
      { es: '¿Cómo te llamas?', central: '¿Tlen motoca?', huasteca: '¿Tlen motocah?' },
      { es: 'Me llamo Citlali', central: 'Notoca Citlali', huasteca: 'Notocah Citlali' },
      { es: 'Soy mexicano / mexicana', central: 'Nimexihcatl', huasteca: 'Nimexihcatl' },
      { es: 'Soy maestro / maestra', central: 'Nitemachtiani', huasteca: 'Nitlamachtihquetl' },
      { es: '¿Dónde vives?', central: '¿Canin tichanti?', huasteca: '¿Canin tichanti?' },
      { es: 'Vivo en México', central: 'Nichanti Mexihco', huasteca: 'Nichanti Mexihco' },
      { es: '¿De dónde eres?', central: '¿Canin mochan?', huasteca: '¿Canin mochan?' },
      { es: 'Soy de Puebla', central: 'Nochan Puebla', huasteca: 'Nochan Puebla' },
    ],
  },
  {
    id: 'responder',
    title: 'Sí, no y respuestas útiles',
    intro: 'En la Huasteca, para negar un verbo se le pega «ax-»; «axcanah» es el «no» suelto.',
    lesson: 6,
    items: [
      { es: 'Sí', central: 'Quemah', huasteca: 'Quena' },
      { es: 'No', central: 'Ahmo', huasteca: 'Axcanah' },
      { es: 'No sé', central: 'Ahmo nicmati', huasteca: 'Axnicmati' },
      { es: 'Lo sé', central: 'Nicmati', huasteca: 'Nicmati' },
      { es: 'Quiero agua', central: 'Nicnequi atl', huasteca: 'Nicnequi atl' },
      { es: 'No quiero chile', central: 'Ahmo nicnequi chilli', huasteca: 'Axnicnequi chilli' },
      { es: 'Hablo náhuatl un poquito', central: 'Nitlahtoa nahuatl zan tepitzin', huasteca: 'Nitlahtoa nahuatl zan quentzin' },
    ],
  },
  {
    id: 'preguntas',
    title: 'Preguntas',
    intro: 'Las palabras para preguntar van al principio, igual que en español.',
    lesson: 8,
    items: [
      { es: '¿Qué?', central: '¿Tlen?', huasteca: '¿Tlen?' },
      { es: '¿Quién?', central: '¿Aquin?', huasteca: '¿Ahquiya?' },
      { es: '¿Dónde?', central: '¿Canin?', huasteca: '¿Canin?' },
      { es: '¿Cuántos?', central: '¿Quezqui?', huasteca: '¿Quezqui?' },
      { es: '¿Cuándo?', central: '¿Quemman?', huasteca: '¿Quemman?' },
      { es: '¿Qué haces?', central: '¿Tlen ticchihua?', huasteca: '¿Tlen ticchihua?' },
      { es: '¿Qué quieres?', central: '¿Tlen ticnequi?', huasteca: '¿Tlen ticnequi?' },
      { es: '¿Cuántos años tienes?', central: '¿Quezqui xihuitl ticpia?', huasteca: '¿Quezqui xihuitl ticpiya?' },
    ],
  },
  {
    id: 'familia',
    title: 'La familia',
    intro: 'A la familia casi siempre se le nombra con dueño: una mamá siempre es la mamá de alguien.',
    lesson: 5,
    items: [
      { es: 'Mi mamá', central: 'Nonan', huasteca: 'Nonanan' },
      { es: 'Mi papá', central: 'Notah', huasteca: 'Notatah' },
      { es: 'Mi hijo, mi hija', central: 'Noconeuh', huasteca: 'Nocone' },
      { es: 'Mi amigo, mi amiga', central: 'Nocniuh', huasteca: 'Nohuampoh' },
      { es: 'Mi casa', central: 'Nocal', huasteca: 'Nocal' },
      { es: 'Nuestra madrecita', central: 'Tonantzin', huasteca: 'Tonantzin', note: '-tzin añade cariño y respeto.' },
    ],
  },
  {
    id: 'carino',
    title: 'Cariño y amor',
    intro: 'El verbo lleva adentro a las dos personas: ni- (yo) + mitz- (a ti) + el verbo.',
    lesson: 6,
    items: [
      { es: 'Te quiero', central: 'Nimitztlazohtla', huasteca: 'Nimitzicnelia' },
      { es: 'Te veo', central: 'Nimitzitta', huasteca: 'Nimitzitta' },
      { es: 'Me ves', central: 'Tinechitta', huasteca: 'Tinechitta' },
      { es: 'Mi mamita', central: 'Nonantzin', huasteca: 'Nonantzin' },
    ],
  },
];
