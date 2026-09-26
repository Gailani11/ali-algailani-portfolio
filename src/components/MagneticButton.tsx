import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { FINE_POINTER, REDUCED_MOTION } from '../lib/env';

/**
 * Magnetic hover: the element leans toward the pointer and springs back on leave.
 * The inner label moves a little further than the shell, which gives the "physics" feel.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !FINE_POINTER || REDUCED_MOTION) return;
    const inner = el.querySelector<HTMLElement>('[data-mag-inner]');
    let raf = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (inner) inner.style.transform = `translate3d(${x * 0.45}px, ${y * 0.45}px, 0)`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      kick();
    };
    const leave = () => {
      tx = ty = 0;
      kick();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  cursor,
  external,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursor?: string;
  external?: boolean;
  ariaLabel?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>();
  const inner = (
    <span className="mbtn__inner" data-mag-inner="">
      {children}
    </span>
  );
  if (href)
    return (
      <a
        ref={ref}
        href={href}
        className={`mbtn ${className}`}
        data-cursor={cursor ?? (external ? 'open' : undefined)}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  return (
    <button ref={ref} type="button" className={`mbtn ${className}`} data-cursor={cursor} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
