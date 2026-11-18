---
domain_id: D4
domain_name: Evaluation, Testing & Optimization
weight: 16
priority: Critical
modules: [M2, M1, M5]
---

# Domain 4 – Evaluation, Testing & Optimization

**Weight:** 16% `[EXAM GUIDE]` · **About 10 of 63 items** `[INFERENCE]` · **Study priority:** HIGH PRIORITY / Critical
**Mapped modules:** M2 (Evals, POC to Prod, A/B & Obs) · M1 (Model & Context Strategy) · M5 (Operational support)

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 4.1 | Define evaluation metrics (accuracy, latency, cost, safety, security) |
| 4.2 | Design evaluation datasets and test frameworks using mixed methodologies |
| 4.3 | Conduct A/B testing and iterative improvements |
| 4.4 | Diagnose system issues (prompt failure, hallucinations, model mismatch) |
| 4.5 | Optimize token usage, latency, and cost-performance trade-offs |
| 4.6 | Monitor system performance using logging and observability tools |

---

### Objective 4.1 – Define evaluation metrics (accuracy, latency, cost, safety, security)

#### What you need to know
To turn a requirement into a metric `[MODULE 2 – Defining success criteria]`:
1. State the specific behaviour ("extract filer name, claim number, incident date, amount").
2. Set thresholds that come **from the business requirement**, not from whatever the prototype happens to achieve.
3. List the failure modes; each becomes a category in the dataset.
4. Include adversarial inputs.

The five dimensions, with example metric and grading method `[MODULE 2 – Exercise: define the evaluation framework]`:
| Dimension | Example metric | Grading |
|---|---|---|
| Accuracy | Field-level exact or schema match | Code-based |
| Latency | p95 below target | Code-based |
| Cost | Cost per item below ceiling | Code-based |
| Safety | No auto-deny (binary) + summary faithfulness | Code (binary) + LLM judge (faithfulness) |
| Security | No cross-record data leakage (scan for foreign identifiers) | Code-based |

Hallucination rate = share of responses stating information not supported by the input, source data or allowed logic. `[MODULE 2 – Glossary]`

#### Why it matters
If you can't write an eval for a behaviour, you can't verify it exists, so none of your changes can be verified either. `[MODULE 2]`

#### Architecture concepts
Eval suite written **before** production code and used as the acceptance criteria; per-category breakdown; thresholds fixed in advance. `[MODULE 2]`

#### How it works
1. Pull each requirement from discovery (6.1).
2. Translate it into a measurable behaviour.
3. Choose a metric per dimension.
4. Set thresholds from business needs.
5. Choose the cheapest reliable grading method (4.2).
6. Record failure-mode categories.

#### Architecture example
REAL-WORLD EXAMPLE – An insurer's claims system: 100% on structured fields, under 2% hallucination, 99.5% schema compliance, p95 within a few seconds, cost per claim under the ceiling, zero auto-denials, zero leakage between claimants. `[MODULE 2]`

#### Decision framework
| Use code-based metrics when… | Use judge-based metrics when… |
|---|---|
| There's a single right answer (format, value, number) | Interpretation is needed (tone, faithfulness, reasoning) |
| Avoid judges for things code can check | Avoid code for interpretive qualities |

#### Exam decision signals
- "Threshold = what the POC achieved" → **trap**; thresholds come from the business.
- "Never leak another user's data" → **security metric, code-based scan**.
- "Never auto-deny" → **binary safety check**.

#### Common traps
- COMMON TRAP: measuring only accuracy.
- COMMON TRAP: one overall score hiding per-category regressions.
- COMMON TRAP: leaving adversarial inputs out.

#### Must remember
- Five dimensions: accuracy, latency, cost, safety, security.
- Thresholds come from the business.
- Each failure mode is a dataset category.
- Grade with code wherever possible.

#### Quick recall
**"Behaviour → Threshold → Failure modes → Adversarial."**

**Sources:** M2 Evals – success criteria; M2 Exercise: evaluation framework; M2 Glossary.

---

### Objective 4.2 – Design evaluation datasets and test frameworks using mixed methodologies

#### What you need to know
**Five-stage eval workflow** `[MODULE 2]`:
1. Define the task (spec + prompt + pass criteria).
2. Build the **golden dataset** (representative, with edge cases and counterexamples).
3. Run automated checks.
4. Score with a judge.
5. Interpret by category.

**Grading ladder: start with the cheapest reliable method and move up only when needed** `[MODULE 2]`:
- **Code-based:** deterministic; milliseconds; never drifts.
- **LLM-as-judge:** detailed rubrics, a constrained set of verdict labels, reasoning alongside the score, **calibrated against human labels**, and a *different* model from the one being graded (avoids self-preference).
- **Human review:** high-stakes or novel behaviours; also used to calibrate judges; sample it.

**Favour volume over perfection:** many automatically graded cases beat a few hand-graded ones. `[MODULE 2]`
**Multi-turn evals** score whole conversations (context retention, no invented details, quality over length) and need their own transcript dataset. `[MODULE 2]`
**Keep the dataset current** with every prompt or model change. `[MODULE 2]`

#### Why it matters
The riskiest moment for a regression is when evals exist but are out of date: they give false confidence. One contract-review dataset was built from 10 convenient contracts and missed non-standard obligation structures. `[MODULE 2]`

#### Architecture concepts
A parallel eval system to maintain (dataset, judge prompts, thresholds); stratified sampling sized so each category's score is meaningful `[MODULE 1 – Sonnet→Haiku case]`; regression suites run on every change `[MODULE 5]`.

#### How it works
1. Sample from production-like distributions, stratified by type.
2. Add edge cases and adversarial inputs.
3. Label expected outputs.
4. Write code checks for unambiguous behaviours.
5. Write a judge rubric with constrained verdicts and required reasoning.
6. Calibrate the judge on human labels.
7. Run on every change; review by category.
8. Refresh the dataset whenever behaviour changes.

#### Architecture example
REAL-WORLD EXAMPLE – A Sonnet → Haiku migration eval: 250 hand-validated documents, stratified by document type. Average 0.94 vs. 0.86, but two types fell to 0.71 and 0.74, below the pre-set 0.85 floor. Result: a partial migration (those two types stay on Sonnet). `[MODULE 1]`

#### Decision framework
| Method | Use when | Avoid when |
|---|---|---|
| Code | Schema, exact values, length, presence | Interpretation is needed |
| LLM judge | Quality, faithfulness, tone | It hasn't been calibrated |
| Human | Novel or high-stakes; calibration | You need scale (sample instead) |

#### Exam decision signals
- "Judge scores look great but users disagree" → **calibrate the judge**.
- "Prompt changed, eval still passes" → **stale golden set**.
- "Only clean inputs in the dataset" → **unrepresentative**.
- "Chatbot forgets context" → **multi-turn eval**.

#### Common traps
- COMMON TRAP: grading outputs with the same model that produced them.
- COMMON TRAP: manual spot checks instead of an eval.
- COMMON TRAP: a small, perfect dataset over broad coverage.

#### Must remember
- Code → judge → human, in that order.
- Calibrate judges against human labels.
- Representative + current + stratified.
- Multi-turn behaviour needs multi-turn evals.

#### Quick recall
**"Cheap first, calibrate always, refresh on change."**

**Sources:** M2 Evals (workflow, eval types, grading ladder, judge calibration, multi-turn, postmortem); M1 Sonnet→Haiku case; M5 verification checklist.

---

### Objective 4.3 – Conduct A/B testing and iterative improvements

#### What you need to know
**Experiment components** `[MODULE 2]`:
- **Hypothesis:** specific and falsifiable. It names the treatment, the metric, a threshold and constraints (e.g. "+5% task success without p95 degradation").
- **Assignment:** random, and consistent per user or session.
- **Primary metric:** chosen **before** the test.
- **Sample size:** from the minimum detectable effect, the baseline value and the confidence level. LLM output variance is higher, so you need more samples.

**Reading results** `[MODULE 2]`:
- Statistically significant ≠ worth shipping.
- Check secondary metrics (cost, latency).
- Watch for interaction effects with rare input types, and align the test period with the real input distribution.

**Shadow testing** `[MODULE 2]`: run the new version on copied live traffic, serve users the current version, and score the shadow output offline. Use it when one bad output is too risky, traffic is too low, or (in regulated settings) exposing users to an unvalidated change isn't allowed. The cost is losing downstream user signals.

#### Why it matters
"50 sessions per arm, 68% vs. 62%" was declared a win. It later settled at 61%. The sample was underpowered, the input mix differed between groups, and the metric was chosen after the fact. `[MODULE 2]`

#### Architecture concepts
Traffic splitter with sticky assignment; experiment logging; offline scoring for shadow runs; a pre-registration record. `[INFERENCE]`

#### How it works
1. Write the hypothesis and primary metric.
2. Compute the sample size.
3. Choose live A/B or shadow based on risk and traffic.
4. Randomise with sticky assignment.
5. Run to the planned sample size (don't stop when it looks good).
6. Check practical size and secondary metrics.
7. Decide, document, and update evals.

#### Architecture example
REAL-WORLD EXAMPLE – A healthcare documentation assistant tests a new prompt in **shadow mode**: clinicians keep getting current-version outputs; shadow outputs are scored offline against golden answers before any rollout. `[MODULE 2]` `[INFERENCE]`

#### Decision framework
| Use live A/B when… | Use shadow when… |
|---|---|
| Small bounded exposure is acceptable; traffic is high enough | One bad output is too costly; low traffic; regulated |
| Gains real user signals | Gives up downstream signals |

#### Exam decision signals
- "Ran until it looked better" → **underpowered / peeking**.
- "Chose the metric that moved" → **outcome shopping**.
- "Regulated, can't expose users" → **shadow testing**.

#### Common traps
- COMMON TRAP: significance taken as business value.
- COMMON TRAP: ignoring secondary metrics such as a +30% cost increase.
- COMMON TRAP: non-random assignment.

#### Must remember
- Pre-specify the hypothesis, metric and sample size.
- LLM variance means bigger samples.
- Shadow testing for high risk or low traffic.
- Significant ≠ worth it.

#### Quick recall
**"Hypothesis · Metric · N — written down before day one."**

**Sources:** M2 A/B testing, shadow testing, "50-session winner".

---

### Objective 4.4 – Diagnose system issues (prompt failure, hallucinations, model mismatch)

#### What you need to know
**Failure taxonomy** `[MODULE 2]`:
| Class | Signature | Fix |
|---|---|---|
| **Prompt failure** | Ambiguous or underspecified instruction; the model fills the gap differently each time | Fix the prompt (scope, format, constraints) `[MODULE 1]` |
| **Hallucination** | Confident, fluent content not grounded in the input or source | Ground it: retrieval, tools, verification. *Stronger wording won't fix it* |
| **Model mismatch** | Wrong tier for the task, or swapped without re-evaluation | Model selection gated by an eval |
| **Orchestrator-workers failure** | Recoverable subagent vs. unrecoverable orchestrator | A trace spanning both |

**Symptom → likely cause → first action** `[MODULE 5]`:
| Symptom | Likely cause | First action |
|---|---|---|
| Gradual quality decline, no code change | Model or prompt change, or retrieval drift | Compare against the eval set; check what changed |
| Latency spike | Larger context, slow tool, cache stopped hitting | Find the slowest span; token counts; cache behaviour |
| Intermittent tool failures | Auth, rate limits, unhandled error path | Trace one failed call end to end |
| Cost up, usage flat | Tier crept up or caching regressed | Per-request tier and cache hit rate |

RAG answers suddenly wrong after a document refresh, with latency and model unchanged → look at **retrieval / indexing** first. `[EXAM GUIDE – Sample 3]`
**Attribute before fixing:** model drift, data drift or model-update effect. `[MODULE 2]`

#### Why it matters
Each class has a different fix. Misclassifying the failure produces the wrong fix (e.g. rewording a prompt to cure a grounding problem). `[MODULE 2]`

#### Architecture concepts
Request traces, pinned versions, per-category eval results and the change log together make attribution possible. Discernment means classifying outputs as acceptable, needs revision or needs override. `[MODULE 2]`

#### How it works
1. Describe the symptom precisely: what changed, when, for which inputs.
2. Check what changed (model version, prompt, corpus, traffic mix).
3. Reproduce against the eval set.
4. Classify the failure.
5. Apply the class-specific fix.
6. Add a regression case and a runbook entry. `[MODULE 5]`

#### Architecture example
REAL-WORLD EXAMPLE – A summariser began cutting multi-clause legal sentences after a prompt revision. The eval kept passing because its dataset predated the change. Diagnosis: a prompt-change regression hidden by a stale eval. Fix: update the golden set, then fix the prompt. `[MODULE 2]`

#### Decision framework
| If… | Then suspect… |
|---|---|
| Wrong but well-formed answers with citations to irrelevant chunks | Retrieval |
| Varies run to run on the same input | Underspecified prompt |
| Invented IDs or numbers | Hallucination; needs grounding or verification |
| Fine on Sonnet, poor after a cheaper-tier swap | Model mismatch |

#### Exam decision signals
- "After a document refresh" → retrieval / index.
- "Model version rolled forward" → model update; pin and re-evaluate.
- "Confident but unsupported" → grounding.
- "Different output each run" → specification gap.

#### Common traps
- COMMON TRAP: "the model weights silently changed" (EG Sample 3 distractor).
- COMMON TRAP: fixing hallucination with "be accurate" instructions.
- COMMON TRAP: lowering temperature as a universal fix.

#### Must remember
- Classify, then fix.
- Grounding fixes hallucination; prompts fix ambiguity; evals gate model choice.
- Check what changed first.
- Turn every incident into a regression test and a runbook entry.

#### Quick recall
**"What changed? → Which class? → Matching fix → Add a test."**

**Sources:** M2 Failure taxonomy, Observability change attribution; M5 Symptom→cause table; M1 Prompting – underspecification; EG Sample 3.

---

### Objective 4.5 – Optimize token usage, latency, and cost-performance trade-offs

#### What you need to know
**Levers:**
- **Per-step model tiering**, validated by evals. One case cut cost 71% with no CSAT change. `[MODULE 1]`
- **Prompt caching:** static content first, then a breakpoint, then dynamic content.
  - Cache writes cost more than standard input; reads are much cheaper (M2 illustrates 10% — verify current pricing). `[MODULE 2]`
  - Needs explicit `cache_control` markers; the default TTL is 5 minutes, so low-frequency workloads may not benefit. `[MODULE 2]`
  - Not worth it when the prompt is called rarely or the prefix is small. `[MODULE 1]`
- **Context strategy:** progressive instead of monolithic; compaction. `[MODULE 1]`
- **`max_tokens` cap; output length.** `[MODULE 2]`
- **Extended thinking only on a measured gap.** `[MODULE 1]`
- **Batch API** for workloads that can run asynchronously (M2 illustrates 50% off and 100k per batch — verify). Check BAA coverage before sending PHI through it. `[MODULE 2]`
- **Cost model:** volume × (input tokens at input rate + output tokens at output rate), with cached tokens at the read rate. Model the **distribution, not the average**; tails can be 2–3× the average-based estimate. `[MODULE 2]`

#### Why it matters
"The long documents in the tail were consuming 80% of the total token spend." Cost visibility that lags the build moves the conversation into change management. `[MODULE 2]` `[MODULE 1]`

#### Architecture concepts
Cache prefix design; tier routing classifier; async lanes; sensitivity analysis; budget alerts. `[MODULE 4]`

#### How it works
1. Measure the token distribution per step (usage field).
2. Find the dominant cost driver (tail inputs? tier? missed caching?).
3. Apply the matching lever and re-run the eval.
4. Check that p95 and accuracy are still within budget.
5. Re-run sensitivity analysis (2× volume, tail shift).

#### Architecture example
REAL-WORLD EXAMPLE – An 8,000-token system prompt plus policy was sent on every request, followed by a short, varying user message. Putting the static content first and enabling caching cuts both time-to-first-token and cost. Truncating the policy or blindly downsizing the model would not. `[EXAM GUIDE – Sample 2]`

#### Decision framework
| Driver | Lever | Watch-out |
|---|---|---|
| Large stable prefix, frequent calls | Caching | Write cost; TTL vs. call frequency; consistency if content must be live |
| Overpowered tier | Tier down on an eval | Per-category regressions |
| Accumulating context | Progressive / compaction | Lost detail |
| Non-urgent bulk work | Batch API | SLA; compliance coverage |
| Long outputs | `max_tokens`, output contract | Truncation |

#### Exam decision signals
- "Same long prompt every request" → **caching, static first**.
- "Cache never hits" → **dynamic content placed before the breakpoint**. `[MODULE 1]`
- "Overnight reports" → **Batch**.
- "Cost model off by 2–3×" → **averages instead of distribution**.

#### Common traps
- COMMON TRAP: putting dynamic content ahead of the cached prefix.
- COMMON TRAP: caching everything by default.
- COMMON TRAP: "use the smallest model regardless of fit" (EG Sample 2 distractor).

#### Must remember
- Static first, dynamic last.
- Model the distribution.
- Each tier change needs an eval.
- Batch when the SLA allows; check compliance coverage.

#### Quick recall
**"Cache the constant · Tier the step · Trim the context · Batch the patient."**

**Sources:** M1 Caching mechanics, Opus 7× case; M2 POC to Prod, Sizing; EG Sample 2.

---

### Objective 4.6 – Monitor system performance using logging and observability tools

#### What you need to know
Monitoring covers *performance over time*. 3.4 covers *what to instrument at scale*; this objective covers *using it*.
- Per-request trace fields: model, version, input/output tokens, latency, stop reason, tool calls. `[MODULE 2]`
- Dashboard metrics: cost per request, p50/p95, task success (downstream acceptance), error rate by type. `[MODULE 2]`
- Alerts: e.g. cost above 150% of the 7-day average; p95 above SLA. Drift needs **periodic distribution comparison**. `[MODULE 2]`
- **KPI translation layer:** task success → first-contact resolution; latency → handle time. Build it at design time. `[MODULE 2]`
- A **governance table** maps each signal to a trigger, an owner and an action, including slow drift. `[MODULE 4]`
- Use telemetry and request traces to find the slowest span. `[MODULE 5]`

#### Why it matters
Signals that exist but trigger nothing are invisible. In one case quality drifted for seven weeks before a quarterly review noticed. `[MODULE 4]`

#### Architecture concepts
Log pipeline, metrics store, alerting, eval re-runs on a schedule, a business dashboard, retention and PII policy for logs (5.4).

#### How it works
1. Define SLOs from their sources (UX, criticality, eval acceptance). `[MODULE 4]`
2. Instrument the trace fields.
3. Build technical and business dashboards.
4. Configure threshold and drift alerts.
5. Map alerts to owners and actions.
6. Review and tune.

#### Architecture example
REAL-WORLD EXAMPLE – A support assistant: a weekly eval re-run on sampled production traffic triggers an architect review when the score drops below threshold for two consecutive weeks, even though error rate stays flat. `[MODULE 4]` `[INFERENCE]`

#### Decision framework
| Signal | Monitoring method |
|---|---|
| Errors and timeouts | Threshold alert |
| Cost | Per-request breakdown + budget alert |
| Quality drift | Scheduled eval / distribution comparison |
| Business value | KPI translation dashboard |

#### Exam decision signals
- "Dashboards green, users unhappy" → **quality signal missing**.
- "Sponsor can't see impact" → **KPI translation**.
- "Alert fired, no one acted" → **owner and trigger missing**.

#### Common traps
- COMMON TRAP: monitoring only infrastructure metrics.
- COMMON TRAP: threshold alerts for gradual drift.
- COMMON TRAP: dashboards with no owners.

#### Must remember
- Instrument quality, not just uptime.
- Drift needs periodic comparison.
- Every signal has an owner and an action.
- Translate to business KPIs.

#### Quick recall
**"Measure · Alert · Own · Act · Translate."**

**Sources:** M2 Observability at scale, connecting observability to business value; M4 Feedback loop; M5 Operational support.
