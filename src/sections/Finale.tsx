import { useRef, useState } from 'react';
import { PERSON, THANKS } from '../data/content';
import { useScene } from '../hooks/useScene';
import { REDUCED_MOTION, clamp } from '../lib/env';
import { Ar, Eyebrow, MaskLines } from '../components/Text';
import { MagneticButton } from '../components/MagneticButton';
import { Img } from '../components/Img';
import { useRouter } from '../lib/router';
import { useLang } from '../lib/i18n';

const ROLE_AR = 'مصمم جرافيك وواجهات مستخدم أول';

/**
 * Site statement (website copy, not a quotation). Each word lights up as the reader
 * scrolls across it.
 */
export function Statement() {
  const { t, lang } = useLang();
  const WORDS = t.statementLine.split(' ');
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const ref = useScene<HTMLElement>(
    (p) => {
      words.current.forEach((w, i) => {
        if (!w) return;
        const on = REDUCED_MOTION ? 1 : clamp(p * (WORDS.length + 2) - i);
        w.style.opacity = String(0.14 + on * 0.86);
        w.style.filter = on < 1 ? `blur(${(1 - on) * 3}px)` : '';
      });
    },
    { start: (t0, _h, vh) => t0 - vh * 0.6, end: (t0, h, vh) => t0 + h - vh * 0.7 },
    [lang],
  );
  return (
    <section ref={ref} className="statement" aria-label={t.approach}>
      <Eyebrow className="statement__eyebrow">{t.approach}</Eyebrow>
      <p className={`statement__text ${lang === 'ar' ? 'statement__text--ar' : ''}`}>
        {WORDS.map((w, i) => (
          <span key={lang + i} ref={(el: HTMLSpanElement | null) => (words.current[i] = el)}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}

function CopyEmail() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const txt = useRef<HTMLSpanElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      // clipboard refused: select the address so the visitor can copy it by hand
      const r = document.createRange();
      if (txt.current) {
        r.selectNodeContents(txt.current);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
    }
  };
  return (
    <span className="cinfo__email">
      <span ref={txt} className="cinfo__value" dir="ltr">
        {PERSON.email}
      </span>
      <button type="button" className="cinfo__copy" onClick={copy} data-cursor="copy" aria-live="polite">
        {done ? t.copied : t.copy}
      </button>
    </span>
  );
}

/**
 * Finale: the invitation, then the PDF's closing page — شكرًا / Thank you, the real
 * contact details and the WhatsApp QR — and a cinematic way back to the cover.
 */
export function Finale() {
  const { restart } = useRouter();
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  return (
    <section className="finale" data-section="contact" data-folio="51" data-label={t.nav.contact} aria-labelledby="finale-h">
      <div className="finale__invite">
        <h2 id="finale-h" className={`finale__big ${isAr ? 'finale__big--ar' : ''}`} key={lang}>
          <MaskLines lines={t.invite} step={120} />
        </h2>
        <MagneticButton href={PERSON.whatsapp} external className="finale__cta" cursor="open">
          <span>{t.startConversation}</span>
          <i>{t.whatsapp}</i>
        </MagneticButton>
      </div>

      <div className="finale__thanks">
        <Eyebrow className="finale__kicker">{isAr ? 'تواصل معي' : THANKS.kicker}</Eyebrow>
        <p className="finale__ar" lang="ar" dir="rtl" data-rv="">
          {THANKS.ar}
        </p>
        <p className="finale__en" data-rv="" lang="en" dir="ltr">
          {THANKS.en}
        </p>
        <span className="finale__rule" data-rv="" />
        <Ar className="finale__line">{THANKS.lineAr}</Ar>
      </div>

      <div className="finale__card">
        <div className="finale__qr">
          <a href={PERSON.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="open" aria-label="WhatsApp">
            <Img src="misc/qr" alt="QR code — WhatsApp" />
          </a>
          <span className="eyebrow">{t.scanToChat}</span>
        </div>
        <dl className="cinfo">
          <div>
            <dt>{t.email}</dt>
            <dd>
              <CopyEmail />
            </dd>
          </div>
          <div>
            <dt>{t.phone}</dt>
            <dd>
              <a className="ulink" dir="ltr" href={PERSON.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="open">
                {PERSON.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt>{t.location}</dt>
            <dd>{t.locationValue}</dd>
          </div>
        </dl>
        <div className="finale__sign">
          <Ar className="finale__sign-ar">{PERSON.nameAr}</Ar>
          <span className="finale__sign-en" lang="en">
            {PERSON.nameEn}
          </span>
          <span className="finale__sign-role">{isAr ? ROLE_AR : PERSON.title}</span>
        </div>
      </div>

      <div className="finale__download">
        <MagneticButton href={PERSON.pdf} external className="dl" cursor="open" ariaLabel={`${t.download} — ${t.pdfMeta}`}>
          <span className="dl__label">{t.download}</span>
          <span className="dl__meta">{t.pdfMeta}</span>
          <span className="dl__arrow" aria-hidden="true">
            ↓
          </span>
        </MagneticButton>
      </div>

      <footer className="footer">
        <span>
          © {PERSON.year} {isAr ? PERSON.nameAr : PERSON.nameEn}
        </span>
        <span className="footer__mid">{isAr ? ROLE_AR : PERSON.title}</span>
        <button type="button" className="footer__top ulink" onClick={restart} data-cursor="link">
          {t.backToBeginning}
        </button>
      </footer>
    </section>
  );
}
