import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS, IDENTITIES, PRODUCTS, PROFILES, PRINTS, SOCIALS, LOGOS, routeOf, kindLabel, kindLabelAr, tx } from '../data/content';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import type { ChapterKey } from '../data/content';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { observeReveals } from '../lib/reveal';
import { REDUCED_MOTION, pad2 } from '../lib/env';
import { Ar, Eyebrow } from '../components/Text';

interface Item {
  key: string;
  kind: ChapterKey;
  n: number;
  total: number;
  name: string;
  nameAr?: string;
  sub: string;
  subAr?: string;
  img: string;
  to: string;
  contain?: boolean;
  bg?: string;
}

const ITEMS: Item[] = [
  ...LOGOS.map((l, i) => ({
    key: `lg-${l.id}`, kind: 'logos' as const, n: i + 1, total: LOGOS.length, name: l.name, sub: l.sector, subAr: l.sectorAr,
    img: `logos/${l.id}`, to: l.to, contain: true, bg: '#FFFFFF',
  })),
  ...IDENTITIES.map((p) => ({
    key: routeOf(p), kind: p.kind, n: p.index, total: IDENTITIES.length, name: p.name, sub: p.sector, subAr: p.sectorAr, img: p.tiles[0], to: routeOf(p),
  })),
  ...PRODUCTS.map((p) => ({
    key: routeOf(p), kind: p.kind, n: p.index, total: PRODUCTS.length, name: p.name, sub: p.sector, subAr: p.sectorAr, img: p.hero, to: routeOf(p), contain: true, bg: '#F4F4F3',
  })),
  ...PROFILES.map((p) => ({
    key: routeOf(p), kind: p.kind, n: p.index, total: PROFILES.length, name: p.name, sub: `${p.pageCount}-page corporate profile`, subAr: `بروفايل شركة · ${p.pageCount} ${p.pageCount >= 3 && p.pageCount <= 10 ? 'صفحات' : 'صفحة'}`, img: p.hero, to: routeOf(p), contain: true, bg: '#FFFFFF',
  })),
  ...PRINTS.map((p) => ({
    key: routeOf(p), kind: p.kind, n: p.index, total: PRINTS.length, name: p.name, nameAr: p.nameAr, sub: p.format, subAr: p.formatAr, img: p.cover, to: routeOf(p),
  })),
  ...SOCIALS.map((p) => ({
    key: routeOf(p), kind: p.kind, n: p.index, total: SOCIALS.length, name: p.name, sub: `${p.sector} · ${p.posts.length} posts`, subAr: `${p.sectorAr} · ${p.posts.length} منشورات`, img: p.cover, to: routeOf(p),
  })),
];

const filtersFor = (lang: Lang, all: string): { key: 'all' | ChapterKey; label: string }[] => [
  { key: 'all', label: all },
  ...CHAPTERS.map((c) => ({ key: c.key, label: lang === 'ar' ? c.ar : c.en })),
];

/**
 * Work archive — every piece in the portfolio with an animated filter. Filtering
 * never snaps: leaving cards fold away, staying cards glide to their new positions
 * (FLIP), and arriving cards rise in with a stagger.
 */
export function WorkArchive() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const FILTERS = filtersFor(lang, t.all);
  const [filter, setFilter] = useState<'all' | ChapterKey>('all');
  const cards = useRef(new Map<string, HTMLElement>());
  const first = useRef(new Map<string, DOMRect>());
  const prevShown = useRef<Set<string>>(new Set(ITEMS.map((i) => i.key)));
  const busy = useRef(false);

  const shown = useMemo(() => new Set(ITEMS.filter((i) => filter === 'all' || i.kind === filter).map((i) => i.key)), [filter]);

  useEffect(() => {
    observeReveals();
  }, []);

  const choose = (f: 'all' | ChapterKey) => {
    if (f === filter || busy.current) return;
    const next = new Set(ITEMS.filter((i) => f === 'all' || i.kind === f).map((i) => i.key));
    first.current.clear();
    cards.current.forEach((el, k) => {
      if (prevShown.current.has(k)) first.current.set(k, el.getBoundingClientRect());
    });
    if (REDUCED_MOTION) {
      setFilter(f);
      return;
    }
    busy.current = true;
    const leaving = [...prevShown.current].filter((k) => !next.has(k));
    leaving.forEach((k) =>
      cards.current.get(k)?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.92)' },
        ],
        { duration: 260, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' },
      ),
    );
    setTimeout(() => setFilter(f), leaving.length ? 240 : 0);
  };

  useLayoutEffect(() => {
    let k = 0;
    cards.current.forEach((el, key) => {
      el.getAnimations().forEach((a) => a.cancel());
      if (!shown.has(key)) return;
      const f = first.current.get(key);
      const r = el.getBoundingClientRect();
      if (f && prevShown.current.has(key)) {
        const dx = f.left - r.left;
        const dy = f.top - r.top;
        if (dx || dy)
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }], {
            duration: 700,
            easing: 'cubic-bezier(.76,0,.24,1)',
          });
      } else if (!REDUCED_MOTION && first.current.size) {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(40px) scale(.96)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 700, delay: 60 + k++ * 45, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
        );
      }
    });
    prevShown.current = new Set(shown);
    setTimeout(() => (busy.current = false), 300);
  }, [shown]);

  const count = (k: 'all' | ChapterKey) => (k === 'all' ? ITEMS.length : ITEMS.filter((i) => i.kind === k).length);

  return (
    <section className="archive" data-folio="4" data-label={t.allWork} aria-labelledby="archive-h">
      <header className="archive__head">
        <Eyebrow>{t.indexOfWork}</Eyebrow>
        <h1 id="archive-h" className={`archive__title ${isAr ? 'archive__title--ar' : ''}`}>
          {isAr ? (
            <>
              <Ar className="archive__main-ar">
                <span data-rv="">الأعمال</span>
              </Ar>
              <span className="archive__sub-en" data-rv="" lang="en" dir="ltr">
                All work
              </span>
            </>
          ) : (
            <>
              <span data-rv="">All work</span>
              <Ar className="archive__ar">
                <span data-rv="">الأعمال</span>
              </Ar>
            </>
          )}
        </h1>
        <p className="archive__sum" data-rv="">
          {t.archiveSum(ITEMS.length)}
        </p>
      </header>
      <div className="filters" role="toolbar" aria-label={t.filterLabel}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filters__btn ${filter === f.key ? 'is-on' : ''}`}
            aria-pressed={filter === f.key}
            onClick={() => choose(f.key)}
          >
            <span>{f.label}</span>
            <sup className="num">{pad2(count(f.key))}</sup>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t.showing(shown.size)}
      </p>
      <ul className="archive__grid">
        {ITEMS.map((it) => (
          <li
            key={it.key}
            ref={(el: HTMLElement | null) => {
              if (el) cards.current.set(it.key, el);
            }}
            className={`card ${shown.has(it.key) ? '' : 'is-hidden'} card--${it.kind}`}
            hidden={!shown.has(it.key)}
          >
            <RLink to={it.to} className="card__link" cursor="view">
              <span className={`card__media ${it.contain ? 'card__media--contain' : ''}`} style={it.bg ? { background: it.bg } : undefined}>
                <Img src={it.img} alt={`${it.name} — ${kindLabel[it.kind].toLowerCase()}`} />
              </span>
              <span className="card__text">
                <span className="card__kicker">
                  {isAr ? kindLabelAr[it.kind] : kindLabel[it.kind]} — <span className="num">{pad2(it.n)} / {pad2(it.total)}</span>
                </span>
                <span className="card__name">
                  <bdi>{tx(lang, it.name, it.nameAr)}</bdi>
                </span>
                <span className="card__sub">{tx(lang, it.sub, it.subAr)}</span>
              </span>
            </RLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
