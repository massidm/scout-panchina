"""Costruisce il foglio gara da foglio/src.

  python3 foglio/build.py           -> foglio/index.html  (dentro l'app di squadra: librerie locali, senza rete)
  python3 foglio/build.py --claude  -> foglio/dist/foglio-gara-claude.html  (la pagina per claude.ai, librerie da CDN)
"""
import os, sys
d = os.path.dirname(os.path.abspath(__file__))
r = lambda f: open(os.path.join(d, 'src', f), encoding='utf-8').read()
pre, post = r('shell_pre.html'), r('shell_post.html')
body = r('dvw.js') + r('sheet.js') + r('app.js')
CDN = ['<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>',
       '<script src="https://cdn.jsdelivr.net/npm/svg2pdf.js@2.2.3/dist/svg2pdf.umd.min.js"></script>']
for c in CDN: assert c in pre, c
if '--claude' in sys.argv:
    out = os.path.join(d, 'dist', 'foglio-gara-claude.html'); os.makedirs(os.path.dirname(out), exist_ok=True)
    html = pre + body + post
else:
    out = os.path.join(d, 'index.html')
    pre = pre.replace(CDN[0], '<script>window.FG_IN_APP = true;</script>\n<script src="lib/jspdf.umd.min.js"></script>')
    pre = pre.replace(CDN[1], '<script src="lib/svg2pdf.umd.min.js"></script>')
    # app: manifest, icon, home-screen title, link back to the bench scout
    head = ('<link rel="manifest" href="../manifest.webmanifest"><link rel="icon" href="../icons/favicon-32.png">'
            '<link rel="apple-touch-icon" href="../icons/icon-180.png"><meta name="apple-mobile-web-app-capable" content="yes">'
            '<meta name="theme-color" content="#3E7D14">')
    pre = pre.replace('</head>', head + '</head>', 1)
    brand = '<div class="brand"><i aria-hidden="true"></i>Foglio gara'
    assert brand in pre
    pre = pre.replace(brand, '<a class="btn small ghost" href="../" id="toScout" title="Torna allo scout da panchina">← Scout</a>\n  ' + brand, 1)
    post = post.replace('</body>', "<script>if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});</script>\n</body>", 1)
    html = pre + body + post
open(out, 'w', encoding='utf-8').write(html)
print(out, len(html))
