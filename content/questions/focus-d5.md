# Domain 5 – Governance, Safety & Risk Management · Focus question bank (original practice items, not real exam questions)

## D5-F01
objective: 5.1
difficulty: Medium
select: 1
scenario: An internal assistant refused every harmful prompt in testing, so the team assumed it would also refuse requests for another business unit's records. In production it returned such a record for an ordinary-looking request.
question: What was the design mistake?
A: The model's safety training should have been tuned more strictly for this partner.
B: The output filter's toxicity threshold was set too permissively for internal use.
C: A domain rule was left to trained alignment and enforced nowhere.
D: The team should have used a larger model with stronger built-in safety behaviour.
answer: C
why A: Trained alignment is general by design and can't know a partner's domain policy.
why B: The request wasn't toxic; screening for harmful content doesn't enforce data access rules.
why C: Correct. Claude can't enforce a rule it was never given; deployment rules need application-layer enforcement.
why D: No model tier knows your authorisation model.
lesson: Training reduces broad harm; your domain policy must live in a layer you build.
source: M3 When trained refusals are mistaken for a domain policy

## D5-F02
objective: 5.1
difficulty: Medium
select: 1
scenario: A RAG assistant screens every user message for prompt injection. An attacker plants instructions in a document that later gets indexed, and the model follows them.
question: Which control was missing?
A: A stronger user-input classifier, tuned to catch more of the known jailbreak phrases.
B: Screening retrieved content and tool outputs before they are added to the model's context.
C: A rule that users may only ask questions about documents they uploaded themselves.
D: A longer system prompt that tells the model to ignore any instructions found in documents.
answer: B
why A: The malicious text never passed through user input, so input screening can't see it.
why B: Correct. Indirect injection arrives through retrieved content or tool outputs and needs its own screening.
why C: Document ownership doesn't stop planted instructions in shared corpora.
why D: Instructions aren't enforcement and can be overridden.
lesson: Screen retrieved content and tool outputs, not just user input; indirect injection is the dominant vector.
source: M3 A second injection vector

## D5-F03
objective: 5.1
difficulty: Hard
select: 1
scenario: The team's own output-screening service starts timing out under peak load. The calling code currently lets responses through unscreened when the service errors.
question: What should the architect change?
A: Make it fail closed and log every failed gate.
B: Leave it as is; passing traffic keeps the user experience smooth during peaks.
C: Remove output screening, because Anthropic's built-in controls already cover it.
D: Increase the timeout to several minutes, so the service has more time to answer.
answer: A
why A: Correct. An operator-built guardrail that fails open gives the appearance of protection with none of the function.
why B: That silently drops protection when it's most likely to be tested.
why C: Built-in controls don't enforce the partner's domain policy.
why D: Long timeouts degrade latency and still leave the failure direction undefined.
lesson: Decide the failure direction explicitly; safety guardrails you build should fail closed.
source: M3 Fail open versus fail closed

## D5-F04
objective: 5.1
difficulty: Hard
select: 1
scenario: A team wants to install a third-party Skill that claims to "format reports". On inspection, its bundle reads environment variables and makes an outbound network request.
question: What is the right action?
A: Install it, since the platform screens Skills automatically before they run.
B: Install it, but rely on output screening to catch anything unusual afterwards.
C: Record a reject or remediate verdict: the behaviour is out of scope for a formatter.
D: Install it once, observe its behaviour in production, then decide whether to keep it.
answer: C
why A: Don't assume the platform screens Skills; verify what vetting exists.
why B: By the time output screening sees anything, the code has already run.
why C: Correct. Audit against the stated purpose; credential reads and network calls are findings. Then reject, or remediate and re-audit, and run approved Skills sandboxed with least privilege.
why D: Testing an untrusted bundle in production is the risk the audit exists to avoid.
lesson: Audit Skills before trust, record a verdict, confine them at runtime, and prefer trusted sources.
source: M3 Skill supply-chain security

## D5-F05
objective: 5.2
difficulty: Medium
select: 1
scenario: Users of a public chatbot paste enormous blocks of padding text, which fill the context window, truncate answers and inflate cost.
question: Which risk category is this?
A: Indirect prompt injection, because the text originates outside the system prompt.
B: Data exposure, because the padding text is written into the request logs.
C: Tool and action abuse, because the model is induced to use more tokens than needed.
D: Token-budget exhaustion from oversized or adversarially padded inputs.
answer: D
why A: Indirect injection arrives through retrieved content or tool outputs, not direct user padding.
why B: The harm here is budget and truncation, not sensitive data leaking.
why C: Tool abuse is about side-effecting tools called outside policy.
why D: Correct. Oversized or padded inputs that consume the context or output budget are token-budget exhaustion.
lesson: Know the five categories: direct and indirect injection, token-budget exhaustion, tool abuse, data exposure.
source: M3 The risk categories that recur in LLM systems

## D5-F06
objective: 5.2
difficulty: Medium
select: 1
scenario: A security reviewer asks the architect for the risk assessment of a new Claude system. The architect offers to walk the reviewer through the design verbally.
question: What does the course say the architect should provide?
A: A verbal walkthrough, followed by a summary email of the main points discussed.
B: A written risk assessment recording each risk's mitigation, owner and evidence.
C: The system prompt, since it contains all the safety instructions the model follows.
D: The vendor's published safety evaluations for the model the system uses.
answer: B
why A: The assessment should be a written artifact that the reviewer signs off.
why B: Correct. Each risk is recorded with its mitigation control, an owner and an evidence artifact.
why C: The system prompt is one layer and isn't a risk assessment.
why D: Vendor evaluations don't cover the partner's own architecture.
lesson: The risk assessment is a written deliverable with owners and evidence.
source: M3 Documenting the risk assessment as a deliverable

## D5-F07
objective: 5.2
difficulty: Hard
select: 1
scenario: A financial reconciliation pipeline ran perfectly in five demo runs. In week two of production, the same statement re-processed produced a different categorisation, found only by chance.
question: Which limitation was misread, and what should the design have included?
A: Non-determinism; outputs should have been verified rather than trusted as repeatable.
B: Working memory; the statements were too long for the window and needed chunking.
C: Knowledge; the model lacked the training data needed to categorise transactions.
D: Steerability; a longer, more detailed prompt would have made the outputs identical.
answer: A
why A: Correct. A demo isn't evidence of determinism; the architecture needed checks around model output.
why B: Nothing suggests truncation; the same input gave different outputs.
why C: The issue is variability, not missing knowledge.
why D: Prompt detail doesn't make a non-deterministic system deterministic.
lesson: The four properties are present whether or not your architecture acknowledges them; a demo isn't proof of determinism.
source: M1 A failure that began with a misread property

## D5-F08
objective: 5.3
difficulty: Medium
select: 1
scenario: A benefits system makes eligibility decisions. Some are low-confidence and would remove a person's benefits if wrong; others are confident and easily reversed.
question: Which routing rule fits the course guidance?
A: Route every decision to a human reviewer, so that nothing goes through unchecked.
B: Route only decisions above a fixed daily volume, so reviewers are never overloaded.
C: Route by stakes: low-confidence decisions that are irreversible or high-cost go to a person.
D: Route only decisions the model labels as uncertain, whatever their cost or reversibility.
answer: C
why A: Routing everything causes consent fatigue and makes review meaningless.
why B: Volume isn't stakes; this can let high-stakes decisions through unreviewed.
why C: Correct. Cost and reversibility set the stakes; calibrated confidence decides how much of that volume needs review.
why D: Confidence alone ignores the consequences of a mistake.
lesson: Route review by stakes (reversibility and cost), using calibrated confidence; not by volume.
source: M3 What sets the stakes of a decision

## D5-F09
objective: 5.3
difficulty: Hard
select: 1
scenario: Reviewers see only the model's output and an approve button. They approve about 400 items a day, and quality problems are slipping through.
question: What should change in the reviewer's view?
A: Add a countdown timer, so reviewers are pushed to keep up with the daily volume.
B: Show the inputs behind the decision, the output, and the reason it was flagged.
C: Remove the approve button, so reviewers have to type every decision in full.
D: Add a second reviewer for every item in the queue, so each one is checked twice.
answer: B
why A: Time pressure makes rubber-stamping worse.
why B: Correct. Without inputs and the flag reason, a reviewer can't tell an edge case from routine traffic. Pair this with routing by stakes to cut the volume.
why C: Extra friction doesn't give reviewers anything to judge against.
why D: Doubling reviewers doubles the cost without fixing missing context.
lesson: Reviewers need the inputs, the output and the flag reason; fix volume and context together.
source: M3 What the reviewer sees; When routing everything to review makes review meaningless
