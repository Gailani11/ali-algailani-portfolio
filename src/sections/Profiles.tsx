import { useRef } from 'react';
import { PROFILES, CHAPTERS, routeOf } from '../data/content';
import type { Profile } from '../data/content';
import { SectionHeader } from '../components/SectionHeader';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { useScene } from '../hooks/useScene';
import { REDUCED_MOTION, clamp } from '../lib/env';
import { Ar, Numbering } from '../components/Text';
import { useLang } from '../lib/i18n';
import { tx } from '../data/content';

function Publication({ p, i }: { p: Profile; i: number }) {
  const book = useRef<HTMLSpanElement>(null);
  const { t, lang } = useLang();
  // The publication opens toward the reader as it rises into view.
  const ref = useScene<HTMLElement>(
    (q) => {
      if (!book.current || REDUCED_MOTION) return;
      const o = 1 - clamp(q * 1.7);
      book.current.style.transform = `perspective(1600px) rotateX(${o * 26}deg) rotateZ(${(i % 2 ? 1 : -1) * o * 3}deg) translate3d(0, ${o * 60}px, 0)`;
      book.current.style.opacity = String(1 - o * 0.7);
    },
    { start: (t, _h, vh) => t - vh, end: (t, h, vh) => t + h * 0.4 - vh * 0.2 },
  );
  return (
    <article
      ref={ref}
      className={`pub pub--${i % 3}`}
      style={{ '--accent': p.accent }}
      data-folio={String(p.pages[0])}
      data-label={lang === 'ar' ? CHAPTERS[3].ar : CHAPTERS[3].en}
      data-chapter="04"
    >
      <RLink to={routeOf(p)} className="pub__link" cursor="view" label={`${p.name} — ${t.pages(p.pageCount)}`}>
        <span className="pub__plinth">
          <span className="pub__book" ref={book}>
            <Img src={p.hero} alt={`${p.name} corporate profile — cover and spread`} />
          </span>
          <span className="pub__pages">{t.pages(p.pageCount)}</span>
        </span>
        <span className="pub__text">
          <Numbering label={t.profile} i={p.index} total={PROFILES.length} accent={p.accent} />
          <span className="pub__name" lang="en" dir="ltr">
            {p.name}
          </span>
          <Ar className="pub__ar">{p.ar}</Ar>
          <span className="pub__desc">{tx(lang, p.description, p.descriptionAr)}</span>
          <span className="pub__meta">
            {tx(lang, p.language, p.languageAr)} · {tx(lang, p.scope, p.scopeAr)} · {p.year}
          </span>
        </span>
      </RLink>
    </article>
  );
}

/**
 * Chapter 04 — Company Profiles: six publications resting on a warm stone ground.
 * Each tips open toward the reader as it arrives, lifts on hover, and opens into a
 * full case study with every page of the document.
 */
export function Profiles() {
  const { t, lang } = useLang();
  return (
    <>
      <SectionHeader chapter={CHAPTERS[3]} token="profiles" />
      <section className="library" aria-label={lang === 'ar' ? CHAPTERS[3].ar : CHAPTERS[3].en}>
        <header className="library__head" data-folio="32" data-label={lang === 'ar' ? CHAPTERS[3].ar : CHAPTERS[3].en} data-chapter="04">
          <p className="library__lede" data-rv="">
            {t.profilesLede}
          </p>
        </header>
        <div className="library__grid">
          {PROFILES.map((p, i) => (
            <Publication key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
