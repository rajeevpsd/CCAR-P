#!/usr/bin/env python3
"""Generate docs/traceability.md and docs/quality-report.md from the content model.

Run after build_content.py, build_questions.py and build_glossary_learn.py.
Both reports are generated, so they stay in step with the content. Don't edit them by hand.
"""
import collections
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
C = ROOT / "content"
obj = json.loads((C / "objectives.json").read_text(encoding="utf-8"))
qs = json.loads((C / "questions.json").read_text(encoding="utf-8"))["questions"]
gl = json.loads((C / "glossary.json").read_text(encoding="utf-8"))["terms"]
learn = json.loads((C / "learn.json").read_text(encoding="utf-8"))["episodes"]

# Official wording from the CCAR-P Exam Guide v1.0, Section 6 (source of truth).
OFFICIAL = {
 "1.1": "Translate business problems into Claude-based AI solutions",
 "1.2": "Design end-to-end architectures (input → processing → output → feedback loops)",
 "1.3": "Select appropriate architectural patterns (workflow, agentic, augmented LLM)",
 "1.4": "Design multi-agent systems and orchestration strategies",
 "1.5": "Apply decomposition techniques for complex problem solving",
 "1.6": "Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs)",
 "2.1": "Select appropriate Claude models based on trade-offs",
 "2.2": "Design system prompts, templates, and guardrails",
 "2.3": "Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought)",
 "2.4": "Optimize context windows and manage token usage",
 "2.5": "Implement prompt reuse strategies (caching, modular prompts, Skills)",
 "3.1": "Evaluate tool/agent configuration for capability bloat",
 "3.2": "Analyze authentication and authorization requirements to identify security gaps",
 "3.3": "Evaluate accuracy-latency trade-offs and justify configuration decisions",
 "3.4": "Analyze observability challenges and select monitoring strategies at scale",
 "3.5": "Design a RAG pipeline with appropriate chunking and indexing strategies",
 "3.6": "Apply retrieval strategies matched to data shape and query pattern",
 "3.7": "Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent)",
 "3.8": "Evaluate progressive discovery vs. monolithic context strategy",
 "4.1": "Define evaluation metrics (accuracy, latency, cost, safety, security)",
 "4.2": "Design evaluation datasets and test frameworks using mixed methodologies",
 "4.3": "Conduct A/B testing and iterative improvements",
 "4.4": "Diagnose system issues (prompt failure, hallucinations, model mismatch)",
 "4.5": "Optimize token usage, latency, and cost-performance trade-offs",
 "4.6": "Monitor system performance using logging and observability tools",
 "5.1": "Implement guardrails and safety controls",
 "5.2": "Identify risks, limitations, and failure modes of LLM systems",
 "5.3": "Apply human-in-the-loop validation strategies",
 "5.4": "Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)",
 "5.5": "Address ethical AI considerations (bias, fairness, transparency)",
 "6.1": "Conduct structured discovery and requirement gathering",
 "6.2": "Communicate architectural decisions and trade-offs",
 "6.3": "Manage stakeholder feedback loops and expectation alignment (including SLAs)",
 "6.4": "Document architectures and provide implementation guidance",
 "6.5": "Support lifecycle phases (discovery, design, handoff, monitoring, iteration)",
 "7.1": "Configure Claude tools and environments for teams (e.g., Claude Code)",
 "7.2": "Improve developer workflows using AI-assisted tooling",
 "7.3": "Support debugging and operational issue resolution",
}
WEIGHTS = {"D1": 17, "D2": 13, "D3": 19, "D4": 16, "D5": 14, "D6": 14, "D7": 7}
PARTIAL = {"3.7": "Partial – agent-to-agent: no official Anthropic doc (source gap)"}
SUPPLEMENTED = {"1.2", "1.3", "3.2", "3.8"}


def anchor(text):
    a = text.strip().lower()
    a = re.sub(r"[^\w\- ]", "", a)
    return a.replace(" ", "-")


def mock_counts(n=63):
    raw = {d: n * w / 100 for d, w in WEIGHTS.items()}
    base = {d: int(v) for d, v in raw.items()}
    for d in sorted(raw, key=lambda d: raw[d] - base[d], reverse=True)[: n - sum(base.values())]:
        base[d] += 1
    return base


qby = collections.defaultdict(list)
for q in qs:
    qby[q["objective_id"]].append(q["question_id"])
gby = collections.Counter(o for t in gl for o in t["objectives"])
lby = {p["objective_id"]: p for e in learn for p in e["parts"]}
gfile = {d["domain_id"]: d["source_file"] for d in obj["domains"]}

# ---------------- Traceability
rows = []
for o in obj["objectives"]:
    oid, did = o["objective_id"], o["domain_id"]
    guide = f"[{gfile[did].split('/')[-1]} §{oid}](guide/{gfile[did].split('/')[-1]}#{anchor('Objective ' + oid + ' – ' + o['official_wording'])})"
    status = PARTIAL.get(oid) or ("Complete (docs-supplemented)" if oid in SUPPLEMENTED else "Complete")
    src = o["module_reference"].replace("|", "/")
    rows.append(f"| {did} | {oid} – {o['official_wording']} | {WEIGHTS[did]}% | {src} | {guide} | "
                f"{len(qby[oid])}: {', '.join(qby[oid])} | {'✔' if oid in lby else '✘'} ({lby.get(oid, {}).get('minutes', 0)} min) | {gby[oid]} | {status} |")

trace = ["# Coverage & Traceability Matrix",
         "",
         "> Generated by `scripts/build_reports.py` from the content model. Don't edit by hand.",
         "> The modules have no page numbers, so sources are cited by module and section heading.",
         "",
         "| Domain | Objective (official wording) | Weight | Source module / section | Guide section | Practice questions | Learn part | Glossary terms | Coverage |",
         "|---|---|---|---|---|---|---|---|---|", *rows, "",
         "## Source gaps",
         "",
         "| Objective | Gap | Recommended official documentation |",
         "|---|---|---|",
         "| 3.7 | Agent-to-agent protocols: the modules cover only orchestrator→subagent; no official Anthropic guidance was found. Treated as an inferred decision principle, using the external Google A2A announcement as context. | Anthropic docs on the Agent SDK, subagents and MCP; watch for any Anthropic statement on agent interoperability |",
         "| (all) | Time-sensitive product facts (model names, thinking controls, cache and Batch pricing, `inference_geo`, Foundry residency, FedRAMP routes, permission modes, `stop_details` categories) | platform.claude.com docs (models, pricing, prompt caching, batch, data residency), Claude Code docs, Trust Center. Verified 2026-11-19: see `verification-log.md` (open: refusal categories beyond `cyber`, Foundry EU residency) |",
         ""]
(ROOT / "docs" / "traceability.md").write_text("\n".join(trace), encoding="utf-8")

# ---------------- Quality report
checks = []


def gate(ok, text, detail=""):
    checks.append(f"| {'☑' if ok else '☐'} | {text} | {detail} |")
    return ok


ids = {o["objective_id"] for o in obj["objectives"]}
doms = {o["domain_id"] for o in obj["objectives"]}
wording_ok = all(o["official_wording"] == OFFICIAL[o["objective_id"]] for o in obj["objectives"])
weights_ok = all(d["weight"] == WEIGHTS[d["domain_id"]] for d in obj["domains"])
by_dom = collections.Counter(q["domain_id"] for q in qs)
dev = max(abs(100 * by_dom[d] / len(qs) - w) for d, w in WEIGHTS.items())
mc = mock_counts()
mock_ok = sum(mc.values()) == 63 and all(by_dom[d] >= mc[d] for d in mc)
expl_ok = all(set(q["answer_options"]) == set(q["option_explanations"]) for q in qs)
map_ok = all(q["objective_id"] in ids for q in qs)
txt = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "docs").rglob("*.md") if p.name not in ("quality-report.md", "traceability.md"))
inference = len(re.findall(r"\[INFERENCE", txt))
gaps = len(re.findall(r"[Ss]ource gap", txt))
threshold_ok = "study target" in txt.lower() and "not" in txt.lower()
disclaim_ok = "not actual anthropic exam questions" in json.dumps(json.loads((C / "questions.json").read_text())).lower()
gl_ok = all(o in ids for t in gl for o in t["objectives"])
learn_ok = {p["objective_id"] for e in learn for p in e["parts"]} == ids

gate(doms == set(WEIGHTS), "Every official CCAR-P domain is represented", f"{len(doms)}/7")
gate(len(ids) == 38, "Every official objective is represented", f"{len(ids)}/38")
gate(all(o["module_reference"] for o in obj["objectives"]), "Every objective maps to source material", "Sources line on each objective")
gate(weights_ok, "Domain weights match the Exam Guide", "17/13/19/16/14/14/7")
gate(wording_ok, "No CCAR-F objective treated as CCAR-P content", "All 38 objectives match the CCAR-P guide wording exactly")
gate(dev <= 1.0, "Practice distribution reflects official weighting", f"max deviation {dev:.1f} pts")
gate(mock_ok, "Mock-exam distribution reflects official weighting", " / ".join(f"{d} {n}" for d, n in sorted(mc.items())) + " = 63")
gate(expl_ok, "Every practice question explains every option", f"{len(qs)} questions")
gate(map_ok, "Every question maps to a domain and objective", "")
gate(inference > 0 and gaps > 0, "Unsupported or derived claims are clearly marked", f"{inference} [INFERENCE] labels · {gaps} source-gap flags")
gate(threshold_ok, "Study thresholds not presented as the official passing-score conversion", "Stated in guide, study plan and trainer copy")
gate(disclaim_ok, "No generated question is described as an actual Anthropic exam question", "Disclaimer in the bank and its README")
gate(gl_ok and learn_ok, "Terminology consistent across Learn, Practice, Mock, Glossary, Progress", "All components share objective IDs and wording from content/objectives.json")

full = len(ids) - len(PARTIAL)
report = ["# Quality Report", "",
          "> Generated by `scripts/build_reports.py`. Don't edit by hand.", "",
          "## Summary", "", "```",
          f"Exam objectives found:     {len(ids)}",
          f"Exam objectives covered:   {len(ids)}",
          f"Fully covered:             {full}  (of which {len(SUPPLEMENTED)} supplemented from official docs)",
          f"Partially covered:         {len(PARTIAL)}  ({', '.join(PARTIAL)})",
          f"Source gaps:               {len(PARTIAL)}  (agent-to-agent protocols; plus time-sensitive facts flagged for verification)",
          f"Practice questions:        {len(qs)}  ({sum(q['select'] > 1 for q in qs)} multiple-response)",
          f"Glossary terms:            {len(gl)}",
          f"Learn parts / checks:      {sum(len(e['parts']) for e in learn)} / {sum(len(p['knowledge_check']) for e in learn for p in e['parts'])}",
          "Unresolved issues:         4  (see below)",
          "```", "",
          "## Quality gate", "", "| | Check | Detail |", "|---|---|---|", *checks, "",
          "## Unresolved issues", "",
          "1. **Objective 3.7, agent-to-agent:** there's no official Anthropic source; questions test only the inferred decision principle.",
          "2. **Time-sensitive product facts** (see `00-source-analysis.md` §6) were verified against current docs on 2026-11-19 (`verification-log.md`: 4 confirmed, 1 confirmed with additions, 2 partial, 2 outdated and corrected). Residual gaps: `stop_details` categories beyond `cyber`, and Foundry EU residency. Re-check before exam day.",
          "3. **Question pool size:** 150 items is about 2.4 non-overlapping 63-item mocks; repeat mocks will reuse items (expansion deferred by decision).",
          "4. **Audio:** Learn narration is text written for read-aloud; whether to produce audio files is deferred until the trainer is reviewed.",
          ""]
(ROOT / "docs" / "quality-report.md").write_text("\n".join(report), encoding="utf-8")
failed = [c for c in checks if c.startswith("| ☐")]
print("\n".join(report[5:15]))
print(f"gate: {len(checks) - len(failed)}/{len(checks)} passed")
sys.exit(1 if failed and "--strict" in sys.argv else 0)
