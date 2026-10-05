import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../lib/hooks';

/** Deterministic QR-style tag for a crate id (visual only, not a scannable QR code). */
export default function QrTag({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dark = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const n = 21;
    canvas.width = n;
    canvas.height = n;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--ink');
    const bg = css.getPropertyValue('--surface');

    let h = 0;
    for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, n, n);
    ctx.fillStyle = ink;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
        if (h % 2) ctx.fillRect(x, y, 1, 1);
      }
    }
    // finder squares
    for (const [x, y] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      ctx.fillStyle = ink; ctx.fillRect(x, y, 7, 7);
      ctx.fillStyle = bg; ctx.fillRect(x + 1, y + 1, 5, 5);
      ctx.fillStyle = ink; ctx.fillRect(x + 2, y + 2, 3, 3);
    }
  }, [value, dark]);

  return <canvas ref={ref} aria-label={`QR tag ${value}`} />;
}
