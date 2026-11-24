export type Toponimo = {
  /** Name as written today. */
  name: string;
  /** Where it is. */
  where: string;
  /** Original Nahuatl form. */
  nah: string;
  /** The pieces, in order: [piece, meaning]. */
  parts: [string, string][];
  /** Meaning of the whole name. */
  meaning: string;
  /** True when scholars disagree about the etymology. */
  doubtful?: boolean;
};

const t = (name: string, where: string, nah: string, parts: [string, string][], meaning: string, doubtful?: boolean): Toponimo => ({
  name, where, nah, parts, meaning, ...(doubtful ? { doubtful } : {}),
});

const CO: [string, string] = ['-co', 'en'];
const C: [string, string] = ['-c', 'en'];
const TLAN: [string, string] = ['-tlan', 'lugar de, junto a'];
const PAN: [string, string] = ['-pan', 'sobre, en'];
const CAN: [string, string] = ['-can', 'lugar donde'];
const TEPE: [string, string] = ['tepe-tl', 'cerro'];

export const TOPONIMOS: Toponimo[] = [
  t('México', 'País y ciudad', 'Mexihco', [['metz-tli', 'luna'], ['xic-tli', 'ombligo'], CO], 'En el ombligo de la luna', true),
  t('Tenochtitlan', 'Ciudad de México', 'Tenochtitlan', [['te-tl', 'piedra'], ['noch-tli', 'tuna'], ['-ti-tlan', 'junto a']], 'Junto a la tuna de piedra'),
  t('Tlatelolco', 'Ciudad de México', 'Tlatelolco', [['tlatelol-li', 'montículo de tierra'], CO], 'En el montículo'),
  t('Chapultepec', 'Ciudad de México', 'Chapoltepec', [['chapol-in', 'chapulín'], TEPE, C], 'En el cerro del chapulín'),
  t('Xochimilco', 'Ciudad de México', 'Xochimilco', [['xochi-tl', 'flor'], ['mil-li', 'sementera'], CO], 'En la sementera de flores'),
  t('Coyoacán', 'Ciudad de México', 'Coyohuahcan', [['coyo-tl', 'coyote'], ['-huah', 'que tiene'], CAN], 'Lugar de los que tienen coyotes'),
  t('Tlalpan', 'Ciudad de México', 'Tlalpan', [['tlal-li', 'tierra'], PAN], 'Sobre la tierra firme'),
  t('Iztapalapa', 'Ciudad de México', 'Itztapalapan', [['itztapal-li', 'laja, losa'], ['a-tl', 'agua'], PAN], 'En el agua de las lajas'),
  t('Azcapotzalco', 'Ciudad de México', 'Azcapotzalco', [['azca-tl', 'hormiga'], ['potzal-li', 'montículo'], CO], 'En el hormiguero'),
  t('Tacuba', 'Ciudad de México', 'Tlacopan', [['tlaco-tl', 'vara, jarilla'], PAN], 'Sobre las varas'),
  t('Cuajimalpa', 'Ciudad de México', 'Cuauhximalpan', [['cuauh-', 'madera'], ['xima-l-', 'labrar'], PAN], 'Donde se labra la madera'),
  t('Tepeyac', 'Ciudad de México', 'Tepeyacac', [TEPE, ['yaca-tl', 'nariz, punta'], C], 'En la punta del cerro'),
  t('Churubusco', 'Ciudad de México', 'Huitzilopochco', [['Huitzilopoch-tli', 'el dios Huitzilopochtli'], CO], 'En el lugar de Huitzilopochtli'),
  t('Mixcoac', 'Ciudad de México', 'Mixcoac', [['mix-tli', 'nube'], ['coa-tl', 'serpiente'], C], 'En la serpiente de nubes'),
  t('Tláhuac', 'Ciudad de México', 'Cuitlahuac', [['cuitla-tl', 'lama, excremento'], ['-huah', 'que tiene'], C], 'Lugar de los que tienen lama', true),
  t('Ecatepec', 'Estado de México', 'Ehecatepec', [['eheca-tl', 'viento'], TEPE, C], 'En el cerro del viento'),
  t('Nezahualcóyotl', 'Estado de México', 'Nezahualcoyotl', [['nezahual-li', 'ayuno'], ['coyo-tl', 'coyote']], 'Coyote que ayuna (nombre del rey poeta de Texcoco)'),
  t('Tlalnepantla', 'Estado de México', 'Tlalnepantlah', [['tlal-li', 'tierra'], ['nepantlah', 'en medio']], 'En medio de la tierra'),
  t('Naucalpan', 'Estado de México', 'Nauhcalpan', [['nauh-', 'cuatro'], ['cal-li', 'casa'], PAN], 'En las cuatro casas'),
  t('Metepec', 'Estado de México', 'Metepec', [['me-tl', 'maguey'], TEPE, C], 'En el cerro de los magueyes'),
  t('Chimalhuacán', 'Estado de México', 'Chimalhuahcan', [['chimal-li', 'escudo'], ['-huah', 'que tiene'], CAN], 'Lugar de los que tienen escudos'),
  t('Teotihuacán', 'Estado de México', 'Teotihuacan', [['teo-tl', 'dios'], ['-ti', 'volverse'], ['-hua', 'se (impersonal)'], CAN], 'Lugar donde uno se vuelve dios', true),
  t('Tenancingo', 'Estado de México', 'Tenantzinco', [['tenan-tli', 'muralla'], ['-tzin', 'pequeño'], CO], 'En la pequeña muralla'),
  t('Popocatépetl', 'Volcán', 'Popocatepetl', [['popoca', 'humea'], ['tepetl', 'cerro']], 'El cerro que humea'),
  t('Iztaccíhuatl', 'Volcán', 'Iztaccihuatl', [['iztac', 'blanca'], ['cihuatl', 'mujer']], 'La mujer blanca'),
  t('Citlaltépetl', 'Volcán (Pico de Orizaba)', 'Citlaltepetl', [['citlal-in', 'estrella'], ['tepetl', 'cerro']], 'El cerro de la estrella'),
  t('Cuernavaca', 'Morelos', 'Cuauhnahuac', [['cuauh-', 'árbol'], ['-nahuac', 'cerca de']], 'Cerca de la arboleda'),
  t('Tepoztlán', 'Morelos', 'Tepoztlan', [['tepoz-tli', 'cobre, metal'], TLAN], 'Lugar del cobre'),
  t('Cuautla', 'Morelos', 'Cuauhtlah', [['cuauh-', 'árbol'], ['-tlah', 'abundancia de']], 'Arboleda'),
  t('Xochicalco', 'Morelos', 'Xochicalco', [['xochi-tl', 'flor'], ['cal-li', 'casa'], CO], 'En la casa de las flores'),
  t('Tlaxcala', 'Tlaxcala', 'Tlaxcallan', [['tlaxcal-li', 'tortilla'], TLAN], 'Lugar de tortillas'),
  t('Apizaco', 'Tlaxcala', 'Apitzacco', [['a-tl', 'agua'], ['pitzac-', 'delgado'], CO], 'En el agua delgada'),
  t('Cholula', 'Puebla', 'Cholollan', [['cholol-', 'huir, correr (el agua)'], TLAN], 'Lugar de la huida / donde corre el agua', true),
  t('Atlixco', 'Puebla', 'Atlixco', [['a-tl', 'agua'], ['ix-tli', 'cara, superficie'], CO], 'En la superficie del agua'),
  t('Tehuacán', 'Puebla', 'Teohuahcan', [['teo-tl', 'dios'], ['-huah', 'que tiene'], CAN], 'Lugar de los que tienen dioses', true),
  t('Zacatlán', 'Puebla', 'Zacatlan', [['zaca-tl', 'zacate'], TLAN], 'Lugar de zacate'),
  t('Cuetzalan', 'Puebla', 'Quetzallan', [['quetzal-li', 'pluma preciosa'], TLAN], 'Lugar de quetzales'),
  t('Oaxaca', 'Oaxaca', 'Huaxyacac', [['huax-in', 'guaje'], ['yaca-tl', 'nariz, punta'], C], 'En la punta de los guajes'),
  t('Tehuantepec', 'Oaxaca', 'Tecuantepec', [['tecuan-i', 'fiera, jaguar'], TEPE, C], 'En el cerro de las fieras'),
  t('Huatulco', 'Oaxaca', 'Cuauhtolco', [['cuahui-tl', 'madero'], ['toloa', 'inclinar la cabeza'], CO], 'Donde se reverencia al madero', true),
  t('Acapulco', 'Guerrero', 'Acapolco', [['aca-tl', 'carrizo'], ['-pol', 'grandote'], CO], 'En los carrizos grandes'),
  t('Taxco', 'Guerrero', 'Tlachco', [['tlach-tli', 'juego de pelota'], CO], 'En el juego de pelota'),
  t('Chilpancingo', 'Guerrero', 'Chilpantzinco', [['chilpan', 'avispa roja'], ['-tzin', 'pequeño'], CO], 'En el pequeño lugar de avispas'),
  t('Iguala', 'Guerrero', 'Yohuallan', [['yohual-li', 'noche'], TLAN], 'Lugar de la noche'),
  t('Zihuatanejo', 'Guerrero', 'Cihuatlan', [['cihua-tl', 'mujer'], TLAN], 'Lugar de mujeres (con el diminutivo español -ejo)'),
  t('Mazatlán', 'Sinaloa', 'Mazatlan', [['maza-tl', 'venado'], TLAN], 'Lugar de venados'),
  t('Jalisco', 'Estado', 'Xalixco', [['xal-li', 'arena'], ['ix-tli', 'cara, superficie'], CO], 'En la superficie de arena'),
  t('Zapopan', 'Jalisco', 'Tzapopan', [['tzapo-tl', 'zapote'], PAN], 'En los zapotes'),
  t('Tonalá', 'Jalisco', 'Tonallan', [['tonal-li', 'calor del sol, día'], TLAN], 'Lugar por donde sale el sol'),
  t('Tequila', 'Jalisco', 'Tequillan', [['tequi-', 'trabajo, tributo; o cortar'], TLAN], 'Lugar de tributos, o lugar donde se corta', true),
  t('Ocotlán', 'Jalisco', 'Ocotlan', [['oco-tl', 'ocote, pino'], TLAN], 'Lugar de ocotes'),
  t('Michoacán', 'Estado', 'Michhuahcan', [['mich-in', 'pescado'], ['-huah', 'que tiene'], CAN], 'Lugar de los que tienen pescado'),
  t('Zacatecas', 'Estado', 'Zacatecah', [['zaca-tl', 'zacate'], ['-tecah', 'gente de']], 'Gente del lugar del zacate'),
  t('Tula', 'Hidalgo', 'Tollan', [['tol-in', 'tule, junco'], TLAN], 'Lugar de tules'),
  t('Tulancingo', 'Hidalgo', 'Tollantzinco', [['Tollan', 'Tula'], ['-tzin', 'pequeño'], CO], 'En la pequeña Tula'),
  t('Huejutla', 'Hidalgo', 'Huexotlah', [['huexo-tl', 'sauce'], ['-tlah', 'abundancia de']], 'Donde abundan los sauces'),
  t('Xalapa', 'Veracruz', 'Xalapan', [['xal-li', 'arena'], ['a-tl', 'agua'], PAN], 'En el agua arenosa'),
  t('Orizaba', 'Veracruz', 'Ahuilizapan', [['ahuiliz-tli', 'alegría'], ['a-tl', 'agua'], PAN], 'En el agua alegre'),
  t('Coatzacoalcos', 'Veracruz', 'Coatzacualco', [['coa-tl', 'serpiente'], ['tzacual-li', 'encierro, pirámide'], CO], 'Donde se esconde la serpiente'),
  t('Tuxpan', 'Veracruz', 'Tochpan', [['toch-tli', 'conejo'], PAN], 'En los conejos'),
  t('Papantla', 'Veracruz', 'Papantlan', [['papan', 'pájaro papán'], TLAN], 'Lugar de papanes'),
  t('Coatepec', 'Veracruz', 'Coatepec', [['coa-tl', 'serpiente'], TEPE, C], 'En el cerro de la serpiente'),
  t('Tuxtla', 'Chiapas', 'Tochtlan', [['toch-tli', 'conejo'], TLAN], 'Lugar de conejos'),
  t('Chiapas', 'Estado', 'Chiapan', [['chia-n', 'chía'], ['a-tl', 'agua'], PAN], 'En el río de la chía'),
  t('Colima', 'Estado', 'Coliman', [['col-li', 'abuelo, antepasado'], ['ma-itl', 'mano (dominio)'], ['-n', 'lugar']], 'Lugar en manos de los abuelos', true),
  t('Tepic', 'Nayarit', 'Tepic', [['te-tl', 'piedra'], ['-pic', 'macizo']], 'Lugar de piedras macizas', true),
  t('Guatemala', 'País', 'Cuauhtemallan', [['cuauh-', 'árbol'], ['temal-', 'montón'], TLAN], 'Lugar de muchos árboles', true),
];
