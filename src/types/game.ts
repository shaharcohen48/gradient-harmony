export interface TileData {
  id: string;
  originalIndex: number;
  currentIndex: number;
  color: string;
  isLocked: boolean; // Corner tiles are locked
  targetRow: number;
  targetCol: number;
}

export interface ColorStop {
  r: number;
  g: number;
  b: number;
}

export interface PaletteTheme {
  id: string;
  name: string;
  subtitle: string;
  corners: [string, string, string, string]; // Top-left, Top-right, Bottom-left, Bottom-right
}

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  palette: PaletteTheme;
  description?: string;
}

export interface Position {
  x: number;
  y: number;
}

