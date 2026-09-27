import { useEffect, useRef } from 'react';
import { SOCIALS, CHAPTERS, routeOf } from '../data/content';
import type { SocialSet } from '../data/content';
import { SectionHeader } from '../components/SectionHeader';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { useLightbox } from '../components/Lightbox';
import { scroll } from '../lib/scroll';
import { REDUCED_MOTION, pad2 } from '../lib/env';
import { Ar } from '../components/Text';
import { useLang } from '../lib/i18n';
import { tx } from '../data/content';

/** Horizontal rail that can be scrolled natively, swiped, or dragged with the mouse. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false,
      moved = 0,
      sx = 0,
      sl = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      moved = 0;
      sx = e.clientX;
      sl = el.scrollLeft;
      el.classList.add('is-grabbing');
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = sl - dx;
    };
    const pu = () => {
      down = false;
      el.classList.remove('is-grabbing');
    };
    // a drag should not also count as a click on the post under the pointer
    const click = (e: MouseEvent) => {
      if (moved > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    el.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    el.addEventListener('click', click, true);
    return () => {
      el.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
      el.removeEventListener('click', click, true);
    };
  }, []);
  return ref;
}

function Brand({ s }: { s: SocialSet }) {
  const lb = useLightbox();
  const { t, lang } = useLang();
  const rail = useDragScroll<HTMLDivElement>();
  const shots = [
    { src: s.phone, alt: `${s.name} — Instagram feed on a phone` },
    ...s.posts.map((p, i) => ({ src: p, alt: `${s.name} — post ${i + 1}` })),
  ];
  // mark rails that scroll so a soft edge hints at more posts
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const check = () => el.classList.toggle('has-more', el.scrollWidth > el.clientWidth + 4);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();
    return () => ro.disconnect();
  }, [rail]);
  return (
    <article
      className="brand"
      style={{ '--accent': s.accent }}
      data-folio={String(s.pages[0])}
      data-label={lang === 'ar' ? CHAPTERS[5].ar : CHAPTERS[5].en}
      data-chapter="06"
    >
      <header className="brand__head">
        <span className="brand__n num">06.{s.index}</span>
        <RLink to={routeOf(s)} className="brand__name" cursor="view" lang="en" dir="ltr">
          {s.name}
        </RLink>
        {s.ar && <Ar className="brand__ar">{s.ar}</Ar>}
        <span className="brand__meta">
          {tx(lang, s.sector, s.sectorAr)} · {t.posts(pad2(s.posts.length))}
        </span>
      </header>
      <div className="brand__body">
        <button type="button" className="brand__phone" data-rv="" onClick={() => lb(shots, 0)} data-cursor="explore" aria-label={`${s.name} — feed`}>
          <Img src={s.phone} alt={`${s.name} — Instagram feed on a phone`} />
        </button>
        <div className={`brand__rail ${s.posts.length <= 3 ? 'brand__rail--one' : ''}`} ref={rail} data-native-scroll="" data-cursor="drag" tabIndex={0} aria-label={`${s.name} — ${t.posts(pad2(s.posts.length))}`}>
          {s.posts.map((p, i) => (
            <button
              key={p}
              type="button"
              className="post"
              data-rv=""
              style={{ '--d': `${i * 70}ms` }}
              onClick={() => lb(shots, i + 1)}
              data-cursor="explore"
              aria-label={`${s.name} — post ${i + 1}`}
            >
              <Img src={p} alt={`${s.name} — post ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * Chapter 06 — Social Media. The loudest chapter: black ground, a brand-name marquee
 * that speeds up with your scroll, phones, and swipeable post rails per brand.
 */
export function Social() {
  const { lang } = useLang();
  const marquee = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const m = marquee.current;
    if (!m || REDUCED_MOTION) return;
    let x = 0;
    return scroll.onTick((_t, dt) => {
      const r = m.getBoundingClientRect();
      if (r.bottom < -50 || r.top > scroll.vh + 50) return;
      const speed = 0.05 + Math.min(2.2, Math.abs(scroll.velocity) * 0.08);
      x -= speed * dt * (scroll.velocity < 0 ? -1 : 1);
      const w = m.scrollWidth / 2;
      if (x < -w) x += w;
      if (x > 0) x -= w;
      m.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }, []);
  const names = SOCIALS.map((s) => s.name);
  return (
    <>
      <SectionHeader chapter={CHAPTERS[5]} token="social" />
      <section className="social" aria-label={lang === 'ar' ? CHAPTERS[5].ar : CHAPTERS[5].en}>
        <div className="social__marquee" aria-hidden="true" dir="ltr" lang="en" data-folio="45" data-label={lang === 'ar' ? CHAPTERS[5].ar : CHAPTERS[5].en} data-chapter="06">
          <div className="social__marquee-in" ref={marquee}>
            {[...names, ...names, ...names, ...names].map((n, i) => (
              <span key={i}>
                {n}
                <i className="social__dot" />
              </span>
            ))}
          </div>
        </div>
        {SOCIALS.map((s) => (
          <Brand key={s.id} s={s} />
        ))}
      </section>
    </>
  );
}
