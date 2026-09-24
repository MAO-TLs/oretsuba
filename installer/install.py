#!/usr/bin/env python3
"""Install the MAO patch using a legally obtained, matching Japanese copy."""
import argparse,hashlib,json,os,shutil,sys,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description='Install OreTsuba English v1.1.2. Close the game first.')
 p.add_argument('game_folder',type=Path);p.add_argument('--no-font-install',action='store_true',help='For package verification only; the game requires the bundled font.')
 args=p.parse_args();game=args.game_folder.resolve();m=json.loads((HERE/'patch.json').read_text())
 payload=(HERE/'patch.dat').read_bytes()
 if hashlib.sha256(payload).hexdigest()!=m['payload_sha256'] or sha(HERE/'mao-font.ttf')!=m['font_sha256']:raise ValueError('Patch files are damaged; download them again.')
 for f in m['files']:
  file=game/f['name']
  if not file.is_file() or sha(file) not in [f['source_sha256'],f['output_sha256']]+f.get('previous_output_sha256',[]):raise ValueError(f"{f['name']} does not match the supported Japanese v1.00 or this English patch. No game files were changed.")
 for f in m['files']:
  if sha(game/f['name']) in f.get('previous_output_sha256',[]):
   saved=game/'MAO-original-backup'/f['name']
   if not saved.is_file() or sha(saved)!=f['source_sha256']:raise ValueError('Updating requires the matching original in MAO-original-backup. No game files were changed.')
 with tempfile.TemporaryDirectory(prefix='mao-patch-',dir=game) as temp:
  stage=Path(temp);pending=[]
  for f in m['files']:
   file=game/f['name']
   if sha(file)==f['output_sha256']:continue
   source=game/'MAO-original-backup'/f['name'] if sha(file) in f.get('previous_output_sha256',[]) else file
   src=source.read_bytes();out=stage/f['name']
   with out.open('wb') as stream:
    for kind,offset,size in f['operations']:stream.write((src if kind=='source' else payload)[offset:offset+size])
   if out.stat().st_size!=f['output_size'] or sha(out)!=f['output_sha256']:raise ValueError('Patch verification failed before installation.')
   pending.append(f)
  if not args.no_font_install:
   if sys.platform=='darwin':
    fonts=Path.home()/'Library/Fonts';fonts.mkdir(parents=True,exist_ok=True);shutil.copy2(HERE/'mao-font.ttf',fonts/'MAOGothicQ2-Regular.ttf')
   elif os.name=='nt':raise ValueError('On Windows, use Install English Patch.cmd to register the font.')
   else:raise ValueError('Install the included font in your Wine environment, then rerun with --no-font-install.')
  backup=game/'MAO-original-backup';backup.mkdir(exist_ok=True)
  for f in pending:
   saved=backup/f['name']
   if saved.exists() and sha(saved)!=f['source_sha256']:raise ValueError('An existing backup differs; preserve it elsewhere before continuing.')
  for f in pending:
   if not (backup/f['name']).exists():shutil.copy2(game/f['name'],backup/f['name'])
  installed=[]
  try:
   for f in pending:(stage/f['name']).replace(game/f['name']);installed.append(f)
  except Exception:
   for f in installed:shutil.copy2(backup/f['name'],game/f['name'])
   raise
 print('English v1.1.2 installed. Originals are in MAO-original-backup. Restart the game and your Wine wrapper to load the font.')
if __name__=='__main__':
 try:main()
 except Exception as e:print('Installation stopped: '+str(e),file=sys.stderr);sys.exit(1)
