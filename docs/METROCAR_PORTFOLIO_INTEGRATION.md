# Metrocar Portfolio Integration

## Purpose

This document defines how Metrocar belongs to Data's future public Portfolio / Career Hub.

It does not define analytical meaning or frontend implementation.

## Architecture

The Portfolio / Career Hub is the public hub through which visitors discover the Metrocar case study.

```text
Portfolio / Career Hub
→ project discovery
→ Metrocar case study
```

Metrocar may be presented as a Featured Project if future portfolio curation selects it.

Metrocar remains an independent repository and deployment. Its source should not be duplicated in the future portfolio repository.

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

## Visual Relationship

The relationship should follow this principle:

> **same visual family; different intensity**

The Portfolio / Career Hub homepage may be more expressive, with stronger selective lime, more personality, and restrained atmospheric or technical effects.

Metrocar should be calmer and lower in saturation, using teal and muted-green analytical accents with less glow so that evidence and visualizations dominate.

## Metrocar-Specific Grammar

The Metrocar page should preserve:

- the Customer Funnel as the hero;
- the `Requested → Completed` loss;
- the acceptance-history diagnostic as the analytical climax;
- the Ride Funnel as supporting context;
- visible analytical grain and evidence limitations.

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
- frontend technology — Astro remains the existing portfolio preference, but is not locked for implementation
- deployment/domain
- final hero copy
