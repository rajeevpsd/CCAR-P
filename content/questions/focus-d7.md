# Domain 7 – Developer Productivity & Operations · Focus question bank (original practice items, not real exam questions)

## D7-F01
objective: 7.1
difficulty: Easy
select: 1
scenario: A 150-person engineering organisation wants to roll out Claude Code across five departments.
question: Which rollout pattern does the course recommend?
A: One champion per department proves a real workflow first, then adoption is seeded in batches.
B: Enable everyone at once by email, so that adoption starts in every department on the same day.
C: Enable only the platform team, and let other departments request access when they need it.
D: Hold a single all-hands demo, then enable all departments together the following week.
answer: A
why A: Correct. Champions absorb early friction, build local examples and become first-line support.
why B: A mass switch-on tends to produce confused first prompts and a retreat to old habits.
why C: That produces lumpy adoption and no local experts.
why D: A demo isn't a proven local workflow, and enabling everyone together repeats the mass switch-on problem.
lesson: Roll out through champions, then batches.
source: M5 Roll out through champions, then batches

## D7-F02
objective: 7.1
difficulty: Medium
select: 1
scenario: A release-notes Skill is shared with a 40-engineer group. A bad edit starts producing the wrong format for every team, and there is no quick way to revert to the previous version.
question: Which distribution approach would have prevented this?
A: Upload it as an org-provisioned Skill, so everyone in the organisation receives the same version.
B: Email the Skill file to each engineer, so they can keep their own copy locally.
C: Distribute it in an org-managed plugin with version-controlled updates and an owner.
D: Paste the procedure into each repository's CLAUDE.md, so that each team owns its own copy.
answer: C
why A: Org-provisioned Skills have no version pinning or native rollback; updates mean re-uploading.
why B: Local copies drift and can't be centrally updated or revoked.
why C: Correct. When a shared asset needs versioning, group targeting or rollback, distribute it in a plugin with an owner.
why D: Copies in CLAUDE.md drift and lose central governance.
lesson: A shared asset with no version and no way back is a liability the moment more than one person depends on it.
source: M5 Skills distribution; The skill that shipped with no way back

## D7-F03
objective: 7.1
difficulty: Medium
select: 1
scenario: A CI pipeline runs Claude Code unattended. It must never pause for a prompt, and must only run commands the team has explicitly allowed.
question: Which permission mode fits?
A: acceptEdits, so file edits and common filesystem commands proceed without prompting.
B: dontAsk, which auto-denies anything that would prompt and runs only what the allow rules cover.
C: bypassPermissions, so that every check is skipped and the pipeline never blocks.
D: plan, so the session stays read-only until someone approves the plan.
answer: B
why A: Other shell commands still prompt, which would stall an unattended run.
why B: Correct. The course describes dontAsk as the mode for locked-down CI.
why C: That skips all checks; it doesn't limit the run to allowed commands.
why D: Plan mode waits for a human approval that never comes in CI.
lesson: dontAsk for locked-down CI; bypassPermissions only in isolated containers or CI where no checks are wanted.
source: M1 Claude Code – permission boundaries and approval flows

## D7-F04
objective: 7.1
difficulty: Hard
select: 1
scenario: A team's Claude Code usage shows that many sessions start on the most capable model for routine tasks, and spend is rising quickly across 60 developers.
question: Which team-setup controls address this?
A: Monthly reminders to developers, asking them to choose cheaper models where possible.
B: A shared CLAUDE.md instruction asking Claude to keep its answers shorter.
C: Removing Claude Code from developers who use it more than average each month.
D: Model defaults, model allowlists, effort guidance, and spend, rate and per-user caps.
answer: D
why A: Reminders don't set a posture and are easily ignored.
why B: Shorter answers don't control which model a session starts on.
why C: Penalising heavy users hurts adoption without fixing defaults.
why D: Correct. That is the spend posture admins should set deliberately rather than inherit.
lesson: Set the spend posture before the first bill: defaults, allowlists, effort guidance and caps.
source: M5 Set the spend posture before the first bill

## D7-F05
objective: 7.3
difficulty: Medium
select: 1
scenario: Latency suddenly spiked for a deployment. No code changed, but requests now carry much longer conversation histories.
question: What should the first action be?
A: Switch to a more capable model tier, so that requests are processed more quickly.
B: Restart the services involved, since latency spikes are usually transient.
C: Trace the slowest span: context size, slow tools, cache misses.
D: Raise the SLA threshold, so that the latency alert stops firing.
answer: C
why A: A bigger tier usually adds latency and isn't diagnosis.
why B: Restarting doesn't address growing context.
why C: Correct. The module's first action for a latency spike: context size grew, a tool got slow, or a cache stopped hitting.
why D: That hides the symptom without finding the cause.
lesson: Latency spike: context grew, a tool slowed, or the cache stopped hitting; trace before you change anything.
source: M5 Symptom → likely architecture cause → first action

## D7-F06
objective: 7.3
difficulty: Medium
select: 1
scenario: Monthly cost rose 40% with no change in usage volume or features.
question: Which likely causes should the team check first?
A: The tier crept up or caching regressed; check both against the budget model.
B: Users are writing longer messages, so the prompt should be shortened for everyone.
C: The provider raised prices, so the team should immediately switch delivery routes.
D: There is a billing error, so the team should open a support ticket and wait.
answer: A
why A: Correct. That is the module's cause and first action for a cost rise without a usage change.
why B: Usage hasn't changed, and that is a guess, not a diagnosis.
why C: Switching routes on an unverified assumption is premature.
why D: Waiting skips the diagnostic that is likely to find the cause.
lesson: Cost up with flat usage: check tier creep and cache regression first.
source: M5 Symptom → likely architecture cause → first action

## D7-F07
objective: 7.3
difficulty: Hard
select: 1
scenario: Every time a recurring retrieval-drift issue appears, the team pages the architect, who fixes it personally within an hour.
question: What should the architect do to make support last?
A: Keep fixing it personally, because that is the fastest way to resolve each incident.
B: Ask the team to stop monitoring retrieval quality, so they aren't paged unnecessarily.
C: Move the team to a different model, so that retrieval drift stops occurring.
D: Help the team write a runbook entry and define an escalation path.
answer: D
why A: That's firefighting; it repeats the load instead of reducing it.
why B: That hides the problem.
why C: Retrieval drift comes from the corpus and index, not the model.
why D: Correct. Runbooks capture symptom-to-cause-to-action paths; escalation paths set the boundary of what the team resolves.
lesson: Support is translation, not firefighting: build runbooks and escalation paths for self-sufficiency.
source: M5 Build self-sufficiency: runbooks and escalation paths
