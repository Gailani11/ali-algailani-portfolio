import { useEffect, useRef, useState } from 'react';
import { ALL_PROJECTS, findProject, routeOf, kindLabel, kindLabelAr, countOf, chapterOf, IDENTITIES, tx } from '../data/content';
import type { Project, Identity, UIProduct, Profile, PrintPiece, SocialSet } from '../data/content';
import { MARK_BG, DIMS } from '../data/assets';
import { Img, assetUrl } from '../components/Img';
import { ImageReveal } from '../components/ImageReveal';
import { useLightbox } from '../components/Lightbox';
import type { Shot } from '../components/Lightbox';
import { RLink, useRouter } from '../lib/router';
import { observeReveals } from '../lib/reveal';
import { useScene } from '../hooks/useScene';
import { REDUCED_MOTION, clamp, pad2 } from '../lib/env';
import { Ar, Eyebrow, MaskLines } from '../components/Text';
import { ProductLab } from '../sections/UIUX';
import { useDragScroll } from '../sections/Social';
import { useLang } from '../lib/i18n';
import type { Dict } from '../lib/i18n';

const pagesLabel = (p: Project, t: Dict) =>
  p.pages.length > 1 ? t.pagesLabel(pad2(p.pages[0]), pad2(p.pages[p.pages.length - 1])) : t.pagesLabel(pad2(p.pages[0]));

function Facts({ p }: { p: Project }) {
  const { t, lang } = useLang();
  const ch = chapterOf(p.kind);
  const rows: [string, string][] = [
    [t.sector, tx(lang, p.sector, p.sectorAr)],
    ...(p.scope ? ([[t.scope, tx(lang, p.scope, p.scopeAr)]] as [string, string][]) : []),
    ...(p.kind === 'print' ? ([[t.format, tx(lang, (p as PrintPiece).format, (p as PrintPiece).formatAr)]] as [string, string][]) : []),
    ...(p.kind === 'profiles'
      ? ([[t.length, `${t.pages((p as Profile).pageCount)} · ${tx(lang, (p as Profile).language, (p as Profile).languageAr)}`]] as [string, string][])
      : []),
    [t.year, p.year],
    [t.chapter, `${ch.n} — ${lang === 'ar' ? ch.ar : ch.en}`],
    [t.inTheBook, pagesLabel(p, t)],
  ];
  return (
    <dl className="facts">
      {rows.map(([k, v], i) => (
        <div key={k} data-rv="" style={{ '--d': `${i * 60}ms` }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Story({ p }: { p: Project }) {
  const { t, lang } = useLang();
  if (!p.description) return null;
  return (
    <section className="case__story">
      <Eyebrow>{p.kind === 'identity' ? t.brandStory : p.kind === 'uiux' ? t.theProduct : t.theDocument}</Eyebrow>
      <p className={`case__story-text ${lang === 'ar' ? 'case__story-text--ar' : ''}`} data-rv="">
        {tx(lang, p.description, p.descriptionAr)}
      </p>
    </section>
  );
}

function PaletteBlock({ p }: { p: Identity }) {
  const { t } = useLang();
  const [copied, setCopied] = useState('');
  const copy = async (c: string) => {
    try {
      await navigator.clipboard.writeText(c);
      setCopied(c);
      setTimeout(() => setCopied(''), 1400);
    } catch {
      /* the hex stays visible for manual copying */
    }
  };
  return (
    <section className="case__block">
      <header className="case__block-head">
        <Eyebrow>{t.palette}</Eyebrow>
        <span className="case__block-note">{t.clickToCopy}</span>
      </header>
      <ul className="swatches" dir="ltr">
        {p.palette.map((c, i) => (
          <li key={c} data-rv="" style={{ '--d': `${i * 80}ms`, '--c': c }}>
            <button type="button" onClick={() => copy(c)} data-cursor="copy" aria-label={`Copy ${c}`}>
              <span className="swatches__fill" />
              <span className="swatches__hex">{copied === c ? t.copied : c}</span>
              <span className="swatches__n">{pad2(i + 1)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IdentityBody({ p }: { p: Identity }) {
  const lb = useLightbox();
  const { t } = useLang();
  const shots: Shot[] = [
    { src: p.mark, alt: `${p.name} primary mark` },
    ...p.tiles.map((tile, i) => ({ src: tile, alt: `${p.name} — application ${i + 1}` })),
  ];
  return (
    <>
      <section className="case__block">
        <header className="case__block-head">
          <Eyebrow>{t.primaryMark}</Eyebrow>
        </header>
        <button type="button" className="case__mark" style={{ background: MARK_BG[p.id] }} onClick={() => lb(shots, 0)} data-cursor="explore" data-rv="" aria-label={`Open ${p.name} primary mark`}>
          <Img src={p.mark} alt={`${p.name} primary mark`} />
        </button>
      </section>
      <PaletteBlock p={p} />
      <section className="case__block">
        <header className="case__block-head">
          <Eyebrow>{t.applications}</Eyebrow>
          <span className="case__block-note">{t.images(pad2(p.tiles.length))}</span>
        </header>
        <div className={`gallery gallery--${Math.min(p.tiles.length, 9)}`}>
          {p.tiles.map((tile, i) => (
            <ImageReveal key={tile} src={tile} alt={`${p.name} — application ${i + 1}`} className={`gallery__item gallery__item--${i}`} delay={(i % 3) * 90} fit="cover" onClick={() => lb(shots, i + 1)} />
          ))}
        </div>
      </section>
    </>
  );
}

function UIBody({ p }: { p: UIProduct }) {
  const lb = useLightbox();
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const shots: Shot[] = p.screens.map((s, i) => ({
    src: s.img,
    alt: `${p.name} — ${s.en}`,
    caption: `${pad2(i + 1)} · ${isAr ? s.ar : s.en} — ${tx(lang, s.note, s.noteAr)}`,
  }));
  return (
    <>
      <section className="case__block case__block--dark">
        <header className="case__block-head">
          <Eyebrow>{t.interactiveScreens}</Eyebrow>
          <span className="case__block-note">{t.interactiveNote}</span>
        </header>
        <ProductLab p={p} compact />
      </section>
      <section className="case__block">
        <header className="case__block-head">
          <Eyebrow>{t.allScreens}</Eyebrow>
          <span className="case__block-note">{t.screens(pad2(p.screens.length))}</span>
        </header>
        <ol className="screens">
          {p.screens.map((s, i) => (
            <li key={s.img} data-rv="" style={{ '--d': `${(i % 6) * 60}ms` }}>
              <button type="button" onClick={() => lb(shots, i)} data-cursor="explore" aria-label={`Open screen ${i + 1}: ${s.en}`}>
                <Img src={s.img} alt={`${p.name} — ${s.en}`} />
              </button>
              <span className="screens__n num">{pad2(i + 1)}</span>
              {isAr ? <Ar className="screens__en">{s.ar}</Ar> : <span className="screens__en">{s.en}</span>}
              {isAr ? (
                <span className="screens__ar" lang="en" dir="ltr">
                  {s.en}
                </span>
              ) : (
                <Ar className="screens__ar">{s.ar}</Ar>
              )}
              <span className="screens__note">{tx(lang, s.note, s.noteAr)}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function StripBlock({ src, alt, label, count }: { src: string; alt: string; label: string; count?: string }) {
  const lb = useLightbox();
  const { t } = useLang();
  const rail = useDragScroll<HTMLDivElement>();
  return (
    <section className="case__block">
      <header className="case__block-head">
        <Eyebrow>{label}</Eyebrow>
        {count && <span className="case__block-note">{count}</span>}
      </header>
      <div className="strip" ref={rail} data-native-scroll="" data-cursor="drag" tabIndex={0} aria-label={alt} dir="ltr">
        <img
          src={assetUrl(src)}
          alt={alt}
          width={DIMS[src]?.[0]}
          height={DIMS[src]?.[1]}
          loading="lazy"
          decoding="async"
          draggable={false}
          onDoubleClick={() => lb([{ src, alt }])}
        />
      </div>
      <button type="button" className="strip__open ulink" onClick={() => lb([{ src, alt }])}>
        {t.viewFullSize}
      </button>
    </section>
  );
}

function ProfileBody({ p }: { p: Profile }) {
  const { t } = useLang();
  return <StripBlock src={p.strip} alt={`${p.name} — every page of the profile`} label={t.completeDocument} count={t.pages(p.pageCount)} />;
}

function PrintBody({ p }: { p: PrintPiece }) {
  const lb = useLightbox();
  const { t } = useLang();
  const shots: Shot[] = p.images.map((s, i) => ({ src: s, alt: `${p.name} — ${i + 1}` }));
  const rest = p.images.slice(1);
  return (
    <>
      {rest.length > 0 && (
        <section className="case__block">
          <header className="case__block-head">
            <Eyebrow>{p.id === 'kopii-leaflet' ? t.laidFlat : t.pagesTitle}</Eyebrow>
          </header>
          <div className={`proofs proofs--${rest.length}`}>
            {rest.map((s, i) => (
              <ImageReveal key={s} src={s} alt={`${p.name} — ${i + 2}`} delay={i * 90} onClick={() => lb(shots, i + 1)} />
            ))}
          </div>
        </section>
      )}
      {p.strip && <StripBlock src={p.strip} alt={`${p.name} — all pages`} label={t.allPages} />}
    </>
  );
}

function SocialBody({ p }: { p: SocialSet }) {
  const lb = useLightbox();
  const { t } = useLang();
  const shots: Shot[] = [{ src: p.phone, alt: `${p.name} — feed` }, ...p.posts.map((s, i) => ({ src: s, alt: `${p.name} — post ${i + 1}` }))];
  return (
    <section className="case__block case__block--dark">
      <header className="case__block-head">
        <Eyebrow>{t.feedPosts}</Eyebrow>
        <span className="case__block-note">{t.posts(pad2(p.posts.length))}</span>
      </header>
      <div className="feed">
        <button type="button" className="feed__phone" onClick={() => lb(shots, 0)} data-cursor="explore" data-rv="" aria-label={`Open ${p.name} feed`}>
          <Img src={p.phone} alt={`${p.name} — Instagram feed on a phone`} />
        </button>
        <div
          className="feed__grid"
          style={{
            '--cols': String(p.posts.length <= 3 ? p.posts.length : p.posts.length % 4 === 0 ? 4 : 3),
            '--cols-m': String(p.posts.length <= 3 ? p.posts.length : 2),
          }}
        >
          {p.posts.map((s, i) => (
            <ImageReveal key={s} src={s} alt={`${p.name} — post ${i + 1}`} delay={(i % 4) * 80} onClick={() => lb(shots, i + 1)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function heroOf(p: Project) {
  if (p.kind === 'identity') return p.tiles[0];
  if (p.kind === 'social') return p.posts[0];
  return p.cover;
}

function NextProject({ p }: { p: Project }) {
  const { t, lang } = useLang();
  const i = ALL_PROJECTS.indexOf(p);
  const n = ALL_PROJECTS[(i + 1) % ALL_PROJECTS.length];
  const img = useRef<HTMLSpanElement>(null);
  return (
    <nav className="next" aria-label={t.nextProject} style={{ '--accent': n.accent }}>
      <RLink to={routeOf(n)} className="next__link" cursor="next">
        <span className="next__kicker">
          {t.nextProject} — {lang === 'ar' ? kindLabelAr[n.kind] : kindLabel[n.kind]}{' '}
          <span className="num">
            {pad2(n.index)} / {pad2(countOf[n.kind])}
          </span>
        </span>
        <span className="next__name">
          <span lang="en" dir="ltr">
            {n.name}
          </span>
          <span className="next__arrow" aria-hidden="true">
            {lang === 'ar' ? '←' : '→'}
          </span>
        </span>
        {n.ar && <Ar className="next__ar">{n.ar}</Ar>}
        <span className="next__img" ref={img} aria-hidden="true">
          <img src={assetUrl(heroOf(n))} alt="" loading="lazy" decoding="async" />
        </span>
      </RLink>
    </nav>
  );
}

/**
 * Case study page. Every project type shares one cinematic frame — ink title page,
 * facts, a large hero that opens as it scrolls, the story from the PDF — and then
 * the body that suits the work (marks and palettes, interactive screens, full
 * documents, pages, feeds). It ends on the next project.
 */
export function ProjectDetail({ id }: { id: string }) {
  const p = findProject(id)!;
  const ch = chapterOf(p.kind);
  const { go } = useRouter();
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const lb = useLightbox();
  const hero = heroOf(p);
  const heroImg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observeReveals();
  }, [id]);

  const heroScene = useScene<HTMLDivElement>(
    (q) => {
      const el = heroImg.current;
      if (!el || REDUCED_MOTION) return;
      const o = clamp(q * 1.4);
      el.style.clipPath = `inset(${(1 - o) * 12}% ${(1 - o) * 14}% ${(1 - o) * 12}% ${(1 - o) * 14}% round ${(1 - o) * 24}px)`;
      const img = el.firstElementChild as HTMLElement | null;
      if (img) img.style.transform = `scale(${1.18 - o * 0.18}) translate3d(0, ${(q - 0.5) * -4}%, 0)`;
    },
    { start: (t, _h, vh) => t - vh, end: (t, h) => t + h * 0.6 },
    [id],
  );

  const backToken = p.kind === 'identity' ? 'identities' : p.kind;
  const contain = p.kind === 'profiles' || p.kind === 'uiux' || p.kind === 'print';

  return (
    <article className={`case case--${p.kind}`} style={{ '--accent': p.accent }} data-folio={`${p.pages[0]}-${p.pages[p.pages.length - 1]}`} data-label={p.name} key={id}>
      <header className="case__head">
        <div className="case__crumbs">
          <button type="button" className="ulink" onClick={() => go(backToken)}>
            {isAr ? `→ ${ch.n} ${ch.ar}` : `← ${ch.n} ${ch.en}`}
          </button>
          <RLink to="work" className="ulink">
            {t.allWorkLink}
          </RLink>
        </div>
        <span className="case__kicker">
          {isAr ? kindLabelAr[p.kind] : kindLabel[p.kind]} <i />
          <span className="num">
            {pad2(p.index)} / {pad2(countOf[p.kind])}
          </span>
        </span>
        <h1 className="case__title" lang="en" dir="ltr">
          <MaskLines lines={[p.name]} />
        </h1>
        {p.ar && <Ar className="case__ar">{p.ar}</Ar>}
        <span className="case__rule" />
        <Facts p={p} />
      </header>

      <div className={`case__hero ${contain ? 'case__hero--contain' : ''}`} ref={heroScene}>
        <button
          type="button"
          className="case__hero-frame"
          ref={heroImg}
          onClick={() => lb([{ src: hero, alt: p.name }])}
          data-cursor="explore"
          aria-label={`Open ${p.name} hero image`}
        >
          <Img src={hero} alt={`${p.name} — hero visual`} eager />
        </button>
      </div>

      <Story p={p} />

      {p.kind === 'identity' && <IdentityBody p={p} />}
      {p.kind === 'uiux' && <UIBody p={p} />}
      {p.kind === 'profiles' && <ProfileBody p={p} />}
      {p.kind === 'print' && <PrintBody p={p} />}
      {p.kind === 'social' && <SocialBody p={p} />}

      <section className="case__close">
        {p.kind === 'identity' && (
          <span className="case__close-mark">
            <Img src={(p as Identity).logo} alt="" />
          </span>
        )}
        <p className="case__close-line" data-rv="">
          <bdi>{p.name}</bdi>
          {p.ar && (
            <>
              <span className="case__close-dash"> — </span>
              <Ar>{p.ar}</Ar>
            </>
          )}
        </p>
        <span className="case__close-meta">
          {isAr ? kindLabelAr[p.kind] : kindLabel[p.kind]} {pad2(p.index)} {t.of} {pad2(p.kind === 'identity' ? IDENTITIES.length : countOf[p.kind])} ·{' '}
          {pagesLabel(p, t)} {t.ofPortfolio} · {p.year}
        </span>
      </section>

      <NextProject p={p} />
    </article>
  );
}
