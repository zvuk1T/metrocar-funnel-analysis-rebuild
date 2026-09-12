# Metrocar Visual Design

## Purpose

This document defines how the Metrocar story should be communicated visually.

The validated analysis defines the evidence. `METROCAR_STORY.md` defines the story. This document defines only the visual direction.

It does not define frontend architecture, framework, routing, deployment, or implementation details.

## Visual Character

Metrocar should feel:

**clean · calm · precise · elegant · evidence-led**

The design should make a well-understood analytical story easier to see, not decorate complexity.

> **Clarity is evidence of understanding.**

## Visual Backbone

```text
Story determines hierarchy
→ hierarchy guides attention
→ evidence gets visual weight
→ interaction adds depth
→ restraint removes noise
→ design never outruns understanding
```

## Product Model

Metrocar is an **interactive analytical case study with two connected public reading depths**, not a generic dashboard and not one long page every visitor must consume.

### Metrocar Overview

The Overview is a compact, dashboard-like reading surface for approximately 3–10 seconds of recruiter attention. It must not become a generic dashboard application.

- Keep text density low.
- The provisional headline **Where does Metrocar lose momentum?** may lead, with the analytical business question as supporting framing.
- Surface the **50.24% Requested ≥1 → Completed ≥1** result immediately.
- Present the Customer Funnel and Ride Funnel as the two dominant interactive visual panels: side by side at suitable desktop widths and stacked on smaller screens.
- Add only one concise, evidence-bounded takeaway.
- Make **Explore Full Analysis** prominent; GitHub may remain a secondary route.

The acceptance-history result may appear as a brief summary, but its full reasoning and caveats should not be reproduced here.

No filters, comparison engine, admin interface, KPI wall, or old Funnel Explorer behavior belongs in the Overview.

### Full Analysis / Deep Dive

The Full Analysis is an optional long-form reading experience. It should preserve the structure and reasoning of the real learner-facing `metrocar_funnel_analysis.py`:

```text
business question → WHY → source/grain → code → result → validation → interpretation → limitation
```

Syntax-highlighted code, explanatory text, results, validation, and limitations may all be intentionally detailed. That density must not leak back into the compact Overview.

## Overview Visual Hierarchy

Visual weight should support rapid comprehension:

```text
Provisional headline + business question + 50.24% result
↓
Customer Funnel | Ride Funnel
↓
Concise bounded takeaway
↓
Explore Full Analysis — PRIMARY ROUTE
GitHub — SECONDARY ROUTE
```

Within the paired panels, the Customer Funnel remains the primary customer-level evidence and the Ride Funnel remains supporting context at a different grain.

## Deep Analysis Reading Flow

The deeper investigation should read naturally as one calm analytical narrative. The Customer Funnel leads into its weakest transition, the acceptance-history diagnostic supplies the analytical climax, and the evidence boundary remains next to the claim it qualifies.

Sections should not receive equal size or emphasis merely because a grid allows it.

## Primary Visual Anchors

### Customer Funnel

The primary customer-level visual and the first of the two Overview panels.

Stage names and counts must be immediately readable.

The `Requested ≥1 → Completed ≥1` transition should receive deliberate emphasis without implying causation.

### Ride Funnel

A supporting visual at `ride_id` grain and the second of the two Overview panels.

It should belong clearly to the same visual system as the Customer Funnel while remaining secondary in narrative importance.

The strict Reviewed stage represents reviewed rides within the Approved-payment path and must not be confused with all review evidence.

### Acceptance-History Diagnostic

This may be summarized compactly on the Overview and becomes the analytical climax in the Full Analysis.

The contrast between **128 (2.07%)** and **6,045 (97.93%)** should be immediately understandable in the deeper presentation.

The **user-history grain** and its limitation must remain visible. The visual must not imply that acceptance and non-completion occurred on the same ride.

## Color Direction

Use a dark-neutral analytical foundation with restrained green and teal accents.

Historical Metrocar reference colors:

- `#71C6B1` — preferred primary analytical teal
- `#73C991` — secondary green
- `#6A9955` — muted supporting olive
- `#1F1F1F` — dark-neutral reference

These colors define direction, not mandatory final design tokens.

Warm color may be used sparingly for meaningful loss, risk, or anomaly.

Color should guide attention, not decorate every stage.

Avoid rainbow funnels, excessive glow, neon styling, and cyberpunk or Matrix effects.

## Composition

Use typography, spacing, grouping, scale, position, and whitespace as the primary tools for hierarchy.

The Overview may use two strong analytical panels without turning the whole page into a uniform card grid. The Full Analysis should use a comfortable long-form reading column with code and evidence grouped near their explanations.

The Full Analysis may be information-rich, but neither presentation depth should feel crowded.

Every visual element should have a clear reason to exist.

## Plotly and Interaction

Plotly charts should feel native to the page rather than like embedded notebook output.

Essential meaning must be visible without interaction.

Hover may add:

- Count
- Percent of Previous
- Percent of Top
- useful contextual detail

Hover must not be the only place where the main result or material caveat can be found.

Interaction should deepen understanding, not create a second analytical system.

Do not add filters, tabs, comparison engines, controls, or animation unless they materially help the accepted story.

## Evidence Near the Visual

Important grain, definition, or limitation should appear near the evidence it qualifies.

Do not hide a material caveat several sections away.

Visual emphasis must preserve:

**fact ≠ interpretation ≠ hypothesis ≠ recommendation**

The design must never make a hypothesis look more certain than the analysis supports.

## Responsive Design

The story must remain understandable when stacked vertically on smaller screens.

Do not preserve desktop density by shrinking text, labels, or charts until they become difficult to read.

Important values, caveats, hierarchy, and reading order must survive the mobile layout.

## Accessibility

Do not rely on color alone to communicate meaning.

Maintain readable contrast, visible focus, usable touch targets, and a non-hover path to essential information.

Motion, if used at all, should be restrained and non-essential.

## What This Design Is Not

Not a generic BI dashboard.

Not an admin interface.

Not a KPI wall, filter surface, comparison engine, or old Funnel Explorer.

Not a showcase of every available metric.

Not a frontend engineering demonstration.

Not a recreation of the frozen Metrocar implementation.

Not decoration added after the analysis.

## Design Test

For every chart, card, annotation, interaction, or visual effect, ask:

```text
What part of the story does this help the reader understand?
```

If the answer is unclear, remove it.

> **If the visual needs decoration to explain the story, the hierarchy is not clear enough yet.**
