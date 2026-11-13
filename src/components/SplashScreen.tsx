import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from './Chrome';
import { ParticleCanvas } from './ParticleCanvas';
import { BRAND_LOGO_SRC, GAMES, type RoutePath } from '../lib/session';

const PRELOAD_IMAGES = [BRAND_LOGO_SRC, ...GAMES.map((g) => g.img)];

export function SplashScreen({ onNavigate }: { onNavigate: (to: RoutePath) => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let active = true;
    let count = 0;

    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      const done = () => {
        count += 1;
        if (active) setLoadedCount(count);
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    return () => {
      active = false;
    };
  }, []);

  const assetsReady = loadedCount >= PRELOAD_IMAGES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const cap = assetsReady ? 100 : 92;
        if (prev >= cap) return prev;
        return Math.min(cap, prev + Math.random() * 9 + 4);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [assetsReady]);

  useEffect(() => {
    if (progress < 100) return;
    setLeaving(true);
    const timer = setTimeout(() => {
      onNavigate('/games');
    }, 550);
    return () => clearTimeout(timer);
  }, [progress, onNavigate]);

  const handleEnterNow = () => {
    setLeaving(true);
    setTimeout(() => onNavigate('/games'), 220);
  };

  return (
    <main
      className={`page-bg screen-frame relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 transition-all duration-500 ${
        leaving ? 'scale-105 opacity-0 blur-sm' : 'opacity-100'
      }`}
    >
      <ParticleCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'linear-gradient(to top, #000, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, #000, transparent)',
          transform: 'perspective(420px) rotateX(62deg)',
          transformOrigin: 'bottom',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-glow-pulse pointer-events-none absolute h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />

        <div className="relative flex h-52 w-52 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border border-dashed border-primary/35 [animation-duration:22s]" />
          <span className="absolute inset-4 animate-spin rounded-[44%] border border-primary/45 [animation-direction:reverse] [animation-duration:11s]" />
          <span className="border-t-primary-glow absolute inset-0 animate-spin rounded-full border border-transparent [animation-duration:3s]" />
          <span className="absolute inset-8 rounded-full bg-primary/10 backdrop-blur-md" />
          <BrandLogo size={112} className="animate-fade-up relative" />
        </div>

        <h1 className="font-display neon-text animate-fade-up mt-9 text-[1.85rem] font-extrabold leading-none tracking-[0.16em] text-foreground">
          كراش <span className="text-red">CRASH</span>
        </h1>
        <p className="font-display mt-3 text-[11px] font-bold tracking-[0.35em] text-primary">
          PREMIUM ACCESS · V4
        </p>
      </div>

      <div className="relative z-10 mt-10 w-full max-w-xs">
        <div className="font-display mb-1.5 flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
          <span className="neon-text font-bold tabular-nums text-primary">
            {Math.floor(progress)}%
          </span>
          <span>LOADING</span>
        </div>

        <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-secondary/70">
          <div
            className="h-full rounded-full transition-[width] duration-150 ease-out"
            style={{
              width: `${progress}%`,
              backgroundImage: 'var(--gradient-primary)',
              boxShadow: 'var(--glow-md)',
            }}
          />
        </div>

        <p className="font-display mt-5 text-center text-[10px] tracking-[0.32em] text-muted-foreground/80">
          SECURE · ENCRYPTED · VIP
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleEnterNow}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold text-primary hover:bg-primary/20 active:scale-95"
          >
            <span>دخول مباشر</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </main>
  );
}
