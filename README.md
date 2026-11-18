# CCAR-P
Claude Certified Architect – Professional (CCAR-P) exam preparation guide and interactive trainer.

> Independent study material. Not affiliated with or endorsed by Anthropic. Contains no real exam questions.

## Contents
| Phase | Document | Status |
|---|---|---|
| 1 | [Source analysis, blueprint & traceability](docs/00-source-analysis.md) | Done |
| 2 | [Preparation guide (38 objectives, 7 domains)](docs/guide/README.md) | Done |
| 3 | [Comparison guides](docs/guide/comparisons.md) · [Question bank — 150 items](content/questions/README.md) | Done |
| 4 | [Glossary — 124 terms](content/glossary.md) · [Learn episodes — 7 × 38 parts](content/learn/) | Done |
| 5 | [Study plans (2-day / 5-day)](docs/study-plan.md) · [Rapid-revision guide](docs/rapid-revision.md) · [Traceability matrix](docs/traceability.md) · [Quality report](docs/quality-report.md) | Done |
| 6 | [Interactive trainer](https://rajeevpsd.github.io/CCAR-P/): Home · Practice · Mock exam · Learn · Glossary · Progress (`site/`) | Done |
| 7 | [Advisory: current-docs check of time-sensitive product facts](docs/verification-log.md) (not applied; content keeps module wording) | Done |

## Build
```
python3 scripts/build_content.py          # guide → content/objectives.json
python3 scripts/build_questions.py --strict
python3 scripts/build_glossary_learn.py --strict
python3 scripts/build_reports.py --strict  # regenerates docs/traceability.md + docs/quality-report.md
```
Trainer tests: `npm install --prefix tests && node tests/smoke.js`.

The same steps run in `.github/workflows/pages.yml` on every push to `main`.
