# CCAR-P Final Rapid-Revision Guide

> A condensed form of `docs/guide/`. Each line traces to the guide objective in brackets. Study targets aren't official score conversions. Exam facts: **63 items · 120 min · scaled 720/1000 · 7 domains · multiple-choice and multiple-response (each item says how many to pick)** `[EXAM GUIDE]`.

## 1. Top architecture concepts to remember
1. **Claude / systems / humans** — decompose first, by reversibility, stakes and accountability. [1.1, 1.5]
2. **Augmented LLM → workflow → agent** — use an agent only when the path can't be listed in advance. [1.3]
3. **Retrieval is for knowledge; tools are for live state.** Similarity ≠ truth. [3.6]
4. **Least privilege** — remove capabilities a role doesn't need; don't guard them. [3.1]
5. **Identity is injected by the server; authorization is deterministic.** [3.2, 5.1]
6. **Evals before code; every change is gated by an eval with a threshold set in advance.** [4.2, 2.1]
7. **Sonnet by default; tier each step on evidence; pin versions.** [2.1]
8. **Static content first, then caching; model the token distribution, not the average.** [2.5, 4.5]
9. **Three control points (input / output / action), each failing closed.** [5.1]
10. **Obligation → control → owner → evidence, revalidated on a schedule.** [5.4]
11. **Gain · Give up · Reversal cost (· Compliance).** [6.2]
12. **Monitoring isn't a feedback loop: every signal needs a trigger, an owner and an action.** [6.3]

## 2. High-frequency decision frameworks
| Framework | The rule | Obj |
|---|---|---|
| Pattern choice | Predictability → error cost → observability → latency → cost; the tightest constraint decides | 1.3 |
| Feasibility | As scoped / with constraints / not feasible, plus the boundary conditions | 1.1 |
| Improvement order | Prompt → tools/retrieval → stronger pattern → (rarely) fine-tune | 1.3 |
| Multi-agent | Use only when work exceeds one context or parallelises; coverage check; protect the orchestrator | 1.4 |
| Chunking / index | Chunk by source structure; index by query pattern; hybrid + RRF for mixed queries | 3.5 |
| Integration | One call → API/SDK; many clients → MCP; many turns in my app → Agent SDK; developers → Claude Code | 3.7 |
| Context | Start (cached prefix) · Recent (progressive) · On demand (retrieval / tool search) · Compress (compaction) | 3.8 |
| Grading | Code → calibrated judge (different model) → human | 4.2 |
| Experiment | Hypothesis + primary metric + sample size up front; shadow testing when users can't be exposed | 4.3 |
| Diagnosis | What changed → classify (prompt / hallucination / mismatch / orchestrator) → matching fix | 4.4 |
| HITL | Cost and reversibility set the stakes; calibrated confidence sets the volume; pre-action for irreversible | 5.3 |
| Discovery | Must do · Must not · Must cost · Must prove | 6.1 |
| SLA | What's measured · what counts as a breach · the consequence; thresholds traced to sources | 6.3 |
| Team setup | Shared baseline · champions → batches · plugin-governed Skills · spend caps | 7.1 |

## 3. Easily confused concepts
| A | B | The distinguishing test |
|---|---|---|
| Workflow | Agent | Who holds the control flow: your code or the model? |
| Parallelization | Orchestrator-workers | Are the subtasks fixed in advance, or decided at runtime? |
| MCP | API tool use | Sharing across clients vs. calling within one request (different layers) |
| Anthropic SDK | Agent SDK | Wrapper with no loop vs. managed agent loop |
| RAG | Tool call | Is the value stable reference text, or live state owned by a system? |
| 400 prompt too long | `model_context_window_exceeded` | Rejected before generation vs. stopped during generation (413 = byte limit) |
| Model drift | Data drift | Outputs on stable inputs changed vs. the inputs changed (a version update is a third cause) |
| Prompt failure | Hallucination | Ambiguous instruction vs. ungrounded content (fix with the prompt vs. with grounding) |
| Tool search / defer_loading | Least privilege | Reduces context vs. reduces permissions |
| Training-time alignment | Inference-time control | Broad harm reduced by training vs. your domain rules, which you enforce |
| Training use | Retention | Excluded from training doesn't mean not retained |
| Org-provisioned Skill | Plugin | Org-wide with no native rollback vs. group-targeted with versioned updates |
| CLAUDE.md | Hook | Shapes behaviour vs. a deterministic gate that guarantees it |
| Efficiency | Transformation | Same work cheaper vs. work that wasn't possible before |
| Statistical significance | Worth shipping | Unlikely to be chance vs. big enough, with no secondary-metric harm |

## 4. Critical terminology (one line each)
- **Augmented LLM:** one bounded call plus tools, retrieval or memory.
- **Coverage check:** results returned = units dispatched.
- **Live state:** a value owned by a system of record that changes on its own.
- **p95:** the latency 95% of requests complete within; the SLA design target.
- **Golden dataset:** a representative labelled set, kept current.
- **Judge calibration:** comparing judge verdicts against human labels before trusting them.
- **Shadow testing:** the new version runs on copied traffic; users see the current version.
- **Fail closed:** a guardrail that blocks when it errors.
- **Indirect injection:** instructions arriving via retrieved or tool content.
- **BAA:** covers a specific configuration and feature, not the whole provider.
- **Control register / evidence artifact:** obligation → control → owner → live proof.
- **Translation table:** said → implied constraint → decision → assumption.
- **Reversal cost:** what it costs to undo a choice once the system depends on it.
- **Governance table:** signal → trigger → owner → action (plus scheduled checkpoints).
- **Safe-change test:** can an outsider safely change the system using only the documentation?
- **Spend posture:** model defaults, allowlists, effort guidance, caps.

## 5. Architecture anti-patterns
| Anti-pattern | Why it fails | Fix | Obj |
|---|---|---|---|
| Agent chosen "for flexibility" | Non-determinism, no auditable step | Router + chains | 1.3 |
| Synthesis without a coverage check | Confident summary over missing units | Reconcile dispatched vs. returned | 1.4 |
| Assuming Claude does everything | Expensive, slow, unauditable | Decompose to systems and humans | 1.5 |
| Opus everywhere | 7× cost, latency misses | Per-step tiering by eval | 2.1 |
| Dynamic content before the cache prefix | The cache never hits | Static first | 2.5 |
| RAG for order status | Stale but confident answers | Tool call to the system of record | 3.6 |
| Claude Code for operations staff | Wrong entry point | Custom app on the API | 3.7 |
| MCP by habit | Overhead with no reuse | Direct tool use | 3.7 |
| Role stated in the user message | Spoofing | Server-side injection | 3.2 |
| Shared API key across tenants | No attribution or isolation | Per-tenant keys | 3.2 |
| Error-rate-only monitoring | Misses silent wrong answers | Outcome signals + drift comparison | 3.4 |
| Out-of-date eval set | False confidence | Refresh with every change | 4.2 |
| 50-session A/B, metric chosen afterwards | Noise looks like a win | Pre-register, power the test | 4.3 |
| Output filter as the only guardrail | The action already ran | Tool authorization before side effects | 5.1 |
| Guardrail that fails open | Looks protected, isn't | Fail closed | 5.1 |
| Route everything to review | Consent fatigue | Route by stakes, with context | 5.3 |
| PII in the prompt "for convenience" | Ends up in logs | Minimise and redact server-side | 5.4 |
| "Compliant route = done" | No owner, no evidence; drift | Control register | 5.4 |
| Sketching during discovery | Hidden constraints surface late | Finish the four buckets first | 6.1 |
| Per-call cost without the total | An approval that isn't informed | Volume total + reversal cost | 6.2 |
| Diagram-only handoff | Load-bearing decisions get reversed | Rationale + rejected alternatives | 6.4 |
| Shipping a Skill with no rollback | One bad edit hits everyone | Plugin with versioned updates | 7.1 |

## 6. "If you see X, consider Y"
| If the scenario says… | Consider… |
|---|---|
| "Only needs to read and draft, but can also refund/delete" | Remove those tools |
| "User states their role in the message" | Server-side identity injection |
| "Answer contradicts the database" / "changes after each refresh" | Tool call, not RAG |
| "Wrong after a document refresh, model and latency unchanged" | Re-index / embedding mismatch |
| "Misses part numbers / error codes" | Hybrid retrieval with sparse + RRF |
| "Clause loses its section context" | Hierarchical chunking |
| "Same tools from several Claude clients" | MCP |
| "Agent inside our web app, multi-turn" | Agent SDK |
| "Hundreds of tools, context full" | Tool search + defer_loading (keep the hot tools loaded) |
| "Cost grows each turn" | Progressive context + compaction |
| "Same long prompt every call" | Cached static prefix |
| "Cache never hits" | Dynamic content placed before the breakpoint |
| "Overnight bulk job" | Batch API (check compliance coverage) |
| "Median fine, users complain" | p95 |
| "Dashboards green, quality falling" | Outcome signals, drift comparison, a governance trigger |
| "Judge says great, experts disagree" | Calibrate; use a different grader model |
| "Prompt changed, eval still passes" | Stale golden set |
| "Can't expose users / regulated" | Shadow testing |
| "Invented citations" | Ground and verify |
| "Format varies run to run" | Underspecified prompt |
| "Quality drop after a cheaper-tier swap" | Model mismatch → per-category evals and routing |
| "Instructions hidden in a retrieved document or web page" | Screen retrieved and tool content |
| "Classifier errored, traffic passed" | Fail closed |
| "Reviewers approve everything" | Route by stakes; show inputs and the flag reason |
| "Beta feature + PHI" | Check BAA eligibility |
| "EU residency required" | Region-pinned CSP route (verify) |
| "Auditor wants proof" | Evidence artifact, not a design document |
| "Fairness evals passed, outcomes unequal" | Corpus, framing, examples, routing |
| "'Seamless' / 'quick check'" | Translate into constraints; possible mandatory HITL |
| "CFO surprised by the bill" | Reversal cost and the total at volume |
| "Successor broke a constraint" | Missing rationale and rejected alternatives |
| "Demo worked, launching next week" | POC-to-production gap: cost, p95, reliability, failure modes |
| "Peak 529 took everything down" | Backoff near the call, breaker at the boundary, fallback in orchestration |
| "Must always run X before commit" | Hook |
| "Bad Skill edit spread to the whole team" | Plugin with versioning and rollback |
| "Cost up, usage flat" | Tier creep or cache regression |

## 7. One-page cheat sheet
```
DOMAINS  D1 17 | D2 13 | D3 19 | D4 16 | D5 14 | D6 14 | D7 7   (63 items · 120 min · 720/1000)
DESIGN   Decompose (C/S/H by R-S-A) → Pattern (simplest that fits) → Ref arch → Model/context → Entry point
PATTERNS chain · route · parallel(section|vote) · orchestrator-workers · evaluator-optimizer · agent(bounded)
MULTI    orchestrator delegates+synthesises · subagent fail = recoverable · orchestrator fail = checkpoint · coverage check
MODELS   Sonnet default · eval-gated swaps · threshold set first · per-step tiers · thinking only on a measured gap · pin
PROMPT   role · scope · constraints · output contract · zero→few→CoT · balanced examples · prompt ≠ enforcement
CONTEXT  budget < ceiling · 400 tokens/413 bytes/ctx-stop · start·recent·on-demand·compress · tool search
REUSE    static first → cache · TTL & write cost · library (flexible) vs Skill (governed, Code Execution Tool)
INTEG    least privilege · server identity · deterministic authZ · per-tenant keys · MCP=OAuth2.1 resource server
RAG      chunk by structure · index by query · hybrid+RRF · measure retrieval · live state → tool call
OBS      log request/response/context/outcome · per-request decomposition · drift · attribution · trace ID
EVAL     thresholds from business · code→judge→human · calibrate · volume > perfection · multi-turn · keep current
TEST     hypothesis·metric·N first · random sticky · significant ≠ worth it · shadow when exposure isn't OK
SAFETY   your rules = your layers · input/output/action gates · fail closed · indirect injection · Skill audit+sandbox
HITL     cost×reversibility = stakes · calibrated confidence = volume · pre-action for irreversible · avoid fatigue
COMPLY   constraints eliminate first · BAA per config · region pin · minimise PII · control→owner→evidence · revalidate
FAIR     corpus · framing · examples · routing · segment metrics · decision logs (governed)
STAKE    listen→translate→write · Do/Don't/Cost/Prove · Gain/GiveUp/Reversal(/Compliance)
LOOP     Signals→Triage→Decide→Act→Review · SLA measure/breach/consequence · scheduled checkpoints
DOCS     why + why not · 3 readers · safe-change test · outcome doc before/after/control/owner
LIFE     discover→design→handoff→monitor→iterate · POC proves capability only · retry@call breaker@boundary fallback@orch
TEAM     shared baseline · champions→batches · plugin Skills · spend caps · hooks guarantee · verification checklist · runbooks
```

## 8. Last-24-hours checklist
- [ ] Re-read §6 "If you see X" twice; cover the right column and recall it.
- [ ] Re-read Common traps for every RED or AMBER objective on your Progress page.
- [ ] Do one 21-question Smart Mix in Exam mode; analyse each miss. Don't start new material.
- [ ] Memorise the domain weights and the exam format (63 / 120 / 720 / 7 / multiple-response).
- [ ] Skim the comparison guides (`docs/guide/comparisons.md`).
- [ ] Check logistics: ID matching your registration exactly, Pearson VUE appointment, online-proctoring room rules (clear desk, no second monitor). `[EXAM GUIDE §11–12]`
- [ ] Sleep. A fresh mind is worth more than one more practice set.

## 9. Exam-time strategy
- **Pace:** about 1.9 minutes per item. Do a first pass at about 1.5 minutes each and flag the hard ones; that leaves around 25 minutes for flagged items. `[INFERENCE]`
- **Read the last line first** to see what's being asked and **how many answers to select** (multiple-response items say so). `[EXAM GUIDE §5]`
- **Find the binding constraint** in the scenario (regulated? irreversible? live data? auditor? latency budget?). It usually decides the answer.
- **Prefer prevention over detection:** removing or gating beats logging or confirming (removal > authorization > screening > logging). `[EXAM GUIDE Sample 1]`
- **Prefer the simplest architecture that meets the constraints.** Be suspicious of "use a bigger model" and "fine-tune it" as first moves.
- **Watch for absolutes and blind defaults:** "regardless of fit", "always", "everything to review".
- **Eliminate the distractors that fix a different problem** (e.g. temperature for a retrieval fault).
- **Domain percentages on the score report don't decide pass or fail**; only the total scaled score does. Don't panic over one weak area. `[EXAM GUIDE §9]`
