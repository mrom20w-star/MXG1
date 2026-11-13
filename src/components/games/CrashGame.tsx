import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { GameShell } from './GameShell';
import type { RoutePath } from '../../lib/session';
import { playLockChime, playResetClick, playRevealChime } from '../../lib/sound';

function generateCrashTarget(): number {
  const roll = Math.random();
  if (roll < 0.55) {
    return Math.round((1.25 + Math.random() * 1.95) * 100) / 100;
  }
  if (roll < 0.85) {
    return Math.round((3.2 + Math.random() * 4.8) * 100) / 100;
  }
  return Math.round((8 + Math.random() * 14) * 100) / 100;
}

export function CrashGame({ onNavigate }: { onNavigate: (to: RoutePath) => void }) {
  const [multiplier, setMultiplier] = useState(1);
  const [target, setTarget] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleStart = () => {
    if (scanning) return;
    playRevealChime();
    const nextTarget = generateCrashTarget();
    setTarget(nextTarget);
    setMultiplier(1);
    setScanning(true);

    const startTime = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setMultiplier(1 + (nextTarget - 1) * eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setScanning(false);
        setHistory((prev) => [nextTarget, ...prev].slice(0, 6));
        playLockChime();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const handleReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    playResetClick();
    setScanning(false);
    setMultiplier(1);
    setTarget(0);
  };

  return (
    <GameShell
      topTitle="كاشف الطيارة"
      gameTitle="Crash"
      liveGameLabel="Crash"
      onNavigate={onNavigate}
    >
      <div className="font-display flex items-center gap-1.5 text-xs font-bold tracking-[0.22em] text-red">
        <Zap className="h-3.5 w-3.5" />
        <span>LIVE SIGNAL</span>
      </div>

      <div
        dir="ltr"
        className={`glass relative mt-4 h-[230px] w-full overflow-hidden rounded-[24px] transition-all duration-500 ${
          scanning ? 'animate-glow-pulse' : ''
        }`}
        style={{
          boxShadow: scanning
            ? '0 0 0 1px oklch(0.68 0.26 253.5 / 0.6), 0 0 46px oklch(0.65 0.26 253.5 / 0.45), inset 0 0 40px oklch(0.65 0.26 253.5 / 0.18)'
            : '0 0 0 1px oklch(0.68 0.26 253.5 / 0.25), 0 10px 40px oklch(0.02 0.01 253 / 0.6)',
          backgroundImage:
            'linear-gradient(150deg, oklch(0.45 0.2 253 / 0.24), transparent 55%, oklch(0.5 0.22 27 / 0.22))',
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.68 0.26 253.5 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.68 0.26 253.5 / 0.3) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-display neon-text text-5xl font-extrabold tabular-nums transition-colors duration-300 sm:text-6xl ${
              scanning ? 'text-primary' : target ? 'text-success' : 'text-foreground'
            }`}
          >
            x{multiplier.toFixed(2)}
          </span>
          <span className="font-display mt-2 text-[11px] font-bold tracking-[0.28em] text-muted-foreground">
            {scanning ? 'SCANNING...' : target ? 'SIGNAL LOCKED' : 'READY'}
          </span>
        </div>
      </div>

      <div dir="ltr" className="mt-3 grid w-full grid-cols-3 gap-2.5">
        <div className="glass rounded-2xl px-2 py-2.5 text-center">
          <p className="font-display text-sm font-extrabold tabular-nums text-red">
            {target ? `x${target.toFixed(2)}` : '—'}
          </p>
          <p className="font-display mt-0.5 text-[10px] tracking-[0.18em] text-muted-foreground">
            TARGET
          </p>
        </div>
        <div className="glass rounded-2xl px-2 py-2.5 text-center">
          <p className="font-display text-sm font-extrabold tabular-nums text-success">96.4%</p>
          <p className="font-display mt-0.5 text-[10px] tracking-[0.18em] text-muted-foreground">
            ACCURACY
          </p>
        </div>
        <div className="glass rounded-2xl px-2 py-2.5 text-center">
          <p className="font-display text-sm font-extrabold text-primary">
            {scanning ? 'LIVE' : target ? 'LOCKED' : 'IDLE'}
          </p>
          <p className="font-display mt-0.5 text-[10px] tracking-[0.18em] text-muted-foreground">
            STATUS
          </p>
        </div>
      </div>

      <div dir="ltr" className="mt-3 flex w-full flex-wrap items-center gap-2 text-xs">
        <span className="font-display text-[10px] font-bold tracking-widest text-muted-foreground">
          HISTORY
        </span>
        {history.length === 0 ? (
          <span className="text-xs text-muted-foreground">لا توجد نتائج بعد</span>
        ) : (
          history.map((val, idx) => (
            <span
              key={`${val}-${idx}`}
              className={`font-display font-bold tabular-nums ${
                val >= 3 ? 'text-primary' : 'text-red'
              }`}
            >
              x{val.toFixed(2)}
              {idx < history.length - 1 && (
                <span aria-hidden="true" className="ml-2 text-muted-foreground/50">
                  ·
                </span>
              )}
            </span>
          ))
        )}
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={scanning}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-primary py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-md)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>بدأ</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-red py-3.5 text-sm font-extrabold text-primary-foreground shadow-[0_0_28px_oklch(0.6_0.22_27/45%)] hover:scale-[1.02] active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>إعادة بدأ</span>
        </button>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        <span>إشارة مشفّرة خاصة بأعضاء كراش CRASH</span>
      </p>
    </GameShell>
  );
}
