# Metrocar Portfolio Integration

## Purpose

This document defines how Metrocar belongs to Data's future public Portfolio / Career Hub.

It does not define analytical meaning or frontend implementation.

## Architecture

The Portfolio / Career Hub is the public hub through which visitors discover the Metrocar case study and enter its fast Overview.

```text
Portfolio / Career Hub
→ Metrocar Overview
→ Explore Full Analysis
```

Metrocar may be presented as a Featured Project if future portfolio curation selects it.

Metrocar remains one independent repository and deployment. The Overview and Full Analysis are two presentation depths within that same project, not duplicated projects, and Metrocar source should not be copied into the future portfolio repository.

## Public Experience

The **Metrocar Overview** is the compact recruiter-first entry. **Explore Full Analysis** opens the optional long-form analytical depth.

The Full Analysis is a readable web or HTML presentation of the real learner-facing `metrocar_funnel_analysis.py`, not a second analytical implementation. GitHub remains available for repository and history access, but it is not required merely to follow the analytical reasoning.

The exact Python-to-web presentation mechanism is intentionally open.

## Shared Shell

Metrocar should inherit the future portfolio's shared presentation conventions:

- navigation conventions;
- typography hierarchy;
- content width and spacing rhythm;
- button and link treatment;
- surface and card geometry;
- responsive behavior;
- footer;
- Back to Portfolio behavior.

Both presentation depths should use this shared shell while allowing different content density: the Overview is compact, and the Full Analysis is a long-form reading experience.

## Visual Relationship

The relationship should follow this principle:

> **same visual family; different intensity**

The Portfolio / Career Hub homepage may be more expressive, with stronger selective lime, more personality, and restrained atmospheric or technical effects.

Metrocar should be calmer and lower in saturation, using teal and muted-green analytical accents with less glow so that evidence and visualizations dominate.

## Metrocar-Specific Grammar

Across its two presentation depths, Metrocar should preserve:

- the business question and `Requested → Completed` loss;
- the Customer Funnel and Ride Funnel on the Overview;
- a prominent **Explore Full Analysis** route;
- the acceptance-history diagnostic as the analytical climax of the Full Analysis;
- visible analytical grain, validation, and evidence limitations in the deeper presentation.

## Hero Direction

A strong historical candidate for the hero headline is:

> **Where does Metrocar lose momentum?**

The current analytical business question remains:

> **Where does Metrocar lose customers on the path from app download to a completed ride?**

The first may serve as the hero headline while the second provides analytical framing. Final public copy is not locked yet.

## Historical Ideas Worth Retaining

The following are reusable ideas, not implementation requirements:

- an asymmetric hero layout;
- a large display headline;
- a compact project/trust metadata block;
- **See every stage. Keep every definition.**
- progressive disclosure;
- Plotly integrated visually with the surrounding page.

## Do Not Inherit

Do not inherit:

- the frozen Funnel Explorer architecture;
- old React state machinery;
- the filter and comparison engine;
- the old public-data/frontend analytical layer;
- the frozen first-ride diagnostic;
- the frozen repository architecture.

## Open Decisions

- exact shared navigation
- exact typography
- final design tokens
- exact Python-to-web or HTML presentation mechanism
- final Overview-to-Full-Analysis routing
- frontend technology — Astro remains the existing portfolio preference, but is not locked for implementation
- final deployment topology and domain
- final hero copy
