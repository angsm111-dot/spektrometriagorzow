"""Emit lftp removals for our tracked public assets, only in maintenance mode."""
from site_deployment import mode, owned_assets

if mode() == 'maintenance':
    for name in owned_assets():
        # lftp command-file quoting, not shell interpolation.
        quoted = ('public_html/' + name).replace('\\', '\\\\').replace('"', '\\"')
        print(f'rm -f "{quoted}"')
