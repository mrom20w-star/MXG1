import { useCallback, useEffect, useState } from 'react';
import { ConditionsPage } from './components/ConditionsPage';
import { GamesPage } from './components/GamesPage';
import { SplashScreen } from './components/SplashScreen';
import { CrashGame } from './components/games/CrashGame';
import type { RoutePath } from './lib/session';

const VALID_ROUTES = new Set<RoutePath>(['/', '/games', '/conditions', '/crash']);

function readRoute(): RoutePath {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname as RoutePath;
  return VALID_ROUTES.has(path) ? path : '/';
}

export default function App() {
  const [route, setRoute] = useState<RoutePath>(readRoute);

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: RoutePath) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div key={route} className="animate-page-in">
      {route === '/' && <SplashScreen onNavigate={navigate} />}
      {route === '/games' && <GamesPage onNavigate={navigate} />}
      {route === '/conditions' && <ConditionsPage onNavigate={navigate} />}
      {route === '/crash' && <CrashGame onNavigate={navigate} />}
    </div>
  );
}
