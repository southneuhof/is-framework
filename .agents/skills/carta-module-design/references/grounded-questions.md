# Grounded questions

Use questions to acquire missing authority or knowledge, not to make the user
navigate an invented decision tree.

## Choose the right action

| Missing information | How to resolve it |
|---|---|
| Fact available in code, tests, config or supplied material | Inspect its owner and applicable consumers. |
| Actual business practice not represented in those sources | Ask for a concrete walkthrough, example or reference. |
| Conflict between current behavior and intended behavior | Show the competing evidence and ask which outcome is required. |
| Genuine product choice with known consequences | Explain the trade-off, make a grounded recommendation, and obtain a decision. |
| Implementation choice that preserves the contract | Leave it to the planner or implementer within stated boundaries. |

Keep a short unresolved-decisions table in the design: gap, affected behavior,
why it matters, available evidence, and the next source or decision needed.
Ask about dependencies before their consequences. Do not introduce technical
options before learning what the business needs to accomplish.

## Learn before choosing

For an unfamiliar approval process, start with a real instance:

> Walk me through one completed request, including who handled it and any
> returns or exceptions. A redacted request form or completed approval record
> would help establish the actual fields and handoffs.

After inspecting the evidence, a decision can be specific:

> The procedure names the department manager, but this completed request also
> has a Finance approval. Is Finance approval mandatory in the new module?

The second question is justified by the first answer and reference. It is not
an invitation to choose among generic workflow designs. Use reference requests
selectively; when no artifact exists, ask the user to explain the process and
confirm the intended rule. Request only the relevant redacted material, never
credentials or unnecessary personal records.

## Preserve decisions

Summarize the current understanding in the user's terms when it enables them
to correct the model. Distinguish a factual correction from approval of a new
requirement. A field from an example does not automatically become mandatory;
a single exceptional request does not automatically define the normal flow.

Use bounded options only when evidence establishes the option space. Open
questions remain appropriate for unusual workflows and domain vocabulary.
State why a consequential question matters, but do not require a template for
every turn. Revisit settled decisions only when new evidence creates a material
conflict, and identify the exact earlier decision affected.
