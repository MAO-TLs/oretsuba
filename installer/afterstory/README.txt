ORETACHI NI TSUBASA WA NAI AFTERSTORY — MAO English v1.0.3

Requires the supported Japanese retail AfterStory installation. This release
checks exact source hashes, includes no game, and backs up the two
changed archives before installing. Close the game first.

WINDOWS 10 / 11
1. Extract the entire ZIP.
2. Double-click "Install AfterStory English Patch.cmd".
3. Choose the folder containing OT_AFTER.EXE.

macOS / WINE
Run:
  python3 /path/to/extracted-patch/install.py "/path/to/AfterStory/game/folder"

The runtime loads the exact base-game MAO Gothic Q5I font privately from the
game folder and enforces it at every supported font-creation call. The original
executable is preserved. For Wine, enable the version DLL override as native,
then builtin (version=n,b). Alternatively, use:
  python3 launch_afterstory_wine.py "/path/to/AfterStory/game/folder" --wine /path/to/wine --prefix /path/to/existing/prefix

This launcher also enables the Wine API-wrapper repair for the exact supported
2010 executable when detected. Other executable versions launch without that
address-specific repair. Existing disc/activation requirements are unchanged;
the patch does not replace the executable or include activation utilities.

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
