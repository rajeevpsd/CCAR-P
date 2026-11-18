---
domain_id: D2
domain_name: Claude Models, Prompting & Context Engineering
weight: 13
priority: High
modules: [M1, M2, M5]
---

# Domain 2 – Claude Models, Prompting & Context Engineering

**Weight:** 13% `[EXAM GUIDE]` · **About 8 of 63 items** `[INFERENCE]` · **Study priority:** High
**Mapped modules:** M1 (Model & Context Strategy, Prompting as Architecture, Caching/Skills) · M2 (Sizing, caching costs) · M5 (Skills distribution)

> Version note: model names and thinking controls change often (see source analysis X2/X3). This guide teaches tier reasoning, not version trivia.

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 2.1 | Select appropriate Claude models based on trade-offs |
| 2.2 | Design system prompts, templates, and guardrails |
| 2.3 | Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought) |
| 2.4 | Optimize context windows and manage token usage |
| 2.5 | Implement prompt reuse strategies (caching, modular prompts, Skills) |

---

### Objective 2.1 – Select appropriate Claude models based on trade-offs

#### What you need to know
**The tiers** (Opus, Sonnet, Haiku) trade capability against cost and latency. `[MODULE 1]`
- **Sonnet is the default** starting point.
- **Opus:** demanding reasoning, advanced coding, research synthesis, *when an eval shows Sonnet misses the bar*.
- **Haiku:** only when an eval confirms the quality trade-off is acceptable (e.g. classification, routing).

**Every model change is a release.** Gate it with `[MODULE 1]`:
- a curated, representative test set;
- a grading function;
- a **delta threshold set before running**.

**Use different tiers per step** where the evals support it. `[MODULE 1]`
**Context window capacity is part of the tier decision** (e.g. 1M vs. 200k tokens decides whether a 300-page contract needs chunking). `[MODULE 2]`
**Extended thinking:** adaptive thinking with an effort setting is the recommended control on current models. Thinking tokens are billed as output. Enable it only for a measured accuracy gap after prompt work. `[MODULE 1]` (Version specifics: verify.)
**Version pinning** plus monitoring the deprecations page. `[MODULE 2]`
A prompt tuned on one model is a starting point for another, not a finished artifact. `[MODULE 1]`

#### Why it matters
"Not choosing a model is equivalent to choosing the most expensive one." One team defaulting to Opus everywhere ran at 7× the cost model; per-step tiering cut 71%. `[MODULE 1]`

#### Architecture concepts
Model router per step; eval-gated migration; partial migration by input class; rollback criteria. `[MODULE 1]`

#### How it works
1. Start every step on Sonnet.
2. Build a per-step eval, stratified by input type.
3. Try one tier lower on easy steps and one higher on hard ones.
4. Accept only where per-category scores clear the pre-set floor.
5. Route by input class if only some classes pass.
6. Pin versions; re-validate on any update.

#### Architecture example
REAL-WORLD EXAMPLE – A document pipeline moves to Haiku. Two document types fall below the 0.85 floor and stay on Sonnet through the existing classifier; the rest move to Haiku. Cost drops without the regression. `[MODULE 1]`

#### Decision framework
| Use Opus when… | Use Haiku when… |
|---|---|
| Eval shows a Sonnet gap on hard reasoning or synthesis | Eval shows acceptable quality on simple, high-volume steps |
| **Avoid** as a blanket default | **Avoid** on steps that fail per-category floors |

#### Exam decision signals
- "Use the best model to be safe" → **trap**.
- "Downgrade to save cost" → **eval with a pre-set floor, per category**.
- "Model version rolled forward" → **pin + re-validate**.

#### Common traps
- COMMON TRAP: judging a downgrade on the average score only.
- COMMON TRAP: setting the threshold after seeing the results.
- COMMON TRAP: "smallest model regardless of task fit" (EG Sample 2 distractor).

#### Must remember
- Sonnet default; move only on evidence.
- A model swap is a release.
- Thresholds are set in advance.
- Per-step and per-category decisions.
- Pin versions.

#### Quick recall
**"Start Sonnet · Prove the move · Pin the version."**

**Sources:** M1 Model selection, eval gate, Sonnet→Haiku case, Opus case, extended thinking; M2 Sizing, scoping-call case, version pinning.

---

### Objective 2.2 – Design system prompts, templates, and guardrails

#### What you need to know
An enterprise system prompt is a **designed asset** with structure: role and scope, constraints (must / must not), and an **output contract**. Ambiguity in a reused asset is a defect multiplied across every request. `[MODULE 1 – Prompting as Architecture]`
**Templates:** parameterised slots plus fixed scaffolding that carries the consistency and safety guarantees. Filling a slot can't remove a constraint, so *the safe path is the default path*. `[MODULE 1]`
**Description** (an AI Fluency competency): state scope, format and constraints explicitly. Underspecification is a gap the model fills differently each time. `[MODULE 1]`
**Enforce guardrails structurally:** put the rule in the output contract or format, not only in the role text. `[MODULE 1 – reusable prompt asset]`
An underspecified guardrail is worse than a missing one, because it looks like a control without being one. `[MODULE 1]`
The system prompt shapes behaviour but **isn't enforcement**; pair it with runtime controls. `[MODULE 3]`

#### Why it matters
A vague prompt is paid for in every request that needs correcting or retrying. Templates concentrate the complexity where it can be reviewed and governed. `[MODULE 1]`

#### Architecture concepts
Prompt asset versioning; slot validation; output schema; runtime screening and authorization behind the prompt (5.1).

#### How it works
1. Write role and scope (in and out of bounds).
2. List must and must-not constraints.
3. Define the exact output contract.
4. Make the safety rules part of the format (e.g. no field exists in which to promise a refund).
5. Parameterise only the variable content.
6. Diagnose gaps: for each requirement, is it *stated* or only *hoped for*?
7. Version and govern the template.

#### Architecture example
REAL-WORLD EXAMPLE – Support reply template:
- stable prefix: role, tone, output contract, a rule never to promise refunds or timelines;
- slots: the ticket and the manual section;
- the output contract requires a cited manual section and has no commitment field. `[MODULE 1 – model answer]`

#### Decision framework
| Put it in the prompt when… | Put it in runtime controls when… |
|---|---|
| Steering tone, scope, format | It must hold against adversarial input, or the action has side effects |
| Both, for anything high-stakes | |

#### Exam decision signals
- "Outputs vary in format across requests" → **output contract missing**.
- "Agent sometimes promises refunds" → **structural guardrail + output screening**.
- "Each team pastes its own version" → **template / Skill governance** (2.5).

#### Common traps
- COMMON TRAP: guardrails stated only in prose.
- COMMON TRAP: letting slots override scaffolding.
- COMMON TRAP: assuming the system prompt is a security boundary.

#### Must remember
- Role · Scope · Constraints · Output contract.
- Safe path = default path.
- Make the implicit explicit.
- Prompt ≠ enforcement.

#### Quick recall
**"Scope it · Format it · Bound it · Version it."**

**Sources:** M1 Prompting as Architecture, reusable prompt asset exercise; M3 Alignment layers.

---

### Objective 2.3 – Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought)

#### What you need to know
| Technique | What | When | Source |
|---|---|---|---|
| **Zero-shot** | Instruction only | Well-specified tasks the model handles reliably; **try first** | `[MODULE 1]` |
| **Few-shot** | A handful of input/output examples | Format or judgement easier to *show* than describe | `[MODULE 1]` |
| **Chain-of-thought** | Reason step by step before answering | Multi-step reasoning, logic, when the path matters | `[MODULE 1]` |
Progress deliberately: start zero-shot, add examples only if needed, add reasoning only if the task's structure demands it. Each step adds tokens and latency. `[MODULE 1]`

**Across models:** more capable models need less scaffolding. Re-tune when you change models; the prompt and model are shipped as a pair. `[MODULE 1]`

**Bias:** leading phrasing and unbalanced few-shot sets steer outputs. Phrase neutrally and balance examples. `[MODULE 1]`

**Prompting before fine-tuning:** prompt → tools or retrieval → stronger pattern → fine-tune (rarely; access is limited). `[MODULE 1]`

#### Why it matters
Heavier techniques are a recurring tax on every call. Stale few-shot examples quietly steer the model wrong. `[MODULE 1]`

#### Architecture concepts
Example sets as maintained content (versioned, reviewed for balance); per-technique evals.

#### How it works
1. Write a clear zero-shot instruction and eval it.
2. If format or judgement fails, add balanced examples covering the real cases.
3. If multi-step reasoning fails, add step-by-step reasoning (or adaptive thinking, 2.1).
4. Re-measure cost and latency.
5. Refresh examples as the task evolves.

#### Architecture example
REAL-WORLD EXAMPLE – Ticket classification into 12 categories: zero-shot confused two similar categories. Adding 2 balanced examples per confusable category fixed it. Chain-of-thought added latency with no gain, so it was not used. `[INFERENCE – applies M1 progression]`

#### Decision framework
| Use few-shot when… | Use CoT when… |
|---|---|
| Output style or label boundary is hard to describe | Correctness depends on intermediate reasoning |
| **Avoid** unbalanced or stale examples | **Avoid** on simple classification (cost with no gain) |

#### Exam decision signals
- "Format inconsistent though instructions are clear" → **few-shot**.
- "Arithmetic or multi-step logic errors" → **CoT** (or code execution for precision `[MODULE 1]`).
- "Outputs skew toward one class" → **check example balance and phrasing**.

#### Common traps
- COMMON TRAP: CoT everywhere.
- COMMON TRAP: few-shot sets that show only happy cases.
- COMMON TRAP: fine-tuning first.
- COMMON TRAP: using CoT where deterministic computation should own the answer.

#### Must remember
- Zero → few → CoT, only as needed.
- Show rather than tell for format.
- Balance examples.
- Re-tune per model.

#### Quick recall
**"Tell · then Show · then Think."**

**Sources:** M1 Prompt engineering techniques across models, Try prompting before fine-tuning, four properties (steerability).

---

### Objective 2.4 – Optimize context windows and manage token usage

#### What you need to know
**Working memory is a hard edge.** Content outside the window doesn't exist for the model. Two distinct errors `[MODULE 1]`:
- **Oversized request** (rejected before generation): `400 invalid_request_error` ("prompt is too long", token limit) or `413 request_too_large` (byte limit).
- **Generation hits the ceiling:** stop reason `model_context_window_exceeded`, with truncated output.

**Measure, don't estimate:** read the response's `usage` field and use the **token-counting API** before sending. Characters-per-token ratios are rough. `[MODULE 1]`

**Budget below the ceiling:** largest realistic conversation + retrieved context + system prompt + working scratch + margin. *The window is a ceiling, not a target.* `[MODULE 1]`

**Separate the terms** `[MODULE 1]`:
- **context window** = active attention, reset between calls;
- **retrieval** = fetched knowledge;
- **persistent application state** = owned by your system, needs a tool call;
- **summaries / memory** = continuity managed by the application.

**Token distributions are skewed;** model the tail. `[MODULE 2]`
Attention quality can degrade on very long contexts before the hard limit. `[MODULE 1]`
Strategy (progressive vs. monolithic, 3.8) and **sizing** are separate decisions. `[MODULE 1]`

#### Why it matters
Both the limit and the bill are per token. A conversation that starts at 4k tokens can be carrying 80k by turn 30. `[MODULE 1]`

#### Architecture concepts
Token budget per component; front-load critical information; summarise across turns; check the usage field on every response; chunk inputs that exceed the window. `[MODULE 1]` `[MODULE 2]`

#### How it works
1. Count tokens for each component (system, history, retrieval, tools, output).
2. Model the p95 conversation, not the average.
3. Set a budget with margin.
4. Choose a strategy to stay under it (progressive, retrieval, compaction).
5. Handle 400/413 before sending and `model_context_window_exceeded` after.
6. Monitor usage in production.

#### Architecture example
REAL-WORLD EXAMPLE – A long legal chat began returning truncated answers late in sessions (`model_context_window_exceeded`). Fix: compact earlier turns into a decision summary (keeping clause IDs verbatim), retrieve clauses just in time, and keep the stable policy as a cached prefix. `[INFERENCE – applies M1]`

#### Decision framework
| Symptom | Cause | Response |
|---|---|---|
| 400 prompt too long | Request over the token limit | Trim, chunk, retrieve instead |
| 413 | Body over the byte limit | Reduce payload (e.g. attachments) |
| Truncated output, context-window stop reason | Generation hit the ceiling | Reduce input / compact; raise output headroom |
| Cost growing per turn | Accumulation | Progressive + compaction |

#### Exam decision signals
- "Fits, but output stops early" → **context-window stop reason**, not a 400.
- "Estimated tokens by characters" → **use token counting / usage**.
- "Designed to the full window" → **no margin**.

#### Common traps
- COMMON TRAP: confusing an oversized request with a mid-generation ceiling.
- COMMON TRAP: designing to the ceiling.
- COMMON TRAP: assuming the model remembers prior calls.

#### Must remember
- 400/413 = rejected before generation; `model_context_window_exceeded` = stopped during it.
- Usage field + token counting.
- Budget with margin.
- Memory is application-managed.

#### Quick recall
**"Count it · Budget it · Leave room."**

**Sources:** M1 How Claude Behaves (working memory), Model & Context Strategy (terms, sizing); M2 Sizing.

---

### Objective 2.5 – Implement prompt reuse strategies (caching, modular prompts, Skills)

#### What you need to know
**Prompt caching** reuses a stable prefix `[MODULE 1]` `[MODULE 2]`:
- **Cache breakpoints:** mark where the fixed part ends.
- **Ordering:** static before dynamic, always.
- **TTL:** match it to how often content changes and how often it's called (default 5 minutes `[MODULE 2]`).
- **Write overhead:** writes cost more than standard input. For rarely called or small prefixes, caching can cost more than it saves.
- Needs explicit `cache_control` markers. `[MODULE 2]`
- The response is identical with or without caching. `[MODULE 2]`
- If cached content must reflect live state, caching opens a consistency window. `[MODULE 2]`

**Modular prompt library vs. Skill** `[MODULE 1]`:
| Lean toward library | Lean toward Skill |
|---|---|
| Assembled and tweaked per use | A stable procedure run the same way every time |
| Shared within one codebase or team | Distributed across teams or products |
| Lightweight governance | Needs versioning, approval, rollback |

**A Skill** is a SKILL.md with instructions, optional scripts and version management, travelling as one governed unit. On the API it's attached via `container.skills`, published and versioned via `/v1/skills`, and **requires the Code Execution Tool** (a sandboxed execution dependency). `[MODULE 1]`
**Team distribution:** org-provisioned, plugin assigned to a group (strongest governance + rollback), Claude Code project Skills (`.claude/skills/`, versioned with the repo), API Skills (version pinning). `[MODULE 5]`
Skills load **progressively**: metadata first, content on demand. `[OFFICIAL ANTHROPIC DOCS – Agent Skills]`

#### Why it matters
A cache that never hits: one team put the per-request document *before* the fixed instructions, and the prefix changed on every call. Ungoverned prompts copied across teams drift into many versions. `[MODULE 1]`

#### Architecture concepts
Prefix design; versioned prompt assets; Skill registry with a trusted-source policy and audit (5.1); rollback path.

#### How it works
1. Separate static from dynamic content.
2. Order static first; place the breakpoint.
3. Model cache economics (frequency, prefix size, write cost, TTL).
4. Decide library vs. Skill by repeatability, distribution and governance.
5. Package stable procedures as versioned Skills; choose a distribution mechanism (7.1).
6. Audit third-party Skills before use.

#### Architecture example
REAL-WORLD EXAMPLE – A support org drafts replies hundreds of times a day:
- stable prefix (role, tone, contract, guardrail) is cached; ticket and manual section come after the breakpoint;
- shipped as a **versioned Skill**, not pasted templates, for central governance and rollback. `[MODULE 1 – model answer]`

#### Decision framework
| Use caching when… | Skip caching when… |
|---|---|
| Long, stable prefix; frequent calls within the TTL | Rare calls; small prefix; content must be live |
| **Use Skill** for repeatable, distributed, governed procedures | **Use library** for flexible, team-local assembly |

#### Exam decision signals
- "Caching enabled, no savings" → **dynamic content before the breakpoint** / low frequency.
- "Same procedure across many teams, needs rollback" → **Skill (via plugin)**.
- "8k identical prefix each call" → **cache** (EG Sample 2).

#### Common traps
- COMMON TRAP: caching everything.
- COMMON TRAP: forgetting the Code Execution Tool dependency of API Skills.
- COMMON TRAP: copy-paste reuse with no versioning.

#### Must remember
- Static first · breakpoint · TTL · write cost.
- Library = flexible; Skill = governed.
- Skills load progressively.
- Version everything you share.

#### Quick recall
**"Fixed first, cache it; repeat often, Skill it; share widely, version it."**

**Sources:** M1 Caching mechanics, modular prompts and Skills; Skills as an integration mechanism; M2 Sizing (caching); M5 Skills distribution; Official – Agent Skills.
