import { useEffect, useRef } from 'react';
import { assetUrl } from './Img';
import { DIMS } from '../data/assets';
import { FINE_POINTER, REDUCED_MOTION } from '../lib/env';
import { scroll } from '../lib/scroll';

/**
 * A physical-feeling phone built in CSS: titanium edge, bezel, dynamic island, glass
 * sheen. Screens are the real app screens extracted from the portfolio; switching
 * screens slides the new one in from the direction of travel. The device tilts
 * toward the pointer in 3D on desktop and accepts swipes on touch.
 */
export function Phone({
  screens,
  index,
  onChange,
  label,
  accent,
}: {
  screens: { img: string; en: string }[];
  index: number;
  onChange: (i: number) => void;
  label: string;
  accent: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const prev = useRef(index);
  const touch = useRef(0);

  // touch: the device turns gently as it travels through the viewport
  useEffect(() => {
    const st = stage.current;
    const dv = device.current;
    if (!st || !dv || FINE_POINTER || REDUCED_MOTION) return;
    return scroll.onTick(() => {
      const r = st.getBoundingClientRect();
      if (r.bottom < 0 || r.top > scroll.vh) return;
      const q = (r.top + r.height / 2) / scroll.vh - 0.5;
      dv.style.transform = `rotateX(${q * -10}deg) rotateY(${-6 + q * 8}deg)`;
      dv.style.setProperty('--sheen', `${45 + q * 30}%`);
    });
  }, []);

  useEffect(() => {
    const st = stage.current;
    const dv = device.current;
    if (!st || !dv || !FINE_POINTER || REDUCED_MOTION) return;
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf = 0;
    const loop = () => {
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      dv.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      dv.style.setProperty('--sheen', `${50 + ry * 3}%`);
      if (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const move = (e: PointerEvent) => {
      const r = st.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ty = px * 16;
      tx = -py * 12;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      tx = 4;
      ty = -8;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    leave();
    st.addEventListener('pointermove', move);
    st.addEventListener('pointerleave', leave);
    return () => {
      st.removeEventListener('pointermove', move);
      st.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const dir = index >= prev.current ? 1 : -1;
  useEffect(() => {
    prev.current = index;
  }, [index]);

  const step = (d: number) => onChange((index + d + screens.length) % screens.length);

  return (
    <div
      className="phone-stage"
      ref={stage}
      style={{ '--accent': accent }}
      onTouchStart={(e: TouchEvent) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e: TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="phone" ref={device} role="group" aria-roledescription="carousel" aria-label={`${label} screens`}>
        <div className="phone__edge" aria-hidden="true" />
        <div className="phone__screen">
          {screens.map((s, i) => {
            const d = DIMS[s.img] ?? [404, 850];
            const state = i === index ? 'is-on' : '';
            return (
              <img
                key={s.img}
                src={assetUrl(s.img)}
                width={d[0]}
                height={d[1]}
                alt={i === index ? `${label} — ${s.en}` : ''}
                aria-hidden={i !== index}
                loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                className={`phone__img ${state}`}
                style={{ '--dir': dir }}
                draggable={false}
              />
            );
          })}
          <span className="phone__island" aria-hidden="true" />
          <span className="phone__glass" aria-hidden="true" />
        </div>
        <span className="phone__btn phone__btn--a" aria-hidden="true" />
        <span className="phone__btn phone__btn--b" aria-hidden="true" />
        <span className="phone__btn phone__btn--c" aria-hidden="true" />
      </div>
      <div className="phone-stage__ctrl" dir="ltr">
        <button type="button" onClick={() => step(-1)} aria-label="Previous screen">
          ←
        </button>
        <span className="phone-stage__count num" aria-live="polite">
          {String(index + 1).padStart(2, '0')} <i>/ {String(screens.length).padStart(2, '0')}</i>
        </span>
        <button type="button" onClick={() => step(1)} aria-label="Next screen">
          →
        </button>
      </div>
    </div>
  );
}
