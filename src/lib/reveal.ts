/**
 * Reveal-on-enter system.
 * Any element with a `data-rv` attribute starts in its "before" state (defined in CSS,
 * and only when JS is running: `.js [data-rv]`) and receives `.is-in` the first time it
 * enters the viewport. One shared IntersectionObserver serves the whole page.
 */
import { REDUCED_MOTION } from './env';

let io: IntersectionObserver | null = null;

function getIO() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io!.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
  }
  return io;
}

/** Observe every not-yet-revealed element under `root`. Safe to call repeatedly. */
export function observeReveals(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('[data-rv]:not(.is-in)');
  if (REDUCED_MOTION) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const obs = getIO();
  els.forEach((el) => obs.observe(el));
}
