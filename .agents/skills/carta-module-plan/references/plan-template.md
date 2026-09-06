# Carta handoff plan template

Adapted from the bundled `improve` plan structure. Keep its human-readable
organization and concrete implementation guidance. The executor receives this
plan, the approved design, the feature worksheet and repository access, but no
discovery conversation. Reference those authorities; inline only the local
context needed to recognize owners, understand intent and avoid a known trap.

Use `plans/<feature>/NNN-short-slug.md` in dependency order. Preserve existing
numbers. Fill applicable sections concretely; omit optional sections that have
no work to do. Template prompts below are authoring instructions, not unfinished
content to leave in a ready plan.

## Template

````markdown
# Plan NNN: <Imperative title describing the observable result>

> **Implementation instructions:** Read this plan and the referenced design.
> Implement the named outcomes within scope, prove the acceptance obligations,
> and update the feature worksheet at meaningful handoffs. Continue ordinary
> local fixes within the permitted test boundary. Escalate the specific issue
> in STOP conditions instead of inventing behavior.
>
> **Drift check:** Compare the planned source snapshot with the current relevant
> working tree before starting or resuming. Reconcile changed owners and preserve
> prior valid work. A changed file is a reason to inspect, not an automatic stop.

## Status

- **Design:** `design.md`, approved revision `<revision>` and approval reference.
- **Acceptance:** `<owned acceptance IDs>` and related behavior IDs.
- **Priority:** `<P1, P2 or P3 selected for this plan>`.
- **Effort:** `<S, M or L>`.
- **Risk:** `<LOW, MED or HIGH>` with the concrete risk.
- **Depends on:** `<plan paths and the interfaces/evidence required, or none>`.
- **Category:** `<feature, bug, security, perf, tests, migration, dx or docs>`.
- **Planned at:** `<source commit and date; archive identity when Git is absent>`.
- **Input snapshot:** `<report path covering relevant source/configuration>`.
- **Execution state:** `worksheet.md` → this plan's row (the sole state owner).

## Why this matters

Explain the user-visible result and why the change is needed. Reference the
approved behavior IDs. Explain any non-obvious trade-off important to execution;
keep the design as the authority for the rule itself.

## Current state

- Relevant existing files and symbols, each with its role and inspection source.
- Small current-state excerpts where they help identify a fragile interface.
- Existing owners and affected consumers, including relevant scopes and caches.
- The actual pattern to reuse, with a verified exemplar path and symbol.
- Expected new files clearly distinguished from existing inspected files.
- Relevant glossary/ADR/design-system references and their applicability.

## Commands you will need

| Purpose / obligation | Working directory | Exact command | Expected result / evidence |
|---|---|---|---|

Use commands from current package scripts and test configuration. State exact
spec paths or selectors, fixture/setup prerequisites and environment identity.
Distinguish commands inspected but not run from a verified baseline. Include
only checks this plan needs; root `test` does not imply Playwright ran.

## Suggested implementation toolkit

Name the applicable Carta layer skills and references. Include tools only when
this work uses them. The layer skills own framework patterns; this plan owns
where and why they are applied.

## Scope

**In scope:** Primary code owners, intended changes and supporting test/fixture,
navigation or registration edits needed for the selected behavior.

**Out of scope:** Specific related behavior and framework surfaces excluded by
the design, with the reason where non-obvious.

**Allowed side effects:** Exact local/test environments and operations permitted.
Identify migration generation separately from applying it. Keep production,
external and destructive shared writes outside scope unless expressly authorized.

The owner list guides the work. An ordinary supporting edit within this scope
can be recorded without a new approval. A new product rule, public interface
change, framework package change or write target crosses the authority boundary.

## Git workflow

Record observed repository conventions and preserve unrelated user work. State
the comparison base and any pre-existing relevant changes. Commit or branch only
within the authorized task. Push, issue publication and PR creation require
explicit authority; none is implied by writing or executing this plan.

## Steps

### Step 1: <Implement a concrete, independently checkable result>

State the behavior IDs, exact owners/symbols, intended change and any consumed
or produced interface. Include target code shape only when it is load-bearing.

**Verify:** `<check or named obligation>` → `<observable expected result>`.
Use the smallest useful check at this boundary. A later shared gate can prove
several dependent edits; do not rerun the same broad suite after each edit.

### Step 2: <Next dependency-ordered result>

Continue until the complete vertical result, its affected consumers and tests
are covered. Specify migration/backfill order and recovery where applicable.

## Test plan

| Acceptance ID | Risk / counterexample | Test owner and exact case | Required surface | Expected result |
|---|---|---|---|---|

Name existing tests to extend and new tests to add. Cover the important success
and failure semantics from the design, including direct backend denial for
access rules and relevant relationship, retry, atomicity or cache behavior.

Map UI obligations to focused Playwright cases/steps and the persisted visible
outcome. Use backend tests for exhaustive state/permission combinations rather
than duplicating all combinations in browser tests. List broader checks only
when a shared boundary or dependency exposes other consumers.

## Done criteria

- [ ] Every owned acceptance ID has direct implementation and current sufficient
      test/review evidence in the worksheet.
- [ ] Required commands pass with named reports; selectors ran the intended tests.
- [ ] Required UI obligations have passing browser evidence and preserved artifacts.
- [ ] Scope, affected consumers, data/migration effects and denied cases are covered.
- [ ] No unapproved behavior or write has been introduced.
- [ ] The semantic handoff and execution row are updated; missing checks remain
      visible rather than being converted to success.

Replace these prompts with the plan's actual obligations and exact evidence
locations. A command exit code alone does not establish business completeness.

## STOP conditions

Name this plan's actual boundaries: an unresolved business rule, contradictory
source ownership, a required incompatible interface change, an unapproved
framework/external/destructive write, or missing safe runtime prerequisites.
State which part is blocked and what evidence or authority resolves it.

An ordinary failing test inside scope calls for diagnosis and a justified fix,
not an arbitrary two-attempt limit. Repeated failure without new evidence calls
for a diagnosis change or a blocker report, not blind retries. Preserve passing
unaffected evidence and unfinished work.

## Maintenance notes

Describe the future changes that would require revisiting this implementation,
non-obvious review risks, and explicitly deferred follow-up with its reason.
Keep ordinary implementation detail in code and tests, not another shadow spec.
````

## Execution index

Use `plans/<feature>/worksheet.md` as the index. It retains the useful `improve`
execution table: Plan, Title/result, Priority, Effort, Depends on, Status and
Evidence. Add dependency notes explaining what must exist before a dependent
plan can start. The
[worksheet contract](../../carta-module-development/references/module-execution-worksheet.md)
owns state names and handoff fields; no second `README.md` status table is needed.

When resuming an older feature whose index is `README.md`, preserve existing
identifiers and history. Designate that index or the worksheet as the one state
owner and make the other a pointer, rather than maintaining two live copies.
Record abandoned/superseded work and its reason so it is not silently revived.

## Quality bar

A fresh executor can identify the change and its proof from the handoff packet.
Every acceptance ID has an owner, dependency outputs are defined where needed,
commands and source references are real, and stop conditions reflect actual
risk. The plan adds execution information rather than rewording the design.
