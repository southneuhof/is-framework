---
name: build-resource-form
description: Use when implementing or reviewing Carta resource forms, field sources, dependent inputs, child records, and their API contracts.
---

# Build Resource Forms

Use this skill for a Carta resource form and its API contract. Implement only
the actions selected by the approved design. Use standard forms for ordinary
create/update actions; use the workflow section for domain actions, child
records, or several writes.

When a parent module design already approves the relevant behavior or framework
boundary, use that recorded authority. Return only newly exposed material gaps
to `$carta-module-design`; routine technical implementation needs no new product
approval. Use the parent plan's proof obligations and the shared
[verification strategy](../carta-module-development/references/verification-strategy.md)
for module work rather than adding another verification loop.

## Read the current source first

Read these files before editing:

1. `AGENTS.md`.
2. `docs/ui/README.md` and `docs/ui/forms.md`.
3. `docs/architecture/web-application-architecture.md`.
4. `packages/loom/README.md`.
5. `.agents/skills/web-ui-surfaces/SKILL.md` for web UI work.
6. The owning route, schema, resource, actions, API route, entity, and tests.
7. [references/form-field-types.md](references/form-field-types.md) to identify
   the renderer or composite selected through `docs/ui/forms.md`.
8. `apps/web/src/routes/(demo)/input-catalog/inputCatalogDemo.ts` and
   `packages/loom/src/renderers/form.ts` for the live renderer
   keys.
9. `apps/web/src/framework/inputs/registry.ts` and a current resource with a
   `source` when you configure a resource-backed field.

Do not guess framework APIs from memory. The UI contract owns visual structure;
nearby modules supply domain evidence only. For standard CRUD, use the returned
resource action and its named route target. When the current framework cannot
express the UI contract, record the exact gap and stop before a route-local
substitute or `packages/loom` change.

## Default workflow

### 1. Define the contract

Keep the API entity schemas as the write contract. Bind them to the web
resource schema:

```ts
import { defineSchema, fromZod } from '@southneuhof/loom'
import { record } from '@southneuhof/api/routes/records/records.entity'
import type { AppResourceContract } from '@/framework/hono'
import { rpc } from '@/framework/rpc'

export const recordsSchema = defineSchema<AppResourceContract<typeof rpc.records>>({
  identity: 'id',
  record: { schema: fromZod(record.schemas.select) },
  create: { schema: fromZod(record.schemas.create) },
  update: { schema: fromZod(record.schemas.update) },
})
```

Use `fromZod(schema)` without a caller-supplied output type. Add a query schema
only when the resource exposes typed query values.

### 2. Define one field catalog

Use `defineFields(schema, definitions)` for shared labels, surface projections,
sources, and pure form behavior:

```ts
const statusOptions = [
  { id: 'open', name: 'Open' },
  { id: 'closed', name: 'Closed' },
] as const

const fields = defineFields(recordsSchema, {
  name: { label: 'Name', form: { renderer: 'text' } },
  status: {
    label: 'Status',
    form: { renderer: 'radio', source: statusOptions, props: { required: true } },
  },
})
```

When legacy is the business reference, copy each user-facing label exactly
from the legacy field and surface inventory. Preserve capitalization,
punctuation, singular/plural form, terminology, and visible validation or
workflow text. Do not translate, shorten, improve, or invent a synonym. If the
legacy label is missing or ambiguous, stop and record the decision before
editing the resource.

Keep a relation label in `display.read` and the submitted ID in the form field.
Use `form.write` only when the input value needs conversion before submit. Use
the [field type manifest](references/form-field-types.md) to select an existing
renderer or composite before you add UI code.

For a recurring field such as `active`, use the app field default. Add local
field configuration only for a proved resource difference. The field must
still be selected by each action that reads or writes it.

### 3. Bind fields to each action

Field order belongs in each action. Bind only the fields that the action can
read or write:

```ts
export const records = defineResource(recordsSchema, {
  key: 'records',
  actions: {
    create: { run: recordsActions.create, fields: [fields.name, fields.status] },
    update: { run: recordsActions.update, fields: [fields.name, fields.status] },
  },
})
```

Use the standard view shells in route files:

```vue
<ListView v-bind="records.list()" />
<DetailView v-bind="records.detail({ id })" />
<FormView v-bind="records.create()" title="Create record" />
<FormView v-bind="records.update({ id })" title="Edit record" />
```

Set action permissions and named route targets in the resource. Keep route
navigation, custom dialogs, toasts, and post-submit work in the route.
The framework UI default supplies the `Submit` label. Standard and custom
full-page forms use `FormView`; form actions stay at the bottom-right.

### 4. Add dependent behavior

Use pure, synchronous behavior functions:

- `visible` controls presence and submitted visibility.
- `disabled` prevents input while a dependency is missing or locked.
- `props` supplies source values such as parent IDs through
  `searchParameters`.
- `resetWhen` clears a child value when its parent identity changes.
- `derived` computes a value that the user does not edit.
- `presentation` changes renderer presentation only when the current field
  needs a reactive display change.

Behavior functions must not write to the draft or perform I/O. Hidden fields
are excluded from the submitted draft. The schema remains the source of truth
for validity.

For example, on an already configured resource-backed standard list field,
disable the child until its parent exists, pass the parent to the source, and
clear the child when the parent changes:

```ts
behavior: {
  disabled: ({ draft }) => !draft.divisionId,
  props: ({ draft }) => ({ searchParameters: { divisionId: draft.divisionId } }),
  resetWhen: ({ draft }) => draft.divisionId,
},
```

For a database-backed field, import the owner resource as `source`. The owner
`list` and `detail` actions are the only allowed option sources. Pass
`searchParameters`. Do not redeclare the owner query. Do not add
`/<consumer>/create-options/*`. Do not add `/lookup`. Do not add a second list
on the consumer. Do not replace a server source with a full in-memory array.
Read the exact renderer key from the app input registry and a nearby current
resource.

If the owner list or detail cannot serve the field, stop. Tell the user the
missing owner filter or contract. Use `$carta-module-design` for the missing material decision
before you add or change a route. Do not invent a custom endpoint.

API list and detail use `list-*` / `detail-*`. Resource `permission` stays
`view-*` for the admin screen.

Use `initialData` for fixed parent values in a create or update action. Use
`context` for stable screen information that affects behavior. Use
`searchParameters` for values sent to a list or detail source.

### 5. Use terminal overrides for local action changes

Reuse the catalog and apply one terminal override when one action differs:

```ts
update: {
  run: recordsActions.update,
  fields: [fields.name, fields.status.override({ form: { behavior: { disabled: () => true } } })],
},
```

An override is terminal. Do not chain overrides or create a second catalog for
one action.

### 6. Expose the API contract

Use the backend rules in `references/backend-form-contract.md` when the owner
list already has the needed filter, or after the user approves a new owner
filter or a custom write. Do not add a route first and document it later.

#### Query ownership

A list endpoint owns the query contract for its resource. Before adding an
endpoint-specific query schema:

1. Read the shared parser used by the route, starting with
   `packages/sprindle/src/validation/common-schemas.ts`.
2. Check whether it already preserves custom filter keys.
3. Reuse the source resource's query contract when a form passes
   `searchParameters`.
4. Add an endpoint-specific schema only for runtime validation, coercion, or a
   typed guarantee that the shared parser does not provide.

A parent form passes dependency values to a source resource; it does not
redeclare that resource's filters. Do not create a query schema only because a
service reads a value.

Expose and test only the actions selected by the design and used by the resource:

- list: paginated rows and total;
- detail: one authorized record;
- create: validated input and created record;
- update: identity, validated input, and updated record; and
- delete: authorized removal when the screen supports it.

For a resource-backed standard list field, the source list must accept the
field's search and dependency parameters. Its detail action must return the
selected record so an edit form can display an existing value without loading
the full collection.

### 7. Verify the real flow

Run focused checks for the changed module:

- resource test: field order, renderer, source, behavior, and overrides;
- action test: query forwarding, dependency parameters, and input mapping;
- API test: authentication, scope, validation, filtering, sorting, paging,
  detail access, and write rules;
- web type check and focused lint;
- `git diff --check`; and
- the parent plan’s focused Playwright obligations for the changed form and
  its consumers, with persisted outcomes. An unavailable browser environment
  blocks those obligations; other automated checks do not establish them.

In the browser, confirm that a standard list source sends page, limit, search,
and dependency values; changing search sends a new server request; returned
rows are already scoped; and edit forms load selected values through detail
requests.

Report web UI reuse as:

- `Reused`: UI contract patterns, framework surfaces, and app adapters used;
- `Searched`: relevant framework files and registered surfaces checked; and
- `Gap`: exact missing surface, or `None`.

## Custom workflows and child data

Use standard resource actions for ordinary entity CRUD. Do not add a custom
endpoint for options, search, or a filtered list. Those stay on the owner
`list` and `detail`.

A custom write is for domain behavior the standard actions cannot express.
Use the approved contract for its route behavior, access and payload. If that
behavior is missing, return the specific decision to `$carta-module-design`;
keep already approved custom actions moving.

For an approved custom write:

- define a separate input schema and endpoint when permission, state, or
  response differs from CRUD;
- use a custom resource action or a route-local `Form`/`DialogForm` submit;
- give each workflow action its own field set. Do not reuse a generic dialog
  field set when the clicked action already fixes a value such as a result;
- select the input through `docs/ui/forms.md`, then use
  [form-field-types.md](references/form-field-types.md) to identify the
  registered implementation. Use the `table` renderer and `TableInput` for
  editable row arrays. When the form decision selects a custom field, read
  [custom-field-contract.md](references/custom-field-contract.md);
- keep workflow controls and refresh behavior in the route;
- use one database transaction when parent and child writes must succeed
  together; and
- give a persistent child collection its own resource when it has independent
  screens or actions.

Do not create a generic workflow engine for one module. Keep domain checks and
state transitions on the server. Recheck every important relationship and
permission during submit even when the form source already filtered its rows.

## Stop conditions

Return a newly exposed material change to approved behavior, access policy,
transaction semantics or write authority to `$carta-module-design`. A missing
framework capability outside approved scope needs owner approval. Continue
routine implementation of an already approved boundary and preserve unrelated
completed work. Record the exact blocked obligation rather than reinterviewing
the whole module.
