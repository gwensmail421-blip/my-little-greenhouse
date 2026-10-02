import { Circle, Ellipse, G, Line, Path, Polygon, Rect, Svg } from 'react-native-svg';

import type { Sprite } from '@/data/plants';

type Props = {
  sprite: Sprite;
  x?: number;
  y?: number;
  scale?: number;
  /** show ripe fruit on tomatoes */
  fruit?: boolean;
  onPress?: () => void;
};

function Leaf({ cx, cy, rx, ry, fill, rot = 0 }: { cx: number; cy: number; rx: number; ry: number; fill: string; rot?: number }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} transform={`rotate(${rot} ${cx} ${cy})`} />;
}

const TOP = -8.4;
const TALL: Sprite[] = ['tomato', 'cucumber', 'pea'];

function Foliage({ sprite, fruit }: { sprite: Sprite; fruit?: boolean }) {
  const top = TOP;
  switch (sprite) {
    case 'kale':
      return (
        <>
          <Leaf cx={-3.5} cy={top - 4} rx={3} ry={5.5} fill="#4C7A74" rot={-25} />
          <Leaf cx={3.5} cy={top - 4} rx={3} ry={5.5} fill="#4C7A74" rot={25} />
          <Leaf cx={0} cy={top - 6.5} rx={3.2} ry={6.5} fill="#6E9C8E" />
          <Leaf cx={-1.8} cy={top - 3} rx={2.6} ry={4} fill="#5D8C80" rot={-10} />
        </>
      );
    case 'spinach':
      return (
        <>
          <Leaf cx={-3.4} cy={top - 2.5} rx={3.4} ry={2.4} fill="#3F7B50" rot={-20} />
          <Leaf cx={3.4} cy={top - 2.5} rx={3.4} ry={2.4} fill="#4C8A5C" rot={20} />
          <Leaf cx={0} cy={top - 4.5} rx={3} ry={3.4} fill="#5E9E68" />
        </>
      );
    case 'lettuce':
      return (
        <>
          <Leaf cx={-3.2} cy={top - 2.2} rx={3.2} ry={2.6} fill="#93C47B" />
          <Leaf cx={3.2} cy={top - 2.2} rx={3.2} ry={2.6} fill="#A8CF8E" />
          <Leaf cx={0} cy={top - 4} rx={3.6} ry={3.2} fill="#BEDDA2" />
          <Leaf cx={0} cy={top - 3.2} rx={1.8} ry={1.6} fill="#D6EBBF" />
        </>
      );
    case 'mache':
      return (
        <>
          {[-3, 0, 3].map((dx, i) => (
            <Leaf key={dx} cx={dx} cy={top - 1.8 - (i === 1 ? 1.2 : 0)} rx={2.2} ry={1.5} fill={i === 1 ? '#8FBF7C' : '#73A865'} />
          ))}
        </>
      );
    case 'herb':
      return (
        <>
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <Line
              key={i}
              x1={i * 1.1}
              y1={top}
              x2={i * 1.6}
              y2={top - 6 - (3 - Math.abs(i)) * 1.2}
              stroke="#8CA98A"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}
          <Leaf cx={0} cy={top - 4} rx={3.2} ry={2} fill="#A9C2A4" />
        </>
      );
    case 'basil':
      return (
        <>
          <Leaf cx={-3} cy={top - 3} rx={3} ry={2.2} fill="#4E9E4D" rot={-25} />
          <Leaf cx={3} cy={top - 3} rx={3} ry={2.2} fill="#5FAE5A" rot={25} />
          <Leaf cx={0} cy={top - 6} rx={2.8} ry={2.4} fill="#7DBF6A" />
          <Leaf cx={-1.8} cy={top - 8} rx={2} ry={1.6} fill="#8FCB79" rot={-20} />
        </>
      );
    case 'pea':
      return (
        <>
          <Line x1={-2} y1={top} x2={-2} y2={top - 13} stroke="#B0926E" strokeWidth={0.8} />
          <Line x1={2} y1={top} x2={2} y2={top - 13} stroke="#B0926E" strokeWidth={0.8} />
          {[[-2, -4], [2, -7], [-2, -10], [2, -12]].map(([dx, dy]) => (
            <Leaf key={dy} cx={dx} cy={top + dy} rx={2.2} ry={1.4} fill="#7DBF6A" />
          ))}
          <Circle cx={2.4} cy={top - 4} r={1} fill="#F5F1F4" />
        </>
      );
    case 'pepper':
      return (
        <>
          <Leaf cx={0} cy={top - 5} rx={5} ry={5} fill="#4F8F55" />
          <Leaf cx={-2} cy={top - 7} rx={3} ry={3} fill="#62A262" />
          <Ellipse cx={-2.2} cy={top - 2.8} rx={1.1} ry={2.2} fill="#E8613F" />
          <Ellipse cx={2.6} cy={top - 4} rx={1.1} ry={2.2} fill="#F09A3E" />
        </>
      );
    case 'tomato':
      return (
        <>
          <Line x1={0} y1={top} x2={0} y2={top - 24} stroke="#B0926E" strokeWidth={0.9} />
          <Leaf cx={-2.5} cy={top - 6} rx={4.5} ry={4} fill="#5A8F52" />
          <Leaf cx={2.5} cy={top - 11} rx={4.5} ry={4} fill="#6A9B5E" />
          <Leaf cx={-2} cy={top - 16} rx={4} ry={3.6} fill="#5A8F52" />
          <Leaf cx={1.5} cy={top - 20} rx={3.2} ry={3} fill="#79AA69" />
          {fruit &&
            [[-3, -5], [3.5, -9], [-1.5, -14], [2.5, -17], [0, -8.5]].map(([dx, dy], i) => (
              <Circle key={i} cx={dx} cy={top + dy} r={1.5} fill={i % 2 ? '#E98B4E' : '#E0614F'} />
            ))}
        </>
      );
    case 'cucumber':
      return (
        <>
          <Line x1={-1.5} y1={top} x2={-1.5} y2={top - 26} stroke="#B0926E" strokeWidth={0.9} />
          <Line x1={2.5} y1={top} x2={2.5} y2={top - 26} stroke="#B0926E" strokeWidth={0.9} />
          {[[-1, -5], [2, -10], [-1, -15], [2.5, -20], [0, -24]].map(([dx, dy], i) => (
            <Leaf key={i} cx={dx} cy={top + dy} rx={4} ry={3.2} fill={i % 2 ? '#5E9E50' : '#6FAF5E'} />
          ))}
          <Ellipse cx={4.6} cy={top - 12} rx={1.1} ry={3} fill="#3F7A3F" />
          <Circle cx={-3.6} cy={top - 17} r={1.1} fill="#F2CE4E" />
        </>
      );
    default:
      return null;
  }
}

function Seedlings() {
  return (
    <>
      <Polygon points="-9,-1 0,3.5 9,-1 0,-5.5" fill="#7A5D4C" />
      <Polygon points="-9,-1 0,3.5 0,6 -9,1.5" fill="#5F4739" />
      <Polygon points="9,-1 0,3.5 0,6 9,1.5" fill="#6B5040" />
      {[[-5, -1], [-1.5, -3], [2, -1], [-2, 1], [5.5, -1], [1.5, 1.6]].map(([dx, dy]) => (
        <G key={`${dx},${dy}`}>
          <Line x1={dx} y1={dy} x2={dx} y2={dy - 3} stroke="#6BA35B" strokeWidth={0.9} />
          <Ellipse cx={dx - 1.2} cy={dy - 3.4} rx={1.4} ry={0.8} fill="#9AD07F" />
          <Ellipse cx={dx + 1.2} cy={dy - 3.4} rx={1.4} ry={0.8} fill="#86C26E" />
        </G>
      ))}
    </>
  );
}

/** A potted plant (or a seedling tray) drawn at an SVG point, base at (x, y). */
export function PlantSprite({ sprite, x = 0, y = 0, scale = 1, fruit, onPress }: Props) {
  return (
    <G transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`} onPress={onPress}>
      {sprite === 'seedlings' ? (
        <Seedlings />
      ) : (
        <>
          <Path d="M-5,-7 L5,-7 L3.8,0 L-3.8,0 Z" fill="#C9775A" />
          <Path d="M0,-7 L5,-7 L3.8,0 L0,0 Z" fill="#B5664C" />
          <Rect x={-5.6} y={-8.4} width={11.2} height={2} rx={0.6} fill="#D88A6B" />
          <Foliage sprite={sprite} fruit={fruit} />
        </>
      )}
    </G>
  );
}

/** A small standalone plant picture for cards, chips and reminders. */
export function PlantAvatar({ sprite, size = 34, fruit = true }: { sprite: Sprite; size?: number; fruit?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox={TALL.includes(sprite) ? '-11 -34 22 35' : '-12 -24 24 25'}>
      <PlantSprite sprite={sprite} fruit={fruit} />
    </Svg>
  );
}
