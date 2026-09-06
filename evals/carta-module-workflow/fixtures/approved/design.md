# Service-category catalogue — approved evaluation contract

Revision: r1. Status: APPROVED for the evaluation task by the requester.
The approval covers design and planning; implementation requires the case request.
This is a hypothetical application contract, not a Carta framework default.

## Purpose and scope

Staff need a read-only catalogue of service categories for interpreting requests.
Include list and detail only. Exclude create, update, delete, import, export,
notifications and administration. Existing data is maintained outside this feature.

## Evidence and relationships

The supplied `owners/categories.ts` establishes the existing category owner,
resource identity `id`, natural lookup key `code`, and request reference. Reuse
that ownership. Inspect actual Carta framework/source owners for implementation
patterns, not for additional business policy. There is no tenant/department
filter for this catalogue; all authorized staff see the same records.

## Data

B-01: Preserve `id`, `code`, `name`, `active`. `id` is opaque and not user-editable.
Code and name are nonempty strings; this feature does not write them. Inactive
categories remain visible, explicitly labelled Inactive, for historical meaning.
Existing request lookup by `code` remains unchanged.

## Actions and access

B-02: List requires `list-service-categories`. Detail requires
`detail-service-categories`. Anonymous calls receive 401; authenticated callers
without the relevant permission receive 403 directly from the API. Navigation
uses the list permission. No additional actions or permissions are introduced.
B-03: List starts at page 1 with 20 records, filters free-text search against
code and name case-insensitively, and orders by code then id. Use Carta's standard
pagination/envelope. Empty results show an empty state. Unknown detail IDs return
404, not an empty successful record. No cross-module writes occur.

## User-visible behavior

B-04: Under Settings, place Service Categories after Roles. List shows Code,
Name and Status, with a View action only when detail permission is present.
Detail shows those fields and a Back action. A failed load displays the actual
error state with retry. Loading, empty and loaded states are distinct. No hidden
or disabled create/edit/delete control exists. Search/paging and a selected detail
survive a browser reload through the route's query/identifier state.

## Acceptance examples

A-01 (B-01/B-03): With active code A and inactive code B, the unfiltered list shows
both in code order, and B is labelled Inactive. Searching its name finds B.
A-02 (B-02): Test anonymous and authenticated-but-unpermitted calls to both API
actions; also test a permitted call. Hiding navigation alone does not prove denial.
A-03 (B-01): Existing requests referencing categoryCode B still resolve B despite
its inactive status. No migration from categoryCode to categoryId occurs.
A-04 (B-04): In Playwright, a permitted user searches, opens detail and reloads;
the selected record persists. Read-only controls, empty/loading/error/retry states
are established by relevant focused tests and the journey, not a screenshot alone.
A-05 (B-03): Detail for a missing identifier returns 404; the UI displays that
failure without constructing a fake record.

## Implementation boundaries

The planner selects route-file names, resource wiring, reusable helpers and exact
test locations from the checkout. It may use the canonical permission bindings
above. It may not change actions, access policy, reference keys or record visibility.
No framework-package edits, development database writes, external writes or seeds
are authorized. Plan tests on Carta's standard isolated infrastructure.
