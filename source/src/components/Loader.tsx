import { useEffect, useRef, useState } from 'react';
import { assetUrl } from './Img';
import { REDUCED_MOTION, wait } from '../lib/env';
import { useLang } from '../lib/i18n';

/** Assets the first screens need; the loader waits for these (or a time cap), no longer. */
const CRITICAL = ['logos/afak', 'logos/gift-zone', 'logos/mr-group', 'id/gift-zone/mark', 'id/gift-zone/01'];

/**
 * Opening sequence: name, "Portfolio / 2026", and a counter driven by real loading
 * progress (fonts + first images). Minimum ~1.5 s so it reads, capped at ~3.2 s.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'load' | 'out' | 'gone'>('load');
  const { lang, t } = useLang();
  const isAr = lang === 'ar';
  const num = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let real = 0;
    let shown = 0;
    let raf = 0;
    const total = CRITICAL.length + 1;
    const bump = () => (real += 1 / total);
    document.fonts?.ready.then(bump).catch(bump);
    CRITICAL.forEach((k) => {
      const i = new Image();
      i.onload = i.onerror = bump;
      i.src = assetUrl(k);
    });
    const t0 = performance.now();
    const minT = REDUCED_MOTION ? 200 : 1500;
    const maxT = 3200;
    const tick = () => {
      const t = performance.now() - t0;
      const target = Math.min(real, t / minT, 1);
      const forced = t > maxT ? 1 : target;
      shown += (forced - shown) * 0.08;
      if (forced === 1 && 1 - shown < 0.004) shown = 1;
      const v = Math.round(shown * 100);
      if (num.current) num.current.textContent = String(v).padStart(3, '0');
      if (line.current) line.current.style.transform = `scaleX(${shown})`;
      if (shown >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    let finished = false;
    const finish = async () => {
      if (finished) return;
      finished = true;
      await wait(180);
      setPhase('out');
      onDone();
      await wait(1300);
      setPhase('gone');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`loader loader--${phase}`} role="progressbar" aria-label="Loading portfolio" aria-valuemin={0} aria-valuemax={100}>
      <div className="loader__center">
        {isAr ? (
          <span className="loader__name loader__name--ar" lang="ar" dir="rtl">
            علي الجيلاني
          </span>
        ) : (
          <span className="loader__name" lang="en">
            Ali Algailani
          </span>
        )}
        <span className="loader__sub" dir={isAr ? 'rtl' : 'ltr'}>
          <span className={isAr ? 'ar' : ''}>{isAr ? 'ملف أعمال' : 'Portfolio'}</span>
          <i />
          <span lang="en">2026</span>
        </span>
      </div>
      <div className="loader__foot" dir="ltr">
        <span className={`loader__label ${isAr ? 'ar' : ''}`}>{t.opening}</span>
        <span className="loader__num" ref={num} lang="en">
          000
        </span>
      </div>
      <span className="loader__line" ref={line} />
    </div>
  );
}

/** Film grain: one small noise tile generated on a canvas, reused as a CSS background. */
export function useGrain() {
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const g = c.getContext('2d')!;
      const d = g.createImageData(160, 160);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 26;
      }
      g.putImageData(d, 0, 0);
      document.documentElement.style.setProperty('--grain', `url(${c.toDataURL('image/png')})`);
    } catch {
      /* grain is decorative */
    }
  }, []);
}
