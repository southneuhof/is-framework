# Carta Audit Worksheet

Complete this worksheet for each audit. Produce one finished copy per audit
under `audits/<date>-<commit>/CARTA-AW-1.md`, with verdicts filled.

**Worksheet:** `CARTA-AW-1`  
**Target:** Carta framework only — Sprindle + Loom  
**Evaluation approach:** ISO/IEC 25040:2024-aligned process using the Carta profile/requirements/measures.  

> This is an **audit worksheet**, not a statement of current Carta compliance. Leave verdict fields blank until the audit is actually executed.

## A. Audit identification

| Field | Auditor input |
|---|---|
| Carta commit SHA/tag |  |
| Audit date |  |
| Auditor(s) |  |
| Quality profile version | `CARTA-QP-25010-2023` |
| Requirements set | `CARTA-QR-1` |
| Measure set | `CARTA-QM-1` |
| Node / pnpm / compiler versions |  |
| OS / CI runner class |  |
| Previous supported release/baseline |  |
| Audit purpose | routine / release / change-focused / baseline |

## B. Evaluation protocol

1. **Establish target.** Confirm the commit and that findings are limited to Carta framework responsibilities.
2. **Confirm applicability.** Use `quality-profile.md`; do not silently remove difficult gates.
3. **Confirm thresholds before execution.** Performance/security policy thresholds must already be ratified. Blank required budgets yield `NOT VERIFIED`.
4. **Collect objective evidence.** Prefer clean commands/tests/fixtures. For expert gates use the prescribed questions and concrete source evidence.
5. **Assign one verdict per applicable requirement:** `PASS`, `FAIL`, `NOT VERIFIED`, or permitted `N/A`.
6. **Record exceptions separately.** An approved exception does not convert a technical failure into PASS.
7. **Conclude.** Carta satisfies the profile for this audit only if every applicable GATE is PASS.

## C. Scope guardrails for the auditor

Do **not** fail Carta because a consumer application lacks:

- a particular RBAC permission model;
- MFA/password/session policy;
- business audit ledger/non-repudiation;
- deployment HA, backup/restore, DNS, database uptime, or disaster recovery;
- a specific rate limit value when Carta merely owns the installable boundary;
- domain validation/workflow correctness;
- app-specific custom page accessibility/UX;
- custom SQL correctness after a documented escape hatch transfers responsibility.

Do fail Carta when its framework primitive, documented invariant, wrapper, type contract, default behavior, or required extension seam makes the property unsafe, incorrect, unusable, or impractical for consumers.

## D. Summary

| Characteristic | Applicable GATEs | PASS | FAIL | NOT VERIFIED | Advisories/findings |
|---|---:|---:|---:|---:|---:|
| Functional suitability |  |  |  |  |  |
| Performance efficiency |  |  |  |  |  |
| Compatibility |  |  |  |  |  |
| Interaction capability |  |  |  |  |  |
| Reliability |  |  |  |  |  |
| Security |  |  |  |  |  |
| Maintainability |  |  |  |  |  |
| Flexibility |  |  |  |  |  |
| Safety | 0 (baseline OUT) | — | — | — |  |

**Technical profile verdict:** ☐ PASS ☐ FAIL ☐ NOT VERIFIED  
**Approved exceptions present:** ☐ No ☐ Yes — list:  
**Release decision:** ☐ Allow ☐ Block ☐ Allow with approved exception  

---

## E. Detailed audit checklist

For every row, fill **Result**, **Evidence**, and **Finding/remediation**. `NOT VERIFIED` is non-passing for GATE rows.

### 1. Functional Suitability

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-FS-CMP-01** | 3.1.1 | GATE; Both | Expert + consumer fixture | Inventory documented standard tasks for Sprindle and Loom. For each, trace the public entry point and run at least one minimal consumer path. Check for required internal imports or duplicated hidden machinery. | Every claimed standard task has a complete public path; no mandatory undocumented internal import/workaround. |  |  |
| **CAR-FS-CMP-02** | 3.1.1 | GATE; Both/docs | Expert review | Compare README/reference/recipes/UI docs to actual public responsibilities and explicit app-level seams. | Ownership and extension boundaries are stated for material standard/app-level concerns; no major framework-owned responsibility is undocumented. |  |  |
| **CAR-FS-COR-01** | 3.1.2 | GATE; Sprindle | Automated contract tests + source review | Run canonical route/pipeline/error/scope tests. Sample each canonical constructor against reference docs and runtime handler implementation. | All required tests pass; method/path/status/envelope/not-found/pipeline/server-owned state behavior matches documentation. |  |  |
| **CAR-FS-COR-02** | 3.1.2 | GATE; Both | Runtime + type tests | Run package type tests and representative public calls; compare runtime validation/output to exported types and docs. | No material type/runtime/schema contradiction in sampled public contracts. |  |  |
| **CAR-FS-COR-03** | 3.1.2 | GATE; Sprindle | Contract tests | Run source contract tests against framework-supplied source implementations and conformance fixture. | All framework sources satisfy the public ModelSource contract; custom-source obligations are testable/documented. |  |  |
| **CAR-FS-COR-04** | 3.1.2 | GATE; Loom | Unit/browser/type tests | Run resource/fields/form/table/query/view tests and browser tests. Trace one create and update lifecycle from hydrate→validate/write→schema→submit. | Behavior and ordering match Loom documentation and no contradictory execution path exists. |  |  |
| **CAR-FS-APP-01** | 3.1.3 | GATE; Both | Structured expert review | For each standard responsibility, search for parallel public execution paths that independently implement the same contract. Review whether duplication is necessary. | One canonical path exists per standard responsibility, or parallel paths have distinct documented purposes. |  |  |
| **CAR-FS-APP-02** | 3.1.3 | GATE; Both | Structured expert review | Review Hono/custom route/source hooks and Loom adapters/renderers/custom-screen seams. Identify guarantees lost when escaping. | Escape hatches are explicit; transferred responsibilities and retained guarantees are documented/testable. |  |  |

### 2. Performance Efficiency

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-PE-TIM-01** | 3.2.1 | GATE; Sprindle | Benchmark | Run PF-API-CANON in the approved environment. | Observed metrics meet BUD-API-CANON. |  |  |
| **CAR-PE-TIM-02** | 3.2.1 | GATE; Sprindle | Instrumented integration test | Count queries for list/detail/materialization/write fixtures; inspect enrichers for per-record I/O. | Query counts match documented contract and no framework N+1 regression is observed. |  |  |
| **CAR-PE-TIM-03** | 3.2.1 | GATE; Loom | Browser benchmark | Run PF-LOOM-TABLE and PF-LOOM-FORM. | Observed metrics meet ratified Loom browser budgets. |  |  |
| **CAR-PE-RES-01** | 3.2.2 | GATE; Both | Compiler benchmark | Run small and large consumer type-check fixtures with peak RSS/heap capture. | Peak memory meets BUD-TSC-* budgets. |  |  |
| **CAR-PE-RES-02** | 3.2.2 | GATE; Both | Compiler/build benchmark | Measure approved type-check/build commands on fixed fixtures. | Elapsed times meet ratified budgets. |  |  |
| **CAR-PE-RES-03** | 3.2.2 | GATE; Both | Leak/stability test | Repeat representative server/browser lifecycle operations and inspect retained resources. | No unbounded framework-controlled resource growth; result meets BUD-HEAP. |  |  |
| **CAR-PE-CAP-01** | 3.2.3 | GATE; Both | Capacity benchmark | Run declared large fixtures from PERFORMANCE-FIXTURES. | All required large fixtures stay inside relevant functional/performance budgets. |  |  |

### 3. Compatibility

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-CO-COE-01** | 3.3.1 | GATE; Loom | Source + browser isolation review | Load Loom standard style/components beside unrelated styled controls; inspect global selectors, event listeners, storage/global mutation. | No undocumented material interference with unrelated consumer UI/global state. |  |  |
| **CAR-CO-COE-02** | 3.3.1 | GATE; Both | Manifest/install review | Inspect dependency vs peerDependency choices; clean-install fixtures; detect duplicate runtime framework copies where relevant. | Supported consumer installs without incompatible/duplicate runtime assumptions. |  |  |
| **CAR-CO-INT-01** | 3.3.2 | GATE; Both | Compatibility matrix CI | Execute all required cells in COMPATIBILITY-AND-SUPPORT. | 100% required cells PASS. |  |  |
| **CAR-CO-INT-02** | 3.3.2 | GATE; Both | Contract fixture | Instantiate public adapters/sources/renderers/schema bridges with minimal independent test doubles and missing-contract cases. | Supported implementations interoperate; missing contract fails clearly. |  |  |
| **CAR-CO-INT-03** | 3.3.2 | GATE; Sprindle | Contract comparison | Generate OpenAPI/route schema for representative canonical/custom routes and compare with runtime/typed-client contract tests. | No material method/path/body/response divergence. |  |  |

### 4. Interaction Capability

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-IC-REC-01** | 3.4.1 | ADVISORY; Both/docs | Expert review | Read package READMEs/reference as a new consumer; identify major capability/non-goal ambiguity. | Core purpose, standard capabilities and non-goals are recognizable without source archaeology. |  |  |
| **CAR-IC-LEA-01** | 3.4.2 | GATE; Both/docs | Fresh-consumer task | Use public docs only to implement PF-TSC-SPR-S and PF-TSC-LOOM-S from a clean fixture. | Task completes without internal imports or undocumented required steps. |  |  |
| **CAR-IC-OPE-01** | 3.4.3 | GATE; Loom | Browser + manual keyboard test | Run required keyboard/focus cases from ACCESSIBILITY-PROFILE on all owned interaction categories. | 100% required cases pass; no keyboard trap/focus-loss regression. |  |  |
| **CAR-IC-OPE-02** | 3.4.3 | GATE; Loom | Component/browser tests | Exercise loading/ready/empty/error/submitting/disabled/retry states on standard surfaces. | Each applicable state is deterministic, usable, and owned by the documented layer. |  |  |
| **CAR-IC-ERR-01** | 3.4.4 | GATE; Both | Interaction + API tests | Submit invalid inputs, trigger destructive actions, and attempt invalid server transitions/scopes on representative standard paths. | Invalid actions are prevented or clearly rejected; server remains authoritative; no silent corruption. |  |  |
| **CAR-IC-ENG-01** | 3.4.5 | ADVISORY; Loom | Expert review | Sample standard components/states for contradictory interaction/visual language. | No material consistency defect; aesthetic preference alone is not a failure. |  |  |
| **CAR-IC-INC-01** | 3.4.6 | GATE; Loom | Automated a11y + manual | Run accessibility profile across representative owned primitives/composites, including Reka-wrapped behavior. | No unresolved blocking selected WCAG A/AA failure in Loom-owned behavior; required manual cases pass. |  |  |
| **CAR-IC-INC-02** | 3.4.6 | GATE; Loom | Source + localization fixture | Inventory framework-owned visible/accessibility strings; override them in a test locale without source patching. | All material framework-owned strings are centralized/overrideable; no required fork for localization. |  |  |
| **CAR-IC-AST-01** | 3.4.7 | GATE; Loom | DOM/a11y tests | Inspect label/control, error/control, instruction/control relationships for standard inputs and composites. | All applicable relationships are visible and programmatically exposed. |  |  |
| **CAR-IC-SELF-01** | 3.4.8 | GATE; Both | Failure-fixture review | Trigger representative boot/config/validation/load errors and development warnings. | Messages identify the failed contract/context sufficiently for correction while external server errors remain privacy-safe. |  |  |

### 5. Reliability

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-RE-FLT-01** | 3.5.1 | GATE; Both | Repeatable test suite | Repeat deterministic contract fixtures where order/state matters; run full required test suite. | No nondeterministic public-contract failure and all required tests pass. |  |  |
| **CAR-RE-FLT-02** | 3.5.1 | GATE; Sprindle | Parity contract suite | Run equivalent external operations against memory and Drizzle framework sources where the contract overlaps. | Externally observable behavior agrees except documented implementation-specific differences. |  |  |
| **CAR-RE-FT-01** | 3.5.3 | GATE; Both | Negative-path tests | Exercise malformed JSON/query/params, validation, not-found/conflict, rejected loads and failed mutations. | Documented failure state returned; framework state remains coherent. |  |  |
| **CAR-RE-FT-02** | 3.5.3 | GATE; Both | Fault injection | Throw from hooks/enrichers/source/adapter/renderer/custom action at each supported boundary. | Failure follows documented propagation/cleanup path; no stale/corrupt framework state. |  |  |
| **CAR-RE-REC-01** | 3.5.4 | GATE; Sprindle | DB integration/fault injection | Force failure during relation/post-write re-read or other framework multi-step write. | Transaction rolls back where promised; custom persistence responsibility is clearly transferred/documented. |  |  |
| **CAR-RE-REC-02** | 3.5.4 | GATE; Loom | Browser/component test | Force load/mutation failure then retry/correct/dismiss. | Component/query/form returns to a safe usable state without full-page corruption. |  |  |

### 6. Security

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-SE-CONF-01** | 3.6.1 | GATE; Sprindle | Security negative tests | Throw internal exception containing sentinel secret/SQL/stack data and inspect HTTP response. | Sentinel/internal detail absent from response; contract returns generic internal error. |  |  |
| **CAR-SE-CONF-02** | 3.6.1 | GATE; Both | Logging review + sentinel test | Inject sentinel secret/header/body values and inspect default framework logs/diagnostics. | No prohibited sensitive values emitted by default framework logging. |  |  |
| **CAR-SE-CONF-03** | 3.6.1 | GATE; Sprindle | Scope-bypass tests | Attempt to override/unset server-owned where/values through body/query/route input. | 0 successful bypasses. |  |  |
| **CAR-SE-INT-01** | 3.6.2 | GATE; Sprindle | Contract/transaction tests | Test conflicting client/server values, scope application, and transaction rollback. | Server precedence and transaction semantics match contract. |  |  |
| **CAR-SE-INT-02** | 3.6.2 | GATE; Both | Validation fuzz/negative tests | Submit extra/wrong-type/transformed inputs at framework boundaries, including form/schema transitions. | Invalid shapes are rejected/explicitly transformed according to contract; no silent material reinterpretation. |  |  |
| **CAR-SE-ACC-01** | 3.6.4 | GATE; Sprindle | Traceability fixture | Send request with and without request ID; attach configured identity/logger and inspect correlation data. | Request can be correlated and consumer can attach identity-aware audit data without framework patching. |  |  |
| **CAR-SE-AUT-01** | 3.6.5 | GATE; Sprindle | Authentication negative tests | Call authenticated routes with no resolver identity, invalid/absent context, and client-supplied identity-like fields. | Only configured resolver/context establishes identity; missing identity fails predictably. |  |  |
| **CAR-SE-RES-01** | 3.6.6 | GATE; Both/tooling | Dependency scan | Run approved vulnerability scanner(s) against lockfile/runtime deps; review exceptions. | No unexcepted policy-blocking findings and no expired exception. |  |  |
| **CAR-SE-RES-02** | 3.6.6 | GATE; Sprindle | Boundary review + integration fixture | Verify middleware/platform can impose rate/body/pagination/upload/time limits without bypassing canonical install path; docs assign ownership. | Controls are installable at correct boundary and responsibilities are explicit. |  |  |
| **CAR-SE-RES-03** | 3.6.6 | GATE; Both | Security contract review | Review each security-sensitive escape hatch against docs/tests. | Lost/retained guarantees are explicit; no escape hatch is falsely presented as preserving protections it bypasses. |  |  |
| **CAR-SE-RES-04** | 3.6.6 | GATE; Tooling | CI/release review | Inspect frozen lockfile use, workflow permissions, secret handling, privileged release/sync path, and third-party actions policy. | Install is reproducible; no avoidable secret exposure/untrusted privileged execution; exceptions documented. |  |  |

### 7. Maintainability

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-MA-MOD-01** | 3.7.1 | GATE; Both | Dependency-boundary scan | Search framework imports for apps/project-domain paths and run boundary tests. | 0 disallowed app/domain dependencies in framework packages. |  |  |
| **CAR-MA-MOD-02** | 3.7.1 | GATE; Both | Architecture review | Trace transport→resource/source/UI boundaries; sample modifications to ensure unrelated internals need not be imported. | Responsibilities communicate through explicit interfaces; no material cross-layer entanglement. |  |  |
| **CAR-MA-MOD-03** | 3.7.1 | GATE; Both | Dependency graph | Generate package/module dependency graph and inspect cycles. | 0 disallowed cycles affecting public responsibility boundaries. |  |  |
| **CAR-MA-REU-01** | 3.7.2 | GATE; Both | Source/config scan | Search framework core for app entities, permissions, branding, specific workflow assumptions and hard-coded project service paths. | No mandatory project-specific core behavior. |  |  |
| **CAR-MA-REU-02** | 3.7.2 | GATE; Both | Independent extension fixtures | Implement minimal source/adapter/renderer/custom route/screen using only public contract. | Extension works without copying app internals and its obligations are documented. |  |  |
| **CAR-MA-ANA-01** | 3.7.3 | GATE; Both | Negative configuration tests | Trigger malformed schemas/configurations/public misuse detected by Carta. | Failure identifies framework concept/context and, where feasible, fails early. |  |  |
| **CAR-MA-ANA-02** | 3.7.3 | GATE; Both/docs | Change-trace review | Sample public-contract commits/current surface: compare README/reference/tests/source for contradictions; require docs in change policy. | No known material public-doc/source contradiction; audit trail links contract changes to docs/tests. |  |  |
| **CAR-MA-ANA-03** | 3.7.3 | GATE; Both/tooling | Static checks | Run configured lint/type-check/static analysis. Review suppressions/exceptions. | 0 unexcepted required errors; suppressions are justified/time-bounded where material. |  |  |
| **CAR-MA-MODIF-01** | 3.7.4 | GATE; Both | API diff/contract tests | Compare public exports/types/wire/component contract against previous supported release. | 0 unapproved breaking changes. |  |  |
| **CAR-MA-MODIF-02** | 3.7.4 | GATE; Both | Release-note review | For every intentional breaking/deprecated contract, inspect versioning, changelog/migration and tests. | All intentional breaks follow PUBLIC-API-POLICY or documented emergency exception. |  |  |
| **CAR-MA-MODIF-03** | 3.7.4 | GATE; Both | Structured impact review | Select recent representative internal changes; inspect unrelated package/type/test churn required solely by coupling. | No unjustified broad blast radius; finding raised for cross-cutting type/module propagation without contract reason. |  |  |
| **CAR-MA-TEST-01** | 3.7.5 | GATE; Both | Traceability review | Map every GATE requirement that is objectively automatable to at least one executable test/command. | All automatable GATE invariants have reproducible executable evidence; review-only gates have prescribed evidence. |  |  |
| **CAR-MA-TEST-02** | 3.7.5 | GATE; Both | Type tests | Run positive/negative type contract suites for public generic-heavy APIs. | Required type assertions compile/fail as intended. |  |  |
| **CAR-MA-TEST-03** | 3.7.5 | GATE; Both | Clean CI repeatability | Run tests from clean checkout with documented services only; inspect hidden network/env dependency. | Required suite is reproducible; hidden state/network dependency absent or explicitly controlled. |  |  |

### 8. Flexibility

| Requirement | ISO map | Level / component | Method | Audit procedure | Pass criterion | Result | Evidence / finding |
|---|---|---|---|---|---|---|---|
| **CAR-FL-ADP-01** | 3.8.1 | GATE; Both | Extension scenarios | Implement representative app-specific variants using public seams, without editing Carta source. | Variants are expressible without framework fork and preserve documented guarantees. |  |  |
| **CAR-FL-ADP-02** | 3.8.1 | GATE; Both | Policy-neutrality review | Search for mandatory app-specific auth/file/router/business policy in framework core. | No hard-coded consumer policy contrary to documented boundary. |  |  |
| **CAR-FL-SCA-01** | 3.8.2 | GATE; Both | Scaling benchmark | Run small/medium/large runtime fixtures and compare cost growth. | Growth remains inside ratified scaling envelope; no new pathological curve. |  |  |
| **CAR-FL-SCA-02** | 3.8.2 | GATE; Both | Compiler scaling benchmark | Run PF-TSC small/medium/large and record types/instantiations/RSS/time. | Growth remains inside ratified type-system scaling envelope. |  |  |
| **CAR-FL-INS-01** | 3.8.3 | GATE; Both/tooling | Clean bootstrap | From clean environment follow documented distribution/bootstrap path; install, type-check, test, build. | All required steps PASS with no undocumented patch/manual dependency. |  |  |
| **CAR-FL-INS-02** | 3.8.3 | GATE; Both/tooling | Toolchain matrix | Compare root/package engines/compiler/CI/docs and execute boundary configurations. | Declarations are mutually consistent and all required supported cells pass. |  |  |
| **CAR-FL-REP-01** | 3.8.4 | ADVISORY; Both | Architecture review | Review third-party wrappers and service seams for leaked internals/unnecessary lock-in. | No major avoidable lock-in; intentional third-party public dependencies are documented. |  |  |


### 9. Explicit OUT / conditional items

| ISO map | Item | Baseline result | Auditor confirmation / trigger check |
|---|---|---|---|
| 3.5.2 | Availability | OUT | Confirm Carta still does not own deployment/service uptime:  |
| 3.6.3 | Non-repudiation | OUT | Confirm Carta has not taken ownership of legally/audit-significant signature/evidence facilities:  |
| 3.9.1 | Operational constraint | OUT | Confirm no safety-related qualification/use has been added:  |
| 3.9.2 | Risk identification | OUT | Confirm no safety-related qualification/use has been added:  |
| 3.9.3 | Fail safe | OUT | Confirm no safety-related qualification/use has been added:  |
| 3.9.4 | Hazard warning | OUT | Confirm no safety-related qualification/use has been added:  |
| 3.9.5 | Safe integration | OUT | Confirm no safety-related qualification/use has been added:  |

If a trigger is true, stop using the baseline OUT classification and update the quality profile before claiming audit completion.

---

## F. Structured expert-review prompts

Use these prompts whenever a row calls for expert review. Record specific source paths/examples.

### Boundary/modularity review

- Can the responsibility be explained without reading unrelated modules?
- Does the unit have a clear public interface?
- Can its implementation change without forcing unrelated consumer changes?
- Does a lower-level third-party implementation leak into unrelated public contracts?
- Is application policy entering framework core?

### Functional appropriateness review

- Is Carta reducing repeated consumer work or merely moving it behind another layer?
- Are there two ways to perform the same standard operation that can diverge?
- Does the abstraction preserve the underlying platform's useful escape hatch?
- Would removing the abstraction make the consumer simpler without losing a real framework guarantee?

### Security seam review

- What security property does Carta guarantee before the escape hatch?
- Which property transfers to the consumer afterward?
- Can client-controlled input enter server-owned state?
- Can the seam bypass validation/authorization/scoping without clearly saying so?
- Is failure externally privacy-safe and internally diagnosable?

### Loom wrapper review

- What semantics/keyboard/focus behavior does the underlying primitive provide?
- Does Loom preserve it after styling/composition?
- Does Loom add an API that makes accessible naming/state impossible?
- Are framework-owned default strings localizable?

---

## G. Findings register

| Finding ID | Requirement | Severity | Description | Evidence | Owner | Due/target release | Exception? | Status |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## H. Final evaluator statement

> I evaluated the identified Carta revision against `CARTA-QP-25010-2023` using `CARTA-QR-1`, `CARTA-QM-1`, and this worksheet. The result applies only to the declared Carta framework boundary and does not represent an audit of applications built using Carta.

Evaluator:  
Date:  
Signature/approval reference (if used):
