# Gradient Harmony

A tranquil, minimalist puzzle game built with Expo and React Native where players restore order to scrambled color spectrums.

Inspired by color theory and meditative puzzle mechanics, **Gradient Harmony** features no timers, no scores, and no "game over" screens. Satisfaction comes from visual balance, smooth 60fps animations, soothing haptic feedback, and procedural generative audio.

---

## Features

- **2D Bilinear Color Mathematics**: Gamma-corrected bilinear interpolation across four pinned corner anchors, creating rich, luminous color transitions without muddy midtones.
- **Corner Anchors**: The four corner tiles are permanently locked in place with debossed indicator pins, providing the spatial grounding for the spectrum.
- **Dual Input Modality**:
  - **Drag & Drop**: Gesture-driven tile dragging with dynamic elevation and soft drop shadows.
  - **Tap-to-Swap**: Effortless single-tap selection and swap for precision touch.
- **Generative Audio & Chimes**:
  - Generative ambient synthesizer drone chords cycling through peaceful harmonic progressions.
  - Localized pentatonic piano and marimba chimes played whenever a tile snaps into its correct coordinates.
- **Tactile Haptic Feedback**: Subtle ticks on tile pickup, snap, and level completion via `expo-haptics`.
- **Curated Palette Library**: 12 handcrafted color palettes including *Ocean Depths*, *Sunset Warmth*, *Aurora Borealis*, *Pastel Dreams*, *Matcha Latte*, *Nordic Frost*, and *Cosmic Nebula*.
- **Level Progression**: 16 progressive spectrum puzzles from gentle 4×4 grids up to expansive 8×8 master meditations.
- **Serene Aesthetics**: Deep dark-mode UI with customizable palettes, sound mute controls, and gentle hints.

---

## Tech Stack

- **Framework**: [Expo SDK 58](https://expo.dev/) (React Native 0.88 + React 19)
- **Animations**: `react-native-reanimated`
- **Gestures**: `react-native-gesture-handler`
- **Haptics**: `expo-haptics`
- **Audio Engine**: Web Audio API procedural synthesizer (zero-latency ambient chords and marimba harmonics)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Type Safety**: TypeScript 6

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun

### Installation
```bash
npm install
```

### Running the App

#### Web
```bash
npm run web
# or npx expo start --web
```

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Expo Go
```bash
npx expo start
```
Scan the QR code with your camera (iOS) or the Expo Go app (Android).

---

## Project Structure

```
├── assets/                  # Icons, splash screen, and logos
├── src/
│   ├── components/
│   │   ├── CompletionModal.tsx # Celebration overlay
│   │   ├── Grid.tsx            # Tile grid layout & gesture responder
│   │   ├── Header.tsx          # Minimalist navigation & status controls
│   │   ├── LevelModal.tsx      # Level selection modal
│   │   ├── PaletteModal.tsx    # Color palette theme selector
│   │   └── Tile.tsx            # Reanimated draggable tile with locked anchor
│   ├── constants/
│   │   ├── levels.ts           # 16 progressive puzzle levels
│   │   └── palettes.ts         # Handcrafted color themes
│   ├── hooks/
│   │   └── useGame.ts          # State reducer, swap logic, and win verification
│   ├── types/
│   │   └── game.ts             # TypeScript interfaces and data models
│   └── utils/
│       ├── audio.ts            # Procedural ambient chords & marimba chime synth
│       ├── color.ts            # Bilinear interpolation & gamma-corrected blend
│       └── haptics.ts          # Safe cross-platform haptic triggers
├── App.tsx                  # Root application entry
├── app.json                 # Expo configuration
├── package.json             # Project dependencies & scripts
└── tsconfig.json            # TypeScript configuration
```

---

## License
MIT
