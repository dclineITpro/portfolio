import React, { useEffect, useRef, useState } from 'react';

/**
 * LetterRainBackground
 * Matrix-style indigo/purple letter rain rendered to a fixed, full-screen canvas.
 * - Subtle, professional look (low opacity, slow speed)
 * - Honors prefers-reduced-motion
 * - No interaction; pointer-events disabled
 */
const LetterRainBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768; // hide on mobile (< md)
  });

  useEffect(() => {
    function onResize() {
      setEnabled(window.innerWidth >= 768);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!enabled) return; // do not render/animate on mobile
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cnv = canvas; // non-null alias for nested closures

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const ctx = cnv.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
    if (!ctx) return;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;

    // Visual params (tuned for subtle professional effect)
    const fontSize = 16; // logical pixels
    const minFPS = 24; // lower FPS for gentler motion and lower load
    const letterOpacity = 0.4; // medium visibility
    const speedPx = 0.75; // slower speed
    const ACTIVATE_PROB = 0.050625; // +50% more from 0.03375

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3']; // indigo family (balanced)
    const HEAD_COLOR = '#bfc6ff'; // toned head color
    const MAX_TRAIL_UNITS = 18; // limit how long a trail persists behind the head
    const COOLDOWN_FRAMES = 48; // frames a column waits before it can spawn again (~2s at 24fps)

    let columns = 0;
    let drops: number[] = [];
    let cooldowns: number[] = [];
    let speeds: number[] = []; // per-active-drop speed multipliers

    // Generate a subtle speed multiplier for each new drop
    // Range ~0.6x to ~1.5x of the base speed for natural variety
    const randomSpeed = () => 0.6 + Math.random() * 0.9;

    function resize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      width = Math.ceil(vw * DPR);
      height = Math.ceil(vh * DPR);
      cnv.width = width;
      cnv.height = height;
      cnv.style.width = vw + 'px';
      cnv.style.height = vh + 'px';

      const scaledFont = Math.max(14, Math.min(22, fontSize)) * DPR;
      const ctxLocal = ctx as CanvasRenderingContext2D;
      ctxLocal.font = `${scaledFont}px monospace`;
      ctxLocal.textBaseline = 'top';

      // Use normal column spacing; control frequency via activation probability
      columns = Math.floor(width / (scaledFont));
      drops = new Array(columns).fill(-1); // -1 indicates inactive column
      cooldowns = new Array(columns).fill(0);
      speeds = new Array(columns).fill(1);
      ctxLocal.clearRect(0, 0, width, height);
    }

    resize();
    window.addEventListener('resize', resize);

    let last = 0;
    const frameInterval = 1000 / minFPS;
    let frameCount = 0;

    function draw(ts: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (ts - last < frameInterval) return;
      last = ts;
      frameCount++;

      // Clear the entire canvas each frame to avoid any residual pixels
      const ctxLocal = ctx as CanvasRenderingContext2D;
      ctxLocal.globalCompositeOperation = 'source-over';
      ctxLocal.globalAlpha = 1;
      ctxLocal.clearRect(0, 0, width, height);
      ctxLocal.globalAlpha = letterOpacity;

      const scaledFont = parseInt(ctxLocal.font, 10) || Math.round(fontSize * DPR);
      const stepY = Math.max(12, scaledFont) * speedPx; // base step per frame

      let anyActive = false;
      let activeCount = 0;
      for (let i = 0; i < columns; i++) {
        // Activate inactive columns with a small probability
        if (drops[i] < 0) {
          if (cooldowns[i] > 0) {
            cooldowns[i] -= 1;
            continue;
          }
          if (Math.random() < ACTIVATE_PROB) {
            drops[i] = -Math.random() * 10; // start slightly above the top for a nicer spawn
            speeds[i] = randomSpeed(); // assign a new random speed for this drop
          } else {
            continue; // remain inactive this frame
          }
        }

        // Explicit short trail rendering with per-frame clear, avoids residual build-up
        const baseColor = COLORS[i % COLORS.length];
        const x = i * scaledFont;
        const yUnits = drops[i];
        const y = yUnits * scaledFont;
        const xi = Math.round(x);
        const yi = Math.round(y);

        for (let t = Math.max(0, -Math.floor(yUnits)); t <= MAX_TRAIL_UNITS; t++) {
          const ty = yi - t * scaledFont;
          if (ty < 0) break;
          const isHead = t === 0;
          const alpha = isHead ? 0.7 : Math.max(0, letterOpacity * (1 - t / (MAX_TRAIL_UNITS + 1)));
          ctxLocal.globalAlpha = alpha;
          ctxLocal.fillStyle = isHead && (i % 5 === 0) ? HEAD_COLOR : baseColor;
          const char = CHARS.charAt((Math.random() * CHARS.length) | 0);
          ctxLocal.fillText(char, xi, Math.round(ty));
        }
        ctxLocal.globalAlpha = letterOpacity;

        // advance and deactivate when off-screen (apply per-drop speed multiplier)
        const vel = speeds[i] || 1;
        const nextUnits = yUnits + ((stepY * vel) / scaledFont);
        if (nextUnits * scaledFont > height) {
          drops[i] = -1; // deactivate to reduce overall frequency
          cooldowns[i] = COOLDOWN_FRAMES; // wait before allowing a new drop on this column
          // speed will be re-assigned on next activation
        } else {
          drops[i] = nextUnits;
          anyActive = true;
          activeCount++;
        }
      }

      // No residual clearing needed beyond per-frame clear + explicit trails

      ctxLocal.globalAlpha = 1;
    }

    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Reduced motion: render a single, faint static frame
      const ctxLocal = ctx as CanvasRenderingContext2D;
      ctxLocal.fillStyle = 'rgba(0,0,0,0)';
      ctxLocal.fillRect(0, 0, width, height);
      ctxLocal.globalAlpha = 0.18;
      for (let i = 0; i < Math.min(columns, 40); i++) {
        const char = CHARS.charAt((Math.random() * CHARS.length) | 0);
        const color = COLORS[i % COLORS.length];
        ctxLocal.fillStyle = color;
        const x = i * (parseInt(ctxLocal.font, 10) || Math.round(fontSize * DPR));
        const y = Math.random() * height;
        ctxLocal.fillText(char, x, y);
      }
      ctxLocal.globalAlpha = 1;
    }

    // Pause animation when tab is hidden to save resources
    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!prefersReduced && !rafRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      className="letter-rain"
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.85,
        mixBlendMode: 'normal',
      }}
    />
  );
};

export default LetterRainBackground;
