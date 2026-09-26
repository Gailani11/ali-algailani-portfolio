/**
 * Smooth scroll engine — a small Lenis-style implementation.
 *
 * The page keeps native document scrolling (so the scrollbar, keyboard, find-in-page,
 * anchor links and accessibility tools all keep working). On desktop, wheel input is
 * intercepted and eased towards a target with frame-rate-independent damping.
 * Touch devices and reduced-motion users get plain native scrolling.
 *
 * One requestAnimationFrame loop drives everything: scroll smoothing, scroll scenes,
 * the folio counter and the cursor subscribe to it, so the page never runs
 * competing animation loops.
 */
import { REDUCED_MOTION, FINE_POINTER, clamp, easeInOut } from './env';

type Tick = (time: number, dt: number) => void;

class Engine {
  y = 0;
  target = 0;
  velocity = 0;
  vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  private smoothing = FINE_POINTER && !REDUCED_MOTION;
  private animating = false;
  private locked = false;
  private tween: { from: number; to: number; start: number; dur: number; done?: () => void } | null = null;
  private ticks = new Set<Tick>();
  private resizeFns = new Set<() => void>();
  private last = 0;
  private started = false;

  start() {
    if (this.started) return;
    this.started = true;
    this.y = this.target = window.scrollY;
    if (this.smoothing) window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('scroll', this.onNativeScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    const ro = new ResizeObserver(() => this.onResize());
    ro.observe(document.body);
    requestAnimationFrame(this.loop);
  }

  private max() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  private onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom
    if (this.locked) {
      e.preventDefault();
      return;
    }
    const t = e.target as Element | null;
    if (t && t.closest && t.closest('[data-native-scroll]')) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal trackpad gestures stay native
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? this.vh : 1;
    this.tween = null;
    this.target = clamp(this.target + e.deltaY * unit, 0, this.max());
    this.animating = true;
  };

  private onNativeScroll = () => {
    // Keyboard, scrollbar drag, touch and find-in-page arrive here: adopt them.
    if (!this.animating && !this.tween) this.y = this.target = window.scrollY;
  };

  private onResize = () => {
    this.vh = window.innerHeight;
    this.vw = window.innerWidth;
    this.target = clamp(this.target, 0, this.max());
    this.resizeFns.forEach((f) => f());
  };

  private loop = (time: number) => {
    const dt = Math.min(64, time - (this.last || time));
    this.last = time;
    const prev = this.y;

    if (this.tween) {
      const tw = this.tween;
      const p = clamp((time - tw.start) / tw.dur);
      this.y = tw.from + (tw.to - tw.from) * easeInOut(p);
      window.scrollTo(0, this.y);
      if (p >= 1) {
        this.tween = null;
        this.target = this.y;
        tw.done?.();
      }
    } else if (this.animating) {
      const k = 1 - Math.exp(-dt / 105); // damping ≈ Lenis lerp 0.1 at 60fps
      this.y += (this.target - this.y) * k;
      if (Math.abs(this.target - this.y) < 0.4) {
        this.y = this.target;
        this.animating = false;
      }
      window.scrollTo(0, this.y);
    } else {
      this.y = window.scrollY;
    }
    this.velocity = this.y - prev;
    this.ticks.forEach((f) => f(time, dt));
    requestAnimationFrame(this.loop);
  };

  onTick(f: Tick) {
    this.ticks.add(f);
    return () => this.ticks.delete(f);
  }
  onResizeEnd(f: () => void) {
    this.resizeFns.add(f);
    return () => this.resizeFns.delete(f);
  }

  /** Animated scroll to a y position or element. */
  scrollTo(to: number | Element, opts: { offset?: number; duration?: number; immediate?: boolean } = {}) {
    const y =
      typeof to === 'number' ? to : (to as Element).getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    const dest = clamp(y, 0, this.max());
    if (opts.immediate || REDUCED_MOTION) {
      this.tween = null;
      this.animating = false;
      window.scrollTo(0, dest);
      this.y = this.target = dest;
      return Promise.resolve();
    }
    const dist = Math.abs(dest - window.scrollY);
    const dur = opts.duration ?? clamp(500 + dist * 0.18, 700, 1800);
    return new Promise<void>((done) => {
      this.animating = false;
      this.tween = { from: window.scrollY, to: dest, start: performance.now(), dur, done };
    });
  }

  lock(v: boolean) {
    this.locked = v;
    document.documentElement.classList.toggle('is-locked', v);
  }
}

export const scroll = new Engine();

/** Absolute document top of an element, cached-friendly. */
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
