---
domain_id: D5
domain_name: Governance, Safety & Risk Management
weight: 14
priority: High
modules: [M3, M1, M2]
---

# Domain 5 – Governance, Safety & Risk Management

**Weight:** 14% `[EXAM GUIDE]` · **About 9 of 63 items** `[INFERENCE]` · **Study priority:** High
**Mapped modules:** M3 (all sections) · M1 (Entry Points & Governance) · M2 (Constraint-to-integration matrix)

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 5.1 | Implement guardrails and safety controls |
| 5.2 | Identify risks, limitations, and failure modes of LLM systems |
| 5.3 | Apply human-in-the-loop validation strategies |
| 5.4 | Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP) |
| 5.5 | Address ethical AI considerations (bias, fairness, transparency) |

---

### Objective 5.1 – Implement guardrails and safety controls

#### What you need to know
**Training-time alignment vs. inference-time control** `[MODULE 3 – Alignment]`:
- Claude is trained against a constitution (priority: broadly safe → ethical → compliant with guidelines → genuinely helpful, weighed holistically). This reduces **broad** harm.
- Training does not know your domain policy, data rules or authorization model. **Claude can't enforce a rule it was never given.**

**Four layers**, each with an owner `[MODULE 3]`:
| Layer | Covers | Doesn't cover | Owner |
|---|---|---|---|
| Trained behaviour | Broad harm | Your domain policy, data rules, authorization model | Anthropic |
| System prompt | Role, tone, constraints | Adversarial inputs that talk it out of them | Architect |
| Runtime screening | Disallowed content | Side-effecting actions, novel attacks | Architect |
| Authorization | Permitted actions | Content quality, fairness | Architect |

**Three control points** `[MODULE 3]`:
- **Input screening:** model-based for fuzzy intent or jailbreaks; deterministic for clear rules.
- **Output screening:** judge model or validator.
- **Tool-call authorization:** **deterministic** allowlist plus identity and scope.

Chain model-based and deterministic checks: models can be evaded, rules are brittle. `[MODULE 3]`

**Indirect injection:** also screen retrieved content and tool outputs *before* they're added to context. `[MODULE 3]`

**Fail closed:** operator-built guardrails must block when they error. Failing open gives the appearance of protection without the function. (This applies to operator-built components, not Anthropic's API-level controls.) `[MODULE 3]`

**Refusals:**
- The API returns a successful HTTP 200 with `stop_reason: "refusal"`. `stop_details` is always present on a refusal, but its `category` and `explanation` can be null. **Branch on `stop_reason` (or `stop_details.type`), never on a populated category**, and supply your own user-facing message when they are null. `[OFFICIAL ANTHROPIC DOCS – verified 2026-11-19]` (V5)
- Current docs also describe retrying a refused request on a fallback model (`fallbacks`, beta). Treat this as an architecture option, not exam scope.
- Reset or rephrase the refused turn before continuing. `[MODULE 3]` Of the module's category list, only `cyber` is confirmed in current docs; treat the rest as **Source gap – verification required**.

**Skill supply chain** `[MODULE 3]`:
- Audit bundles for anomalous calls (network, shell, filesystem, credentials) and out-of-scope behaviour.
- Run with least privilege in a sandbox.
- Trusted-source policy.
- Record a verdict: approve / reject / remediate.

**Structural guardrails:** put constraints in the **output contract**, not only in the role text. `[MODULE 1 – reusable prompt asset]`

#### Why it matters
In one case an output filter passed text describing a refund that had already been issued. One filter at the end doesn't guard a path. `[MODULE 3]`

#### Architecture concepts
Guarded request path: request → input screening → model → output screening → tool authorization → response, with every blocked or failed gate logged. `[MODULE 3]` Claude Code governing layers: hooks (deterministic gates), permission modes, sandboxing. `[MODULE 1]`

#### How it works
1. Write the domain policy out explicitly (don't assume alignment covers it).
2. Place input screening, including retrieved and tool content.
3. Place output screening (schema plus judge where needed).
4. Put deterministic authorization in front of every side-effecting tool.
5. Set each control's failure direction to closed.
6. Log every block and failure.
7. Audit and sandbox third-party Skills.

#### Architecture example
REAL-WORLD EXAMPLE – An internal assistant must not show records from other business units. Training doesn't cover this. Fix: an authorization check on the retrieval tool keyed to the user's unit (server-side identity), plus an output validator that blocks foreign unit IDs, both failing closed. `[MODULE 3 – postmortem]`

#### Decision framework
| Check type | Use when | Avoid when |
|---|---|---|
| Model-based | Ambiguous intent, toxicity, policy nuance | Authorization decisions |
| Deterministic | Clear patterns, schemas, allowlists, authorization | Fuzzy semantics |
| Fail closed | A wrong pass causes harm | (Rarely) low-harm UX-only checks where availability matters more `[INFERENCE]` |

#### Exam decision signals
- "Filter on the output only" → **add input screening + tool authorization**.
- "Classifier timed out and traffic passed" → **fail open → make it fail closed**.
- "Malicious instruction in a retrieved doc" → **screen retrieved content**.
- "Third-party Skill" → **audit + sandbox + trusted source**.

#### Common traps
- COMMON TRAP: "Claude refuses harmful prompts, so our policy is covered."
- COMMON TRAP: treating the system prompt as enforcement.
- COMMON TRAP: model-based authorization.

#### Must remember
- Domain rules are yours to enforce.
- Three control points; one filter isn't enough.
- Authorization is deterministic.
- Fail closed.
- Screen indirect inputs too.

#### Quick recall
**"In · Out · Act — each gated, each fails closed, each logged."**

**Sources:** M3 Alignment, Guardrails (placement, fail open/closed, indirect injection, refusals, Skill supply chain); M1 Claude Code governing layers, reusable prompt asset.

---

### Objective 5.2 – Identify risks, limitations, and failure modes of LLM systems

#### What you need to know
**Recurring risk categories** `[MODULE 3]`:
- **Direct prompt injection:** the user overrides instructions.
- **Indirect prompt injection:** instructions arrive in retrieved content or tool outputs.
- **Token-budget exhaustion:** oversized or padded inputs truncate work or inflate cost.
- **Tool / action abuse:** the model is induced to call a side-effecting tool outside policy.
- **Data exposure:** sensitive fields in the context window or logs.

**Model-level limitations** come from the four properties: confident-but-wrong output, stale knowledge, the context-window cliff, steerability drift. `[MODULE 1]`

**Non-determinism:** a demo isn't evidence of determinism. `[MODULE 1 – reconciliation case]`

**Failure modes by architecture** `[MODULE 2]`:
- **Agent:** unbounded tool use and context growth.
- **RAG:** retrieval drift.
- **Document pipeline:** no exception path.
- **Orchestrator-workers:** blurred boundaries, fragmented traces, silently dropped units.

**Vulnerability assessment:** walk the request and data paths (user input, retrieved content, tool outputs, model output, logs). At each point, ask what an adversary could do and which control stops it. `[MODULE 3]`

**Risk assessment deliverable:** for each risk, record category, component, likelihood × impact, mitigation control, owner, evidence. `[MODULE 3]`

#### Why it matters
LLM failures don't announce themselves; they drift quietly. The security reviewer signs off on the written risk assessment. `[MODULE 1]` `[MODULE 3]`

#### Architecture concepts
Threat model by entry point; mapping risk → control → owner → evidence (feeds 5.4); token budgets and stopping criteria for agents.

#### How it works
1. Draw the request and data paths.
2. List entry points.
3. Map the risk categories to each entry point.
4. Find points with no control.
5. Rate likelihood and impact.
6. Assign a control, owner and evidence.
7. Re-assess when the architecture changes.

#### Architecture example
REAL-WORLD EXAMPLE – A RAG + tools agent:
- **Indirect injection** via an uploaded PDF → screen retrieved chunks.
- **Token exhaustion** via giant uploads → size limits and budget caps.
- **Tool abuse** (`send_email`) → allowlist plus a recipient-domain rule.
- **PII in logs** → redaction before logging. `[MODULE 3]` `[INFERENCE]`

#### Decision framework
| Risk | Primary control |
|---|---|
| Direct injection | Input screening + instruction hierarchy (system vs. user) |
| Indirect injection | Screening of retrieved and tool content |
| Token exhaustion | Input size limits, `max_tokens`, per-turn budgets |
| Tool abuse | Deterministic authorization, least privilege |
| Data exposure | Minimisation, redaction, log governance |

#### Exam decision signals
- "Instructions hidden in a web page the agent read" → **indirect injection**.
- "Huge pasted input, truncated answer, cost spike" → **token-budget exhaustion**.
- "Same input, different result in production" → **non-determinism**; evals and checks.

#### Common traps
- COMMON TRAP: input screening only on user text.
- COMMON TRAP: assuming a clean demo means deterministic behaviour.
- COMMON TRAP: a verbal risk discussion with no written assessment.

#### Must remember
- Five recurring risk categories.
- Every entry point needs a control.
- Failure modes depend on the architecture.
- The risk assessment is a written deliverable.

#### Quick recall
**"D-I-T-T-D: Direct, Indirect, Token, Tool, Data."**

**Sources:** M3 Risks, limitations, and failure modes; M1 four properties, reconciliation case; M2 Failure modes by architecture.

---

### Objective 5.3 – Apply human-in-the-loop validation strategies

#### What you need to know
**What sets the stakes** `[MODULE 3 – Review routing]`:
- **Reversibility** and **cost of a wrong decision** set the stakes.
- **Confidence** (only meaningful if calibrated) estimates how likely an output is wrong, which tells you how much high-stakes volume can pass unreviewed.

**Rule:** route to a human when confidence is low *and* the decision is irreversible or high-cost. Let confident, reversible, low-cost decisions through. When the variables disagree, give more weight to cost and reversibility. `[MODULE 3]`

**Placement** `[MODULE 3]`:
| Placement | Gives | Costs |
|---|---|---|
| Pre-action approval | Nothing irreversible happens unreviewed | Latency; reviewer availability |
| Post-action audit | Throughput | The wrong action has already happened; reversible decisions only |
| Sampled review | Quality monitoring | Individual bad decisions can slip through |

**What the reviewer sees:** the inputs, the model output, and **why it was flagged**. `[MODULE 3]`

**Consent fatigue:** approving every step leads to click-through approvals. Move review to higher-value checkpoints such as plan review or exception handling, as Claude Code does with plan-level approval. `[MODULE 3]` (Verify Anthropic's current framing.)

**Diligence** competency: explicit accountability checkpoints; watch for automation pressure eroding oversight. `[MODULE 3]`

#### Why it matters
"Four hundred items in my queue… I just hit approve." Volume plus missing context turned review into rubber-stamping. `[MODULE 3]`

#### Architecture concepts
Confidence scoring + calibration; routing rules; a reviewer UI fed by decision logs; agent checkpoint gates before irreversible actions. `[MODULE 1]` `[MODULE 3]`

#### How it works
1. List decision types; rate reversibility and cost of error.
2. Calibrate the confidence signal against labelled outcomes.
3. Set the routing rule.
4. Choose a placement per decision type.
5. Design the reviewer view (inputs, output, reason).
6. Monitor queue size and approval rates for signs of fatigue.

#### Architecture example
REAL-WORLD EXAMPLE – A benefits-eligibility assistant: a near-threshold applicant with incomplete documents and a recommended *deny* → pre-action review by a caseworker, who sees the inputs and the flag reason. Clear approvals → sampled review. `[MODULE 3 – cumulative brief]` `[INFERENCE]`

#### Decision framework
| Stakes \ Confidence | High confidence | Low confidence |
|---|---|---|
| Reversible, low cost | Auto + sample | Auto + post-action audit |
| Irreversible / high cost | Sample or pre-action (policy) | **Pre-action approval** |

#### Exam decision signals
- "Reviewers approve everything" → **consent fatigue**; route by stakes; add context.
- "Agent can send payments" → **pre-action gate**.
- "Reviewer sees only output + approve button" → **add inputs and flag reason**.

#### Common traps
- COMMON TRAP: routing everything to review "to be safe".
- COMMON TRAP: trusting uncalibrated confidence.
- COMMON TRAP: post-action audit for irreversible actions.

#### Must remember
- Cost and reversibility set the stakes; confidence sets the volume.
- Pre-action for irreversible decisions.
- Reviewer needs inputs, output and reason.
- Avoid consent fatigue.

#### Quick recall
**"Can't undo + not sure = a human first."**

**Sources:** M3 Review routing, consent fatigue, Diligence; M1 HITL checkpoints; M2 low-confidence routing.

---

### Objective 5.4 – Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)

#### What you need to know
**Step 1 – constraints eliminate options first.** The governing obligation rules entry points and delivery routes in or out before cost or preference. `[MODULE 1]` `[MODULE 2]`
| Constraint | Usually survives review | Notes |
|---|---|---|
| Attorney-client privilege | API/SDK behind the firm's own app, SSO, firm-approved gateway logging every request | Consumer tiers ruled out `[MODULE 1]` |
| HIPAA (PHI) | API/SDK on a **BAA-covered configuration** | BAA coverage is per configuration; beta features generally excluded; minimise PHI before the call `[MODULE 1, 2]` |
| GDPR / residency | CSP route (Bedrock/Vertex) with the region pinned; DPA terms | Direct API `inference_geo` = "us"/"global" only (no EU pin); Claude 4.6+ models; "us" costs 1.1×. On Bedrock and Google-managed Vertex the region comes from the endpoint or inference profile; Foundry uses the US Data Zone Standard deployment for US-only `[MODULE 2]` `[OFFICIAL ANTHROPIC DOCS – verified 2026-11-19]` (V6) |
| FedRAMP | Claude for Government, Bedrock GovCloud, Vertex Assured Workloads | Model availability lags commercial; Claude Enterprise has no USG authorisation; ITAR data only via Bedrock GovCloud (IL4/IL5); Claude for Government and Vertex are not IL5 environments `[OFFICIAL ANTHROPIC DOCS – verified 2026-11-19]` (V8); `[MODULE 1, 2]` |
| Internal residency policy | The CIO-approved CSP route | Procurement, not engineering `[MODULE 1]` |
(Every item above is time-sensitive: verify current authorisations. `[MODULE 1 note]`)

**Step 2 – control register** `[MODULE 3]`: each obligation → **technical control → owner → evidence artifact**, revalidated on a schedule.
- Evidence a reviewer accepts: a signed BAA, a configuration screen, an authorization record, a live log query.
- A design document is not evidence.

**Training use ≠ retention.** Data may be excluded from training yet still retained for logging or abuse prevention. `[MODULE 3]`

**Data handling:** pass only the fields the language task needs; use reference IDs instead of full fields; redact PII before the call. `[MODULE 2]`

**Decision logs are themselves in scope:** minimise them, limit retention, control access. `[MODULE 3]`

#### Why it matters
In one case a logging change silently wrote metadata to a second region. Nobody owned the residency control, so it surfaced at audit. `[MODULE 3]` In another, SSNs in prompts landed in thousands of application log entries. `[MODULE 2]`

#### Architecture concepts
Route selection, region pinning, gateway, redaction service, retention configuration, data-flow records, scheduled residency confirmation (the governance table in 6.3).

#### How it works
1. Identify the governing obligations.
2. Eliminate routes and entry points that can't satisfy them.
3. Design data minimisation and redaction.
4. Map each obligation to a control, owner and evidence.
5. Wire scheduled revalidation checkpoints.
6. Keep evidence current; re-check when configuration changes.

#### Architecture example
REAL-WORLD EXAMPLE – A patient intake summariser: Bedrock in-region under the existing BAA. A server-side redaction step strips SSN and insurance ID (not needed for summarising). Logs capture request, model version, user and data scope. Register: BAA (security lead), residency config + data-flow record (data owner), decision-log sample query (architect). `[MODULE 2]` `[MODULE 3]`

#### Decision framework
| Use direct API when… | Use a CSP route when… |
|---|---|
| No binding cloud commitment; newest features; BAA in place for that configuration | Existing cloud commitment; region pinning; government authorisation |
| **Avoid** where an EU pin is required | **Avoid** assuming feature parity (CSP routes can lag) `[MODULE 1]` |

#### Exam decision signals
- "Healthcare + new beta feature" → **check BAA eligibility**.
- "Must stay in the EU" → **region-pinned CSP route**.
- "Federal agency" → **an authorised government route**.
- "Auditor asks for proof" → **evidence artifact**, not a design document.

#### Common traps
- COMMON TRAP: "we chose a compliant route, so we're done".
- COMMON TRAP: one BAA assumed to cover every configuration.
- COMMON TRAP: logs and caches outside the residency boundary.
- COMMON TRAP: treating "no training" as "no retention".

#### Must remember
- Constraints eliminate options first.
- Obligation → control → owner → evidence.
- BAA coverage is per configuration.
- Minimise data before the call.
- Revalidate; configurations drift.

#### Quick recall
**"Filter · Control · Owner · Proof · Re-check."**

**Sources:** M1 Security, governance, regulated-industry constraints; M2 Constraint-to-integration matrix, PII case; M3 Compliance control register.

---

### Objective 5.5 – Address ethical AI considerations (bias, fairness, transparency)

#### What you need to know
**Fairness is an architectural property, not a model attribute you can assume.** Unequal outcomes enter at four points you control `[MODULE 3 – Fairness]`:
1. The **retrieval corpus** (over- or under-representation).
2. **Prompt framing** (encoded assumptions).
3. **Few-shot examples** (skew).
4. **Downstream routing** (different paths for different groups).

**Three audiences need explanations** `[MODULE 3]`:
| Audience | Needs |
|---|---|
| Affected user | Actionable reason |
| Regulator | Reconstructable, consistent treatment |
| Build team | Full trace |

**Decision logging:** inputs, retrieved context, output and routing, keyed so a single decision can be replayed. `[MODULE 3]`

**Bias in prompt construction:** phrase neutrally, balance examples across the cases you'll see, and don't presume the answer. `[MODULE 1]`

**Discernment:** judge outputs for unequal treatment, rather than just confirming a value was produced. `[MODULE 3]`

Overall metrics can look fine while harm concentrates in one subgroup, so measure by segment. `[MODULE 3]`

#### Why it matters
"We assumed fairness was the model's job. The skew was in our retrieval corpus, and we had logged so little that we could not prove it." `[MODULE 3]`

#### Architecture concepts
Segment-level evals; corpus audits; balanced few-shot sets; decision log with a governed retention period (in the compliance register).

#### How it works
1. Identify the four injection points in your design.
2. Instrument each (corpus composition, prompt and example review, routing logs).
3. Define segment-level fairness metrics.
4. Build the decision log.
5. Define explanation formats for each audience.
6. Govern the log (minimisation, retention, access).

#### Architecture example
REAL-WORLD EXAMPLE – Credit-decision support. Checklist:
- each injection point instrumented?
- adverse decisions explainable to the applicant in actionable terms?
- comparable applicants queryable for regulators?
- full trace for the team?

Any "no" is a design gap. `[MODULE 3]`

#### Decision framework
| Use A when… | Use B when… |
|---|---|
| **Segment-level metrics**: any consequential decision about people | **Overall metrics**: no individual impact |
| Avoid relying on vendor fairness evals alone | Avoid logging more personal data than the explanation needs |

#### Exam decision signals
- "Unequal outcomes, model passed bias evals" → **check corpus, prompt, examples, routing**.
- "Applicant asks why denied" → **actionable explanation from decision logs**.
- "Few-shot examples all one type" → **rebalance**.

#### Common traps
- COMMON TRAP: fairness as the vendor's responsibility.
- COMMON TRAP: aggregate-only metrics.
- COMMON TRAP: decision logs not governed as sensitive data.

#### Must remember
- Four injection points: corpus, framing, examples, routing.
- Three audiences, each needing a different slice of the same log.
- If you can't reconstruct an explanation, you can't give one.
- Segment metrics.

#### Quick recall
**"C-F-E-R: Corpus, Framing, Examples, Routing."**

**Sources:** M3 Fairness, Discernment, post-incident review; M1 Avoiding bias in prompt construction.
