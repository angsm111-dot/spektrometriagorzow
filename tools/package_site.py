"""Create a static-hosting ZIP, without Git metadata, tests or unused source PNGs."""
from pathlib import Path
import sys
import os
import re
import subprocess
import zipfile

root = Path(__file__).resolve().parent.parent
output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/spektrometrgorzow-strona.zip')
version = os.environ.get('GITHUB_SHA')
if not version:
    result = subprocess.run(['git', '-C', str(root), 'rev-parse', 'HEAD'], capture_output=True, text=True)
    version = result.stdout.strip() if result.returncode == 0 else 'unversioned'
if not re.fullmatch(r'[a-zA-Z0-9-]+', version):
    raise ValueError('Invalid deployment version')
files = list(root.glob('*.html'))
unused = {'fischer-sd300-cutout.png', 'fischer-sd300-front.png', 'fischer-sd300-original.png'}
for directory in ['css', 'js', 'assets']:
    files.extend(p for p in (root / directory).rglob('*') if p.is_file() and p.name not in unused)
files.extend(root / name for name in ['robots.txt', 'sitemap.xml'])
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(files):
        name = path.relative_to(root).as_posix()
        if path.suffix == '.html':
            page = path.read_text()
            page = re.sub(r'<meta name="deployment-version" content="[^"]*">', '', page)
            page = page.replace('</head>', f'<meta name="deployment-version" content="{version}"></head>', 1)
            archive.writestr(name, page.encode('utf-8'))
        else:
            archive.write(path, name)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
print(f'{output}: {len(files)} files, {output.stat().st_size / 1024 / 1024:.1f} MB')
