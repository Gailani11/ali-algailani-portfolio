/** Environment flags, read once. */
const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const REDUCED_MOTION = mq('(prefers-reduced-motion: reduce)');
/** Fine pointer + hover = desktop cursor. Touch devices get native behaviour. */
export const FINE_POINTER = mq('(hover: hover) and (pointer: fine)');
export const isDesktop = () => window.innerWidth >= 1024;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const map = (v: number, a: number, b: number, c = 0, d = 1) => c + ((v - a) / (b - a)) * (d - c);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
export const pad2 = (n: number) => String(n).padStart(2, '0');
export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
