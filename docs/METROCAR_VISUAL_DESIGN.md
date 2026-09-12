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

Metrocar is an **interactive analytical case study**, not a generic dashboard.

The page should read naturally as one vertical analytical story.

Recruiter or hiring manager is the primary reading mode. Technical depth should remain available without overwhelming the first view.

## Progressive Depth

**5–10 seconds**

Understand the business question, the main customer loss, and the primary funnel.

**30–90 seconds**

Follow the deeper investigation, analytical climax, supporting ride context, and evidence boundary.

**Deep read**

Inspect grain, definitions, limitations, methodology, validation, and GitHub.

## Visual Hierarchy

Visual weight should follow analytical importance.

```text
Business question / main point
↓
Customer Funnel — HERO
↓
Requested → Completed loss
↓
Deeper question
↓
Acceptance-history diagnostic — CLIMAX
↓
Ride Funnel — SUPPORTING CONTEXT
↓
Evidence boundary / next useful question
↓
Methodology / GitHub — QUIETER DEPTH
```

The Customer Funnel should lead directly into the question raised by its weakest transition.

Do not interrupt that question-and-answer sequence with unrelated visual detail.

The Ride Funnel follows the diagnostic as supporting evidence at a different grain.

Sections should not receive equal size or emphasis merely because a grid allows it.

## Primary Visual Anchors

### Customer Funnel

The dominant analytical visual.

Stage names and counts must be immediately readable.

The `Requested ≥1 → Completed ≥1` transition should receive deliberate emphasis without implying causation.

### Acceptance-History Diagnostic

The analytical climax.

The contrast between **128 (2.07%)** and **6,045 (97.93%)** should be immediately understandable.

The **user-history grain** and its limitation must remain visible.

The visual must not imply that acceptance and non-completion occurred on the same ride.

### Ride Funnel

A major supporting visual at `ride_id` grain.

It should belong clearly to the same visual system as the Customer Funnel while remaining secondary in narrative importance.

The strict Reviewed stage represents reviewed rides within the Approved-payment path and must not be confused with all review evidence.

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

Avoid uniform card grids when analytical importance is not uniform.

The page may be information-rich, but it should never feel crowded.

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
