export const SITE_NAME = 'Aprender Náhuatl';
// The www host is the one Vercel serves (the bare domain redirects to it), so canonicals must use it.
export const SITE_URL = 'https://www.aprendernahuatl.com';

/** The site's author, for structured data. Keep it factual: no claims of fluency or teaching credentials. */
export const AUTHOR = {
  '@type': 'Person',
  name: 'Harry Harrison',
  url: `${SITE_URL}/acerca#quien`,
  sameAs: ['https://www.linkedin.com/in/harry-harrison/'],
} as const;

export const TOOLS = [
  { href: '/pronunciacion', title: 'Alfabeto y pronunciación', blurb: 'Cada letra del náhuatl, con ejemplos y una prueba rápida.', sign: 2 },
  { href: '/numeros', title: 'Números en náhuatl', blurb: 'Escribe un número y míralo en palabras y en glifos mexicas.', sign: 4 },
  { href: '/tu-signo', title: 'Tu signo del tonalpohualli', blurb: 'Pon tu fecha de nacimiento y descubre tu día en el calendario.', sign: 17 },
  { href: '/toponimos', title: '¿Qué significa tu ciudad?', blurb: 'Nombres de lugares de México, desarmados pieza por pieza.', sign: 7 },
  { href: '/nahuatlismos', title: 'Nahuatlismos', blurb: 'Las palabras del náhuatl que usas todos los días.', sign: 20 },
  { href: '/diccionario', title: 'Diccionario náhuatl-español', blurb: 'Todo el vocabulario de las lecciones, en las dos variantes.', sign: 13 },
] as const;
