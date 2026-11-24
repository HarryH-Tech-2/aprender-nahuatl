export type Sign = { n: number; slug: string; nah: string; es: string; meaning: string; img: string };

const s = (n: number, nah: string, es: string, meaning: string): Sign => {
  const slug = nah.toLowerCase();
  return { n, slug, nah, es, meaning, img: `/img/signos/${String(n).padStart(2, '0')}-${slug}.webp` };
};

/** The 20 day-signs of the tonalpohualli, in order. */
export const SIGNS: Sign[] = [
  s(1, 'Cipactli', 'Caimán', 'El comienzo. Del lomo del gran caimán primordial se formó la tierra: es el signo de quien abre camino y empieza cosas nuevas.'),
  s(2, 'Ehecatl', 'Viento', 'El aliento que mueve al mundo. Signo de la palabra, las ideas y el cambio; inquieto y difícil de atrapar.'),
  s(3, 'Calli', 'Casa', 'El hogar y el descanso. Signo de quien cuida a los suyos y busca un lugar seguro al cual volver.'),
  s(4, 'Cuetzpalin', 'Lagartija', 'Agilidad y abundancia. La lagartija cae y no se lastima: signo de quien se repone rápido.'),
  s(5, 'Coatl', 'Serpiente', 'La fuerza de la tierra y la renovación. Como la serpiente que muda de piel, es signo de transformación.'),
  s(6, 'Miquiztli', 'Muerte', 'No es mal augurio: es el cierre de un ciclo para que empiece otro. Signo de reflexión y de respeto a los antepasados.'),
  s(7, 'Mazatl', 'Venado', 'Lo silvestre y lo sensible. Signo de quien anda por el monte: atento, veloz y algo tímido.'),
  s(8, 'Tochtli', 'Conejo', 'Fertilidad, juego y fiesta. El conejo vive en la luna y está ligado al pulque: signo alegre y generoso.'),
  s(9, 'Atl', 'Agua', 'Lo que da vida y también arrastra. Signo de purificación y de emociones profundas.'),
  s(10, 'Itzcuintli', 'Perro', 'El compañero fiel que guía en el camino. Signo de lealtad y de amistad duradera.'),
  s(11, 'Ozomahtli', 'Mono', 'El arte, la danza y la risa. Signo de gente ingeniosa, creativa y traviesa.'),
  s(12, 'Malinalli', 'Hierba', 'La hierba torcida que rebrota aunque la corten. Signo de tenacidad y de vínculos fuertes.'),
  s(13, 'Acatl', 'Caña', 'La caña recta de la que se hacen flechas y cetros. Signo de rectitud, autoridad y conocimiento.'),
  s(14, 'Ocelotl', 'Jaguar', 'El señor de la noche y del monte. Signo de valentía y de fuerza silenciosa.'),
  s(15, 'Cuauhtli', 'Águila', 'El sol en vuelo. Signo de quien ve lejos, apunta alto y no se rinde.'),
  s(16, 'Cozcacuauhtli', 'Zopilote', 'El ave de collar, que vive muchos años. Signo de sabiduría, paciencia y larga vida.'),
  s(17, 'Ollin', 'Movimiento', 'El latido del mundo y el temblor de la tierra. Signo del quinto sol y de todo lo que cambia.'),
  s(18, 'Tecpatl', 'Pedernal', 'La piedra que corta y que da chispa. Signo de claridad, decisión y verdad.'),
  s(19, 'Quiahuitl', 'Lluvia', 'El regalo de Tláloc: puede nutrir la milpa o inundarla. Signo de abundancia que llega de golpe.'),
  s(20, 'Xochitl', 'Flor', 'La belleza, el canto y la poesía —in xochitl in cuicatl—. Signo de quien crea y disfruta la vida.'),
];
