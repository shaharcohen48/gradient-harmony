import { useState, useEffect, useCallback, useMemo } from 'react';
import { TileData, LevelConfig, PaletteTheme } from '../types/game';
import { LEVELS } from '../constants/levels';
import { PALETTES } from '../constants/palettes';
import {
  generateTiles,
  shuffleNonLockedTiles,
  checkIsSolved,
  getCompletionProgress,
} from '../utils/color';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export function useGame() {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [customPalette, setCustomPalette] = useState<PaletteTheme | null>(null);
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hintedIndex, setHintedIndex] = useState<number | null>(null);
  const [movesCount, setMovesCount] = useState<number>(0);

  const currentLevel: LevelConfig = useMemo(() => {
    const lvl = LEVELS[levelIndex % LEVELS.length];
    if (customPalette) {
      return { ...lvl, palette: customPalette };
    }
    return lvl;
  }, [levelIndex, customPalette]);

  // Initialize level
  const initLevel = useCallback(
    (lvl: LevelConfig) => {
      const initial = generateTiles(lvl.rows, lvl.cols, lvl.palette.corners);
      const shuffled = shuffleNonLockedTiles(initial);
      setTiles(shuffled);
      setIsSolved(false);
      setSelectedTileIndex(null);
      setHintedIndex(null);
      setMovesCount(0);
    },
    []
  );

  useEffect(() => {
    initLevel(currentLevel);
  }, [levelIndex, customPalette, initLevel]);

  // Swap two tiles
  const swapTiles = useCallback(
    (indexA: number, indexB: number) => {
      if (indexA === indexB) {
        setSelectedTileIndex(null);
        return false;
      }

      const tileA = tiles[indexA];
      const tileB = tiles[indexB];

      if (!tileA || !tileB) return false;
      if (tileA.isLocked || tileB.isLocked) return false;

      const newTiles = [...tiles];
      newTiles[indexA] = { ...tileB, currentIndex: indexA };
      newTiles[indexB] = { ...tileA, currentIndex: indexB };

      setTiles(newTiles);
      setSelectedTileIndex(null);
      setHintedIndex(null);
      setMovesCount(m => m + 1);

      // Sound and haptics
      soundManager.playTileDrop();
      triggerHaptic.tileDrop();

      // Check if newly placed tile reached its correct destination
      const tileAIsCorrect = newTiles[indexB].originalIndex === indexB;
      const tileBIsCorrect = newTiles[indexA].originalIndex === indexA;

      if (tileAIsCorrect || tileBIsCorrect) {
        const correctTile = tileAIsCorrect ? newTiles[indexB] : newTiles[indexA];
        soundManager.playTileChime(
          correctTile.targetRow,
          correctTile.targetCol,
          currentLevel.rows,
          currentLevel.cols
        );
        triggerHaptic.tileCorrect();
      }

      // Check overall solution
      const solved = checkIsSolved(newTiles);
      if (solved) {
        setIsSolved(true);
        soundManager.playCompletionChord();
        triggerHaptic.levelComplete();
      }

      return true;
    },
    [tiles, currentLevel]
  );

  // Handle tile tap / click selection (tap-to-swap fallback / accessibility)
  const handleTilePress = useCallback(
    (index: number) => {
      const tile = tiles[index];
      if (!tile || tile.isLocked || isSolved) return;

      if (selectedTileIndex === null) {
        // Select tile
        setSelectedTileIndex(index);
        soundManager.playTilePickup();
        triggerHaptic.tilePickup();
      } else if (selectedTileIndex === index) {
        // Deselect
        setSelectedTileIndex(null);
        triggerHaptic.tileDrop();
      } else {
        // Perform swap
        swapTiles(selectedTileIndex, index);
      }
    },
    [tiles, selectedTileIndex, isSolved, swapTiles]
  );

  // Reset current level
  const resetLevel = useCallback(() => {
    initLevel(currentLevel);
    triggerHaptic.buttonTap();
  }, [currentLevel, initLevel]);

  // Advance to next level
  const nextLevel = useCallback(() => {
    setCustomPalette(null);
    setLevelIndex(prev => (prev + 1) % LEVELS.length);
    triggerHaptic.buttonTap();
  }, []);

  // Jump to specific level
  const selectLevel = useCallback((index: number) => {
    setCustomPalette(null);
    setLevelIndex(index);
    triggerHaptic.buttonTap();
  }, []);

  // Set custom palette
  const selectPalette = useCallback((palette: PaletteTheme) => {
    setCustomPalette(palette);
    triggerHaptic.buttonTap();
  }, []);

  // Hint: finds a misplaced non-locked tile and places it in its correct place
  const useHint = useCallback(() => {
    if (isSolved) return;

    // Find the first misplaced tile
    const misplacedIndex = tiles.findIndex(
      (tile, idx) => !tile.isLocked && tile.originalIndex !== idx
    );

    if (misplacedIndex !== -1) {
      const targetTile = tiles[misplacedIndex];
      // Find where its correct tile is currently located
      const correctTileLocation = tiles.findIndex(
        t => t.originalIndex === targetTile.originalIndex
      );

      // Temporarily highlight it
      setHintedIndex(misplacedIndex);
      triggerHaptic.tileCorrect();
      soundManager.playTileChime(
        targetTile.targetRow,
        targetTile.targetCol,
        currentLevel.rows,
        currentLevel.cols
      );

      setTimeout(() => {
        setHintedIndex(null);
      }, 2000);
    }
  }, [tiles, isSolved, currentLevel]);

  const completionProgress = useMemo(() => getCompletionProgress(tiles), [tiles]);

  return {
    levelIndex,
    currentLevel,
    tiles,
    selectedTileIndex,
    hintedIndex,
    isSolved,
    movesCount,
    completionProgress,
    swapTiles,
    handleTilePress,
    resetLevel,
    nextLevel,
    selectLevel,
    selectPalette,
    useHint,
  };
}

