import { v } from './types';
import type { V } from '@/lib/variant';

export type Sound = { id: string; letters: string; sounds: V; example: V; exampleEs: string; tip?: V };

const s = (id: string, letters: string, sounds: V, example: V, exampleEs: string, tip?: V): Sound => ({
  id, letters, sounds, example, exampleEs, ...(tip ? { tip } : {}),
});

/** The 18 letters and letter-pairs you need to read Nahuatl aloud. */
export const PRONUNCIACION: Sound[] = [
  s('a', 'a', 'Como la a de «casa».', 'atl', 'agua'),
  s('e', 'e', 'Como la e de «mesa».', 'etl', 'frijol'),
  s('i', 'i', 'Como la i de «mira».', 'ichcatl', 'algodón, borrego'),
  s('o', 'o', 'Como la o de «solo»; a veces se oye casi como u.', 'ome', 'dos'),
  s('c', 'c / qu', 'Suena «k»: se escribe c antes de a y o, y qu antes de e e i. La c antes de e, i suena «s».', 'calli', 'casa', 'Igual que en español: ca, que, qui, co.'),
  s('ch', 'ch', 'Como la ch de «chile».', 'chilli', 'chile'),
  s('cu', 'cu / uc', 'Suena «kw», como en «cuatro». Al final de sílaba se escribe uc.', 'cuahuitl', 'árbol', 'En «teuctli» (señor) la uc suena «kw» sin vocal después.'),
  s('h', 'h', v('El saltillo: un corte brusco de aire, como entre las sílabas de «oh-oh».', 'Una jota muy suave, casi un soplo.'), v('ahmo', 'axcanah'), 'no', 'Nunca es muda como en español.'),
  s('hu', 'hu / uh', 'Como la u de «huevo» (el sonido «w»). Al final de sílaba se escribe uh.', 'huey', 'grande'),
  s('l', 'l', 'Como la l del español.', 'tlalli', 'tierra'),
  s('ll', 'll', 'Una ele larga: «l-l». Nunca suena «y».', 'calli', 'casa', '«Calli» se dice «cal-li», no «cayi».'),
  s('m', 'm / n', 'Como en español. La n al final de palabra suena muy suave.', 'michin', 'pescado'),
  s('p', 'p / t', 'Como en español, sin soplo de aire.', 'tepetl', 'cerro'),
  s('tl', 'tl', 'Un solo sonido: una t que se suelta por los lados de la lengua, como una l sin voz.', 'tlacatl', 'persona', 'Al final de palabra no lleva vocal: «atl», no «atle».'),
  s('tz', 'tz', 'Suena «ts», como en «pizza».', 'tzopilotl', 'zopilote'),
  s('x', 'x', 'Suena «sh», como cuando pides silencio.', 'xochitl', 'flor', '«Mexihco» se decía «Me-shih-co».'),
  s('y', 'y', 'Como la y de «yo».', 'yei', 'tres'),
  s('z', 'z', 'Suena «s», como en el español de México.', 'zacatl', 'zacate'),
];
