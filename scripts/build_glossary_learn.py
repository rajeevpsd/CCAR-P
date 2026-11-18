#!/usr/bin/env python3
"""Build content/glossary.json and content/learn.json from Markdown sources and validate.

Glossary checks: required fields, valid group, objectives exist, no duplicate terms.
Learn checks: one episode per domain, one part per official objective, narration present,
exactly 3 knowledge checks per part with 4 options and a valid answer.
"""
import collections
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OBJ = json.loads((ROOT / "content" / "objectives.json").read_text(encoding="utf-8"))
OBJS = {o["objective_id"]: o for o in OBJ["objectives"]}
GROUPS = {"Cross-domain", "D1", "D2", "D3", "D4", "D5", "D6", "D7"}
GFIELDS = ["group", "objectives", "definition", "significance", "exam", "confusion"]
errors = []


def build_glossary():
    text = (ROOT / "content" / "glossary.md").read_text(encoding="utf-8")
    terms = []
    for block in re.split(r"\n### ", text)[1:]:
        name, _, body = block.partition("\n")
        t = {"term": name.strip()}
        for line in body.splitlines():
            m = re.match(r"^- ([a-z]+): (.*)$", line)
            if m:
                t[m.group(1)] = m.group(2).strip()
        for f in GFIELDS:
            if not t.get(f):
                errors.append(f"glossary '{t['term']}': missing {f}")
        if t.get("group") not in GROUPS:
            errors.append(f"glossary '{t['term']}': bad group {t.get('group')}")
        t["objectives"] = [o.strip() for o in t.get("objectives", "").split(",") if o.strip()]
        for o in t["objectives"]:
            if o not in OBJS:
                errors.append(f"glossary '{t['term']}': unknown objective {o}")
        t["related"] = [r.strip() for r in t.get("related", "").split(",") if r.strip()]
        terms.append({
            "term": t["term"], "group": t.get("group"), "objectives": t["objectives"],
            "definition": t.get("definition"), "architect_significance": t.get("significance"),
            "exam_relevance": t.get("exam"), "common_confusion": t.get("confusion"),
            "related": t["related"], "source": t.get("source", ""),
        })
    dup = [n for n, c in collections.Counter(x["term"].lower() for x in terms).items() if c > 1]
    for d in dup:
        errors.append(f"glossary duplicate term {d}")
    return terms


def build_learn():
    episodes = []
    for path in sorted((ROOT / "content" / "learn").glob("d[1-7].md")):
        did = "D" + path.stem[1]
        text = path.read_text(encoding="utf-8")
        title = re.search(r"^# (.+)$", text, re.M).group(1)
        intro = re.search(r"^intro: (.+)$", text, re.M)
        parts = []
        for block in re.split(r"\n## Part ", text)[1:]:
            head, _, body = block.partition("\n")
            oid, _, ptitle = head.partition(" – ")
            fields = dict(re.findall(r"^(minutes|concepts|example|takeaway): (.+)$", body, re.M))
            narr = re.search(r"^narration:\n(.*?)(?=^check:)", body, re.M | re.S)
            checks = []
            for c in re.findall(r"^check: (.+)$", body, re.M):
                segs = [s.strip() for s in c.split("||")]
                q = segs[0]
                opts = {}
                ans = why = ""
                for s in segs[1:]:
                    m = re.match(r"^([A-D])\) (.+)$", s)
                    if m:
                        opts[m.group(1)] = m.group(2)
                    elif s.startswith("answer:"):
                        ans = s.split(":", 1)[1].strip()
                    elif s.startswith("why:"):
                        why = s.split(":", 1)[1].strip()
                if len(opts) != 4 or ans not in opts or not why:
                    errors.append(f"learn {oid}: malformed check '{q[:40]}'")
                checks.append({"question": q, "options": opts, "answer": ans, "why": why})
            oid = oid.strip()
            if oid not in OBJS or OBJS[oid]["domain_id"] != did:
                errors.append(f"learn: part {oid} not an objective of {did}")
            if len(checks) != 3:
                errors.append(f"learn {oid}: {len(checks)} checks, need 3")
            for f in ("minutes", "concepts", "example", "takeaway"):
                if not fields.get(f):
                    errors.append(f"learn {oid}: missing {f}")
            if not narr or len(narr.group(1).split()) < 120:
                errors.append(f"learn {oid}: narration missing or too short")
            parts.append({
                "objective_id": oid, "title": ptitle.strip(),
                "official_wording": OBJS.get(oid, {}).get("official_wording", ""),
                "minutes": int(fields.get("minutes", 0) or 0),
                "key_concepts": [c.strip() for c in fields.get("concepts", "").split(";")],
                "architecture_example": fields.get("example", ""),
                "exam_takeaway": fields.get("takeaway", ""),
                "narration": re.sub(r"\n{2,}", "\n\n", narr.group(1).strip()) if narr else "",
                "knowledge_check": checks,
            })
        episodes.append({"domain_id": did, "title": title,
                         "intro": intro.group(1) if intro else "", "parts": parts})
    covered = {p["objective_id"] for e in episodes for p in e["parts"]}
    for oid in OBJS:
        if oid not in covered:
            errors.append(f"learn: objective {oid} has no part")
    if len(episodes) != 7:
        errors.append(f"learn: {len(episodes)} episodes, need 7")
    return episodes


def main():
    terms = build_glossary()
    episodes = build_learn()
    (ROOT / "content" / "glossary.json").write_text(
        json.dumps({"terms": terms}, indent=1, ensure_ascii=False), encoding="utf-8")
    (ROOT / "content" / "learn.json").write_text(
        json.dumps({"episodes": episodes}, indent=1, ensure_ascii=False), encoding="utf-8")
    groups = collections.Counter(t["group"] for t in terms)
    parts = [p for e in episodes for p in e["parts"]]
    words = sum(len(p["narration"].split()) for p in parts)
    letters = collections.Counter(c["answer"] for p in parts for c in p["knowledge_check"])
    print(f"glossary terms={len(terms)} groups={dict(sorted(groups.items()))}")
    print(f"learn episodes={len(episodes)} parts={len(parts)} narration_words={words} "
          f"minutes={sum(p['minutes'] for p in parts)} checks={sum(len(p['knowledge_check']) for p in parts)}")
    print("check answer letters:", dict(sorted(letters.items())))
    ranks = collections.Counter()
    for p in parts:
        for c in p["knowledge_check"]:
            lens = sorted((len(v) for v in c["options"].values()), reverse=True)
            ranks[lens.index(len(c["options"][c["answer"]])) + 1] += 1
    total = sum(ranks.values())
    print("check correct-option length rank:", dict(sorted(ranks.items())))
    if total and ranks[1] / total > 0.40:
        errors.append(f"knowledge checks: correct option is longest in {ranks[1]}/{total}")
    print("errors:", len(errors))
    for e in errors:
        print("ERROR:", e)
    sys.exit(1 if errors and "--strict" in sys.argv else 0)


if __name__ == "__main__":
    main()
