# Domain 4 – Evaluation, Testing & Optimization · Focus question bank (original practice items, not real exam questions)

## D4-F01
objective: 4.2
difficulty: Medium
select: 1
scenario: A team needs to check that extraction outputs are valid JSON with the required fields, and also that the free-text summaries are faithful to the source.
question: Which grading approach follows the grading ladder?
A: An LLM judge for both checks, so that a single grading method covers everything.
B: Human review of every output, since both checks matter equally in production.
C: Code-based checks for both, using keyword matching to judge faithfulness.
D: Code for the JSON and field checks; a calibrated LLM judge for faithfulness.
answer: D
why A: Using a judge where code can check is slower, costlier and can drift.
why B: Human review is the last resort and doesn't scale.
why C: Keyword matching can't judge whether a summary is faithful.
why D: Correct. Use code wherever the behaviour allows it, and a calibrated judge when interpretation is needed.
lesson: Grading ladder: code first, a calibrated LLM judge for interpretation, humans as the last resort.
source: M2 The grading ladder

## D4-F02
objective: 4.2
difficulty: Hard
select: 1
scenario: A team deploys an LLM judge to score answer helpfulness. It returns free-form 1-to-10 scores, uses the same model that produced the answers, and has never been compared with human ratings.
question: What should be fixed first?
A: Calibrate it against human labels, constrain the verdicts, and grade with another model.
B: Increase the number of items it scores, so its errors average out across the dataset.
C: Raise the pass threshold to 8 out of 10, so only clearly helpful answers pass.
D: Replace it with exact-match checks against a single reference answer per question.
answer: A
why A: Correct. Rigorous judging needs calibration, constrained labels and a different model to avoid self-preference.
why B: An uncalibrated judge can be systematically wrong; volume doesn't fix bias.
why C: A threshold on uncalibrated scores is still unanchored.
why D: Helpfulness needs interpretation that exact match can't provide.
lesson: An uncalibrated judge produces confident scores that may mean nothing; calibrate before you trust it.
source: M2 Judge calibration; grading ladder – rigorous judging

## D4-F03
objective: 4.2
difficulty: Medium
select: 1
scenario: A chat assistant passes every single-turn eval, but users complain that it forgets details they gave earlier and invents facts in follow-up answers.
question: What is missing from the test framework?
A: A larger single-turn dataset with more varied prompts and edge cases.
B: Multi-turn evals with their own golden transcripts.
C: A faster model, so the conversation history can be processed more quickly.
D: A shorter system prompt, so more of the conversation fits in the window.
answer: B
why A: More single-turn items still don't test behaviour across a conversation.
why B: Correct. Multi-turn evals score whole conversations and need their own golden dataset.
why C: Speed doesn't test or fix context retention.
why D: It may help capacity, but it isn't a test framework.
lesson: Single-turn evals can't tell you how a system holds up across a conversation; multi-turn evals are a separate category.
source: M2 Evals as the gating mechanism – multi-turn evals

## D4-F04
objective: 4.3
difficulty: Medium
select: 1
scenario: A team plans to test a new prompt. Their hypothesis reads: "The new prompt is better."
question: Why is that hypothesis unusable?
A: It is too long to state in the experiment-tracking tool that the team uses.
B: It should be phrased negatively, as a null hypothesis, before it can be tested.
C: It names no treatment, metric or threshold, so any result can be read as a win.
D: Prompts can't be A/B tested; only model versions can be compared that way.
answer: C
why A: Length isn't the issue; specificity is.
why B: Wording style isn't the problem the course identifies.
why C: Correct. A usable hypothesis names the treatment, the primary metric's expected direction, the threshold and any secondary constraints.
why D: Prompt changes are a standard A/B test subject.
lesson: A hypothesis must be specific and falsifiable: treatment, metric, threshold, constraint.
source: M2 Structured A/B testing – hypothesis

## D4-F05
objective: 4.3
difficulty: Hard
select: 1
scenario: A test of a new prompt shows task success rising from 70% to 73% at statistical significance, but cost per completion rises 30% and the budget is tight.
question: How should the result be read?
A: Ship it immediately, because the improvement is statistically significant.
B: Rerun the test with a smaller sample until the cost difference disappears.
C: Ignore cost, because the primary metric was task success and it went up.
D: Weigh the gain against the cost before deciding.
answer: D
why A: Significance says the effect is probably real, not that it's worth shipping.
why B: Shrinking the sample to change the result is outcome shopping.
why C: Secondary metrics that degrade must be considered before declaring a winner.
why D: Correct. Ask whether the effect is large enough to justify the overhead, and whether any secondary metric degraded.
lesson: Statistical significance and practical value are different questions; check secondary metrics.
source: M2 Reading results without overclaiming

## D4-F06
objective: 4.3
difficulty: Medium
select: 1
scenario: A regulated claims system wants to validate a new model version against real traffic, but exposing any customer to an unvalidated change isn't permitted.
question: Which approach fits?
A: Shadow testing, scored offline while users get the current version.
B: A live A/B test with a very small treatment group, such as 1% of traffic.
C: Switch everyone to the new version over a weekend, when traffic is lowest.
D: Skip validation, since the model provider tests new versions before release.
answer: A
why A: Correct. Shadow testing decides before any user sees the new version; it is often the only acceptable option in regulated settings.
why B: Even a small live split exposes real users to an unvalidated change.
why C: That exposes everyone, with no measurement.
why D: A model change is a release; the partner must validate it against its own workload.
lesson: Use shadow testing when one bad output is too risky or a live split isn't allowed.
source: M2 Shadow testing

## D4-F07
objective: 4.3
difficulty: Hard
select: 1
scenario: A prompt change passed a two-week A/B test during a quiet period. A seasonal spike then brought a surge of unusual claim types, and performance on those dropped sharply.
question: Which LLM-specific experiment risk does this show?
A: The test used too many users, which diluted the effect of the treatment.
B: Interaction effects with input types that were rare in the test.
C: Statistical significance was reached too early, before the test had settled.
D: The control group received the new prompt by mistake partway through the test.
answer: B
why A: A larger sample normally strengthens, rather than dilutes, a test.
why B: Correct. A change can help typical inputs and hurt rare ones, so align the test period and input distribution with real traffic.
why C: Nothing in the scenario points to stopping early.
why D: Nothing in the scenario suggests contamination.
lesson: In LLM experiments, align the test period and input mix with production; watch interaction effects.
source: M2 Reading results without overclaiming – interaction effects

## D4-F08
objective: 4.6
difficulty: Medium
select: 1
scenario: A sponsor's KPI dashboard tracks average handle time and first-contact resolution. The engineering dashboard tracks latency, task success and error rate. At the business review nobody can explain why handle time moved.
question: What should have been built at design time?
A: A separate engineering dashboard for each business unit that uses the assistant.
B: A higher sampling rate on the request traces collected by the observability stack.
C: A translation layer from technical metrics to the sponsor's KPIs.
D: A monthly written report summarising every alert that fired during the period.
answer: C
why A: More dashboards don't connect technical and business metrics.
why B: More sampling of technical data still doesn't speak the sponsor's language.
why C: Correct. The translation layer connects technical metrics to the business metrics they drive, so it can be queried live.
why D: A retrospective report is the reconstruction the translation layer is meant to avoid.
lesson: Build the technical-to-business translation layer when the system is designed.
source: M2 Connecting observability data to business value

## D4-F09
objective: 4.6
difficulty: Medium
select: 1
scenario: A deployment's aggregate cost per request looks normal, but the monthly bill keeps exceeding forecasts.
question: Which monitoring capability is most likely missing?
A: A higher-level dashboard that rolls all metrics into one health score.
B: Per-request decomposition of cost and tokens to expose the heavy tail.
C: An alert that fires whenever the error rate rises above zero.
D: A weekly summary email sent to engineering leads with the top metrics.
answer: B
why A: More aggregation hides the tail further.
why B: Correct. Aggregate metrics can look healthy while a small fraction of requests consumes most of the budget.
why C: Error rate isn't the issue here.
why D: A summary of aggregates repeats the same blind spot.
lesson: Aggregates catch obvious failures; per-request decomposition catches the rest.
source: M2 Observability at scale – metric aggregation; cost, complexity, risk

## D4-F10
objective: 4.6
difficulty: Hard
select: 1
scenario: Over eight weeks a deployment's eval score drifted down steadily. The error rate stayed flat, so no alert fired, and the next scheduled review is a quarter away.
question: What should the monitoring design include?
A: A quality-drift trigger mapped to an owner and an action in the governance table.
B: A tighter error-rate alert threshold, so smaller error spikes are reported sooner.
C: More frequent quarterly reviews of the full dashboard by the engineering team.
D: A larger eval dataset, scored at the next quarterly review against the baseline.
answer: A
why A: Correct. Monitoring needs a decision layer: slow drifts, not just hard failures, map to triggers, owners and actions.
why B: The error rate didn't move, so a tighter threshold still wouldn't fire.
why C: Scheduled reviews are what let the drift run for weeks.
why D: Better measurement scored too late still catches it too late.
lesson: Map slow quality drift to a trigger with an owner; dashboards alone don't decide anything.
source: M4 The observability stack that replaced the feedback loop; M5 The drift that waited for a quarterly review

## D4-F11
objective: 4.6
difficulty: Medium
select: 1
scenario: A team sets up anomaly alerts for a new deployment and asks which thresholds the course gives as examples.
question: Which pair matches the course's examples?
A: A cost spike above 150% of the seven-day average, and p95 latency crossing the SLA threshold.
B: Any single request costing more than one cent, and median latency above 500 milliseconds.
C: Error rate above 0%, and output token counts that differ from yesterday's average.
D: Daily active users below target, and more than ten support tickets in an hour.
answer: A
why A: Correct. Module two gives these two examples, and notes that model drift needs periodic distribution comparison instead.
why B: These aren't the course's examples, and median latency isn't the SLA target.
why C: Those would alert constantly and aren't the course's examples.
why D: These are product metrics, not the course's anomaly examples.
lesson: Alert on cost spikes against a baseline and on p95 crossing the SLA; compare distributions for drift.
source: M2 Observability at scale – anomaly detection
