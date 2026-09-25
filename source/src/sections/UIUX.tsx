import { useEffect, useRef, useState } from 'react';
import { PRODUCTS, CHAPTERS, routeOf } from '../data/content';
import type { UIProduct } from '../data/content';
import { SectionHeader } from '../components/SectionHeader';
import { ImageReveal } from '../components/ImageReveal';
import { Phone } from '../components/Phone';
import { RLink } from '../lib/router';
import { scroll } from '../lib/scroll';
import { pad2 } from '../lib/env';
import { Ar, Eyebrow, Numbering } from '../components/Text';
import { useLightbox } from '../components/Lightbox';
import { useLang } from '../lib/i18n';
import { tx } from '../data/content';

/**
 * One product: header, the hero composition from the PDF, then the "lab" — a sticky
 * phone beside the twelve annotated screens. Scrolling through the list drives the
 * phone; clicking a row (or swiping the phone) jumps straight to that screen.
 */
export function ProductLab({ p, compact = false }: { p: UIProduct; compact?: boolean }) {
  const { lang } = useLang();
  const isAr = lang === 'ar';
  const [i, setI] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const manual = useRef(0);

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const rows = Array.from(ol.querySelectorAll<HTMLElement>('li'));
    let last = -1;
    return scroll.onTick(() => {
      if (performance.now() - manual.current < 900) return;
      const line = scroll.vh * 0.55;
      let best = -1;
      rows.forEach((r, k) => {
        const b = r.getBoundingClientRect();
        if (b.top < line) best = k;
      });
      const first = rows[0]?.getBoundingClientRect();
      const lastR = rows[rows.length - 1]?.getBoundingClientRect();
      if (!first || !lastR || first.top > scroll.vh || lastR.bottom < 0) return;
      if (best >= 0 && best !== last) {
        last = best;
        setI(best);
      }
    });
  }, []);

  const pick = (k: number) => {
    manual.current = performance.now();
    setI(k);
  };

  return (
    <div className={`lab ${compact ? 'lab--compact' : ''}`} style={{ '--accent': p.accent }}>
      <div className="lab__device">
        <Phone screens={p.screens} index={i} onChange={pick} label={p.name} accent={p.accent} />
        <div className="lab__now" aria-hidden="true">
          <span className="lab__now-n num">{pad2(i + 1)}</span>
          {isAr ? <Ar className="lab__now-en">{p.screens[i].ar}</Ar> : <span className="lab__now-en">{p.screens[i].en}</span>}
          {isAr ? (
            <span className="lab__now-ar" lang="en" dir="ltr">
              {p.screens[i].en}
            </span>
          ) : (
            <Ar className="lab__now-ar">{p.screens[i].ar}</Ar>
          )}
        </div>
      </div>
      <ol className="lab__list" ref={list} aria-label={`${p.name} — selected screens`}>
        {p.screens.map((s, k) => (
          <li key={s.img} className={k === i ? 'is-on' : ''}>
            <button type="button" onClick={() => pick(k)} aria-pressed={k === i} data-cursor="view">
              <span className="lab__n num">{pad2(k + 1)}</span>
              {isAr ? <Ar className="lab__en">{s.ar}</Ar> : <span className="lab__en">{s.en}</span>}
              {isAr ? (
                <span className="lab__ar" lang="en" dir="ltr">
                  {s.en}
                </span>
              ) : (
                <Ar className="lab__ar">{s.ar}</Ar>
              )}
              <span className="lab__note">{tx(lang, s.note, s.noteAr)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Product({ p }: { p: UIProduct }) {
  const lb = useLightbox();
  const { t, lang } = useLang();
  return (
    <article
      className="ux"
      style={{ '--accent': p.accent }}
      data-folio={p.pages[0] + '-' + p.pages[p.pages.length - 1]}
      data-label={lang === 'ar' ? CHAPTERS[2].ar : CHAPTERS[2].en}
      data-chapter="03"
    >
      <header className="ux__head">
        <Numbering label={t.product} i={p.index} total={PRODUCTS.length} accent={p.accent} />
        <h3 className="ux__name" data-rv="" lang="en" dir="ltr">
          {p.name}
        </h3>
        <Ar className="ux__ar">{p.ar}</Ar>
        <div className="ux__meta" data-rv="">
          <Eyebrow>{tx(lang, p.sector, p.sectorAr)}</Eyebrow>
          <p className="ux__desc">{tx(lang, p.description, p.descriptionAr)}</p>
          <dl className="ux__dl">
            <div>
              <dt>{t.scope}</dt>
              <dd>{tx(lang, p.scope, p.scopeAr)}</dd>
            </div>
            <div>
              <dt>{t.year}</dt>
              <dd className="num">{p.year}</dd>
            </div>
          </dl>
        </div>
      </header>
      <div className="ux__stage">
        <ImageReveal
          src={p.hero}
          alt={`${p.name} — selected screens composition`}
          className="ux__hero"
          onClick={() => lb([{ src: p.hero, alt: `${p.name} — selected screens` }])}
        />
      </div>
      <ProductLab p={p} />
      <div className="ux__foot">
        <RLink to={routeOf(p)} className="ulink" cursor="view">
          {t.caseStudy(p.name)}
        </RLink>
      </div>
    </article>
  );
}

/** Chapter 03 — UI/UX, on a dark stage so the white app screens glow. */
export function UIUX() {
  return (
    <>
      <SectionHeader chapter={CHAPTERS[2]} token="uiux" />
      <section className="uiux" aria-label="UI / UX">
        {PRODUCTS.map((p) => (
          <Product key={p.id} p={p} />
        ))}
      </section>
    </>
  );
}
