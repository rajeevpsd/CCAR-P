# Architecture Comparison Guides

These are concepts candidates often confuse. Each comparison gives *Use A when / Use B when / Avoid A when / Avoid B when / Key exam clue*, followed by its source.

---

## 1. Workflow vs. Agent — Obj 1.3
| | Workflow | Agent |
|---|---|---|
| **Use when** | Steps can be listed in advance; errors are costly; you need auditability | The path can't be listed in advance; errors are acceptable and recoverable |
| **Avoid when** | You'd have to script endless branches for open-ended investigation | The steps are knowable, or a step is irreversible or must be auditable |
| **Key exam clue** | "Auditor asks which step approved it" · "four request types" | "Unfamiliar codebase" · "next step depends on what was found" |
Sources: `[MODULE 1 – Pattern Selection]` `[OFFICIAL ANTHROPIC DOCS – Building effective agents]`

## 2. Augmented LLM vs. Workflow — Obj 1.3
| | Augmented LLM (one call + tools/retrieval) | Workflow |
|---|---|---|
| **Use when** | One bounded, verifiable task | Several dependent steps, gates or routing |
| **Avoid when** | The task needs staged checks or branching | One call already meets the quality bar (added latency and cost for nothing) |
| **Key exam clue** | "Single extraction against a schema" | "Draft → check → revise" · "classify then route" |
Source: `[MODULE 1]`

## 3. Single agent vs. Multi-agent — Obj 1.4
| | Single agent | Multi-agent (orchestrator + subagents) |
|---|---|---|
| **Use when** | The work fits one context; steps are interdependent | The work exceeds one context; units are independent and parallelisable |
| **Avoid when** | Context overflows, or breadth-first parallel work is needed | Agents need shared context or have heavy dependencies; tight token budget (≈15× chat tokens) |
| **Key exam clue** | "Tightly coupled steps" | "400 files / 200 documents / 50 sections" |
Sources: `[MODULE 1]` `[OFFICIAL ANTHROPIC DOCS – multi-agent research system]`

## 4. Workflow sub-patterns — Obj 1.3
| Pattern | Use when | Avoid when |
|---|---|---|
| Prompt chaining | Fixed sequence, with gates between steps | Steps are independent (parallelise instead) |
| Routing | Distinct categories, accurate classification | Categories overlap heavily |
| Parallelization (sectioning / voting) | Independent sections, or several attempts for confidence | Units depend on each other |
| Orchestrator-workers | Subtasks can't be known until runtime | Subtasks are fixed (use parallelization) |
| Evaluator-optimizer | Clear evaluation criteria; refinement adds measurable value | No reliable way to evaluate |
**Key exam clue:** "subtasks not predefined" → orchestrator-workers; "same task run N times" → voting.
Source: `[OFFICIAL ANTHROPIC DOCS – Building effective agents]`

## 5. RAG vs. Tool call (live state) — Obj 3.6
| | RAG | Tool / API call |
|---|---|---|
| **Use when** | Stable knowledge (manuals, policies); citations needed; corpus large | Live state (orders, inventory, balances); a system of record owns it |
| **Avoid when** | The value changes on its own between index refreshes | The answer is reference text that suits retrieval |
| **Key exam clue** | "Policy questions, cite the section" | "Answer contradicts the database" · "changes each refresh" |
Source: `[MODULE 1 – retrieval trace]`

## 6. RAG vs. Putting content directly in context — Obj 3.6 / 3.8
| | RAG | Direct in context (monolithic, ideally cached) |
|---|---|---|
| **Use when** | Corpus too big for the window, or changes faster than deployments | Small, stable material needed on every request |
| **Avoid when** | The material is small and always needed (retrieval latency, recall risk) | Material is large or growing; cost scales linearly |
| **Key exam clue** | "12,000 documents" | "Same 8k-token policy every call" → cache it |
Sources: `[MODULE 1]` `[EXAM GUIDE Sample 2]`

## 7. Dense vs. Sparse vs. Hybrid retrieval — Obj 3.5
| | Dense | Sparse (BM25) | Hybrid + RRF |
|---|---|---|---|
| **Use when** | Paraphrased or conceptual queries | Exact identifiers, codes, citations | Mixed query patterns (the common case) |
| **Avoid when** | Exact-token matches matter | Users paraphrase | Latency is extremely tight and queries are uniform |
| **Key exam clue** | "Asked in different words" | "Part numbers missed" | "Both kinds of query" |
Source: `[MODULE 1 – RAG Pipeline Design]`

## 8. MCP vs. Direct API tool use — Obj 3.7
| | MCP server | Direct tool use (in your code) |
|---|---|---|
| **Use when** | The same tool surface is reused across two or more Claude clients | Tools live inside one product |
| **Avoid when** | Only one client will ever use it (protocol overhead, harder debugging) | Several clients each duplicate the integration |
| **Key exam clue** | "Claude.ai, Claude Code and our app all need Jira" | "Our web app only" |
Note: these are different layers, not true alternatives; MCP tools are invoked through tool use. `[MODULE 1]` `[MODULE 2]`

## 9. SDK vs. Agent SDK vs. Claude Code — Obj 3.7 / 7.1
| | Anthropic SDK | Agent SDK | Claude Code |
|---|---|---|---|
| **Use when** | One request/response, embedded in your product | A managed multi-turn agent loop inside your product | Developers doing engineering work |
| **Avoid when** | You need a managed loop | You need custom logic between turns (use a raw API loop) | Non-engineering users; a backend for multi-tenant products |
| **Key exam clue** | "Summarise each ticket" | "Agent inside our web app" | "Refactor across the repo" |
Sources: `[MODULE 1]` `[MODULE 2]`

## 10. Prompt engineering vs. Context engineering — Obj 2.2 / 2.4 / 3.6
| | Prompt engineering | Context engineering |
|---|---|---|
| **Concern** | *How* you instruct: role, scope, constraints, output contract, technique | *What* reaches the window and through which mechanism: retrieval, tools, memory, compaction, caching order |
| **Fix it when** | Output varies; format drifts; underspecification | Stale or missing facts; context overflow; cost growth per turn |
| **Key exam clue** | "Same input, different format" | "Right instruction, wrong or stale facts" |
Sources: `[MODULE 1 – Prompting as Architecture; retrieval trace ("the broader underlying skill here is context engineering")]` `[INFERENCE – framing]`

## 11. Deterministic vs. Model-driven processing — Obj 5.1 / 1.5
| | Deterministic (code, rules) | Model-driven |
|---|---|---|
| **Use when** | Authorization, routing rules, arithmetic, schema checks, compliance logic | Language understanding, drafting, fuzzy classification |
| **Avoid when** | The input is ambiguous natural language | The answer must be provable, replayable or exact |
| **Key exam clue** | "Must be auditable / always the same" | "Ambiguous intent / tone" |
Sources: `[MODULE 1]` `[MODULE 3]`

## 12. Code-based vs. LLM-judge vs. Human evals — Obj 4.2
| | Code | LLM judge | Human |
|---|---|---|---|
| **Use when** | Unambiguous checks | Interpretive quality at scale (calibrated, different model) | Novel or high-stakes; calibrating judges |
| **Avoid when** | Interpretation is needed | Code can check it; the judge is uncalibrated | You need full coverage at scale |
| **Key exam clue** | "Valid JSON / exact value" | "Faithfulness / tone" | "New capability, no rubric yet" |
Source: `[MODULE 2]`

## 13. Live A/B vs. Shadow testing — Obj 4.3
| | Live A/B | Shadow |
|---|---|---|
| **Use when** | Bounded exposure is acceptable; traffic is high | One bad output is too risky; low traffic; regulated |
| **Avoid when** | Users can't be exposed to an unvalidated change | You need real downstream user signals |
| **Key exam clue** | "Measure acceptance rate" | "Regulator won't allow exposure" |
Source: `[MODULE 2]`

## 14. Model tiers: Opus vs. Sonnet vs. Haiku — Obj 2.1
| | Opus | Sonnet (default) | Haiku |
|---|---|---|---|
| **Use when** | An eval shows Sonnet misses the bar on hard reasoning | Starting point for most production work | An eval confirms acceptable quality on simple, high-volume steps |
| **Avoid when** | As a blanket default | — | Steps that fail per-category floors |
| **Key exam clue** | "Final synthesis step" | "New build" | "Router / classifier" |
Source: `[MODULE 1]`

## 15. Human-in-the-loop placements — Obj 5.3
| | Pre-action approval | Post-action audit | Sampled review |
|---|---|---|---|
| **Use when** | Irreversible or high-cost actions | Reversible, lower-cost decisions with throughput needs | Monitoring quality on low-stakes volume |
| **Avoid when** | High-volume, low-stakes work (consent fatigue) | Irreversible actions | Individual outcomes must be guaranteed |
| **Key exam clue** | "Issue payment" | "Tag a ticket" | "Thousands per day, low risk" |
Source: `[MODULE 3]`

## 16. Guardrail types — Obj 5.1
| | Model-based screen | Deterministic rule | Authorization |
|---|---|---|---|
| **Use when** | Fuzzy intent, toxicity | Clear patterns, schema | Any side-effecting action |
| **Avoid when** | Authorization decisions | Paraphrased attacks | (never skip for side effects) |
| **Key exam clue** | "Jailbreak phrasing" | "Forbidden field" | "Refund / delete / send" |
Chain them, and make each fail closed. Source: `[MODULE 3]`

## 17. Synchronous vs. Asynchronous (Batch) — Obj 4.5
| | Synchronous | Batch API |
|---|---|---|
| **Use when** | A user is waiting; latency SLA | The SLA allows delayed results (overnight reports, bulk backfills) |
| **Avoid when** | Bulk, non-urgent work (cost) | Interactive paths; regulated data not covered by the configuration |
| **Key exam clue** | "Agent replies live" | "Process 500k documents by morning" |
Source: `[MODULE 2]`

## 18. Prototype vs. Production architecture — Obj 6.5
| | POC | Production |
|---|---|---|
| **Proves** | Capability | Cost, p95 latency, reliability, failure handling |
| **Must add** | — | Cost model from token distribution; retries/backoff, circuit breaker, fallback; pinned versions; eval gate; observability; compliance evidence |
| **Key exam clue** | "Demo worked 5 times" | "Peak-time 529 took the workflow down" |
Source: `[MODULE 2]`

## 19. Monolithic vs. Progressive context — Obj 3.8
See guide Objective 3.8. **Key exam clue:** "same prefix each call" → monolithic + caching; "grows each turn" or "hundreds of tools" → progressive, compaction, tool search. `[MODULE 1]` `[OFFICIAL ANTHROPIC DOCS]`

## 20. Prompt library vs. Skill — Obj 2.5 / 7.1
| | Modular prompt library | Skill |
|---|---|---|
| **Use when** | Flexible fragments assembled per use, within one team | A stable, repeatable procedure distributed across teams, needing version and rollback |
| **Avoid when** | Many teams need one governed procedure | The prompt changes per use |
| **Key exam clue** | "Engineers tweak each time" | "Same procedure, 40 engineers, needs rollback" → plugin-distributed Skill |
Sources: `[MODULE 1]` `[MODULE 5]`
