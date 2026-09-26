import { useEffect, useRef } from 'react';
import { LOGOS, CHAPTERS, tx } from '../data/content';
import { SectionHeader } from '../components/SectionHeader';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { useScene } from '../hooks/useScene';
import { FINE_POINTER, REDUCED_MOTION, clamp, pad2 } from '../lib/env';
import { useLang } from '../lib/i18n';
import { Eyebrow } from '../components/Text';

/**
 * Chapter 01 — the "Selected Work" logo field from p. 06. Nine marks on a white field
 * divided by hairlines, set with generous air. The field arrives tilted back in space
 * and settles flat as it reaches the reader; hovering a mark lifts it and names the
 * client. On touch screens the row crossing the middle of the screen takes that
 * focus instead, so the interaction survives without a mouse.
 */
export function Logos() {
  const { t, lang } = useLang();
  const grid = useRef<HTMLUListElement>(null);
  const scene = useScene<HTMLDivElement>(
    (p) => {
      if (!grid.current || REDUCED_MOTION) return;
      const q = 1 - clamp(p * 1.8);
      grid.current.style.transform = `perspective(1400px) rotateX(${q * 22}deg) scale(${1 - q * 0.08}) translate3d(0, ${q * 8}vh, 0)`;
      grid.current.style.opacity = String(1 - q * 0.6);
    },
    { start: (t0, _h, vh) => t0 - vh, end: (t0, h) => t0 + h * 0.2 },
  );

  // touch: scroll focus replaces hover
  useEffect(() => {
    if (FINE_POINTER || !grid.current) return;
    const links = grid.current.querySelectorAll<HTMLElement>('.logos__link');
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle('is-focus', e.isIntersecting)),
      { rootMargin: '-44% 0px -44% 0px' },
    );
    links.forEach((l) => io.observe(l));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SectionHeader chapter={CHAPTERS[0]} token="logos" />
      <section className="logos" data-folio="6" data-label={lang === 'ar' ? CHAPTERS[0].ar : CHAPTERS[0].en} data-chapter="01" aria-label={t.selectedWork}>
        <div className="logos__head">
          <Eyebrow>{t.selectedWork}</Eyebrow>
          <Eyebrow>{t.count('logos', pad2(LOGOS.length))}</Eyebrow>
        </div>
        <div className="logos__stage" ref={scene}>
          <ul className="logos__grid" ref={grid}>
            {LOGOS.map((l, i) => (
              <li key={l.id} className="logos__cell" data-rv="" style={{ '--d': `${(i % 3) * 80 + Math.floor(i / 3) * 120}ms` }}>
                <RLink to={l.to} className="logos__link" cursor="view" label={`${l.name} — ${tx(lang, l.sector, l.sectorAr)}`}>
                  <span className="logos__n num">{pad2(i + 1)}</span>
                  <span className="logos__img">
                    <Img src={`logos/${l.id}`} alt={`${l.name} logo`} />
                  </span>
                  <span className="logos__info">
                    <span className="logos__name" lang="en">
                      {l.name}
                    </span>
                    <span className="logos__sector">{tx(lang, l.sector, l.sectorAr)}</span>
                  </span>
                </RLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
