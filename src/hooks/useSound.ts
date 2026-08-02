"use client";

import { useUserStore } from "@/lib/store/userStore";

/**
 * Lightweight sound effects using Web Audio API.
 * No external assets needed — synthesized tones.
 */
class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled = true;

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  private ensureCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(freq: number, durationMs: number, type: OscillatorType = "sine", volume = 0.15) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  }

  click() {
    this.tone(800, 60, "sine", 0.08);
  }

  correct() {
    this.tone(660, 80, "sine", 0.12);
    setTimeout(() => this.tone(880, 100, "sine", 0.12), 80);
  }

  wrong() {
    this.tone(220, 150, "sawtooth", 0.1);
    setTimeout(() => this.tone(180, 200, "sawtooth", 0.1), 100);
  }

  levelUp() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.tone(f, 200, "triangle", 0.15), i * 100);
    });
  }

  coin() {
    this.tone(1200, 50, "sine", 0.1);
    setTimeout(() => this.tone(1600, 80, "sine", 0.1), 50);
  }
}

let _sfx: SoundFX | null = null;
function getSFX() {
  if (!_sfx) _sfx = new SoundFX();
  return _sfx;
}

export function useSound() {
  const soundEnabled = useUserStore((s) => s.user?.soundEnabled ?? true);

  // Sync enabled state
  if (typeof window !== "undefined") {
    getSFX().setEnabled(soundEnabled);
  }

  return {
    playClick: () => getSFX().click(),
    playCorrect: () => getSFX().correct(),
    playWrong: () => getSFX().wrong(),
    playLevelUp: () => getSFX().levelUp(),
    playCoin: () => getSFX().coin(),
  };
}
