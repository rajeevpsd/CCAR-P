# CCAR-P Glossary

Format: each term is a `### Term` heading followed by fields. `group` is `Cross-domain` (the term matters in three or more domains) or a domain ID. Sources: the M1–M5 module glossaries and sections, plus official docs where marked. Definitions are paraphrased for revision.

## Cross-domain

### Augmented LLM
- group: Cross-domain
- objectives: 1.3, 1.2
- definition: A single model call enhanced with retrieval, tools or memory. It does one bounded job, and control flow doesn't branch on what the model decides.
- significance: The simplest pattern; the starting point before workflows or agents.
- exam: Pick it for well-defined, verifiable single-step tasks.
- confusion: Calling any tool-using call an "agent". If your code controls the flow, it isn't one.
- related: Workflow, Agent
- source: M1 Pattern Selection; Official – Building effective agents

### Agent
- group: Cross-domain
- objectives: 1.3, 1.4, 3.1
- definition: A system where the model decides its own sequence of tool calls toward a goal. The control flow lives inside the model.
- significance: Unlocks open-ended work, but its autonomy is your liability surface. It needs budgets, permission limits and stopping criteria.
- exam: Use only when the path can't be listed in advance and errors can be recovered.
- confusion: "Open-ended feeling" isn't the same as "unenumerable steps".
- related: Workflow, Stopping criteria, Least privilege
- source: M1 Pattern Selection

### Workflow
- group: Cross-domain
- objectives: 1.3, 1.5
- definition: Steps orchestrated in your own code along predefined paths; each step may or may not call Claude.
- significance: Testable, loggable, auditable; the default when the steps are knowable.
- exam: "Auditor asks which step approved it" → workflow.
- confusion: Rebuilding a workflow inside an agent loop with guardrail tools.
- related: Prompt chaining, Routing, Evaluator-optimizer
- source: M1; Official – Building effective agents

### Eval
- group: Cross-domain
- objectives: 4.1, 4.2, 2.1, 3.5
- definition: A structured test set that pairs inputs with expected outputs or criteria and produces a score you can compare across changes.
- significance: The acceptance criteria and the gate for every model, prompt or retrieval change.
- exam: Write evals before production code, and keep them current.
- confusion: Manual spot checks aren't an eval.
- related: Golden dataset, LLM-as-judge, Delta threshold
- source: M1/M2 Glossary

### Least privilege
- group: Cross-domain
- objectives: 3.1, 3.2, 5.1, 7.1
- definition: Give each agent, subagent or user only the capabilities its task requires.
- significance: Removing a capability eliminates its risk; monitoring only compensates for it.
- exam: Remove unneeded tools rather than logging or confirming their use.
- confusion: Treating confirmation prompts as least privilege.
- related: Tool-call authorization, Capability bloat
- source: M2; EG Sample 1

### Context window
- group: Cross-domain
- objectives: 2.4, 3.8, 1.1
- definition: The model's active attention space, measured in tokens. Content outside it doesn't exist for the model, and it resets between calls.
- significance: A hard edge for both capability and billing.
- exam: Budget below the ceiling; measure tokens rather than estimating them.
- confusion: Thinking the window is a memory, or a data-governance boundary.
- related: Working memory, Progressive context, Compaction
- source: M1

### Four properties of generative AI
- group: Cross-domain
- objectives: 1.1, 5.2, 4.4
- definition: Next-token prediction, knowledge, working memory and steerability. Each is a capability paired with a limitation and a mitigation.
- significance: The lens for decomposition, feasibility and risk.
- exam: Map the symptom to the property, then to the compensating control.
- confusion: Treating the properties as flaws to fix rather than forces to design around.
- related: Feasibility verdict, Hallucination
- source: M1 How Claude Behaves; M2 Feasibility

### Human-in-the-loop (HITL)
- group: Cross-domain
- objectives: 5.3, 1.4, 1.2
- definition: A deliberate point where a person reviews or approves model output, placed by risk and reversibility.
- significance: Focuses limited reviewer attention on high-stakes decisions.
- exam: Pre-action approval for irreversible actions; sampling for low-stakes ones.
- confusion: Routing everything to review causes consent fatigue.
- related: Review routing, Consent fatigue
- source: M1; M3

### Observability
- group: Cross-domain
- objectives: 3.4, 4.6, 6.3
- definition: The ability to see what the system is doing, reconstruct why, and detect when it goes wrong.
- significance: A precondition for letting agents act; LLMs fail quietly.
- exam: Log request, response, context and outcome; use a shared trace ID across agents.
- confusion: Error-rate dashboards alone don't count as observability.
- related: Trace, Change attribution, Feedback loop
- source: M1/M2

### Prompt caching
- group: Cross-domain
- objectives: 2.5, 4.5, 3.8
- definition: Reusing a processed, stable prompt prefix across requests to cut cost and latency. The response is identical either way.
- significance: The biggest lever when a long, stable prefix is reused often.
- exam: Static content first, then the breakpoint, then dynamic content; check TTL and write cost.
- confusion: Caching answers rather than prefixes; caching rarely called prompts.
- related: Cache breakpoint, TTL
- source: M1; M2; EG Sample 2

### Live state
- group: Cross-domain
- objectives: 3.6, 1.1, 2.4
- definition: Data that changes during a conversation or process (order status, balances, inventory), owned by a system of record.
- significance: Must be fetched by a tool call, not retrieved from an index.
- exam: "Answer contradicts the database" → you need a tool call.
- confusion: Shortening the index refresh to "fix" stale live state.
- related: RAG, Tool use, System of record
- source: M1/M2 Glossary

### Tool use
- group: Cross-domain
- objectives: 3.7, 3.6, 5.1
- definition: Claude calls external functions or APIs during a response and uses the results.
- significance: Turns text generation into action, which is why side-effecting tools need authorization.
- exam: The mechanism for live state and deterministic computation.
- confusion: MCP vs. tool use. MCP shares tools across clients, and those tools are invoked through tool use.
- related: MCP, Tool-call authorization
- source: M1/M2 Glossary

### Delegation (AI Fluency)
- group: Cross-domain
- objectives: 1.5, 1.1, 5.3
- definition: The AI Fluency competency of deciding which work Claude should own, which humans keep, and which is collaborative.
- significance: Produces the delegation map.
- exam: Justify by reversibility, stakes and accountability.
- confusion: Can Claude do it vs. should Claude own it.
- related: Decomposition
- source: M1

### Description (AI Fluency)
- group: Cross-domain
- objectives: 2.2, 6.2
- definition: The AI Fluency competency of stating precisely what you want: scope, format, constraints. It applies both to prompts and to stakeholders.
- significance: Separates prompts that hold in production from demo prompts, and it's how decisions land with stakeholders.
- exam: Underspecification is the failure it prevents.
- confusion: More words isn't more description.
- related: Underspecification, Output contract
- source: M1; M4

### Discernment (AI Fluency)
- group: Cross-domain
- objectives: 4.4, 5.5
- definition: Judging output quality (acceptable, needs revision, needs override) rather than accepting it at face value.
- significance: Feeds evals and monitoring; also spots unequal treatment.
- exam: Teams without it watch metrics move without checking the outputs.
- confusion: Confirming a value was produced isn't judging whether it's right.
- related: Failure taxonomy, Fairness
- source: M2; M3

### Diligence (AI Fluency)
- group: Cross-domain
- objectives: 5.3, 7.2
- definition: Taking responsibility for verifying and vouching for AI outputs, and keeping human accountability checkpoints in place.
- significance: Becomes a verification checklist and review gates.
- exam: Watch for automation pressure eroding oversight.
- confusion: Faster shipping isn't the same as trustworthy shipping.
- related: Verification checklist, HITL
- source: M3; M5

## Domain 1 – Solution Design & Architecture

### Decomposition
- group: D1
- objectives: 1.5, 1.1
- definition: Splitting a request into what Claude does, what existing systems do and what humans do, then breaking Claude's share into steps or units.
- significance: Over-assigning to Claude is the most common and most expensive early mistake.
- exam: Assign each part to an owner before picking a pattern.
- confusion: Task decomposition vs. ownership decomposition. Both matter.
- related: Delegation, Fan-out
- source: M1

### Feasibility verdict
- group: D1
- objectives: 1.1
- definition: One of three outcomes: feasible as scoped, feasible with constraints, or not feasible. Each comes with its load-bearing constraints.
- significance: A verdict without constraints doesn't survive production.
- exam: Gather volume, input size and latency before issuing one.
- confusion: Capability isn't feasibility.
- related: Boundary conditions, Sizing
- source: M2

### Boundary conditions
- group: D1
- objectives: 1.1, 6.4
- definition: The stated conditions under which an architecture works or doesn't (e.g. documents up to N pages).
- significance: Written into the SOW so both sides know what's in scope.
- exam: An undocumented constraint becomes a production failure.
- confusion: Treating boundaries as risks to mention verbally.
- related: Feasibility verdict
- source: M2

### Reference architecture
- group: D1
- objectives: 1.2, 1.3, 3.6
- definition: A proven wiring for a recurring problem class: agent, RAG, document pipeline (evaluator-optimizer), routing/triage, coding agent.
- significance: Teams have already learned what breaks in each.
- exam: Most common misuse: retrieval applied to live state.
- confusion: Reference ≠ blueprint; adapt it to the workload.
- related: RAG, Routing
- source: M1

### Prompt chaining
- group: D1
- objectives: 1.3, 1.5
- definition: A workflow where each call processes the previous output, with programmatic gates between steps.
- significance: Predictable sequences with checkpoints.
- exam: Fixed sequence plus checks → chain.
- confusion: Chaining independent steps that could run in parallel.
- related: Workflow, Gate
- source: Official – Building effective agents

### Routing (workflow)
- group: D1
- objectives: 1.3
- definition: Classify the input, then dispatch it to a specialised downstream path, model or handler.
- significance: Separation of concerns; lets cheaper tiers handle easy cases.
- exam: Distinct categories and accurate classification.
- confusion: Building an agent for what is really four routes.
- related: Workflow
- source: Official – Building effective agents; M1

### Parallelization
- group: D1
- objectives: 1.3, 1.5
- definition: Running independent subtasks at once (sectioning) or the same task several times for confidence (voting).
- significance: Speed and confidence.
- exam: Only for independent units.
- confusion: Parallelization (subtasks fixed in advance) vs. orchestrator-workers (subtasks decided at runtime).
- related: Fan-out
- source: Official – Building effective agents

### Orchestrator-workers
- group: D1
- objectives: 1.4, 1.3
- definition: A central model decomposes work at runtime, delegates to workers or subagents, and synthesises their results.
- significance: Handles work that's too large or too varied for one context.
- exam: Subtasks not known in advance.
- confusion: Assuming coverage instead of reconciling it.
- related: Orchestrator, Subagent, Coverage check
- source: M1; M2; Official

### Evaluator-optimizer
- group: D1
- objectives: 1.3, 1.2
- definition: One step generates, another evaluates against criteria, and the loop refines.
- significance: Common in document pipelines where a first pass isn't reliable.
- exam: Clear criteria plus measurable gains from refinement.
- confusion: Using it without reliable evaluation criteria.
- related: Generator-verifier loop
- source: M1; Official

### Fan-out
- group: D1
- objectives: 1.4, 1.5
- definition: Split a large work item into independent units, dispatch one subagent per unit, then synthesise.
- significance: Clean per-unit contexts plus concurrency.
- exam: Reconcile results returned against units dispatched.
- confusion: "48 reviewed" when 50 were dispatched.
- related: Coverage check
- source: M1

### Coverage check
- group: D1
- objectives: 1.4
- definition: A synthesis rule requiring results returned to equal units dispatched, and flagging any gap.
- significance: Prevents a confident summary over incomplete work.
- exam: The fix for silently dropped subagent units.
- confusion: Assuming every subagent returns something.
- related: Fan-out
- source: M1

### Orchestrator
- group: D1
- objectives: 1.4
- definition: The agent that owns the goal; it decomposes, delegates and synthesises, but doesn't do sub-task work itself.
- significance: Its failure is often unrecoverable, so protect and checkpoint its state.
- exam: Recoverable subagent failure vs. unrecoverable orchestrator failure.
- confusion: Letting the orchestrator do the sub-task work.
- related: Subagent
- source: M1

### Subagent
- group: D1
- objectives: 1.4, 3.1, 7.1
- definition: An agent with its own context that owns one scoped sub-task and returns a structured result.
- significance: Failures are usually recoverable; tools should be scoped to the task.
- exam: Make subagent work idempotent and give it least-privilege tools.
- confusion: Putting compliance-critical checks in subagents instead of deterministic code.
- related: Orchestrator, Trust hierarchy
- source: M1; M2

### Business value pillars
- group: D1
- objectives: 1.6
- definition: Efficiency, transformation, productivity, cost (the run cost of the solution) and performance SLAs.
- significance: Keeps ROI claims in the sponsor's language.
- exam: Tag each value claim with its pillar.
- confusion: Efficiency (same work, cheaper) vs. transformation (work that wasn't possible before).
- related: ROI mapping
- source: EG; M2

### ROI mapping
- group: D1
- objectives: 1.6
- definition: Measured baseline → projected state in the same unit (including review effort) → minus run cost from sizing → payback with sensitivity.
- significance: Turns "can we build it?" into "is it worth building?".
- exam: Common traps are an estimated baseline, assuming full automation, and average-based cost.
- confusion: Build cost (counted in payback) vs. run cost.
- related: Sizing, Outcome document
- source: M2

### Fine-tuning
- group: D1
- objectives: 1.3, 2.3
- definition: Training a model variant on task data. Access is limited, and it locks you to a fixed model version.
- significance: The last step after prompting, tools and stronger patterns.
- exam: Justified only for very high volume, critical latency, or format consistency that prompting couldn't achieve.
- confusion: Reaching for it first when prompting "isn't reliable".
- related: Prompt engineering
- source: M1

## Domain 2 – Models, Prompting & Context Engineering

### Model tiers (Opus / Sonnet / Haiku)
- group: D2
- objectives: 2.1
- definition: The Claude model family, trading capability against cost and latency.
- significance: Not choosing a tier means defaulting to the most expensive one.
- exam: Start from a baseline tier (Sonnet per M1; Opus 5.5 per current docs) and move only on eval evidence, per step and per category.
- confusion: Judging a downgrade on its average score.
- related: Eval gate, Rollback criterion
- source: M1

### Rollback criterion / delta threshold
- group: D2
- objectives: 2.1, 4.2
- definition: The pass/fail line for a change, set before the eval runs.
- significance: Stops teams negotiating with themselves after seeing the data.
- exam: A partial migration can follow from per-category failures.
- confusion: Setting the threshold after the results are in.
- related: Eval
- source: M1

### Extended thinking / adaptive thinking
- group: D2
- objectives: 2.1, 3.3, 4.5
- definition: A separate reasoning pass in thinking tokens (billed as output) before the answer. On current models, adaptive thinking with output_config.effort replaces budget_tokens; Claude 4.7 and later reject manual budget_tokens with a 400.
- significance: A cost and latency trade-off.
- exam: Enable it only for a measured accuracy gap, after prompt work.
- confusion: "It can't hurt"; enabling it on classifiers.
- related: Effort parameter
- source: M1; Official docs, extended thinking (verified 2026-11-19)

### Model version pinning
- group: D2
- objectives: 2.1, 3.4, 6.5
- definition: Fixing the model version in configuration, monitoring deprecations, and keeping an update runbook.
- significance: Makes changes attributable and governed.
- exam: An unpinned version that rolled forward is a governance gap.
- confusion: Thinking pinning is a pattern choice. It's an operational discipline.
- related: Change attribution
- source: M2

### System prompt (enterprise)
- group: D2
- objectives: 2.2
- definition: A designed, reusable asset stating role and scope, constraints and an output contract.
- significance: Ambiguity is a defect multiplied across every request.
- exam: Underspecification produces inconsistent outputs.
- confusion: A system prompt isn't an enforcement layer.
- related: Template, Output contract
- source: M1

### Template
- group: D2
- objectives: 2.2
- definition: A prompt with parameterised slots inside fixed scaffolding that carries the safety and consistency guarantees.
- significance: Makes the safe path the default path.
- exam: Filling a slot must not remove a constraint.
- confusion: Free-form slots placed above the guardrails.
- related: System prompt
- source: M1

### Output contract
- group: D2
- objectives: 2.2, 1.2
- definition: The required shape of a response (fields, format, citations), stated in the prompt and validated afterwards.
- significance: Lets guardrails be structural rather than just prose.
- exam: Enforce "never promise X" through the format, plus screening.
- confusion: Stating rules only in the role text.
- related: Schema
- source: M1

### Underspecification
- group: D2
- objectives: 2.2, 4.4
- definition: A gap in a prompt that the model fills with its own assumption, differently each time.
- significance: The main source of variation in reused prompts.
- exam: Diagnose by asking, for each requirement, "stated or only hoped for?".
- confusion: Blaming the model tier for it.
- related: Prompt failure
- source: M1

### Zero-shot / Few-shot / Chain-of-thought
- group: D2
- objectives: 2.3
- definition: Instruction only; a handful of examples; step-by-step reasoning before the answer.
- significance: Each step up adds tokens and latency.
- exam: Start zero-shot, add examples for format, add CoT for multi-step reasoning.
- confusion: CoT everywhere; using few-shot for arithmetic precision.
- related: Technique selection
- source: M1

### Working memory
- group: D2
- objectives: 2.4, 1.1
- definition: The property describing the context window's hard edge. Things work until they abruptly don't.
- significance: Over-limit requests fail in specific, recognisable ways.
- exam: 400 means too many tokens; 413 means too many bytes; model_context_window_exceeded means generation hit the ceiling.
- confusion: Mixing up a rejected request with a mid-generation stop.
- related: Context window
- source: M1

### Token-counting API / usage field
- group: D2
- objectives: 2.4, 4.5
- definition: Ways to measure actual tokens before sending a request and on every response.
- significance: Limits and billing apply to measured counts.
- exam: Measure, don't estimate by characters.
- confusion: Fixed characters-per-token ratios.
- related: Context window
- source: M1

### Cache breakpoint / TTL
- group: D2
- objectives: 2.5, 4.5
- definition: The boundary between the cacheable prefix and dynamic content, and how long the cache entry lives: 5-minute default (write 1.25×), or 1-hour (write 2×); reads 0.1× of base input.
- significance: Prefix order and call frequency decide whether caching pays off.
- exam: "A cache that never hits" means dynamic content came first.
- confusion: Assuming a longer TTL fixes a changing prefix (the 1-hour TTL doubles the write cost and still misses a changing prefix).
- related: Prompt caching
- source: M1; M2

### Skill
- group: D2
- objectives: 2.5, 7.1, 3.8
- definition: A versioned, self-contained unit (SKILL.md plus optional scripts) that packages a repeatable procedure. On the API it's attached via container.skills and needs the Code Execution Tool.
- significance: Governed reuse across teams; loads progressively.
- exam: Repeatable, distributed and governed → Skill; flexible and local → prompt library.
- confusion: Assuming the platform screens Skills for you.
- related: Plugin, Progressive disclosure
- source: M1; M5; Official – Agent Skills

### Modular prompt library
- group: D2
- objectives: 2.5
- definition: A shared collection of prompt fragments that engineers assemble in their own code.
- significance: Lightweight reuse within one team.
- exam: Lean toward it for flexible, frequently tweaked prompts.
- confusion: Using it where versioned rollback is needed.
- related: Skill
- source: M1

### Compaction
- group: D2
- objectives: 2.4, 3.8
- definition: Periodically summarising accumulated context so long sessions keep going.
- significance: Controls growth, but it's lossy and mostly one-way.
- exam: Preserve identifiers, numbers and decisions verbatim.
- confusion: Treating summaries as faithful by default.
- related: Progressive context
- source: M1

## Domain 3 – Integration

### Capability bloat
- group: D3
- objectives: 3.1
- definition: An agent configured with more tools or permissions than its task requires (exam term; the modules describe it as least-privilege tool configuration).
- significance: Larger attack surface, higher cost, worse tool selection.
- exam: Remove out-of-scope tools and record why.
- confusion: Deferring tool loading doesn't reduce permissions.
- related: Least privilege, Tool search tool
- source: EG; M2 (concept mapping is inference)

### Trust hierarchy
- group: D3
- objectives: 3.1, 1.4
- definition: Scoping each subagent's tools to its task so it can't reach tools the orchestrator or other roles hold.
- significance: Contains compromised or erring subagents.
- exam: Subagents that inherit every tool are a red flag.
- confusion: Shared toolsets "for simplicity".
- related: Least privilege
- source: M2

### Server-side identity injection
- group: D3
- objectives: 3.2
- definition: The server injects verified user identity and role, from SSO or auth, into the system prompt. It never comes from the user's message.
- significance: Prevents spoofed roles.
- exam: "As a manager, show me…" in user text is a red flag.
- confusion: Authentication (who you are) vs. authorization (what you may do).
- related: SSO, Authorization
- source: M2

### Tool-call authorization
- group: D3
- objectives: 3.2, 5.1
- definition: A deterministic check (allowlist plus identity and scope) before any side-effecting action.
- significance: Provable, replayable, auditable.
- exam: Output screening can't stop an action that has already run.
- confusion: Letting the model judge whether the caller is authorised.
- related: Guardrail
- source: M3

### OAuth 2.1 resource server (MCP)
- group: D3
- objectives: 3.2, 3.7
- definition: A protected HTTP MCP server's role: it accepts access tokens, publishes Protected Resource Metadata (RFC 9728), and clients send tokens on every request.
- significance: Standard per-user authorization for remote tools.
- exam: Replaces static shared secrets for non-public data.
- confusion: MCP authorization is optional in the spec; that's not the same as unnecessary.
- related: MCP
- source: Official – MCP specification, Authorization

### Per-tenant API keys
- group: D3
- objectives: 3.2, 3.4
- definition: A separate API key per tenant in a multi-tenant deployment.
- significance: Attribution and isolation for rate limits and cost.
- exam: A shared key means one tenant's spike hits everyone, invisibly.
- confusion: Logging a tenant_id field doesn't give you isolation.
- related: Rate limit
- source: M2

### p95 latency
- group: D3
- objectives: 3.3, 6.3
- definition: The latency 95% of requests complete within.
- significance: SLA breaches come from the slow tail.
- exam: Design against p95, not the median.
- confusion: p50 and the median are the same thing.
- related: SLA
- source: M2

### Change attribution
- group: D3
- objectives: 3.4, 4.4
- definition: Telling apart model drift, data drift and model-update effects when a metric moves.
- significance: Each has a different fix.
- exam: Needs version and prompt IDs plus distribution comparison.
- confusion: Fixing before attributing.
- related: Model drift, Data drift
- source: M2

### Model drift / Data drift
- group: D3
- objectives: 3.4, 4.6
- definition: Model drift: the model's outputs on stable inputs change over time. Data drift: the input distribution changes.
- significance: Gradual, so threshold alerts often miss them.
- exam: Use periodic distribution comparison.
- confusion: Both differ from a model version update.
- related: Change attribution
- source: M2

### Trace / shared trace ID
- group: D3
- objectives: 3.4, 1.4
- definition: A per-request record (model, version, tokens, latency, stop reason, tool calls), with one ID propagated across all agents in a run.
- significance: Makes a multi-agent run reconstructable.
- exam: The fix for fragmented logs.
- confusion: Separate per-agent dashboards don't replace it.
- related: Observability
- source: M1; M2

### RAG (retrieval-augmented generation)
- group: D3
- objectives: 3.5, 3.6
- definition: Chunk and index a corpus ahead of time, retrieve relevant chunks at query time, and pass them into context.
- significance: For stable knowledge, large corpora, and citations.
- exam: Not for live state. Measure retrieval separately from generation.
- confusion: Similarity isn't truth.
- related: Chunking, Hybrid retrieval
- source: M1; M2

### Chunking (fixed / semantic / hierarchical)
- group: D3
- objectives: 3.5
- definition: Splitting the corpus into retrievable units: uniform spans, meaning-based breaks, or structure-preserving sections.
- significance: Choose by the structure of the source.
- exam: Hierarchical for contracts, manuals and policies.
- confusion: One default chunk size for everything.
- related: RAG
- source: M1

### Dense / Sparse / Hybrid retrieval
- group: D3
- objectives: 3.5, 3.6
- definition: Dense (embeddings) matches meaning; sparse (e.g. BM25) matches exact tokens; hybrid combines both.
- significance: Choose by query pattern.
- exam: Identifiers being missed → add sparse.
- confusion: Dense-only for part numbers.
- related: Reciprocal rank fusion
- source: M1

### Reciprocal rank fusion (RRF)
- group: D3
- objectives: 3.5
- definition: A low-tuning way to merge ranked lists by scoring each item on its rank in each list.
- significance: The defensible default for hybrid retrieval.
- exam: Hybrid → fuse with RRF.
- confusion: Averaging raw similarity scores across different indexes.
- related: Hybrid retrieval
- source: M1

### MCP (Model Context Protocol)
- group: D3
- objectives: 3.7, 7.1
- definition: An open protocol for exposing tools, prompts and resources from a server so any MCP-aware client can use them.
- significance: Build once, connect from many clients.
- exam: Use when two or more clients need the same tools.
- confusion: MCP as the default integration; MCP as an agent loop.
- related: Tool use, OAuth 2.1 resource server
- source: M1; M2

### Agent SDK
- group: D3
- objectives: 3.7
- definition: A managed agent loop (iteration, tool execution, termination), the same one behind Claude Code, embedded in your own application. Available for TypeScript and Python.
- significance: Multi-turn agents inside your product without building the loop yourself.
- exam: Agent SDK vs. Anthropic SDK (a wrapper with no loop).
- confusion: You give up fine-grained control between turns.
- related: SDK, Claude Code
- source: M1; M2

### Entry point / build-time interface / delivery route
- group: D3
- objectives: 3.7, 5.4, 6.5
- definition: Three layers. The entry point is how users reach Claude; the build-time interface is what engineers code against; the delivery route is where API traffic terminates (first-party, Bedrock, Vertex, Foundry).
- significance: Three decisions, made for three different stakeholders.
- exam: Compliance eliminates routes and entry points first.
- confusion: "It's all Claude."
- related: CSP delivery route
- source: M1

### Agent-to-agent protocol
- group: D3
- objectives: 3.7
- definition: Protocols for delegating tasks between independently owned agents (e.g. the A2A protocol announced by Google, positioned as complementary to MCP).
- significance: Cross-organisation or cross-framework delegation.
- exam: Source gap: no official Anthropic documentation; the decision principle is inferred.
- confusion: In-process subagents (agents you own) vs. external agents.
- related: MCP, Subagent
- source: External – Google A2A announcement

### Progressive vs. monolithic context
- group: D3
- objectives: 3.8, 2.4
- definition: Monolithic loads everything up front; progressive stages context, carrying forward only what the next step needs.
- significance: Monolithic is the silent budget killer in long sessions.
- exam: Production usually combines a monolithic prefix, progressive state, retrieval and compaction.
- confusion: Strategy and sizing are separate decisions.
- related: Compaction, Tool search tool
- source: M1

### Tool search tool / defer_loading
- group: D3
- objectives: 3.8, 3.1
- definition: Lets Claude search a large tool catalogue and load only the tools it needs. Tools marked defer_loading: true load only when discovered.
- significance: Progressive discovery for tools; cuts definition overhead.
- exam: Keep 3–5 hot tools loaded; never defer the search tool; still send full definitions.
- confusion: Deferring a tool doesn't remove its permissions.
- related: Progressive disclosure
- source: Official – Tool search tool

### Progressive disclosure (Skills)
- group: D3
- objectives: 3.8, 2.5
- definition: Skills show only metadata up front; SKILL.md and referenced files load when needed.
- significance: Hundreds of Skills without filling the context.
- exam: An example of progressive discovery.
- confusion: Loading every Skill's full content up front.
- related: Skill
- source: Official – Agent Skills

## Domain 4 – Evaluation, Testing & Optimization

### Golden dataset
- group: D4
- objectives: 4.2, 4.1
- definition: A labelled, representative set of inputs (including edge cases and adversarial items) that evals run against.
- significance: An unrepresentative set makes scores meaningless.
- exam: Keep it current with every prompt or model change.
- confusion: Building it from a few convenient inputs.
- related: Eval
- source: M2

### LLM-as-judge
- group: D4
- objectives: 4.2
- definition: A model that scores outputs against a rubric, for interpretive qualities.
- significance: Scales interpretive grading.
- exam: Needs a rubric, constrained verdicts, reasoning, human calibration and a different grader model.
- confusion: Trusting an uncalibrated judge.
- related: Grading ladder
- source: M2

### Grading ladder
- group: D4
- objectives: 4.2
- definition: Code-based grading first, an LLM judge when interpretation is needed, humans as the last resort.
- significance: The cheapest reliable method for each behaviour.
- exam: Favour volume over perfection.
- confusion: Judging schema validity with a model.
- related: LLM-as-judge
- source: M2

### Judge calibration
- group: D4
- objectives: 4.2
- definition: Checking a judge's verdicts against human-labelled outputs before relying on it.
- significance: An uncalibrated judge is worse than none because it looks trustworthy.
- exam: "Judge says great, experts disagree" → calibrate.
- confusion: Averaging repeated judge runs doesn't calibrate anything.
- related: LLM-as-judge
- source: M2

### Multi-turn eval
- group: D4
- objectives: 4.2
- definition: Scoring whole conversations for context retention, invented details, and quality as length grows.
- significance: Single-turn sets miss conversation failures.
- exam: Needs its own transcript dataset.
- confusion: Adding more single prompts instead.
- related: Golden dataset
- source: M2

### Hallucination rate
- group: D4
- objectives: 4.1, 4.4
- definition: The share of responses containing information unsupported by the input, the source data or allowed logic.
- significance: A key accuracy metric with a threshold.
- exam: Fix through grounding, not instructions.
- confusion: Hallucination (ungrounded content) vs. prompt failure (an ambiguous instruction).
- related: Grounding
- source: M2

### Failure taxonomy
- group: D4
- objectives: 4.4
- definition: Prompt failure, hallucination, model mismatch, orchestrator-workers failure.
- significance: Each class has its own fix.
- exam: Classify before you fix.
- confusion: Rewording a prompt to cure a grounding problem.
- related: Change attribution
- source: M2

### Model mismatch
- group: D4
- objectives: 4.4, 2.1
- definition: The wrong tier for the task, or a tier swapped without re-evaluation.
- significance: Category-specific regressions after a cost-driven swap.
- exam: Remedy with eval-gated selection and per-category routing.
- confusion: Mistaking it for data drift.
- related: Model tiers
- source: M2

### A/B test
- group: D4
- objectives: 4.3
- definition: A hypothesis, random sticky assignment, a pre-specified primary metric, and a sample size calculated for higher LLM variance.
- significance: Separates improvements from noise.
- exam: Watch for underpowered tests and outcome-shopping.
- confusion: Statistical significance vs. practical worth.
- related: Shadow testing
- source: M2

### Shadow testing
- group: D4
- objectives: 4.3
- definition: Run the new version on copied live traffic while users get the current version, and score the shadow outputs offline.
- significance: Validates without exposing users.
- exam: Regulated settings, low traffic, or high per-output risk.
- confusion: A canary still exposes real users.
- related: A/B test
- source: M2

### Batch API
- group: D4
- objectives: 4.5
- definition: Asynchronous bulk processing at a discount (50% of standard prices; up to 100,000 requests or 256 MB per batch; results within 24 hours).
- significance: Cuts cost when the SLA allows waiting.
- exam: Confirm compliance coverage before routing regulated data through it.
- confusion: Using it for interactive paths.
- related: Sizing
- source: M2

### Sizing
- group: D4
- objectives: 4.5, 1.6
- definition: A cost model from call volume, the token distribution, model tier and sensitivity analysis, built before any code.
- significance: The average token count understates heavy tails by two to three times.
- exam: Model the distribution, not the average.
- confusion: Treating POC bills as a forecast.
- related: ROI mapping
- source: M2

### KPI translation layer
- group: D4
- objectives: 4.6, 1.6
- definition: A mapping from technical metrics (task success, latency) to business KPIs (first-contact resolution, handle time).
- significance: Lets sponsors see value with a live query.
- exam: Build it at design time.
- confusion: Giving sponsors raw technical dashboards.
- related: Outcome document
- source: M2

## Domain 5 – Governance, Safety & Risk Management

### Training-time alignment vs. inference-time control
- group: D5
- objectives: 5.1
- definition: Training-time alignment is the constitution-shaped safety behaviour that applies to every request. Inference-time control is the deployment-specific screening, authorization and review you build.
- significance: Claude can't enforce a rule it was never given.
- exam: A domain policy must live in a layer you build.
- confusion: "It refuses harmful prompts, so our policy is covered."
- related: Constitution
- source: M3

### Constitution
- group: D5
- objectives: 5.1, 5.5
- definition: The written document Anthropic trains Claude against: broadly safe, ethical, guideline-compliant and helpful, weighed holistically.
- significance: Reduces broad harm; doesn't encode your policy.
- exam: Training-time, not deployment-time.
- confusion: Treating it as a runtime control.
- related: Alignment
- source: M3

### Input screening / Output screening
- group: D5
- objectives: 5.1
- definition: Checks before the model call (should this reach the model?) and before the response returns (is this safe to return?).
- significance: Two of the three control points.
- exam: Chain model-based and deterministic checks.
- confusion: One output filter isn't a guarded path.
- related: Tool-call authorization
- source: M3

### Fail open vs. fail closed
- group: D5
- objectives: 5.1
- definition: When an operator-built guardrail errors, traffic either passes unscreened (open) or is blocked (closed).
- significance: Failing open looks protected but does nothing.
- exam: Fail closed where a wrong pass causes harm.
- confusion: Applies to your components, not Anthropic's API-level controls.
- related: Circuit breaker
- source: M3

### Indirect prompt injection
- group: D5
- objectives: 5.1, 5.2
- definition: Malicious instructions arriving through retrieved documents or tool outputs rather than from the user.
- significance: The dominant injection vector in RAG and agent deployments.
- exam: Screen retrieved and tool content before adding it to context.
- confusion: Screening only user input.
- related: Input screening
- source: M3

### Token-budget exhaustion
- group: D5
- objectives: 5.2
- definition: Oversized or padded inputs that consume context or output budget, truncating work or inflating cost.
- significance: A cost and availability risk.
- exam: Input limits, max_tokens, per-turn budgets.
- confusion: Mistaking it for hallucination.
- related: Risk categories
- source: M3

### Refusal stop reason
- group: D5
- objectives: 5.1
- definition: The API's stop_reason "refusal" when streaming classifiers intervene, with stop_details always present on a refusal; category and explanation can be null.
- significance: Lets the app route refusals by class.
- exam: Branch on stop_reason, not on a populated category; reset the refused turn before continuing.
- confusion: Hard-coding category lists (verify current docs).
- related: Guardrails
- source: M3

### Skill supply-chain security
- group: D5
- objectives: 5.1, 7.1
- definition: Auditing Skill bundles for anomalous or out-of-scope behaviour, running them with least privilege in a sandbox, and sourcing them from trusted registries.
- significance: Skills are distributable code with hidden behaviour.
- exam: Record a verdict: approve, reject or remediate.
- confusion: Assuming the platform screens Skills.
- related: Skill
- source: M3

### Risk assessment (deliverable)
- group: D5
- objectives: 5.2
- definition: A written record of each risk's category, component, likelihood and impact, control, owner and evidence.
- significance: What the security reviewer signs.
- exam: Verbal discussion doesn't count.
- confusion: A diagram isn't a risk assessment.
- related: Control register
- source: M3

### Review routing
- group: D5
- objectives: 5.3
- definition: Sending decisions to people by stakes (reversibility and cost) and calibrated confidence.
- significance: Spends limited reviewer attention well.
- exam: Low confidence plus irreversible or high-cost → human first.
- confusion: Routing by volume.
- related: Consent fatigue
- source: M3

### Consent fatigue
- group: D5
- objectives: 5.3, 7.2
- definition: Oversight breaking down when reviewers approve so many items that they stop reading.
- significance: Turns review into rubber-stamping.
- exam: Move review to plan or exception checkpoints.
- confusion: Adding more approvers to fix it.
- related: Review routing
- source: M3

### BAA (Business Associate Agreement)
- group: D5
- objectives: 5.4
- definition: A HIPAA contract that lets a vendor process PHI. Coverage is specific to the configuration and feature.
- significance: Without it, the route is non-compliant.
- exam: Beta features are generally excluded unless explicitly listed.
- confusion: One BAA assumed to cover every configuration.
- related: PHI, HIPAA
- source: M1; M2; M3

### Data residency / region pinning
- group: D5
- objectives: 5.4
- definition: Processing and storing data, including logs and caches, within an approved region, configured at the integration layer.
- significance: Rules out routes that can't pin the region.
- exam: An EU pin needs a region-pinned CSP route; direct-API inference_geo offers only "us" or "global" (verified 2026-11-19).
- confusion: Forgetting log and cache copies.
- related: CSP delivery route
- source: M2; M3

### Control register
- group: D5
- objectives: 5.4, 6.4
- definition: A table mapping each obligation to a technical control, an owner and an evidence artifact.
- significance: The auditable form of compliance.
- exam: Revalidate on a schedule; configurations drift.
- confusion: A compliant route isn't proof.
- related: Evidence artifact
- source: M3

### Evidence artifact
- group: D5
- objectives: 5.4, 6.4
- definition: Proof that a control is live: a signed agreement, a configuration screen, an authorization record, a log query.
- significance: What reviewers accept.
- exam: A design document is a claim, not proof.
- confusion: Vendor certifications on their own.
- related: Control register
- source: M3; M4

### Data minimisation
- group: D5
- objectives: 5.4, 3.2
- definition: Passing only the fields the language task needs, using reference IDs where possible, and redacting PII before the call.
- significance: Prevents PII from reaching request logs.
- exam: "If the task doesn't need it, it isn't in the context."
- confusion: Encrypting logs instead of not logging the data.
- related: PHI
- source: M2

### Fairness injection points
- group: D5
- objectives: 5.5
- definition: Where unequal outcomes enter: the retrieval corpus, prompt framing, few-shot examples, downstream routing.
- significance: Makes fairness something an architect can instrument.
- exam: Look here when the model passed the vendor's bias evals.
- confusion: Assuming fairness is the vendor's job.
- related: Decision logging
- source: M3

### Decision logging
- group: D5
- objectives: 5.5, 5.4
- definition: Capturing inputs, retrieved context, output and routing per decision so it can be replayed and explained.
- significance: Serves users, regulators and the build team.
- exam: The log is itself governed sensitive data.
- confusion: Aggregate metrics can't reconstruct a single decision.
- related: Fairness injection points
- source: M3

## Domain 6 – Stakeholder Communication & Lifecycle Management

### Discovery (structured elicitation)
- group: D6
- objectives: 6.1
- definition: Listen, translate, write down, across four buckets: must do, must not do, must cost, must prove.
- significance: Sets the constraints the design follows.
- exam: Finish all four buckets before sketching anything.
- confusion: A discovery call that turns into a design session.
- related: Translation table
- source: M4

### Translation table
- group: D6
- objectives: 6.1
- definition: One row per item: the statement as said, the implied constraint, the architectural decision, and the assumption to confirm.
- significance: Keeps the reasoning traceable into design.
- exam: Label assumptions as assumptions.
- confusion: Writing preferences down as requirements.
- related: Requirement vs. assumption
- source: M4

### Requirement vs. assumption
- group: D6
- objectives: 6.1, 6.4
- definition: A requirement traces to something the stakeholder said; an assumption is something the design takes for granted.
- significance: Unsourced assumptions are the most dangerous kind.
- exam: Assumptions need an owner and confirmation.
- confusion: Burying assumptions as facts.
- related: Translation table
- source: M4

### Reversal cost
- group: D6
- objectives: 6.2
- definition: What it costs to undo a decision after the system has been built around it.
- significance: The trade-off element that changes the meeting.
- exam: Gain, give-up, reversal cost (plus compliance effect in regulated settings).
- confusion: Per-call cost vs. the business total at volume.
- related: Trade-off framing
- source: M4

### Feedback loop / governance table
- group: D6
- objectives: 6.3
- definition: Signals → Triage → Decide → Act → Review; a table mapping each signal to a trigger, an owner, an action and any scheduled checkpoint.
- significance: Monitoring isn't a feedback loop.
- exam: Include slow-drift triggers and scheduled regulated checkpoints.
- confusion: Dashboards with no owners.
- related: SLA
- source: M4

### SLA (Service Level Agreement)
- group: D6
- objectives: 6.3, 1.6
- definition: Names what is measured, what counts as a breach, and what happens on a breach. Thresholds trace to UX expectations, business criticality or eval acceptance criteria.
- significance: Makes expectations enforceable and defensible.
- exam: Arbitrary thresholds are a red flag.
- confusion: An SLA with no stated consequence.
- related: p95 latency
- source: M4

### Decision log with rationale
- group: D6
- objectives: 6.4
- definition: Each decision recorded with its date, the rejected alternatives and the trade-off it resolved.
- significance: Stops successors reversing decisions that matter.
- exam: Diagram-only handoffs fail the safe-change test.
- confusion: A "what" without a "why".
- related: Documentation completeness
- source: M4

### Documentation completeness (safe-change test)
- group: D6
- objectives: 6.4
- definition: Can a competent architect who wasn't in the room make a safe change after reading the document?
- significance: The definition of done for handoff.
- exam: Serve three readers: handoff recipient, compliance reviewer, returning architect.
- confusion: Measuring completeness by page count.
- related: Decision log
- source: M4

### Outcome document
- group: D6
- objectives: 6.4, 1.6
- definition: Use case and scope, the metric before, the metric after, an auditable control, a measurement owner (plus optional, Partner-Track reuse potential).
- significance: Makes value legible to a CFO.
- exam: Technical metrics alone fail.
- confusion: Volume and latency aren't business outcomes.
- related: ROI mapping
- source: M4

### Entry-point-responsibility map
- group: D6
- objectives: 6.4, 3.7
- definition: A written record of which entry point or route owns which task, and why, made before integration.
- significance: Prevents scope drift between routes.
- exam: Multi-platform deployments need one.
- confusion: Leaving routing logic undocumented.
- related: Entry point
- source: M4

### Deployment lifecycle
- group: D6
- objectives: 6.5
- definition: Discovery → design → handoff → monitoring → iteration.
- significance: Knowing the phase tells you when to move on, or go back.
- exam: Changed constraints → re-architect, not iterate.
- confusion: Skipping the handoff phase.
- related: POC-to-production gap
- source: M4

### POC-to-production gap
- group: D6
- objectives: 6.5, 4.5
- definition: Cost, latency (p95), reliability and failure modes are all invisible in a demo.
- significance: A POC proves capability only.
- exam: Add a cost model, reliability controls, pinning, evals and observability.
- confusion: Treating a demo bill as a forecast.
- related: Reliability controls
- source: M2

### Reliability controls
- group: D6
- objectives: 6.5, 7.3
- definition: Retries with exponential backoff near the API call; a circuit breaker at the service boundary; fallback chains in orchestration.
- significance: Graceful degradation instead of total failure.
- exam: Each control works only at the right layer.
- confusion: Retrying non-transient 4xx errors.
- related: Circuit breaker, Transient error
- source: M2

### Circuit breaker
- group: D6
- objectives: 6.5
- definition: Trips when a dependency's error rate passes a threshold, so requests fail fast for a cooldown period.
- significance: Stops one degraded dependency taking down the system.
- exam: Sits at the service boundary.
- confusion: Circuit breakers vs. retries.
- related: Reliability controls
- source: M2

## Domain 7 – Developer Productivity & Operational Enablement

### Shared configuration
- group: D7
- objectives: 7.1
- definition: A team baseline (project CLAUDE.md, agreed tools and MCP servers, permission posture) that everyone starts from.
- significance: Prevents drifted personal setups.
- exam: Review and version it once for everyone.
- confusion: Each engineer configuring their own.
- related: CLAUDE.md
- source: M5

### Champion-per-department rollout
- group: D7
- objectives: 7.1, 7.2
- definition: Enable one champion per team first to prove a workflow, then seed adoption batch by batch.
- significance: Local experts and examples; avoids lumpy adoption.
- exam: Better than a mass switch-on.
- confusion: Equating access with adoption.
- related: Lumpy adoption
- source: M5

### Plugin (Skills distribution)
- group: D7
- objectives: 7.1, 2.5
- definition: A bundle of Skills assigned to a group or org, with install preferences and version-controlled updates from a repository.
- significance: The strongest governance for group-scoped distribution.
- exam: The fix for a "shipped with no way back" Skill.
- confusion: Org-provisioned Skills have no native rollback.
- related: Skill
- source: M5

### Spend posture
- group: D7
- objectives: 7.1
- definition: Model defaults, model allowlists, effort guidance, and spend, rate and per-user caps, set during team setup.
- significance: Unmanaged model choice multiplies cost at team scale.
- exam: Set it before the first bill.
- confusion: Reviewing quarterly instead.
- related: Model tiers
- source: M5

### CLAUDE.md
- group: D7
- objectives: 7.1
- definition: A markdown file loaded at session start with standing instructions and project conventions.
- significance: A shaping layer.
- exam: Not a guarantee; use hooks for things that must always happen.
- confusion: Shaping vs. governing layers.
- related: Hook
- source: M1

### Hook
- group: D7
- objectives: 7.1, 5.1
- definition: A script that fires on Claude Code lifecycle events as a deterministic gate the agent can't skip.
- significance: The guarantee comes from code rather than the prompt.
- exam: "Must always run X before Y" → hook.
- confusion: Relying on CLAUDE.md instructions instead.
- related: Permission modes
- source: M1

### Permission modes (Claude Code)
- group: D7
- objectives: 7.1
- definition: default, acceptEdits, plan, auto (a classifier reviews each action), dontAsk (locked-down CI), bypassPermissions (containers or CI only).
- significance: Governs what the agent may do without prompting.
- exam: Use bypassPermissions only in isolated environments.
- confusion: Behaviour changes over time; verify current docs.
- related: Sandboxing
- source: M1

### Verification checklist
- group: D7
- objectives: 7.2
- definition: The correctness, security, maintainability and human-understanding checks AI-generated output must pass before production.
- significance: Turns diligence into a repeatable gate.
- exam: The merger must be able to explain the code.
- confusion: Passing tests ≠ understood.
- related: Diligence
- source: M5

### Lumpy adoption / stalling at chat
- group: D7
- objectives: 7.2
- definition: Lumpy adoption: a few heavy users, the rest barely engaged. Stalling at chat: never moving beyond Q&A to tools, repository context or Skills.
- significance: The two common adoption failures.
- exam: Fix with champions and workflow integration.
- confusion: Restricting access as a response.
- related: Champion rollout
- source: M5

### Runbook / escalation path
- group: D7
- objectives: 7.3
- definition: A runbook captures known symptom → cause → action paths; an escalation path says who handles what, and when.
- significance: Builds team self-sufficiency.
- exam: Teach the path rather than firefighting.
- confusion: The architect fixing every incident personally.
- related: Symptom-to-cause
- source: M5

### Transient error
- group: D7
- objectives: 7.3, 6.5
- definition: A temporary failure (429 rate limit, timeout, 5xx including 529 overloaded) that's likely to succeed on retry.
- significance: Retry with exponential backoff.
- exam: Don't retry 4xx validation errors such as a 400 for a prompt that's too long.
- confusion: 429 (throttled) vs. 400 (invalid request).
- related: Reliability controls
- source: M2 Glossary
