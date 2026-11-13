import { ColorStop, TileData } from '../types/game';

/**
 * Converts a hex string (#RGB or #RRGGBB) to RGB ColorStop
 */
export function hexToRgb(hex: string): ColorStop {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB numbers to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Bilinear interpolation of 4 corner colors at (u, v) in [0, 1] x [0, 1]
 * Uses quadratic energy interpolation (gamma-corrected) for vivid, luminous gradients.
 */
export function interpolateCorners(
  corners: [string, string, string, string], // TL, TR, BL, BR
  u: number,
  v: number
): string {
  const [cTL, cTR, cBL, cBR] = corners.map(hexToRgb);

  const wTL = (1 - u) * (1 - v);
  const wTR = u * (1 - v);
  const wBL = (1 - u) * v;
  const wBR = u * v;

  // Gamma-corrected blending (square space)
  const r = Math.sqrt(
    wTL * (cTL.r * cTL.r) +
    wTR * (cTR.r * cTR.r) +
    wBL * (cBL.r * cBL.r) +
    wBR * (cBR.r * cBR.r)
  );

  const g = Math.sqrt(
    wTL * (cTL.g * cTL.g) +
    wTR * (cTR.g * cTR.g) +
    wBL * (cBL.g * cBL.g) +
    wBR * (cBR.g * cBR.g)
  );

  const b = Math.sqrt(
    wTL * (cTL.b * cTL.b) +
    wTR * (cTR.b * cTR.b) +
    wBL * (cBL.b * cBL.b) +
    wBR * (cBR.b * cBR.b)
  );

  return rgbToHex(r, g, b);
}

/**
 * Generates initial grid tiles for given dimensions and corner colors.
 */
export function generateTiles(
  rows: number,
  cols: number,
  corners: [string, string, string, string]
): TileData[] {
  const tiles: TileData[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = cols === 1 ? 0 : c / (cols - 1);
      const v = rows === 1 ? 0 : r / (rows - 1);
      const color = interpolateCorners(corners, u, v);
      const isCorner =
        (r === 0 || r === rows - 1) &&
        (c === 0 || c === cols - 1);

      const index = r * cols + c;
      tiles.push({
        id: `tile-${r}-${c}`,
        originalIndex: index,
        currentIndex: index,
        color,
        isLocked: isCorner,
        targetRow: r,
        targetCol: c,
      });
    }
  }

  return tiles;
}

/**
 * Fisher-Yates shuffle only non-locked tiles.
 * Ensures the shuffled grid is not already solved.
 */
export function shuffleNonLockedTiles(tiles: TileData[]): TileData[] {
  const result = [...tiles];
  const unlockedIndices: number[] = [];

  tiles.forEach((t, i) => {
    if (!t.isLocked) {
      unlockedIndices.push(i);
    }
  });

  if (unlockedIndices.length <= 1) return result;

  let attempts = 0;
  let isDifferent = false;

  while (!isDifferent && attempts < 10) {
    attempts++;
    // Shuffle positions of unlocked tiles
    const shuffledPositions = [...unlockedIndices];
    for (let i = shuffledPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
    }

    // Assign tiles to their new slots
    const extractedTiles = unlockedIndices.map(idx => tiles[idx]);
    shuffledPositions.forEach((targetPos, idx) => {
      result[targetPos] = {
        ...extractedTiles[idx],
        currentIndex: targetPos,
      };
    });

    // Check if at least some unlocked tiles are misplaced
    isDifferent = unlockedIndices.some(idx => result[idx].originalIndex !== idx);
  }

  return result;
}

/**
 * Checks if the current arrangement matches the solved arrangement
 */
export function checkIsSolved(tiles: TileData[]): boolean {
  return tiles.every((tile, index) => tile.originalIndex === index);
}

/**
 * Calculates current completion percentage
 */
export function getCompletionProgress(tiles: TileData[]): number {
  if (tiles.length === 0) return 0;
  const correctCount = tiles.filter((t, i) => t.originalIndex === i).length;
  return Math.round((correctCount / tiles.length) * 100);
}

