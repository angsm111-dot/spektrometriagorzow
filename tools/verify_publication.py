"""Verify that the public blog lists and serves articles from this checkout."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin, urlencode
from urllib.request import Request, urlopen
import argparse
import os
import re
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

observations = []

def fetch(url, version, cache_bust=True):
    headers = {'User-Agent': 'SEZAM-publication-check/1.0'}
    if cache_bust:
        separator = '&' if '?' in url else '?'
        url += separator + urlencode({'deployment': version})
        headers.update({'Cache-Control': 'no-cache', 'Pragma': 'no-cache'})
    with urlopen(Request(url, headers=headers), timeout=20) as response:
        text = response.read().decode('utf-8')
        observations.append({
            'url': response.url,
            'build': (re.search(r'<meta name="deployment-version" content="([^"]*)">', text).group(1) if re.search(r'<meta name="deployment-version" content="([^"]*)">', text) else 'missing'),
            'headers': {key: response.headers.get(key, '') for key in [
                'Server', 'Cache-Control', 'Age', 'X-LiteSpeed-Cache', 'CF-Cache-Status',
                'ETag', 'Last-Modified', 'X-Cache', 'Via'
            ]}
        })
        return text

def summarize(normal, uncached, expected):
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if not summary:
        return
    lines = ['## Public blog verification', '',
             f'Expected articles: {len(expected)}', '',
             f'Ordinary URL lists: {len(normal.articles & expected)} articles',
             f'Cache-busting URL lists: {len(uncached.articles & expected)} articles', '',
             'Missing at ordinary URL: ' + (', '.join(sorted(expected - normal.articles)) or 'none'), '']
    for item in observations[-2:]:
        lines += ['### ' + item['url'], '']
        lines += [f'- {key}: `{value}`' for key, value in item['headers'].items() if value]
        lines += ['']
    Path(summary).write_text('\n'.join(lines))

def verify(base, version):
    root = Path(__file__).resolve().parent.parent
    local = Links()
    local.feed((root / 'blog.html').read_text())
    article_names = {name for name in local.articles if name not in {
        'index.html', 'blog.html', 'technologia.html', 'analiza-xrf.html', 'kontakt.html',
        'skup-zlota.html', 'cennik.html', 'prezentacja.html'
    }}
    public = Links()
    public.feed(fetch(urljoin(base, 'blog.html'), version, cache_bust=False))
    uncached = Links()
    uncached.feed(fetch(urljoin(base, 'blog.html'), version))
    summarize(public, uncached, article_names)
    info = '; '.join(f'{item["url"]}: build={item["build"]}, server={item["headers"].get("Server", "")}, cache={item["headers"].get("Cache-Control", "")}, age={item["headers"].get("Age", "")}' for item in observations[-2:])
    print(f'::notice title=Blog versions::ordinary={len(public.articles & article_names)}; uncached={len(uncached.articles & article_names)}; {info}', flush=True)
    missing = article_names - public.articles
    if missing:
        raise ValueError('Ordinary blog URL is missing: ' + ', '.join(sorted(missing)))
    for path in sorted(root.glob('*.html')):
        page = '' if path.name == 'index.html' else path.name
        content = fetch(urljoin(base, page), version, cache_bust=False)
        marker = f'<meta name="deployment-version" content="{version}">'
        if marker not in content:
            raise ValueError('Public page has an older deployment version: ' + (page or '/'))
        if '<h1>' not in content or 'SEZAM' not in content:
            raise ValueError('Unexpected public page response: ' + path.name)
    print(f'PASS: public blog lists {len(article_names)} articles; all HTML pages match deployment {version}', flush=True)

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
