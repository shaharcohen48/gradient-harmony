import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LevelConfig, TileData } from '../types/game';

interface CompletionModalProps {
  visible: boolean;
  level: LevelConfig;
  tiles: TileData[];
  movesCount: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  level,
  movesCount,
  onNextLevel,
  onReplay,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Subtle glowing icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={32} color="#00F0FF" />
          </View>

          <Text style={styles.title}>Harmony Restored</Text>
          <Text style={styles.subtitle}>
            Level {level.id} — {level.name}
          </Text>

          <Text style={styles.quote}>
            "Order returns to color. The spectrum is in perfect balance."
          </Text>

          {/* Palette info */}
          <View style={styles.infoBadge}>
            <Text style={styles.paletteText}>
              Palette: {level.palette.name} • {movesCount} harmonious moves
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onReplay}>
              <Ionicons name="refresh-outline" size={18} color="#A0AEC0" />
              <Text style={styles.secondaryButtonText}>Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={onNextLevel}>
              <Text style={styles.primaryButtonText}>Next Spectrum</Text>
              <Ionicons name="arrow-forward" size={18} color="#0F141E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#161B26',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#00F0FF',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  quote: {
    fontSize: 13,
    color: '#8E9BAE',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  infoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 18,
    marginBottom: 24,
  },
  paletteText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#00F0FF',
    gap: 6,
  },
  primaryButtonText: {
    color: '#0F141E',
    fontSize: 14,
    fontWeight: '700',
  },
});

