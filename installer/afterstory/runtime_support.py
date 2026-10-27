"""Transactional installation of the shared per-game font/UI runtime."""
import hashlib,json,os
from pathlib import Path

def sha(data):return hashlib.sha256(data).hexdigest()

class RuntimeInstall:
    def __init__(self,package,game,manifest):
        self.game=game;self.files={};self.before={};self.changed=[]
        state=game/'MAO-runtime.json'
        previous=json.loads(state.read_text(encoding='utf-8-sig')).get('files',{}) if state.exists() else {}
        for row in manifest.get('runtime_files',[]):
            name=row['name']
            if name not in ('version.dll','mao-font.ttf'):raise ValueError('Unexpected runtime file')
            blob=(package/name).read_bytes()
            if sha(blob)!=row['sha256']:raise ValueError('Runtime files are damaged; download the patch again.')
            dest=game/name;old=dest.read_bytes() if dest.exists() else None
            if old is not None and sha(old) not in (row['sha256'],previous.get(name)):
                raise ValueError(f'An unrelated {name} already exists. No game files were changed.')
            self.files[name]=blob;self.before[name]=old
        self.before['MAO-runtime.json']=state.read_bytes() if state.exists() else None
        self.files['MAO-runtime.json']=(json.dumps({'version':manifest['version'],'files':{n:sha(b) for n,b in self.files.items()}},indent=2)+'\n').encode()

    def apply(self):
        for name,blob in self.files.items():
            if self.before.get(name)==blob:continue
            temp=self.game/(name+'.mao-tmp')
            try:
                temp.write_bytes(blob);os.replace(temp,self.game/name);self.changed.append(name)
            finally:
                if temp.exists():temp.unlink()

    def rollback(self):
        for name in reversed(self.changed):
            old=self.before[name];path=self.game/name
            if old is None:path.unlink(missing_ok=True)
            else:path.write_bytes(old)
