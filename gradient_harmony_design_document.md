# Game: Gradient Harmony

## Concept Overview
Gradient Harmony is a puzzle-lite game where players restore order to a scrambled color gradient. There are no timers, no scores, and no "game over" screens. The satisfaction comes from visual organization and soothing tactile feedback.

## Core Mechanics
*   **The Grid:** The screen displays a grid (e.g., 4x4 up to 8x8) of colored tiles.
*   **The Goal:** The corner tiles are locked in place. The player must drag and drop the remaining tiles to create a seamless transition of color (a gradient) between the corners.
*   **Interaction:** When a player picks up a tile, it scales up slightly and drops a soft shadow. When dropped into the correct spot, a gentle haptic "tick" occurs, and the tile snaps into place.

## Aesthetic & Audio
*   **Visuals:** Minimalist UI. The entire screen space is dedicated to the color palettes. Colors are curated to be easy on the eyes (pastels, deep ocean hues, sunset warm tones).
*   **Audio:** Ambient, generative music. Placing a tile correctly plays a soft, localized piano note or marimba chime.

## React Native Tech Stack
*   **UI/Animations:** `react-native-reanimated` for smooth 60fps scaling and snapping animations.
*   **Drag & Drop:** `react-native-gesture-handler` to track finger movements across the grid without blocking the JS thread.
*   **Haptics:** `expo-haptics` (or `react-native-haptic-feedback`) to trigger light vibrations when tiles are picked up and placed.
*   **State Management:** Standard React `useState` or `useReducer` is sufficient for tracking tile positions in the grid array.