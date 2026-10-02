import type { Plant, Season } from '@/data/plants';

export type Reminder = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  plants: Plant[];
};

/** "tomatoes, basil and kale" */
export function listNames(plants: Plant[]): string {
  const names = plants.map((p) => p.shortName.toLowerCase());
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function sentenceCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Care reminders, grouped by the job to do rather than by plant, so one
 * pop-up covers everything that needs the same thing today.
 */
export function buildReminders(opts: {
  plants: Plant[];
  season: Season;
  lowF: number | null;
  highF: number | null;
}): Reminder[] {
  const { plants, season, lowF, highF } = opts;
  const out: Reminder[] = [];
  if (plants.length === 0) return out;

  const inGreenhouse = season === 'winter' ? plants.filter((p) => p.kind === 'cool') : plants;
  const warm = inGreenhouse.filter((p) => p.kind === 'warm');
  const cool = inGreenhouse.filter((p) => p.kind === 'cool');

  if (lowF != null && lowF <= 40 && warm.length > 0) {
    out.push({
      key: 'cold-night',
      eyebrow: 'Cold night ahead',
      title: `Down to ${lowF}° tonight`,
      body: `Close the door and window before dark. ${sentenceCase(listNames(warm))} don't like the cold, so bring potted ones indoors.`,
      plants: warm.slice(0, 4),
    });
  }

  if (highF != null && highF >= 75 && cool.length > 0) {
    out.push({
      key: 'vent',
      eyebrow: 'Warm day',
      title: 'Open the vent today',
      body: `It's heading for ${highF}°. Your ${listNames(cool)} don't like it above 75°F.`,
      plants: cool.slice(0, 4),
    });
  }

  if (inGreenhouse.length > 0) {
    out.push(
      season === 'winter'
        ? {
            key: 'soil-winter',
            eyebrow: 'Reminder',
            title: 'Sunny morning: check the soil',
            body: `${sentenceCase(listNames(inGreenhouse))}. Water lightly, and only if the top inch is dry.`,
            plants: inGreenhouse.slice(0, 4),
          }
        : {
            key: 'soil',
            eyebrow: 'Reminder',
            title: 'Time to check the soil',
            body: `${sentenceCase(listNames(inGreenhouse))}. Water only where the top inch is dry.`,
            plants: inGreenhouse.slice(0, 4),
          }
    );
  }

  return out;
}
