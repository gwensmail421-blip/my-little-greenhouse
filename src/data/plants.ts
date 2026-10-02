// Plant cards. Every line comes from the fact-checked plant profiles doc,
// rewritten as one friendly sentence. Each card cites its sources.

export type Sprite =
  | 'kale'
  | 'spinach'
  | 'lettuce'
  | 'mache'
  | 'herb'
  | 'basil'
  | 'pea'
  | 'pepper'
  | 'tomato'
  | 'cucumber'
  | 'seedlings';

export type PlantId =
  | 'kale'
  | 'spinach'
  | 'lettuce'
  | 'mache'
  | 'claytonia'
  | 'pea'
  | 'thyme'
  | 'basil'
  | 'tomato'
  | 'pepper'
  | 'cucumber';

export type Plant = {
  id: PlantId;
  name: string;
  shortName: string;
  sprite: Sprite;
  /** cool-season crops can grow through a Wisconsin winter in an unheated kit; warm ones can't */
  kind: 'cool' | 'warm';
  /** tall plants live on the greenhouse floor in summer and autumn */
  tall?: boolean;
  dot: string;
  tint: string;
  aliases: string[];
  now: string;
  water: string;
  light: string;
  cold: string;
  watch: string;
  sources: { label: string; url: string }[];
};

const UW_GREENS = {
  label: 'UW Extension',
  url: 'https://hort.extension.wisc.edu/articles/growing-salad-greens-wisconsin/',
};
const CORNELL_GREENS = {
  label: 'Cornell',
  url: 'https://blogs.cornell.edu/hightunnels/vegetables/greens/',
};

export const PLANTS: Record<PlantId, Plant> = {
  kale: {
    id: 'kale',
    name: 'Kale',
    shortName: 'Kale',
    sprite: 'kale',
    kind: 'cool',
    dot: '#4F7F78',
    tint: '#DCE8E4',
    aliases: ['kale', 'lacinato', 'dinosaur kale', 'collards', 'brassica', 'greens'],
    now: "Pick the older outer leaves first, while they're still tender.",
    water: "Water regularly. Wilting at midday means it's thirsty.",
    light: '6+ hours of sun.',
    cold: 'The hardiest green here. It survives about 20°F, and frost sweetens it.',
    watch: 'Cabbageworms: pick them off by hand.',
    sources: [
      { label: 'UMN Extension', url: 'https://extension.umn.edu/vegetables/growing-collards-and-kale' },
      { label: 'UW Extension', url: 'https://hort.extension.wisc.edu/files/2020/01/A3684.pdf' },
    ],
  },
  spinach: {
    id: 'spinach',
    name: 'Spinach',
    shortName: 'Spinach',
    sprite: 'spinach',
    kind: 'cool',
    dot: '#4C8A5C',
    tint: '#DDEADD',
    aliases: ['spinach', 'greens', 'salad'],
    now: 'Pick outer leaves once the plant has 6 true leaves.',
    water: 'Keep it evenly moist. Dry soil makes it bolt.',
    light: '6+ hours of sun. Growth stalls when days drop under 10 hours.',
    cold: 'Hardened plants survive 14–20°F.',
    watch: 'Aphids in late winter: rinse them off.',
    sources: [
      { label: 'UW Extension', url: 'https://hort.extension.wisc.edu/articles/spinach-spinacia-oleracea/' },
      UW_GREENS,
    ],
  },
  lettuce: {
    id: 'lettuce',
    name: 'Lettuce',
    shortName: 'Lettuce',
    sprite: 'lettuce',
    kind: 'cool',
    dot: '#A8CF8E',
    tint: '#E6F0D9',
    aliases: ['lettuce', 'leaf lettuce', 'romaine', 'butterhead', 'salad', 'greens'],
    now: 'Pick outer leaves at 4–6 inches, or cut the whole head.',
    water: 'Shallow roots, so water regularly.',
    light: 'Takes more shade than most crops.',
    cold: 'Handles light frost, but not the depth of winter.',
    watch: 'Powdery mildew in damp, dim weather.',
    sources: [UW_GREENS, CORNELL_GREENS],
  },
  mache: {
    id: 'mache',
    name: 'Mâche',
    shortName: 'Mâche',
    sprite: 'mache',
    kind: 'cool',
    dot: '#7FAE6E',
    tint: '#E2EEDB',
    aliases: ['mache', 'mâche', "lamb's lettuce", 'lambs lettuce', 'corn salad', 'salad', 'greens'],
    now: "Cut rosettes 1–2 inches above the soil and they'll regrow.",
    water: 'Let the soil dry a little between waterings.',
    light: 'Sun or part shade. It rests in midwinter but can still be picked.',
    cold: 'One of the hardiest greens. It grows through the dead of winter.',
    watch: 'Few problems. Hand-pick any slugs.',
    sources: [
      { label: 'Utah State', url: 'https://extension.usu.edu/yardandgarden/research/lambs-lettuce-in-the-garden' },
      CORNELL_GREENS,
    ],
  },
  claytonia: {
    id: 'claytonia',
    name: 'Claytonia',
    shortName: 'Claytonia',
    sprite: 'mache',
    kind: 'cool',
    dot: '#8CC08A',
    tint: '#E1EFE0',
    aliases: ['claytonia', "miner's lettuce", 'miners lettuce', 'winter purslane', 'salad', 'greens'],
    now: 'Cut just above the crown. It regrows up to 3 times.',
    water: 'Evenly moist, not soggy.',
    light: 'Sun or part shade. It fills out fast in February.',
    cold: 'Very cold-hardy in unheated greenhouses.',
    watch: 'Slugs: hand-pick them.',
    sources: [
      {
        label: 'UMN Extension',
        url: 'https://blog-fruit-vegetable-ipm.extension.umn.edu/2024/09/transitioning-your-high-tunnel-for-fall.html',
      },
      CORNELL_GREENS,
    ],
  },
  pea: {
    id: 'pea',
    name: 'Peas',
    shortName: 'Peas',
    sprite: 'pea',
    kind: 'cool',
    dot: '#7DBF6A',
    tint: '#E3F0DA',
    aliases: ['pea', 'peas', 'snap peas', 'snow peas', 'pea shoots'],
    now: 'Pick snap peas while the pods are just filling.',
    water: 'About an inch a week, kept off the leaves.',
    light: 'Full sun, 6+ hours.',
    cold: 'Young plants handle light frost. Frost harms the flowers.',
    watch: "Never eat ornamental sweet peas. They're toxic.",
    sources: [
      { label: 'UMN Extension', url: 'https://extension.umn.edu/vegetables/growing-peas' },
      { label: 'Iowa State', url: 'https://yardandgarden.extension.iastate.edu/how-to/growing-peas-iowa' },
    ],
  },
  thyme: {
    id: 'thyme',
    name: 'Thyme',
    shortName: 'Thyme',
    sprite: 'herb',
    kind: 'cool',
    dot: '#9DB59A',
    tint: '#E5EBE3',
    aliases: ['thyme', 'herb', 'herbs'],
    now: 'Snip sprigs whenever you need them.',
    water: 'Likes to dry out between waterings.',
    light: '6 hours of direct sun, or a grow light indoors.',
    cold: 'A good one to bring indoors for winter.',
    watch: 'Indoors, soil gnats appear if the soil stays wet.',
    sources: [
      { label: 'Penn State', url: 'https://extension.psu.edu/growing-herbs-indoors' },
      {
        label: 'Iowa State',
        url: 'https://yardandgarden.extension.iastate.edu/faq/can-i-grow-herbs-indoors-over-winter',
      },
    ],
  },
  basil: {
    id: 'basil',
    name: 'Basil',
    shortName: 'Basil',
    sprite: 'basil',
    kind: 'warm',
    dot: '#5FAE5A',
    tint: '#DEEFD8',
    aliases: ['basil', 'sweet basil', 'genovese', 'herb', 'herbs'],
    now: 'Pinch the tips and remove flower buds to keep it leafy.',
    water: 'Water in the morning, at soil level.',
    light: '6–8 hours of bright light.',
    cold: 'Leaves blacken at about 50°F. Protect it first.',
    watch: 'Downy mildew: grow resistant varieties.',
    sources: [
      { label: 'UMN Extension', url: 'https://extension.umn.edu/vegetables/growing-basil' },
      { label: 'Illinois', url: 'https://extension.illinois.edu/herbs/basil' },
    ],
  },
  tomato: {
    id: 'tomato',
    name: 'Cherry tomato',
    shortName: 'Tomato',
    sprite: 'tomato',
    kind: 'warm',
    tall: true,
    dot: '#E0614F',
    tint: '#F6DED8',
    aliases: ['tomato', 'tomatoes', 'cherry tomato', 'sungold', 'grape tomato'],
    now: 'Pick as soon as the color turns, 2–3 times a week.',
    water: 'Keep soil evenly moist to prevent blossom end rot.',
    light: 'Full sun.',
    cold: 'Fruit only sets when nights stay above 55°F.',
    watch: 'No bees inside: shake the flowers every other day.',
    sources: [
      { label: 'UMD Extension', url: 'https://extension.umd.edu/resource/growing-tomatoes-home-garden' },
      { label: 'UW Extension', url: 'https://hort.extension.wisc.edu/articles/blossom-end-rot/' },
    ],
  },
  pepper: {
    id: 'pepper',
    name: 'Sweet pepper',
    shortName: 'Pepper',
    sprite: 'pepper',
    kind: 'warm',
    dot: '#E8913F',
    tint: '#F7E3D0',
    aliases: ['pepper', 'peppers', 'sweet pepper', 'bell pepper', 'capsicum'],
    now: 'Cut fruit off rather than pulling. Green ones are ready to eat.',
    water: 'Steady moisture prevents blossom end rot.',
    light: 'About 8 hours of sun.',
    cold: 'Growth stalls below 50°F.',
    watch: 'Aphids: hose them off.',
    sources: [
      { label: 'UMN Extension', url: 'https://extension.umn.edu/vegetables/growing-peppers' },
      { label: 'UMD Extension', url: 'https://extension.umd.edu/resource/growing-peppers-home-garden' },
    ],
  },
  cucumber: {
    id: 'cucumber',
    name: 'Cucumber',
    shortName: 'Cucumber',
    sprite: 'cucumber',
    kind: 'warm',
    tall: true,
    dot: '#6FAF5E',
    tint: '#E0EED8',
    aliases: ['cucumber', 'cucumbers', 'cuke', 'pickling cucumber'],
    now: "Pick every day or two once it's bearing.",
    water: 'About an inch a week, consistently.',
    light: 'High light and humidity.',
    cold: 'Frost kills it, and chilling damage starts below 55°F.',
    watch: 'Spider mites: a strong water spray.',
    sources: [
      { label: 'UMN Extension', url: 'https://extension.umn.edu/vegetables/growing-cucumbers' },
      {
        label: 'Alaska Extension',
        url: 'https://www.uaf.edu/ces/publications/database/gardening/growing-cucumbers-greenhouses.php',
      },
    ],
  },
};

export const ALL_PLANTS: Plant[] = Object.values(PLANTS);

export function searchPlants(query: string): Plant[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_PLANTS;
  return ALL_PLANTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.aliases.some((a) => a.includes(q) || q.includes(a))
  );
}

/** A short "where it's at" note for chips, by season. Kept general on purpose. */
export function seasonNote(plant: Plant, season: Season): string {
  const notes: Record<Plant['kind'], Record<Season, string>> = {
    cool: { autumn: 'growing', winter: 'slow growth', spring: 'growing', summer: 'dislikes heat' },
    warm: { autumn: 'last picks', winter: 'wintering indoors', spring: 'seedlings', summer: 'growing' },
  };
  return notes[plant.kind][season];
}

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
