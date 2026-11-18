# CCAR-P Study Plans

> These plans assume the recommended experience profile `[EXAM GUIDE §4]`. Time is split roughly by domain weight, complexity and prerequisites `[INFERENCE]`. Readiness thresholds (75% READY · 70–74% REVIEW · under 70% REPAIR) are **study targets**, not a conversion of the official scaled score of 720.

## How a study unit works
Every block in both plans follows the same cycle:

**LEARN** (Learn episode part or guide objective) → **REVIEW** (Must remember + Quick recall + comparisons) → **PRACTICE** (domain or objective questions in Coach mode) → **ANALYZE WRONG ANSWERS** (read *why each option is weaker*; tag the trap) → **REVISE** (re-read the objective's *Decision framework* and *Common traps*) → **RETEST** (a fresh question on the same objective, or the "Incorrect previously" practice mode)

## Effort allocation
| Order | Domain | Weight | Share of study time | Why it sits here |
|---|---|---|---|---|
| 1 | D1 Solution Design & Architecture | 17% | 17% | Foundation: decomposition and patterns feed every other domain |
| 2 | D2 Models, Prompting & Context | 13% | 12% | Model tiers, context and caching are prerequisites for D3/D4 |
| 3 | D3 Integration | 19% | 22% | Highest weight and highest complexity (8 objectives) |
| 4 | D4 Evaluation, Testing & Optimization | 16% | 16% | Builds on D2/D3 levers |
| 5 | D5 Governance, Safety & Risk | 14% | 14% | Uses D3 identity and D4 observability |
| 6 | D6 Stakeholder & Lifecycle | 14% | 12% | Mostly framework recall plus judgement |
| 7 | D7 Developer Productivity & Ops | 7% | 7% | Lowest weight; reuses D4/D2 ideas |

The question bank holds 150 items, so a second full mock will repeat some questions. Use **Exam mode** for mocks, and **New questions** or **Weak areas** for the practice between them.

---

## 2-Day Intensive Plan (about 16 hours)

### Day 1 — Design, models, integration
| Time | Block | Activity | Target |
|---|---|---|---|
| 08:00–08:15 | Orientation | Read *Exam at a glance* and the blueprint (`docs/00-source-analysis.md` §1–2) | Know the 7 domains and their weights |
| 08:15–09:00 | **Diagnostic** | Practice: Smart Mix, 21 questions, all domains, Exam-style (no coaching) | Baseline accuracy per domain |
| 09:00–10:30 | D1 (1.1–1.3) | LEARN parts 1.1–1.3 → REVIEW comparisons 1, 2, 4 → PRACTICE 8 Qs | ≥ 70% on D1 practice |
| 10:30–10:45 | Break | | |
| 10:45–11:45 | D1 (1.4–1.6) | LEARN 1.4–1.6 → PRACTICE 6 Qs → ANALYZE misses | Coverage check, R-S-A, five pillars memorised |
| 11:45–13:00 | D2 (all) | LEARN 2.1–2.5 → REVIEW comparisons 14, 20 → PRACTICE 10 Qs | Caching order and error codes (400 / 413 / context-window stop) known cold |
| 13:00–13:45 | Lunch | | |
| 13:45–15:15 | D3 (3.1–3.4) | LEARN 3.1–3.4 → PRACTICE 10 Qs → ANALYZE | Least privilege, identity injection, p95, change attribution |
| 15:15–15:30 | Break | | |
| 15:30–17:00 | D3 (3.5–3.8) | LEARN 3.5–3.8 → REVIEW comparisons 5–9, 19 → PRACTICE 10 Qs | RAG vs. tool, MCP vs. tool use, tool search |
| 17:00–17:45 | **Checkpoint 1** | Practice: D1+D2+D3, 20 Qs, Smart Mix | ≥ 70% on each of D1–D3 |
| 17:45–18:30 | REVISE + RETEST | Re-read traps for every missed objective; "Incorrect previously" mode | Clear all REPAIR objectives from today |

### Day 2 — Evaluation, governance, lifecycle, enablement, mock
| Time | Block | Activity | Target |
|---|---|---|---|
| 08:00–08:30 | Warm-up | Rapid-revision §6 "If you see X…" rules; RETEST 10 Day-1 misses | Recall without notes |
| 08:30–10:00 | D4 (all) | LEARN 4.1–4.6 → REVIEW comparisons 12, 13, 17 → PRACTICE 10 Qs | Grading ladder, shadow testing, failure taxonomy |
| 10:00–10:15 | Break | | |
| 10:15–11:30 | D5 (all) | LEARN 5.1–5.5 → REVIEW comparisons 15, 16 → PRACTICE 10 Qs | Three control points, fail closed, BAA per configuration, control register |
| 11:30–12:30 | D6 (all) | LEARN 6.1–6.5 → PRACTICE 9 Qs | Four discovery buckets, Gain / Give up / Reversal, SLA triad |
| 12:30–13:15 | Lunch | | |
| 13:15–13:45 | D7 (all) | LEARN 7.1–7.3 → PRACTICE 5 Qs | Plugins vs. org Skills; hooks; symptom → cause |
| 13:45–15:45 | **Full mock** | Mock Exam: 63 items, 120 minutes, timed, Exam mode | Overall ≥ 75%, no domain < 70% |
| 15:45–16:00 | Break | | |
| 16:00–17:15 | ANALYZE | Review every miss: tag the domain, objective and trap; read *Exam decision signals* | Repair-First list produced |
| 17:15–18:00 | REVISE + RETEST | Top 3 Repair-First objectives: LEARN part → 3 fresh Qs each | Each repaired objective ≥ 2/3 |
| 18:00–18:30 | Final | Rapid-revision §7 cheat sheet and §8 last-24-hours checklist | |

---

## 5-Day Standard Plan (about 3–4 hours a day)

| Day | Focus | Units (LEARN → REVIEW → PRACTICE → ANALYZE → REVISE → RETEST) | Day-level target |
|---|---|---|---|
| **1** | Diagnostic + D1 | Diagnostic 21 Qs (Smart Mix) · Episode 1 (6 parts, ~39 min) · comparisons 1–4 · D1 practice 15 Qs · analyse misses | D1 ≥ 70%; baseline recorded for all domains |
| **2** | D2 + D3 (first half) | Episode 2 (~29 min) · comparisons 10, 14, 20 · D2 practice 12 Qs · Episode 3 parts 3.1–3.4 · D3 practice 10 Qs | D2 ≥ 75%; 3.1–3.4 no RED objectives |
| **3** | D3 (second half) + D4 + **Checkpoint mock (half)** | Episode 3 parts 3.5–3.8 · comparisons 5–9, 19 · D3 practice 12 Qs · Episode 4 (~35 min) · D4 practice 12 Qs · **32-item half mock** (D1 8 · D2 6 · D3 10 · D4 8, timed 60 min, Exam mode) | Half mock ≥ 70% overall; D3 ≥ 70% |
| **4** | D5 + D6 + D7 | Episode 5 (~34 min) · comparisons 15–16 · D5 practice 12 Qs · Episode 6 (~29 min) · D6 practice 10 Qs · Episode 7 (~17 min) · D7 practice 6 Qs · RETEST Day-3 misses | D5–D7 ≥ 70%; all Day-3 misses retested |
| **5** | **Full mock** + repair | Mock Exam 63 items / 120 min (Exam mode) · ANALYZE every miss · Repair-First top 5 objectives: LEARN part + 3 Qs each · rapid-revision guide | Mock ≥ 75%; no domain < 70%; Repair-First list cleared to AMBER or better |

**Mock checkpoints:** Day 1 diagnostic (21 Qs) → Day 3 half mock (32 Qs) → Day 5 full mock (63 Qs). If the Day 5 mock is under 75% overall, or any domain is under 70%, add a repair day: run Repair-First, then a second full mock in Exam mode.

---

## Repair-First ranking (used after every checkpoint)
Rank weak objectives by **severity × weight × prerequisite importance** `[INFERENCE]`:
- **Severity:** RED (< 70%) = 3, AMBER (70–74%) = 2, NOT STARTED = 2.
- **Weight:** the domain weight / 10 (e.g. D3 = 1.9).
- **Prerequisite multiplier:** 1.3 for foundational objectives that other objectives build on (1.1, 1.3, 1.5, 2.1, 2.4, 3.6, 4.2, 5.1), otherwise 1.0.

Work the list top-down: LEARN part → *Common traps* → 3 fresh questions → RETEST the next day.
