"""Build the configured public ZIP; --preview always exports the complete site."""
from pathlib import Path
import argparse
import os
import re
import subprocess
import zipfile
from site_deployment import ROOT, mode, public_pages

parser = argparse.ArgumentParser()
parser.add_argument('output', nargs='?', default='/tmp/spektrometrgorzow-strona.zip')
parser.add_argument('--preview', action='store_true', help='Export full source site for development, never used by production CI')
args = parser.parse_args()
output = Path(args.output)
version = os.environ.get('GITHUB_SHA')
if not version:
    result = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', 'HEAD'], capture_output=True, text=True)
    version = result.stdout.strip() if result.returncode == 0 else 'unversioned'
if not re.fullmatch(r'[a-zA-Z0-9-]+', version):
    raise ValueError('Invalid deployment version')
selected = 'live' if args.preview else mode()

def stamped(page):
    page = re.sub(r'<meta name="deployment-version" content="[^"]*">', '', page)
    return page.replace('</head>', f'<meta name="deployment-version" content="{version}"></head>', 1)

with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    if selected == 'maintenance':
        placeholder = stamped((ROOT / 'maintenance/index.html').read_text())
        for path in public_pages():
            archive.writestr(path.relative_to(ROOT).as_posix(), placeholder)
        archive.writestr('robots.txt', 'User-agent: *\nAllow: /\n')
        archive.writestr('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n')
    else:
        files = list(ROOT.glob('*.html'))
        unused = {'fischer-sd300-cutout.png', 'fischer-sd300-front.png', 'fischer-sd300-original.png'}
        for directory in ['css', 'js', 'assets']:
            files.extend(p for p in (ROOT / directory).rglob('*') if p.is_file() and p.name not in unused)
        files.extend(ROOT / name for name in ['robots.txt', 'sitemap.xml'])
        for path in sorted(files):
            name = path.relative_to(ROOT).as_posix()
            if path.suffix == '.html':
                archive.writestr(name, stamped(path.read_text()).encode('utf-8'))
            else:
                archive.write(path, name)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
    count = len(archive.namelist())
print(f'{output}: mode={selected}, {count} files, {output.stat().st_size / 1024 / 1024:.2f} MB')
