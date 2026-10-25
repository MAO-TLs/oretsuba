"""Import the accepted family manuscripts and verified installers into this release."""
import argparse
import hashlib
import json
import re
import shutil
import zipfile
from collections import defaultdict
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
VERSION = "1.3.0"

def load(path):
    return json.loads(path.read_text())

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n")

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def clean_japanese(row):
    text = row.get("source_body", row["japanese"])
    text = text.removeprefix("\x02\uf8f3\uf8f3\uf8f3\uf8f3")
    return re.sub(r"^(?:<-?\d+>\\?)*", "", text).strip()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--outputs", type=Path, required=True)
    args = parser.parse_args()
    outputs = args.outputs.resolve()
    data = SITE / "public/script-data"
    index, corpus = load(data / "index.json"), load(data / "concordance.json")
    for doc in (index, corpus):
        doc["routes"] = [r for r in doc["routes"] if r["id"] not in ("prelude", "afterstory")]
    assets = outputs / "oretsuba-family/release/v1.3.0"
    assets.mkdir(parents=True, exist_ok=True)
    editions = []
    for game, label, count in (("prelude", "Prelude", 8936), ("afterstory", "AfterStory", 18027)):
        candidate = outputs / f"oretsuba-{game}-translation/release_candidate"
        manuscript = candidate / ("full_story.jsonl" if game == "afterstory" else "story.jsonl")
        rows = [json.loads(line) for line in manuscript.read_text().splitlines()]
        assert len(rows) == count
        by_file = defaultdict(list)
        for row in rows:
            by_file[row["file"]].append(row)
        route = {"id": game, "label": label, "lineCount": count, "scripts": []}
        concordance_route = {**route, "scripts": []}
        for filename, records in by_file.items():
            script_id = game + "-" + Path(filename).stem
            lines = []
            for i, row in enumerate(records):
                assert row["english"].strip()
                suffix = row["ref"].rsplit(":", 1)[1]
                lines.append({"ref": f"oretsuba:{game}:{script_id}:{suffix}", "sourceRef": row["ref"],
                    "line": i + 1, "speakerJa": row.get("source_speaker", row.get("speaker_japanese")) or "",
                    "speakerEn": row.get("speaker") or "", "japanese": clean_japanese(row), "english": row["english"]})
            payload = {"route": game, "routeLabel": label, "scriptId": script_id, "lineCount": len(lines), "lines": lines}
            save(data / (script_id + ".json"), payload)
            route["scripts"].append({"id": script_id, "file": script_id + ".json", "lineCount": len(lines),
                "firstRef": lines[0]["ref"], "lastRef": lines[-1]["ref"]})
            concordance_route["scripts"].append({"id": script_id, "lineCount": len(lines), "lines": [
                [r["ref"], r["line"], r["speakerJa"], r["speakerEn"], r["japanese"], r["english"], ""] for r in lines]})
        index["routes"].append(route)
        corpus["routes"].append(concordance_route)

        rc = outputs / f"oretsuba-{game}-release/v1.0.0-rc1"
        verification = load(rc / "installer_verification.json")
        assert verification["errors"] == 0 and verification["clean_install"] and verification["repeat_install"]
        package = SITE / "installer" / game
        package.mkdir(parents=True, exist_ok=True)
        for src in (rc / "package").iterdir():
            if src.is_file():
                shutil.copy2(src, package / src.name)
        for file in package.iterdir():
            if file.suffix in (".json", ".py", ".ps1", ".cmd", ".txt"):
                raw = file.read_bytes().replace(b"1.0.0-rc1", b"1.0.0")
                file.write_bytes(raw)
        patch = load(package / "patch.json")
        for row in patch["files"]:
            assert sha(candidate / "build" / row["name"]) == row["output_sha256"]
        assert sha(package / "patch.dat") == patch["payload_sha256"]
        name = f"OreTsuba-{label}-English-v1.0.0.zip"
        archive = assets / name
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            for path in sorted(package.iterdir()):
                if path.is_file():
                    z.write(path, path.name)
        with zipfile.ZipFile(archive) as z:
            assert z.testzip() is None
        editions.append({"id": game, "title": label, "version": "1.0.0", "lines": count, "scripts": len(by_file),
            "file": name, "zip_sha256": sha(archive), "zip_bytes": archive.stat().st_size,
            "url": f"https://github.com/MAO-TLs/oretsuba/releases/download/v{VERSION}/{name}",
            "manuscript_sha256": sha(manuscript), "files": [{k:v for k,v in r.items() if k != "operations"} for r in patch["files"]]})
    total = sum(r["lineCount"] for r in index["routes"])
    for doc in (index, corpus):
        doc["version"] = "v" + VERSION
        doc["totalLines"] = total
    index["generatedAt"] = "release-v" + VERSION
    index["concordance"]["totalLines"] = total
    save(data / "index.json", index)
    save(data / "concordance.json", corpus)
    save(data / "summary.json", {"totalLines": total, "totalScripts": sum(len(r["scripts"]) for r in index["routes"]), "version": "v" + VERSION})
    release = load(SITE / "public/release.json")
    release.update(version=VERSION, main_game_version="1.2.11", editions=editions)
    save(SITE / "public/release.json", release)
    original = outputs / "oretsuba-release/v1.2.11/OreTsuba-English-v1.2.11.zip"
    assert sha(original) == release["zip_sha256"]
    shutil.copy2(original, assets / original.name)
    checksums = f"{sha(original)}  {original.name}\n" + "".join(f"{e['zip_sha256']}  {e['file']}\n" for e in editions)
    (SITE / "public/SHA256SUMS.txt").write_text(checksums)
    (assets / "SHA256SUMS.txt").write_text(checksums)
    print(json.dumps({"lines": total, "scripts": sum(len(r["scripts"]) for r in index["routes"]), "assets": str(assets)}))

if __name__ == "__main__":
    main()
