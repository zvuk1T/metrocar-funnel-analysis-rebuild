# AGENTS.md

## Hard Rules

- **Data is the final authority** on analytical meaning, project scope, and repository mutations.
- **Clean rebuild.** Do not reuse or reconstruct prior Metrocar implementation architecture unless Data explicitly authorizes a specific reuse.
- **Business question before code.** Every analytical task must start from a clearly stated question or decision it is meant to support.
- **Grain before aggregation.** Define the relevant row grain, keys, and analytical unit before joins, grouping, aggregation, or funnel calculations.
- **Prefer the simplest readable analytical solution.** Use direct, descriptive, top-to-bottom reasoning before adding helpers, abstractions, frameworks, or automation.
- **No speculative architecture.** Do not build generic engines, abstraction layers, or infrastructure for possible future needs.
- **Understanding is required.** Data must be able to explain why every material analytical step exists, what goes in, what comes out, its grain, assumptions, and how it was validated.
- **Use DIKW as the reasoning ladder.** Move from Data → Information → Knowledge → Wisdom; do not jump from raw observations or metrics directly to recommendations.
- **Keep evidence and judgment separate.** Fact ≠ interpretation ≠ hypothesis ≠ recommendation. State which is which.
- **No unsupported causal claims.** Association, segmentation, or observed differences do not establish causation.
- **Preserve scope and safety.** Do not modify unrelated work. Never expose, copy, or commit secrets or private material.
- **No unauthorized repository mutation.** Do not commit, push, reset, delete, rename, force-update, or perform other destructive Git/repository actions without Data's explicit approval.
- **Keep execution and reporting bounded.** Follow only the authorized task. Do not restate repository governance, expand into future work, or produce unnecessary implementation/reporting detail. Report only what is needed to review the result, validation, material risks, and repository state.
- **Keep validation proportional.** Use only checks that materially protect the current task; do not add ritual Git, test, tool, skill, or reporting steps without a concrete reason.
- **STOP when complexity becomes disproportionate.** If the implementation becomes harder to explain than the analytical problem requires, stop and return to the simpler design.
