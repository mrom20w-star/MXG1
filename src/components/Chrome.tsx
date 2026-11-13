import { useState, type ReactNode } from 'react';
import { ArrowRight, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { BRAND_LOGO_SRC, type PlatformId, type RoutePath } from '../lib/session';
import { isSoundMuted, toggleSoundMute } from '../lib/sound';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 40, className = '' }: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-full border border-primary/60 bg-background/80 shadow-[0_0_16px_oklch(0.7_0.2_250/70%)] ${className}`}
      >
        <ShieldCheck className="h-1/2 w-1/2 text-primary" />
      </div>
    );
  }

  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="كراش — CRASH"
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`rounded-full object-cover drop-shadow-[0_0_16px_oklch(0.7_0.2_250/90%)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

interface HeaderBarProps {
  title: string;
  right?: ReactNode;
  backTo?: RoutePath;
  onNavigate: (to: RoutePath) => void;
  showSoundToggle?: boolean;
}

export function HeaderBar({
  title,
  right,
  backTo,
  onNavigate,
  showSoundToggle = false,
}: HeaderBarProps) {
  const [muted, setMuted] = useState(isSoundMuted());

  const handleToggleSound = () => {
    setMuted(toggleSoundMute());
  };

  return (
    <header className="sticky top-0 z-40">
      <div
        className="glass flex items-center justify-between gap-4 border-x-0 border-t-0 px-4 py-2.5 sm:px-6"
        style={{
          backgroundImage:
            'linear-gradient(100deg, oklch(0.45 0.2 253 / 0.28), oklch(0.05 0.02 253 / 0.65) 55%, oklch(0.5 0.22 27 / 0.26))',
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate('/games')}
          className="flex min-h-[40px] shrink-0 items-center gap-2.5 text-right focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span className="relative flex items-center justify-center">
            <span className="animate-glow-pulse absolute h-8 w-8 rounded-full bg-primary/30 blur-lg" />
            <BrandLogo size={30} className="relative" />
          </span>
          <span className="font-display neon-text whitespace-nowrap text-sm font-extrabold tracking-[0.12em] text-foreground">
            كراش <span className="text-red">CRASH</span>
          </span>
        </button>

        <h1 className="hidden truncate text-sm font-bold text-foreground sm:block">{title}</h1>

        <div className="flex shrink-0 items-center gap-2">
          {showSoundToggle && (
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/70 text-muted-foreground hover:border-primary/60 hover:text-primary"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
          {right && <div className="shrink-0">{right}</div>}
          {backTo && (
            <button
              type="button"
              onClick={() => onNavigate(backTo)}
              aria-label="رجوع"
              className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary/50 bg-primary/15 px-3 text-xs font-extrabold text-primary hover:bg-primary/25 active:scale-95"
            >
              <span>رجوع</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="block h-[2px] w-full"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent, oklch(0.65 0.26 253.5), oklch(0.6 0.22 27), transparent)',
        }}
      />
    </header>
  );
}

export function PlatformEmblem({ platform, size = 64 }: { platform: PlatformId; size?: number }) {
  if (platform === '1xbet') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_16px_oklch(0.65_0.22_245/60%)]"
      >
        <rect
          x="4"
          y="4"
          width="64"
          height="64"
          rx="18"
          fill="url(#oneXGrad)"
          stroke="oklch(0.7 0.22 245 / 0.75)"
          strokeWidth="2"
        />
        <path
          d="M19 26L25 22V50"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 25L53 47M53 25L34 47"
          stroke="#38BDF8"
          strokeWidth="5.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="oneXGrad" x1="6" y1="6" x2="66" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0C3B75" />
            <stop offset="1" stopColor="#071630" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (platform === 'melbet') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_16px_oklch(0.78_0.18_85/55%)]"
      >
        <rect
          x="4"
          y="4"
          width="64"
          height="64"
          rx="18"
          fill="url(#melbetGrad)"
          stroke="oklch(0.8 0.18 85 / 0.75)"
          strokeWidth="2"
        />
        <path
          d="M17 48V24L27 37L37 24V48"
          stroke="#FFFFFF"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 24H51.5C54.8 24 57 26 57 29.2C57 31.8 55.3 33.6 52.8 34.2C55.8 34.8 57.5 36.8 57.5 39.8C57.5 43.4 54.8 46 51 46H44V24Z"
          stroke="#FACC15"
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="melbetGrad" x1="6" y1="6" x2="66" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2A2008" />
            <stop offset="1" stopColor="#120E04" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_16px_oklch(0.68_0.2_155/55%)]"
    >
      <rect
        x="4"
        y="4"
        width="64"
        height="64"
        rx="18"
        fill="url(#spinGrad)"
        stroke="oklch(0.72 0.2 155 / 0.75)"
        strokeWidth="2"
      />
      <path
        d="M47 24C44.2 21.5 40.3 20 36 20C27.2 20 20 27.2 20 36C20 44.8 27.2 52 36 52C43.2 52 49.3 47.2 51.3 40.6"
        stroke="#4ADE80"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M39 27L31 37H38L34 46L44 35H37L39 27Z"
        fill="#FFFFFF"
      />
      <defs>
        <linearGradient id="spinGrad" x1="6" y1="6" x2="66" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D3B2C" />
          <stop offset="1" stopColor="#061914" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GemDiamondSvg({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,12 46,12 58,26 32,54 6,26" fill="url(#gemFill)" stroke="#7DD3FC" strokeWidth="2.5" />
      <polygon points="18,12 32,26 46,12" fill="#BAE6FD" fillOpacity="0.45" />
      <polygon points="6,26 32,26 32,54" fill="#0284C7" fillOpacity="0.55" />
      <polygon points="58,26 32,26 32,54" fill="#38BDF8" fillOpacity="0.35" />
      <line x1="6" y1="26" x2="58" y2="26" stroke="#E0F2FE" strokeWidth="1.8" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="gemFill" x1="12" y1="12" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ThimbleCupSvg({ className = 'h-full w-full', active = false }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cupBody" x1="25" y1="20" x2="95" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#475569" />
          <stop offset="0.45" stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="cupRim" x1="20" y1="95" x2="100" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#60A5FA' : '#64748B'} />
          <stop offset="0.5" stopColor={active ? '#93C5FD' : '#CBD5E1'} />
          <stop offset="1" stopColor={active ? '#3B82F6' : '#475569'} />
        </linearGradient>
      </defs>
      <path
        d="M36 22C36 17.5817 39.5817 14 44 14H76C80.4183 14 84 17.5817 84 22L94 94H26L36 22Z"
        fill="url(#cupBody)"
        stroke={active ? '#60A5FA' : '#64748B'}
        strokeWidth="2.5"
      />
      <ellipse cx="60" cy="18" rx="20" ry="4.5" fill="#334155" stroke={active ? '#93C5FD' : '#94A3B8'} strokeWidth="1.5" />
      <rect x="21" y="92" width="78" height="10" rx="5" fill="url(#cupRim)" />
      <path d="M46 34L42 80" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="56" r="7" fill={active ? '#3B82F6' : '#334155'} stroke={active ? '#BAE6FD' : '#64748B'} strokeWidth="2" />
    </svg>
  );
}

export function ThimbleBallSvg({ className = 'h-full w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="redOrb" cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="28" fill="url(#redOrb)" stroke="#FCA5A5" strokeWidth="2" />
      <ellipse cx="31" cy="29" rx="7" ry="4" transform="rotate(-25 31 29)" fill="#FFFFFF" fillOpacity="0.65" />
    </svg>
  );
}

export function TreasureChestSvg({ className = 'h-14 w-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLid" x1="12" y1="16" x2="68" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="chestBox" x1="14" y1="40" x2="66" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E3A8A" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <path d="M14 38C14 25 24 18 40 18C56 18 66 25 66 38H14Z" fill="url(#goldLid)" stroke="#FEF08A" strokeWidth="2" />
      <rect x="14" y="38" width="52" height="26" rx="5" fill="url(#chestBox)" stroke="#60A5FA" strokeWidth="2" />
      <rect x="14" y="36" width="52" height="6" rx="2" fill="#FBBF24" />
      <rect x="34" y="34" width="12" height="16" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="40" cy="42" r="2.2" fill="#0F172A" />
    </svg>
  );
}
