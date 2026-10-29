ORETACHI NI TSUBASA WA NAI ~PRELUDE~ — MAO English v1.0.3

Requires the supported Japanese retail Prelude installation. This release
checks exact archive hashes, includes no game, and backs up the
changed files before installing. Close the game first.

OT_PREDE.EXE is never modified, hashed, backed up, or replaced. Existing
official unprotected or user-supplied no-disc executables are preserved byte
for byte. The included version.dll enforces the exact base-game MAO font and
provides English native menus and settings without changing the executable.

WINDOWS 10 / 11
1. Extract the entire ZIP.
2. Double-click "Install Prelude English Patch.cmd".
3. Choose the folder containing OT_PREDE.EXE.

macOS / WINE
Run:
  python3 /path/to/extracted-patch/install.py "/path/to/Prelude/game/folder"

The bundled font is loaded privately from the game folder. For Wine, set the
version DLL override to native, then builtin (version=n,b) in your wrapper.
Restore SCRIPT.LPK and SYS.LPK from MAO-original-backup and remove the added
version.dll, mao-font.ttf and MAO-runtime.json to remove the patch. Keep saves
backed up.

Credits
Project Lead: MAO
Translator: GPT-6 Astra
Font: MAO Gothic Q5I, derived from BIZ UDGothic under the SIL Open Font License.

Unofficial, noncommercial fan translation. Original work and trademarks belong
to their respective owners.

VERSION 1.0.2
Split-line continuation pages now remain available in the backlog and history navigation.
The fix preserves the live reading position when returning from history.

This update includes shared-text consistency edits, corrected character names, and refined apostrophe spacing.
