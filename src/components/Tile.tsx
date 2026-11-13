import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { TileData } from '../types/game';

interface TileProps {
  tile: TileData;
  size: number;
  gap: number;
  isSelected: boolean;
  isHinted: boolean;
  onPress: () => void;
  isSolved: boolean;
}

export const Tile: React.FC<TileProps> = ({
  tile,
  size,
  gap,
  isSelected,
  isHinted,
  onPress,
  isSolved,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const elevation = useSharedValue(0);

  // Animate on selection
  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.08, { damping: 12, stiffness: 180 });
      elevation.value = withTiming(8, { duration: 150 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      elevation.value = withTiming(0, { duration: 150 });
    }
  }, [isSelected, scale, elevation]);

  // Animate on hint
  useEffect(() => {
    if (isHinted) {
      scale.value = withSequence(
        withTiming(1.12, { duration: 250 }),
        withTiming(0.95, { duration: 250 }),
        withTiming(1.08, { duration: 250 }),
        withTiming(1, { duration: 250 })
      );
    }
  }, [isHinted, scale]);

  // Solved celebration wave
  useEffect(() => {
    if (isSolved) {
      const delay = (tile.targetRow + tile.targetCol) * 60;
      setTimeout(() => {
        scale.value = withSequence(
          withTiming(1.06, { duration: 200 }),
          withTiming(1.0, { duration: 250 })
        );
      }, delay);
    }
  }, [isSolved, tile.targetRow, tile.targetCol, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      zIndex: isSelected ? 99 : 1,
      elevation: elevation.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.tileContainer,
        {
          width: size,
          height: size,
          margin: gap / 2,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={tile.isLocked ? 1 : 0.85}
        onPress={onPress}
        disabled={tile.isLocked || isSolved}
        style={[
          styles.tileContent,
          {
            backgroundColor: tile.color,
            borderRadius: Math.max(3, Math.min(8, size * 0.12)),
          },
          isSelected && styles.selectedBorder,
          isHinted && styles.hintedBorder,
        ]}
      >
        {/* Locked Corner Anchor Indicator */}
        {tile.isLocked && (
          <View style={styles.lockedIndicatorContainer}>
            <View
              style={[
                styles.lockedDot,
                {
                  width: Math.max(4, size * 0.14),
                  height: Math.max(4, size * 0.14),
                  borderRadius: size * 0.07,
                },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedBorder: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(255, 255, 255, 0.7)',
      },
      default: {
        shadowColor: '#FFF',
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
    }),
  },
  hintedBorder: {
    borderWidth: 2.5,
    borderColor: '#FFD166',
  },
  lockedIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
});

