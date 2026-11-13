import { useEffect, useRef } from 'react';

const NODE_COUNT = 70;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles: Particle[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 0.9 + Math.random() * 1.5,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const topBlue = (y: number) => {
      const t = Math.max(0, 1 - y * 2);
      return { r: 70 + 20 * t, g: 140 + 50 * t, b: 255 };
    };

    const bottomRed = (y: number) => {
      const t = Math.max(0, y * 2 - 1);
      return { r: 255, g: 60 + 40 * t, b: 70 + 30 * t };
    };

    const colorAt = (y: number) => (y < 0.5 ? topBlue(y) : bottomRed(y));

    let rafId = 0;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReduced) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ca = colorAt(a.y);

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const cb = colorAt(b.y);
            const c =
              a.y < 0.5 === b.y < 0.5
                ? ca
                : { r: (ca.r + cb.r) / 2, g: (ca.g + cb.g) / 2, b: (ca.b + cb.b) / 2 };
            ctx.strokeStyle = `rgba(${c.r | 0}, ${c.g | 0}, ${c.b | 0}, ${(1 - dist / 120) * 0.28})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      ctx.shadowBlur = 8;
      for (const p of particles) {
        const c = colorAt(p.y);
        ctx.shadowColor = `rgba(${c.r | 0}, ${c.g | 0}, ${c.b | 0}, 0.9)`;
        ctx.fillStyle = `rgba(${c.r | 0}, ${c.g | 0}, ${c.b | 0}, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!prefersReduced) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
