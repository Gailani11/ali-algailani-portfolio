import { useEffect, useRef } from 'react';
import { CHAPTERS } from '../data/content';
import { scroll, docTop } from '../lib/scroll';
import { useRouter } from '../lib/router';
import { pad2, clamp } from '../lib/env';
import { useLang } from '../lib/i18n';

interface Mark {
  el: HTMLElement;
  top: number;
  h: number;
  from: number;
  to: number;
  label: string;
  chapter: string;
}

/**
 * The book's running chrome, carried over from the PDF's locked page furniture:
 * corner ticks, a running head ("ALI ALGAILANI — VISUAL IDENTITIES") and a live folio
 * that shows which PDF page the section on screen corresponds to. Beside it, the
 * chapter rail 01–06 tracks the six chapters of the portfolio.
 */
export function Chrome() {
  const folio = useRef<HTMLSpanElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { view, toSection } = useRouter();
  const { lang, t } = useLang();
  const fallback = useRef(t.runningDefault);
  fallback.current = t.runningDefault;

  useEffect(() => {
    let marks: Mark[] = [];
    const measure = () => {
      marks = Array.from(document.querySelectorAll<HTMLElement>('[data-folio]')).map((el) => {
        const [a, b] = (el.dataset.folio || '1').split('-').map(Number);
        return {
          el,
          top: docTop(el),
          h: el.offsetHeight,
          from: a,
          to: b || a,
          label: el.dataset.label || '',
          chapter: el.dataset.chapter || '',
        };
      });
      lastF = -1;
    };
    let lastF = -1;
    let lastLabel = '';
    let lastCh = '';
    const t = setTimeout(measure, 100);
    const offR = scroll.onResizeEnd(measure);
    const off = scroll.onTick(() => {
      const c = scroll.y + scroll.vh * 0.5;
      let m: Mark | undefined;
      for (const k of marks) if (c >= k.top && c < k.top + k.h) m = k;
      if (!m) return;
      const p = clamp((c - m.top) / Math.max(1, m.h));
      const f = Math.min(m.to, Math.round(m.from + p * (m.to - m.from + 1) - 0.5));
      if (f !== lastF && folio.current) {
        lastF = f;
        folio.current.textContent = pad2(f);
      }
      if (m.label !== lastLabel && head.current) {
        lastLabel = m.label;
        head.current.textContent = m.label || fallback.current;
      }
      if (m.chapter !== lastCh && rail.current) {
        lastCh = m.chapter;
        rail.current.dataset.active = m.chapter;
        rail.current.querySelectorAll<HTMLElement>('[data-ch]').forEach((b) => {
          b.setAttribute('aria-current', b.dataset.ch === m!.chapter ? 'true' : 'false');
        });
      }
      if (bar.current) {
        // progress across the six chapters as a whole
        const first = marks.find((k) => k.chapter === '01');
        const last = [...marks].reverse().find((k) => k.chapter === '06');
        if (first && last) {
          const pp = clamp((c - first.top) / (last.top + last.h - first.top));
          bar.current.style.transform = `scaleY(${pp})`;
        }
      }
    });
    return () => {
      clearTimeout(t);
      off();
      offR();
    };
  }, [view, lang]);

  const onHome = view.view === 'home';

  return (
    <div className="chrome" aria-hidden={false}>
      <span className="chrome__tick chrome__tick--tl" aria-hidden="true" />
      <span className="chrome__tick chrome__tick--tr" aria-hidden="true" />
      <span className="chrome__tick chrome__tick--bl" aria-hidden="true" />
      <span className="chrome__tick chrome__tick--br" aria-hidden="true" />
      <div className="chrome__foot" aria-hidden="true">
        <span className="chrome__running" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' ? 'علي الجيلاني' : 'Ali Algailani'} <i>—</i> <span ref={head}>{t.runningDefault}</span>
        </span>
        <span className="chrome__folio" lang="en">
          <span ref={folio}>01</span>
          <i>/ 51</i>
        </span>
      </div>
      {onHome && (
        <nav className="rail" ref={rail} aria-label={t.chapters}>
          <span className="rail__track" aria-hidden="true">
            <span className="rail__bar" ref={bar} />
          </span>
          {CHAPTERS.map((c) => (
            <button
              key={c.n}
              type="button"
              className="rail__item"
              data-ch={c.n}
              aria-current="false"
              onClick={() => toSection(c.key === 'identity' ? 'identities' : c.key)}
            >
              <span className="rail__n" lang="en">
                {c.n}
              </span>
              <span className="rail__name" lang={lang}>
                {lang === 'ar' ? c.ar : c.en}
              </span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
