import { useEffect, useRef, useState } from 'react';
import { IDENTITIES, CHAPTERS, routeOf, tx } from '../data/content';
import type { Identity } from '../data/content';
import { MARK_BG } from '../data/assets';
import { SectionHeader } from '../components/SectionHeader';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { scroll, docTop } from '../lib/scroll';
import { REDUCED_MOTION, clamp, isDesktop, pad2 } from '../lib/env';
import { useLang } from '../lib/i18n';
import { Ar, Eyebrow, Numbering } from '../components/Text';

function Palette({ colors }: { colors: string[] }) {
  return (
    <span className="palette" aria-label={`Palette: ${colors.join(', ')}`} dir="ltr">
      {colors.map((c) => (
        <span key={c} className="palette__chip" style={{ '--c': c }}>
          <i>{c}</i>
        </span>
      ))}
    </span>
  );
}

function IdentityPanel({ p }: { p: Identity }) {
  const { t, lang } = useLang();
  return (
    <article className="idp" style={{ '--accent': p.accent, '--card': MARK_BG[p.id] }} data-idp="">
      <div className="idp__text">
        <Numbering label={t.identity} i={p.index} total={IDENTITIES.length} accent={p.accent} />
        <h3 className="idp__name" lang="en" dir="ltr">
          {p.name}
        </h3>
        {p.ar && <Ar className="idp__ar">{p.ar}</Ar>}
        <span className="idp__rule" />
        <Eyebrow className="idp__sector">{tx(lang, p.sector, p.sectorAr)}</Eyebrow>
        <p className="idp__desc">{tx(lang, p.description, p.descriptionAr)}</p>
        <dl className="idp__meta">
          <div>
            <dt>{t.scope}</dt>
            <dd>{tx(lang, p.scope, p.scopeAr)}</dd>
          </div>
          <div>
            <dt>{t.year}</dt>
            <dd className="num">{p.year}</dd>
          </div>
        </dl>
        <Palette colors={p.palette} />
        <RLink to={routeOf(p)} className="idp__cta ulink" cursor="view">
          {t.openCase}
        </RLink>
      </div>
      <RLink to={routeOf(p)} className="idp__visual" cursor="view" label={p.name} tabIndex={-1}>
        <span className="idp__card" data-par="0.04">
          <Img src={p.mark} alt={`${p.name} primary mark`} />
          <span className="idp__card-label">{t.primaryMark}</span>
        </span>
        <span className="idp__tile idp__tile--a" data-par="0.12">
          <Img src={p.tiles[0]} alt={`${p.name} brand application`} />
        </span>
        <span className="idp__tile idp__tile--b" data-par="-0.08">
          <Img src={p.tiles[Math.min(2, p.tiles.length - 1)]} alt={`${p.name} brand application`} />
        </span>
      </RLink>
    </article>
  );
}

/**
 * Chapter 02 — Visual Identities. On desktop the chapter pins and the eight identities
 * travel sideways as you scroll down: a horizontal reel (right-to-left in Arabic).
 * Inside each panel the mark card and the application photos move at different speeds
 * for depth. On tablets and phones it becomes a vertical sequence that keeps the same
 * depth, driven by vertical scroll.
 */
export function Identities() {
  const { t, lang, dir } = useLang();
  const [wide, setWide] = useState(() => isDesktop());
  const sec = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => scroll.onResizeEnd(() => setWide(isDesktop())), []);

  // desktop reel
  useEffect(() => {
    if (!wide) return;
    const s = sec.current!;
    const st = sticky.current!;
    const t0 = track.current!;
    const sign = dir === 'rtl' ? 1 : -1;
    let top = 0,
      dist = 0,
      last = -1;
    let pars: { el: HTMLElement; k: number; base: number }[] = [];
    const measure = () => {
      const prev = t0.style.transform;
      t0.style.transform = 'none';
      dist = Math.max(0, t0.scrollWidth - window.innerWidth);
      s.style.height = `${dist + window.innerHeight}px`;
      top = docTop(s);
      const sl = st.getBoundingClientRect().left;
      pars = Array.from(t0.querySelectorAll<HTMLElement>('[data-par]')).map((el) => {
        const panel = el.closest('[data-idp]') as HTMLElement;
        const r = panel.getBoundingClientRect();
        return { el, k: Number(el.dataset.par), base: r.left - sl + r.width / 2 };
      });
      t0.style.transform = prev;
      last = -1;
    };
    measure();
    const t1 = setTimeout(measure, 300);
    const offR = scroll.onResizeEnd(measure);
    const off = scroll.onTick(() => {
      const p = clamp((scroll.y - top) / Math.max(1, dist));
      if (p === last) return;
      last = p;
      const x = sign * p * dist;
      t0.style.transform = `translate3d(${x}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const idx = Math.min(IDENTITIES.length, Math.max(1, Math.round(p * (IDENTITIES.length - 1)) + 1));
      if (num.current) num.current.textContent = pad2(idx);
      if (REDUCED_MOTION) return;
      const vw = window.innerWidth;
      for (const q of pars) {
        const c = q.base + x - vw / 2;
        q.el.style.transform = `translate3d(${c * q.k}px, 0, 0)`;
      }
    });
    return () => {
      clearTimeout(t1);
      off();
      offR();
      s.style.height = '';
      t0.style.transform = '';
      pars.forEach((q) => (q.el.style.transform = ''));
    };
  }, [wide, dir]);

  // tablet / phone: the same depth, driven by vertical scroll
  useEffect(() => {
    if (wide || REDUCED_MOTION) return;
    const els = Array.from(track.current!.querySelectorAll<HTMLElement>('[data-par]')).map((el) => ({
      el,
      k: Number(el.dataset.par),
      panel: el.closest('[data-idp]') as HTMLElement,
    }));
    const off = scroll.onTick(() => {
      const vh = scroll.vh;
      for (const q of els) {
        const r = q.panel.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const d = r.top + r.height / 2 - vh / 2;
        q.el.style.transform = `translate3d(0, ${d * q.k * -0.45}px, 0)`;
      }
    });
    return () => {
      off();
      els.forEach((q) => (q.el.style.transform = ''));
    };
  }, [wide]);

  return (
    <>
      <SectionHeader chapter={CHAPTERS[1]} token="identities" />
      <section
        ref={sec}
        className={`ids ${wide ? 'ids--reel' : 'ids--stack'}`}
        data-folio="8-23"
        data-label={lang === 'ar' ? CHAPTERS[1].ar : CHAPTERS[1].en}
        data-chapter="02"
        aria-label={t.visualIdentities}
      >
        <div className="ids__sticky" ref={sticky}>
          <div className="ids__track" ref={track}>
            <div className="ids__intro">
              <Eyebrow>{t.visualIdentities}</Eyebrow>
              <p className="ids__intro-n num">08</p>
              <ul className="ids__intro-list">
                {IDENTITIES.map((p) => (
                  <li key={p.id}>
                    <span className="num">{pad2(p.index)}</span> <bdi>{p.name}</bdi>
                  </li>
                ))}
              </ul>
              {wide && <span className="ids__hint">{t.reelHint}</span>}
            </div>
            {IDENTITIES.map((p) => (
              <IdentityPanel key={p.id} p={p} />
            ))}
          </div>
          {wide && (
            <div className="ids__progress" aria-hidden="true">
              <span className="ids__count num">
                <span ref={num}>01</span> / 08
              </span>
              <span className="ids__bar">
                <span ref={bar} />
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
