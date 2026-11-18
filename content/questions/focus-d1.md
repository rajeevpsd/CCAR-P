# Domain 1 – Solution Design & Architecture · Focus question bank (original practice items, not real exam questions)

## D1-F01
objective: 1.2
difficulty: Medium
select: 1
scenario: An invoice-processing design shows OCR, schema-bound extraction with an evaluator pass, and validated JSON posted to the finance system. The diagram ends at "posted to ERP". Six months in, accuracy on a new supplier format has quietly dropped and nobody noticed.
question: Which stage of the end-to-end architecture was missing?
A: A feedback stage: outcome logging, reviewer corrections into the dataset, and a drift trigger with an owner.
B: A larger model tier for the extraction step, so new supplier formats are handled without changes to the pipeline.
C: A second OCR engine in parallel, so that unusual layouts are read twice before extraction.
D: Stricter input screening, so that invoices from unknown suppliers are rejected before processing.
answer: A
why A: Correct. A design that ends at the output has no way to notice it is degrading; logging, corrections into the dataset and a drift trigger with an owner close the loop.
why B: A tier change without an eval is reflexive, and it still leaves no signal that quality moved.
why C: More OCR doesn't create any signal that quality has drifted.
why D: Rejecting unknown suppliers hides the problem instead of detecting it, and blocks legitimate work.
lesson: An architecture that stops at "response to user" can't notice it's getting worse; the feedback stage is part of the design.
source: M2 Observability (what to log); M4 Feedback loop; M1 Reference architectures – document processing

## D1-F02
objective: 1.2
difficulty: Hard
select: 1
scenario: A customer-service assistant classifies intent, answers documentation questions from a RAG index, and issues account changes through a tool. Retries with backoff are implemented inside the orchestration layer; there is no circuit breaker; fallback to a cached answer happens in the API client.
question: What is the strongest critique of the reliability design?
A: Retries are unnecessary for a chat assistant because users can simply resend their message.
B: The controls sit in the wrong layers: retries go near the API call, breakers at the boundary, fallbacks in orchestration.
C: Reliability should be handled entirely by the model provider, so the partner's code should not implement any of these controls.
D: Only fallback matters, because a cached answer is always acceptable for both documentation and account changes.
answer: B
why A: Without retries, any transient 429, timeout or 5xx takes the workflow down instead of degrading gracefully.
why B: Correct. Module two places each control at a specific layer; putting them elsewhere protects the wrong part of the system.
why C: Retries, fallbacks and circuit breakers are the partner's design responsibility, not the provider's.
why D: A cached answer is wrong for live account state, and fallback alone doesn't stop a failing dependency consuming capacity.
lesson: Retries near the API call, circuit breakers at the service boundary, fallback chains in orchestration.
source: M2 POC to Prod – reliability controls
