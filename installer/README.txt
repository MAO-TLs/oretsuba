V1.2.5 CRASH HOTFIX
- Replaces one symbolic outburst with a faithful plain-text yell so the engine
  no longer receives a raw percent/control-like symbol sequence.

V1.2.4 SPEAKER NAMEPLATE FIT
- Shortens 79 overlong descriptive speaker labels across 229 occurrences.
- Keeps proper character names in full explicit-vowel Hepburn.
- Enforces a 17-glyph maximum for every translated speaker label.

V1.2.3 NAME, LANGUAGE, AND SCENE-SUMMARY FIXES
- Normalizes Japanese names to consistent ASCII Hepburn forms with explicit
  long vowels, while preserving the Hariu/Haryuu identity distinction.
- Uses American English spellings and ordinary American vocabulary throughout.
- Replaces visible scene-summary backslashes with real line feeds and wraps
  descriptions only between complete words.
- Corrects the installer version displayed after installation.

V1.2.1 WORDPLAY EQUIVALENCE REVISION
- Revises 264 source-bound lines so Japanese puns, homophones, verbal
  mistakes, altered idioms, and comic speech use equivalent English devices.
- Recasts Japanese-only pronoun, address-form, and demonstrative cues as
  visible English cues instead of explaining grammar the reader cannot see.
- Localizes stray honorific and fandom jargon into ordinary English.
- Aligns localized jokes across routes and repeated passages.
- Preserves plot meaning and avoids strengthening implications beyond the
  Japanese source.

V1.2.0 REGISTER AND RECURRENCE REVISION
- Revises thousands of lines so casual, rough, formal, comic, and lyrical
  Japanese registers carry the same force in natural English.
- Aligns substantive exact recurrences across routes and speaker labels.
- Retains short contextual variants where Japanese omits the subject,
  predicate, referent, or performance detail needed by English.
- Keeps the v1.1.6 font, 65-character wrapping, backlog fixes, romanized
  window title, and save paths.

ORETACHI NI TSUBASA WA NAI — MAO English v1.2.5

V1.2.2 DISPLAY FIXES
- Wraps scene-skip descriptions only at English word boundaries.
- Gives enlarged dialogue a safer right margin.
- Compresses the reported table measurement to two complete rows.

Requires the Japanese retail v1.00 installation. The patch checks exact file
hashes and refuses other editions or modified files. It does not include the
game. Close the game before installation. Keep your saves backed up.

WINDOWS 10 / 11
1. Extract the entire ZIP to a folder.
2. Double-click "Install English Patch.cmd".
3. Select the installed Japanese game folder containing ORE_TUBA.EXE.
4. Start ORE_TUBA.EXE normally.
The installer installs the bundled MAO Gothic Q3 font for your user account,
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

The English game locks its text to MAO Gothic Q3 so the selected font option
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
Font: MAO Gothic Q3, a BIZ UDGothic derivative with half-width curly quotes and a baseline ellipsis, distributed under the SIL Open Font License; see OFL.txt.
https://github.com/googlefonts/morisawa-biz-ud-gothic

Unofficial, noncommercial fan translation. Original work and trademarks
belong to their respective owners.

V1.1.4
- Replaces 31 post-2009 English slang and cadence choices with
  period-appropriate equivalents while preserving character voice.

V1.1.3
- Restores comic delivery in 19 lines: mangled greetings, false starts,
  clipped thanks, childish taunts, and rambling speech.

V1.1.2
- Shows continuation pages as consecutive backlog entries.
- Preserves dialogue text, timing, speaker names, and voice data.

V1.1.1
- Translates 54 choice options across 24 menus.
- Fixes curly quote spacing while preserving opening and closing shapes.
- Uses 65-character dialogue wrapping.

V1.1.0
- Corrects Bunny D's name throughout.
- Revises casual dialogue and character voice after a complete script scan.
- Relocalizes source-bound song, chant, and rap passages.
- Uses the narrow game-font apostrophe in contractions.
- Measures word wrapping against the locked BIZ UDGothic font.

To update an existing v1.0.0, v1.1.0, v1.1.1, v1.1.2, v1.1.3, v1.1.4, v1.1.5, v1.1.6, v1.2.0, v1.2.1, or v1.2.2 installation, run this installer again. Keep
the MAO-original-backup folder from the original installation.
