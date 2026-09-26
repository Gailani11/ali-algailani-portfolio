import { useEffect, useRef } from 'react';
import { COVER, PERSON, WELCOME } from '../data/content';
import { useScene } from '../hooks/useScene';
import { useRouter } from '../lib/router';
import { FINE_POINTER, REDUCED_MOTION, clamp } from '../lib/env';
import { Ar } from '../components/Text';
import { useLang } from '../lib/i18n';

/**
 * Opening: the PDF cover, in motion. Near-black page, the thin Arabic "ملف أعمال"
 * wiping in right-to-left (its reading direction) from blur to sharp, "PORTFOLIO"
 * tightening its tracking, and a soft light that follows the pointer across the grain.
 * The white Welcome page then slides up over the cover like a turned page.
 */
export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { toSection } = useRouter();
  const { t, lang } = useLang();

  // pointer light + parallax
  useEffect(() => {
    if (!FINE_POINTER || REDUCED_MOTION) return;
    let tx = 0.5,
      ty = 0.45,
      x = 0.5,
      y = 0.45,
      raf = 0;
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      if (light.current) light.current.style.transform = `translate3d(${x * 100 - 50}vw, ${y * 100 - 50}vh, 0)`;
      if (title.current) title.current.style.setProperty('--px', `${(x - 0.5) * -22}px`), title.current.style.setProperty('--py', `${(y - 0.5) * -14}px`);
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  // scroll: the cover recedes as the Welcome page slides over it
  const wrap = useScene<HTMLDivElement>(
    (p) => {
      if (!stage.current || REDUCED_MOTION) return;
      const q = clamp(p * 2);
      stage.current.style.transform = `translate3d(0, ${q * -6}vh, 0) scale(${1 - q * 0.08})`;
      stage.current.style.opacity = String(1 - q * 0.75);
      stage.current.style.filter = q > 0.01 ? `blur(${q * 6}px)` : '';
    },
    { start: (t) => t, end: (t, h) => t + h },
  );

  return (
    <div className="hero-wrap" ref={wrap}>
      <section
        className={`hero ${FINE_POINTER ? '' : 'hero--touch'}`}
        data-section="top"
        data-folio="1"
        data-label={t.runningDefault}
        aria-label={lang === 'ar' ? 'الغلاف' : 'Cover'}
      >
        <div className="hero__light" ref={light} aria-hidden="true" />
        <div className="hero__stage" ref={stage}>
          <p className="hero__kicker" dir="ltr" lang="en">
            {COVER.kicker.map((k, i) => (
              <span key={k} style={{ '--i': i }}>
                {k}
              </span>
            ))}
          </p>
          <h1 className="hero__title" ref={title} dir="ltr">
            <Ar className="hero__ar">{COVER.titleAr}</Ar>
            <span className="hero__en" aria-label="Portfolio" lang="en">
              {COVER.titleEn}
            </span>
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <div className="hero__who" dir="ltr">
            <Ar className="hero__name-ar">{PERSON.nameAr}</Ar>
            <span className="hero__name" lang="en">
              {PERSON.nameEn}
            </span>
            <span className="hero__role" lang="en">
              {PERSON.title}
            </span>
          </div>
        </div>
        <div className="hero__foot">
          <Ar className="hero__disc">
            {COVER.disciplinesAr.map((d, i) => (
              <span key={d} style={{ '--i': i }}>
                {d}
              </span>
            ))}
          </Ar>
          <button className={`hero__cue ${lang === 'ar' ? 'hero__cue--ar' : ''}`} type="button" onClick={() => toSection('about')} data-cursor="link">
            <span>{t.scrollToExplore}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </section>
      <Welcome />
    </div>
  );
}

function Welcome() {
  const { lang } = useLang();
  return (
    <section className="welcome" data-folio="2" data-label={lang === 'ar' ? 'أهلًا' : 'Welcome'} aria-label={lang === 'ar' ? 'ترحيب' : 'Welcome'}>
      <span className="welcome__plus" aria-hidden="true" data-rv="" />
      <h2 className="welcome__title">
        <span className="welcome__ar-wrap" data-rv="">
          <Ar className="welcome__ar">{WELCOME.ar}</Ar>
        </span>
        <span className="welcome__en" data-rv="" lang="en">
          {WELCOME.en}
        </span>
      </h2>
      <p className="welcome__lines" data-rv="">
        <Ar className="welcome__line-ar">{WELCOME.lineAr}</Ar>
        <span className="welcome__line-en" lang="en">
          {WELCOME.lineEn}
        </span>
      </p>
    </section>
  );
}
