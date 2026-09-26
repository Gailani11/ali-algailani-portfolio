import { useEffect, useRef } from 'react';
import { CHAPTERS, countOf, ALL_PROJECTS, LOGOS } from '../data/content';
import { useRouter, RLink } from '../lib/router';
import { assetUrl } from '../components/Img';
import { FINE_POINTER, REDUCED_MOTION, pad2 } from '../lib/env';
import { Ar, Eyebrow } from '../components/Text';
import { useLang } from '../lib/i18n';

const PREVIEW: Record<string, string> = {
  logos: 'id/afak/03',
  identity: 'id/gift-zone/01',
  uiux: 'ui/fully-charged/hero',
  profiles: 'cp/bits-arabia/hero',
  print: 'pr/amals-kitchen/01',
  social: 'sm/kopii/03',
};

/**
 * The PDF's contents page (الفهرس) as the site's index. Hovering a chapter floats a
 * preview of its work beside the pointer; choosing one glides to it.
 */
export function Contents() {
  const { toSection } = useRouter();
  const float = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    const el = list.current;
    const fl = float.current;
    if (!el || !fl || !FINE_POINTER || REDUCED_MOTION) return;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      on = false;
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      fl.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${(tx - x) * 0.02}deg)`;
      raf = on || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const over = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>('[data-prev]');
      imgs.current.forEach((im, i) => im && im.classList.toggle('is-on', !!row && String(i) === row.dataset.prev));
      on = !!row;
      fl.classList.toggle('is-on', on);
    };
    const leave = () => {
      on = false;
      fl.classList.remove('is-on');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerover', over);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerover', over);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const total = ALL_PROJECTS.length + LOGOS.length;

  return (
    <section className="contents" data-section="index" data-folio="4" data-label={t.nav.index} aria-labelledby="contents-h">
      <div className="contents__head">
        <h2 id="contents-h" className="contents__title">
          <Ar className="contents__ar">
            <span data-rv="">الفهرس</span>
          </Ar>
          <span className="contents__en" data-rv="" lang="en" dir="ltr">
            Index
          </span>
        </h2>
      </div>
      <ol className="contents__list" ref={list}>
        {CHAPTERS.map((c, i) => (
          <li key={c.n} data-rv="" style={{ '--d': `${i * 70}ms` }}>
            <button
              type="button"
              className="contents__row"
              data-prev={i}
              data-cursor="view"
              onClick={() => toSection(c.key === 'identity' ? 'identities' : c.key)}
            >
              <span className="contents__n num">{c.n}</span>
              <span className="contents__p num">P.{pad2(c.page)}</span>
              <span className="contents__count">{t.count(c.key, pad2(countOf[c.key]))}</span>
              <span className="contents__names">
                <Ar className="contents__name-ar">{c.ar}</Ar>
                <span className="contents__name-en" lang="en">
                  {c.en}
                </span>
              </span>
              <span className="contents__thumb" aria-hidden="true">
                <img src={assetUrl(PREVIEW[c.key])} alt="" loading="lazy" decoding="async" />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="contents__foot" data-rv="">
        <Eyebrow>{t.piecesAcross(total)}</Eyebrow>
        <RLink to="work" className={`contents__all ulink ${lang === 'ar' ? 'ar' : ''}`} cursor="view">
          {t.browseAll}
        </RLink>
      </div>
      <div className="contents__float" ref={float} aria-hidden="true">
        {CHAPTERS.map((c, i) => (
          <img
            key={c.key}
            ref={(el: HTMLImageElement | null) => (imgs.current[i] = el)}
            src={assetUrl(PREVIEW[c.key])}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </section>
  );
}
