import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Img } from './Img';
import { scroll } from '../lib/scroll';
import { pad2 } from '../lib/env';
import { useLang } from '../lib/i18n';

export interface Shot {
  src: string;
  alt: string;
  caption?: string;
}
const Ctx = createContext<(shots: Shot[], i?: number) => void>(() => {});
export const useLightbox = () => useContext(Ctx);

/**
 * Full-screen viewer for any image in the portfolio. Arrow keys, swipe and the
 * on-screen controls step through the set; Escape or the close control exits.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [shots, setShots] = useState<Shot[] | null>(null);
  const [i, setI] = useState(0);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touch = useRef(0);

  const open = useCallback((s: Shot[], idx = 0) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setShots(s);
    setI(idx);
  }, []);
  const close = useCallback(() => {
    setShots(null);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);
  const step = useCallback((d: number) => setI((v) => (shots ? (v + d + shots.length) % shots.length : 0)), [shots]);

  useEffect(() => {
    scroll.lock(!!shots);
    if (!shots) return;
    setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 50);
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [shots, close, step]);

  const cur = shots?.[i];
  return (
    <Ctx.Provider value={open}>
      {children}
      {shots && cur && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.viewer}
          onTouchStart={(e: TouchEvent) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e: TouchEvent) => {
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <button className="lightbox__scrim" type="button" aria-label={t.close} onClick={close} data-cursor="close" tabIndex={-1} />
          <figure className="lightbox__fig" key={cur.src}>
            <Img src={cur.src} alt={cur.alt} eager />
            {cur.caption && <figcaption dir="auto">{cur.caption}</figcaption>}
          </figure>
          <div className="lightbox__bar" dir="ltr">
            <span className="lightbox__count" lang="en">
              {pad2(i + 1)} <i>/ {pad2(shots.length)}</i>
            </span>
            {shots.length > 1 && (
              <span className="lightbox__nav">
                <button type="button" onClick={() => step(-1)} aria-label={t.prev}>
                  ←
                </button>
                <button type="button" onClick={() => step(1)} aria-label={t.next}>
                  →
                </button>
              </span>
            )}
            <button ref={closeBtn} type="button" className="lightbox__close" onClick={close}>
              {t.close}
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
