# CCAR-P Study Plans

> These plans assume the recommended experience profile `[EXAM GUIDE §4]`. Time is split roughly by domain weight, complexity and prerequisites `[INFERENCE]`. Readiness thresholds (75% READY · 70–74% REVIEW · under 70% REPAIR) are **study targets**, not a conversion of the official scaled score of 720.

## How a study unit works
Every block in both plans follows the same cycle:

**LEARN** (Learn episode part, read along or listen) → **REVIEW** (the guide objective's *Must remember* and *Quick recall*, plus the related comparisons) → **PRACTICE** (domain or objective questions in Coach mode) → **ANALYZE WRONG ANSWERS** (read *why each option is weaker*; tag the trap) → **REVISE** (re-read the objective's *Decision framework* and *Common traps*) → **RETEST** (fresh questions on the same objective the next day, or the "Incorrect previously" practice mode)

## Effort allocation

The Learn track runs about **6 hours** in total (narration plus each part's knowledge check). The guide, comparisons and practice roughly double that.

| Order | Domain | Weight | Learn time | Bank Qs | Share of study time | Why it sits here |
|---|---|---|---|---|---|---|
| 1 | D1 Solution Design & Architecture | 17% | ~62 min (6 parts) | 25 | 17% | Foundation: decomposition and patterns feed every other domain |
| 2 | D2 Models, Prompting & Context | 13% | ~46 min (5 parts) | 20 | 12% | Model tiers, context and caching are prerequisites for D3 and D4 |
| 3 | D3 Integration | 19% | ~74 min (8 parts) | 29 | 22% | Highest weight and complexity |
| 4 | D4 Evaluation, Testing & Optimization | 16% | ~55 min (6 parts) | 24 | 16% | Builds on the D2 and D3 levers |
| 5 | D5 Governance, Safety & Risk | 14% | ~48 min (5 parts) | 21 | 14% | Uses D3 identity and D4 observability |
| 6 | D6 Stakeholder & Lifecycle | 14% | ~47 min (5 parts) | 21 | 12% | Mostly framework recall plus judgement |
| 7 | D7 Developer Productivity & Ops | 7% | ~30 min (3 parts) | 10 | 7% | Lowest weight; reuses D2 and D4 ideas |

The question bank holds 150 items, so later mocks will repeat some questions. Use **Exam mode** for mocks, and **New questions**, **Weak areas** or **Incorrect previously** for the practice between them.

**Mock checkpoints (both plans):** diagnostic (21 Qs) → D1–D3 checkpoint → half mock (32 items: D1 8 · D2 6 · D3 10 · D4 8, 60 min) → D5–D7 checkpoint → full mock 1 (63 items, 120 min) → full mock 2. If a full mock is under 75% overall, or any domain is under 70%, run a Repair-First day before the next mock.

---

## 14-Day Intensive Plan (about 3 hours a day)

| Day | Focus | Units (LEARN → REVIEW → PRACTICE → ANALYZE → REVISE → RETEST) | Day-level target |
|---|---|---|---|
| **1** | Orientation, diagnostic, D1 part 1 | Read *Exam at a glance* and the blueprint (`00-source-analysis.md` §1–2) · **Diagnostic:** Smart Mix, 21 Qs, all domains, no coaching · LEARN 1.1–1.3 (~34 min) · REVIEW comparisons 1, 2, 4 · PRACTICE 13 D1 Qs (1.1–1.3) · ANALYZE misses | Baseline per domain recorded; 1.1–1.3 ≥ 70% |
| **2** | D1 part 2 | RETEST Day-1 misses · LEARN 1.4–1.6 (~28 min) · REVIEW comparisons 3, 11 and guide 1.4–1.6 *Must remember* · PRACTICE remaining 12 D1 Qs · ANALYZE · REVISE *Common traps* | D1 ≥ 75%; coverage check, delegation lens and five pillars known cold |
| **3** | D2 | LEARN 2.1–2.5 (~46 min) · REVIEW comparisons 10, 14, 20 · PRACTICE all 20 D2 Qs · ANALYZE · REVISE caching order and the 400 / 413 / context-window stop distinction | D2 ≥ 75% |
| **4** | D3 part 1 | RETEST D2 misses · LEARN 3.1–3.4 (~37 min) · REVIEW guide 3.1–3.4 · PRACTICE 16 D3 Qs (3.1–3.4) · ANALYZE | Least privilege, server-side identity, load-bearing control and change attribution clear |
| **5** | D3 part 2 + **Checkpoint 1** | LEARN 3.5–3.8 (~37 min) · REVIEW comparisons 5–9, 19 · PRACTICE remaining 13 D3 Qs · **Checkpoint 1:** Smart Mix 20 Qs across D1–D3 | D3 ≥ 70%; each of D1–D3 ≥ 70% |
| **6** | D4 part 1 | RETEST Checkpoint 1 misses · LEARN 4.1–4.3 (~29 min) · REVIEW comparisons 12, 13 · PRACTICE 13 D4 Qs · ANALYZE | Grading ladder, judge calibration and A/B pre-registration known |
| **7** | D4 part 2 + **Half mock** | LEARN 4.4–4.6 (~26 min) · REVIEW comparison 17 · PRACTICE remaining 11 D4 Qs · **Half mock:** 32 items, 60 min, Exam mode · ANALYZE every miss | Half mock ≥ 70%; D4 ≥ 70% |
| **8** | D5 part 1 | Repair-First top 3 from the half mock (LEARN part + 3 Qs each) · LEARN 5.1–5.3 (~29 min) · REVIEW comparisons 11, 15, 16 · PRACTICE 13 D5 Qs | Guarded request path and review-routing rule known cold |
| **9** | D5 part 2 + D6 part 1 | LEARN 5.4–5.5 (~19 min) · PRACTICE remaining 8 D5 Qs · LEARN 6.1–6.2 (~19 min) · PRACTICE 9 D6 Qs · ANALYZE | D5 ≥ 75%; four discovery categories and reversal cost recalled |
| **10** | D6 part 2 | RETEST Day-9 misses · LEARN 6.3–6.5 (~28 min) · REVIEW comparison 18 and guide 6.3–6.5 · PRACTICE remaining 12 D6 Qs · ANALYZE · REVISE | D6 ≥ 75% |
| **11** | D7 + **Checkpoint 2** | LEARN 7.1–7.3 (~30 min) · REVIEW comparisons 9, 20 · PRACTICE all 10 D7 Qs · **Checkpoint 2:** Smart Mix 20 Qs across D5–D7 | D7 ≥ 70%; each of D5–D7 ≥ 70% |
| **12** | **Full mock 1** | Mock exam: 63 items, 120 min, Exam mode · ANALYZE every miss by objective · build the Repair-First list (Progress tab) | Mock ≥ 75%; no domain under 70% |
| **13** | Repair + **Full mock 2** | Repair-First top 5: LEARN part → *Common traps* → 3 fresh Qs each · **Full mock 2:** 63 items, Exam mode (some items repeat) · ANALYZE | Every Repair-First objective at AMBER or better |
| **14** | Final revision | `rapid-revision.md` cover to cover · RETEST "Incorrect previously" · the last-24-hours checklist · stop new material by early evening | Rapid-revision rules recalled without notes |

---

## 30-Day Standard Plan (about 1.5 hours a day)

### Week-by-week targets
| Week | Days | Focus | Week-level target |
|---|---|---|---|
| **1** | 1–7 | Orientation, diagnostic, D1 and D2 | D1 and D2 each ≥ 75% on practice |
| **2** | 8–14 | D3 (all eight parts) and Checkpoint 1 | D3 ≥ 70%; D1–D3 each ≥ 70% on Checkpoint 1 |
| **3** | 15–21 | D4, half mock, D5 | Half mock ≥ 70%; D4 and D5 ≥ 70% |
| **4** | 22–28 | D6, D7, Checkpoint 2, full mock 1 | Full mock 1 ≥ 75% with no domain under 70% |
| **Final** | 29–30 | Repair-First, full mock 2, final revision | Every objective at AMBER or better |

### Day-level targets
| Day | Units (LEARN → REVIEW → PRACTICE → ANALYZE → REVISE → RETEST) | Day-level target |
|---|---|---|
| **1** | Read *Exam at a glance* and the blueprint · **Diagnostic:** Smart Mix, 21 Qs, no coaching · note your three weakest domains | Baseline recorded |
| **2** | LEARN 1.1–1.2 (~23 min) · REVIEW guide 1.1–1.2 · PRACTICE 8 D1 Qs (1.1–1.2) · ANALYZE | Four properties and feasibility verdicts known |
| **3** | RETEST Day-2 misses · LEARN 1.3 (~11 min) · REVIEW comparisons 1, 2, 4 · PRACTICE 5 D1 Qs (1.3) · ANALYZE | Workflow vs. agent rule known cold |
| **4** | LEARN 1.4–1.5 (~19 min) · REVIEW comparisons 3, 11 · PRACTICE 8 D1 Qs (1.4–1.5) · REVISE | Coverage check and delegation lens known |
| **5** | LEARN 1.6 (~9 min) · PRACTICE remaining D1 Qs · ANALYZE all D1 misses · REVISE | D1 ≥ 75% |
| **6** | LEARN 2.1–2.3 (~27 min) · REVIEW comparisons 14, 20 · PRACTICE 12 D2 Qs (2.1–2.3) | Eval-gated tier move and technique progression known |
| **7** | LEARN 2.4–2.5 (~19 min) · REVIEW comparison 10 · PRACTICE remaining 8 D2 Qs · ANALYZE · RETEST week-1 misses | D2 ≥ 75% |
| **8** | LEARN 3.1–3.2 (~19 min) · REVIEW guide 3.1–3.2 · PRACTICE 9 D3 Qs (3.1–3.2) | Least privilege and server-side identity known |
| **9** | LEARN 3.3–3.4 (~18 min) · PRACTICE 7 D3 Qs (3.3–3.4) · ANALYZE | Load-bearing control and change attribution known |
| **10** | RETEST Days 8–9 misses · LEARN 3.5 (~9 min) · REVIEW comparison 7 · PRACTICE 4 D3 Qs (3.5) | Chunking and indexing rules known |
| **11** | LEARN 3.6–3.7 (~19 min) · REVIEW comparisons 5, 6, 8, 9 · PRACTICE 7 D3 Qs (3.6–3.7) | RAG vs. tool and MCP vs. tool use known cold |
| **12** | LEARN 3.8 (~9 min) · REVIEW comparison 19 · PRACTICE remaining D3 Qs · ANALYZE all D3 misses | D3 ≥ 70% |
| **13** | **Checkpoint 1:** Smart Mix 20 Qs across D1–D3 · ANALYZE · REVISE the two weakest objectives | D1–D3 each ≥ 70% |
| **14** | Buffer day: RETEST "Incorrect previously" · re-listen to any part where you scored under 70% | Week-2 misses cleared |
| **15** | LEARN 4.1–4.2 (~19 min) · REVIEW comparison 12 · PRACTICE 9 D4 Qs (4.1–4.2) | Grading ladder and judge calibration known |
| **16** | LEARN 4.3–4.4 (~18 min) · REVIEW comparison 13 · PRACTICE 8 D4 Qs (4.3–4.4) · ANALYZE | Failure classes and A/B pre-registration known |
| **17** | LEARN 4.5–4.6 (~18 min) · REVIEW comparison 17 · PRACTICE remaining 7 D4 Qs · ANALYZE · REVISE | D4 ≥ 70% |
| **18** | **Half mock:** 32 items, 60 min, Exam mode · ANALYZE every miss · build Repair-First list | Half mock ≥ 70% |
| **19** | Repair-First top 3 (LEARN part + 3 Qs each) · LEARN 5.1 (~12 min) · REVIEW comparisons 11, 16 | Guarded request path known cold |
| **20** | LEARN 5.2–5.3 (~17 min) · REVIEW comparison 15 · PRACTICE 13 D5 Qs (5.1–5.3) | Review-routing rule known |
| **21** | LEARN 5.4–5.5 (~19 min) · PRACTICE remaining 8 D5 Qs · ANALYZE · REVISE | D5 ≥ 75% |
| **22** | LEARN 6.1–6.2 (~19 min) · REVIEW guide 6.1–6.2 · PRACTICE 9 D6 Qs (6.1–6.2) | Four discovery categories and reversal cost known |
| **23** | LEARN 6.3–6.4 (~18 min) · PRACTICE 9 D6 Qs (6.3–6.4) · ANALYZE | Governance table and documentation test known |
| **24** | LEARN 6.5 (~10 min) · REVIEW comparison 18 · PRACTICE remaining 3 D6 Qs · RETEST Days 22–23 misses | D6 ≥ 75% |
| **25** | LEARN 7.1–7.2 (~21 min) · REVIEW comparisons 9, 20 · PRACTICE 7 D7 Qs (7.1–7.2) | Skills distribution and verification checklist known |
| **26** | LEARN 7.3 (~9 min) · PRACTICE remaining D7 Qs · ANALYZE | D7 ≥ 70% |
| **27** | **Checkpoint 2:** Smart Mix 20 Qs across D5–D7 · ANALYZE · REVISE | D5–D7 each ≥ 70% |
| **28** | **Full mock 1:** 63 items, 120 min, Exam mode · ANALYZE every miss by objective · Repair-First list | Mock ≥ 75%; no domain under 70% |
| **29** | Repair-First top 5: LEARN part → *Common traps* → 3 fresh Qs each · **Full mock 2** if time allows (some items repeat) | Every Repair-First objective at AMBER or better |
| **30** | `rapid-revision.md` cover to cover · last-24-hours checklist · RETEST "Incorrect previously" · rest | Rapid-revision rules recalled without notes |

---

## Repair-First ranking (used after every checkpoint)
Rank weak objectives by **severity × weight × prerequisite importance** `[INFERENCE]`:
- **Severity:** RED (< 70%) = 3, AMBER (70–74%) = 2, NOT STARTED = 2.
- **Weight:** the domain weight / 10 (e.g. D3 = 1.9).
- **Prerequisite multiplier:** 1.3 for foundational objectives that other objectives build on (1.1, 1.3, 1.5, 2.1, 2.4, 3.6, 4.2, 5.1), otherwise 1.0.

Work the list top-down: LEARN part → *Common traps* → 3 fresh questions → RETEST the next day.
