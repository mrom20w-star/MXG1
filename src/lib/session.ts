export type PlatformId = '1xbet' | 'melbet' | 'spinbetter';
export type GameId = 'crash';
export type RoutePath = '/' | '/games' | '/conditions' | '/crash';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  tagline: string;
  short: string;
  promo: string;
  accent: string;
}

export interface GameInfo {
  id: GameId;
  name: string;
  ar: string;
  route: RoutePath;
  tag: string;
  accent: 'red' | 'blue';
  img: string;
}

const PLATFORM_KEY = 'aiscript:platform';
const USER_ID_KEY = 'aiscript:userid';
const GAME_KEY = 'aiscript:game';
const ACTIVATED_KEY = 'aiscript:activated';

export const BRAND_LOGO_SRC = '/src/assets/images/crash_script_logo_1794577280842.jpg';

export const PLATFORMS: Record<PlatformId, PlatformInfo> = {
  '1xbet': {
    id: '1xbet',
    name: '1xBet',
    tagline: 'المنصة الرسمية المعتمدة',
    short: '1X',
    promo: 'MXG1',
    accent: 'oklch(0.65 0.22 245)',
  },
  melbet: {
    id: 'melbet',
    name: 'MELBET',
    tagline: 'المنصة الرسمية المعتمدة',
    short: 'MB',
    promo: 'MXG1',
    accent: 'oklch(0.78 0.18 85)',
  },
  spinbetter: {
    id: 'spinbetter',
    name: 'Spinbetter',
    tagline: 'المنصة الرسمية المعتمدة',
    short: 'SB',
    promo: 'MXG1',
    accent: 'oklch(0.68 0.2 155)',
  },
};

export const GAMES: GameInfo[] = [
  {
    id: 'crash',
    name: 'Crash',
    ar: 'توقع لحظة الانفجار — لعبة الطيارة',
    route: '/crash',
    tag: 'HOT',
    accent: 'red',
    img: '/src/assets/images/game_crash_banner_1794574975391.jpg',
  },
];

export const GAME_ROUTES: Record<GameId, RoutePath> = {
  crash: '/crash',
};

export function setStoredPlatform(platform: PlatformId): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PLATFORM_KEY, platform);
  }
}

export function clearStoredPlatform(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PLATFORM_KEY);
  }
}

export function getStoredPlatform(): PlatformId | null {
  if (typeof window === 'undefined') return null;
  const val = sessionStorage.getItem(PLATFORM_KEY);
  return val === '1xbet' || val === 'melbet' || val === 'spinbetter' ? val : null;
}

export function getActivePlatform(): PlatformId {
  return getStoredPlatform() ?? '1xbet';
}

export function setStoredUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(USER_ID_KEY, userId);
  }
}

export function getStoredUserId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(USER_ID_KEY) ?? '';
}

export function setStoredGame(game: GameId): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GAME_KEY, game);
  }
}

export function getStoredGame(): GameId {
  return 'crash';
}

export function setVipActivated(activated: boolean): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ACTIVATED_KEY, activated ? '1' : '0');
  }
}

export function isVipActivated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ACTIVATED_KEY) === '1';
}
