"""Cuts the 24 app screens (Fully Charged p.26–27, Trackulizer p.29–30) exactly inside each
screen's edge, so they sit square in the site's CSS phone with no shadow or gap, and
brings the few taller designs to the iPhone 390 × 844 proportion.

    python3 tools/ui_screens.py "Ali Algailani Portfolio 2026.pdf"

Needs poppler's `pdfimages` and Pillow + NumPy. Writes public/assets/ui/<product>/sNN.webp
and prints the sizes to put in src/data/assets.ts.
"""
import os, sys, subprocess, tempfile
import numpy as np
from PIL import Image

PDF = sys.argv[1] if len(sys.argv) > 1 else 'Ali Algailani Portfolio 2026.pdf'
OUT = 'public/assets/ui'
TW, TH = 390, 844                      # iPhone screen in points
GRID_X = [200 + 488 * k for k in range(6)]  # card left edges on the 3200 px page image
CARD_W, CARD_BOTTOM = 360, 1372
# designs taller than a phone: 'gaps' trims empty bands; a number keeps the tab bar
# from that row down and lets the list above slide under it, as it scrolls in the app
TALL = {('fully-charged', 2): 'gaps', ('fully-charged', 4): 757, ('fully-charged', 5): 'gaps',
        ('fully-charged', 6): 'gaps', ('fully-charged', 12): 734}

def page_image(pdf, page, tmp):
    subprocess.run(['pdfimages', '-f', str(page), '-l', str(page), '-j', pdf, f'{tmp}/p{page}'], check=True)
    return Image.open(f'{tmp}/p{page}-000.jpg').convert('RGB')

def find_top(a, x0, x1):
    inner = a[:, x0 + 60:x1 - 60]; g = inner.mean(2); sat = inner.max(2) - inner.min(2)
    y = 420
    while y < 900 and np.median(g[y]) >= 253: y += 1           # page white above the shadow
    for y in range(y + 1, 1000):
        if np.median(g[y]) >= 253 or (np.abs(g[y] - g[y - 1]) >= 5).mean() > 0.6 or (sat[y] >= 8).mean() > 0.6:
            return y
    raise SystemExit(f'no card top near x={x0}')

def uniform_runs(a, lo, hi, tol=6):
    rng = (a[:, 8:-8].max(1) - a[:, 8:-8].min(1)).max(1); uni = rng <= tol; out = []; s = None
    for i in range(lo, hi):
        if uni[i] and s is None: s = i
        if not uni[i] and s is not None: out.append((s, i)); s = None
    if s is not None: out.append((s, hi))
    return out

def trim_gaps(im, need):
    a = np.asarray(im).astype(int); h = a.shape[0]
    runs = sorted([r for r in uniform_runs(a, int(h * .1), int(h * .9)) if r[1] - r[0] >= 10], key=lambda r: r[0] - r[1])
    total = sum(int((r[1] - r[0]) * 0.6) for r in runs); drop = set(); left = need
    for r in runs:
        L = r[1] - r[0]; take = min(left, round(need * int(L * 0.6) / total) + 1, int(L * 0.6))
        s = (r[0] + r[1]) // 2 - take // 2; drop.update(range(s, s + take)); left -= take
        if left <= 0: break
    keep = [i for i in range(h) if i not in drop][: h - need]
    return Image.fromarray(a[keep].astype('uint8'))

def scroll_under(im, need, tab_top):
    a = np.asarray(im); keep = list(range(0, tab_top - need)) + list(range(tab_top, a.shape[0]))
    return Image.fromarray(a[keep])

with tempfile.TemporaryDirectory() as tmp:
    for slug, pages in (('fully-charged', (26, 27)), ('trackulizer', (29, 30))):
        n = 0
        os.makedirs(f'{OUT}/{slug}', exist_ok=True)
        for p in pages:
            im = page_image(PDF, p, tmp); a = np.asarray(im).astype(int)
            for x0 in GRID_X:
                n += 1; x1 = x0 + CARD_W; top = find_top(a, x0, x1)
                c = im.crop((x0 + 2, top + 2, x1 - 2, CARD_BOTTOM - 2))  # 2 px inside the anti-aliased edge
                need = c.height - round(c.width * TH / TW); rule = TALL.get((slug, n))
                if rule == 'gaps': c = trim_gaps(c, need)
                elif isinstance(rule, int): c = scroll_under(c, need, rule)
                c.save(f'{OUT}/{slug}/s{n:02d}.webp', 'WEBP', quality=92, method=6)
                print(f'"ui/{slug}/s{n:02d}":[{c.width},{c.height}]')
