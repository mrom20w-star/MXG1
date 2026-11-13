import { useEffect, useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';

const USERNAMES = [
  'User***k',
  'Player***9',
  'Ahmed***3',
  'Mo***7z',
  'Sara***1',
  'Khaled***5',
  'Vip***x',
  'Omar***2',
];

const AMOUNTS = [
  '$150',
  '500 EGP',
  '$1,240',
  '2,300 EGP',
  '$85',
  '9,700 EGP',
  '$420',
  '1,150 EGP',
];

const MULTIPLIERS = ['x2.14', 'x5.60', 'x1.92', 'x11.4', 'x3.08', 'x7.75', 'x24.1', 'x1.55'];

const randBetween = (min: number, max: number) => min + Math.random() * (max - min);

export function LiveWins({
  title = 'LIVE DASHBOARD WIN',
  game = 'AI Script',
}: {
  title?: string;
  game?: string;
}) {
  const [stats, setStats] = useState({ players: 1284, top: 9700, rate: 96.4 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStats({
        players: Math.round(randBetween(900, 2400)),
        top: Math.round(randBetween(3500, 18000) / 50) * 50,
        rate: Math.round(randBetween(92, 98.9) * 10) / 10,
      });
      setTick((prev) => prev + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const rows = Array.from({ length: 8 }, (_, idx) => ({
    name: USERNAMES[(idx + tick) % USERNAMES.length],
    amount: AMOUNTS[(idx + tick * 3) % AMOUNTS.length],
    mult: MULTIPLIERS[(idx + tick * 5) % MULTIPLIERS.length],
    time: `${((idx + tick) % 9) + 3}s`,
    hot: (idx + tick) % 3 === 0,
  }));

  const loopRows = [...rows, ...rows];

  return (
    <section
      className="glass overflow-hidden rounded-[22px] p-4"
      style={{
        backgroundImage:
          'linear-gradient(140deg, oklch(0.45 0.2 253 / 0.22), transparent 55%, oklch(0.5 0.22 27 / 0.2))',
      }}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-xs font-extrabold tracking-[0.16em] text-foreground">
          {title}
        </h2>
        <span className="font-display text-[11px] font-bold tracking-wider text-primary">
          {game}
        </span>
      </header>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-background/55 px-2 py-2.5 text-center">
          <Activity className="mx-auto h-3.5 w-3.5 text-primary" />
          <p className="mt-1 text-xs font-extrabold tabular-nums text-foreground">
            {stats.players.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">لاعب الآن</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/55 px-2 py-2.5 text-center">
          <TrendingUp className="mx-auto h-3.5 w-3.5 text-red" />
          <p className="mt-1 text-xs font-extrabold tabular-nums text-foreground">
            ${stats.top.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">أعلى ربح</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/55 px-2 py-2.5 text-center">
          <TrendingUp className="mx-auto h-3.5 w-3.5 text-success" />
          <p className="mt-1 text-xs font-extrabold tabular-nums text-foreground">
            {stats.rate.toFixed(1)}%
          </p>
          <p className="text-[10px] text-muted-foreground">نسبة الفوز</p>
        </div>
      </div>

      <div className="relative h-52 overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_14%,#000_86%,transparent)]">
        <ul className="animate-feed space-y-2">
          {loopRows.map((item, idx) => (
            <li
              key={`${item.name}-${idx}`}
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/50 px-3 py-2 backdrop-blur"
            >
              <span
                className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-primary-foreground"
                style={{
                  backgroundImage: item.hot
                    ? 'linear-gradient(135deg, oklch(0.6 0.22 27), oklch(0.72 0.18 40))'
                    : 'var(--gradient-primary)',
                }}
              >
                {item.name.slice(0, 2)}
              </span>

              <div className="min-w-0 flex-1 text-right">
                <p className="truncate text-xs font-bold text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">منذ {item.time}</p>
              </div>

              <span
                className={`font-display shrink-0 text-[11px] font-bold tabular-nums ${
                  item.hot ? 'text-red' : 'text-primary'
                }`}
              >
                {item.mult}
              </span>

              <span className="font-display shrink-0 text-xs font-extrabold tabular-nums text-success">
                +{item.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
