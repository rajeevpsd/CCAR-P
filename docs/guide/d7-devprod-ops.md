---
domain_id: D7
domain_name: Developer Productivity & Operational Enablement
weight: 7
priority: Medium
modules: [M5, M1]
---

# Domain 7 – Developer Productivity & Operational Enablement

**Weight:** 7% `[EXAM GUIDE]` · **About 4 of 63 items** `[INFERENCE]` · **Study priority:** Medium
**Mapped modules:** M5 (all) · M1 (Claude Code customization and governance layers)

| ID | Official objective `[EXAM GUIDE]` |
|---|---|
| 7.1 | Configure Claude tools and environments for teams (e.g., Claude Code) |
| 7.2 | Improve developer workflows using AI-assisted tooling |
| 7.3 | Support debugging and operational issue resolution |

---

### Objective 7.1 – Configure Claude tools and environments for teams (e.g., Claude Code)

#### What you need to know
**Four team-setup decisions** `[MODULE 5]`:

1. **Shared configuration:** a project-level baseline (shared CLAUDE.md, agreed tools and MCP servers, permission posture) that's reviewed and versioned once for everyone.
2. **Rollout:** a **champion per department first**, then batches. The champion absorbs early friction and becomes first-line support.
3. **Skills distribution:**
   | Mechanism | Best when | Governance |
   |---|---|---|
   | Org-provisioned Skill | Everyone needs it | Owner-managed; no version pinning or native rollback |
   | Plugin assigned to a group/org | Specific teams; governed rollout | Group targeting, install preferences, version-controlled updates from a repo (strongest) |
   | Claude Code project Skill | One team's projects | Lives in `.claude/skills/`, versions with the repo |
   | API Skill | Called by your products | Explicit version pinning |
   Server-managed Claude Code settings are a separate **settings** channel, not Skills distribution.
4. **Spend posture:** model defaults, model allowlists, effort guidance, and spend / rate / per-user caps, all set deliberately.

**Claude Code layers** `[MODULE 1]`:
- **Shaping** (what the agent knows and does): CLAUDE.md, Skills (on demand), subagents, MCP servers.
- **Governing** (what it may touch): hooks (deterministic lifecycle gates), permission modes, sandboxing.
- **Permission modes:**
  - **default**: asks before each action;
  - **acceptEdits**: approves file edits and common filesystem commands;
  - **plan**: read-only until a plan is approved;
  - **auto**: a separate classifier model reviews each action before it runs (fewer prompts, but no safety guarantee);
  - **dontAsk**: auto-denies anything not allow-listed; for locked-down CI;
  - **bypassPermissions**: skips all checks; containers or CI only.

  `[OFFICIAL ANTHROPIC DOCS – verified 2026-11-19]` (V9): six modes confirmed. The current page does **not** call auto mode a research preview; in recent versions it is the built-in starting mode for interactive sessions. The module's "research preview" label is outdated. `bypassPermissions` is for isolated containers or VMs only.

#### Why it matters
In one case a release-notes Skill shipped as a flat bundle with no versioning. A bad edit spread to 40 engineers and needed a manual fix while bad output kept shipping. `[MODULE 5]`

#### Architecture concepts
Version-controlled shared config; plugin registry with owners; spend guardrails; hooks for guarantees that must come from code rather than prompting. `[MODULE 1, 5]`

#### How it works
1. Define the shared baseline (CLAUDE.md, tools/MCP, permissions).
2. Choose a permission mode per environment (dev / CI / container).
3. Add hooks for must-not-skip checks.
4. Package shared procedures as Skills; distribute versioned assets through plugins and name an owner.
5. Set model defaults, allowlists and caps.
6. Roll out via champions, then batches.

#### Architecture example
REAL-WORLD EXAMPLE – A 200-engineer org: one champion per department converts a real workflow (code-review assist, test generation) over 2 weeks, runs sessions for batches of five, and tunes the shared CLAUDE.md before the broad rollout. `[MODULE 5]`

#### Decision framework
| Need | Choose |
|---|---|
| Group-scoped, versioned, rollback | Plugin |
| Org-wide, simple | Org-provisioned Skill |
| Repo-specific | Project Skill |
| Programmatic | API Skill (pinned) |
| Guarantee regardless of prompt | Hook |
| Locked-down CI | dontAsk mode (bypassPermissions only in isolated containers) |

#### Exam decision signals
- "Bad Skill change hit everyone, no rollback" → **plugin with versioned updates + owner**.
- "Everyone configured differently" → **shared configuration**.
- "Unexpected bill from the team" → **spend posture**.
- "Must always run lint before commit" → **hook**.

#### Common traps
- COMMON TRAP: an all-hands launch email instead of champions.
- COMMON TRAP: using bypassPermissions outside containers or CI.
- COMMON TRAP: relying on CLAUDE.md instructions for guarantees (use hooks).

#### Must remember
- Shared baseline · champions · governed Skills · spend caps.
- Shaping vs. governing layers.
- Plugins give the strongest Skill governance.
- Hooks are deterministic gates.

#### Quick recall
**"Baseline · Champions · Skills · Spend."**

**Sources:** M5 Configuring Claude tooling for teams; M1 Claude Code customization and governance layers.

---

### Objective 7.2 – Improve developer workflows using AI-assisted tooling

#### What you need to know
**Integrate into the existing workflow** (editor, review, test loop), not a separate chat window. Encode conventions and review standards as Skills and project config. `[MODULE 5]`
| Stage | Claude helps | Review still needed |
|---|---|---|
| Writing code | Boilerplate, tests, first drafts from a spec | Correctness and security; the author must understand it |
| Reviewing code | Diff summaries, likely issues, explanations | Human judgement; AI flags are input, not a verdict |
| Debugging | Hypotheses from symptom and trace | Verify against evidence before acting |
`[MODULE 5]`

**Two adoption failures** `[MODULE 5]`:
- **lumpy adoption** (a few heavy users, the rest barely);
- **stalling at basic chat** (never reaching tool use, repository-aware help or Skills).

**Diligence → a verification checklist** covering correctness, security, maintainability and human understanding. Automate checks wherever possible (regression tests, eval sets). `[MODULE 5]`

**Coding-agent reference architecture:** agentic exploration, then deterministic edit / test / review steps, with a human review gate before commit and regression tracking per language. `[MODULE 1]`

#### Why it matters
"The merge nobody could explain": generated code passed review and tests, then leaked data through unvalidated input. Speed had replaced understanding. `[MODULE 5]`

#### Architecture concepts
CI gates (tests, evals), review policy for AI-generated code, Skills that encode team standards, plan-mode or human approval before commits. `[MODULE 1, 5]`

#### How it works
1. Map friction points in the current workflow.
2. Integrate Claude at those points (IDE, PR review, test generation).
3. Enable higher-value features (repo-aware context, tools, Skills).
4. Write the verification checklist.
5. Automate the checklist in CI.
6. Require that the author can explain the change.
7. Track adoption and spread it via champions.

#### Architecture example
REAL-WORLD EXAMPLE – Team PR flow: Claude Code drafts tests and a diff summary; CI runs the regression suite and a security scan; the reviewer checklist includes "can the author explain input handling?"; merges need human approval. `[MODULE 5]` `[INFERENCE]`

#### Decision framework
| AI does | Human must |
|---|---|
| Draft, summarise, flag, hypothesise | Decide, verify, understand, approve |

#### Exam decision signals
- "Shipping faster, incident from code no one understood" → **verification checklist (human understanding)**.
- "Only 3 of 40 devs use it" → **lumpy adoption → champions**.
- "Team only asks it questions" → **stalled at chat → enable workflow integration**.

#### Common traps
- COMMON TRAP: a lower review bar for AI code.
- COMMON TRAP: treating AI review flags as the verdict.
- COMMON TRAP: equating access with adoption.

#### Must remember
- Integrate into the existing workflow.
- Same standards for AI-generated code.
- Verification checklist; automate it.
- Watch for judgement erosion.

#### Quick recall
**"Faster to write ≠ allowed to skip understanding."**

**Sources:** M5 Improving developer workflows; M1 Coding agent reference architecture.

---

### Objective 7.3 – Support debugging and operational issue resolution

#### What you need to know
**The support role is translation, not firefighting:** connect the operational *symptom* to its *architectural cause*, and teach the team that path. `[MODULE 5]`
| Symptom | Likely cause | First action |
|---|---|---|
| Gradual quality decline, no code change | Model or prompt change; retrieval drift | Compare against the eval set; check what changed |
| Latency spike | Larger context, slow tool, cache miss | Find the slowest span; token counts; cache behaviour |
| Intermittent tool failures | Auth, rate limits, unhandled error path | Trace one failed call end to end |
| Cost up, usage flat | Tier creep; caching regression | Per-request tier; cache hit rate |
`[MODULE 5]`

**Self-sufficiency** `[MODULE 5]`:
- a **runbook** of known symptom → cause → action paths;
- an **escalation path** stating who handles what and when an issue leaves the team.

Transient errors (429, 5xx, 529) → retry with exponential backoff; circuit breakers; fallbacks. `[MODULE 2]`

#### Why it matters
In one case quality slid for a quarter while dashboards stayed green, because the runbook entry linking gradual decline to retrieval drift didn't exist. `[MODULE 5]`

#### Architecture concepts
Telemetry and traces, eval re-runs, pinned versions, runbooks in the handoff documentation (6.4), an escalation matrix.

#### How it works
1. Capture the symptom precisely.
2. Check the change log (model, prompt, corpus, config).
3. Use traces to locate the failing span or step.
4. Map it to a cause class (4.4).
5. Apply the first action; verify.
6. Write or update the runbook entry.
7. Teach the team; refine the escalation path.

#### Architecture example
REAL-WORLD EXAMPLE – Intermittent CRM tool failures at peak. Tracing one failed call showed 429s from a shared API key. The fix: per-tenant keys, backoff, and a runbook entry ("intermittent 429 → check key-sharing and rate limits"). `[MODULE 2]` `[MODULE 5]` `[INFERENCE]`

#### Decision framework
| Architect fixes it directly when… | Team fixes it via runbook when… |
|---|---|
| A novel issue with no known path | The issue matches a documented symptom |
| Always finish by adding the path to the runbook | |

#### Exam decision signals
- "Architect pulled into every incident" → **runbooks + escalation path**.
- "Cost rose, traffic didn't" → **tier and cache check**.
- "Spikes at peak only" → **rate limits / contention**.

#### Common traps
- COMMON TRAP: firefighting without teaching.
- COMMON TRAP: retrying non-transient (4xx) errors.
- COMMON TRAP: fixing the symptom without attribution.

#### Must remember
- Symptom → cause → first action.
- Runbook + escalation path.
- Teach the path, don't just fix it.
- Backoff for transient errors.

#### Quick recall
**"Fix once, write it down, never fix it alone again."**

**Sources:** M5 Operational Support; M2 Reliability controls, glossary (transient errors, 5xx).
