# Verification strategy

Use this reference while planning proof obligations, collecting evidence and
reviewing a Carta module. Carta supplies Vitest, Playwright, lint and type-check
infrastructure. Package scripts/configuration own exact commands and selectors;
those tools are framework defaults, not product choices.

## Select proof by behavior and impact

Start from each approved acceptance ID and the affected owners/consumers. Choose
the smallest check that could distinguish the required result from a plausible
wrong implementation. Share evidence across rows where it genuinely proves them.

| Changed behavior / risk | Required evidence to consider |
|---|---|
| Input/value conversion, defaults or validation | Focused schema/resource tests and the relevant accepted/rejected API round trip. |
| Relationship/lookup | Correct key and owner, edit loading, parent-change behavior, and server rejection of invalid/out-of-scope references. |
| Authorization / scope | Authenticated allowed and denied direct API cases, including relevant ownership/scope; UI action visibility separately. Anonymous 401 alone is insufficient. |
| Workflow / coupled writes | Legal and rejected transitions, persisted effects, transaction rollback and retry/concurrency semantics when applicable. |
| Routes / form interaction | Focused route/component checks plus Playwright for required visible journeys and persisted results. |
| Consumer or cache effects | Relevant list/detail/report or other consumer freshness after the changed mutation. |
| Migration / seed | Reviewed SQL/data effects and execution against the explicitly isolated target. |
| Shared API/resource/framework boundary | Relevant dependent-consumer tests and package-level checks justified by dependency exposure. |

Do not translate every row into a separate tool run. Backend tests explore state
and access combinations; browser tests establish the real UI integration. Broader
verification follows affected dependencies and risk, not only a prior focused
failure. Lint and type checking cannot replace business assertions.

## Commands and environment

Resolve package scripts, filters, config and test patterns from this checkout.
Confirm that focused selectors select the intended tests; zero tests, skipped
requirements and generated scaffold smoke tests do not establish acceptance.
The root `test` command does not run the separate application Playwright suite.
Loom's browser tests and application E2E are different surfaces. Respect serial
API specifications sharing a database and serialize memory-heavy type checks.

Before DB-backed checks, use the guarded test command and explicit isolated
configuration. The API test preflight requires `.env.test`, a declared test
purpose/name and a target distinct from development. For browser tests, use the
existing guarded E2E setup described in [ui-automation.md](ui-automation.md).
A declared target identifies permitted disposable data; it is not permission
to mutate production or arbitrary remote systems.

Dependencies, browser binaries, ports and fixtures are operational prerequisites.
Prepare ordinary local prerequisites within task authority. If they cannot be
established safely, report the exact blocked checks rather than offering a new
test framework or claiming the runtime result from static checks.

## Tight loop

Run focused checks after a meaningful changed boundary. On failure inspect the
output and classify the cause: source, test expectation, fixture, environment,
tooling, pre-existing failure, or an unresolved requirement. Make an evidence-led
correction inside scope, then rerun the affected checks. Preserve failures in
the record; a later pass supersedes rather than erases them.

Reuse passing evidence when it covers the obligation and its relevant inputs
and environment are still valid. A new reviewer is not a reason to rerun it.
A change to a dependency, fixture, schema, config, contract or test can make it
stale even when the module file is unchanged. Include those inputs. A live
external dependency or contaminated shared environment may need fresh checking
without a source change; fingerprints alone cannot establish runtime isolation.

## Evidence interface

Each result records exact command/argument vector and working directory,
selected cases, environment identity (no credentials), source and approved design
revision, relevant input content fingerprints, result/exit code and artifact
paths. Include untracked files, deletions and changed dependency inputs. Git SHA
and changed filenames alone cannot distinguish two edits to the same file.
Keep final reports out of the tracked source input set to avoid self-invalidating
results. Include the design, but not worksheet status churn, as a contract input.

Use `node scripts/module-evidence.mjs --help` for snapshots, command recording
and freshness checks. The recorder executes a command once, preserves stdout and
stderr, and marks results invalid when relevant inputs change during the run.
The input list is a declared scope, not an automatic dependency analysis. Include
applicable owners, tests, configuration, lockfile and affected shared dependencies.
An empty input set is invalid. Reports are evidence, not proof that their selected
scope was sufficient.

The bounded static checker reports `scope: static`, `runtime: NOT_RUN` and
`acceptance: NOT_REVIEWED`. Its runtime mode covers its listed commands, not
Playwright or semantic acceptance. Use `--reports` for a durable summary and
command logs; its helper snapshot must be supplemented with contract/dependency
inputs when they are not in the generated-module set.

## Verdicts

`PASS` for an acceptance review means all required behavior is implemented and
proved with current sufficient evidence. `REWORK` means a wrong/incomplete result
fixable inside scope. `BLOCKED` means a missing decision, environment, authority
or inaccessible evidence prevents a sound verdict. Record the exact affected
acceptance IDs. Static pass, runtime pass and module acceptance are distinct.
