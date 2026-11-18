# Domain 3 – Integration & Implementation · Focus question bank (original practice items, not real exam questions)

## D3-F01
objective: 3.1
difficulty: Medium
select: 1
scenario: A research agent that only reads internal documents and writes summaries has been given 25 tools over time, including email sending, CRM record editing and a payments lookup "in case it's useful".
question: What should the architect do first?
A: Add a system-prompt instruction telling the agent never to use the extra tools.
B: Audit each tool, remove the out-of-scope ones and record why.
C: Add an output filter that blocks any response mentioning email or payments.
D: Move the agent to a more capable model that is less likely to misuse tools.
answer: B
why A: Instructions aren't enforcement; the tools remain reachable.
why B: Correct. Module two's least-privilege audit removes out-of-scope tools and records the justification for each removal.
why C: Output screening judges text, not actions, and doesn't shrink the tool surface.
why D: A better model doesn't reduce what the tools allow it to do.
lesson: Every tool is an attack surface and a cost; keep only what the task requires and record why the rest went.
source: M2 Least-privilege tool configuration; M1 Pattern Selection risk callout

## D3-F02
objective: 3.1
difficulty: Medium
select: 1
scenario: An orchestrator delegates document review to subagents. Every subagent inherits the orchestrator's full tool set, including database write access and an outbound email tool.
question: Which change best applies least privilege?
A: Give subagents the same tools, but log every call they make for later review.
B: Remove all tools from the subagents and have the orchestrator do the reviews itself.
C: Scope each subagent's tools to its own task, so reviewers get only read access.
D: Keep the tools, but tell each subagent in its prompt which tools it may use.
answer: C
why A: Logging helps reconstruct misuse but doesn't prevent it.
why B: That collapses the multi-agent design; the orchestrator's job is delegation and synthesis.
why C: Correct. In orchestrator-worker deployments, scope each subagent's tool access to its task.
why D: Prompt instructions aren't an access control.
lesson: Establish a trust hierarchy: each subagent gets only the tools its job needs.
source: M2 Least-privilege tool configuration – orchestrator-worker trust hierarchy

## D3-F03
objective: 3.1
difficulty: Hard
select: 1
scenario: An agent with state-changing tools has no turn limit and no tool-call budget. One request recently looped through hundreds of tool calls and blew through the monthly cost ceiling before anyone noticed.
question: Which set of controls addresses this failure mode?
A: Turn budgets, tool-call limits and stopping criteria, with evals of stopping.
B: A larger context window, so the agent can hold more of the loop in view and finish sooner.
C: A monthly cost review, so the finance team can flag unusual spend after each billing cycle.
D: More tools, so the agent can find a faster path to the goal and stop earlier.
answer: A
why A: Correct. These are module two's mitigations for unbounded tool use in agents.
why B: A bigger window lets context grow further; it doesn't bound the loop.
why C: Monthly review surfaces the problem weeks late, after the cost has landed.
why D: More tools widen the liability surface.
lesson: Bound agents with budgets, tool-call limits and stopping criteria, and eval the stopping behaviour.
source: M2 Failure modes by architecture – agent

## D3-F04
objective: 3.2
difficulty: Easy
select: 1
scenario: An HR assistant lets users type "I am an HR manager" in their message, and then shows them salary data for the whole department.
question: What is the security gap?
A: The model should have been told in its system prompt to verify managers more carefully.
B: Salary data should never be available to any assistant under any circumstances.
C: Users should be asked to confirm their role a second time before data is shown.
D: The role is taken from user input instead of being verified and injected server-side.
answer: D
why A: Prompt instructions can't verify identity.
why B: Authorised users may need the data; the issue is how authorisation is established.
why C: A second unverified claim is still unverified.
why D: Correct. Identity must come from the authentication layer, not from the user's message.
lesson: Identity is verified on the server before the Claude call and injected; user-asserted roles are manipulable.
source: M2 Identity and authorization – where the verification happens

## D3-F05
objective: 3.2
difficulty: Medium
select: 1
scenario: An analytics assistant queries the data warehouse with a single service account that can read every table. Users who can't access finance tables in the BI tool can get the same data by asking the assistant.
question: Which integration layer has been designed incorrectly?
A: Authorisation: the Claude path bypasses the access policy.
B: Observability: the assistant's queries are not logged with enough detail.
C: Data handling: too many fields are being passed into the context window.
D: Delivery route: the assistant should run on a different cloud provider.
answer: A
why A: Correct. The authorisation model that governs existing systems must also govern the Claude layer; a broad service account bypasses it.
why B: Better logging would record the leak, not prevent it.
why C: Minimisation matters, but the root gap is that the access policy isn't enforced.
why D: The route doesn't change who is authorised to see what.
lesson: The Claude integration must enforce the same authorisation model as the systems it reaches.
source: M2 Integration layers – authorization and policy

## D3-F06
objective: 3.2
difficulty: Hard
select: 1
scenario: A multi-tenant SaaS company runs all tenants' Claude traffic through one shared API key. At peak, the organisation-level rate limit trips, every tenant sees errors, and nobody can tell which tenant caused the spike.
question: What should the architect require?
A: A higher organisation rate limit, so the shared key trips less often at peak.
B: Separate API keys per tenant, for attribution and isolation.
C: A larger retry count with exponential backoff, so errors are hidden from users.
D: A second shared key used as a fallback when the first one trips.
answer: B
why A: A higher limit delays the problem but still gives no attribution or isolation.
why B: Correct. Module two says separate keys per tenant are required for attribution and isolation in production multi-tenant deployments.
why C: Retries help transient errors but don't attribute or isolate the noisy tenant.
why D: A second shared key has the same attribution problem.
lesson: Multi-tenant production needs per-tenant API keys for attribution and isolation.
source: M2 Integration – cost, complexity, risk (shared API key)

## D3-F07
objective: 3.4
difficulty: Medium
select: 1
scenario: A production Claude system logs only HTTP status codes and timeouts. Users report answers that are subtly wrong, but every dashboard is green.
question: Why are the dashboards misleading?
A: The status-code logging is sampled too infrequently to catch the errors that users are reporting.
B: The model must be producing HTTP errors that the load balancer is silently retrying.
C: Users are probably misreading correct answers, since the system reports no errors.
D: LLM systems rarely crash; they fail by being quietly wrong, which error logs can't see.
answer: D
why A: More frequent sampling of the same signal still can't detect wrong content.
why B: There's no evidence of hidden HTTP errors; the outputs are wrong, not failing.
why C: Absence of errors isn't evidence of correctness in an LLM system.
why D: Correct. Observability must be designed for silent wrongness, not just outages.
lesson: Standard logging catches errors and timeouts; it doesn't catch quietly incorrect responses.
source: M2 Observability – what to log, what to trace, and why

## D3-F08
objective: 3.4
difficulty: Medium
select: 1
scenario: A team is defining the per-request trace for a new Claude deployment.
question: Which set matches the four things module two says every request should log?
A: User name, full prompt and response text, the client IP address and the browser user agent for every request.
B: Request, response, context and outcome, including model version, tokens, stop reason and acceptance.
C: Only the error rate and median latency, aggregated per hour and displayed on the main operations dashboard.
D: Monthly cost per tenant and the average number of tokens per conversation.
answer: B
why A: Full content and personal data raise data-handling risk and still miss version, tokens and outcome.
why B: Correct. These are the four categories: request, response, context and outcome.
why C: Aggregates without per-request traces can't explain anomalies or attribute changes.
why D: Cost aggregates are useful but aren't the per-request trace.
lesson: Log request, response, context and outcome on every call; that is the raw material for everything else.
source: M2 Observability – a production Claude system should log four things

## D3-F09
objective: 3.4
difficulty: Hard
select: 1
scenario: Output quality on a stable set of inputs changed last week. The team doesn't know whether the model's behaviour changed, the input mix changed, or a new model version was rolled out.
question: Which instrumentation lets them tell these causes apart?
A: A larger eval set, scored once a month against the original golden answers.
B: Customer satisfaction surveys sent after every conversation.
C: Model version on every trace, plus distribution comparisons.
D: A higher alert threshold, so that only very large quality changes are reported.
answer: C
why A: A monthly eval measures quality but doesn't separate model drift, data drift and version change.
why B: Surveys are lagging and can't attribute the cause.
why C: Correct. Change attribution needs the version recorded per request and distribution comparisons over time.
why D: Raising thresholds hides changes instead of attributing them.
lesson: Distinguish model drift, data drift and model updates; each has a different fix.
source: M2 Observability at scale – change attribution

## D3-F10
objective: 3.4
difficulty: Medium
select: 1
scenario: A multi-agent research system produced a confident but incomplete report. Logs exist for the orchestrator and for each subagent, but they can't be joined to reconstruct the run.
question: What instrumentation is missing?
A: A shared trace identifier propagated through the orchestrator and every subagent.
B: A separate dashboard for each subagent, refreshed every few minutes.
C: Longer log retention, so old runs can be read again later.
D: More verbose logging inside each subagent's own process only.
answer: A
why A: Correct. A shared trace ID lets one run be reconstructed end to end and failures attributed across levels.
why B: Separate dashboards keep the views fragmented.
why C: Retention doesn't help if the records can't be linked.
why D: More detail per agent doesn't connect the agents' records.
lesson: Propagate a shared trace ID across orchestrator and subagents.
source: M1 Multi-agent failure table; M2 Failure taxonomy – orchestrator-workers

## D3-F11
objective: 3.7
difficulty: Medium
select: 1
scenario: A company has one internal web app that calls Claude with three tools defined in its backend. No other Claude client will use these tools. An engineer proposes wrapping them in an MCP server "because MCP is the standard".
question: What should the architect recommend?
A: Build the MCP server, since every tool integration should go through MCP.
B: Move the tools into Claude Code so the app can use its built-in integrations.
C: Use the Agent SDK, because any use of tools requires a managed agent loop.
D: Keep direct tool use; MCP pays off only with reuse across clients.
answer: D
why A: MCP isn't the default integration layer; it adds a protocol layer and debugging complexity.
why B: Claude Code is a developer entry point, not a backend for a product.
why C: Tool use works within ordinary API calls; the Agent SDK is for managed multi-turn loops.
why D: Correct. Pick MCP when one tool entry point must be reachable from multiple clients; otherwise raw tool use is simpler.
lesson: MCP is a sharing convention across clients; raw tool use is right when tools live inside one product.
source: M1 MCP and API tool use: different layers; M2 Entry points table

## D3-F12
objective: 3.7
difficulty: Medium
select: 1
scenario: A partner wants Claude to work through a multi-step task inside its own web product, calling tools across several turns, with the product's code controlling the wider workflow.
question: Which build-time interface fits best?
A: The Claude Code CLI, deployed on the web servers for each user's session.
B: The Claude Agent SDK, which runs a managed agent loop from the partner's code.
C: Claude.ai with a Project, shared with each of the product's customers.
D: The raw HTTP API with a single request and single response per task.
answer: B
why A: Claude Code is designed for developer workflows, not as a backend for multi-user products.
why B: Correct. The Agent SDK fits when Claude must act across multiple turns inside the partner's own product.
why C: Claude.ai is an end-user product and can't be embedded in another product.
why D: One request and one response doesn't cover a multi-turn tool loop without building the loop yourself.
lesson: One request and one response: API or SDK; reusable tools across clients: MCP; multi-turn action in your product: Agent SDK.
source: M1 Build-time interfaces; Claude Agent SDK

## D3-F13
objective: 3.7
difficulty: Hard
select: 1
scenario: A proposal for branch-office staff at a bank uses Claude Code on branch laptops, MCP servers for every back-office system, and subagents to run compliance checks on each interaction. The bank has no other Claude clients.
question: Which architecture fits the work?
A: Keep Claude Code but add hooks so that the subagents' compliance checks can't be skipped.
B: Replace Claude Code with Claude Cowork, which non-developers can run on their own laptops.
C: A custom web app on the API, with compliance in server-side code.
D: Keep the design, because MCP and subagents make it easier to add more systems later.
answer: C
why A: The entry point still doesn't fit branch staff, and compliance still runs on the weaker guarantee.
why B: That still puts a high-consequence banking workflow on a desktop agent instead of governed server-side code.
why C: Correct. That's the module's answer: the entry point follows the user, MCP isn't needed without reuse, and compliance belongs in deterministic code.
why D: Optimising for unknown future flexibility is the same mistake as an unneeded agent.
lesson: Choose the entry point for the user and the work; put high-consequence logic in deterministic server-side code.
source: M1 When Claude Code got picked outside engineering

## D3-F14
objective: 3.7
difficulty: Hard
select: 1
scenario: A partner is standardised on AWS with a committed enterprise agreement, but its engineers also want the newest API features the day they ship.
question: How should the architect frame the delivery-route decision?
A: Bedrock fits the AWS commitment and IAM; name the CSP feature-lag trade-off.
B: Always use the first-party API, because the model behaves differently on cloud-provider routes.
C: Always use Bedrock, because cloud-provider routes receive new features before the first-party API.
D: The route doesn't matter, so let each engineer choose the one they prefer.
answer: A
why A: Correct. The route rule follows existing commitments, and the known trade-off is feature lag on CSP-mediated routes.
why B: The model is the same on every route; what differs is billing, auth, region and contract.
why C: The course says CSP routes tend to lag, not lead.
why D: The route decides billing, identity, region and contract coverage, so it matters.
lesson: Delivery route follows the partner's commitments; name the feature-lag trade-off.
source: M1 CSP delivery routes; M4 Deployment-entry-point decision matrix
