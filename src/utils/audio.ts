import { Platform } from 'react-native';

// Pentatonic scale frequencies (C, D, E, G, A across 3 octaves)
const PENTATONIC_SCALE = [
  130.81, 146.83, 164.81, 196.00, 220.00, // Octave 3
  261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
  523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
  1046.50, 1174.66, 1318.51, 1567.98, // Octave 6
];

// Soothing ambient chord progressions (frequencies)
const AMBIENT_CHORDS = [
  [130.81, 196.00, 329.63, 392.00], // C maj9
  [146.83, 220.00, 349.23, 440.00], // D min9
  [164.81, 246.94, 392.00, 493.88], // E min7
  [174.61, 261.63, 329.63, 440.00], // F maj7
  [196.00, 293.66, 392.00, 493.88], // G sus
  [220.00, 261.63, 329.63, 523.25], // A min7
];

class AudioEngine {
  private ctx: any = null;
  private isMuted: boolean = false;
  private isMusicEnabled: boolean = true;
  private ambientGain: any = null;
  private ambientOscillators: any[] = [];
  private ambientTimer: any = null;
  private chordIndex: number = 0;
  private isInitialized: boolean = false;

  private initContext() {
    if (this.ctx) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.isInitialized = true;
      }
    }
  }

  // Resume AudioContext on user interaction
  public resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientMusic();
    } else if (this.isMusicEnabled) {
      this.startAmbientMusic();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a soft marimba / bell chime.
   * Pitch is calculated from grid coordinates (row & column) to create spatial music.
   */
  public playTileChime(row: number, col: number, maxRows: number = 6, maxCols: number = 6) {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const noteIndex = (row * 3 + col) % PENTATONIC_SCALE.length;
      const freq = PENTATONIC_SCALE[noteIndex] || 440;

      const now = this.ctx.currentTime;

      // Master note gain
      const gainNode = this.ctx.createGain();
      gainNode.connect(this.ctx.destination);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      // Fundamental oscillator (warm sine)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Harmonic overtone oscillator (bell-like marimba overtone)
      const osc2 = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      osc2.type = 'sine';
      // Harmonic ratio: 2.75x or 3x for marimba/wood chime timbre
      osc2.frequency.setValueAtTime(freq * 2.756, now);
      overtoneGain.gain.setValueAtTime(0.06, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(overtoneGain);
      overtoneGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 0.7);
    } catch {
      // Audio node cleanup safeguard
    }
  }

  /**
   * Soft pickup click sound
   */
  public playTilePickup() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * Soft swap drop sound
   */
  public playTileDrop() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  /**
   * Harmonious arpeggio chord when puzzle is completed
   */
  public playCompletionChord() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 2.1);
      });
    } catch {}
  }

  /**
   * Ambient generative drone music
   */
  public startAmbientMusic() {
    if (this.isMuted || !this.isMusicEnabled) return;
    this.resume();
    if (!this.ctx) return;

    this.stopAmbientMusic();

    const playNextChord = () => {
      if (this.isMuted || !this.ctx) return;

      const chord = AMBIENT_CHORDS[this.chordIndex % AMBIENT_CHORDS.length];
      this.chordIndex++;

      const now = this.ctx.currentTime;
      const duration = 7.0; // 7 seconds per ambient chord
      const newOscs: any[] = [];

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * 0.5, now); // low octave drone

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320 + i * 40, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 2.5);
        gain.gain.setValueAtTime(0.025, now + duration - 2.5);
        gain.gain.linearRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
        newOscs.push(osc);
      });

      this.ambientOscillators = newOscs;
      this.ambientTimer = setTimeout(playNextChord, (duration - 1.5) * 1000);
    };

    playNextChord();
  }

  public stopAmbientMusic() {
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch {}
    });
    this.ambientOscillators = [];
  }
}

export const soundManager = new AudioEngine();

