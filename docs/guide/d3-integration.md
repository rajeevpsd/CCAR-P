---
domain_id: D3
domain_name: Integration
weight: 19
priority: Critical
modules: [M1, M2, M3]
---

# Domain 3 – Integration

**Weight:** 19% `[EXAM GUIDE]` · **About 12 of 63 items** `[INFERENCE]` · **Study priority:** HIGH PRIORITY / Critical
**Mapped modules:** M1 (Build-time interfaces, RAG Pipeline Design, Model & Context Strategy) · M2 (Integration, Observability, Calculators) · M3 (Tool-call authorization)

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 3.1 | Evaluate tool/agent configuration for capability bloat |
| 3.2 | Analyze authentication and authorization requirements to identify security gaps |
| 3.3 | Evaluate accuracy-latency trade-offs and justify configuration decisions |
| 3.4 | Analyze observability challenges and select monitoring strategies at scale |
| 3.5 | Design a RAG pipeline with appropriate chunking and indexing strategies |
| 3.6 | Apply retrieval strategies matched to data shape and query pattern |
| 3.7 | Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent) |
| 3.8 | Evaluate progressive discovery vs. monolithic context strategy |

---

### Objective 3.1 – Evaluate tool/agent configuration for capability bloat

#### What you need to know
Every tool you connect to Claude is both an **attack surface and a cost**. For each tool, ask whether it is *essential* to the task or merely *convenient*. Remove anything out of scope and record why. In orchestrator-worker systems, scope each subagent's tools to its own task so it cannot reach tools its job doesn't need. `[MODULE 2 – Least-privilege tool configuration]`
An agent "can do anything its tools allow, including combinations you didn't test for", so the tool surface should be as narrow as the task allows. `[MODULE 1 – Pattern Selection, Cost·Complexity·Risk]`
"Capability bloat" is the exam's name for this problem; the modules describe it as excess tools or permissions. `[INFERENCE]`

#### Why it matters
Least privilege removes risk at the source. Logging, confirmation prompts and bigger models only *compensate* for risk that is still there. A bloated tool set also uses context tokens on every call and makes it harder for the model to pick the right tool. `[EXAM GUIDE – Sample 1 rationale]` `[INFERENCE]`

#### Architecture concepts
- **Components:** tool definitions, the agent/subagent configuration, and the authorization layer.
- **Pattern:** least-privilege tool configuration plus a trust hierarchy (orchestrator → scoped subagents). `[MODULE 2]`
- **Security:** an unused side-effecting tool (refund, delete, send) is pure liability. `[EXAM GUIDE Sample 1]`
- **Lifecycle:** re-audit tool sets when the role or task changes. Record why each tool was removed. `[MODULE 2]`
- **Related:** deferred tool loading (3.8) reduces *context* cost for large catalogues, but does **not** reduce *permissions*. `[OFFICIAL ANTHROPIC DOCS – tool search tool]` `[INFERENCE]`

#### How it works
1. List every tool and permission available to each agent or subagent.
2. Map each one to a task the role actually performs.
3. Classify each as essential, convenient or out of scope.
4. Remove the out-of-scope ones entirely and write down why.
5. Scope each subagent to its own task (read-only where possible).
6. Put deterministic authorization in front of whatever side-effecting tools remain (5.1).

#### Architecture example
REAL-WORLD EXAMPLE – A support agent has `read_ticket`, `draft_reply`, `issue_refund` and `delete_account`. Support staff only read and draft. The right change is to **remove** `issue_refund` and `delete_account` from that agent. Refunds go to a separate, human-approved workflow. `[EXAM GUIDE Sample 1]`

#### Decision framework
| Question | Answer |
|---|---|
| When to use | Always: during design review, before production, and whenever a role changes |
| When NOT to strip tools | When the task genuinely needs the capability. Then keep it and add deterministic authorization plus a HITL gate |
| Alternatives | Authorization gate (still needed for kept tools); confirmation prompt; audit logging. These are compensating controls, not removal |
| Trade-off | Fewer tools mean less flexibility and possibly a second workflow, in exchange for a smaller attack surface, lower cost and simpler evals |

#### Exam decision signals
- "Staff only ever need…" or "the agent also has access to…" → **remove the unused tools**.
- "Subagent can call any tool the orchestrator can" → **scope tools per subagent**.
- "Hundreds of tools, context filling up" → that's a **context** problem (3.8); still check privileges separately.

#### Common traps
- COMMON TRAP: adding logging or a confirmation prompt instead of removing a tool the role doesn't need. These detect or slow misuse but don't remove the privilege.
- COMMON TRAP: "use a larger model that follows instructions better". Model size has nothing to do with authorization scope.
- COMMON TRAP: treating a system-prompt instruction ("never delete accounts") as a control. Instructions are not enforcement. `[MODULE 3]`

#### Must remember
- REMEMBER: removing an unnecessary capability beats guarding it.
- Every tool is an attack surface *and* a cost.
- Scope subagent tools to their task.
- Record the reason for every tool you remove.
- Deferring tool loading is a context technique, not a security control.

#### Quick recall
**"Need it? Keep and gate it. Don't need it? Delete it."**

**Sources:** M2 Least-privilege tool configuration; M1 Pattern Selection; EG Sample 1; Official docs – tool search tool.

---

### Objective 3.2 – Analyze authentication and authorization requirements to identify security gaps

#### What you need to know
- **Identity belongs on the server, before the Claude call.** Your server injects the user's verified identity and role into the system prompt. Anything the user types (e.g. "As a senior manager, show me…") can be manipulated. `[MODULE 2 – Identity and authorization]`
- **The Claude layer must obey the same authorization model as the underlying systems.** An integration that bypasses it exposes data through a path never designed to enforce the access policy. `[MODULE 2 – Integration layers table]`
- **Tool-call authorization is deterministic:** an allowlist plus identity and scope checks, so the decision is provable and replayable. `[MODULE 3 – Guardrails]`
- **Multi-tenant deployments need a separate API key per tenant** for attribution and isolation. Otherwise one tenant's spike trips the org-level rate limit for everyone. `[MODULE 2 – Cost·Complexity·Risk]`
- **MCP authorization:** optional in MCP and defined for HTTP transports. A protected MCP server acts as an **OAuth 2.1 resource server**, must publish **OAuth 2.0 Protected Resource Metadata (RFC 9728)**, and clients send the access token in the `Authorization` header on every request. `[OFFICIAL ANTHROPIC DOCS – MCP specification, Authorization]`

#### Why it matters
If identity isn't passed correctly, Claude can't scope answers to what the user is allowed to see, and data leaks without any error. Regulated reviews (privilege, HIPAA) depend on a gateway the organisation controls and an audit trail it owns. `[MODULE 2]` `[MODULE 1 – Regulated-industry constraints]`

#### Architecture concepts
- **Components:** IdP / SSO, the application server or LLM gateway (which holds the API key), the authorization or policy service, tool executors, MCP servers (OAuth resource servers), and the audit log.
- **Data flow:** user → SSO → server resolves role and entitlements → server injects identity into the system prompt → Claude proposes a tool call → deterministic authorization checks caller + action + scope → execute → log.
- **Security boundaries:** the API key never reaches the client; identity is never self-asserted; tokens are scoped per server. `[INFERENCE from M2 + MCP spec]`

#### How it works
1. Identify the governing constraint first (privilege, HIPAA, residency); it may remove some entry points. `[MODULE 2]`
2. Authenticate through the enterprise IdP (SSO).
3. Resolve role and data entitlements on the server.
4. Inject only the minimum identity context Claude needs (role and authorised scope).
5. Run every side-effecting tool call through a deterministic allowlist plus scope check.
6. For remote MCP servers, use OAuth 2.1 and tokens scoped to that server.
7. Use one API key per tenant; log identity, model version and data scope on each request.

#### Architecture example
REAL-WORLD EXAMPLE – A multi-tenant SaaS support agent was found with: (a) the user's role taken from a chat field, (b) one shared API key for all tenants, (c) a CRM tool that queries any tenant's records. The fixes: role injected server-side from SSO; one API key per tenant; the CRM tool scoped to the authenticated tenant ID by the authorization layer rather than by the prompt. `[MODULE 2 – Critique the integration diagram (scenario style)]` `[INFERENCE]`

#### Decision framework
| Situation | Use | Avoid |
|---|---|---|
| User role affects what data Claude may see | Server-side identity injection | Role stated in the user message |
| Side-effecting tool | Deterministic allowlist + identity + scope | Model-based "judgement" of permission |
| Remote MCP server with non-public data | OAuth 2.1 resource-server pattern | Static shared secrets in config |
| Multi-tenant | One API key per tenant | One shared org key |
| Privileged or regulated content | API/SDK behind an org-owned gateway with SSO and logs | Consumer chat tiers |

#### Exam decision signals
- "User states their role / department in the prompt" → **identity spoofing gap**; inject server-side.
- "Rate-limit breach, can't tell which customer" → **per-tenant API keys**.
- "Claude can see records the user can't" → **authorization bypass**; enforce the existing policy model.
- "Remote MCP server, enterprise data" → **OAuth 2.1 / RFC 9728**.

#### Common traps
- COMMON TRAP: telling Claude in the system prompt to "only show the user's own data". That's an instruction, not authorization.
- COMMON TRAP: treating authentication (who you are) as authorization (what you may do).
- COMMON TRAP: relying on output screening to catch unauthorised actions. Output screening judges text, not actions. `[MODULE 3]`

#### Must remember
- Identity is injected by the server, never claimed by the user.
- The Claude layer inherits the existing authorization model; it doesn't bypass it.
- Tool authorization is deterministic and auditable.
- Use one API key per tenant.
- An MCP server is an OAuth 2.1 resource server (RFC 9728 metadata).

#### Quick recall
**"Who (SSO) → What role (server) → What action (allowlist) → Logged."**

**Sources:** M2 Integration – Identity and authorization, Integration layers, Constraint-to-integration matrix; M3 Tool-call authorization; MCP Authorization spec.

---

### Objective 3.3 – Evaluate accuracy-latency trade-offs and justify configuration decisions

#### What you need to know
The main configuration levers and their effects:
- **Model tier:** Sonnet is the default. Move up to Opus only if an eval shows Sonnet misses the quality bar; move down to Haiku only if an eval confirms the quality loss is acceptable. `[MODULE 1]`
- **Extended / adaptive thinking:** thinking tokens are billed as output and add latency. Turn it on only for a measured accuracy gap after prompt work. `[MODULE 1]`
- **Context strategy and size:** cost and latency grow linearly with input length. `[MODULE 1]`
- **Retrieval design:** smaller chunks and hybrid indexes raise quality *and* latency. `[MODULE 1 – RAG]`
- **`max_tokens` cap, caching, Batch API** (when the SLA allows async processing). `[MODULE 2]`

Design against **p95, not the median**. SLA breaches come from the slow tail. `[MODULE 2]`
When cost and latency budgets both apply, **name the binding constraint**: if latency is binding, tier and thinking are the main controls; if cost is binding, tier and context strategy are. `[MODULE 1 – Calculator model answer]`

#### Why it matters
Defaulting to "the best model" with thinking turned on everywhere caused a 7× cost overrun and 2.3 s median latency against an 800 ms target, with no gain in customer satisfaction. Routing each step to a tier based on evals cut cost by 71%. `[MODULE 1 – Opus-everywhere case]`

#### Architecture concepts
- Per-step model routing (classifier → Haiku, summarisation → Sonnet, final composition → Opus, each only if the eval supports it).
- Eval set + pre-set rollback threshold as the justification artefact.
- Latency budget (p95) and cost ceiling as twin constraints.

#### How it works
1. State the accuracy threshold, p95 latency target and cost ceiling (the numbers come from the business).
2. Build an eval set that covers each pipeline step.
3. Run a baseline (Sonnet, no thinking, progressive context).
4. Change **one lever at a time**; measure accuracy, p95 and cost.
5. Identify the binding constraint and the lever that moves it.
6. Document the configuration, the rejected alternatives and the rollback criterion.

#### Architecture example
REAL-WORLD EXAMPLE – A routing classifier had extended thinking turned on. The eval showed no accuracy gain, but p95 rose a lot. The fix: thinking off and the classifier moved to Haiku (no regression on the eval). The higher tier stays only on the final response step, where the eval says it earns its place. `[MODULE 1]`

#### Decision framework
| Lever | Raises accuracy when… | Costs | Don't use when… |
|---|---|---|---|
| Higher tier | Eval shows a quality gap | Cost and latency | Simple classification or extraction already passes |
| Thinking | Multi-step reasoning gap after prompt work | Output tokens and latency | Routing or classification steps |
| Bigger context | Task needs all the material at once | Linear cost and latency; attention degrades | Long multi-turn loops |
| Hybrid retrieval / small chunks | Exact-match queries are being missed | Latency and compute | Pure paraphrase queries |

#### Exam decision signals
- "Latency target missed, accuracy fine" → lower the tier or turn off thinking on that step.
- "Used the best model to be safe" → **per-step tiering justified by evals**.
- "Median is fine, users complain" → look at **p95**.

#### Common traps
- COMMON TRAP: "turn on thinking, it can't hurt". It costs tokens and latency on every call.
- COMMON TRAP: one model for every step.
- COMMON TRAP: justifying a configuration from a demo rather than an eval.
- COMMON TRAP: optimising average latency instead of p95.

#### Must remember
- Sonnet first; moving tier is a measured decision.
- Thinking is a cost/latency trade-off; turn it on only when an eval shows it helps.
- p95 is the design target.
- Name the binding constraint and its main lever.
- Not choosing a model means choosing the most expensive one.

#### Quick recall
**"Measure → one lever → re-measure → justify."**

**Sources:** M1 Model & Context Strategy, extended thinking, Opus 7× case, Calculator; M2 POC to Prod, p95, Calculator.

---

### Objective 3.4 – Analyze observability challenges and select monitoring strategies at scale

#### What you need to know
LLM systems rarely crash. They produce responses that are **subtly wrong**, so standard error logging misses most failures. `[MODULE 2]`
**Log four things per request:**
- the request: model version, input tokens, prompt ID;
- the response: output tokens, latency, stop reason;
- the context: user role, session ID, whether the cache was hit;
- the outcome: accepted or rejected downstream. `[MODULE 2]`

**Monitor in four layers** `[MODULE 2 – Observability at scale]`:
1. **Request-level tracing**, including tool calls.
2. **Metric aggregation:** cost per request, p50/p95, task success, errors by type. Break metrics down per request, because averages hide expensive tails.
3. **Anomaly detection:** e.g. cost above 150% of the 7-day average, p95 above SLA. Gradual drift needs periodic comparison of output distributions.
4. **Change attribution:** model drift vs. data drift vs. model-update effect. Each has a different fix.

Multi-agent systems need a **shared trace ID** across the orchestrator and subagents. `[MODULE 1]`
Check which agent actions each surface writes to its audit log. An action that isn't logged can't be approved by a security reviewer. `[MODULE 2]`

#### Why it matters
Observability is a prerequisite for letting agents act at all. Adding it after an incident means rebuilding the root cause from data that can't answer the question. `[MODULE 2]`

#### Architecture concepts
Trace pipeline → metrics store → dashboards and alerts → attribution analysis → a translation layer to business KPIs (e.g. task success → first-contact resolution). `[MODULE 2]` Lifecycle: build it at design time.

#### How it works
1. List the questions you'll need to answer after an incident.
2. Instrument request, response, context and outcome on every call.
3. Propagate a trace ID across agents and tools.
4. Aggregate per request and per segment, not only overall.
5. Set threshold alerts plus periodic distribution checks for drift.
6. Pin model versions so you can attribute changes. `[MODULE 2 – Model version pinning]`
7. Map technical metrics to the sponsor's KPIs.

#### Architecture example
REAL-WORLD EXAMPLE – Dashboards were green while a small share of very long documents used most of the budget and produced wrong outputs. Per-request breakdown by input-length bucket exposed it; aggregate metrics never would have. `[MODULE 2]`

#### Decision framework
| Need | Strategy |
|---|---|
| Hard failures (errors, timeouts) | Threshold alerts |
| Slow quality erosion | Periodic eval or distribution comparison; trigger in the feedback loop (6.3) |
| "Why did cost jump?" | Per-request decomposition: tier, cache hits, token counts |
| Multi-agent debugging | Shared trace ID, subagent coverage checks |
| Exec reporting | KPI translation layer |
Trade-off: richer logs add storage and sensitive-data exposure (minimise PII, 5.4).

#### Exam decision signals
- "No errors but users say answers are worse" → drift detection and attribution.
- "Can't reconstruct which step approved X" → trace and audit logging.
- "Aggregate looks fine" → per-request decomposition.

#### Common traps
- COMMON TRAP: relying on error rate to catch LLM quality issues.
- COMMON TRAP: mixing up model drift, data drift and a model-version update.
- COMMON TRAP: logging raw PII "for observability".

#### Must remember
- LLMs fail quietly; instrument the outcome.
- Log request, response, context and outcome.
- Decompose per request; averages lie.
- Attribute changes before you fix them.
- Shared trace ID across agents.

#### Quick recall
**"Trace → Aggregate → Alert → Attribute → Translate."**

**Sources:** M2 Integration – Observability; M2 A/B & Obs – Observability at scale; M1 Multi-agent failure table.

---

### Objective 3.5 – Design a RAG pipeline with appropriate chunking and indexing strategies

#### What you need to know
Choose the **chunking** strategy from the *structure of the source*, and the **index** from *how users phrase queries*. `[MODULE 1 – RAG Pipeline Design]`

| Chunking | Use when |
|---|---|
| Fixed-size (with overlap) | Homogeneous, unstructured text; simplest to run |
| Semantic | Prose where each chunk must stand alone |
| Hierarchical | Contracts, manuals, policies where section context carries meaning |

| Index | Matches | Use when |
|---|---|---|
| Dense (embeddings) | Meaning | Queries are paraphrased |
| Sparse (BM25, keyword) | Exact tokens | Part numbers, statute citations, error codes |
| Hybrid + **Reciprocal Rank Fusion** | Both | Mixed query patterns (the common production case) |

Every design trades **retrieval quality vs. latency vs. maintenance**. `[MODULE 1]`

#### Why it matters
Retrieval quality is invisible in the output. A confident answer built on the wrong chunk looks the same as a correct one, so you have to measure retrieval against a labelled set. `[MODULE 1]`

#### Architecture concepts
Ingestion → parsing (OCR where needed) → chunking → embedding / sparse indexing → retrieval → (fusion) → context assembly → generation with citations → eval loop on retrieval precision/recall. `[MODULE 1]` `[MODULE 2 – RAG failure modes]`
Lifecycle: re-index when documents change; keep embeddings matched to the query encoder. `[EXAM GUIDE Sample 3]`

#### How it works
1. Characterise the corpus: structure, size, how often it changes.
2. Characterise queries: paraphrase vs. exact identifiers.
3. Pick the chunking strategy (respect tables, code blocks and section boundaries).
4. Pick dense, sparse or hybrid; fuse with RRF if hybrid.
5. Build a labelled retrieval eval set; measure precision and recall.
6. Set a refresh / re-index schedule and monitor retrieval drift.

#### Architecture example
REAL-WORLD EXAMPLE – A regulatory Q&A system over statutes. Queries cite section numbers ("§ 4.2(b)") and also ask conceptual questions. Use hierarchical chunking by section, a hybrid index (BM25 for citations plus embeddings for concepts) and RRF. Precision on the citation-heavy part of the eval jumped once sparse retrieval was added. `[INFERENCE – applies M1 rules]`

#### Decision framework
| Use A when… | Use B when… |
|---|---|
| **Dense**: paraphrase/intent queries | **Sparse**: identifier/code queries |
| **Small chunks**: precise facts | **Larger / hierarchical chunks**: context-heavy reasoning |
| Avoid dense-only when exact matches matter. Avoid tiny chunks that split tables or arguments. | |

#### Exam decision signals
- "Misses part numbers / error codes" → **add sparse (hybrid)**.
- "Answers lose clause context" → **hierarchical chunking**.
- "Wrong after a document refresh" → **re-indexing / embedding mismatch** (EG Sample 3).

#### Common traps
- COMMON TRAP: one default chunk size for every corpus.
- COMMON TRAP: fixing a retrieval problem by switching to a bigger model.
- COMMON TRAP: judging RAG only on final-answer quality, without retrieval metrics.

#### Must remember
- Chunk by structure; index by query pattern.
- Hybrid + RRF is the safe default for mixed queries.
- Measure retrieval separately from generation.
- A pipeline that was correct at launch can degrade silently as the corpus grows.

#### Quick recall
**"Shape → Chunk · Query → Index · Measure → Recall."**

**Sources:** M1 RAG Pipeline Design; M2 Failure modes (RAG); EG Sample 3.

---

### Objective 3.6 – Apply retrieval strategies matched to data shape and query pattern

#### What you need to know
**Retrieval is for stable knowledge. Tool calls are for live state.** `[MODULE 1]`
- **Stable knowledge** (FAQs, policies, manuals) changes slower than your index refresh → **RAG**.
- **Live state** (order status, inventory, balances) is owned by a system of record → **a tool or API call**.
- **Persistent application state** belongs to your system, not the model → tool call. `[MODULE 1 – Distinct terms]`
- Use **monolithic context** when the material is small and stable; use **retrieval** when the corpus is too large or changes faster than redeployments. `[MODULE 1]`

#### Why it matters
Retrieval applied to live state returns confident, fluent, wrong answers with normal latency and no errors. "Similarity is not truth." `[MODULE 1 – electronics retailer trace]`

#### Architecture concepts
Context engineering means deciding *which mechanism owns getting each kind of data in front of the model*. Typical layout: an intent router → knowledge retrieval (docs) / transactional API (live state) / human approval (high-consequence). `[MODULE 1 – Customer-service reference architecture]`

#### How it works
1. Classify each data type: stable reference, live transactional, user/session state, or computed values.
2. Stable → retrieval; live → tool call to the system of record; computed precision → code execution or deterministic service.
3. Route by intent.
4. Keep live-state queries out of the index entirely.
5. Evaluate each path with its own eval set. `[MODULE 1 – separate eval contract per architecture]`

#### Architecture example
REAL-WORLD EXAMPLE – "Where's my order?" pulled two stale chunks (similarity 0.78 and 0.74) and answered "shipped on the 12th". The order had actually been returned to the depot. The fix was not a better chunker or a shorter refresh interval. It was **calling the order-status API**, which already existed. `[MODULE 1]`

#### Decision framework
| Data | Mechanism | Avoid |
|---|---|---|
| Manual / policy | RAG (with citations) | Fine-tuning it into the model |
| Order / inventory / price | Tool call to the system of record | Indexing snapshots |
| Arithmetic / exact totals | Code execution / deterministic service | Model mental math |
| Small, stable, always-needed | Monolithic prefix + caching | Retrieval overhead |

#### Exam decision signals
- "Answer contradicts the database" / "changes with each index refresh" → **use a tool call, not RAG**.
- "Needs source citations, large corpus" → **RAG**.
- "Tiny stable policy in every request" → **cache the prefix**, no retrieval.

#### Common traps
- COMMON TRAP: shortening the re-index interval to "fix" live-state staleness.
- COMMON TRAP: raising the similarity threshold.
- COMMON TRAP: reusing RAG because "it worked on the last project".

#### Must remember
- Retrieval = knowledge; tools = state.
- Similarity ≠ truth.
- A stale but confident answer gives no error signal.
- Separate evals per mechanism.

#### Quick recall
**"Was true yesterday and will be tomorrow → retrieve. Changes on its own → call the owner."**

**Sources:** M1 Reference Architectures, "When retrieval got reached for instead of a tool call", Model & Context – distinct terms.

---

### Objective 3.7 – Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent)

#### What you need to know
| Mechanism | What it is | Pick it when |
|---|---|---|
| **Direct API** | HTTP Messages API; the foundation layer | You need full control, or the SDK doesn't expose a new feature yet `[MODULE 1]` |
| **SDK** (Python, TS, Java, Go, Ruby, C#, PHP) | Same capability with language-native types, retries and streaming helpers | Default for embedding Claude in a product `[MODULE 1]` |
| **MCP** | Open protocol for *sharing* tools, prompts and resources across clients | The **same** tool surface must be reachable from **two or more** Claude clients `[MODULE 1]` |
| **Agent SDK** | Managed agent loop (the same one that powers Claude Code), embedded in your app | Claude must act over multiple turns inside *your* product `[MODULE 1, 2]` |
| **Claude Code (CLI/IDE)** | Agentic coding tool | The user is a developer doing engineering work; not a backend for multi-tenant products `[MODULE 2]` |
| **Agent-to-agent** | Delegation between independently owned agents | Source gap – see below |

**MCP vs. API tool use** are different layers, not alternatives: an MCP server exposes tools that clients call through API tool use. `[MODULE 1]`
**Agent-to-agent:** Anthropic's own multi-agent research system uses an orchestrator-worker design with parallel subagents, which costs about 15× the tokens of chat and suits poorly when agents need shared context or have many dependencies. `[OFFICIAL ANTHROPIC DOCS – multi-agent research system]` The A2A protocol is an open protocol announced by Google and positioned as complementary to MCP (external source, not Anthropic). Source gap – verification required: no official Anthropic guidance on agent-to-agent protocols was found.

#### Why it matters
The most common integration mistakes are reaching for Claude Code for non-engineering work and treating MCP as the default integration layer whether or not its reuse is needed. `[MODULE 1]`

#### Architecture concepts
Three layers that must not be collapsed: **entry point** (chosen for the user), **build-time interface** (chosen for the engineering team), **delivery route** (chosen for cloud commitments and compliance). `[MODULE 1 – Platform Map]` Each integration boundary has its own auth, logging and failure profile. `[MODULE 4]`

#### How it works
1. Name the user and the work (this decides the entry point).
2. Let compliance eliminate routes and entry points first.
3. Single request/response → API or SDK.
4. Multi-turn agent inside your product → Agent SDK (or a custom API loop if you need control between turns).
5. Tool surface reused by several clients → MCP.
6. Delegation to agents you don't own or control → evaluate an agent-to-agent protocol `[INFERENCE]`.
7. Document an entry-point-responsibility map. `[MODULE 4]`

#### Architecture example
REAL-WORLD EXAMPLE – A bank proposed Claude Code on branch laptops with MCP servers and compliance-checking subagents. The right design is a custom web app calling the API with SSO, compliance in deterministic server-side code, and tool calls audited at the server. MCP isn't needed because no other Claude clients reuse the tools. `[MODULE 1]`

#### Decision framework
| Use MCP when… | Use direct tool use when… |
|---|---|
| Two or more clients need the same tools | Tools live inside one product |
| **Avoid MCP** when only one client ever uses it (overhead, harder debugging `[MODULE 2]`) | **Avoid** duplicating tool code across clients |
| **Agent SDK** when you want a managed multi-turn loop | **Raw API loop** when you need custom logic between turns |

#### Exam decision signals
- "Same tools from Claude.ai, Claude Code and an internal app" → **MCP**.
- "Non-technical staff, operational workflow" → **not Claude Code**; custom app on API/SDK.
- "Agent embedded in our web app acting over several turns" → **Agent SDK**.
- "Partner organisation's agent built on another framework" → **agent-to-agent protocol** `[INFERENCE]`.

#### Common traps
- COMMON TRAP: "It's all Claude" – picking an entry point before naming the user.
- COMMON TRAP: MCP by habit.
- COMMON TRAP: confusing the Anthropic SDK (a wrapper) with the Agent SDK (a managed loop).
- COMMON TRAP: putting high-consequence compliance logic in subagents instead of deterministic code.

#### Must remember
- API and SDK are the same entry point with different ergonomics.
- MCP = sharing across clients; tool use = calling inside one request.
- Agent SDK = an embedded managed loop.
- Claude Code = developers.
- The entry point follows the user and the work.

#### Quick recall
**"One call → API/SDK · Many clients → MCP · Many turns in my app → Agent SDK · Dev work → Claude Code."**

**Sources:** M1 Platform Map, Build-time interfaces, bank case; M2 Entry points table; M4 entry-point-responsibility map; Official: multi-agent research system; External: Google A2A announcement.

---

### Objective 3.8 – Evaluate progressive discovery vs. monolithic context strategy

#### What you need to know
**Context strategies** `[MODULE 1]`:
| Strategy | Earns its place | Breaks down |
|---|---|---|
| **Monolithic** (load everything at once) | Bounded tasks, stable prefixes (cacheable), reasoning that needs everything at once | Context grows turn over turn; cost and latency scale linearly; hits the "working-memory cliff" |
| **Progressive** (carry forward only what the next step needs) | Multi-turn dialogue, agent loops, staged workflows; *the default for most production* | Long-range coherence; detail dropped earlier; harder to cache and reproduce |
| **Retrieval** | Corpus too large or changes too fast | Cross-document synthesis, recall misses |
| **Compaction** | Long sessions; phase transitions | Summaries drop identifiers and numbers; mostly one-way |

Production systems **combine** strategies (e.g. a coding agent: monolithic prefix → progressive recent state → just-in-time retrieval → compaction). `[MODULE 1]`

**Progressive discovery of capabilities** `[OFFICIAL ANTHROPIC DOCS]`:
- **Tool search tool:** mark tools `defer_loading: true`, and Claude searches the catalogue and loads only what it needs. You still send full definitions; `defer_loading` controls what enters context. Keep the 3–5 most-used tools non-deferred; never defer the search tool itself. MCP toolsets can defer a whole server.
- **Agent Skills progressive disclosure:** only metadata is visible up front; SKILL.md and referenced files load when needed.

#### Why it matters
Monolithic context is "the silent budget killer": a 4,000-token start can carry 80,000 tokens by turn 30. Large tool catalogues use context before any work happens. `[MODULE 1]` `[OFFICIAL ANTHROPIC DOCS]`

#### Architecture concepts
Ask four separate questions: what's needed at the start (monolithic baseline), from recent steps (progressive window), on demand (retrieval or tool search), and what can be compressed (compaction policy). Context *strategy* and context *sizing* are separate decisions. `[MODULE 1]`

#### How it works
1. Budget the window: largest realistic conversation + retrieved context + system prompt + scratch + margin. Never design to the ceiling.
2. Put stable content first (cacheable prefix).
3. Carry forward only state the next step needs.
4. Fetch large or volatile knowledge just in time.
5. Defer rarely used tools or Skills; keep the hot ones loaded.
6. Compact at phase boundaries; keep identifiers and decisions verbatim.
7. Check the response's usage field and the token-counting API. `[MODULE 1]`

#### Architecture example
REAL-WORLD EXAMPLE – An internal agent connected to 6 MCP servers (~200 tools) used a large share of its context on tool definitions. Deferring the servers with tool search, keeping 4 hot tools loaded, and compacting at phase transitions cut input tokens per turn while keeping accuracy on the eval. `[INFERENCE – applies official doc guidance]`

#### Decision framework
| Use monolithic when… | Use progressive when… |
|---|---|
| Input is bounded and predictable; prefix is stable and cacheable | Context accumulates across turns or tools |
| **Avoid** in long loops | **Avoid** when the decision needs exact detail from far back (keep it pinned) |
| Key clue: "same 8k policy every call" → monolithic prefix + caching | Key clue: "context grows each turn" / "hundreds of tools" → progressive / tool search |

#### Exam decision signals
- "Cost grows with conversation length" → progressive + compaction.
- "Hundreds of tools / many MCP servers" → tool search + `defer_loading`.
- "Agent forgot an ID mentioned early" → compaction dropped detail; pin critical facts.

#### Common traps
- COMMON TRAP: thinking a bigger context window fixes accumulation.
- COMMON TRAP: compaction without preserving identifiers and numbers.
- COMMON TRAP: deferring the most-used tools (adds a search step every time).
- COMMON TRAP: treating strategy and sizing as one decision.

#### Must remember
- The context window is a ceiling, not a target.
- Progressive is the default for production; combine strategies.
- Tool search defers *context*, not definitions.
- Skills load metadata first, content on demand.

#### Quick recall
**"Start · Recent · On-demand · Compress."**

**Sources:** M1 Model & Context Strategy, working memory; Official docs – Tool search tool; Anthropic Engineering – Agent Skills.
