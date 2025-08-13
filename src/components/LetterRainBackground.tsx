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
    const trailFade = 0.05; // slightly faster fade -> shorter, subtler trails
    const minFPS = 24; // lower FPS for gentler motion and lower load
    const letterOpacity = 0.4; // medium visibility
    const speedPx = 0.75; // slower speed

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3']; // indigo family (balanced)
    const HEAD_COLOR = '#bfc6ff'; // toned head color

    let columns = 0;
    let drops: number[] = [];

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

      columns = Math.floor(width / (scaledFont));
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * (height / scaledFont)));
      ctxLocal.clearRect(0, 0, width, height);
    }

    resize();
    window.addEventListener('resize', resize);

    let last = 0;
    const frameInterval = 1000 / minFPS;

    function draw(ts: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (ts - last < frameInterval) return;
      last = ts;

      // Fade the canvas to create trails that blend with the site gradient
      const ctxLocal = ctx as CanvasRenderingContext2D;
      ctxLocal.fillStyle = `rgba(8,9,13,${trailFade})`;
      ctxLocal.fillRect(0, 0, width, height);

      ctxLocal.globalAlpha = letterOpacity;

      const scaledFont = parseInt(ctxLocal.font, 10) || Math.round(fontSize * DPR);
      const stepY = Math.max(12, scaledFont) * speedPx;

      for (let i = 0; i < columns; i++) {
        const char = CHARS.charAt((Math.random() * CHARS.length) | 0);
        const color = COLORS[i % COLORS.length];
        // Head glyph for visibility (less frequent, less bright)
        ctxLocal.globalAlpha = 0.7;
        ctxLocal.fillStyle = (i % 5 === 0) ? HEAD_COLOR : color;
        const x = i * scaledFont;
        const y = drops[i] * scaledFont;
        ctxLocal.fillText(char, x, y);
        ctxLocal.globalAlpha = letterOpacity;

        // reset drop randomly after passing bottom to vary trail lengths
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += stepY / scaledFont;
        }
      }

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

    return () => {
      window.removeEventListener('resize', resize);
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
