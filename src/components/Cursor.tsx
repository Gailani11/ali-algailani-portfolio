import { useEffect, useRef } from 'react';
import { FINE_POINTER } from '../lib/env';
import { scroll } from '../lib/scroll';
import { toneAt } from '../lib/tone';
import { useLang } from '../lib/i18n';

/**
 * Custom cursor — a solid circle that trails the pointer closely. Its colour follows
 * the page: ink over light sections, paper over dark ones, cross-fading as you move
 * or scroll between them. Over elements carrying `data-cursor` it grows into a disc
 * with a word (VIEW, EXPLORE, OPEN + link icon, DRAG…); over plain links it opens into a ring.
 * Disabled on touch devices.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const lab = useRef<HTMLSpanElement>(null);
  const { t } = useLang();
  const labels = useRef(t.cursor);
  labels.current = t.cursor;

  useEffect(() => {
    if (!FINE_POINTER) return;
    document.documentElement.classList.add('has-cursor');
    const el = root.current!;
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100;
    let state = '';
    let tone = '';
    let visible = false;
    let moved = false;
    let lastProbe = 0;

    const setState = (s: string) => {
      if (s === state) return;
      state = s;
      const word = labels.current[s];
      el.dataset.state = s ? (word ? 'label' : s) : '';
      el.dataset.kind = s;
      if (lab.current) lab.current.textContent = word ?? '';
    };
    const setTone = (tn: string) => {
      if (tn === tone) return;
      tone = tn;
      el.dataset.tone = tn;
    };
    const resolve = (target: Element | null) => {
      if (!target || !target.closest) return setState('');
      const c = target.closest('[data-cursor]') as HTMLElement | null;
      if (c && c.dataset.cursor) return setState(c.dataset.cursor);
      if (target.closest('a, button, [role="button"], input, label, summary')) return setState('link');
      setState('');
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      moved = true;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el.classList.add('is-visible');
      }
    };
    const over = (e: PointerEvent) => resolve(e.target as Element);
    const leave = () => {
      visible = false;
      el.classList.remove('is-visible');
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    let lastY = scroll.y;
    const off = scroll.onTick((time) => {
      // faster, still smooth: frame-rate independent easing
      x += (tx - x) * 0.34;
      y += (ty - y) * 0.34;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const scrolled = Math.abs(scroll.y - lastY) > 2;
      if (visible && (moved || scrolled) && time - lastProbe > 60) {
        lastProbe = time;
        moved = false;
        setTone(toneAt(tx, ty));
        if (scrolled) resolve(document.elementFromPoint(tx, ty));
        lastY = scroll.y;
      }
    });
    return () => {
      off();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!FINE_POINTER) return null;
  return (
    <div className="cursor" ref={root} data-tone="dark" aria-hidden="true">
      <div className="cursor__disc">
        <span className="cursor__label" ref={lab} />
      </div>
    </div>
  );
}
