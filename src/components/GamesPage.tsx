import { useState } from 'react';
import { Gamepad2, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo, HeaderBar } from './Chrome';
import { ParticleCanvas } from './ParticleCanvas';
import {
  GAMES,
  PLATFORMS,
  getStoredPlatform,
  getStoredUserId,
  isVipActivated,
  setStoredGame,
  type GameInfo,
  type RoutePath,
} from '../lib/session';
import { playRevealChime } from '../lib/sound';

const ACCENT_MAP = {
  red: {
    tagColor: 'text-red',
    ring: 'group-hover:shadow-[0_0_0_1px_var(--red),0_0_28px_oklch(0.6_0.22_27/45%)]',
    bgGrad: 'linear-gradient(125deg, oklch(0.5 0.22 27 / 0.26), transparent 62%)',
  },
  blue: {
    tagColor: 'text-primary',
    ring: 'group-hover:shadow-[0_0_0_1px_var(--primary),0_0_28px_oklch(0.65_0.26_253.5/45%)]',
    bgGrad: 'linear-gradient(125deg, oklch(0.45 0.2 253 / 0.28), transparent 62%)',
  },
} as const;

export function GamesPage({ onNavigate }: { onNavigate: (to: RoutePath) => void }) {
  const activePlatformId = getStoredPlatform();
  const userId = getStoredUserId();
  const activated = isVipActivated();

  const handleSelectGame = (game: GameInfo) => {
    playRevealChime();
    setStoredGame(game.id);
    if (activated && activePlatformId && userId) {
      onNavigate(game.route);
    } else {
      onNavigate('/conditions');
    }
  };

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-16">
      <ParticleCanvas />

      <div className="relative z-10">
        <HeaderBar
          title="الألعاب"
          onNavigate={onNavigate}
          right={
            <button
              type="button"
              onClick={() => onNavigate('/conditions')}
              className="flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary/45 bg-primary/15 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/25 active:scale-95"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{activated && activePlatformId ? PLATFORMS[activePlatformId].name : 'تفعيل VIP'}</span>
            </button>
          }
        />

        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
          <section className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-glow-pulse absolute h-28 w-28 rounded-full bg-primary/25 blur-3xl" />
              <span className="absolute h-28 w-28 rounded-full bg-red/15 blur-2xl" />
              <BrandLogo size={84} className="relative" />
            </div>

            <h2 className="neon-text mt-4 flex items-center justify-center gap-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span>أداة كشف لعبة الطيارة</span>
            </h2>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
              اضغط «العب الآن» لتفعيل حسابك على منصة 1xBet أو MELBET أو Spinbetter باستخدام البروموكود MXG1
            </p>

            {activated && activePlatformId && userId && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-success">حساب VIP مفعل</span>
                <span aria-hidden="true">·</span>
                <span>المنصة: {PLATFORMS[activePlatformId].name}</span>
                <span aria-hidden="true">·</span>
                <span className="font-display tabular-nums">ID: {userId}</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/conditions')}
                  className="font-bold text-primary underline-offset-4 hover:underline"
                >
                  تعديل البيانات
                </button>
              </div>
            )}
          </section>

          <section className="mx-auto mt-8 max-w-md">
            {GAMES.map((game, idx) => (
              <GameCard key={game.id} game={game} index={idx} onSelect={handleSelectGame} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}

function GameCard({
  game,
  index,
  onSelect,
}: {
  game: GameInfo;
  index: number;
  onSelect: (game: GameInfo) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const style = ACCENT_MAP[game.accent];

  return (
    <div
      className="animate-fade-up flex flex-col gap-3"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <article
        onClick={() => onSelect(game)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(game);
          }
        }}
        className={`group glass relative h-[185px] w-full cursor-pointer overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 ${style.ring}`}
        style={{ backgroundImage: style.bgGrad }}
      >
        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between text-[11px] font-extrabold">
          <span className={`font-display tracking-[0.18em] ${style.tagColor}`}>{game.tag}</span>
          <span className="font-display tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {imgFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-secondary/40">
            <Sparkles className="h-10 w-10 text-primary/60" />
          </div>
        ) : (
          <img
            src={game.img}
            alt={game.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
          style={{
            background:
              'linear-gradient(to top, oklch(0.03 0.012 253 / 0.96) 15%, oklch(0.03 0.012 253 / 0.55) 55%, transparent)',
          }}
        />

        <div className="absolute inset-x-0 bottom-3 z-10 px-4 text-center">
          <h3 className="font-display neon-text text-lg font-extrabold text-foreground">
            {game.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{game.ar}</p>
        </div>
      </article>

      <button
        type="button"
        onClick={() => onSelect(game)}
        className="gradient-primary flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-md)] hover:scale-[1.02] active:scale-[0.98]"
      >
        <Play className="h-4 w-4 fill-current" />
        <span>العب الآن</span>
      </button>
    </div>
  );
}
