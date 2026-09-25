import { useRef } from 'react';
import { CHAPTERS, countOf } from '../data/content';
import type { Chapter } from '../data/content';
import { useScene } from '../hooks/useScene';
import { REDUCED_MOTION, clamp, pad2 } from '../lib/env';
import { Ar } from './Text';
import { useLang } from '../lib/i18n';

/**
 * Chapter divider — the PDF's black "SECTION" pages, brought to life.
 * A giant ghost numeral drifts and shrinks behind the Arabic chapter title while the
 * English name tightens its tracking as you scroll through.
 */
export function SectionHeader({ chapter, token }: { chapter: Chapter; token: string }) {
  const num = useRef<HTMLSpanElement>(null);
  const en = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();

  const ref = useScene<HTMLElement>(
    (p) => {
      if (REDUCED_MOTION) return;
      const s = 1.35 - p * 0.5;
      if (num.current) num.current.style.transform = `translate3d(-50%, calc(-50% + ${(p - 0.5) * -18}vh), 0) scale(${s})`;
      if (en.current) en.current.style.letterSpacing = `${0.95 - clamp(p * 1.6) * 0.5}em`;
      if (title.current) {
        const o = clamp(1 - Math.abs(p - 0.5) * 2.1, 0, 1);
        title.current.style.opacity = String(0.15 + o * 0.85);
        title.current.style.transform = `translate3d(0, ${(p - 0.5) * -60}px, 0)`;
      }
    },
    {},
  );

  return (
    <section
      ref={ref}
      className="chapter"
      data-section={token}
      data-folio={String(chapter.page)}
      data-label={lang === 'ar' ? chapter.ar : `${t.section} ${chapter.n}`}
      data-chapter={chapter.n}
      aria-labelledby={`ch-${chapter.n}`}
    >
      <div className="chapter__sticky">
        <div className="chapter__meta">
          <span className="eyebrow">{t.section}</span>
          <span className="eyebrow num">2026</span>
        </div>
        <span className="chapter__num" ref={num} aria-hidden="true">
          {chapter.n}
        </span>
        <div className="chapter__title" ref={title}>
          <span className="eyebrow chapter__kicker">{t.section}</span>
          <h2 id={`ch-${chapter.n}`} className="chapter__h">
            <Ar className="chapter__ar">{chapter.ar}</Ar>
            <span className="chapter__en" ref={en} lang="en" dir="ltr">
              {chapter.en}
            </span>
          </h2>
          <span className="chapter__count">{t.count(chapter.key, pad2(countOf[chapter.key]))}</span>
        </div>
        <ol className="chapter__row" aria-hidden="true" dir="ltr">
          {CHAPTERS.map((c) => (
            <li key={c.n} className={c.n === chapter.n ? 'is-on' : ''}>
              {c.n}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
