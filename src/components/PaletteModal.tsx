import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaletteTheme } from '../types/game';
import { PALETTES } from '../constants/palettes';

interface PaletteModalProps {
  visible: boolean;
  selectedPaletteId: string;
  onSelectPalette: (palette: PaletteTheme) => void;
  onClose: () => void;
}

export const PaletteModal: React.FC<PaletteModalProps> = ({
  visible,
  selectedPaletteId,
  onSelectPalette,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Color Palettes</Text>
              <Text style={styles.subtitle}>Select a mood for your gradient</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* Palette List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {PALETTES.map(p => {
              const isSelected = p.id === selectedPaletteId;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.paletteCard, isSelected && styles.selectedPaletteCard]}
                  onPress={() => {
                    onSelectPalette(p);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  {/* Swatches preview (4 corners) */}
                  <View style={styles.swatchGrid}>
                    <View
                      style={[styles.cornerSquare, { backgroundColor: p.corners[0] }]}
                    />
                    <View
                      style={[styles.cornerSquare, { backgroundColor: p.corners[1] }]}
                    />
                    <View
                      style={[styles.cornerSquare, { backgroundColor: p.corners[2] }]}
                    />
                    <View
                      style={[styles.cornerSquare, { backgroundColor: p.corners[3] }]}
                    />
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.paletteName}>{p.name}</Text>
                    <Text style={styles.paletteSubtitle}>{p.subtitle}</Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color="#00F0FF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#141A25',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#8E9BAE',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollList: {
    maxHeight: 480,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 16,
  },
  paletteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  selectedPaletteCard: {
    borderColor: '#00F0FF',
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
  },
  swatchGrid: {
    width: 44,
    height: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 14,
  },
  cornerSquare: {
    width: 22,
    height: 22,
  },
  infoCol: {
    flex: 1,
  },
  paletteName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paletteSubtitle: {
    fontSize: 11,
    color: '#7E8B9B',
    marginTop: 2,
  },
});

