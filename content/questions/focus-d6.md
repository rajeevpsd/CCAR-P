# Domain 6 – Stakeholder Management & Lifecycle · Focus question bank (original practice items, not real exam questions)

## D6-F01
objective: 6.1
difficulty: Easy
select: 1
scenario: A stakeholder says the new assistant "must feel fast and easy".
question: How should the architect treat this statement?
A: As a signal to ask what would break it, then turn that into constraints.
B: As a requirement to write down exactly as stated in the design document.
C: As out of scope, because user experience is decided later by the UI designer.
D: As a reason to choose the smallest, fastest model available for every step.
answer: A
why A: Correct. Preferences hide constraints; translation turns them into things like a latency target and a safe failure path.
why B: "Fast and easy" isn't something you can design against or test.
why C: Experience words usually hide architectural constraints, such as latency and handoffs.
why D: That's a premature design decision made before discovery is finished.
lesson: A stated preference is a signal to ask more questions, not a requirement.
source: M4 The core move is translation

## D6-F02
objective: 6.1
difficulty: Medium
select: 1
scenario: During discovery, the architect has asked about capabilities and the budget. The stakeholder hasn't mentioned any prohibited actions or audit obligations.
question: Which two question categories still need to be asked explicitly?
A: What the system must cost, and when the system must launch.
B: What the system must do, and which model tier it should use.
C: What the system must not do, and what the system must prove.
D: Which cloud the partner prefers, and how large the team will be.
answer: C
why A: Cost is already covered; launch date isn't one of the four categories.
why B: Capabilities were covered, and tier choice is a design decision, not a discovery category.
why C: Correct. Stakeholders rarely volunteer must-not-do boundaries, and proof obligations are far cheaper to find in discovery than in legal review.
why D: Those are useful facts but not the missing discovery categories.
lesson: Ask all four: must do, must not do, must cost, must prove.
source: M4 Four questions turn discovery into requirements

## D6-F03
objective: 6.1
difficulty: Medium
select: 1
scenario: A stakeholder says, "It just needs to read the form and route it." The architect isn't sure whether routing is a fixed business rule.
question: How should this be recorded in the translation table?
A: As a requirement for Claude to decide the routing based on the form's content.
B: As a possibly deterministic rule kept in the rule engine, with the owner to confirm.
C: As an out-of-scope item, because routing doesn't involve any language understanding.
D: As a note to revisit once the prototype is working and users have tried it.
answer: B
why A: That assigns a possibly deterministic rule to the model without confirming it.
why B: Correct. That is the module's example row: implied constraint, the architectural decision, and a labelled assumption to confirm.
why C: Routing is in scope; the question is who owns it.
why D: Unconfirmed assumptions belong in the table now, not after the build.
lesson: Each item becomes a row: statement, implied constraint, architectural decision and labelled assumption.
source: M4 The output of discovery is a translation table

## D6-F04
objective: 6.1
difficulty: Hard
select: 1
scenario: In a first call, a hospital network asks for clinical notes drafted from nurse dictation. Within minutes the architect proposes an augmented pattern and a prototype for next week. The stakeholder agrees and mentions "a quick review step somewhere".
question: What should the architect have done differently?
A: Proposed a multi-agent design instead, because clinical notes are a complex task.
B: Committed to a firm delivery date, so that the stakeholder could plan the rollout.
C: Started the prototype immediately, so that the constraints would emerge from real use.
D: Finished the four question categories, and chased the review step as a possible gate.
answer: D
why A: The pattern isn't the problem; the problem is the missing constraints.
why B: A date commits to a design before its constraints are known.
why C: Constraints found during a build or compliance review are the most expensive way to find them.
why D: Correct. The quick check was a mandatory clinician authorisation, and PHI handling and two-state retention were also missed.
lesson: A plausible sketch ends the questions discovery exists to ask; finish them before proposing anything.
source: M4 The discovery call that turned into a design session

## D6-F05
objective: 6.2
difficulty: Medium
select: 1
scenario: An architect presents a recommendation to keep a full policy document in context on every call. The presentation covers the simplicity gained and the per-call cost.
question: Which element of the decision frame is missing?
A: The name of the model version that the design will be pinned to in production.
B: What reversing the choice would cost once the system is built around it.
C: A list of every alternative the team brainstormed during the design phase.
D: The detailed token-counting method used to estimate the per-call figure.
answer: B
why A: Version pinning matters operationally but isn't the missing trade-off element.
why B: Correct. Gain, give-up, reversal cost (and compliance posture in regulated settings) is the frame, and reversal cost is the element most often skipped.
why C: A decision package lists the options considered, not every brainstormed idea.
why D: Method detail doesn't help the stakeholder decide.
lesson: Name what you gain, what you give up, and what reversal would cost.
source: M4 Your job is to make decisions possible; The approval that was not an informed choice

## D6-F06
objective: 6.2
difficulty: Medium
select: 1
scenario: A CFO asks during a review, "Why did you choose a single delivery route instead of supporting several clouds?"
question: Which type of objection is this, and how should it be answered?
A: A capability objection, answered by demonstrating that the system works on one route.
B: A governance objection, answered by sharing the control register and evidence artifacts.
C: A design-choice objection, answered with the trade-off and what the alternative would cost.
D: Not a real objection, so it should be acknowledged and set aside for a later meeting.
answer: C
why A: It isn't asking whether the system can do something.
why B: It isn't asking whether the system can be trusted or evidenced.
why C: Correct. "Why this instead of that" needs the trade-off and the alternative's cost, in the same translation structure.
why D: Deflecting a design question erodes confidence.
lesson: Capability, governance and design-choice objections need different responses.
source: M4 Objections fall into different categories

## D6-F07
objective: 6.2
difficulty: Hard
select: 1
scenario: A security stakeholder with little AI background must approve a new deployment and then justify the choice to the board.
question: Which communication approach follows the course's Description rules?
A: Lead with a detailed architecture diagram, then explain each component and its configuration.
B: Lead with the outcome, state the limits honestly, and give them a justification to reuse.
C: Avoid mentioning limitations, so the stakeholder stays confident in the recommendation.
D: Present only the recommended option, so the stakeholder isn't confused by too many choices.
answer: B
why A: Architecture-first framing is the opposite of the course's first rule.
why B: Correct. Lead with outcome, frame limits honestly, and anticipate the peer-proof demand.
why C: A security stakeholder trusts a system whose limits are clearly stated.
why D: A decision package includes the options considered, the criteria, the recommendation and the remaining risks.
lesson: Present a decision package, not a verdict: options, criteria, recommendation and risks, in the stakeholder's terms.
source: M4 Frame the decision as a package; Description is the competency that makes the package land

## D6-F08
objective: 6.3
difficulty: Medium
select: 1
scenario: A team is writing the latency SLA for a new assistant and proposes "two seconds, because it sounds reasonable".
question: Where should the threshold come from?
A: Whatever the prototype achieved during the demo, so the target is known to be achievable.
B: The vendor's published latency benchmarks for the model tier that the team uses.
C: The fastest latency any competitor product is known to deliver today.
D: The user-experience expectation found in discovery.
answer: D
why A: Prototype performance isn't a requirement; it measures a different system.
why B: Benchmarks don't reflect this workload or its users.
why C: A competitor figure isn't traced to this deployment's needs.
why D: Correct. Latency traces to the UX expectation, availability to criticality, and quality to the eval acceptance criteria.
lesson: Every SLA threshold traces to a tangible source; otherwise it's an arbitrary target.
source: M4 An SLA names three things, and the thresholds come from somewhere tangible

## D6-F09
objective: 6.3
difficulty: Medium
select: 1
scenario: A healthcare documentation workflow has a regulatory obligation for periodic output audits. The team plans to run an audit only if the eval score drops below threshold.
question: What is wrong with this plan?
A: Audits should only ever be triggered by user complaints, not by eval scores.
B: Nothing is wrong, because a threshold trigger is the most efficient approach.
C: Regulated checkpoints run on a schedule, not on a threshold.
D: The eval threshold should be set higher, so that audits are triggered more often.
answer: C
why A: Complaints are lagging and don't satisfy a scheduled obligation.
why B: A threshold trigger misses the obligation whenever the score looks fine.
why C: Correct. Some reviews must happen even when nothing has gone wrong, as rows in the governance table.
why D: A higher threshold still isn't the required schedule.
lesson: Wire scheduled regulated checkpoints into the governance table before launch.
source: M4 Regulated deployments add review checkpoints that run on a schedule

## D6-F10
objective: 6.3
difficulty: Hard
select: 1
scenario: A pilot cost very little. The sponsor expects similar costs in production, where volume is forecast at two orders of magnitude higher.
question: What should the architect do before launch?
A: Wait for the first production invoice, then explain any difference to the sponsor.
B: Give a consumption forecast at production volume and name the spend controls now.
C: Reduce production volume to pilot levels, so costs stay close to what the sponsor expects.
D: Switch every step to the cheapest tier, so the bill stays close to the pilot's.
answer: B
why A: Cost is the expectation that breaks most often after launch; explaining afterwards is too late.
why B: Correct. Pre-empt it with a forecast, a spend-control posture (caching, tiering, budget alerts) and the tiering narrative before the first invoice.
why C: That defeats the purpose of the deployment.
why D: Tiering must be eval-gated per step, not applied blindly.
lesson: Set cost expectations at production volume before launch.
source: M4 Cost is the expectation that breaks most often

## D6-F11
objective: 6.3
difficulty: Hard
select: 1
scenario: Latency p95 keeps breaching its SLA. Two rounds of tuning failed, and analysis shows the budget was set without reference to any user-experience requirement.
question: What action fits the governance-table row for latency?
A: Find the bottleneck and escalate if the budget is wrong.
B: Keep tuning indefinitely until the existing target is met.
C: Remove the latency SLA, so the alert stops firing and the team can move on.
D: Move to the most capable model, so that each step finishes faster.
answer: A
why A: Correct. The latency row says to tune, or escalate to a stakeholder review if the budget is wrong.
why B: If the target is untraceable, more tuning may solve the wrong problem.
why C: Dropping the commitment unilaterally breaks expectation alignment.
why D: The most capable tier usually adds latency rather than reducing it.
lesson: When an SLA keeps breaching, check whether the budget itself is wrong and involve the stakeholder.
source: M4 Production-signal governance table – latency p95

## D6-F12
objective: 6.4
difficulty: Medium
select: 1
scenario: A replacement architect inherits a detailed architecture diagram with no rationale. To fix a performance issue, they change the context strategy and unknowingly break a data-residency constraint.
question: What should the original documentation have contained?
A: A higher-resolution diagram showing every component and connection in the system.
B: Each decision with its date, the rejected alternatives and the trade-off it resolved.
C: The full chat history of the design sessions, so the reasoning can be reread.
D: A list of the team members who attended each design session.
answer: B
why A: A diagram shows what the system is, not why it is that way.
why B: Correct. Without rationale, a successor can't tell which choices are load-bearing.
why C: Raw history isn't navigable documentation and doesn't state the decisions.
why D: Attendance doesn't carry the reasoning.
lesson: Record decisions, rejected alternatives and the trade-off each resolved; if it isn't written, it leaves with you.
source: M4 The design rationale that lived in the Architect's head

## D6-F13
objective: 6.4
difficulty: Medium
select: 1
scenario: A compliance reviewer reads the architecture document. It states that "data residency is enforced" but includes nothing else about that control.
question: What else does the reviewer need?
A: A paragraph explaining why data residency matters to this particular partner.
B: The name of the cloud region that the system was originally designed for.
C: Assurance from the original architect that the control was tested at launch.
D: The control, its owner and evidence that it is live.
answer: D
why A: Motivation isn't evidence.
why B: A region name alone doesn't prove the control is operating.
why C: Reviewers don't accept assertions.
why D: Correct. The control register is carried forward into the living document; evidence is what the reviewer checks.
lesson: For compliance reviewers, evidence beats assertion: control, owner, evidence artifact.
source: M4 For the compliance reviewer: evidence matters more than assertions

## D6-F14
objective: 6.4
difficulty: Hard
select: 1
scenario: An architect wants a quick way to judge whether a handoff document is complete.
question: Which test does the course give?
A: Whether a competent architect who wasn't in the room could make a safe change after reading it.
B: Whether it is longer than the previous project's documentation and covers more components.
C: Whether every diagram in it has been reviewed and approved by the security team.
D: Whether the stakeholder has signed it off as accurate before the handoff takes place.
answer: A
why A: Correct. That is the completeness test, which needs dated decisions, labelled assumptions and owned open items.
why B: Length doesn't measure completeness.
why C: Diagram review doesn't test whether the rationale is present.
why D: Sign-off doesn't prove a successor can change the system safely.
lesson: The completeness test: can someone who wasn't in the room make a safe change?
source: M4 For the returning Architect: navigable without a briefing; Glossary – documentation completeness
