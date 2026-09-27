import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, PERSON } from '../data/content';
import { useRouter, RLink } from '../lib/router';
import { scroll } from '../lib/scroll';
import { toneAt } from '../lib/tone';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { useMagnetic } from './MagneticButton';
import { Ar } from './Text';
import { ExtIcon } from './ExtIcon';

const LINKS = ['work', 'about', 'index', 'contact'] as const;
const LINK_AR: Record<(typeof LINKS)[number], string> = { work: 'أعمال', about: 'عني', index: 'الفهرس', contact: 'تواصل' };
const LINK_EN: Record<(typeof LINKS)[number], string> = { work: 'Work', about: 'About', index: 'Index', contact: 'Contact' };

function NavLink({ to, children }: { to: string; children: string }) {
  const ref = useMagnetic<HTMLSpanElement>(0.4);
  return (
    <span ref={ref} className="nav__magnet">
      <RLink to={to} className="nav__link ulink">
        <span data-mag-inner="">{children}</span>
      </RLink>
    </span>
  );
}

/** AR / EN switch — two quiet words and a hairline. */
function LangSwitch() {
  const { lang, t } = useLang();
  const { switchLang } = useRouter();
  const opts: { l: Lang; label: string; name: string }[] = [
    { l: 'ar', label: 'ع', name: 'العربية' },
    { l: 'en', label: 'EN', name: 'English' },
  ];
  return (
    <div className="lang" role="group" aria-label={t.langGroup}>
      {opts.map((o, i) => (
        <span key={o.l} className="lang__item">
          {i > 0 && <i className="lang__sep" aria-hidden="true" />}
          <button
            type="button"
            className={`lang__btn lang__btn--${o.l}`}
            aria-pressed={lang === o.l}
            aria-label={o.name}
            lang={o.l}
            onClick={() => switchLang(o.l)}
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  );
}

/**
 * Floating corner navigation. Transparent over the cover; once the reader scrolls, a
 * quiet glass band (blur, faint tint, hairline) fades in behind it. Text and glass take
 * their colour from the section underneath — ink over paper, paper over ink — and
 * cross-fade as sections change. The MENU indicator opens a full-screen index that
 * doubles as the mobile navigation.
 */
export function Navigation() {
  const [open, setOpen] = useState(false);
  const { view } = useRouter();
  const { lang, t } = useLang();
  const brand = useMagnetic<HTMLSpanElement>(0.25);
  const panel = useRef<HTMLDivElement>(null);
  const menuGrid = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLElement>(null);

  // glass + tone
  useEffect(() => {
    const el = bar.current!;
    let scrolled = false;
    let tone = '';
    let last = 0;
    let lastY = -1;
    return scroll.onTick((time) => {
      const s = scroll.y > 24;
      if (s !== scrolled) {
        scrolled = s;
        el.classList.toggle('is-scrolled', s);
      }
      if (time - last < 90 && Math.abs(scroll.y - lastY) < 30) return;
      last = time;
      lastY = scroll.y;
      const h = el.offsetHeight;
      const tn = document.documentElement.classList.contains('menu-open') ? 'dark' : toneAt(window.innerWidth * 0.5, Math.max(4, h - 6));
      if (tn !== tone) {
        tone = tn;
        el.dataset.tone = tn;
      }
    });
  }, []);

  useEffect(() => {
    scroll.lock(open);
    document.documentElement.classList.toggle('menu-open', open);
    // the menu always opens at its top, with the bar behind the name see-through again
    if (menuGrid.current) menuGrid.current.scrollTop = 0;
    bar.current?.classList.remove('is-menu-scrolled');
    if (open) {
      const first = panel.current?.querySelector<HTMLElement>('a, button');
      setTimeout(() => first?.focus({ preventScroll: true }), 350);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        opener.current?.focus();
      }
      if (e.key === 'Tab' && open && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a, button');
        const a = f[0];
        const b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => setOpen(false), [view, lang]);

  const close = () => setOpen(false);
  const isAr = lang === 'ar';

  return (
    <>
      <header className={`nav ${open ? 'is-menu' : ''}`} ref={bar} data-tone="dark">
        <span className="nav__glass" aria-hidden="true" />
        <span ref={brand} className="nav__magnet nav__brand-wrap">
          <RLink to="top" className={`nav__brand ${isAr ? 'nav__brand--ar' : ''}`} label={t.home}>
            <span data-mag-inner="">
              <Ar className="nav__brand-ar">{PERSON.nameAr}</Ar>
              <span className="nav__brand-en" lang="en">
                Ali Algailani
              </span>
            </span>
          </RLink>
        </span>
        <nav className="nav__links" aria-label={isAr ? 'التنقل الرئيسي' : 'Primary'} dir={isAr ? 'rtl' : 'ltr'} lang={lang}>
          {LINKS.map((l) => (
            <NavLink key={l} to={l}>
              {t.nav[l]}
            </NavLink>
          ))}
        </nav>
        <LangSwitch />
        <button
          ref={opener}
          type="button"
          className={`nav__menu ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
          data-cursor="link"
          lang={lang}
        >
          <span className="nav__menu-word">{open ? t.close : t.menu}</span>
          <span className="nav__menu-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div id="menu" ref={panel} className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''} dir={isAr ? 'rtl' : 'ltr'} lang={lang}>
        <div className="menu__bg" />
        <div
          className="menu__grid"
          ref={menuGrid}
          onScroll={() => bar.current?.classList.toggle('is-menu-scrolled', (menuGrid.current?.scrollTop ?? 0) > 6)}
        >
          <nav className="menu__primary" aria-label={t.menu}>
            {LINKS.map((l, i) => (
              <RLink key={l} to={l} className="menu__link" onNavigate={close} style={{ '--i': i }}>
                <span className="menu__n num">0{i + 1}</span>
                {isAr ? (
                  <>
                    <Ar className="menu__en menu__en--ar">{LINK_AR[l]}</Ar>
                    <span className="menu__ar menu__ar--lat" lang="en">
                      {LINK_EN[l]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="menu__en">{LINK_EN[l]}</span>
                    <Ar className="menu__ar">{LINK_AR[l]}</Ar>
                  </>
                )}
              </RLink>
            ))}
          </nav>
          <div className="menu__chapters">
            <span className="eyebrow">{t.chapters}</span>
            {CHAPTERS.map((c, i) => (
              <RLink
                key={c.n}
                to={c.key === 'identity' ? 'identities' : c.key}
                className="menu__ch"
                onNavigate={close}
                style={{ '--i': i + 4 }}
              >
                <span className="num">{c.n}</span>
                {isAr ? <Ar>{c.ar}</Ar> : <span>{c.en}</span>}
                {isAr ? <span lang="en">{c.en}</span> : <Ar>{c.ar}</Ar>}
              </RLink>
            ))}
          </div>
          <div className="menu__foot">
            <a className="ulink" href={PERSON.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="open">
              {t.whatsapp}
              <ExtIcon />
            </a>
            <span className="menu__mail" dir="ltr">
              {PERSON.email}
            </span>
            <a className="ulink" href={PERSON.pdf} target="_blank" rel="noopener" data-cursor="open">
              {t.portfolioPdf}
              <ExtIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
