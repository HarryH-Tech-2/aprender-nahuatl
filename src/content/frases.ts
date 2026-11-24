/** Everyday phrases shown on the home page, taken from the lessons (same forms, same variants). */
export type Frase = { es: string; central: string; huasteca: string; lesson: number };

export const FRASES: Frase[] = [
  { es: 'Hola', central: 'Niltze', huasteca: 'Piyali', lesson: 1 },
  { es: '¿Cómo estás?', central: '¿Quen ticah?', huasteca: '¿Quenin tiitztoc?', lesson: 1 },
  { es: 'Bien', central: 'Cualli', huasteca: 'Cualli', lesson: 1 },
  { es: 'Gracias', central: 'Tlazohcamati', huasteca: 'Tlazcamati', lesson: 1 },
  { es: 'Sí / No', central: 'Quemah / Ahmo', huasteca: 'Quena / Axcanah', lesson: 1 },
  { es: '¿Cómo te llamas?', central: '¿Tlen motoca?', huasteca: '¿Tlen motocah?', lesson: 1 },
  { es: 'Me llamo Citlali', central: 'Notoca Citlali', huasteca: 'Notocah Citlali', lesson: 1 },
  { es: 'Nos vemos', central: 'Titottazqueh', huasteca: 'Timoittazceh', lesson: 1 },
  { es: 'Te quiero', central: 'Nimitztlazohtla', huasteca: 'Nimitzicnelia', lesson: 6 },
  { es: '¿Dónde vives?', central: '¿Canin tichanti?', huasteca: '¿Canin tichanti?', lesson: 7 },
  { es: 'Quiero agua', central: 'Nicnequi atl', huasteca: 'Nicnequi atl', lesson: 6 },
  { es: 'No sé', central: 'Ahmo nicmati', huasteca: 'Axnicmati', lesson: 6 },
];

/** A few everyday Mexican Spanish words and the Nahuatl they come from. */
export const PALABRAS: [string, string, string][] = [
  ['aguacate', 'ahuacatl', 'el fruto del aguacate'],
  ['chocolate', 'chocolatl', 'bebida de cacao'],
  ['tomate', 'tomatl', 'fruto gordo'],
  ['chile', 'chilli', 'el picante'],
  ['tianguis', 'tianquiztli', 'mercado'],
  ['papalote', 'papalotl', 'mariposa'],
  ['cuate', 'coatl', 'serpiente, gemelo'],
  ['apapachar', 'papatzoa', 'apretar con los dedos'],
  ['elote', 'elotl', 'mazorca tierna'],
  ['mitote', 'mihtotia', 'bailar'],
  ['popote', 'popotl', 'paja, varita'],
  ['tlapalería', 'tlapalli', 'color, pintura'],
];
