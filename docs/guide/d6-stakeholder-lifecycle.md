---
domain_id: D6
domain_name: Stakeholder Communication & Lifecycle Management
weight: 14
priority: High
modules: [M4, M2, M5]
---

# Domain 6 – Stakeholder Communication & Lifecycle Management

**Weight:** 14% `[EXAM GUIDE]` · **About 9 of 63 items** `[INFERENCE]` · **Study priority:** High
**Mapped modules:** M4 (all on-blueprint sections) · M2 (POC to Prod, Sizing) · M5 (runbooks)

> **Optional · Partner Track (not scored):** M4's scenario-specific demo design, limit placement in demos, joint scoping with Anthropic Applied AI, GTM engagement map, sales-cycle objection handling and the "Reuse potential" field are labelled *"not tested by the Architect exam"*. See `docs/guide/optional-partner-track.md`.

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 6.1 | Conduct structured discovery and requirement gathering |
| 6.2 | Communicate architectural decisions and trade-offs |
| 6.3 | Manage stakeholder feedback loops and expectation alignment (including SLAs) |
| 6.4 | Document architectures and provide implementation guidance |
| 6.5 | Support lifecycle phases (discovery, design, handoff, monitoring, iteration) |

---

### Objective 6.1 – Conduct structured discovery and requirement gathering

#### What you need to know
Discovery is a **structured elicitation, not a conversation**: **listen → translate → write down**. `[MODULE 4]`

**Translation is the core move.** A preference ("seamless", "fast", "simple") is a signal to dig, not a requirement. Ask what would break it, what the user must never notice, and what must still be true when something fails. `[MODULE 4]`

**Four question buckets** `[MODULE 4]`:
- **Must do:** capabilities, expressed as outcomes.
- **Must not do:** boundaries, prohibited actions, cases that route to a human. Stakeholders rarely volunteer these.
- **Must cost:** latency target, cost per interaction, volume forecast.
- **Must prove:** evidence and audit obligations.

**Output: a translation table.** Each row holds the statement as said → implied constraint → required architectural decision → assumption to confirm. `[MODULE 4]`
A **requirement** traces to something the stakeholder said; an **assumption** is something the design takes for granted. Label assumptions explicitly. `[MODULE 4]`
Gather volume, input size and latency before a feasibility verdict. `[MODULE 2]`

#### Why it matters
A confident sketch ends the questioning. In one case "quick check" turned out to mean mandatory clinician authorisation, PHI handling and two states' retention rules, all discovered in compliance review. `[MODULE 4]`

#### Architecture concepts
The translation table feeds the eval thresholds (4.1), the SLA (6.3) and the control register (5.4).

#### How it works
1. Let the stakeholder describe the goal in business terms.
2. For every experience word, ask the breaking-point questions.
3. Work through all four buckets before sketching anything.
4. Write one row per item.
5. Mark each unconfirmed item as an assumption with an owner.
6. Treat "it's just a review step" as a constraint to chase down.

#### Architecture example
REAL-WORLD EXAMPLE – "We want this to feel seamless" →
- a p95 latency target;
- no re-entering upstream data;
- exceptions routed quietly to a reviewer;
- failures never expose internals;
- assumption: "seamless" means responsiveness and continuity (to confirm). `[MODULE 4]`

#### Decision framework
| Do | Don't |
|---|---|
| Finish all four buckets, then design | Propose architecture mid-call |
| Record assumptions as assumptions | Bury assumptions as facts |
| Ask "must not" and "must prove" explicitly | Wait for stakeholders to volunteer them |

#### Exam decision signals
- "Architect sketched a solution in the first call" → **discovery incomplete**.
- "Stakeholder says 'quick review'" → **possible mandatory HITL gate**.
- "Regulated industry mentioned in passing" → **must-prove bucket**.

#### Common traps
- COMMON TRAP: writing "seamless" down as the requirement.
- COMMON TRAP: building a prototype before the constraints are known.
- COMMON TRAP: answering capability questions first and never asking about constraints.

#### Must remember
- Listen → translate → write down.
- Do / Not do / Cost / Prove.
- One row per item, assumptions labelled.
- A plausible sketch is the danger.

#### Quick recall
**"Do · Don't · Cost · Prove."**

**Sources:** M4 Discovery, discovery-turned-design case, Glossary; M2 scoping-call case.

---

### Objective 6.2 – Communicate architectural decisions and trade-offs

#### What you need to know
Your job is to **make an informed decision possible**, not to deliver a verdict. `[MODULE 4]`

**Every trade-off presentation has three elements (four in regulated settings)** `[MODULE 4]`:
1. What we **gain**.
2. What we **give up**.
3. What **reversal costs** once the system is built around the choice. This is the most often omitted element and the one that changes the meeting.
4. (Regulated) the effect on **compliance posture**.

**Decision package:** the options considered, the criteria, the recommendation, and the remaining risks. `[MODULE 4]`

**Description competency for stakeholders** `[MODULE 4]`:
- lead with the business outcome;
- state limitations honestly;
- give the stakeholder the justification they'll need when their peers ask.

Name the trade-off out loud when recommending an entry point. `[MODULE 1]`

#### Why it matters
A CTO approved "about four cents per call" without hearing what that meant at their volume (a five-figure monthly line) or what unwinding the choice would cost. "I approved a direction, not a number." `[MODULE 4]`

#### Architecture concepts
Trade-off translation map, e.g.:
- full context vs. retrieval;
- logging depth vs. latency;
- single route vs. multi-platform.

Tie each one to the cost forecast at production volume. `[MODULE 4]`

#### How it works
1. List the options and the criteria.
2. For each option: gain, give-up, reversal cost (and compliance effect).
3. Convert per-unit numbers into business totals (per month at forecast volume).
4. Recommend, and state the residual risk.
5. Record the decision and rejected alternatives (6.4).

#### Architecture example
REAL-WORLD EXAMPLE – Insurer adjuster drafts, under regulated audit-trail requirements:
- Option A: complete package, including audit logging.
- Option B: technically accurate but **missing reversal cost**.
- Option C: drops logging for latency, which violates the constraint.

Recommend A, and name B's missing element. `[MODULE 4 – checkpoint pattern]`

#### Decision framework
| Element | Question it answers |
|---|---|
| Gain | Why choose it? |
| Give up | What do we lose? |
| Reversal cost | What if we're wrong later? |
| Compliance | Can we still prove obligations? |

#### Exam decision signals
- "Approved, then surprised by the invoice" → **reversal cost / volume translation missing**.
- "Executive confused by latency, context and retrieval jargon" → **translate into business consequence**.
- "Regulated + trading logging for speed" → **compliance posture**.

#### Common traps
- COMMON TRAP: technically accurate but answers the wrong question.
- COMMON TRAP: presenting only the recommendation.
- COMMON TRAP: per-call figures without totals.

#### Must remember
- Gain · Give up · Reversal (· Compliance).
- Decision package, not verdict.
- Translate into business units.
- Say limits honestly.

#### Quick recall
**"G-G-R(-C)."**

**Sources:** M4 Tradeoffs & GTM (on-blueprint parts), CTO approval case; M1 Entry point takeaways.

---

### Objective 6.3 – Manage stakeholder feedback loops and expectation alignment (including SLAs)

#### What you need to know
**The feedback loop is a decision layer that sits on top of observability**: Signals → Triage → Decide → Act → Review. `[MODULE 4]`
**An SLA names three things:** what's measured, what counts as a breach, and what happens on a breach. `[MODULE 4]`
Each threshold traces to a tangible source `[MODULE 4]`:
- **latency** ← the user-experience expectation;
- **availability** ← business criticality;
- **quality** ← eval acceptance criteria.

**Cost is the expectation that breaks most often.** Production volume is often 10–100× the pilot. Give a consumption forecast, a spend-control posture (caching, tiering, budget alerts) and the model-tiering story *before* the first invoice. `[MODULE 4]`
**Regulated checkpoints run on a schedule** whether or not anything has gone wrong (e.g. periodic output audits, residency confirmation). `[MODULE 4]`
**Governance table, built before launch:** signal → review trigger → architect action → regulated checkpoint. `[MODULE 4]`
Decide whether to **iterate or re-architect**. `[MODULE 4]`

#### Why it matters
The eval score drifted from week 4 to week 12 with no alert, because there was no rule tying slow drift to a trigger. "Monitoring is not a feedback loop." `[MODULE 4]`

#### Architecture concepts
Governance table rows:
| Signal | Trigger | Action |
|---|---|---|
| Eval score | Below threshold | Diagnose, then iterate vs. re-architect; periodic audit |
| p95 latency | Above budget | Tune or escalate |
| Cost per interaction | Above envelope | Bring a trade-off to the stakeholder |
| Residency config | On schedule | Confirm and record |

#### How it works
1. Derive SLA thresholds from their sources.
2. Define the breach consequence.
3. Build the governance table, including slow-drift triggers.
4. Name an owner per row.
5. Add the scheduled regulated checkpoints.
6. Hold reviews on trigger *and* on cadence.
7. Review whether each rule worked; adjust.

#### Architecture example
REAL-WORLD EXAMPLE – A clinical documentation assistant:
- weekly eval sampling;
- an architect review if the score drops for 2 weeks;
- a stakeholder review once drift is confirmed;
- a monthly residency confirmation and a quarterly output audit, regardless of scores. `[MODULE 4]` `[INFERENCE]`

#### Decision framework
| Iterate when… | Re-architect when… |
|---|---|
| A prompt, data or config fix restores the SLA | The constraint itself has changed (volume, residency, latency budget) or repeated fixes fail `[INFERENCE]` |

#### Exam decision signals
- "Slow decline, no alert" → **drift trigger missing**.
- "SLA number nobody can justify" → **trace it to a source**.
- "Pilot cost tiny, production bill shock" → **consumption forecast**.
- "Audit due but nothing broke" → **scheduled checkpoint**.

#### Common traps
- COMMON TRAP: dashboards as the feedback loop.
- COMMON TRAP: arbitrary SLA thresholds.
- COMMON TRAP: compliance reviews only after incidents.

#### Must remember
- Signals → Triage → Decide → Act → Review.
- SLA = measure, breach, consequence.
- Thresholds trace to sources.
- Scheduled regulated checkpoints.
- Forecast cost at production volume.

#### Quick recall
**"Every signal: trigger · owner · action."**

**Sources:** M4 Feedback loop & SLA, governance table, observability-replaced-loop case.

---

### Objective 6.4 – Document architectures and provide implementation guidance

#### What you need to know
**One document, three readers** `[MODULE 4]`:
- the **handoff recipient**, who needs decisions *plus rejected alternatives and the reason for each*;
- the **compliance reviewer**, who needs obligation → control → owner → evidence;
- the **returning architect**, who needs dated decisions, labelled assumptions, and open items with owners.

**Completeness test:** after reading the document, can a competent architect who wasn't in the room make a **safe change**? `[MODULE 4]`

**Completeness checklist:** decision (dated) · rejected alternatives · trade-off resolved · owner · evidence artifact · audit-ready status. `[MODULE 4]`

**Outcome document:** use case + scope boundary · metric before · metric after · auditable control · measurement owner (+ optional Partner-Track reuse potential). `[MODULE 4]`

**Implementation guidance:**
- runbooks: symptom → cause → action `[MODULE 5]`;
- an entry-point-responsibility map for multi-entry-point designs `[MODULE 4]`;
- documented boundary conditions `[MODULE 2]`.

#### Why it matters
A replacement architect changed the context strategy to fix performance and broke data residency, because the diagram showed *what* but not *why*. `[MODULE 4]`

#### Architecture concepts
Decision log with rationale (ADR-style `[INFERENCE]`), control register, runbook, responsibility map, outcome document.

#### How it works
1. Record each decision as it's made, with its date.
2. Record the alternatives and why each was rejected.
3. Mark load-bearing decisions (e.g. "required for residency").
4. Attach the control register with live evidence.
5. Label assumptions; give open items owners and resolution criteria.
6. Write runbooks and an escalation path.
7. Test: could a stranger make a safe change?

#### Architecture example
REAL-WORLD EXAMPLE – Decision: "Progressive context with an in-region retrieval store (2026-03-02)." Rejected: "a full-document monolithic call through the global endpoint" (violates EU residency). Owner: data owner. Evidence: residency config + data-flow record. `[MODULE 4]` `[INFERENCE]`

#### Decision framework
| Artifact | Primary reader |
|---|---|
| Decision log + rejected alternatives | Handoff recipient |
| Control register | Compliance reviewer |
| Dated decisions, assumptions, open items | Returning architect |
| Outcome document | Sponsor / CFO |
| Runbook | Operating team |

#### Exam decision signals
- "Successor reversed a key decision" → **rationale and rejected alternatives missing**.
- "Auditor wants proof" → **evidence artifact**.
- "Sponsor needs to justify expansion" → **outcome document with before/after**.

#### Common traps
- COMMON TRAP: diagram-only handoffs.
- COMMON TRAP: writing assumptions as facts.
- COMMON TRAP: an outcome document with only technical metrics.

#### Must remember
- Record *why*, not just *what*.
- Rejected alternatives protect load-bearing decisions.
- Three readers.
- The safe-change test.

#### Quick recall
**"What · Why · Why not · Who · Proof."**

**Sources:** M4 Documentation, handoff postmortem, outcome document; M5 runbooks; M2 boundary conditions.

---

### Objective 6.5 – Support lifecycle phases (discovery, design, handoff, monitoring, iteration)

#### What you need to know
**Lifecycle:** discovery → design → handoff → monitoring → iteration. `[MODULE 4]`
| Phase | Key artifacts | Source |
|---|---|---|
| Discovery | Translation table, constraints, assumptions | `[MODULE 4]` |
| Design | Pattern, sizing, eval suite (before code), feasibility verdict, trade-off package, control register | `[MODULE 1, 2, 3, 4]` |
| Handoff | Decision log with rationale, runbooks, responsibility map | `[MODULE 4, 5]` |
| Monitoring | Observability + governance table + SLA | `[MODULE 2, 4]` |
| Iteration | A/B or shadow tests, eval-gated changes, iterate vs. re-architect | `[MODULE 2, 4]` |

**POC → production gap:** cost, latency (p95), reliability (retries with exponential backoff near the API call, circuit breakers at the service boundary, fallback chains in orchestration), and failure modes. A POC shows capability, not cost or reliability. `[MODULE 2]`
**Version pinning and an update runbook** apply in every phase. `[MODULE 2]`
Knowing which phase a decision belongs to tells you when the work is ready to move to the next phase. `[MODULE 4]`

#### Why it matters
A 529 error at peak took down a workflow that had no fallback. The POC had been treated as a model for cost and reliability. `[MODULE 2]`

#### Architecture concepts
Phase gates: discovery complete → design approved (with evals and sizing) → production-readiness checklist → handoff completeness test → monitoring live with triggers.

#### How it works
1. Identify the current phase.
2. Check its exit criteria.
3. Produce the phase artifacts.
4. Gate the transition.
5. In monitoring, route signals to iterate or re-architect.

#### Architecture example
REAL-WORLD EXAMPLE – A document triage system before production adds: a cost model from the token distribution; retries + a circuit breaker + a fallback tier; a pinned model version; evals for the fallback path. `[MODULE 2]`

#### Decision framework
| Phase question | Answer before moving on |
|---|---|
| Discovery → Design | Are all four buckets answered or labelled as assumptions? |
| Design → Build | Do evals, sizing and verdict exist? |
| Build → Production | Reliability controls, observability, compliance evidence? |
| Production → Handoff | Does it pass the safe-change test? |

#### Exam decision signals
- "Ready to launch, POC worked" → **production-readiness gap**.
- "New team inherits the system" → **handoff artifacts**.
- "Metric drifting" → **monitoring → iteration decision**.

#### Common traps
- COMMON TRAP: putting reliability controls in the wrong layer.
- COMMON TRAP: skipping the handoff phase.
- COMMON TRAP: shipping a POC's cost profile to production.

#### Must remember
- D → D → H → M → I.
- A POC proves capability only.
- Retries, breakers, fallbacks, each at its own layer.
- Pin versions.

#### Quick recall
**"Discover · Design · Hand off · Monitor · Iterate."**

**Sources:** M4 Orientation (lifecycle), Glossary; M2 POC to Production, reliability controls, version pinning.
