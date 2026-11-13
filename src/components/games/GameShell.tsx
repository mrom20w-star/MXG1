import type { ReactNode } from 'react';
import { BrandLogo, HeaderBar } from '../Chrome';
import { LiveWins } from '../LiveWins';
import { ParticleCanvas } from '../ParticleCanvas';
import { PLATFORMS, getActivePlatform, getStoredUserId, type RoutePath } from '../../lib/session';

interface GameShellProps {
  topTitle: string;
  gameTitle: string;
  liveGameLabel: string;
  onNavigate: (to: RoutePath) => void;
  children: ReactNode;
}

export function GameShell({
  topTitle,
  gameTitle,
  liveGameLabel,
  onNavigate,
  children,
}: GameShellProps) {
  const userId = getStoredUserId() || 'GUEST';
  const platformName = PLATFORMS[getActivePlatform()].name;

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-14">
      <ParticleCanvas />

      <div className="relative z-10">
        <HeaderBar
          title={topTitle}
          backTo="/games"
          onNavigate={onNavigate}
          showSoundToggle
          right={
            <span className="font-display block max-w-[120px] truncate rounded-lg border border-border bg-secondary/70 px-2.5 py-1.5 text-[11px] font-bold tabular-nums text-muted-foreground">
              ID: {userId}
            </span>
          }
        />

        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-glow-pulse absolute h-24 w-24 rounded-full bg-primary/25 blur-3xl" />
              <span className="absolute h-20 w-20 rounded-full bg-red/20 blur-2xl" />
              <BrandLogo size={72} className="relative" />
            </div>

            <h1 className="font-display neon-text mt-3 text-center text-xl font-extrabold text-foreground sm:text-2xl">
              <span className="text-primary">{platformName}</span>
              <span className="mx-2 text-red">×</span>
              <span>{gameTitle}</span>
            </h1>
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="mx-auto flex w-full max-w-[460px] flex-col items-center">
              {children}
            </div>

            <div className="mx-auto w-full max-w-[460px] lg:sticky lg:top-20">
              <LiveWins game={liveGameLabel} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
