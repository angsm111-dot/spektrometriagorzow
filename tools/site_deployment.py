"""Shared deployment policy. Source pages remain available for development."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent

def mode():
    path = ROOT / 'deployment.json'
    # Missing or invalid settings must never accidentally publish the full site.
    if not path.exists():
        return 'maintenance'
    value = json.loads(path.read_text()).get('mode')
    if value not in {'maintenance', 'live'}:
        raise ValueError('deployment.json: mode must be maintenance or live')
    return value

def public_pages():
    paths = set(ROOT.glob('*.html'))
    versions = ROOT / 'versions'
    if versions.exists():
        paths.update(versions.rglob('*.html'))
    return sorted(paths)

def owned_assets():
    # Restrict removal to tracked site files. Never wipe hosting directories.
    names = subprocess.check_output(
        ['git', '-C', str(ROOT), 'ls-files', '-z', '--', 'assets', 'css', 'js'],
    ).decode().split('\0')
    result = []
    for name in names:
        if not name:
            continue
        path = Path(name)
        if path.is_absolute() or '..' in path.parts or path.parts[0] not in {'assets', 'css', 'js'}:
            raise ValueError('Unsafe deployment asset path')
        result.append(name)
    return sorted(result)
