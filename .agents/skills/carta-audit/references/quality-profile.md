# Carta Product Quality Profile

**Profile ID:** `CARTA-QP-25010-2023`  
**Target:** Carta framework (`packages/sprindle` + `packages/loom`)  
**Primary model:** ISO/IEC 25010:2023 Product Quality Model  
**Tailoring method:** ISO/IEC 25002:2024 principles  

## 1. Purpose

This profile answers one question before every audit:

> **Which ISO/IEC 25010:2023 quality properties are materially owned by Carta as a reusable framework, and which belong to the applications or operational environments that consume it?**

It prevents two opposite errors:

1. failing Carta for application/deployment responsibilities it does not own; and
2. excusing Carta from framework responsibilities merely because a consuming application *could* work around them.

## 2. Product boundary

### 2.1 Framework-owned target

#### Sprindle

Sprindle owns the quality of the framework primitives and contracts it supplies, including, where applicable:

- canonical route constructors and wire/error envelopes;
- schema and input-validation integration;
- fixed pipeline composition and hook ordering;
- identity/authentication seams and authorization hook behavior;
- server-owned read/write scoping behavior;
- source abstraction and Drizzle source behavior;
- transactional semantics implemented by framework sources;
- deterministic list/detail behavior promised by the framework;
- request context, request IDs, and framework logging behavior;
- OpenAPI generation supplied by Sprindle;
- testing utilities and public type contracts;
- documented escape hatches and extension contracts.

Sprindle **does not automatically own** an application's role model, authorization policy, identity-provider security, custom SQL correctness, infrastructure rate-limiter configuration, deployment availability, backup/restore, or domain workflow correctness.

#### Loom

Loom owns the quality of the framework behavior it supplies, including, where applicable:

- schema/resource/field contracts;
- form, table, collection, detail, and standard view behavior;
- validation integration and field-value lifecycle;
- query/cache state owned by framework components;
- standard loading/error/empty/retry behavior;
- access *presentation* behavior while preserving the API as final authorization boundary;
- adapters, renderers, registry behavior, and framework plugin configuration;
- base and composite components supplied by Loom;
- wrappers/repackaging/styling of third-party UI primitives, including Reka UI;
- framework-owned visible copy and accessibility semantics;
- framework CSS and its coexistence behavior.

Loom **does not own** a consuming application's business workflow, custom page usability, final authorization decision, custom copy, information architecture, or app-specific accessibility defects outside Loom-owned primitives.

### 2.2 Supporting repository paths

- `packages/utilities`: inspect only when a Loom guarantee depends on it.
- `packages/sdk`: integration evidence only unless Carta's scope is formally expanded.
- `apps/api`, `apps/web`: representative consumer fixtures/integration evidence; domain assertions are not Carta requirements.
- `.github/workflows`, root toolchain configuration, and framework-sync scripts/docs: audit as **quality-system/supporting implementation evidence** when they directly affect buildability, testability, installability, security, or repeatability of the framework.

## 3. Responsibility classes

Every requirement is assigned one responsibility class.

| Class | Meaning |
|---|---|
| **FRAMEWORK** | Carta can satisfy or violate the requirement by its own implementation/configuration. |
| **SHARED** | Carta must provide a safe/correct seam and documented invariant; the consumer must supply policy/configuration. |
| **CONSUMER** | The application/deployment owns the actual property. Carta may provide an extension point but is not scored on the consumer's policy outcome. |

Example: authentication is **SHARED**. Sprindle must correctly resolve/use identity and fail predictably when `authenticated()` is used, while the application/identity provider owns MFA, session duration, password policy, etc.

## 4. Severity classes

- **GATE** — release/profile-blocking. Applicable item must be `PASS`.
- **ADVISORY** — finding is recorded and prioritized, but does not by itself invalidate the Carta quality-profile result.
- **OUT** — deliberately outside the baseline Carta target. Keep the entry visible with rationale and reassessment trigger.

## 5. ISO/IEC 25010:2023 applicability matrix

The `3.x` references below are the ISO/IEC 25010:2023 term/subcharacteristic identifiers used for mapping. They are **not a list of prescriptive implementation controls**.

| ISO ref | Characteristic / subcharacteristic | Carta treatment | Primary component | Rationale |
|---|---|---|---|---|
| 3.1 | Functional suitability | **GATE** | Both | Framework contracts must cover and correctly perform the standard use cases Carta claims to provide. |
| 3.1.1 | Functional completeness | **GATE** | Both | Claimed canonical framework tasks must have complete supported paths, without hidden mandatory workarounds. |
| 3.1.2 | Functional correctness | **GATE** | Both | Runtime behavior, types, schemas, envelopes, state transitions, and public contracts must agree. |
| 3.1.3 | Functional appropriateness | **GATE** | Both | Framework abstractions should reduce consumer work rather than duplicate or obstruct underlying platform capabilities. |
| 3.2 | Performance efficiency | **GATE** | Both | A framework can impose material runtime and development-time overhead on every consumer. |
| 3.2.1 | Time behaviour | **GATE** | Both | Representative request/render/build/type-check time must stay inside explicit budgets. |
| 3.2.2 | Resource utilization | **GATE** | Both | Runtime memory and especially framework-induced TypeScript/compiler memory are framework quality concerns. |
| 3.2.3 | Capacity | **GATE** | Both | Canonical resource/list/form patterns must remain usable at declared fixture sizes. |
| 3.3 | Compatibility | **GATE** | Both | Framework coexistence and interoperability are core to reuse. |
| 3.3.1 | Co-existence | **GATE** | Loom-heavy | Loom must not pollute consumer CSS/DOM/global state; dependencies must coexist without accidental duplication/conflict. |
| 3.3.2 | Interoperability | **GATE** | Both | Declared Hono/Drizzle/Zod/Vue/router/adapters/wire contracts must interoperate as documented. |
| 3.4 | Interaction capability | **GATE** | Loom | Loom ships interactive UI behavior and therefore owns framework-level interaction quality. |
| 3.4.1 | Appropriateness recognizability | **ADVISORY** | Loom/docs | Important for discoverability/adoption, but weaker as a recurring release gate. |
| 3.4.2 | Learnability | **GATE** | Both | Developers must be able to learn standard framework paths from public documentation and diagnostics. |
| 3.4.3 | Operability | **GATE** | Loom | Standard components must be operable with expected pointer/keyboard/focus behavior and state feedback. |
| 3.4.4 | User error protection | **GATE** | Loom + Sprindle | Framework validation, destructive-action patterns, and server rejection must reduce preventable errors. |
| 3.4.5 | User engagement | **ADVISORY** | Loom | Consistency matters; aesthetic preference should not become an ISO pass/fail proxy. |
| 3.4.6 | Inclusivity | **GATE** | Loom | Loom-owned components/wrappers must not exclude users through avoidable interaction/semantic barriers. |
| 3.4.7 | User assistance | **GATE** | Loom | Labels, errors, instructions, and assistance owned by framework controls must be perceivable and associated correctly. |
| 3.4.8 | Self-descriptiveness | **GATE** | Both | UI state and developer-facing failures should explain themselves sufficiently to use/debug the framework. |
| 3.5 | Reliability | **GATE, tailored** | Both | Evaluate framework-controlled correctness under normal/failure conditions, not infrastructure uptime. |
| 3.5.1 | Faultlessness | **GATE** | Both | Public primitives must behave consistently across supported paths and implementations. |
| 3.5.2 | Availability | **OUT** | Consumer/ops | Service uptime, HA, replicas, DB availability, DNS, etc. are deployment properties. |
| 3.5.3 | Fault tolerance | **GATE, narrow** | Both | Carta must handle malformed input, dependency errors, hook failures, and UI load failures without undefined/corrupt state. |
| 3.5.4 | Recoverability | **GATE, narrow** | Both | Framework writes should preserve atomicity where promised; Loom standard states should permit safe retry/recovery. |
| 3.6 | Security | **GATE, tailored** | Sprindle-heavy | Carta owns safe framework boundaries and resistance, not the application's complete security program. |
| 3.6.1 | Confidentiality | **GATE** | Both | Framework errors/logging/scopes must not disclose or widen access to data. |
| 3.6.2 | Integrity | **GATE** | Sprindle | Validation, server-owned values/scopes, transactions, and canonical writes must preserve declared invariants. |
| 3.6.3 | Non-repudiation | **OUT baseline** | Consumer | A legal/audit non-repudiation facility is normally a business/compliance feature, not Carta core. |
| 3.6.4 | Accountability | **GATE, enabling** | Sprindle | Provide traceable request/identity/logging seams; do not require a full immutable audit-ledger product. |
| 3.6.5 | Authenticity | **GATE, shared** | Sprindle | Authentication seam and framework use of resolved identity must be correct; identity-provider policy remains consumer-owned. |
| 3.6.6 | Resistance | **GATE** | Both/tooling | Validate untrusted inputs, fail safely, manage known vulnerable dependencies, and keep extension seams explicit. |
| 3.7 | Maintainability | **GATE — highest priority** | Both | Maintainability is a defining quality of a framework reused and modified across applications. |
| 3.7.1 | Modularity | **GATE** | Both | Boundaries between framework, transport, source, UI, app, and third-party primitives must remain explicit. |
| 3.7.2 | Reusability | **GATE** | Both | Framework APIs must remain generic and reusable across applications without project-specific assumptions. |
| 3.7.3 | Analysability | **GATE** | Both | Code structure, diagnostics, request IDs, docs, and tests must make causes/impact of change discoverable. |
| 3.7.4 | Modifiability | **GATE** | Both | Changes should have controlled blast radius and an explicit compatibility/migration policy. |
| 3.7.5 | Testability | **GATE** | Both | Public behavior must be objectively testable with deterministic fixtures and contract/type/browser tests where appropriate. |
| 3.8 | Flexibility | **GATE, tailored** | Both | A framework must adapt across consumers and evolve without becoming the bottleneck. |
| 3.8.1 | Adaptability | **GATE** | Both | Supported extension points should accommodate app differences without framework forks. |
| 3.8.2 | Scalability | **GATE** | Both | Runtime and compile/type complexity must scale acceptably with representative consumer size. |
| 3.8.3 | Installability | **GATE** | Both/tooling | A clean supported consumer/bootstrap must install, type-check, test, and build reproducibly. |
| 3.8.4 | Replaceability | **ADVISORY** | Both | Avoid needless lock-in and preserve underlying-platform escape hatches, but full drop-in framework replacement is unrealistic. |
| 3.9 | Safety | **OUT baseline** | Consumer/domain | Carta is not specified as a safety-related control system. |
| 3.9.1 | Operational constraint | **OUT baseline** | Consumer/domain | Reopen for safety-related use. |
| 3.9.2 | Risk identification | **OUT baseline** | Consumer/domain | Reopen for safety-related use. |
| 3.9.3 | Fail safe | **OUT baseline** | Consumer/domain | Security/reliability fail-safe behavior is still audited under 3.5/3.6; safety-hazard fail-safe is out. |
| 3.9.4 | Hazard warning | **OUT baseline** | Consumer/domain | Reopen for safety-related use. |
| 3.9.5 | Safe integration | **OUT baseline** | Consumer/domain | Reopen if Carta is explicitly approved for safety-related systems. |

## 6. Reassessment triggers

The quality profile must be reviewed when any of these becomes true:

1. Carta takes ownership of deployment/runtime hosting, HA, failover, or service-level objectives → reassess **3.5.2 Availability**.
2. Carta adds immutable audit evidence, signatures, legally significant approvals, or identity-proof mechanisms → reassess **3.6.3 Non-repudiation**.
3. Carta is approved or marketed for software where malfunction can contribute to harm to people, property, or environment → reassess all of **3.9 Safety**.
4. Carta becomes responsible for master-data quality, lineage, cleansing, or data-quality governance → evaluate whether ISO/IEC 25012 should join the profile.
5. Carta adds AI/ML components whose model behavior is part of the framework contract → evaluate ISO/IEC 25059 and related AI quality standards.
6. Carta starts shipping as a standalone ready-to-use product rather than a development framework → reassess ISO/IEC 25051 applicability.
7. The supported consumer context changes materially (for example non-web UI, mobile UI, serverless-only runtime, or multiple ORM/router backends) → update compatibility, interaction, flexibility, and quality-in-use contexts.

## 7. Quality-in-use

ISO/IEC 25019:2023 is **not part of the routine Carta source/product audit**. It may be used periodically with a specifically declared context such as:

> “A developer familiar with TypeScript but new to Carta adds a standard Sprindle resource and Loom CRUD surface using public documentation only.”

Such a study can evaluate developer effectiveness, efficiency, and satisfaction, but its results should be reported separately from the product-quality GATE result.
