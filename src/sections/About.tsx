import { useRef } from 'react';
import { ABOUT } from '../data/content';
import { useScene } from '../hooks/useScene';
import { useRouter } from '../lib/router';
import { REDUCED_MOTION, clamp, pad2 } from '../lib/env';
import { useLang } from '../lib/i18n';
import { Ar, Eyebrow, MaskLines } from '../components/Text';

/**
 * About — a manifesto first, then the facts. The four statement lines fill with ink
 * as they are scrolled past (scrubbed, not timed), then the PDF's bilingual
 * introduction, skills and tools follow. In Arabic the statement is set in IBM Plex
 * Sans Arabic and fills right-to-left.
 */
export function About() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const statement = t.statement;
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const manifesto = useScene<HTMLDivElement>(
    (p) => {
      lines.current.forEach((el, i) => {
        if (!el) return;
        const seg = clamp(p * (statement.length + 0.6) - i);
        el.style.setProperty('--fill', REDUCED_MOTION ? '100%' : `${seg * 100}%`);
      });
    },
    { start: (t0, _h, vh) => t0 - vh * 0.75, end: (t0, h, vh) => t0 + h - vh * 0.55 },
    [lang],
  );
  const { toSection } = useRouter();

  const enCol = (
    <div className="about__col" lang="en" dir="ltr" key="en">
      <h2 id={isAr ? undefined : 'about-h'} className="about__h">
        <MaskLines lines={[ABOUT.headingEn]} />
      </h2>
      <p className="about__bio" data-rv="">
        {ABOUT.bioEn}
      </p>
    </div>
  );
  const arCol = (
    <div className="about__col about__col--ar" lang="ar" dir="rtl" key="ar">
      <h2 id={isAr ? 'about-h' : undefined} className="about__h about__h--ar">
        <MaskLines lines={[ABOUT.headingAr]} />
      </h2>
      <p className="about__bio about__bio--ar" data-rv="">
        {ABOUT.bioAr}
      </p>
    </div>
  );

  return (
    <section className="about" data-section="about" data-folio="3" data-label={t.nav.about} aria-labelledby="about-h">
      <div className="about__manifesto" ref={manifesto}>
        <Eyebrow className="about__eyebrow">{t.aboutEyebrow}</Eyebrow>
        <p className={`manifesto ${isAr ? 'manifesto--ar' : ''}`} aria-label={statement.join(' ')}>
          {statement.map((l, i) => (
            <span className="manifesto__line" key={lang + l} aria-hidden="true">
              <span className="manifesto__ghost">{l}</span>
              <span className="manifesto__ink" ref={(el: HTMLSpanElement | null) => (lines.current[i] = el)}>
                {l}
              </span>
            </span>
          ))}
        </p>
      </div>

      <div className="about__intro">{isAr ? [arCol, enCol] : [enCol, arCol]}</div>

      <div className="about__skills">
        <div className="about__skills-head">
          {isAr ? <Ar className="about__skills-ar">المهارات</Ar> : null}
          <Eyebrow>
            <span lang="en">Skills</span>
          </Eyebrow>
          {isAr ? null : <Ar className="about__skills-ar">المهارات</Ar>}
        </div>
        <ul className="skills">
          {ABOUT.skills.map((s, i) => (
            <li key={s.en} className="skills__row" data-rv="" style={{ '--d': `${i * 60}ms` }}>
              <button
                type="button"
                className="skills__btn"
                onClick={() => toSection(s.chapter === 'identity' ? 'identities' : s.chapter)}
                data-cursor="view"
              >
                <span className="skills__n num">{pad2(i + 1)}</span>
                {isAr ? <Ar className="skills__primary">{s.ar}</Ar> : <span className="skills__primary">{s.en}</span>}
                <span className="skills__go" aria-hidden="true">
                  {t.seeWork}
                </span>
                {isAr ? (
                  <span className="skills__secondary" lang="en" dir="ltr">
                    {s.en}
                  </span>
                ) : (
                  <Ar className="skills__secondary">{s.ar}</Ar>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="about__tools">
        <div className="about__skills-head">
          {isAr ? <Ar className="about__skills-ar">البرامج</Ar> : null}
          <Eyebrow>
            <span lang="en">Tools</span>
          </Eyebrow>
          {isAr ? null : <Ar className="about__skills-ar">البرامج</Ar>}
        </div>
        <ul className="tools">
          {ABOUT.tools.map((tool, i) => (
            <li key={tool.abbr} className="tools__item" data-rv="" style={{ '--d': `${i * 70}ms` }}>
              <span className="tools__tile" style={{ '--bg': tool.bg, '--fg': tool.fg }} aria-hidden="true">
                {tool.abbr}
              </span>
              <span className="tools__name" lang="en">
                {tool.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
