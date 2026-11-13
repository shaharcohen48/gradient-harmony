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
import { LEVELS } from '../constants/levels';

interface LevelModalProps {
  visible: boolean;
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({
  visible,
  currentLevelIndex,
  onSelectLevel,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Harmonies</Text>
              <Text style={styles.subtitle}>Choose your puzzle challenge</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* Level Grid / List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {LEVELS.map((lvl, idx) => {
              const isSelected = idx === currentLevelIndex;
              return (
                <TouchableOpacity
                  key={lvl.id}
                  style={[styles.levelCard, isSelected && styles.selectedLevelCard]}
                  onPress={() => {
                    onSelectLevel(idx);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.levelNumberCircle}>
                    <Text style={styles.levelNumberText}>{lvl.id}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.levelName}>{lvl.name}</Text>
                    <Text style={styles.levelDescription}>
                      {lvl.rows}×{lvl.cols} • {lvl.palette.name}
                    </Text>
                  </View>

                  {/* Corner previews */}
                  <View style={styles.miniSwatch}>
                    <View
                      style={[
                        styles.miniSwatchQuarter,
                        { backgroundColor: lvl.palette.corners[0] },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniSwatchQuarter,
                        { backgroundColor: lvl.palette.corners[1] },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniSwatchQuarter,
                        { backgroundColor: lvl.palette.corners[2] },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniSwatchQuarter,
                        { backgroundColor: lvl.palette.corners[3] },
                      ]}
                    />
                  </View>
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
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  selectedLevelCard: {
    borderColor: '#00F0FF',
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
  },
  levelNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  levelNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  infoCol: {
    flex: 1,
  },
  levelName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  levelDescription: {
    fontSize: 11,
    color: '#7E8B9B',
    marginTop: 2,
  },
  miniSwatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniSwatchQuarter: {
    width: 14,
    height: 14,
  },
});

