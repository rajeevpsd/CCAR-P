#!/usr/bin/env python3
"""Parse docs/guide/d*.md into content/objectives.json and validate structure.

Every objective must have every template heading. Fails (exit 1) on any gap.
The trainer app reads content/objectives.json, so guide prose is never
duplicated in the UI code.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
GUIDE = ROOT / "docs" / "guide"
OUT = ROOT / "content" / "objectives.json"

SECTIONS = [
    "What you need to know", "Why it matters", "Architecture concepts",
    "How it works", "Architecture example", "Decision framework",
    "Exam decision signals", "Common traps", "Must remember", "Quick recall",
]
EXPECTED = {"D1": 6, "D2": 5, "D3": 8, "D4": 6, "D5": 5, "D6": 5, "D7": 3}
WEIGHTS = {"D1": 17, "D2": 13, "D3": 19, "D4": 16, "D5": 14, "D6": 14, "D7": 7}
LABEL_RE = re.compile(r"\[(EXAM GUIDE|MODULE \d[^\]]*|OFFICIAL ANTHROPIC DOCS[^\]]*|INFERENCE[^\]]*)\]")


def front_matter(text):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def main():
    errors, domains, objectives = [], [], []
    for path in sorted(GUIDE.glob("d[1-7]-*.md")):
        meta, body = front_matter(path.read_text(encoding="utf-8"))
        did = meta["domain_id"]
        domains.append({
            "domain_id": did, "name": meta["domain_name"],
            "weight": int(meta["weight"]), "priority": meta["priority"],
            "modules": meta["modules"].strip("[]").replace(" ", "").split(","),
            "source_file": str(path.relative_to(ROOT)),
        })
        if int(meta["weight"]) != WEIGHTS[did]:
            errors.append(f"{did}: weight {meta['weight']} != Exam Guide {WEIGHTS[did]}")
        blocks = re.split(r"\n### Objective ", body)[1:]
        if len(blocks) != EXPECTED[did]:
            errors.append(f"{did}: {len(blocks)} objectives, expected {EXPECTED[did]}")
        for block in blocks:
            head, _, rest = block.partition("\n")
            oid, _, wording = head.partition(" – ")
            parts = re.split(r"\n#### ", "\n" + rest)
            secs = {}
            for p in parts[1:]:
                title, _, content = p.partition("\n")
                secs[title.strip()] = content.strip().removesuffix("---").strip()
            for s in SECTIONS:
                if not secs.get(s):
                    errors.append(f"{oid}: missing or empty section '{s}'")
            src = re.search(r"\*\*Sources:\*\*(.*)", rest)
            if not src:
                errors.append(f"{oid}: missing Sources line")
            if not oid.startswith(did[1] + "."):
                errors.append(f"{oid}: does not belong to {did}")
            objectives.append({
                "objective_id": oid.strip(), "domain_id": did,
                "official_wording": wording.strip(),
                "weight": WEIGHTS[did],
                "module_reference": src.group(1).strip() if src else "",
                "source_labels": sorted(set(LABEL_RE.findall(rest))),
                "sections": {s: secs.get(s, "") for s in SECTIONS},
            })
    if sum(EXPECTED.values()) != len(objectives):
        errors.append(f"total objectives {len(objectives)} != 38")
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps({"exam": {
        "code": "CCAR-P", "items": 63, "minutes": 120,
        "passing": "Scaled 720 on 100-1,000 (criterion-referenced)",
        "guide_version": "1.0 (July 2026)"},
        "domains": domains, "objectives": objectives}, indent=1, ensure_ascii=False),
        encoding="utf-8")
    print(f"domains={len(domains)} objectives={len(objectives)} errors={len(errors)}")
    for e in errors:
        print("ERROR:", e)
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
