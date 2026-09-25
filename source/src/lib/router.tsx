/**
 * Hash router + cinematic page transitions.
 *
 * Routes are plain hash tokens (letters, digits, dashes), so every view can be
 * deep-linked on any static host:
 *   #            home           #logos … #contact   home, scrolled to a section
 *   #work        work archive   #id-gift-zone …     a case study
 *
 * Changing views runs the curtain: an ink panel rises over the page carrying the
 * destination's name, the view swaps underneath, and the panel lifts away.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { findProject, kindLabel, kindLabelAr, countOf, CHAPTERS } from '../data/content';
import { scroll, docTop } from './scroll';
import { REDUCED_MOTION, pad2, wait } from './env';
import { useLang, DICTS } from './i18n';
import type { Lang } from './i18n';

export type View =
  | { view: 'home'; section: string | null }
  | { view: 'work' }
  | { view: 'project'; id: string };

export const SECTIONS = ['top', 'about', 'index', 'logos', 'identities', 'uiux', 'profiles', 'print', 'social', 'contact'];

export function parse(token: string): View {
  const t = token.replace(/^#/, '');
  if (!t || SECTIONS.includes(t)) return { view: 'home', section: t || null };
  if (t === 'work') return { view: 'work' };
  if (findProject(t)) return { view: 'project', id: t };
  return { view: 'home', section: null };
}
const keyOf = (v: View) => (v.view === 'project' ? v.id : v.view);

interface Label {
  kicker: string;
  title: string;
  /** secondary line under the title */
  sub?: string;
  /** the title itself is Arabic */
  titleAr?: boolean;
}
function labelFor(v: View, lang: Lang): Label {
  const t = DICTS[lang];
  const isAr = lang === 'ar';
  if (v.view === 'work') return isAr ? { kicker: t.indexOfWork, title: 'الأعمال', sub: 'All work', titleAr: true } : { kicker: t.indexOfWork, title: 'All Work', sub: 'الأعمال' };
  if (v.view === 'project') {
    const p = findProject(v.id)!;
    const k = isAr ? kindLabelAr[p.kind] : kindLabel[p.kind];
    return { kicker: `${k} — ${pad2(p.index)} / ${pad2(countOf[p.kind])}`, title: p.name, sub: p.ar };
  }
  return isAr
    ? { kicker: t.portfolio2026, title: 'علي الجيلاني', sub: 'Ali Algailani', titleAr: true }
    : { kicker: t.portfolio2026, title: 'Ali Algailani', sub: 'ملف أعمال' };
}

interface RouterCtx {
  view: View;
  go: (token: string) => void;
  /** Scroll to a home section by token (home only). */
  toSection: (token: string, immediate?: boolean) => void;
  transitioning: boolean;
  /** Curtain back to the cover and replay the opening. */
  restart: () => void;
  /** Switch interface language behind the curtain, keeping the reader's place. */
  switchLang: (l: Lang) => void;
}
const Ctx = createContext<RouterCtx>({
  view: { view: 'home', section: null },
  go: () => {},
  toSection: () => {},
  transitioning: false,
  restart: () => {},
  switchLang: () => {},
});
export const useRouter = () => useContext(Ctx);

const sectionEl = (token: string) =>
  token === 'top' ? document.body : document.querySelector(`[data-section="${token}"]`);

function setHash(token: string) {
  const url = token ? `#${token}` : location.pathname + location.search;
  try {
    history.pushState(null, '', url);
  } catch {
    /* sandboxed frames may refuse history writes; the view still changes */
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const [view, setView] = useState<View>(() => parse(location.hash));
  const [label, setLabel] = useState<Label>(() => labelFor(view, lang));
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const viewRef = useRef(view);
  const homeY = useRef(0);
  const busy = useRef(false);

  const toSection = useCallback((token: string, immediate = false) => {
    const el = sectionEl(token);
    if (!el) return;
    if (token === 'top') scroll.scrollTo(0, { immediate });
    else scroll.scrollTo(el, { immediate });
  }, []);

  const transition = useCallback(async (next: View, push: boolean, token: string) => {
    if (busy.current) return;
    busy.current = true;
    const from = viewRef.current;
    setLabel(labelFor(next, langRef.current));
    scroll.lock(true);
    if (!REDUCED_MOTION) {
      setPhase('cover');
      await wait(820);
    }
    if (from.view === 'home') homeY.current = window.scrollY;
    if (push) setHash(token);
    viewRef.current = next;
    setView(next);
    await wait(60);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (next.view === 'home') {
      if (next.section) toSection(next.section, true);
      else scroll.scrollTo(from.view === 'project' || from.view === 'work' ? homeY.current : 0, { immediate: true });
    } else scroll.scrollTo(0, { immediate: true });
    scroll.lock(false);
    if (!REDUCED_MOTION) {
      setPhase('reveal');
      await wait(900);
    }
    setPhase('idle');
    busy.current = false;
    // move focus to the new view for keyboard and screen-reader users
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [toSection]);

  const go = useCallback(
    (token: string) => {
      const next = parse(token);
      const cur = viewRef.current;
      if (next.view === 'home' && cur.view === 'home') {
        if (next.section) {
          toSection(next.section);
          try {
            history.replaceState(null, '', `#${next.section}`);
          } catch {
            /* ignore */
          }
        } else toSection('top');
        return;
      }
      if (keyOf(next) === keyOf(cur)) {
        scroll.scrollTo(0);
        return;
      }
      transition(next, true, token);
    },
    [toSection, transition],
  );

  const restart = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setLabel(
      langRef.current === 'ar'
        ? { kicker: 'العودة إلى البداية', title: 'علي الجيلاني', sub: 'Ali Algailani', titleAr: true }
        : { kicker: 'Back to the beginning', title: 'Ali Algailani', sub: 'ملف أعمال' },
    );
    scroll.lock(true);
    if (!REDUCED_MOTION) {
      setPhase('cover');
      await wait(820);
    }
    const root = document.documentElement;
    root.classList.remove('is-ready');
    if (viewRef.current.view !== 'home') {
      viewRef.current = { view: 'home', section: null };
      setView(viewRef.current);
      await wait(60);
    }
    setHash('');
    scroll.scrollTo(0, { immediate: true });
    scroll.lock(false);
    void root.offsetHeight;
    if (!REDUCED_MOTION) {
      setPhase('reveal');
      await wait(250);
    }
    root.classList.add('is-ready');
    if (!REDUCED_MOTION) await wait(650);
    setPhase('idle');
    busy.current = false;
  }, []);

  const switchLang = useCallback(
    async (l: Lang) => {
      if (busy.current || l === langRef.current) return;
      busy.current = true;
      const t = DICTS[l];
      setLabel({ kicker: t.languageKicker, title: t.languageName, sub: l === 'ar' ? 'Arabic' : 'الإنجليزية', titleAr: l === 'ar' });
      scroll.lock(true);
      // remember the section under the reading line so the reader stays in place
      const line = window.scrollY + window.innerHeight * 0.35;
      let anchor: HTMLElement | null = null;
      let offset = 0;
      document.querySelectorAll<HTMLElement>('[data-folio]').forEach((el) => {
        const top = docTop(el);
        if (top <= line && top + el.offsetHeight > line) {
          anchor = el;
          offset = window.scrollY - top;
        }
      });
      if (!REDUCED_MOTION) {
        setPhase('cover');
        await wait(820);
      }
      setLang(l);
      await wait(80);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (anchor) scroll.scrollTo(docTop(anchor) + offset, { immediate: true });
      scroll.lock(false);
      if (!REDUCED_MOTION) {
        setPhase('reveal');
        await wait(900);
      }
      setPhase('idle');
      busy.current = false;
    },
    [setLang],
  );

  // Back / forward and hand-edited hashes.
  useEffect(() => {
    const onPop = () => {
      const next = parse(location.hash);
      const cur = viewRef.current;
      if (next.view === 'home' && cur.view === 'home') {
        if (next.section) toSection(next.section);
        return;
      }
      if (keyOf(next) !== keyOf(cur)) transition(next, false, '');
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, [toSection, transition]);

  return (
    <Ctx.Provider value={{ view, go, toSection, transitioning: phase !== 'idle', restart, switchLang }}>
      {children}
      <div className={`curtain curtain--${phase}`} aria-hidden={phase === 'idle'} role="status" aria-live="polite">
        <div className="curtain__panel">
          <div className="curtain__grain" />
          <div className="curtain__inner">
            <span className="curtain__kicker">{label.kicker}</span>
            <span
              className={`curtain__title ${label.titleAr ? 'curtain__title--ar' : ''}`}
              dir={label.titleAr ? 'rtl' : 'ltr'}
              lang={label.titleAr ? 'ar' : 'en'}
            >
              <span>{label.title}</span>
            </span>
            {label.sub && (
              <span className={`curtain__ar ${label.titleAr ? 'curtain__ar--lat' : ''}`} dir="auto" lang={label.titleAr ? 'en' : 'ar'}>
                {label.sub}
              </span>
            )}
            <span className="curtain__bar" />
          </div>
          <div className="curtain__chapters" aria-hidden="true" lang="en">
            {CHAPTERS.map((c) => (
              <span key={c.n}>{c.n}</span>
            ))}
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

/** Link that routes through the transition system but stays a real, focusable <a>. */
export function RLink({
  to,
  children,
  className,
  cursor,
  label,
  onNavigate,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  cursor?: string;
  label?: string;
  onNavigate?: () => void;
  [k: string]: unknown;
}) {
  const { go } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      data-cursor={cursor}
      aria-label={label}
      onClick={(e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
