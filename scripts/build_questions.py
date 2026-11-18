#!/usr/bin/env python3
"""Parse content/questions/d*.md into content/questions.json and validate.

Checks: required fields, option explanations for every option, valid answers,
select count matches answer count, objective belongs to domain and exists,
every objective covered, weighted distribution, answer-letter balance.
"""
import collections
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
QDIR = ROOT / "content" / "questions"
OBJ = json.loads((ROOT / "content" / "objectives.json").read_text(encoding="utf-8"))
OUT = ROOT / "content" / "questions.json"
REQ = ["objective", "difficulty", "select", "scenario", "question", "answer", "lesson", "source"]
TARGET = {"D1": 25, "D2": 20, "D3": 29, "D4": 24, "D5": 21, "D6": 21, "D7": 10}


def parse(path):
    out = []
    for block in re.split(r"\n## ", path.read_text(encoding="utf-8"))[1:]:
        qid, _, body = block.partition("\n")
        q = {"question_id": qid.strip(), "options": {}, "option_explanations": {}}
        for line in body.splitlines():
            m = re.match(r"^(why [A-E]|[A-E]|[a-z_]+):\s?(.*)$", line)
            if not m:
                continue
            k, v = m.group(1), m.group(2).strip()
            if re.fullmatch(r"[A-E]", k):
                q["options"][k] = v
            elif k.startswith("why "):
                q["option_explanations"][k[4:]] = v
            else:
                q[k] = v
        out.append(q)
    return out


def main():
    objs = {o["objective_id"]: o for o in OBJ["objectives"]}
    errors, questions = [], []
    for path in sorted(QDIR.glob("d[1-7].md")):
        did = "D" + path.stem[1]
        for q in parse(path):
            qid = q["question_id"]
            for f in REQ:
                if not q.get(f):
                    errors.append(f"{qid}: missing {f}")
            q["domain_id"] = did
            oid = q.get("objective", "")
            if oid not in objs or objs[oid]["domain_id"] != did:
                errors.append(f"{qid}: objective {oid} invalid for {did}")
            if not qid.startswith(did + "-"):
                errors.append(f"{qid}: id prefix mismatch")
            ans = [a.strip() for a in q.get("answer", "").split(",") if a.strip()]
            n = int(q.get("select", "1") or 1)
            if len(ans) != n:
                errors.append(f"{qid}: select {n} but {len(ans)} answers")
            if n == 1 and len(q["options"]) != 4:
                errors.append(f"{qid}: single-select needs 4 options")
            if n > 1 and len(q["options"]) != 5:
                errors.append(f"{qid}: multi-select needs 5 options")
            for a in ans:
                if a not in q["options"]:
                    errors.append(f"{qid}: answer {a} not an option")
            if set(q["options"]) != set(q["option_explanations"]):
                errors.append(f"{qid}: every option needs a 'why'")
            if q.get("difficulty") not in ("Easy", "Medium", "Hard"):
                errors.append(f"{qid}: bad difficulty")
            questions.append({
                "question_id": qid, "domain_id": did, "objective_id": oid,
                "difficulty": q.get("difficulty"), "select": n,
                "scenario": q.get("scenario"), "question": q.get("question"),
                "answer_options": q["options"], "correct_answer": ans,
                "explanation": q["option_explanations"].get(ans[0], "") if ans else "",
                "option_explanations": q["option_explanations"],
                "exam_lesson": q.get("lesson"), "source_reference": q.get("source"),
            })
    ids = [q["question_id"] for q in questions]
    for d in [i for i, c in collections.Counter(ids).items() if c > 1]:
        errors.append(f"duplicate id {d}")
    covered = {q["objective_id"] for q in questions}
    for oid in objs:
        if oid not in covered:
            errors.append(f"objective {oid} has no questions")
    by_dom = collections.Counter(q["domain_id"] for q in questions)
    singles = collections.Counter(q["correct_answer"][0] for q in questions if q["select"] == 1)
    diff = collections.Counter(q["difficulty"] for q in questions)
    OUT.write_text(json.dumps({"disclaimer": "Original practice items. Not actual Anthropic exam questions.",
                               "questions": questions}, indent=1, ensure_ascii=False), encoding="utf-8")
    total = len(questions)
    print(f"questions={total} multi={sum(q['select'] > 1 for q in questions)}")
    for d in sorted(TARGET):
        share = 100 * by_dom[d] / total if total else 0
        print(f"  {d}: {by_dom[d]:>3} (target {TARGET[d]}) {share:4.1f}%")
    print("single-answer letters:", dict(sorted(singles.items())))
    print("difficulty:", dict(diff))
    # Test-wiseness guard: the correct option must not be predictable by length.
    def rank(q):
        lens = sorted((len(v) for v in q["answer_options"].values()), reverse=True)
        return lens.index(len(q["answer_options"][q["correct_answer"][0]])) + 1
    sq = [q for q in questions if q["select"] == 1]
    ranks = collections.Counter(rank(q) for q in sq)
    print("correct-option length rank (1=longest):", dict(sorted(ranks.items())))
    for r, c in ranks.items():
        if sq and c / len(sq) > 0.35:
            errors.append(f"length bias: correct option has length rank {r} in {c}/{len(sq)} items")
    print("errors:", len(errors))
    for e in errors:
        print("ERROR:", e)
    strict = "--strict" in sys.argv
    sys.exit(1 if errors and strict else 0)


if __name__ == "__main__":
    main()
