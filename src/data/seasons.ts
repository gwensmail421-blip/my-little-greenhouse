import type { Season } from './plants';

export type SeasonLook = {
  ground: string;
  groundEdge: string;
  tree: [string, string, string];
  snowyRoof: boolean;
  week: { sow: string; tend: string; harvest: string };
};

// "This week" lines for a typical unheated kit greenhouse in a cold climate.
export const SEASONS: Record<Season, SeasonLook> = {
  autumn: {
    ground: '#E2BC77',
    groundEdge: '#D3A962',
    tree: ['#E5884F', '#F1B45B', '#D9734A'],
    snowyRoof: false,
    week: {
      sow: 'Spinach and mâche on the lower shelf for winter salads.',
      tend: 'Close the window on nights below 40°F, and bring basil indoors.',
      harvest: 'The last cherry tomatoes. Pull the vines once they stop ripening.',
    },
  },
  winter: {
    ground: '#F3F5F7',
    groundEdge: '#DCE4EA',
    tree: ['#EEF3F6', '#E3EBF0', '#F7FAFB'],
    snowyRoof: true,
    week: {
      sow: 'Nothing new yet. Sowing picks up again as the days lengthen in February.',
      tend: 'Water only on sunny mornings, and sparingly. Brush snow off the roof.',
      harvest: 'Spinach, mâche and kale leaves, a few from each plant at a time.',
    },
  },
  spring: {
    ground: '#AFD69C',
    groundEdge: '#97C487',
    tree: ['#F4B8C4', '#F8D3DA', '#EFA3B4'],
    snowyRoof: false,
    week: {
      sow: 'Tomato and pepper seeds on the staging rack, with basil alongside.',
      tend: "Open the vent on sunny days. It heats up fast even when it's cold outside.",
      harvest: 'The first lettuce, and pea shoots for salads.',
    },
  },
  summer: {
    ground: '#86BD7E',
    groundEdge: '#72AB6B',
    tree: ['#5FA86E', '#78B97A', '#4E9862'],
    snowyRoof: false,
    week: {
      sow: 'Lettuce for fall, in the shadiest corner.',
      tend: 'Run the fan and prop the door open on hot afternoons.',
      harvest: 'Tomatoes, cucumbers and basil every few days.',
    },
  },
};

export function seasonFor(date: Date, latitude: number): Season {
  const m = date.getMonth();
  const north = latitude >= 0;
  const idx = north ? m : (m + 6) % 12;
  if (idx === 11 || idx <= 1) return 'winter';
  if (idx <= 4) return 'spring';
  if (idx <= 7) return 'summer';
  return 'autumn';
}

export type TimeOfDay = 'day' | 'dusk' | 'night';

export type TimeLook = {
  sky: [string, string];
  panel: string;
  panelOp: number;
  glow: number;
  soil: [string, string, string];
  shade: number;
  stars: boolean;
  sun: string;
  lightText: boolean;
};

export const TIMES: Record<TimeOfDay, TimeLook> = {
  day: {
    sky: ['#BFE3E0', '#F5E8D6'],
    panel: '#D6EEF2',
    panelOp: 0.42,
    glow: 0,
    soil: ['#D49373', '#B8775C', '#9E654F'],
    shade: 0,
    stars: false,
    sun: '#FFF4DD',
    lightText: false,
  },
  dusk: {
    sky: ['#B9A6CF', '#F6C3A6'],
    panel: '#F6D2BE',
    panelOp: 0.45,
    glow: 0.35,
    soil: ['#C98468', '#A96C57', '#8E5A4C'],
    shade: 0.12,
    stars: false,
    sun: '#FFE1C2',
    lightText: false,
  },
  night: {
    sky: ['#1D2947', '#3F4F7A'],
    panel: '#7084AE',
    panelOp: 0.3,
    glow: 0.85,
    soil: ['#5C4D63', '#4A3F55', '#3B3247'],
    shade: 0.45,
    stars: true,
    sun: '#EEF0F8',
    lightText: true,
  },
};
