# Verification log – time-sensitive product facts

**Checked:** 2026-11-19, against current official Anthropic documentation.
**Why:** the modules contain product facts that change often: model names, pricing multipliers, API parameters, Claude Code modes, compliance routes. The Project instructions say: prefer current official docs for product behaviour and flag outdated material explicitly.

**Rule applied:** the Exam Guide still defines **scope**. Where a module fact is outdated, the guide keeps the module statement (labelled `[MODULE n]`), adds a `[OFFICIAL ANTHROPIC DOCS – verified 2026-11-19]` note, and rewrites practice items so that no correct answer depends on the outdated fact.

> REMEMBER – Anthropic docs change often. Re-check this table in the week before your exam.

## Summary

| Status | Count | Items |
|---|---|---|
| Confirmed | 4 | V3, V4, V7, V8 |
| Confirmed, with additions | 1 | V2 |
| Partially confirmed | 2 | V5, V6 |
| Outdated in the module | 2 | V1, V9 |

## Detail

| # | Claim | Module statement | Current official docs | Status | Content changed |
|---|---|---|---|---|---|
| V1 | Model lineup and default tier | M1: the family is Opus, Sonnet and Haiku; Sonnet is the default starting point | The current lineup is Claude Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5, all with 1M-token context and adaptive thinking. **Opus 5.5 is the recommended starting point for most workloads.** Fable 5.2 is for demanding reasoning and long-horizon agentic work. Haiku 5.5 is for high-volume classification, extraction and routing. [Models overview] | **Outdated** | Guide 2.1, 3.3; comparison 14; glossary *Model tiers*; Learn 2.1 (narration and one check rewritten); question D2-001 made version-neutral. The rule tested (eval-gated tier moves) is unchanged. |
| V2 | Extended thinking controls | M1: adaptive thinking with effort is recommended; `budget_tokens` deprecated on 4.6 and removed on Sonnet 5 | Manual extended thinking (`type: "enabled"` with `budget_tokens`) is legacy. Claude 4.7 and later models reject it with a 400; use `thinking: {type: "adaptive"}` with `output_config.effort`. Fable 5.2 and Opus 5.5 always think. Switching modes invalidates the prompt cache for the first request after the switch. [Extended thinking] | **Confirmed, with additions** | Guide 2.1 note; glossary *Extended thinking* |
| V3 | Prompt-caching economics | M2: cache read about 10%, 5-minute TTL; writes cost more than input | Writes cost 1.25× base input (5-minute TTL) or 2× (1-hour TTL). Reads cost 0.1×, except 0.025× on Fable 5.2/5.1 and Mythos 5.2/5.1 and 0.05× on Opus 5.5 and Sonnet 5.5. [Prompt caching] | **Confirmed**; adds the 1-hour TTL | Guide 2.5, 4.5; glossary *Cache breakpoint / TTL* |
| V4 | Batch API terms | M2: e.g. 50% off, 100k requests per batch | 100,000 requests or 256 MB per batch, whichever comes first. Billed at 50% of standard prices. Most batches finish in under an hour; results arrive within 24 h, otherwise the batch expires. Results are downloadable for 29 days. [Batch processing] | **Confirmed** | Guide 4.5; glossary *Batch API* |
| V5 | Refusal handling | M3: `stop_reason: "refusal"` plus `stop_details` (category, explanation); M3 lists several categories | A refusal is a successful HTTP 200 with `stop_reason: "refusal"`. `stop_details` is always present on a refusal, but `category` and `explanation` can be null, so branch on `stop_reason` or `stop_details.type`. Only the `cyber` category was confirmed. Retry on a fallback model (`fallbacks`, beta) is now documented. [Streaming refusals; Refusals and fallback] | **Partially confirmed**: the other categories are a **Source gap – verification required** | Guide 5.1; glossary *Refusal stop reason* |
| V6 | Data residency | M2: `inference_geo` = "us" / "global"; Foundry EU residency "coming 2026" | `inference_geo` takes "global" (the default) or "us", on Claude 4.6 and later models; older models return a 400. "us" costs 1.1×. It works on the first-party API, Claude Platform on AWS, and Anthropic-managed Google Cloud. On Bedrock and Google-managed Vertex the region comes from the endpoint or inference profile. Foundry keeps inference in the US through the US Data Zone Standard deployment. [Data residency] | **Partially confirmed**: no EU option for Foundry is documented, so that remains a **Source gap – verification required** | Guide 5.4 table; glossary *Data residency*; question D5-017 explanations |
| V7 | Tool search / `defer_loading` | Guide (official docs): keep 3–5 tools loaded; never defer the search tool | Confirmed. `defer_loading` controls what enters context, not what you send. If every tool is deferred, the API returns a 400 ("At least one tool must have defer_loading=false"). [Tool search tool] | **Confirmed** | Guide 2.4 (one sentence added) |
| V8 | FedRAMP and US-government routes | M1/M2: Claude for Government, Bedrock GovCloud and Vertex Assured Workloads | All three are FedRAMP High. Claude Enterprise has no USG authorisation. ITAR-controlled data goes through Bedrock in AWS GovCloud (DoD IL4/IL5); Claude for Government and Vertex are not IL5 environments. [Public-sector FAQs; Claude for government] | **Confirmed**; adds the ITAR / IL5 detail | Guide 5.4 table |
| V9 | Claude Code permission modes | M1: six modes; auto mode is a research preview | Six modes confirmed: default, acceptEdits, plan, auto, dontAsk, bypassPermissions. The current page does **not** call auto mode a research preview: a separate classifier reviews actions, and auto is the built-in starting mode for interactive sessions in recent versions. bypassPermissions is for isolated containers or VMs only. [Permission modes] | **Outdated** ("research preview") | Guide 7.1; glossary *Permission modes* |

## Sources

- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- [Handle streaming refusals](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals) · [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback)
- [Data residency](https://platform.claude.com/docs/en/build-with-claude/data-residency)
- [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)
- [Public-sector FAQs](https://support.claude.com/en/articles/13756069-public-sector-faqs) · [Claude for government](https://claude.com/solutions/government)
- [Choose a permission mode (Claude Code)](https://code.claude.com/docs/en/permission-modes)
