# Domain 2 – Claude Models, Prompting & Context Engineering · Focus question bank (original practice items, not real exam questions)

## D2-F01
objective: 2.1
difficulty: Medium
select: 1
scenario: A team has run a summarisation pipeline on Sonnet for a year. A new engineer proposes switching to Opus "because it is the most capable model". There is no eval set for the pipeline.
question: What should the architect require before any tier change?
A: A short pilot week on Opus, judged by whether users say they prefer the summaries.
B: Approval from finance, since the only real question is whether the budget can absorb Opus.
C: A test set, a grading function, and a delta threshold fixed before the eval runs.
D: Nothing extra; moving up a tier can only improve quality, so it is safe to ship.
answer: C
why A: User preference over a week is unmeasured and lagging; it isn't a gate.
why B: Cost matters, but approving spend doesn't show the move improves quality.
why C: Correct. Every model change is a release, gated by an eval whose threshold is fixed in advance.
why D: A swap rewrites behaviour; without an eval there's no rollback signal, and it may cost more for no gain.
lesson: Treat every model swap as a release: test set, grading function, threshold set before you run it.
source: M1 Model & Context Strategy – gate every model change with an eval

## D2-F02
objective: 2.1
difficulty: Hard
select: 1
scenario: A routing classifier runs on every request with extended thinking enabled. Median latency is well above target. An eval shows the classifier's accuracy is the same with thinking off.
question: What is the best change?
A: Turn thinking off for the classifier, then test whether Haiku can take that step.
B: Keep thinking on, because extra reasoning cannot hurt a classifier's quality.
C: Move the whole pipeline to Opus with thinking on, so every step has the same configuration.
D: Increase the thinking budget, so the classifier reaches its answer faster on hard inputs.
answer: A
why A: Correct. Thinking tokens are billed as output and add latency; with no measured accuracy gain it should be off, and a cheaper tier may fit the step.
why B: "It can't hurt" isn't evidence; the eval shows it adds latency and cost for nothing.
why C: Uniform top-tier configuration is the 7× cost-overrun pattern.
why D: More thinking adds tokens and latency rather than removing them.
lesson: Enable extended thinking only for a measured accuracy gap; choose the tier per step.
source: M1 Extended thinking; When defaulting to Opus everywhere produced a 7× cost overrun

## D2-F03
objective: 2.3
difficulty: Easy
select: 1
scenario: A well-specified task asks Claude to convert support tickets into a fixed JSON schema. The team hasn't tried anything yet and wants to choose a prompting technique.
question: Which technique should they try first?
A: Chain-of-thought, so the model reasons about every field before it answers.
B: Few-shot with a dozen examples, covering every ticket type in advance.
C: Fine-tuning a model on historical tickets before any prompting is attempted.
D: Zero-shot with a clear instruction and output schema.
answer: D
why A: Step-by-step reasoning adds tokens and latency to a task that doesn't need it.
why B: Examples are worth adding only if zero-shot fails on format or judgement.
why C: Fine-tuning is the last step in the progression, after prompting, tools and stronger patterns.
why D: Correct. Start zero-shot for well-specified tasks and climb only when measurement shows a gap.
lesson: Use the lightest technique that meets the requirement: zero-shot first.
source: M1 Prompt engineering techniques – technique selection by task complexity

## D2-F04
objective: 2.3
difficulty: Medium
select: 1
scenario: A zero-shot prompt classifies complaint tone. Evals show the labels are right in most cases, but the model keeps confusing "frustrated" with "angry", a distinction the team finds hard to put into words.
question: What is the most appropriate next step?
A: Add chain-of-thought so the model explains its reasoning before labelling.
B: Add a few balanced examples showing the boundary between the two labels.
C: Move to a more capable tier, because the current model can't distinguish tone.
D: Remove the "frustrated" label, because the model can't apply it reliably.
answer: B
why A: The task isn't multi-step reasoning; the gap is a judgement that's easier to show than describe.
why B: Correct. Few-shot fits when the desired judgement is easier to show than describe, and balanced examples avoid introducing bias.
why C: A tier move needs eval evidence and isn't the first lever for a show-don't-tell gap.
why D: Changing the requirement to fit the model hides the problem.
lesson: Few-shot is for format or judgement that is easier to show than to describe; keep examples balanced.
source: M1 Technique selection; Avoiding bias in prompt construction

## D2-F05
objective: 2.3
difficulty: Hard
select: 1
scenario: A team's few-shot prompt for loan-application triage includes five examples, all of which are approvals. In aggregate the system is approving borderline applications more often than reviewers expect, although no single output looks wrong.
question: What is the most likely cause, and what is the fix?
A: Model non-determinism; run each request three times and take the majority answer.
B: Insufficient model capability; switch to a higher tier and keep the examples as they are.
C: Bias from unbalanced examples; balance them across the cases the system will see.
D: A missing output schema; add JSON formatting rules to the system prompt.
answer: C
why A: Repeated sampling doesn't remove a skew built into the examples.
why B: A stronger model still follows the skewed examples it is given.
why C: Correct. Examples that show only one kind of case steer outputs, and the effect shows up only in aggregate.
why D: Format rules don't address which outcome the examples are steering toward.
lesson: Bias introduced in the prompt is invisible in any single output; balance few-shot examples.
source: M1 Avoiding bias in prompt construction; M3 Fairness injection points

## D2-F06
objective: 2.5
difficulty: Medium
select: 1
scenario: A contract-analysis service sends a 6,000-token fixed instruction block and a per-request contract on every call. The team enabled caching but sees no savings. The prompt starts with the contract text, followed by the instructions.
question: What should change?
A: Shorten the instruction block, because caching only works on small prefixes.
B: Increase the cache TTL, so entries live long enough to be reused.
C: Switch to the Batch API, because caching doesn't work for documents.
D: Fixed instructions first, then the breakpoint, then the contract.
answer: D
why A: Caching savings grow with prefix length; a long stable prefix is the ideal case.
why B: The prefix changes on every request, so no TTL will make it hit.
why C: Batch is for asynchronous work and doesn't fix the ordering error.
why D: Correct. The cache matches a stable prefix; static content must come before dynamic content.
lesson: Static first, breakpoint, dynamic last; a dynamic prefix means the cache never hits.
source: M1 A cache that never hits; Caching mechanics

## D2-F07
objective: 2.5
difficulty: Medium
select: 1
scenario: An internal tool uses a 3,000-token system prompt, but it is called only a handful of times a day, with hours between calls.
question: Is enabling prompt caching likely to pay off?
A: Probably not: writes cost extra, and entries expire before they are reused.
B: Yes, because caching always lowers cost whenever a system prompt is reused.
C: Yes, provided the dynamic content is placed before the system prompt in each request.
D: No, because caching can only be applied to prompts longer than one hundred thousand tokens.
answer: A
why A: Correct. With a five-minute default TTL and infrequent calls, the write overhead isn't amortised.
why B: Caching is a design decision; for rare calls it can cost more than it saves.
why C: Dynamic content first would stop the cache from ever hitting.
why D: There's no such rule in the course material; the issue is call frequency, not size.
lesson: Model cache economics: call frequency, prefix size, write cost and TTL.
source: M1 When the write overhead is not worth it; M2 Sizing – 5-minute default TTL

## D2-F08
objective: 2.5
difficulty: Medium
select: 1
scenario: Five product teams each paste their own copy of a "compliance summary" prompt into their code. The copies have drifted and now behave slightly differently. Legal wants one approved version that can be rolled back.
question: Which reuse approach fits best?
A: A shared prompt library that engineers assemble and adapt freely in their own code.
B: A longer system prompt in each team's repository, so that every copy is more complete.
C: A versioned Skill that packages the procedure as one governed, versioned unit.
D: A wiki page with the latest wording, which each team copies when it remembers.
answer: C
why A: A library suits often-tweaked fragments; it doesn't give the approval and rollback legal needs.
why B: More text in each copy makes the drift problem larger, not smaller.
why C: Correct. A stable procedure shared across teams that needs versioning, approval and rollback leans to a Skill.
why D: Manual copying is exactly how the versions drifted.
lesson: Prompt library for often-tweaked fragments; Skill for stable, widely shared, governed procedures.
source: M1 Modular prompt libraries vs Skills; The reuse decision

## D2-F09
objective: 2.5
difficulty: Hard
select: 1
scenario: A partner wants to attach a versioned Skill to Messages API requests from its own product rather than using Claude Code.
question: Which statement about this integration is accurate according to the course?
A: Skills can only be used inside Claude Code and cannot be attached to API requests.
B: The Skill is attached through container.skills and needs the Code Execution Tool to run.
C: A Skill attached to an API request is loaded in full on every call, like a system prompt.
D: Skills replace MCP, so the partner's tools should be rewritten as Skills.
answer: B
why A: The course describes API Skills, published and versioned through the skills endpoint.
why B: Correct. Module one says Skills attach via container.skills, are versioned via /v1/skills, and require the Code Execution Tool, which brings a sandboxed execution dependency.
why C: The course doesn't describe API Skills this way; Skills are progressive by design.
why D: A Skill is one mechanism to weigh alongside MCP and direct tool use, not a replacement.
lesson: Skills are an integration mechanism too: container.skills, /v1/skills versioning, Code Execution Tool dependency.
source: M1 Skills as an integration mechanism
