"""Refresh inline styles so HTML previews render before fetching extra assets."""
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
css = '\n'.join((root / name).read_text() for name in ['css/base.css', 'css/light.css'])
block = '<style id="site-styles">\n' + css + '\n</style>'
for page in root.glob('*.html'):
    source = page.read_text()
    if '<style id="site-styles">' in source:
        source = re.sub(r'<style id="site-styles">.*?</style>', lambda _: block, source, flags=re.S)
    else:
        source = source.replace('<link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/light.css">', block)
    # HTMLPreview mistakes links to another page's fragment for local anchors.
    source = source.replace('href="skup-zlota.html#kalkulator"', 'href="skup-zlota.html"')
    source = source.replace('name="theme-color" content="#080b0e"', 'name="theme-color" content="#faf8f4"')
    page.write_text(source)
