# CCAR-P Phase 1 — Source Analysis, Blueprint & Traceability

> **Status:** Phase 1 (analysis only; the trainer is not built yet)
> **Prepared:** 18 Nov 2026
> **Scope authority:** *Claude Certified Architect – Professional Exam Guide*, v1.0, effective July 2026 (exam code **CCAR-P**)
> **Not exam content:** none of this repository contains real Anthropic exam questions. All practice items will be original.

## Source labels used throughout

| Label | Meaning |
|---|---|
| `[EXAM GUIDE]` | CCAR-P Exam Guide v1.0. This is the authority for scope, weights, objectives and format |
| `[MODULE n]` | CCAP training Module 1–5 (.docx). This is the authority for the supplied training content |
| `[OFFICIAL ANTHROPIC DOCS]` | platform.claude.com docs, anthropic.com engineering/research posts, or the official MCP specification at modelcontextprotocol.io. Used only to fill gaps |
| `[INFERENCE]` | The author's reasoning or arithmetic; not stated in any source |
| **Source gap – verification required** | Could not be verified from any source above |

## Sources analysed

| ID | Source | Notes |
|---|---|---|
| EG | `ClaudeCertifiedArchitect–ProfessionalExamGuide.pdf` | 16 sections, read in full |
| M1 | `CCAP_Module1_CLAUDE_PLATFORM_N_SOLUTION_DESIGN.docx` | Claude Platform & Solution Design |
| M2 | `CCAP_Module2_Enterprise_Integration_N_Production.docx` | Enterprise Integration & Production |
| M3 | `CCAP_Module3_Responsible_AI_Safety_N_Risk_for_Architects.docx` | Responsible AI, Safety & Risk |
| M4 | `CCAP_Module4_Stakeholder_Engagement_Lifecycle_N_GTM.docx` | Stakeholder Engagement, Lifecycle & GTM |
| M5 | `CCAP_Module5_TeamEnablement_Operational_Productivity.docx` | Team Enablement & Operational Productivity |
| UX1–8 | CCAR-F trainer screenshots (8) | Used **only** as the reference for UX and learning flow (see §9) |

The .docx text has no page numbers, so module citations use **section headings**.

---

## 1. Exam at a glance `[EXAM GUIDE §5, §9, §11, §14]`

| Item | Value |
|---|---|
| Credential | Claude Certified Architect – Professional |
| Exam code / guide version | CCAR-P · v1.0, effective July 2026 |
| Number of items | **63** |
| Item format | Multiple-choice and multiple-response; each item states how many responses to select |
| Time limit | **120 minutes** (≈ 1.9 min per item `[INFERENCE]`) |
| Delivery | Proctored by Pearson VUE, online or at a test centre |
| Passing score | **Scaled 720** on a 100–1,000 scale; criterion-referenced; cut score set by a standard-setting study |
| Score report | Pass/fail plus scaled score, and percent correct per domain. Domain percentages are **not** used for pass/fail |
| Fee | $175 USD per attempt |
| Validity | 12 months; free, non-proctored on-time renewal assessment |
| Retakes | Wait 14 days, then 30, then 90; at most 4 attempts in a rolling 12 months |
| Prerequisites | None required. Recommended: software-engineering foundation; 3+ years in systems architecture or platform engineering; 6+ months hands-on with Claude or a comparable LLM in production; end-to-end delivery experience |
| Intended audience | Mid- to senior-level solution architects, AI/ML engineers, tech leads, senior SWEs. Not entry-level, and not prompt-writing-only roles |
| Domains | **7** (CCAR-F has 5; the domains differ and must not be reused) |

**Study-target note:** the trainer will use 75% as READY, 70–74% as REVIEW and under 70% as REPAIR. These are **study targets only**. The guide says the 720 cut score is scaled and does not publish a raw-score conversion. `[EXAM GUIDE §9]`

---

## 2. Official blueprint `[EXAM GUIDE §6]`

| # | Domain (official name) | Weight | ≈ Items of 63 `[INFERENCE]` | Study priority `[INFERENCE]` | Mapped modules |
|---|---|---|---|---|---|
| 1 | Solution Design & Architecture | 17% | 11 | **Critical** | M1, M2, M4 |
| 2 | Claude Models, Prompting & Context Engineering | 13% | 8 | High | M1, M2, M5 |
| 3 | Integration | 19% | 12 | **Critical** | M1, M2, M3 |
| 4 | Evaluation, Testing & Optimization | 16% | 10 | **Critical** | M2, M1, M5 |
| 5 | Governance, Safety & Risk Management | 14% | 9 | High | M3, M1, M2 |
| 6 | Stakeholder Communication & Lifecycle Management | 14% | 9 | High | M4, M2, M5 |
| 7 | Developer Productivity & Operational Enablement | 7% | 4 | Medium | M5, M1 |
| | **Total** | **100%** | **63** | | |

Item counts are 63 × weight, rounded so the total is 63 (10.71 → 11, 8.19 → 8, 11.97 → 12, 10.08 → 10, 8.82 → 9, 8.82 → 9, 4.41 → 4). The guide calls weights "approximate proportion of scored items", so these counts are a **mock-exam target, not an official split**.

**Objective count:** 38 (D1 6 · D2 5 · D3 8 · D4 6 · D5 5 · D6 5 · D7 3). The guide does not number objectives; the IDs `1.1 … 7.3` are assigned here in the order the guide lists them `[INFERENCE]`.

---

## 3. Objectives and module-to-objective mapping

Coverage legend: **C** = Complete from modules · **C+D** = Complete after supplementing with official docs · **P** = Partial · **G** = Gap

### Domain 1 — Solution Design & Architecture (17%)
| ID | Official objective `[EXAM GUIDE]` | Module sources (section) | Cov. |
|---|---|---|---|
| 1.1 | Translate business problems into Claude-based AI solutions | M1 *How Claude Behaves* (four properties); M1 *Decomposition* (Claude / systems / humans; delegation by reversibility, stakes, accountability); M2 *Sizing → How to scope a use case*; M2 feasibility verdicts; M4 *Discovery* translation | C |
| 1.2 | Design end-to-end architectures (input → processing → output → feedback loops) | M1 *Reference Architectures*; M2 *Observability* (outcome logging); M4 *Feedback loop*; + Building Effective Agents (G3) | C+D |
| 1.3 | Select appropriate architectural patterns (workflow, agentic, augmented LLM) | M1 *Pattern Selection* (predictability × autonomy, five factors, prompting before fine-tuning, Skills packaging, "flexibility vs. non-determinism" retrospective); + Building Effective Agents (G4) | C+D |
| 1.4 | Design multi-agent systems and orchestration strategies | M1 *Multi-agent systems and orchestration*, *When fan-out hid a dropped unit*; M2 *Failure modes by architecture* (orchestrator-workers); M2 least-privilege subagent tools | C |
| 1.5 | Apply decomposition techniques for complex problem solving | M1 *Decomposition*, fan-out; M2 capability-list decomposition; + prompt chaining (G4) | C |
| 1.6 | Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs) | M2 *Business value and ROI mapping* (same five pillars; M2 says "solution cost"); M4 *Outcome document* | C |

### Domain 2 — Claude Models, Prompting & Context Engineering (13%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 2.1 | Select appropriate Claude models based on trade-offs | M1 *Model & Context Strategy* (Sonnet default; move to Opus or Haiku only on eval evidence); *Opus-everywhere 7× cost overrun*; Sonnet → Haiku partial-migration case; extended / adaptive thinking | C |
| 2.2 | Design system prompts, templates, and guardrails | M1 *Prompting as Architecture* (role, scope, constraints, output contract; templates; Description competency; underspecification); M3 guardrails | C |
| 2.3 | Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought) | M1 *Prompt engineering techniques across models* (technique selection, cross-model behaviour, bias in prompt construction) | C |
| 2.4 | Optimize context windows and manage token usage | M1 working memory (400 `invalid_request_error`, 413 `request_too_large`, `model_context_window_exceeded`, usage field, token counting); context sizing; four context strategies; M2 skewed token distributions | C |
| 2.5 | Implement prompt reuse strategies (caching, modular prompts, Skills) | M1 *Caching mechanics, modular prompts, and Skills*; M1 *Skills as an integration mechanism* (`container.skills`, `/v1/skills`, Code Execution Tool); M2 `cache_control`, write cost, 5-minute default TTL; M5 *Skills distribution* | C |

### Domain 3 — Integration (19%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 3.1 | Evaluate tool/agent configuration for capability bloat | M2 *Least-privilege tool configuration*; M1 "keep the tool surface narrow"; EG Sample 1. The phrase "capability bloat" isn't used in the modules; concept mapping `[INFERENCE]`. Tool search (G2) also reduces tool-definition bloat | C |
| 3.2 | Analyze authentication and authorization requirements to identify security gaps | M2 *Identity and authorization* (server-side identity injection, SSO, per-tenant API keys); M3 deterministic *tool-call authorization*; + MCP authorization spec (G5) | C+D |
| 3.3 | Evaluate accuracy-latency trade-offs and justify configuration decisions | M1 extended thinking, tier choice, cost & latency calculator, RAG quality/latency/maintenance; M2 p95, calculator; M4 logging-vs-latency trade-off | C |
| 3.4 | Analyze observability challenges and select monitoring strategies at scale | M2 *Observability at scale* (tracing, aggregation, anomaly detection, change attribution), four log groups, audit coverage per surface; M1 shared trace ID | C |
| 3.5 | Design a RAG pipeline with appropriate chunking and indexing strategies | M1 *RAG Pipeline Design* (fixed / semantic / hierarchical; dense / sparse / hybrid; RRF; trade-off triangle) | C |
| 3.6 | Apply retrieval strategies matched to data shape and query pattern | M1 indexing by query pattern; chunking by structure; *When retrieval got reached for instead of a tool call*; M2 separating live-state and knowledge queries | C |
| 3.7 | Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent) | M1 *Build-time interfaces* (API, SDK, MCP, Agent SDK), MCP vs. API tool use, bank Claude Code/MCP misuse case; M2 entry-point table; + G1 | **P** |
| 3.8 | Evaluate progressive discovery vs. monolithic context strategy | M1 context-strategy spectrum (monolithic / progressive / RAG / compaction); Claude Code Skills loaded on demand; + tool search & Skills progressive disclosure (G2) | C+D |

### Domain 4 — Evaluation, Testing & Optimization (16%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 4.1 | Define evaluation metrics (accuracy, latency, cost, safety, security) | M2 *Defining success criteria*; M2 *Exercise: define the evaluation framework* (all five dimensions) | C |
| 4.2 | Design evaluation datasets and test frameworks using mixed methodologies | M2 eval workflow (5 stages), golden dataset, code / model / human evals, grading ladder, judge calibration, multi-turn evals, adversarial inputs; *The eval suite that measured the wrong thing* | C |
| 4.3 | Conduct A/B testing and iterative improvements | M2 *A/B testing and observability at scale* (hypothesis, assignment, primary metric, sample size; significance vs. practical size; shadow testing); *The 50-session winner* | C |
| 4.4 | Diagnose system issues (prompt failure, hallucinations, model mismatch) | M2 *Failure taxonomy*, Discernment; M5 symptom → cause table; M1 underspecification; EG Sample 3 | C |
| 4.5 | Optimize token usage, latency, and cost-performance trade-offs | M1 per-step model routing (−71% cost), caching, thinking only when evals justify it; M2 Batch API, `max_tokens`, caching economics, sizing | C |
| 4.6 | Monitor system performance using logging and observability tools | M2 observability, technical-to-business KPI translation layer; M4 governance table; M5 telemetry and traces | C |

### Domain 5 — Governance, Safety & Risk Management (14%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 5.1 | Implement guardrails and safety controls | M3 *Alignment* (training-time vs. inference-time; four-layer stack); M3 *Placing screening and authorization* (input / output / tool-call; model-based vs. deterministic; fail-closed; indirect injection; `stop_reason: "refusal"` + `stop_details`); M3 *Skill supply-chain security* | C |
| 5.2 | Identify risks, limitations, and failure modes of LLM systems | M3 *Risks, limitations, and failure modes* (five risk categories, vulnerability walk, written risk assessment); M1 four properties; M2 failure modes by architecture | C |
| 5.3 | Apply human-in-the-loop validation strategies | M3 *Review routing* (confidence × reversibility × cost; pre-action / post-action / sampled; reviewer view; consent fatigue; Diligence); M1 agent checkpoints; M2 low-confidence queue | C |
| 5.4 | Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP) | M1 regulated-industry constraints table; M2 constraint-to-integration matrix; M3 *Compliance* control register (control, owner, evidence) | C (facts time-sensitive, §6) |
| 5.5 | Address ethical AI considerations (bias, fairness, transparency) | M3 *Fairness* (four injection points, explanations for three audiences, decision logging); M3 constitution; M1 bias in prompt construction | C |

### Domain 6 — Stakeholder Communication & Lifecycle Management (14%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 6.1 | Conduct structured discovery and requirement gathering | M4 *A discovery call is a structured elicitation* (listen → translate → write down; four question buckets; translation table); *The discovery call that turned into a design session* | C |
| 6.2 | Communicate architectural decisions and trade-offs | M4 *Tradeoffs & GTM* (gain / give up / reversal cost / compliance posture; decision package; translation map); *The approval that was not an informed choice* | C |
| 6.3 | Manage stakeholder feedback loops and expectation alignment (including SLAs) | M4 feedback loop (Signals → Triage → Decide → Act → Review); SLA (measure / breach / consequence, sourced thresholds); scheduled regulated checkpoints; cost-expectation forecast | C |
| 6.4 | Document architectures and provide implementation guidance | M4 *Documentation* (three readers, completeness checklist, rejected alternatives); M4 outcome-document template (M4 itself tags it 6.4); M5 runbooks | C |
| 6.5 | Support lifecycle phases (discovery, design, handoff, monitoring, iteration) | M4 lifecycle mapping (orientation and glossary); M2 POC → production; M4 entry-point-responsibility map | C |

### Domain 7 — Developer Productivity & Operational Enablement (7%)
| ID | Objective | Module sources | Cov. |
|---|---|---|---|
| 7.1 | Configure Claude tools and environments for teams (e.g., Claude Code) | M5 *Configuring Claude tooling and environments for teams* (shared config, champion-then-batch rollout, four Skills distribution mechanisms, spend posture); M1 Claude Code shaping vs. governing layers, permission modes | C |
| 7.2 | Improve developer workflows using AI-assisted tooling | M5 *Improving developer workflows* (stage table, lumpy adoption, stalling at chat, Diligence, verification checklist) | C |
| 7.3 | Support debugging and operational issue resolution | M5 *Operational Support* (symptom → cause → first action, runbooks, escalation paths) | C |

---

## 4. Coverage analysis

| Measure | Count |
|---|---|
| Official objectives found | **38** |
| Complete from modules alone | 33 |
| Complete after official-doc supplementation | 4 (1.2, 1.3, 3.2, 3.8) |
| Still partial | **1** (3.7, agent-to-agent) |
| No coverage | 0 |

**Thoroughly covered:** D2, D4, D5 and D6 (each objective has a dedicated module section plus a worked failure case).

**High-risk / high-weight:** D3 Integration (19%, the largest domain, and it holds the only remaining partial) and D1 (17%, which depends most on synthesis across modules).

**Overlap map** (questions must be tagged to one *primary* objective):

| Concept | Objectives it touches | Tagging rule `[INFERENCE]` |
|---|---|---|
| Prompt caching | 2.5, 4.5 | Prefix design or reuse → 2.5; measured cost/latency tuning → 4.5 |
| Observability | 3.4, 4.6, 6.3 | Choosing what to instrument at scale → 3.4; using it to monitor performance → 4.6; deciding who acts on a signal → 6.3 |
| Human-in-the-loop | 1.4, 5.3 | Gate placement inside orchestration → 1.4; routing policy by stakes → 5.3 |
| Compliance / identity | 5.4, 3.2 | Obligation → control → evidence → 5.4; authN/authZ gap → 3.2 |
| Trade-offs | 3.3, 6.2 | Technical justification → 3.3; communicating to stakeholders → 6.2 |
| Context strategy | 2.4, 3.8 | Token budget and window sizing → 2.4; progressive vs. monolithic architecture → 3.8 |
| Model choice | 2.1, 4.5, 4.4 | Initial selection → 2.1; cost optimisation → 4.5; mismatch diagnosis → 4.4 |

**Partner-track content: kept as OPTIONAL, non-scored reading.** M4 explicitly labels these items *"not tested by the Architect exam"*: scenario-specific demo design and limit placement for demos, joint scoping with the Anthropic Applied AI team, the GTM engagement map, technical objection handling in a sales cycle, and the outcome document's "Reuse potential" field. The trainer will show them under a clearly marked **Optional · Partner Track** label, exclude them from Practice and Mock Exam scoring, and exclude them from Progress readiness.

---

## 5. Source gaps — resolution using official documentation

### G1 · Objective 3.7 — agent-to-agent protocols → **remains Partial**
- **Module coverage:** M1/M2 cover only orchestrator → subagent inside one system, plus API, SDK, MCP and the Agent SDK. "CLI" appears only as the Claude Code CLI.
- `[OFFICIAL ANTHROPIC DOCS]` Anthropic's multi-agent research system uses an orchestrator-worker design: a lead agent plans and spawns parallel subagents. Anthropic reports multi-agent systems use about 15× the tokens of chat, and says domains needing shared context or many inter-agent dependencies are a poor fit today. Source: <https://www.anthropic.com/engineering/multi-agent-research-system>
- **External (not Anthropic):** A2A (Agent2Agent) is an open protocol announced by Google, positioned as complementary to MCP. Source: <https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/>
- **Source gap – verification required:** no official Anthropic documentation on agent-to-agent protocol support or recommendations was found. Questions on 3.7 will test the *decision principle* only, labelled `[INFERENCE]`:
  - in-process subagents when one team owns all the agents;
  - MCP when a tool or data surface is shared across clients;
  - direct API/SDK for a single product;
  - an agent-to-agent protocol only when delegating across independently owned agents or frameworks.

### G2 · Objective 3.8 — progressive discovery of tools and capabilities → **Resolved**
`[OFFICIAL ANTHROPIC DOCS]` <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- With the **tool search tool**, Claude searches the tool catalogue and loads only the tools it needs. Tools marked `defer_loading: true` load only when discovered.
- You still send every full tool definition; `defer_loading` controls what enters the context window, not what you send.
- Never defer the tool search tool itself. Keep the 3–5 most-used tools non-deferred.
- Variants: regex and BM25. MCP toolsets can defer a whole server while keeping specific tools loaded.

`[OFFICIAL ANTHROPIC DOCS]` <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>
- **Progressive disclosure** is the core design principle of Agent Skills: only metadata is visible up front; SKILL.md, then referenced files, load when needed.

### G3 · Objective 1.2 — end-to-end architecture template → **Resolved (synthesis labelled)**
- `[OFFICIAL ANTHROPIC DOCS]` <https://www.anthropic.com/engineering/building-effective-agents> calls the augmented LLM (retrieval, tools, memory) the basic building block, and recommends the simplest solution first, adding complexity only when needed.
- The guide's *input → processing → output → feedback loop* template will be built from:
  - input: M2 identity injection and data minimisation;
  - processing: M1 pattern and reference architecture;
  - output: M3 output screening and M2 schema;
  - feedback loop: M2 outcome signals, M4 Signals → Triage → Decide → Act → Review.

  The assembly is `[INFERENCE]`.

### G4 · Objective 1.3 — workflow sub-patterns → **Resolved**
`[OFFICIAL ANTHROPIC DOCS]` Building Effective Agents (same URL as G3):
- **Workflows** orchestrate LLMs and tools through predefined code paths. **Agents** dynamically direct their own processes and tool use.
- The five workflow patterns:
  1. **Prompt chaining**, with programmatic "gates" between steps
  2. **Routing**, when categories are distinct and classification is accurate
  3. **Parallelization**, either *sectioning* or *voting*
  4. **Orchestrator-workers**, where subtasks are not predefined
  5. **Evaluator-optimizer**
- These match the module vocabulary (M1 Routing and Evaluator-optimizer reference architectures, M1 parallelized workflow in the law-firm answer, M2 orchestrator-workers).
- The post now carries a note that much of its tooling landscape has changed since December 2024; the *patterns* remain the reference.
- Still missing: M1's five-factor × pattern table was interactive and didn't extract. The five factors are listed in M1 *Key takeaways*: predictability, error cost, observability, latency, cost.

### G5 · Objective 3.2 — MCP authentication & authorization → **Resolved**
`[OFFICIAL ANTHROPIC DOCS — MCP specification]` <https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization> (a later 2026-07-28 revision also exists)
- Authorization is optional in MCP and applies to HTTP-based transports.
- A protected MCP server acts as an **OAuth 2.1 resource server**.
- MCP servers MUST implement **OAuth 2.0 Protected Resource Metadata (RFC 9728)** to point to the authorization server.
- Clients send the access token in the `Authorization` header on every request.
- Architect takeaways `[INFERENCE]`, combined with M2/M3:
  - user identity is established server-side, never self-asserted in the prompt;
  - tokens are scoped per server;
  - authorization of side-effecting tools stays deterministic.

### G6 · Interactive module content → **Accepted limitation**
Checkpoints, calculators (SCORM links) and click-to-reveal answers didn't extract as text. They won't be used as sources; all practice items will be original.

---

## 6. Conflicts, inconsistencies & time-sensitive claims

| # | Finding | Source | Handling |
|---|---|---|---|
| X1 | Module 1 banner reads *"Claude Certified Architect Foundations · Module 1"*, but its content and course URL are the Professional path | M1 | Treated as a template leftover; content mapped to CCAR-P |
| X2 | M1 says the family "consists of Opus, Sonnet, and Haiku" but also cites Claude Fable 5 and Sonnet 5; M1 lists Foundry models as Opus 4.8 / Sonnet 5 / Haiku 4.5; M2 trace uses `claude-sonnet-4-6` | M1, M2 | Questions will be **version-agnostic** (tier reasoning only) |
| X3 | Extended thinking: adaptive thinking + effort recommended; `budget_tokens` deprecated on 4.6 and removed on Sonnet 5 | M1 | Test the principle (enable only on a measured accuracy gap); avoid version trivia |
| X4 | Caching / Batch figures (cache read "e.g. 10%", 5-minute TTL, Batch "e.g. 50%", 100k per batch) | M2 | The modules themselves hedge these; no question will hinge on an exact rate |
| X5 | `inference_geo` supports "us" and "global"; Foundry EU residency "Coming 2026"; FedRAMP routes (C4G, Bedrock GovCloud, Vertex Assured Workloads) | M1, M2 | Teach the decision logic; flag the specifics as "verify current docs" |
| X6 | Claude Code permission modes (six; auto mode is a research preview); `stop_details` categories | M1, M3 | Conceptual questions only |
| X7 | Guide pillar "cost" vs. M2 "solution cost" | EG, M2 | Use the guide's wording |
| X8 | Building Effective Agents carries a notice that its tooling landscape has changed | Official docs | Use only for the stable pattern taxonomy |

No conflict was found between the modules and the Exam Guide on **scope**.

---

## 7. Coverage & Traceability Matrix

*Guide Section and Practice Questions columns are filled in during Phase 2 and later.*

| Domain | Obj | Weight | Source module(s) | Source section | Guide section | Practice Qs | Coverage |
|---|---|---|---|---|---|---|---|
| D1 | 1.1 | 17% | M1, M2, M4 | Decomposition; Sizing → scoping & feasibility; Discovery | TBD | TBD | Complete |
| D1 | 1.2 | 17% | M1, M2, M4 + Docs | Reference Architectures; Observability; Feedback loop; Building Effective Agents | TBD | TBD | Complete (docs-supplemented) |
| D1 | 1.3 | 17% | M1 + Docs | Pattern Selection; Building Effective Agents | TBD | TBD | Complete (docs-supplemented) |
| D1 | 1.4 | 17% | M1, M2 | Multi-agent systems; Failure modes by architecture | TBD | TBD | Complete |
| D1 | 1.5 | 17% | M1, M2 | Decomposition; fan-out; scoping | TBD | TBD | Complete |
| D1 | 1.6 | 17% | M2, M4 | Business value & ROI; Outcome document | TBD | TBD | Complete |
| D2 | 2.1 | 13% | M1 | Model & Context Strategy; Opus 7× case | TBD | TBD | Complete |
| D2 | 2.2 | 13% | M1, M3 | Prompting as Architecture; Guardrails | TBD | TBD | Complete |
| D2 | 2.3 | 13% | M1 | Prompt engineering techniques across models | TBD | TBD | Complete |
| D2 | 2.4 | 13% | M1, M2 | Working memory; Context strategy; Sizing | TBD | TBD | Complete |
| D2 | 2.5 | 13% | M1, M2, M5 | Caching / modular prompts / Skills; Skills as integration; Skills distribution | TBD | TBD | Complete |
| D3 | 3.1 | 19% | M2, M1 | Least-privilege tool configuration | TBD | TBD | Complete |
| D3 | 3.2 | 19% | M2, M3 + Docs | Identity & authorization; Tool-call authorization; MCP auth spec | TBD | TBD | Complete (docs-supplemented) |
| D3 | 3.3 | 19% | M1, M2, M4 | Extended thinking; calculators; trade-off map | TBD | TBD | Complete |
| D3 | 3.4 | 19% | M2 | Observability at scale | TBD | TBD | Complete |
| D3 | 3.5 | 19% | M1 | RAG Pipeline Design | TBD | TBD | Complete |
| D3 | 3.6 | 19% | M1, M2 | Indexing; retrieval vs. live state | TBD | TBD | Complete |
| D3 | 3.7 | 19% | M1, M2 + Docs | Build-time interfaces; entry points; multi-agent research system | TBD | TBD | **Partial (G1)** |
| D3 | 3.8 | 19% | M1 + Docs | Context-strategy spectrum; tool search tool; Skills progressive disclosure | TBD | TBD | Complete (docs-supplemented) |
| D4 | 4.1 | 16% | M2 | Success criteria; evaluation-framework exercise | TBD | TBD | Complete |
| D4 | 4.2 | 16% | M2 | Eval workflow; grading ladder; judge calibration | TBD | TBD | Complete |
| D4 | 4.3 | 16% | M2 | A/B testing; shadow testing | TBD | TBD | Complete |
| D4 | 4.4 | 16% | M2, M5 | Failure taxonomy; symptom → cause | TBD | TBD | Complete |
| D4 | 4.5 | 16% | M1, M2 | Per-step routing case; caching; Batch | TBD | TBD | Complete |
| D4 | 4.6 | 16% | M2, M4, M5 | Observability; governance table; telemetry | TBD | TBD | Complete |
| D5 | 5.1 | 14% | M3 | Alignment; guardrail placement; Skill supply chain | TBD | TBD | Complete |
| D5 | 5.2 | 14% | M3, M1, M2 | Risk categories; four properties; failure modes | TBD | TBD | Complete |
| D5 | 5.3 | 14% | M3, M1 | Review routing; HITL checkpoints | TBD | TBD | Complete |
| D5 | 5.4 | 14% | M1, M2, M3 | Regulated constraints; constraint matrix; control register | TBD | TBD | Complete (verify X5) |
| D5 | 5.5 | 14% | M3, M1 | Fairness; bias in prompts | TBD | TBD | Complete |
| D6 | 6.1 | 14% | M4 | Discovery | TBD | TBD | Complete |
| D6 | 6.2 | 14% | M4 | Trade-offs (partner-track demo content optional) | TBD | TBD | Complete |
| D6 | 6.3 | 14% | M4 | Feedback loop & SLA | TBD | TBD | Complete |
| D6 | 6.4 | 14% | M4, M5 | Documentation; outcome document; runbooks | TBD | TBD | Complete |
| D6 | 6.5 | 14% | M4, M2 | Lifecycle; POC → production | TBD | TBD | Complete |
| D7 | 7.1 | 7% | M5, M1 | Team tooling config; Claude Code layers | TBD | TBD | Complete |
| D7 | 7.2 | 7% | M5 | Developer workflows | TBD | TBD | Complete |
| D7 | 7.3 | 7% | M5 | Operational support | TBD | TBD | Complete |

---

## 8. Phase-1 quality gate

- [x] Every official CCAR-P domain represented (7 of 7)
- [x] Every official objective represented (38 of 38)
- [x] Every objective maps to source material
- [x] Domain weights match the Exam Guide (17 / 13 / 19 / 16 / 14 / 14 / 7)
- [x] No CCAR-F domain or objective used (CCAR-F screenshots used for UX only)
- [x] Unsupported or derived claims labelled `[INFERENCE]` or flagged as a source gap
- [x] Study thresholds declared as non-official
- [ ] Practice / mock distribution, per-option explanations, glossary consistency (Phase 2+)

---

## 9. Reference-trainer UX analysis (CCAR-F screenshots → CCAR-P design)

The screenshots show the CCAR-F trainer as a static site served from GitHub Pages, with left navigation **Home · Practise · Mock exam · Podcast · Glossary · Progress**. Features observed, and how each adapts to CCAR-P:

| Screen | Observed in CCAR-F | CCAR-P adaptation |
|---|---|---|
| Home | Hero with three CTAs (Start practising / Listen / Take a mock); "Welcome back" stats; stat strip (Items 60 · 120 min · 720/1000 · 5 domains · 6 scenarios in pool); "What's inside" cards | Strip becomes **63 items · 120 min · scaled 720 / 1,000 · 7 domains**. **Drop "scenarios in pool"**: the CCAR-P guide does not describe a scenario pool. Add *Review weak areas* and *Continue learning* CTAs (project brief) |
| Practise | Domain cards with weight, seen-count and % correct; multi-select; question-count and focus selector ("Smart mix (new, then weak)"); resumable session; coaching panel on wrong answers | Seven domain cards plus an objective filter and difficulty filter. Focus modes: Smart Mix · New · Weak Areas · Incorrect Previously · Domain Focus · Objective Focus |
| Mock exam | Blueprint weights and item counts; "Coach me as I go" toggle; pause and resume | 63 items at 11/8/12/10/9/9/4; Timed / Untimed; Coach / Exam mode (no answers until finish); support multiple-response items |
| Podcast / Learn | One episode per domain, one part per task statement; audio player, speed, read-along transcript; "Test me on this" per part | 7 episodes × 38 parts; narration via browser text-to-speech (no audio hosting needed `[INFERENCE]`); 3-question check per part |
| Glossary | Search; "By topic" / A–Z; "Across the course" group (terms in 3+ domains); grouping by domain → task statement with term counts | Same structure over 7 domains and 38 objectives; filters by domain and objective |
| Progress | Seen / answered / accuracy / last mock; per-domain bars against a 75% line; explanatory note on the scaled score; "Saved in this browser only" + "Move progress to another computer" | Same, plus objective readiness and READY / REVIEW / REPAIR / NOT STARTED; Repair-First ranking (weakness × weight × prerequisite); export/import progress JSON |

Branding: the screenshots carry a third-party company logo and an "INTERNAL" badge. The CCAR-P trainer will use neutral, original branding unless you specify otherwise.

---

## 10. Hosting check

- Repository `rajeevpsd/CCAR-P`: clone ✔ · push ✔ · admin ✔ · public ✔ · default branch `main`
- **GitHub Pages:** the build session cannot enable or inspect Pages settings (that API path is blocked from here). To host the trainer like the CCAR-F reference, the repo owner needs one manual step: **Settings → Pages → Source: "GitHub Actions"** (or "Deploy from branch: main /docs"). Because the repo is public, the published site will be public.
