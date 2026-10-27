"""Launch an installed AfterStory patch with its native font/UI runtime on Wine."""
import argparse, hashlib, os, subprocess
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('game_folder',type=Path)
p.add_argument('--wine',default='wine',help='Wine executable supplied by your Wine installation')
p.add_argument('--prefix',type=Path,help='Existing Wine prefix containing the game')
a=p.parse_args(); game=a.game_folder.expanduser().resolve()
exe=game/'OT_AFTER.EXE'
if not exe.is_file() or not (game/'version.dll').is_file():p.error('Install the English patch in the AfterStory game folder first.')
env=dict(os.environ)
if a.prefix:env['WINEPREFIX']=str(a.prefix.expanduser().resolve())
overrides=[v for v in env.get('WINEDLLOVERRIDES','').split(';') if v and v.split('=')[0].lower()!='version']
env['WINEDLLOVERRIDES']=';'.join(overrides+['version=n,b'])
# This exact 2010 executable was verified under Wine. Unknown editions still
# launch normally, with no address-specific compatibility changes enabled.
env.pop('MAO_AFTERSTORY_WINE_COMPAT',None)
if hashlib.sha256(exe.read_bytes()).hexdigest()=='7cfc367072adb349f52e88e1ef1658f49b1c4cdfcbd43a868ee5069d00b19724':
    env['MAO_AFTERSTORY_WINE_COMPAT']='1'
    print('Enabling the verified 2010 AfterStory Wine compatibility repair.',flush=True)
raise SystemExit(subprocess.call([a.wine,str(exe)],cwd=game,env=env))
