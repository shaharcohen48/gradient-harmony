import { LevelConfig } from '../types/game';
import { PALETTES } from './palettes';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'First Steps',
    description: 'A gentle introduction to color transitions',
    rows: 4,
    cols: 4,
    palette: PALETTES[1], // Sunset Warmth
  },
  {
    id: 2,
    name: 'Ocean Calm',
    description: 'Find serenity in the deep blue tide',
    rows: 4,
    cols: 4,
    palette: PALETTES[0], // Ocean Depths
  },
  {
    id: 3,
    name: 'Cotton Cloud',
    description: 'Delicate pastel hues blending together',
    rows: 4,
    cols: 4,
    palette: PALETTES[3], // Pastel Dreams
  },
  {
    id: 4,
    name: 'Desert Mirage',
    description: 'Warm terracotta fading into grape dusk',
    rows: 4,
    cols: 4,
    palette: PALETTES[4], // Desert Dusk
  },
  {
    id: 5,
    name: 'Morning Matcha',
    description: 'Earthy calm greens and steamed tea foam',
    rows: 5,
    cols: 5,
    palette: PALETTES[5], // Matcha Latte
  },
  {
    id: 6,
    name: 'Polar Lights',
    description: 'Dancing auroras in the arctic midnight',
    rows: 5,
    cols: 5,
    palette: PALETTES[2], // Aurora Borealis
  },
  {
    id: 7,
    name: 'Sakura Breeze',
    description: 'Fluttering cherry blossom petals',
    rows: 5,
    cols: 5,
    palette: PALETTES[6], // Cherry Blossom
  },
  {
    id: 8,
    name: 'Nordic Winter',
    description: 'Cool glacial gradients and quiet snowfall',
    rows: 5,
    cols: 5,
    palette: PALETTES[7], // Nordic Frost
  },
  {
    id: 9,
    name: 'Cosmic Drift',
    description: 'Starlight shimmering through deep space',
    rows: 6,
    cols: 6,
    palette: PALETTES[8], // Cosmic Nebula
  },
  {
    id: 10,
    name: 'Autumn Leaves',
    description: 'Crisp crimson and amber woodland foliage',
    rows: 6,
    cols: 6,
    palette: PALETTES[9], // Autumn Maple
  },
  {
    id: 11,
    name: 'Velvet Twilight',
    description: 'A soothing symphony of violet and lilac',
    rows: 6,
    cols: 6,
    palette: PALETTES[10], // Lavender Mist
  },
  {
    id: 12,
    name: 'Verdant Forest',
    description: 'Sunlight filtering through canopy leaves',
    rows: 6,
    cols: 6,
    palette: PALETTES[11], // Emerald Isle
  },
  {
    id: 13,
    name: 'Sundown Symphony',
    description: 'Deep dusk hues across an expansive sky',
    rows: 7,
    cols: 7,
    palette: PALETTES[1], // Sunset Warmth
  },
  {
    id: 14,
    name: 'Subsea Trench',
    description: 'Luminescent currents in the oceanic abyss',
    rows: 7,
    cols: 7,
    palette: PALETTES[0], // Ocean Depths
  },
  {
    id: 15,
    name: 'Northern Horizon',
    description: 'A magnificent display of polar lights',
    rows: 7,
    cols: 7,
    palette: PALETTES[2], // Aurora Borealis
  },
  {
    id: 16,
    name: 'Master Harmony',
    description: 'The ultimate 8x8 spectrum meditation',
    rows: 8,
    cols: 8,
    palette: PALETTES[8], // Cosmic Nebula
  },
];

