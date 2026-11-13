import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LevelConfig } from '../types/game';

interface HeaderProps {
  currentLevel: LevelConfig;
  completionProgress: number;
  movesCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onHint: () => void;
  onOpenPalettes: () => void;
  onOpenLevels: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  completionProgress,
  movesCount,
  isMuted,
  onToggleMute,
  onReset,
  onHint,
  onOpenPalettes,
  onOpenLevels,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar with Level Info and Menu buttons */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenLevels}
          accessibilityLabel="Select Level"
        >
          <Ionicons name="grid-outline" size={22} color="#E0E6ED" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.levelTitle}>
            Level {currentLevel.id}: {currentLevel.name}
          </Text>
          <Text style={styles.gridSize}>
            {currentLevel.rows}×{currentLevel.cols} • {currentLevel.palette.name}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenPalettes}
            accessibilityLabel="Palette Themes"
          >
            <Ionicons name="color-palette-outline" size={22} color="#E0E6ED" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onToggleMute}
            accessibilityLabel="Toggle Sound"
          >
            <Ionicons
              name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
              size={22}
              color="#E0E6ED"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onReset}
            accessibilityLabel="Reset Puzzle"
          >
            <Ionicons name="refresh-outline" size={22} color="#E0E6ED" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress & Hint Row */}
      <View style={styles.bottomRow}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, completionProgress)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completionProgress}% Harmony
            {movesCount > 0 ? ` • ${movesCount} swaps` : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={onHint}
          accessibilityLabel="Gentle Hint"
        >
          <Ionicons name="sparkles-outline" size={16} color="#FFD166" />
          <Text style={styles.hintText}>Hint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: 'rgba(15, 20, 30, 0.85)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  gridSize: {
    color: '#8E9BAE',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00F0FF',
    borderRadius: 2,
  },
  progressText: {
    color: '#7E8B9B',
    fontSize: 11,
    marginTop: 4,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.3)',
    gap: 5,
  },
  hintText: {
    color: '#FFD166',
    fontSize: 12,
    fontWeight: '600',
  },
});

