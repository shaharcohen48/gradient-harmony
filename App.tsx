import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGame } from './src/hooks/useGame';
import { Header } from './src/components/Header';
import { Grid } from './src/components/Grid';
import { CompletionModal } from './src/components/CompletionModal';
import { PaletteModal } from './src/components/PaletteModal';
import { LevelModal } from './src/components/LevelModal';
import { soundManager } from './src/utils/audio';

export default function App() {
  const {
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
  } = useGame();

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState<boolean>(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);

  // Toggle audio
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Start subtle ambient sound on first user interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      soundManager.resume();
      soundManager.startAmbientMusic();
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('click', handleFirstTouch, { once: true });
      window.addEventListener('touchstart', handleFirstTouch, { once: true });
      return () => {
        window.removeEventListener('click', handleFirstTouch);
        window.removeEventListener('touchstart', handleFirstTouch);
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        {/* Header Controls */}
        <Header
          currentLevel={currentLevel}
          completionProgress={completionProgress}
          movesCount={movesCount}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onReset={resetLevel}
          onHint={useHint}
          onOpenPalettes={() => setIsPaletteModalOpen(true)}
          onOpenLevels={() => setIsLevelModalOpen(true)}
        />

        {/* Main Gradient Grid View */}
        <View style={styles.content}>
          <Grid
            rows={currentLevel.rows}
            cols={currentLevel.cols}
            tiles={tiles}
            selectedTileIndex={selectedTileIndex}
            hintedIndex={hintedIndex}
            isSolved={isSolved}
            onTilePress={handleTilePress}
            onSwapTiles={swapTiles}
          />
        </View>

        {/* Solved Celebration Modal */}
        <CompletionModal
          visible={isSolved}
          level={currentLevel}
          tiles={tiles}
          movesCount={movesCount}
          onNextLevel={nextLevel}
          onReplay={resetLevel}
        />

        {/* Palette Selector Modal */}
        <PaletteModal
          visible={isPaletteModalOpen}
          selectedPaletteId={currentLevel.palette.id}
          onSelectPalette={selectPalette}
          onClose={() => setIsPaletteModalOpen(false)}
        />

        {/* Level Selector Modal */}
        <LevelModal
          visible={isLevelModalOpen}
          currentLevelIndex={levelIndex}
          onSelectLevel={selectLevel}
          onClose={() => setIsLevelModalOpen(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
