import { useEffect, useRef } from 'react';
import { scroll, docTop } from '../lib/scroll';
import { clamp } from '../lib/env';

export interface SceneInfo {
  top: number;
  height: number;
  vh: number;
  vw: number;
  y: number;
}
type Edge = (top: number, height: number, vh: number) => number;

/**
 * Scroll scene: calls `onProgress(p)` with the element's progress (0 → 1) between a
 * start and an end scroll position — the ScrollTrigger idea without the dependency.
 * Default: from the moment the element's top enters the viewport bottom until its
 * bottom leaves the viewport top. Callbacks write styles directly (no React renders).
 */
export function useScene<T extends HTMLElement = HTMLDivElement>(
  onProgress: (p: number, info: SceneInfo) => void,
  opts: { start?: Edge; end?: Edge; enabled?: boolean } = {},
  deps: readonly unknown[] = [],
) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el || opts.enabled === false) return;
    let top = 0;
    let height = 0;
    const measure = () => {
      top = docTop(el);
      height = el.offsetHeight;
      last = -1;
    };
    let last = -1;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const offResize = scroll.onResizeEnd(measure);
    const offTick = scroll.onTick(() => {
      const vh = scroll.vh;
      const s = opts.start ? opts.start(top, height, vh) : top - vh;
      const e = opts.end ? opts.end(top, height, vh) : top + height;
      const p = clamp((scroll.y - s) / Math.max(1, e - s));
      if (p !== last) {
        last = p;
        cb.current(p, { top, height, vh, vw: scroll.vw, y: scroll.y });
      }
    });
    return () => {
      offTick();
      offResize();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
