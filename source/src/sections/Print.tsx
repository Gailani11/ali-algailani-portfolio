import { useRef } from 'react';
import { PRINTS, CHAPTERS, routeOf } from '../data/content';
import type { PrintPiece } from '../data/content';
import { SectionHeader } from '../components/SectionHeader';
import { ImageReveal } from '../components/ImageReveal';
import { Img } from '../components/Img';
import { RLink } from '../lib/router';
import { useLightbox } from '../components/Lightbox';
import type { Shot } from '../components/Lightbox';
import { useScene } from '../hooks/useScene';
import { REDUCED_MOTION, clamp, pad2 } from '../lib/env';
import { Ar } from '../components/Text';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { tx } from '../data/content';

const shotsOf = (p: PrintPiece, lang: Lang): Shot[] => {
  const name = tx(lang, p.name, p.nameAr);
  const format = tx(lang, p.format, p.formatAr);
  return [
    ...p.images.map((s, i) => ({ src: s, alt: `${p.name} — ${i === 0 ? 'mockup' : `page ${i}`}`, caption: `${name} · ${format}` })),
    ...(p.strip ? [{ src: p.strip, alt: `${p.name} — all pages`, caption: name }] : []),
  ];
};

function PieceHead({ p }: { p: PrintPiece }) {
  const { lang } = useLang();
  return (
    <header className="piece__head">
      <span className="piece__n num">05.{p.index}</span>
      <RLink to={routeOf(p)} className="piece__name" cursor="view">
        <bdi>{tx(lang, p.name, p.nameAr)}</bdi>
        {p.ar && <Ar className="piece__ar">{p.ar}</Ar>}
      </RLink>
      <span className="piece__format">{tx(lang, p.format, p.formatAr)}</span>
    </header>
  );
}

/** Menus: the hero mockup large, the flat pages laid out beside it like proofs on a table. */
function Menu({ p }: { p: PrintPiece }) {
  const lb = useLightbox();
  const { lang } = useLang();
  const shots = shotsOf(p, lang);
  const [hero, ...pages] = p.images;
  return (
    <article className={`piece piece--menu`} style={{ '--accent': p.accent }} data-folio={String(p.pages[0])} data-label={lang === 'ar' ? CHAPTERS[4].ar : CHAPTERS[4].en} data-chapter="05">
      <PieceHead p={p} />
      <div className="piece__menu">
        <ImageReveal src={hero} alt={`${p.name} — menu mockup`} className="piece__hero" onClick={() => lb(shots, 0)} />
        <div className={`piece__proofs piece__proofs--${pages.length}`}>
          {pages.map((s, i) => (
            <button
              key={s}
              type="button"
              className="proof"
              data-rv=""
              style={{ '--d': `${i * 90}ms`, '--r': `${(i % 2 ? 1 : -1) * (1 + i * 0.4)}deg` }}
              onClick={() => lb(shots, i + 1)}
              data-cursor="explore"
              aria-label={`Open ${p.name} page ${i + 1}`}
            >
              <Img src={s} alt={`${p.name} — page ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Brochures: hero mockup, then every page as a strip. */
function Brochure({ p, flip }: { p: PrintPiece; flip?: boolean }) {
  const lb = useLightbox();
  const { lang } = useLang();
  const shots = shotsOf(p, lang);
  return (
    <article className={`piece piece--brochure ${flip ? 'is-flip' : ''}`} style={{ '--accent': p.accent }} data-folio={String(p.pages[0])} data-label={lang === 'ar' ? CHAPTERS[4].ar : CHAPTERS[4].en} data-chapter="05">
      <PieceHead p={p} />
      <ImageReveal src={p.images[0]} alt={`${p.name} — brochure mockup`} className="piece__hero" from={flip ? 'right' : 'left'} onClick={() => lb(shots, 0)} />
      {p.strip && (
        <button type="button" className="piece__strip" data-rv="" onClick={() => lb(shots, shots.length - 1)} data-cursor="explore" aria-label={`Open all pages of ${p.name}`}>
          <Img src={p.strip} alt={`${p.name} — all pages`} />
        </button>
      )}
    </article>
  );
}

/** The KOPII fold-out: it unfolds panel by panel as it scrolls into view. */
function Foldout({ p }: { p: PrintPiece }) {
  const lb = useLightbox();
  const { lang } = useLang();
  const shots = shotsOf(p, lang);
  const a = useRef<HTMLButtonElement>(null);
  const ref = useScene<HTMLElement>(
    (q) => {
      if (!a.current || REDUCED_MOTION) return;
      const o = clamp(q * 1.6);
      a.current.style.clipPath = `inset(0 ${(1 - o) * 62}% 0 0 round 10px)`;
    },
    { start: (t, _h, vh) => t - vh * 0.9, end: (t, h) => t + h * 0.5 },
  );
  return (
    <article ref={ref} className="piece piece--fold" style={{ '--accent': p.accent }} data-folio={String(p.pages[0])} data-label={lang === 'ar' ? CHAPTERS[4].ar : CHAPTERS[4].en} data-chapter="05">
      <PieceHead p={p} />
      <button ref={a} type="button" className="piece__fold" onClick={() => lb(shots, 0)} data-cursor="explore" aria-label={`Open ${p.name} fold-out, outside`}>
        <Img src={p.images[0]} alt={`${p.name} — fold-out leaflet, standing`} />
      </button>
      <button type="button" className="piece__flat" data-rv="" onClick={() => lb(shots, 1)} data-cursor="explore" aria-label={`Open ${p.name} fold-out, flat`}>
        <Img src={p.images[1]} alt={`${p.name} — fold-out leaflet, all seven panels flat`} />
      </button>
    </article>
  );
}

/** Chapter 05 — Print. White, quiet, with real paper depth in the shadows. */
export function Print() {
  const { t, lang } = useLang();
  const [abus, care, amal, ghamsa, kopii] = PRINTS;
  return (
    <>
      <SectionHeader chapter={CHAPTERS[4]} token="print" />
      <section className="print" aria-label={lang === 'ar' ? CHAPTERS[4].ar : CHAPTERS[4].en}>
        <div className="print__head" data-folio="39" data-label={lang === 'ar' ? CHAPTERS[4].ar : CHAPTERS[4].en} data-chapter="05">
          <p className="print__lede" data-rv="">
            {t.printLede[0]}
            <br />
            <span>{t.printLede[1](pad2(PRINTS.length))}</span>
          </p>
        </div>
        <Menu p={amal} />
        <Menu p={ghamsa} />
        <Foldout p={kopii} />
        <Brochure p={abus} />
        <Brochure p={care} flip />
      </section>
    </>
  );
}
