/**
 * Tone sensing: is the page under a point light or dark?
 *
 * Walks up from the element at (x, y) to the first ancestor that paints an opaque
 * background and reads its luminance. Fixed UI (header, cursor, rail) is skipped so
 * the answer describes the content behind it. Results are cached per element.
 */
export type Tone = 'light' | 'dark';

const cache = new WeakMap<Element, Tone | 'none'>();
const SKIP = '.nav, .cursor, .rail, .chrome, .grain, .contents__float';

function bgTone(el: Element): Tone | 'none' {
  const hit = cache.get(el);
  if (hit) return hit;
  const c = getComputedStyle(el).backgroundColor;
  const m = c.match(/rgba?\(([^)]+)\)/);
  let res: Tone | 'none' = 'none';
  if (m) {
    const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
    if (parseFloat(a) >= 0.6) {
      const l = (0.2126 * +r + 0.7152 * +g + 0.0722 * +b) / 255;
      res = l > 0.55 ? 'light' : 'dark';
    }
  }
  cache.set(el, res);
  return res;
}

export function toneOf(el: Element | null): Tone {
  let n: Element | null = el;
  while (n && n !== document.documentElement) {
    const t = bgTone(n);
    if (t !== 'none') return t;
    n = n.parentElement;
  }
  return 'dark';
}

export function toneAt(x: number, y: number): Tone {
  const els = document.elementsFromPoint(x, y);
  for (const e of els) {
    if (e.closest(SKIP)) continue;
    return toneOf(e);
  }
  return 'dark';
}
