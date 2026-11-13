import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Fingerprint,
  Gamepad2,
  Lock,
  RefreshCw,
  Send,
  ShieldCheck,
  Ticket,
  Wallet,
} from 'lucide-react';
import { BrandLogo, HeaderBar, PlatformEmblem } from './Chrome';
import { ParticleCanvas } from './ParticleCanvas';
import {
  GAME_ROUTES,
  PLATFORMS,
  clearStoredPlatform,
  getStoredGame,
  getStoredPlatform,
  getStoredUserId,
  setStoredPlatform,
  setStoredUserId,
  setVipActivated,
  type PlatformId,
  type RoutePath,
} from '../lib/session';
import { playLockChime, playRevealChime } from '../lib/sound';

interface StepCardProps {
  stepNumber: number;
  icon: ReactNode;
  title: string;
  desc: string;
  done: boolean;
  delay: number;
  children?: ReactNode;
}

function StepCard({ stepNumber, icon, title, desc, done, delay, children }: StepCardProps) {
  return (
    <li
      className="animate-fade-up glass relative overflow-hidden rounded-[18px] p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border text-xs font-extrabold ${
            done
              ? 'border-success/60 bg-success/15 text-success'
              : 'border-primary/50 bg-primary/10 text-primary'
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : icon}
        </span>

        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
            <span className="font-display text-xs font-bold tabular-nums text-muted-foreground">
              {String(stepNumber).padStart(2, '0')}
            </span>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>

      {children && <div className="mt-3">{children}</div>}
    </li>
  );
}

function PlatformPicker({ onPick }: { onPick: (id: PlatformId) => void }) {
  const platformIds = Object.keys(PLATFORMS) as PlatformId[];

  return (
    <section className="mx-auto max-w-3xl px-4 pt-8">
      <div
        className="animate-fade-up glass relative flex flex-col items-center gap-2 overflow-hidden rounded-[22px] p-6 text-center"
        style={{
          backgroundImage:
            'linear-gradient(150deg, oklch(0.45 0.2 253 / 0.22), transparent 55%, oklch(0.5 0.22 27 / 0.2))',
        }}
      >
        <BrandLogo size={54} className="animate-glow-pulse" />
        <h1 className="neon-text mt-1 text-xl font-extrabold text-foreground">
          اختار منصتك الأول
        </h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          بعد اختيار المنصة كل شروط التفعيل والبروموكود MXG1 هتظهر لربط حسابك بأداة الطيارة
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {platformIds.map((id, idx) => {
          const info = PLATFORMS[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                playRevealChime();
                onPick(id);
              }}
              className="animate-fade-up glass group relative flex flex-col items-center gap-3 overflow-hidden rounded-[20px] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/70"
              style={{ animationDelay: `${idx * 90}ms` }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/15 blur-2xl"
              />
              <PlatformEmblem platform={id} size={74} />
              <div>
                <span className="font-display block text-base font-extrabold text-foreground">
                  {info.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{info.tagline}</span>
              </div>
              <span className="mt-1 flex min-h-[40px] items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/15 px-5 py-2 text-xs font-extrabold text-primary group-hover:bg-primary/25">
                <span>اختيار</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function ConditionsPage({ onNavigate }: { onNavigate: (to: RoutePath) => void }) {
  const [platform, setPlatform] = useState<PlatformId | null>(() => getStoredPlatform());
  const [downloaded, setDownloaded] = useState(false);
  const [telegramJoined, setTelegramJoined] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState<'EGP' | 'USD' | null>(null);
  const [userId, setUserId] = useState(() => getStoredUserId());
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!activating) return;
    const targetRoute = GAME_ROUTES[getStoredGame()];
    const timer = setTimeout(() => {
      playLockChime();
      onNavigate(targetRoute);
    }, 2400);
    return () => clearTimeout(timer);
  }, [activating, onNavigate]);

  const handlePickPlatform = (id: PlatformId) => {
    setStoredPlatform(id);
    setPlatform(id);
  };

  const handleResetPlatform = () => {
    clearStoredPlatform();
    setPlatform(null);
    setActivating(false);
  };

  const handleCopyPromo = (promo: string) => {
    playRevealChime();
    void navigator.clipboard?.writeText(promo).catch(() => {});
    setPromoCopied(true);
  };

  const handleStartNow = () => {
    const trimmed = userId.trim();
    if (!trimmed) return;
    playRevealChime();
    setStoredUserId(trimmed);
    setVipActivated(true);
    setActivating(true);
  };

  const activePlatform = platform ? PLATFORMS[platform] : null;
  const hasUserId = userId.trim().length > 0;
  const completedSteps = [
    downloaded,
    telegramJoined,
    promoCopied,
    depositCurrency !== null,
    hasUserId,
  ];
  const doneCount = completedSteps.filter(Boolean).length;
  const percent = Math.round((doneCount / completedSteps.length) * 100);

  return (
    <main className="page-bg screen-frame relative min-h-screen pb-14">
      <ParticleCanvas />

      <div className="relative z-10">
        <HeaderBar
          title="شروط التفعيل"
          backTo="/games"
          onNavigate={onNavigate}
          right={
            <span className="font-display flex items-center gap-1 text-xs font-extrabold tracking-widest text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              VIP
            </span>
          }
        />

        {!activePlatform ? (
          <PlatformPicker onPick={handlePickPlatform} />
        ) : (
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <section className="animate-fade-up glass relative flex items-center gap-4 overflow-hidden rounded-[22px] p-4 sm:p-5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-14 -left-12 h-40 w-40 rounded-full bg-red/20 blur-3xl"
              />

              <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute h-full w-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - percent / 100)}
                    style={{ transition: 'stroke-dashoffset 0.45s ease' }}
                  />
                </svg>
                <span className="font-display text-sm font-extrabold tabular-nums text-primary">
                  {percent}%
                </span>
              </div>

              <div className="min-w-0 flex-1 text-right">
                <h1 className="neon-text text-lg font-extrabold text-foreground sm:text-xl">
                  تفعيل حساب VIP
                </h1>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {doneCount} من {completedSteps.length} خطوات مكتملة على منصة{' '}
                  <span className="font-bold text-foreground">{activePlatform.name}</span>
                </p>
              </div>

              <BrandLogo size={46} className="animate-glow-pulse relative hidden shrink-0 sm:block" />
            </section>

            <section className="mt-4">
              <div className="glass flex items-center gap-3 rounded-[18px] border-red/40 p-3.5">
                <PlatformEmblem platform={activePlatform.id} size={46} />
                <div className="flex-1 text-right">
                  <span className="font-display block text-sm font-extrabold text-red">
                    {activePlatform.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {activePlatform.tagline}
                  </span>
                </div>
                <span className="font-display text-[11px] font-bold tracking-[0.2em] text-primary">
                  OFFICIAL
                </span>
              </div>
            </section>

            <section className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleResetPlatform}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-[14px] border border-red/50 bg-red/10 py-2.5 text-xs font-extrabold text-red hover:bg-red/20 active:scale-95"
              >
                <span>تغيير المنصة</span>
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/games')}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-[14px] border border-primary/50 bg-primary/10 py-2.5 text-xs font-extrabold text-primary hover:bg-primary/20 active:scale-95"
              >
                <span>رجوع للألعاب</span>
                <Gamepad2 className="h-3.5 w-3.5" />
              </button>
            </section>

            <section className="mt-5">
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <StepCard
                  stepNumber={1}
                  delay={0}
                  icon={<Download className="h-4 w-4" />}
                  title="تحميل المنصة"
                  desc={`ثبّت تطبيق ${activePlatform.name} الرسمي على هاتفك.`}
                  done={downloaded}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playRevealChime();
                      setDownloaded((v) => !v);
                    }}
                    className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] py-2.5 text-xs font-extrabold transition-transform hover:scale-[1.01] active:scale-95 ${
                      downloaded
                        ? 'border border-success/50 bg-success/15 text-success'
                        : 'gradient-primary text-primary-foreground shadow-[var(--glow-sm)]'
                    }`}
                  >
                    {downloaded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>تم تأكيد تحميل {activePlatform.name}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>تأكيد تحميل {activePlatform.name}</span>
                      </>
                    )}
                  </button>
                </StepCard>

                <StepCard
                  stepNumber={2}
                  delay={60}
                  icon={<Send className="h-4 w-4" />}
                  title="قناة التلجرام"
                  desc="انضم للقناة الحصرية لمتابعة الإشارات والتحديثات اليومية."
                  done={telegramJoined}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playRevealChime();
                      setTelegramJoined((v) => !v);
                    }}
                    className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border py-2.5 text-xs font-extrabold active:scale-95 ${
                      telegramJoined
                        ? 'border-success/50 bg-success/15 text-success'
                        : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {telegramJoined ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>تم تأكيد الانضمام للقناة</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>تأكيد الانضمام للقناة</span>
                      </>
                    )}
                  </button>
                </StepCard>

                <StepCard
                  stepNumber={3}
                  delay={120}
                  icon={<Ticket className="h-4 w-4" />}
                  title="البروموكود"
                  desc="سجّل بالكود ده للحصول على البونص وربط الحساب."
                  done={promoCopied}
                >
                  <button
                    type="button"
                    onClick={() => handleCopyPromo(activePlatform.promo)}
                    className="flex min-h-[46px] w-full items-center justify-between rounded-[12px] border border-dashed border-primary/50 bg-secondary/50 px-3.5 py-2.5 hover:bg-primary/10"
                  >
                    <span className="font-display neon-text text-base font-extrabold tracking-[0.3em] text-primary">
                      {activePlatform.promo}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <span>{promoCopied ? 'تم النسخ' : 'نسخ'}</span>
                      {promoCopied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-primary" />
                      )}
                    </span>
                  </button>
                </StepCard>

                <StepCard
                  stepNumber={4}
                  delay={180}
                  icon={<Wallet className="h-4 w-4" />}
                  title="الإيداع"
                  desc="إيداع أولي لتفعيل الحساب: 500 جنيه أو 10 دولار."
                  done={depositCurrency !== null}
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        playRevealChime();
                        setDepositCurrency('EGP');
                      }}
                      className={`min-h-[44px] rounded-[12px] border py-2 text-xs font-extrabold active:scale-95 ${
                        depositCurrency === 'EGP'
                          ? 'border-red bg-red/25 text-foreground shadow-[0_0_16px_oklch(0.6_0.22_27/40%)]'
                          : 'border-red/50 bg-red/10 text-red hover:bg-red/20'
                      }`}
                    >
                      500 جنيه
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playRevealChime();
                        setDepositCurrency('USD');
                      }}
                      className={`min-h-[44px] rounded-[12px] border py-2 text-xs font-extrabold active:scale-95 ${
                        depositCurrency === 'USD'
                          ? 'border-primary bg-primary/25 text-foreground shadow-[var(--glow-sm)]'
                          : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      10 دولار
                    </button>
                  </div>
                </StepCard>

                <div className="md:col-span-2">
                  <StepCard
                    stepNumber={5}
                    delay={240}
                    icon={<Fingerprint className="h-4 w-4" />}
                    title="الـ ID الخاص بك"
                    desc="أدخل رقم الحساب للتأكد من التفعيل وفتح أداة الكشف."
                    done={hasUserId}
                  >
                    <input
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      inputMode="numeric"
                      placeholder="مثال: 1029384756"
                      className="font-display min-h-[48px] w-full rounded-[12px] border border-primary/40 bg-secondary/50 px-4 py-3 text-right text-sm font-bold tracking-widest text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:shadow-[var(--glow-sm)]"
                    />
                  </StepCard>
                </div>
              </ul>

              <button
                type="button"
                onClick={handleStartNow}
                disabled={!hasUserId}
                className="gradient-primary mt-5 min-h-[54px] w-full rounded-[16px] py-4 text-sm font-extrabold text-primary-foreground shadow-[var(--glow-lg)] hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:shadow-none"
              >
                {hasUserId ? 'ابدأ الربح الآن' : 'أدخل الـ ID للمتابعة'}
              </button>

              {!hasUserId && (
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>الزر يتفعل بعد إدخال الـ ID</span>
                </p>
              )}
            </section>
          </div>
        )}
      </div>

      {activating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-6 backdrop-blur-xl">
          <div
            className="glass animate-fade-up w-full max-w-[360px] overflow-hidden rounded-[26px] p-6 text-center"
            style={{
              backgroundImage:
                'linear-gradient(150deg, oklch(0.45 0.2 253 / 0.26), transparent 55%, oklch(0.5 0.22 27 / 0.24))',
            }}
          >
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary shadow-[var(--glow-md)]" />
              <span
                className="border-b-red absolute inset-3 animate-spin rounded-full border-2 border-transparent"
                style={{ animationDirection: 'reverse', animationDuration: '2.2s' }}
              />
              <span className="animate-glow-pulse absolute h-16 w-16 rounded-full bg-primary/25 blur-2xl" />
              <BrandLogo size={62} className="relative" />
            </div>

            <p className="font-display neon-text mt-4 text-base font-extrabold tracking-[0.14em] text-foreground">
              كراش <span className="text-red">CRASH</span>
            </p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground">
              جارٍ تفعيل الحساب...
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
              <span
                className="block h-full w-1/3 rounded-full"
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--primary), var(--red))',
                  animation: 'feed 1.3s linear infinite',
                }}
              />
            </div>

            <ul dir="rtl" className="mt-5 space-y-2 text-right">
              {['التحقق من رقم الحساب', 'مطابقة البروموكود', 'ربط سيرفر التوقعات'].map((step, idx) => (
                <li
                  key={step}
                  className="animate-fade-up flex items-center gap-2.5 rounded-xl border border-border bg-background/55 px-3 py-2 text-xs text-muted-foreground"
                  style={{ animationDelay: `${idx * 350}ms` }}
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
