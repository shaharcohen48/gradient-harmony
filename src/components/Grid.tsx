import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { TileData } from '../types/game';
import { Tile } from './Tile';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface GridProps {
  rows: number;
  cols: number;
  tiles: TileData[];
  selectedTileIndex: number | null;
  hintedIndex: number | null;
  isSolved: boolean;
  onTilePress: (index: number) => void;
  onSwapTiles: (indexA: number, indexB: number) => boolean;
}

export const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  tiles,
  selectedTileIndex,
  hintedIndex,
  isSolved,
  onTilePress,
  onSwapTiles,
}) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [draggedTileIndex, setDraggedTileIndex] = useState<number | null>(null);
  const [hoveredTileIndex, setHoveredTileIndex] = useState<number | null>(null);

  // Dynamic tile sizing
  const { tileSize, gap, gridWidth, gridHeight } = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return { tileSize: 40, gap: 3, gridWidth: 0, gridHeight: 0 };
    }

    const availableWidth = containerSize.width - 24;
    const availableHeight = containerSize.height - 24;

    const maxCellWidth = availableWidth / cols;
    const maxCellHeight = availableHeight / rows;
    const rawTileSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));

    const gapSize = Math.max(2, Math.min(6, Math.floor(rawTileSize * 0.06)));
    const finalTileSize = rawTileSize - gapSize;

    return {
      tileSize: finalTileSize,
      gap: gapSize,
      gridWidth: (finalTileSize + gapSize) * cols,
      gridHeight: (finalTileSize + gapSize) * rows,
    };
  }, [containerSize, rows, cols]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Helper to find tile index from relative (x, y) coordinates
  const getTileIndexAtPoint = (x: number, y: number): number | null => {
    const cellW = tileSize + gap;
    const cellH = tileSize + gap;

    const c = Math.floor(x / cellW);
    const r = Math.floor(y / cellH);

    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const idx = r * cols + c;
      return idx < tiles.length ? idx : null;
    }
    return null;
  };

  // Pan Responder for fluid drag-and-drop
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isSolved,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isSolved && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
      },
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (isSolved) return;
        const { locationX, locationY } = evt.nativeEvent;
        const index = getTileIndexAtPoint(locationX, locationY);
        if (index !== null && tiles[index] && !tiles[index].isLocked) {
          setDraggedTileIndex(index);
          soundManager.playTilePickup();
          triggerHaptic.tilePickup();
        }
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (isSolved) return;
        const { locationX, locationY } = evt.nativeEvent;
        const index = getTileIndexAtPoint(locationX, locationY);
        setHoveredTileIndex(index);
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (isSolved) {
          setDraggedTileIndex(null);
          setHoveredTileIndex(null);
          return;
        }

        const isClick = Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6;
        const { locationX, locationY } = evt.nativeEvent;
        const targetIndex = getTileIndexAtPoint(locationX, locationY);

        if (isClick && targetIndex !== null) {
          // It's a tap/click
          onTilePress(targetIndex);
        } else if (draggedTileIndex !== null && targetIndex !== null && draggedTileIndex !== targetIndex) {
          // Drag and drop swap
          const targetTile = tiles[targetIndex];
          if (targetTile && !targetTile.isLocked) {
            onSwapTiles(draggedTileIndex, targetIndex);
          }
        }

        setDraggedTileIndex(null);
        setHoveredTileIndex(null);
      },
      onPanResponderTerminate: () => {
        setDraggedTileIndex(null);
        setHoveredTileIndex(null);
      },
    })
  ).current;

  return (
    <View style={styles.outerContainer} onLayout={onLayout}>
      {gridWidth > 0 && (
        <View
          style={[
            styles.gridBoard,
            {
              width: gridWidth,
              height: gridHeight,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {tiles.map((tile, index) => {
            const isSelected = selectedTileIndex === index || draggedTileIndex === index;
            const isHovered = hoveredTileIndex === index && draggedTileIndex !== null;
            const isHinted = hintedIndex === index;

            return (
              <Tile
                key={tile.id}
                tile={tile}
                size={tileSize}
                gap={gap}
                isSelected={isSelected || isHovered}
                isHinted={isHinted}
                isSolved={isSolved}
                onPress={() => onTilePress(index)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  gridBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 24, 33, 0.6)',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});
