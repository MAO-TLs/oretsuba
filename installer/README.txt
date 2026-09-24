ORETACHI NI TSUBASA WA NAI — MAO English v1.1.0

Requires the Japanese retail v1.00 installation. The patch checks exact file
hashes and refuses other editions or modified files. It does not include the
game. Close the game before installation. Keep your saves backed up.

WINDOWS 10 / 11
1. Extract the entire ZIP to a folder.
2. Double-click "Install English Patch.cmd".
3. Select the installed Japanese game folder containing ORE_TUBA.EXE.
4. Start ORE_TUBA.EXE normally.
The installer installs the bundled BIZ UDGothic font for your user account,
verifies all three patched files, and backs up the originals. If the game is
installed in a protected folder, run the installer with permission to write
there, or use an installation in a folder you own.

macOS / WINE
Requires Python 3 and an existing working Japanese installation in Wine.
From Terminal, run:
  python3 /path/to/extracted-patch/install.py "/path/to/Japanese/game/folder"
The font is copied to ~/Library/Fonts. Quit and restart the Wine wrapper
before launching the game. The opening/prologue was tested with Sikarugir;
other wrappers and native Windows have not received a full runtime test.

The English game locks its text to BIZ UDGothic so the selected font option
cannot change its layout. Original title and decorative chapter logos remain.

TO REMOVE THE PATCH
Close the game. Copy ORE_TUBA.EXE, SCRIPT.LPK, and SYS.LPK from the
MAO-original-backup folder back into the game folder. Do not remove your saves.

VALIDATION
The packaged files are reconstructed exactly from the Japanese originals.
The opening and image prologue were visually reviewed on Wine. This is not a
claim of a full-game playthrough or native Windows validation.

CREDITS
Project Lead: MAO
Translator: GPT-6 Astra
Special Thanks: gambs
Font: BIZ UDGothic, distributed under the SIL Open Font License; see OFL.txt.
https://github.com/googlefonts/morisawa-biz-ud-gothic

Unofficial, noncommercial fan translation. Original work and trademarks
belong to their respective owners.

V1.1.0
- Corrects Bunny D's name throughout.
- Revises casual dialogue and character voice after a complete script scan.
- Relocalizes source-bound song, chant, and rap passages.
- Uses the narrow game-font apostrophe in contractions.
- Measures word wrapping against the locked BIZ UDGothic font.

To update an existing v1.0.0 installation, run this installer again. Keep
the MAO-original-backup folder from the original installation.
