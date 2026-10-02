import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { PlantSprite } from '@/components/plant-sprite';
import type { Plant, PlantId, Season, Sprite } from '@/data/plants';
import { SEASONS, TIMES, type TimeOfDay } from '@/data/seasons';
import type { Sky } from '@/lib/conditions';

// Isometric projection. Greenhouse footprint is 9 x 6 (like a 9x6 kit),
// walls 6.8 high, ridge 8.5 along y = 3.
const S = 15;
const OX = -15.5;
const OY = 30;
const H = 6.8;
const R = 8.5;
type V3 = [number, number, number];
const P = (x: number, y: number, z: number): [number, number] => [(x - y) * 0.866 * S + OX, (x + y) * 0.5 * S - z * S + OY];
const pts = (arr: V3[]) =>
  arr
    .map((p) => P(...p))
    .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
    .join(' ');

export const SCENE_VIEWBOX = { x: -190, y: -175, w: 380, h: 420 };

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.round(r + (40 - r) * amt);
  g = Math.round(g + (50 - g) * amt);
  b = Math.round(b + (90 - b) * amt);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function Poly({ p, fill, opacity }: { p: V3[]; fill: string; opacity?: number }) {
  return <Polygon points={pts(p)} fill={fill} opacity={opacity} />;
}

function Beam({ a, b, stroke, w }: { a: V3; b: V3; stroke: string; w: number }) {
  const [x1, y1] = P(...a);
  const [x2, y2] = P(...b);
  return <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={w} strokeLinecap="round" />;
}

function Tree({ x, y, colors, variant, bare }: { x: number; y: number; colors: string[]; variant: number; bare: boolean }) {
  const [px, py] = P(x, y, 0);
  return (
    <G transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
      <Ellipse cx={0} cy={0} rx={9} ry={4.5} fill="rgba(40,50,70,0.12)" />
      <Rect x={-1.4} y={-20} width={2.8} height={20} fill="#8C6250" />
      {bare ? (
        <>
          <Line x1={0} y1={-14} x2={-6} y2={-24} stroke="#8C6250" strokeWidth={1.4} />
          <Line x1={0} y1={-18} x2={5} y2={-28} stroke="#8C6250" strokeWidth={1.4} />
          <Ellipse cx={-6} cy={-25} rx={2.4} ry={1.2} fill="#FFFFFF" />
          <Ellipse cx={5} cy={-29} rx={2.4} ry={1.2} fill="#FFFFFF" />
        </>
      ) : variant % 2 === 0 ? (
        // Cone-and-sphere canopies, a nod to Monument Valley's toy trees
        <>
          <Polygon points="0,-50 -11,-16 11,-16" fill={colors[0]} />
          <Polygon points="0,-50 0,-16 11,-16" fill={shade(colors[0], 0.18)} />
        </>
      ) : (
        <>
          <Circle cx={0} cy={-30} r={12} fill={colors[1]} />
          <Path d="M0,-42 A12,12 0 0 1 0,-18 Z" fill={shade(colors[1], 0.16)} />
        </>
      )}
    </G>
  );
}

function Gardener({ x, y }: { x: number; y: number }) {
  const [px, py] = P(x, y, 0);
  return (
    <G transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
      <Ellipse cx={0} cy={0} rx={5} ry={2.4} fill="rgba(40,50,70,0.15)" />
      <Path d="M-3.6,0 L3.6,0 L2.2,-11 L-2.2,-11 Z" fill="#F3EEE6" />
      <Path d="M0,0 L3.6,0 L2.2,-11 L0,-11 Z" fill="#DCD3C6" />
      <Circle cx={0} cy={-13.5} r={2.8} fill="#E9C9AE" />
      <Ellipse cx={0} cy={-15.4} rx={5.6} ry={1.6} fill="#D9A65A" />
      <Ellipse cx={0} cy={-16.6} rx={2.6} ry={1.8} fill="#E3B66C" />
      <Rect x={3.4} y={-6.5} width={4.4} height={3.6} rx={0.8} fill="#6E9AA6" />
      <Line x1={7.6} y1={-5.6} x2={10.4} y2={-8} stroke="#6E9AA6" strokeWidth={1} />
    </G>
  );
}

// ---- Where plants sit ----

type Placed = { id: PlantId | null; sprite: Sprite; at: V3; big?: boolean };

const LOWER: V3[] = [[1.6, 0.7, 2.6], [3.0, 0.7, 2.6], [4.4, 0.7, 2.6], [5.8, 0.7, 2.6], [7.3, 0.7, 2.6]];
const UPPER: V3[] = [[2.2, 0.5, 4.6], [4.2, 0.5, 4.6], [6.4, 0.5, 4.6]];
const RACK: V3[] = [[0.65, 3.0, 2.1], [0.65, 4.6, 2.1], [0.65, 2.6, 3.1], [0.65, 4.2, 3.1]];
const FLOOR: V3[] = [[6.6, 4.4, 0], [7.9, 3.0, 0], [4.6, 4.6, 0]];

/** Decide which of the user's plants appear where, for this season. */
export function layoutPlants(plants: Plant[], season: Season): Placed[] {
  const placed: Placed[] = [];
  if (plants.length === 0) {
    RACK.slice(0, 2).forEach((at) => placed.push({ id: null, sprite: 'seedlings', at }));
    return placed;
  }

  // Warm crops spend winter indoors, so they leave the greenhouse.
  const here = season === 'winter' ? plants.filter((p) => p.kind === 'cool') : plants;
  const seedlingCrops = season === 'spring' ? here.filter((p) => p.kind === 'warm') : [];
  const tall = season === 'summer' || season === 'autumn' ? here.filter((p) => p.tall) : [];
  const shelf = here.filter((p) => !seedlingCrops.includes(p) && !tall.includes(p));

  if (tall.length) {
    const n = Math.min(FLOOR.length, Math.max(tall.length, 2));
    for (let i = 0; i < n; i++) {
      const p = tall[i % tall.length];
      placed.push({ id: p.id, sprite: p.sprite, at: FLOOR[i], big: true });
    }
  }
  if (shelf.length) {
    [...LOWER, ...UPPER].forEach((at, i) => {
      const p = shelf[i % shelf.length];
      placed.push({ id: p.id, sprite: p.sprite, at });
    });
  }
  RACK.forEach((at, i) => {
    if (seedlingCrops.length) {
      const p = seedlingCrops[i % seedlingCrops.length];
      placed.push({ id: p.id, sprite: 'seedlings', at });
    } else if (i < 2 && season !== 'winter') {
      placed.push({ id: null, sprite: 'seedlings', at });
    }
  });
  return placed;
}

type Props = {
  season: Season;
  time: TimeOfDay;
  sky: Sky;
  plants: Plant[];
  onPlantPress?: (id: PlantId) => void;
};

export function GreenhouseScene({ season, time, sky, plants, onPlantPress }: Props) {
  const s = SEASONS[season];
  const t = TIMES[time];
  const snowy = s.snowyRoof || sky === 'snow';
  const overcast = sky !== 'clear';
  const { x: vx, y: vy, w: vw, h: vh } = SCENE_VIEWBOX;
  const cedar = shade('#B9794F', t.shade * 0.8);
  const cedarDark = shade('#9A603D', t.shade * 0.8);
  const I = { x0: -2.4, x1: 11.6, y0: -1.8, y1: 8.6, d: 2.4 };
  const fruit = season === 'summer' || season === 'autumn';

  const placed = layoutPlants(plants, season).sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]));

  const shelf = (key: string, x0: number, x1: number, y0: number, y1: number, z: number) => (
    <G key={key}>
      <Poly p={[[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]} fill={shade('#D9A27A', t.shade)} />
      <Poly p={[[x0, y1, z], [x1, y1, z], [x1, y1, z - 0.25], [x0, y1, z - 0.25]]} fill={cedar} />
      <Poly p={[[x1, y0, z], [x1, y1, z], [x1, y1, z - 0.25], [x1, y0, z - 0.25]]} fill={cedarDark} />
    </G>
  );

  return (
    <Svg width="100%" height="100%" viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={t.sky[0]} />
          <Stop offset="0.78" stopColor={t.sky[1]} />
        </LinearGradient>
        <RadialGradient id="glow" cx="50%" cy="55%" r="55%">
          <Stop offset="0" stopColor="#FFD592" stopOpacity={t.glow} />
          <Stop offset="1" stopColor="#FFB46B" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={vx} y={vy} width={vw} height={vh} fill="url(#sky)" />
      {overcast && <Rect x={vx} y={vy} width={vw} height={vh} fill="#8A97A6" opacity={time === 'night' ? 0.15 : 0.22} />}

      {/* sky details */}
      {t.stars && !overcast &&
        Array.from({ length: 34 }, (_, i) => (
          <Circle
            key={`st${i}`}
            cx={-185 + ((i * 97) % 370)}
            cy={-170 + ((i * 53) % 150)}
            r={i % 5 === 0 ? 1.3 : 0.7}
            fill="#F3F1FF"
            opacity={0.5 + (i % 3) * 0.2}
          />
        ))}
      {t.stars ? (
        <>
          <Circle cx={140} cy={-62} r={11} fill="#F4F1E6" opacity={overcast ? 0.5 : 1} />
          <Circle cx={145} cy={-66} r={10} fill={t.sky[0]} />
        </>
      ) : (
        !overcast && <Circle cx={140} cy={time === 'dusk' ? -10 : -62} r={time === 'dusk' ? 22 : 16} fill={t.sun} opacity={0.9} />
      )}
      {overcast &&
        [[-120, -120, 1], [70, -135, 1.3], [150, -80, 0.9]].map(([cx, cy, k], i) => (
          <G key={`cl${i}`} transform={`translate(${cx} ${cy}) scale(${k})`} opacity={time === 'night' ? 0.35 : 0.85}>
            <Ellipse cx={0} cy={0} rx={30} ry={9} fill="#F4F6F8" />
            <Ellipse cx={-10} cy={-6} rx={14} ry={9} fill="#F4F6F8" />
            <Ellipse cx={9} cy={-8} rx={16} ry={11} fill="#FAFBFC" />
          </G>
        ))}

      {/* floating island */}
      <Poly p={[[I.x0, I.y1, 0], [I.x1, I.y1, 0], [I.x1, I.y1, -I.d], [I.x0, I.y1, -I.d]]} fill={t.soil[1]} />
      <Poly p={[[I.x1, I.y0, 0], [I.x1, I.y1, 0], [I.x1, I.y1, -I.d], [I.x1, I.y0, -I.d]]} fill={t.soil[2]} />
      <Poly p={[[I.x0, I.y1, -1.4], [I.x1, I.y1, -1.4], [I.x1, I.y1, -1.6], [I.x0, I.y1, -1.6]]} fill={t.soil[0]} opacity={0.6} />
      <Poly p={[[I.x1, I.y0, -1.4], [I.x1, I.y1, -1.4], [I.x1, I.y1, -1.6], [I.x1, I.y0, -1.6]]} fill={t.soil[1]} opacity={0.6} />
      <Poly p={[[I.x0, I.y0, 0], [I.x1, I.y0, 0], [I.x1, I.y1, 0], [I.x0, I.y1, 0]]} fill={shade(s.ground, t.shade)} />
      <Poly p={[[I.x0, I.y1, 0], [I.x1, I.y1, 0], [I.x1, I.y1, -0.35], [I.x0, I.y1, -0.35]]} fill={shade(s.groundEdge, t.shade)} />
      <Poly p={[[I.x1, I.y0, 0], [I.x1, I.y1, 0], [I.x1, I.y1, -0.35], [I.x1, I.y0, -0.35]]} fill={shade(s.groundEdge, t.shade + 0.08)} />

      {/* stepping stones and gravel pad */}
      {[[10.1, 3.0], [10.9, 2.6]].map(([x, y]) => {
        const [px, py] = P(x, y, 0);
        return <Ellipse key={`ss${x}`} cx={px} cy={py} rx={6} ry={3} fill={shade('#E9E1D6', t.shade)} />;
      })}
      <Poly p={[[-0.4, -0.4, 0], [9.4, -0.4, 0], [9.4, 6.4, 0], [-0.4, 6.4, 0]]} fill={shade('#D9CFC2', t.shade)} />

      {/* trees behind */}
      <Tree x={-1.4} y={1.5} colors={s.tree} variant={0} bare={season === 'winter'} />
      <Tree x={-1.2} y={4.3} colors={s.tree} variant={1} bare={season === 'winter'} />
      <Tree x={2.4} y={-1.2} colors={s.tree} variant={1} bare={season === 'winter'} />
      <Tree x={5.6} y={-1.1} colors={s.tree} variant={0} bare={season === 'winter'} />

      {/* interior floor and back walls */}
      <Poly p={[[0, 0, 0], [9, 0, 0], [9, 6, 0], [0, 6, 0]]} fill={shade('#E8DFD2', t.shade)} />
      <Poly p={[[0, 0, 0], [0, 6, 0], [0, 6, H], [0, 3, R], [0, 0, H]]} fill={t.panel} opacity={Math.min(1, t.panelOp + 0.25)} />
      <Poly p={[[0, 0, 0], [9, 0, 0], [9, 0, H], [0, 0, H]]} fill={t.panel} opacity={Math.min(1, t.panelOp + 0.15)} />
      {t.glow > 0 && (() => {
        const [cx, cy] = P(4.5, 3, 3);
        return <Ellipse cx={cx} cy={cy} rx={90} ry={70} fill="url(#glow)" />;
      })()}
      {[0, 3, 6, 9].map((x) => <Beam key={`bw${x}`} a={[x, 0, 0]} b={[x, 0, H]} stroke={cedarDark} w={1.6} />)}
      {[2, 4, 6].map((y) => <Beam key={`sw${y}`} a={[0, y, 0]} b={[0, y, H]} stroke={cedarDark} w={1.6} />)}
      <Beam a={[0, 0, H]} b={[9, 0, H]} stroke={cedarDark} w={1.6} />
      <Beam a={[0, 0, 3.4]} b={[9, 0, 3.4]} stroke={cedarDark} w={1.1} />
      <Beam a={[0, 0, H]} b={[0, 3, R]} stroke={cedarDark} w={1.6} />
      <Beam a={[0, 3, R]} b={[0, 6, H]} stroke={cedarDark} w={1.6} />
      <Beam a={[0, 0, 3.4]} b={[0, 6, 3.4]} stroke={cedarDark} w={1.1} />

      {/* shelving along the back, staging rack on the side */}
      {shelf('lower', 0.6, 8.4, 0, 1.4, 2.6)}
      <Beam a={[0.8, 1.3, 0]} b={[0.8, 1.3, 2.35]} stroke={cedarDark} w={1.2} />
      <Beam a={[8.2, 1.3, 0]} b={[8.2, 1.3, 2.35]} stroke={cedarDark} w={1.2} />
      {shelf('upper', 1.2, 7.8, 0, 1.0, 4.6)}
      {[1.1, 2.1, 3.1].map((z) => shelf(`rack${z}`, 0, 1.3, 1.9, 5.4, z))}
      <Beam a={[1.25, 5.3, 0]} b={[1.25, 5.3, 3.1]} stroke={cedarDark} w={1.1} />
      <Beam a={[1.25, 2.0, 0]} b={[1.25, 2.0, 3.1]} stroke={cedarDark} w={1.1} />

      {/* plants, back to front */}
      {placed.map((pl, i) => {
        const [px, py] = P(...pl.at);
        const id = pl.id;
        return (
          <PlantSprite
            key={`pl${i}`}
            sprite={pl.sprite}
            x={px}
            y={py}
            scale={pl.big ? 1.35 : 1}
            fruit={fruit}
            onPress={id && onPlantPress ? () => onPlantPress(id) : undefined}
          />
        );
      })}

      {/* front walls (translucent polycarbonate), door and window */}
      <Poly p={[[0, 6, 0], [9, 6, 0], [9, 6, H], [0, 6, H]]} fill={t.panel} opacity={t.panelOp} />
      <Poly p={[[9, 0, 0], [9, 6, 0], [9, 6, H], [9, 3, R], [9, 0, H]]} fill={t.panel} opacity={t.panelOp + 0.06} />
      <Poly p={[[9, 2.1, 0], [9, 3.9, 0], [9, 3.9, 6.1], [9, 2.1, 6.1]]} fill={shade('#F5E6D6', t.shade)} opacity={0.35} />
      <Poly
        p={[[5.3, 6, 3.8], [7.3, 6, 3.8], [7.3, 6, 5.8], [5.3, 6, 5.8]]}
        fill={t.glow > 0 ? '#FFD9A0' : '#FFFFFF'}
        opacity={t.glow > 0 ? 0.45 : 0.3}
      />

      {/* roof, snowy in winter */}
      <Poly p={[[0, 0, H], [9, 0, H], [9, 3, R], [0, 3, R]]} fill={snowy ? '#EEF3F7' : t.panel} opacity={snowy ? 0.92 : t.panelOp + 0.05} />
      <Poly p={[[0, 3, R], [9, 3, R], [9, 6, H], [0, 6, H]]} fill={snowy ? '#FFFFFF' : t.panel} opacity={snowy ? 0.92 : t.panelOp + 0.05} />

      {/* front framing */}
      {[0, 3, 6, 9].map((x) => <Beam key={`fw${x}`} a={[x, 6, 0]} b={[x, 6, H]} stroke={cedar} w={2} />)}
      {[0, 6].map((y) => <Beam key={`ew${y}`} a={[9, y, 0]} b={[9, y, H]} stroke={cedar} w={2} />)}
      <Beam a={[9, 2.1, 0]} b={[9, 2.1, 6.1]} stroke={cedar} w={1.6} />
      <Beam a={[9, 3.9, 0]} b={[9, 3.9, 6.1]} stroke={cedar} w={1.6} />
      <Beam a={[9, 2.1, 6.1]} b={[9, 3.9, 6.1]} stroke={cedar} w={1.6} />
      <Beam a={[0, 6, 3.4]} b={[9, 6, 3.4]} stroke={cedar} w={1.3} />
      <Beam a={[9, 0, 3.4]} b={[9, 2.1, 3.4]} stroke={cedar} w={1.3} />
      <Beam a={[9, 3.9, 3.4]} b={[9, 6, 3.4]} stroke={cedar} w={1.3} />
      <Beam a={[5.3, 6, 3.8]} b={[7.3, 6, 3.8]} stroke={cedar} w={1.2} />
      <Beam a={[5.3, 6, 5.8]} b={[7.3, 6, 5.8]} stroke={cedar} w={1.2} />
      <Beam a={[5.3, 6, 3.8]} b={[5.3, 6, 5.8]} stroke={cedar} w={1.2} />
      <Beam a={[7.3, 6, 3.8]} b={[7.3, 6, 5.8]} stroke={cedar} w={1.2} />
      <Beam a={[0, 6, H]} b={[9, 6, H]} stroke={cedar} w={2.2} />
      <Beam a={[9, 0, H]} b={[9, 6, H]} stroke={cedar} w={1.4} />
      <Beam a={[9, 0, H]} b={[9, 3, R]} stroke={cedar} w={2.2} />
      <Beam a={[9, 3, R]} b={[9, 6, H]} stroke={cedar} w={2.2} />
      <Beam a={[0, 3, R]} b={[9, 3, R]} stroke={cedar} w={2.4} />
      {[3, 6].map((x) => <Beam key={`rf${x}`} a={[x, 3, R]} b={[x, 6, H]} stroke={cedar} w={1.3} />)}
      <Beam a={[0, 3, R]} b={[0, 6, H]} stroke={cedar} w={1.8} />
      <Poly p={[[0, 6, 0], [9, 6, 0], [9, 6, 0.35], [0, 6, 0.35]]} fill={cedar} />
      <Poly p={[[9, 0, 0], [9, 6, 0], [9, 6, 0.35], [9, 0, 0.35]]} fill={cedarDark} />
      {!snowy && <Beam a={[0.4, 3.3, R - 0.15]} b={[8.6, 3.3, R - 0.15]} stroke="rgba(255,255,255,0.55)" w={1} />}

      {/* trees and gardener in front */}
      <Tree x={10.6} y={-0.6} colors={s.tree} variant={0} bare={season === 'winter'} />
      <Tree x={4.2} y={7.7} colors={s.tree} variant={1} bare={season === 'winter'} />
      {sky !== 'rain' && sky !== 'snow' && time !== 'night' && <Gardener x={10.4} y={4.6} />}

      {/* falling weather */}
      {sky === 'snow' &&
        Array.from({ length: 46 }, (_, i) => (
          <Circle
            key={`sn${i}`}
            cx={-185 + ((i * 89) % 370)}
            cy={-170 + ((i * 61) % 400)}
            r={1 + (i % 3) * 0.4}
            fill="#FFFFFF"
            opacity={0.8}
          />
        ))}
      {sky === 'rain' &&
        Array.from({ length: 44 }, (_, i) => {
          const x = -185 + ((i * 83) % 370);
          const y = -170 + ((i * 67) % 400);
          return (
            <Line key={`rn${i}`} x1={x} y1={y} x2={x - 3} y2={y + 9} stroke="#DDE8F0" strokeWidth={1} opacity={0.7} strokeLinecap="round" />
          );
        })}
    </Svg>
  );
}
