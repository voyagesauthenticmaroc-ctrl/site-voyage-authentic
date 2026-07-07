/** Coordonnées [lng, lat] des principales étapes marocaines de nos circuits.
    Clés normalisées en minuscules sans accents pour la résolution fuzzy. */
export const MOROCCO_PLACES: Record<string, [number, number]> = {
  marrakech: [-7.9811, 31.6295],
  fes: [-4.9998, 34.0181],
  meknes: [-5.5473, 33.8935],
  rabat: [-6.8498, 34.0209],
  casablanca: [-7.6114, 33.5731],
  tanger: [-5.8340, 35.7595],
  chefchaouen: [-5.2636, 35.1688],
  essaouira: [-9.7595, 31.5085],
  agadir: [-9.5981, 30.4278],
  ouarzazate: [-6.9370, 30.9189],
  merzouga: [-4.0110, 31.0994],
  zagora: [-5.8377, 30.3323],
  'erg chebbi': [-3.9847, 31.1265],
  'erg chegaga': [-6.2500, 29.9500],
  'ait ben haddou': [-7.1300, 31.0473],
  'aït ben haddou': [-7.1300, 31.0473],
  ouzoud: [-6.7189, 32.0138],
  ourika: [-7.7833, 31.3833],
  imlil: [-7.9236, 31.1381],
  toubkal: [-7.9145, 31.0625],
  volubilis: [-5.5544, 34.0731],
  'moulay idriss': [-5.5220, 34.0546],
  ifrane: [-5.1108, 33.5228],
  'midelt': [-4.7333, 32.6852],
  erfoud: [-4.2333, 31.4333],
  rissani: [-4.2620, 31.2833],
  dades: [-5.8952, 31.3833],
  'gorges du dades': [-5.8952, 31.3833],
  'vallee du dades': [-5.8952, 31.3833],
  todra: [-5.5972, 31.5883],
  'gorges du todra': [-5.5972, 31.5883],
  tinghir: [-5.5279, 31.5148],
  'kelaat mgouna': [-6.1274, 31.2400],
  'kelaat m\'gouna': [-6.1274, 31.2400],
  'vallee des roses': [-6.1274, 31.2400],
  skoura: [-6.5568, 31.0630],
  'palmeraie de skoura': [-6.5568, 31.0630],
  taroudant: [-8.8779, 30.4728],
  asilah: [-6.0348, 35.4653],
  tetouan: [-5.3626, 35.5711],
  'akchour': [-5.1667, 35.2000],
  'cascades d\'akchour': [-5.1667, 35.2000],
  atlas: [-7.9145, 31.0625],
  'haut atlas': [-7.9145, 31.0625],
  'moyen atlas': [-5.1108, 33.5228],
  sahara: [-4.0110, 31.0994],
  'desert du sahara': [-4.0110, 31.0994],
};

/** Normalise une chaîne pour recherche : minuscules + suppression accents. */
export function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface RouteStop {
  name: string;
  lng: number;
  lat: number;
  day?: number;
}

/** Extrait les étapes GPS d'un circuit à partir des labels de jours ou du nom.
    Priorité : labels de jours (plus riches), sinon on parse le nom du circuit. */
export function extractRoute(
  name: string,
  days?: { label: string }[],
): RouteStop[] {
  const found: RouteStop[] = [];
  const seen = new Set<string>();

  const scan = (text: string, day?: number) => {
    const norm = normalizeKey(text);
    // Trie les clés par longueur décroissante pour matcher "aït ben haddou" avant "ben"
    const keys = Object.keys(MOROCCO_PLACES).sort((a, b) => b.length - a.length);
    let remaining = norm;
    for (const key of keys) {
      const nk = normalizeKey(key);
      const idx = remaining.indexOf(nk);
      if (idx === -1) continue;
      // Position dans le texte original pour préserver l'ordre
      const originalIdx = norm.indexOf(nk);
      if (originalIdx === -1) continue;
      const uniqKey = `${nk}-${day ?? 'x'}`;
      if (seen.has(uniqKey)) continue;
      seen.add(uniqKey);
      const [lng, lat] = MOROCCO_PLACES[key];
      found.push({ name: prettify(key), lng, lat, day });
      remaining = remaining.replace(nk, ' '.repeat(nk.length));
    }
  };

  if (days && days.length > 0) {
    days.forEach((d, i) => scan(d.label, i + 1));
  } else {
    scan(name);
  }

  // Réordonne selon l'ordre d'apparition dans le texte source (jour par jour)
  if (days && days.length > 0) {
    const ordered: RouteStop[] = [];
    days.forEach((d, i) => {
      const dayNum = i + 1;
      const inDay = found.filter((f) => f.day === dayNum);
      const norm = normalizeKey(d.label);
      inDay.sort((a, b) => norm.indexOf(normalizeKey(a.name)) - norm.indexOf(normalizeKey(b.name)));
      ordered.push(...inDay);
    });
    return ordered;
  }

  return found;
}

function prettify(key: string): string {
  return key
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
