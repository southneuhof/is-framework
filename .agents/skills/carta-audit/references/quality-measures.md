# Carta Quality Measures

**Measure set:** `CARTA-QM-1`  
**Purpose:** define how Carta quality requirements are quantified or evidenced without pretending that ISO/IEC 25023:2016 supplies Carta-specific thresholds.

ISO/IEC 25023:2016 predates the 2023 product-quality model revision. This package therefore uses relevant SQuaRE measurement concepts while defining **Carta-specific measures** where needed.

## 1. Measurement principles

1. **Requirement ≠ measure ≠ threshold.** A requirement describes the guarantee. A measure observes it. A threshold determines pass/fail.
2. **No retroactive threshold setting.** A threshold must be ratified before the release/change being judged against it, except for an initial baseline exercise explicitly labeled “baseline only.”
3. **Comparable environment.** Performance comparisons must use the same fixture, toolchain, runner class, warm-up policy, and command.
4. **Prefer distributions over one sample.** For noisy timing measures, record at least median and a high percentile or multiple repeated runs. Routine CI may use a cheaper smoke version if a scheduled benchmark provides the stable evidence.
5. **No “unknown = pass.”** Missing evidence is `NOT VERIFIED`.
6. **Tool independence where possible.** The quality property should survive replacement of the specific scanner/benchmark tool.

## 2. Core measure registry

| Measure ID | Measures | Unit / result | Applies to | Threshold source |
|---|---|---|---|---|
| QM-TEST-001 | Required automated checks passing | pass/fail + failed test count | Both | 0 required failures |
| QM-TYPE-001 | Framework type-check correctness | error count | Both | 0 errors |
| QM-LINT-001 | Framework lint/static-analysis correctness | error count | Both | 0 unexcepted errors |
| QM-PUBAPI-001 | Unapproved public API breaking changes | count | Both | 0 |
| QM-DOC-001 | Public contract changes missing corresponding docs/migration note | count | Both | 0 for GATE contract changes |
| QM-TSC-RSS-001 | Peak RSS/heap of representative consumer type-check | MiB | Both | Ratified performance budget |
| QM-TSC-TIME-001 | Elapsed representative consumer type-check | seconds | Both | Ratified performance budget |
| QM-BUILD-TIME-001 | Clean/incremental build time where applicable | seconds | Both | Ratified performance budget |
| QM-TSC-SCALE-001 | Growth of compiler types/instantiations/RSS from small→medium→large fixture | ratio/curve | Both | Ratified scaling envelope |
| QM-API-LAT-001 | Canonical Sprindle request latency/overhead | ms distribution | Sprindle | Ratified runtime budget |
| QM-DBQ-001 | DB query count for canonical fixture operation | queries/operation | Sprindle | Documented source contract |
| QM-WEB-LAT-001 | Standard Loom interaction/render latency | ms distribution | Loom | Ratified browser budget |
| QM-HEAP-001 | Retained heap/resource growth after repeated operations | MiB / handles / listeners | Both | Ratified stability budget; no unbounded trend |
| QM-CAP-001 | Largest ratified fixture meeting all relevant budgets | fixture profile | Both | Declared capacity target |
| QM-A11Y-AUTO-001 | Automated serious accessibility violations in owned primitives | count by severity | Loom | 0 unresolved blocking violations for selected profile |
| QM-A11Y-MAN-001 | Manual keyboard/focus/semantic cases passing | pass ratio | Loom | 100% required cases |
| QM-COMPAT-001 | Supported matrix cells validated | pass ratio | Both | 100% required cells |
| QM-INSTALL-001 | Clean bootstrap fixture | pass/fail | Both/tooling | PASS |
| QM-SEC-VULN-001 | Unexcepted known vulnerable dependency findings | count/severity | Both/tooling | Policy-defined; no expired exceptions |
| QM-ERROR-LEAK-001 | Sensitive/internal values exposed by default error fixture | count | Sprindle | 0 |
| QM-SCOPE-BYPASS-001 | Server-owned scope/value bypass cases | count | Sprindle | 0 |
| QM-CYCLE-001 | Disallowed package/module cycles | count | Both | 0 |

## 3. Performance budget registry

The audit package intentionally does not invent ISO-branded numbers. Carta maintainers must commit actual budgets here **before a release can PASS the performance GATEs**.

Record the current approved values in this table. Blank values make the dependent performance requirements `NOT VERIFIED` for a release audit.

| Budget ID | Fixture | Metric | Approved threshold | Measurement environment | Approved on/by |
|---|---|---|---|---|---|
| BUD-TSC-SPR-S | PF-TSC-SPR-S: small Sprindle consumer (1–2 resources, canonical routes) | peak RSS + elapsed, median of 3 runs | peak RSS ≤ 2048 MiB; elapsed ≤ 60 s | ubuntu-latest runner class; Node 24 (Active LTS); pnpm 12.1.0; `pnpm --filter @southneuhof/sprindle type-check`; clean checkout, frozen lockfile | Ratified 2026-09-04 by maintainer |
| BUD-TSC-SPR-L | PF-TSC-SPR-L: large Sprindle consumer (25 resources with relations/scopes) | peak RSS + elapsed, median of 3 runs | peak RSS ≤ 3072 MiB; elapsed ≤ 150 s | ubuntu-latest runner class; Node 24 (Active LTS); pnpm 12.1.0; `pnpm --filter @southneuhof/sprindle type-check`; clean checkout, frozen lockfile | Ratified 2026-09-04 by maintainer |
| BUD-TSC-LOOM-S | PF-TSC-LOOM-S: small Loom consumer (1 table + 1 form) | peak RSS + elapsed, median of 3 runs | peak RSS ≤ 3072 MiB; elapsed ≤ 120 s | ubuntu-latest runner class; Node 24 (Active LTS); pnpm 12.1.0; `pnpm --filter @southneuhof/loom type-check` (`vue-tsc --noEmit`); clean checkout, frozen lockfile | Ratified 2026-09-04 by maintainer |
| BUD-TSC-LOOM-L | PF-TSC-LOOM-L: large Loom consumer (large table + 100-field form) | peak RSS + elapsed, median of 3 runs | peak RSS ≤ 4096 MiB; elapsed ≤ 240 s | ubuntu-latest runner class; Node 24 (Active LTS); pnpm 12.1.0; `pnpm --filter @southneuhof/loom type-check`; clean checkout, frozen lockfile | Ratified 2026-09-04 by maintainer |
| BUD-API-CANON | PF-API-CANON: Sprindle canonical request fixture (list/detail/write) | latency distribution + framework query count | p50 ≤ 50 ms, p95 ≤ 150 ms; query count = documented source contract, 0 undocumented N+1 | ubuntu-latest runner class; Node 24 (Active LTS, backend-validation job); 3 warm-up + 5 measured runs of 500 requests; same fixture, toolchain, and command per run | Ratified 2026-09-04 by maintainer |
| BUD-LOOM-TABLE | PF-LOOM-TABLE: Loom large table fixture (1000 rows, sort/filter) | render + interaction latency, median + p95 | initial render p50 ≤ 1000 ms; sort/filter interaction p95 ≤ 500 ms | ubuntu-latest runner class; Node 24 (Active LTS); Chromium via Playwright (`test:browser`); 3 measured runs; same fixture and command per run | Ratified 2026-09-04 by maintainer |
| BUD-LOOM-FORM | PF-LOOM-FORM: Loom large form fixture (100 fields, validation) | render + input/validation latency, median + p95 | initial render p50 ≤ 800 ms; input/validation p95 ≤ 200 ms | ubuntu-latest runner class; Node 24 (Active LTS); Chromium via Playwright (`test:browser`); 3 measured runs; same fixture and command per run | Ratified 2026-09-04 by maintainer |
| BUD-HEAP | Repeated representative server + browser lifecycle operations (1000 cycles) | retained heap/handles/listeners growth | retained growth ≤ 10 MiB and 0 leaked handles/listeners; no upward trend across runs | ubuntu-latest runner class; Node 24 (Active LTS); repeat fixture, capture heap before/after, inspect listeners/handles | Ratified 2026-09-04 by maintainer |

### Initial baseline rule

The first run may be labeled **BASELINE ONLY** and used to populate the registry. That baseline run **cannot be used to claim the performance GATEs pass** unless the thresholds are independently reviewed and ratified rather than merely copied from whatever the current implementation happens to do.

## 4. Expert-review measure template

Some properties cannot be responsibly reduced to one numeric threshold (for example abstraction quality or boundary clarity). Use this structured evidence format:

```text
Review ID:
Requirement ID:
Reviewer(s):
Files/interfaces sampled:
Required questions answered: yes/no
Contradicting evidence:
Consumer impact if violated:
Verdict: PASS / FAIL / NOT VERIFIED
Evidence links/paths:
Finding:
```

A GATE-level expert review needs:

- a prescribed question set in the audit worksheet;
- concrete source/test/doc evidence;
- an explicit verdict;
- no unresolved contradicting evidence.

A vague statement such as “architecture looks clean” is not sufficient evidence.

## 5. Exceptions

A temporary exception must record:

- affected requirement/measure;
- why the threshold cannot currently be met;
- risk and affected consumers;
- compensating control;
- owner;
- expiry date or release;
- approval.

An expired exception counts as a failure. Exceptions must not redefine the ISO mapping or hide the result; the underlying requirement remains not met and the report states that an approved exception exists.
