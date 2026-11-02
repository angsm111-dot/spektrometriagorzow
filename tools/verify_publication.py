"""Verify that the public blog lists and serves articles from this checkout."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin, urlencode
from urllib.request import Request, urlopen
import argparse
import time

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.articles = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            path = urlsplit(attrs.get('href', '')).path
            if path.endswith('.html'):
                self.articles.add(path.rsplit('/', 1)[-1])

def fetch(url, version):
    separator = '&' if '?' in url else '?'
    request = Request(url + separator + urlencode({'deployment': version}), headers={
        'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'User-Agent': 'SEZAM-publication-check/1.0'
    })
    with urlopen(request, timeout=20) as response:
        return response.read().decode('utf-8')

def verify(base, version):
    root = Path(__file__).resolve().parent.parent
    local = Links()
    local.feed((root / 'blog.html').read_text())
    article_names = {name for name in local.articles if name not in {
        'index.html', 'blog.html', 'technologia.html', 'analiza-xrf.html', 'kontakt.html',
        'skup-zlota.html', 'cennik.html', 'prezentacja.html'
    }}
    public = Links()
    public.feed(fetch(urljoin(base, 'blog.html'), version))
    missing = article_names - public.articles
    if missing:
        raise ValueError('Public blog is missing: ' + ', '.join(sorted(missing)))
    for name in sorted(article_names):
        content = fetch(urljoin(base, name), version)
        if '<h1>' not in content or 'SEZAM' not in content:
            raise ValueError('Unexpected article response: ' + name)
    print(f'PASS: public blog lists and serves all {len(article_names)} articles', flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='https://www.spektrometrgorzow.pl/')
    parser.add_argument('--version', required=True)
    parser.add_argument('--attempts', type=int, default=4)
    args = parser.parse_args()
    for attempt in range(args.attempts):
        try:
            verify(args.base.rstrip('/') + '/', args.version)
            break
        except Exception as error:
            print(f'Attempt {attempt + 1}: {error}', flush=True)
            if attempt + 1 == args.attempts:
                print(f'::error::Public website verification failed: {error}', flush=True)
                raise SystemExit(1)
            time.sleep(15)
