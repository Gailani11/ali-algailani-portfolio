import { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { LightboxProvider } from './components/Lightbox';
import { Navigation } from './components/Navigation';
import { Chrome } from './components/Chrome';
import { Cursor } from './components/Cursor';
import { Loader, useGrain } from './components/Loader';
import { Home } from './pages/Home';
import { WorkArchive } from './pages/WorkArchive';
import { ProjectDetail } from './pages/ProjectDetail';
import { scroll } from './lib/scroll';
import { observeReveals } from './lib/reveal';
import { findProject, PERSON } from './data/content';
import { LangProvider, useLang } from './lib/i18n';

function Views() {
  const { view } = useRouter();
  const { t, lang, dir } = useLang();
  useEffect(() => {
    const name = lang === 'ar' ? PERSON.nameAr : PERSON.nameEn;
    if (view.view === 'project') {
      const p = findProject(view.id);
      document.title = p ? `${p.name} — ${name}` : t.title;
    } else if (view.view === 'work') document.title = `${t.allWork} — ${name}`;
    else document.title = t.title;
  }, [view, lang, t]);
  // new elements after a language swap get the reveal treatment too
  useEffect(() => {
    const id = setTimeout(() => observeReveals(), 60);
    return () => clearTimeout(id);
  }, [lang, view]);

  return (
    <main id="main" tabIndex={-1} className={`view view--${view.view}`} dir={dir} lang={lang}>
      {view.view === 'home' && <Home />}
      {view.view === 'work' && <WorkArchive />}
      {view.view === 'project' && <ProjectDetail id={view.id} key={view.id} />}
    </main>
  );
}

export function App() {
  const [ready, setReady] = useState(false);
  useGrain();
  useEffect(() => {
    scroll.start();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.add('is-ready');
    // honour a deep link to a home section once the page has laid out
    const t = location.hash.replace('#', '');
    if (t) {
      const el = document.querySelector(`[data-section="${t}"]`);
      if (el) setTimeout(() => scroll.scrollTo(el, { immediate: true }), 50);
    }
  }, [ready]);

  return (
    <LangProvider>
      <Shell setReady={setReady} />
    </LangProvider>
  );
}

function Shell({ setReady }: { setReady: (v: boolean) => void }) {
  const { lang } = useLang();
  return (
    <RouterProvider>
      <LightboxProvider>
        <a className="skip" href="#main">
          {lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
        </a>
        <Navigation />
        <Views />
        <Chrome />
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Loader onDone={() => setReady(true)} />
      </LightboxProvider>
    </RouterProvider>
  );
}
