"""Builds a single-file copy of the site: every image and a lighter copy of the PDF are
embedded, so the one .html file can be sent to someone and opened without a server.

    python3 make_share.py <dist folder> <pdf to embed> <output .html>
    e.g. python3 make_share.py dist Ali-Algailani-Portfolio-2026-light.pdf Ali-Algailani-Portfolio.html
"""
import glob, os, re, sys, base64, json
D, PDF, OUT = (sys.argv[1:4] + [None] * 3)[:3]
D = D or 'dist'
PDF = PDF or os.path.join(D, 'Ali-Algailani-Portfolio-2026.pdf')
OUT = OUT or 'Ali-Algailani-Portfolio.html'
html=open(D+'/index.html',encoding='utf-8').read()
css=open(glob.glob(D+'/app/*.css')[0],encoding='utf-8').read()
js=open(glob.glob(D+'/app/*.js')[0],encoding='utf-8').read().replace('</script','<\\/script')
assets={}
for f in sorted(glob.glob(D+'/assets/**/*.webp', recursive=True)):
    assets[os.path.relpath(f, D+'/assets')[:-5]]='data:image/webp;base64,'+base64.b64encode(open(f,'rb').read()).decode()
fav='data:image/svg+xml;base64,'+base64.b64encode(open(D+'/favicon.svg','rb').read()).decode()
pdf=base64.b64encode(open(PDF,'rb').read()).decode()
html=re.sub(r'<link rel="stylesheet" href="app/[^"]+\.css" />', lambda m: '<style>'+css+'</style>', html)
html=html.replace('href="favicon.svg"', 'href="'+fav+'"')
boot = r'''<script>
window.__AA_ASSETS = %s;
/* the portfolio PDF travels inside this file: links to it download the embedded copy */
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href$=".pdf"]');
  var data = document.getElementById('aa-pdf');
  if (!a || !data) return;
  e.preventDefault();
  e.stopPropagation();
  var bin = atob(data.textContent.trim()), bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  var url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  var dl = document.createElement('a');
  dl.href = url; dl.download = 'Ali-Algailani-Portfolio-2026.pdf';
  document.body.appendChild(dl); dl.click(); dl.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
}, true);
</script>
''' % json.dumps(assets, separators=(',',':'))
app = '<script>'+js+'</script>\n<script type="application/octet-stream" id="aa-pdf">'+pdf+'</script>'
html=re.sub(r'<script defer src="app/[^"]+\.js"></script>', lambda m: boot+app, html)
assert 'app/main' not in html
out=OUT
open(out,'w',encoding='utf-8').write(html)
print(len(assets), round(os.path.getsize(out)/1e6,2), 'MB')
