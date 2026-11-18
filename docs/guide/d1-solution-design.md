---
domain_id: D1
domain_name: Solution Design & Architecture
weight: 17
priority: Critical
modules: [M1, M2, M4]
---

# Domain 1 – Solution Design & Architecture

**Weight:** 17% `[EXAM GUIDE]` · **About 11 of 63 items** `[INFERENCE]` · **Study priority:** HIGH PRIORITY / Critical
**Mapped modules:** M1 (Decomposition, Pattern Selection, Multi-agent, Reference Architectures) · M2 (Sizing, ROI) · M4 (Discovery, Outcome document)

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 1.1 | Translate business problems into Claude-based AI solutions |
| 1.2 | Design end-to-end architectures (input → processing → output → feedback loops) |
| 1.3 | Select appropriate architectural patterns (workflow, agentic, augmented LLM) |
| 1.4 | Design multi-agent systems and orchestration strategies |
| 1.5 | Apply decomposition techniques for complex problem solving |
| 1.6 | Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs) |

---

### Objective 1.1 – Translate business problems into Claude-based AI solutions

#### What you need to know
- **Start from the four properties of generative AI.** Each one is a capability, a limitation and a mitigation `[MODULE 1 – How Claude Behaves]`:
  - **Next-token prediction:** strong on common patterns, weak on precise specifics. Mitigate with citations, generator-verifier loops, tool lookups.
  - **Knowledge:** unreliable on rare or fast-changing topics. Mitigate with RAG, tools, MCP, web search.
  - **Working memory:** the context window is a hard edge. Mitigate with progressive loading and chunking.
  - **Steerability:** strong on concrete instructions, weak on abstract ones or precise maths. Mitigate with structured outputs and code execution.
- **Scoping sequence** `[MODULE 2 – Sizing]`: business requirement → capability list → architecture sketch (who owns each capability) → boundary conditions → SOW scope.
- **Feasibility verdict** `[MODULE 2]`: *feasible as scoped* · *feasible with constraints* · *not feasible*. A verdict comes with the constraints that make it true.
- **Constraints first:** gather volume, input size and latency before confirming feasibility. `[MODULE 2 – scoping call case]`

#### Why it matters
Most expensive early mistake: over-assigning work to Claude. Confirming capability before collecting constraints leads to commitments the design can't keep. `[MODULE 1]` `[MODULE 2]`

#### Architecture concepts
Capability inventory; ownership map (Claude / systems / humans); compensating controls per property; boundary conditions written into the SOW; cost model at production volume. `[MODULE 2]`

#### How it works
1. Run structured discovery and translate preferences into constraints (6.1).
2. Split the goal into named capabilities.
3. Assign each capability to Claude, an existing system or a human (1.5).
4. Run each capability through the four properties and add compensating controls.
5. Size cost and latency at production volume (2.4, 4.5).
6. Issue the verdict with explicit boundary conditions.
7. Put the boundary conditions into the SOW.

#### Architecture example
REAL-WORLD EXAMPLE – "Process insurance claims" becomes four capabilities:
- extract fields → Claude, with a code-based verifier;
- check policy coverage → policy database (tool call);
- route to an adjuster queue → rules engine;
- draft the adjuster notification → Claude, with the adjuster reviewing.

Verdict: feasible with constraints (documents ≤ N pages, human gate on low-confidence extractions). `[MODULE 2]`

#### Decision framework
| Question | Guidance |
|---|---|
| When to give Claude the work | Language understanding, summarising, drafting, planning, tool-mediated actions |
| When NOT to | Authoritative values, live state, deterministic rules, high-stakes approvals |
| Alternatives | Existing systems of record; rules engines; human decision points |
| Trade-off | More given to Claude means faster to build but higher cost, more variance and more audit risk |

#### Exam decision signals
- "Excited sponsor, working demo, no volume numbers yet" → **gather constraints before the verdict**.
- "Needs exact amounts / IDs" → next-token limit → **verification or a tool lookup**.
- "Only works for short documents" → **feasible with constraints**; document the boundary.

#### Common traps
- COMMON TRAP: answering "can Claude do this?" and stopping there.
- COMMON TRAP: assigning deterministic routing to the model.
- COMMON TRAP: leaving "feasible with constraints" undocumented. It becomes infeasible the moment a constraint is violated in production.

#### Must remember
- Capability ≠ feasibility.
- Use the four properties as a lens on every capability.
- A verdict is the conclusion plus the constraints that make it true.
- Collect volume, input size and latency before committing.

#### Quick recall
**"Ask → Split → Assign → Stress-test (4 properties) → Size → Verdict."**

**Sources:** M1 How Claude Behaves, Decomposition; M2 Sizing (scoping, feasibility, verdicts, scoping-call case).

---

### Objective 1.2 – Design end-to-end architectures (input → processing → output → feedback loops)

#### What you need to know
An end-to-end design has four stages. Each stage has an owner, a set of controls and a signal it emits. `[INFERENCE – assembled from the sources cited]`
| Stage | Design content | Source |
|---|---|---|
| **Input** | Identity injected by the server; data minimised to what the task needs; input screening (incl. retrieved and tool content) | `[MODULE 2]` `[MODULE 3]` |
| **Processing** | Pattern (augmented LLM / workflow / agent); reference architecture; model tier; context strategy; tools behind authorization | `[MODULE 1]` |
| **Output** | Output contract or schema; output screening; validation; confidence score; routing to a human by stakes | `[MODULE 1]` `[MODULE 3]` |
| **Feedback loop** | Outcome logging (accepted/rejected downstream); evals; drift detection; Signals → Triage → Decide → Act → Review; iterate vs. re-architect | `[MODULE 2]` `[MODULE 4]` |
`[OFFICIAL ANTHROPIC DOCS – Building effective agents]`: the augmented LLM (retrieval, tools, memory) is the basic building block. Start with the simplest solution and add complexity only when it's needed.

#### Why it matters
A system without an outcome signal can't tell it's degrading. A system without an exception path pushes low-confidence work downstream at the same rate as clean work. `[MODULE 2]` `[MODULE 4]`

#### Architecture concepts
Exception paths, human review queues, shared trace IDs, version pinning, governance tables (signal → trigger → owner → action). `[MODULE 1, 2, 4]`

#### How it works
1. Define the input contract and its identity and data controls.
2. Choose the processing pattern and reference architecture.
3. Define the output contract and the validation and screening steps.
4. Define confidence thresholds and the exception route.
5. Instrument outcome signals.
6. Wire signals into evals and a governance table before launch.

#### Architecture example
REAL-WORLD EXAMPLE – Invoice processing:
- **Input:** OCR plus server-side tenant ID.
- **Processing:** extraction against a schema, with an evaluator-optimizer pass.
- **Output:** schema-validated JSON; low-confidence fields go to a human queue.
- **Feedback:** reviewer corrections are logged and added to the golden dataset; a drop in eval score triggers an architect review. `[MODULE 1 – Doc pipeline]` `[MODULE 2]` `[MODULE 4]`

#### Decision framework
| Use a full four-stage design when… | A simpler design may do when… |
|---|---|
| Production, regulated or high-volume | Internal prototype with no downstream effects (still log outcomes) |
| Trade-off: more components to maintain, in exchange for detectability and recoverability | |

#### Exam decision signals
- "No exception path" → add confidence scoring and a human queue.
- "Quality slid for weeks unnoticed" → the feedback loop is missing.
- "Can't explain a decision afterwards" → decision logging.

#### Common traps
- COMMON TRAP: the diagram stops at "response to user".
- COMMON TRAP: monitoring without triggers (6.3).
- COMMON TRAP: one path for clean and messy inputs.

#### Must remember
- Every stage has controls and a signal.
- The feedback loop is part of the architecture.
- Exceptions need their own route.
- Simplest pattern first.

#### Quick recall
**"In (who/what) → Do (pattern) → Out (contract/check) → Learn (signal/loop)."**

**Sources:** M1 Reference Architectures; M2 Integration & Observability; M3 Guardrails; M4 Feedback loop; Official – Building effective agents.

---

### Objective 1.3 – Select appropriate architectural patterns (workflow, agentic, augmented LLM)

#### What you need to know
| Pattern | Control flow | Use when | Source |
|---|---|---|---|
| **Augmented LLM** | One bounded call (may use tools, retrieval, thinking); no branching on model decisions | Well-defined task, verifiable output | `[MODULE 1]` |
| **Workflow** | Steps orchestrated **in your code** ("predefined code paths") | Steps knowable in advance; error cost real; observability matters | `[MODULE 1]` `[OFFICIAL ANTHROPIC DOCS]` |
| **Agent** | **The model** directs its own tool use | Path can't be enumerated in advance, *and* unexpected outputs are acceptable and recoverable | `[MODULE 1]` |

**Workflow sub-patterns** `[OFFICIAL ANTHROPIC DOCS – Building effective agents]`:
- **prompt chaining**, with programmatic gates between steps;
- **routing**, when categories are distinct and classification is accurate;
- **parallelization**, either *sectioning* or *voting*;
- **orchestrator-workers**, where subtasks are decided at runtime;
- **evaluator-optimizer**.

Combine them as needed; choose the simplest one that meets error tolerance and observability needs. `[MODULE 1]`

**Five factors, checked in order:** predictability → error cost → observability → latency → cost. The first factor that rules a pattern out decides; the tightest constraint picks the pattern. `[MODULE 1 – Key takeaways]`

**Agents in production** need limited tool entry points, per-turn budgets, explicit permissions and stopping criteria. `[MODULE 1]`

**Order of improvements:** better prompt → tools or retrieval → stronger pattern (e.g. evaluator-optimizer) → fine-tuning only for very high volume, critical latency, or format consistency that prompting couldn't fix. Fine-tuning availability is limited. `[MODULE 1]`

#### Why it matters
Teams pick agents because a task *feels* open-ended. One team's traces showed only four paths. A router with four chains would have been auditable and cost six months less. `[MODULE 1 – 90-day retrospective]`

#### Architecture concepts
Predictability vs. autonomy axes; agent liability surface; audit points (discrete steps); packaging as prompt only, direct tool use, or a Skill. `[MODULE 1]`

#### How it works
1. Can you write down the steps? Yes → workflow (or an augmented call if it's a single step).
2. Is a wrong output costly or hard to undo? Yes → a workflow with gates, or HITL.
3. Must an auditor point at a specific step? → workflow.
4. Do latency or cost budgets rule out multi-call loops? → augmented LLM.
5. Is the path truly unknowable *and* errors recoverable? → a bounded agent.
6. Revisit with production traces.

#### Architecture example
REAL-WORLD EXAMPLE – A disbursement approval built as an agent couldn't answer "which step approved this?". Mining the traces found four shapes. A router with four chains gave discrete, auditable steps. `[MODULE 1]`

#### Decision framework
| Use workflow when… | Use agent when… |
|---|---|
| Paths are enumerable; compliance needs auditable steps | Open-ended investigation; next step depends on what was just found |
| **Avoid workflow** when you'd be scripting endless branches | **Avoid agent** when steps are knowable or an error can't be undone |
| Key clue: "auditor / approval step / known categories" | Key clue: "unfamiliar codebase / research across sources / can't predict steps" |

#### Exam decision signals
- "Four kinds of request" → **routing workflow**.
- "Draft then check quality" → **evaluator-optimizer**.
- "Independent sections in parallel" → **parallelization (sectioning)**.
- "Want flexibility for the future" → **trap**; build for the shape you know today.

#### Common traps
- COMMON TRAP: an agent as the "safe default".
- COMMON TRAP: fine-tuning before improving the prompt.
- COMMON TRAP: assuming agents always cost more. Accumulated context and call count drive cost, not the label. `[MODULE 1]`

#### Must remember
- Workflow = your code controls flow; agent = the model does.
- Use an agent only for genuinely unpredictable paths.
- Agents need budgets, limits and stopping criteria.
- Prompt → tools → stronger pattern → (rarely) fine-tune.
- Five factors; the tightest constraint picks the pattern.

#### Quick recall
**"Can you write the steps? Then write them."**

**Sources:** M1 Pattern Selection, 90-day retrospective, Key takeaways; Official – Building effective agents.

---

### Objective 1.4 – Design multi-agent systems and orchestration strategies

#### What you need to know
- **Orchestrator:** owns the goal; decomposes, delegates and synthesises. It doesn't do sub-task work itself.
- **Subagents:** own scoped sub-tasks, each in its own context. `[MODULE 1]`
- **Three things to design, not assume:**
  - how the work is decomposed;
  - how each result is structured so it can be combined;
  - how conflicts and gaps are resolved. `[MODULE 1]`
- **Fan-out** is the common shape: split a large item into independent units, dispatch in parallel, synthesise. `[MODULE 1]`
- **Error recovery is asymmetric:**
  - subagent failure → usually recoverable (retry, re-route or flag);
  - orchestrator failure → often unrecoverable, so checkpoint its state;
  - make subagent work idempotent. `[MODULE 1]`
- **Coverage check at synthesis:** results returned must equal units dispatched. `[MODULE 1]`
- **HITL gates** go before irreversible or high-stakes subagent actions; sample the lower-stakes ones. `[MODULE 1]`
- `[OFFICIAL ANTHROPIC DOCS – multi-agent research system]` Multi-agent systems suit heavy parallelisation, information exceeding one context window, and many complex tools. They use about 15× the tokens of chat and fit poorly where all agents need shared context or have many dependencies.

#### Why it matters
The most dangerous failure is a confident, complete-looking synthesis over incomplete work. In one case, "48 reviewed, 3 flagged" was reported when 50 sections were dispatched. `[MODULE 1]`

#### Architecture concepts
Shared trace ID; result schema; conflict-resolution rule or human escalation; least-privilege tools per subagent `[MODULE 2]`; checkpointing; per-subagent budgets.

#### How it works
1. Confirm the work exceeds one context or benefits from parallel work.
2. Define units and an idempotent subagent contract (input and output schema).
3. Scope tools per subagent.
4. Dispatch; validate each result; retry or flag failures.
5. Reconcile coverage (returned = dispatched).
6. Resolve conflicts by rule or escalate.
7. Checkpoint orchestrator state and propagate the trace ID.

#### Architecture example
REAL-WORLD EXAMPLE – Audit a 400-file codebase: one subagent per module with read-only tools, a findings schema, an orchestrator coverage check, a conflict rule (the stricter severity wins), and a human gate before any auto-fix PR. `[MODULE 1]` `[INFERENCE]`

#### Decision framework
| Use multi-agent when… | Use single agent / workflow when… |
|---|---|
| Work exceeds one context; independent units; breadth-first | Work fits in one context; heavy interdependence; tight budget |
| Trade-off: parallelism and clean contexts vs. many times the tokens and more failure boundaries | Use the fewest agents that meet the requirement |

#### Exam decision signals
- "Summary looked complete, units missing" → **coverage reconciliation**.
- "Run fails, all work lost" → **checkpoint the orchestrator**.
- "Can't trace across agents" → **shared trace ID**.
- "Subagent can delete prod" → scope tools; put a gate before irreversible actions.

#### Common traps
- COMMON TRAP: multi-agent as the default.
- COMMON TRAP: putting compliance-critical checks in subagents rather than deterministic code. `[MODULE 1 – bank case]`
- COMMON TRAP: no conflict-resolution rule.

#### Must remember
- The orchestrator delegates and synthesises.
- Subagent failure is recoverable; orchestrator failure often isn't.
- Reconcile coverage; never assume it.
- Fewest agents possible; a shared trace ID across them.

#### Quick recall
**"Split · Scope · Send · Check · Count · Combine."**

**Sources:** M1 Multi-agent systems, fan-out case; M2 Failure modes, least privilege; Official – multi-agent research system.

---

### Objective 1.5 – Apply decomposition techniques for complex problem solving

#### What you need to know
In the modules, decomposition works at three levels:
1. **Ownership decomposition:** Claude, existing systems or humans, justified by **reversibility, stakes and accountability**. This produces a *delegation map*: AI-appropriate, human-retained, or collaborative (Claude drafts, a person decides). `[MODULE 1 – Decomposition]`
2. **Capability decomposition:** split the business goal into named capabilities. `[MODULE 2 – Scoping]`
3. **Task / work decomposition:**
   - workflow steps or prompt chains with gates `[OFFICIAL ANTHROPIC DOCS – Building effective agents]`;
   - fan-out into independent units `[MODULE 1]`;
   - pipeline stages when inputs exceed the context window `[MODULE 2 – feasibility]`.

Delegation is the first of the four AI Fluency competencies. `[MODULE 1]`

#### Why it matters
Over-assigning to Claude is the most common and most expensive early mistake. It makes the process more expensive, slower and harder to run. `[MODULE 1]`

#### Architecture concepts
Delegation map, chain gates, unit independence (needed for parallelism), stage handoffs with narrow interfaces. `[MODULE 1]`

#### How it works
1. List the capabilities.
2. For each, ask: can a wrong call be undone? What does it cost? Who answers for it?
3. Assign to Claude, a system, a human or collaborative.
4. Break Claude's share into steps or units; add gates between steps.
5. Confirm the units are independent before running them in parallel.
6. Define the output schema for each step.

#### Architecture example
REAL-WORLD EXAMPLE – Contract review for a law firm:
- iManage fetch → existing system;
- clause extraction and playbook comparison → Claude, parallelised per section;
- playbook → a versioned source of truth retrieved per clause;
- final sign-off → the senior associate (human-retained);
- low-confidence clauses → flagged for attention. `[MODULE 1 – Assembly model answer]`

#### Decision framework
| Assign to Claude | To systems | To humans |
|---|---|---|
| Language, drafting, summarising, planning | Records, rules, live state | Approvals, exceptions, irreversible high-stakes calls |
| Collaborative where Claude drafts and the cost of a wrong call is high but recoverable with review | | |

#### Exam decision signals
- "Who should approve?" → reversibility, stakes, accountability.
- "Rules table already exists" → **keep it in the system**.
- "Document too long for the window" → **pipeline or chunked decomposition**.

#### Common traps
- COMMON TRAP: "Claude does everything".
- COMMON TRAP: parallelising dependent steps.
- COMMON TRAP: having no gate between chain steps.

#### Must remember
- Three owners: Claude, systems, humans.
- Reversibility, stakes, accountability.
- Decompose, then gate.
- Only independent units go in parallel.

#### Quick recall
**"R-S-A decides who owns it."**

**Sources:** M1 Decomposition, fan-out, Assembly; M2 Scoping; Official – Building effective agents.

---

### Objective 1.6 – Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs)

#### What you need to know
**Five pillars** `[EXAM GUIDE]` `[MODULE 2 – Business value and ROI mapping]`:
- **Efficiency:** the same work faster or cheaper.
- **Transformation:** work that wasn't feasible before.
- **Productivity:** more output from the same people.
- **Cost:** the run cost of the solution (M2 calls this "solution cost").
- **Performance SLAs:** service levels the deployment must hold.

**ROI mapping in four steps** `[MODULE 2]`:
1. Baseline measured in a business unit, using the owner's own data.
2. Projected state in the same unit, including human-review effort if the design has a review gate.
3. Subtract the run cost taken from the *sizing distribution* (not the average).
4. Payback period plus sensitivity analysis.

**Outcome document fields** `[MODULE 4]`: use case + scope boundary, metric before, metric after, the control that makes it auditable, measurement owner. (A sixth field, "reuse potential", is Partner-Track and optional.)

#### Why it matters
A feasible design isn't automatically worth building. Technical metrics (volume, latency, error rate) show the system runs, not what it's worth. A CFO asks for the before-and-after on the business metric. `[MODULE 2]` `[MODULE 4]`

#### Architecture concepts
The KPI translation layer `[MODULE 2]`; baseline capture at the start; SLA thresholds traced to their sources `[MODULE 4]`.

#### How it works
1. Tag each value claim with its pillar.
2. Capture the baseline before deployment.
3. Project in the same unit, net of review effort.
4. Subtract run cost from the sizing model.
5. State payback and its sensitivity.
6. Instrument the before-and-after metric and name its owner.

#### Architecture example
REAL-WORLD EXAMPLE – Claims triage:
- baseline 40 analyst-minutes per claim, from operations data;
- projected 15 minutes (review still required);
- net value = saved hours × rate − monthly run cost from sizing;
- payback 5 months; 8 months if volume is 30% lower. `[INFERENCE – illustrative numbers]`

#### Decision framework
| Situation | Pillar emphasis |
|---|---|
| Same task, fewer hours | Efficiency / productivity |
| New capability (e.g. review 100% instead of a sample) | Transformation |
| Budget-constrained sponsor | Cost (tiering, caching, batch) |
| Customer-facing latency promise | Performance SLA (p95) |

#### Exam decision signals
- "CFO asks what it saved" → **before/after business metric + auditable control**.
- "Assumes full automation, but a human reviews" → **overstated value**.
- "Average token cost used" → **understated run cost**.

#### Common traps
- COMMON TRAP: an estimated (intuitive) baseline.
- COMMON TRAP: a metrics-only outcome document.
- COMMON TRAP: quoting payback without sensitivity.

#### Must remember
- Five pillars; tag every claim.
- Measure the baseline; don't guess it.
- Net out the review effort.
- Run cost comes from the sizing distribution.
- Before + after + control + owner.

#### Quick recall
**"E-T-P-C-S: Efficiency, Transformation, Productivity, Cost, SLA."**

**Sources:** M2 Business value and ROI mapping; M4 Outcome document; EG Domain 1 objective wording.
