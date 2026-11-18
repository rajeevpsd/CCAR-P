# CCAR-P Preparation Guide (Phase 2)

There is one file per official domain, and one section per official objective, all using the same template:
*What you need to know · Why it matters · Architecture concepts · How it works · Architecture example · Decision framework · Exam decision signals · Common traps · Must remember · Quick recall · Sources.*

| # | Domain | Weight | Objectives | File |
|---|---|---|---|---|
| 1 | Solution Design & Architecture | 17% | 6 | [d1-solution-design.md](d1-solution-design.md) |
| 2 | Claude Models, Prompting & Context Engineering | 13% | 5 | [d2-models-prompting-context.md](d2-models-prompting-context.md) |
| 3 | Integration | 19% | 8 | [d3-integration.md](d3-integration.md) |
| 4 | Evaluation, Testing & Optimization | 16% | 6 | [d4-evaluation.md](d4-evaluation.md) |
| 5 | Governance, Safety & Risk Management | 14% | 5 | [d5-governance-safety.md](d5-governance-safety.md) |
| 6 | Stakeholder Communication & Lifecycle Management | 14% | 5 | [d6-stakeholder-lifecycle.md](d6-stakeholder-lifecycle.md) |
| 7 | Developer Productivity & Operational Enablement | 7% | 3 | [d7-devprod-ops.md](d7-devprod-ops.md) |
| – | Optional · Partner Track (not scored) | – | – | [optional-partner-track.md](optional-partner-track.md) |

**Source labels:** `[EXAM GUIDE]` · `[MODULE n]` · `[OFFICIAL ANTHROPIC DOCS]` · `[INFERENCE]`. Anything that couldn't be verified is marked *Source gap – verification required*. See [../00-source-analysis.md](../00-source-analysis.md).

**Study-target note:** readiness thresholds used in this project (75% / 70%) are study targets. They are **not** a conversion of the official scaled score of 720.

**Content build:** `python3 scripts/build_content.py` parses these files into `content/objectives.json`, the single content model the trainer app will use. It also checks that all 38 objectives and every template section are present.
