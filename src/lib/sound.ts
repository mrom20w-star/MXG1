let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined' || muted) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  return muted;
}

export function toggleSoundMute(): boolean {
  muted = !muted;
  return muted;
}

export function playTone(freq: number, durationMs = 90, type: OscillatorType = 'sine', gainVal = 0.045): void {
  const ctx = getCtx();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Ignore audio context restriction errors
  }
}

export function playRevealChime(): void {
  playTone(540, 80, 'triangle', 0.04);
  setTimeout(() => playTone(760, 110, 'sine', 0.045), 60);
}

export function playLockChime(): void {
  playTone(620, 90, 'sine', 0.045);
  setTimeout(() => playTone(880, 140, 'triangle', 0.05), 80);
}

export function playResetClick(): void {
  playTone(320, 70, 'sine', 0.035);
}
