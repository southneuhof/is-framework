# Playwright UI evidence

Use this reference for approved UI acceptance. The design owns the visible
outcomes; the plan names the cases and data that demonstrate them.

## Journey and data

Use focused Playwright cases with named steps that map to acceptance IDs.
Split independent scenarios when it improves isolation; neither one giant test
nor a fixed number of journeys is required. Verify each required route/action,
including parent-owned child surfaces when applicable. Exercise changed create,
update and workflow interactions through the visible authenticated UI, then
verify the persisted outcome by reload or navigation. API setup can create
fixtures; it does not replace the interaction being tested.

Use the guarded E2E target, its dedicated database/storage and documented fixture
owners. Inspect the current `apps/api` E2E scripts, guard and `.env.e2e` setup;
never use the Vitest or development database/bucket for E2E reset. Serialize
preparation and tests sharing that target. Establish known fixtures once, then
rerun focused checks after a justified fix. Reprepare when a prior run changed
the required starting state. Seeded reference data is not disposable by default.

Confirm target configuration and service health. Use the package's Playwright
configuration and supported setup; it owns ports, projects, report paths and
server lifecycle. A development-only visual inspection does not establish the
required automated journey.

## Evidence and diagnosis

Use the current focused `test:e2e` command and exact spec/test selector. Confirm
the expected cases actually ran, including denied/empty/failure cases selected
by the plan. Reuse a passing run when code, tests, relevant dependencies,
fixtures and environment are still applicable. A valid run need not be repeated
merely because it was initially called a debug run.

Preserve the configured JSON/HTML reports and relevant attachments under a
unique `plans/<feature>/reports/<run>/` directory before another run overwrites
working outputs. Preserve relative attachment layout or adjust links when
copying. Record the exact command, working directory, design revision, input
snapshot, environment identity and cases/steps covered.

Inspect screenshots, trace, log and current DOM for a failure before changing
selectors. A selector repair must still test the required interaction. Keep the
failed result and record its replacement pass. A screenshot alone does not
prove persistence, permission enforcement or successful submission.

Use the [verification strategy](verification-strategy.md) for evidence freshness
and verdicts. A supported UI obligation without executable browser evidence
remains blocked; backend, lint and type checks do not silently replace it.
