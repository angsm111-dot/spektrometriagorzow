"""Create a static-hosting ZIP, without Git metadata, tests or unused source PNGs."""
from pathlib import Path
import sys
import zipfile

root = Path(__file__).resolve().parent.parent
output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/spektrometrgorzow-strona.zip')
files = list(root.glob('*.html'))
unused = {'fischer-sd300-cutout.png', 'fischer-sd300-front.png', 'fischer-sd300-original.png'}
for directory in ['css', 'js', 'assets']:
    files.extend(p for p in (root / directory).rglob('*') if p.is_file() and p.name not in unused)
files.extend(root / name for name in ['robots.txt', 'sitemap.xml'])
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, path.relative_to(root).as_posix())
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
print(f'{output}: {len(files)} files, {output.stat().st_size / 1024 / 1024:.1f} MB')
