# Module execution worksheet

The feature folder is the durable handoff:

```text
plans/<feature>/
  design.md
  worksheet.md
  001-<observable-result>.md
  reports/
```

## Authority and state

| Information | One owner |
|---|---|
| Intended behavior, decisions and approval | `design.md` or the exact approved source it incorporates |
| Technical order, dependencies, scope and proof obligations | Numbered plans |
| Artifact ledger, plan index, live state and acceptance/handoff results | `worksheet.md` |
| Observed command/UI results, snapshots and review verdicts | Named reports |

The design's acceptance IDs are the stable join key. A worksheet row references
the rule rather than repeating its definition. Its implementation and evidence
columns are the semantic handoff; no separate undocumented handoff file exists.
The planner owns proposed checks; actual commands and results live in reports.

Feature states: `INTAKE` → `DESIGN` → `PLAN` → `READY` → `EXECUTE` →
`VERIFY` → `DONE`. Use `BLOCKED` with the affected stage and exact missing
prerequisite. Skip already completed stages when resuming valid artifacts.

Plan states: `TODO`, `IN_PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`,
`SUPERSEDED`. `IMPLEMENTED` means the executor has completed that plan's work and
checks. `VERIFIED` means an acceptance review passed for that scope. Neither
alone implies feature `DONE`. Explicit prerequisite gates can require a reviewed
plan; otherwise a dependent plan can proceed when the required interface and
its checks are complete.

Acceptance results: `PENDING`, `PASS`, `FAIL`, `BLOCKED`, `NOT_NEEDED`.
`NOT_NEEDED` needs an applicability reason consistent with approved scope; it
cannot waive an approved requirement. Every required row has a primary plan
owner and may name additional integration evidence from other plans.

Feature `DONE` requires all selected plans verified, every required acceptance
row passing with current evidence, final cross-plan effects checked, and a
recorded final verdict. A standalone verification skill returns the verdict;
the workflow owner records it and advances state. Independent review is used
when available; otherwise explicitly record self-review with identical criteria.

## Initialize and maintain

Use [the worksheet template](../assets/worksheet-template.md), or run:

```sh
python3 .agents/skills/carta-module-development/scripts/init_worksheet.py <feature-slug>
```

The initializer never overwrites an existing worksheet. Keep older valid plans,
numbering and history on resume. If a prior `README.md` is the live execution
index, designate one owner and turn the other into a pointer. Translate legacy
states by their evidence, not by renaming `DONE` to a verified result.

Update at meaningful stage/slice handoffs, new decisions, failures and completed
verification, not after every command. Record the next concrete action and its
boundary. Source edits begin only under implementation authority. A material
behavior change invalidates the affected approval/evidence, not all prior work.

## Review input

The reviewer receives design and revision, relevant plans, the acceptance/handoff
rows, the in-scope diff (including new/dirty files), evidence paths and declared
write boundaries. If an artifact is unavailable, identify the missing evidence
and keep that scope blocked; do not reconstruct decisions from memory.
