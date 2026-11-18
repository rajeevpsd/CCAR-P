# Question bank

> **Original practice items written for this project. These are not actual Anthropic exam questions.** Each item tests architectural judgment for one official CCAR-P objective.

## Composition (v1)
| Domain | Weight | Items | Share |
|---|---|---|---|
| D1 Solution Design & Architecture | 17% | 25 | 16.7% |
| D2 Models, Prompting & Context | 13% | 20 | 13.3% |
| D3 Integration | 19% | 29 | 19.3% |
| D4 Evaluation, Testing & Optimization | 16% | 24 | 16.0% |
| D5 Governance, Safety & Risk | 14% | 21 | 14.0% |
| D6 Stakeholder & Lifecycle | 14% | 21 | 14.0% |
| D7 Developer Productivity & Ops | 7% | 10 | 6.7% |
| **Total** | | **150** | 14 multiple-response |

**Focus set (remediation):** `focus-d1.md` … `focus-d7.md` add 66 original items (D1 2 · D2 9 · D3 14 · D4 11 · D5 9 · D6 14 · D7 7) on the objectives most often missed. They're tagged `set: focus`, sit outside the blueprint count, and are used by Practice and the Focus tab's focus mock. Same format, same per-option explanations, same answer-letter and length-bias guards.

All 38 objectives have 2–5 items each. Difficulty mix: 35 Easy · 74 Medium · 41 Hard.

## Item format
```
## D3-001
objective: 3.1
difficulty: Easy | Medium | Hard
select: 1            # or 2 for multiple-response (then 5 options A–E)
scenario: ...
question: ...
A: ... (B, C, D[, E])
answer: C            # or A,C
why A: ...           # one explanation per option, required
lesson: ...          # the KEY EXAM LESSON
source: ...          # module section / Exam Guide / official doc
```

## Quality checks (`python3 scripts/build_questions.py --strict`)
- Every required field is present, and every option has an explanation.
- The answer letters are valid and their count matches `select`.
- Each item's objective belongs to its domain; every objective has items.
- Domain counts follow the blueprint weights.
- Correct letters are balanced across A–D.
- **No length tell:** the correct option's length rank is spread evenly (no rank above 35% of items), and in multi-select items the correct answers aren't simply the longest options.
