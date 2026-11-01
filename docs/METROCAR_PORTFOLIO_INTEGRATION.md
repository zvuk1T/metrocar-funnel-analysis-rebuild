# Metrocar Portfolio Integration

## Purpose

This document defines how Metrocar belongs to Data's future public Portfolio / Career Hub.

It does not define analytical meaning or frontend implementation.

## Architecture

The Homepage is the public hub through which visitors discover the Metrocar case study and enter its compact Business Dashboard.

```text
Homepage project card
→ One Metrocar project page
  → Short introduction + question
  → Business Dashboard
  → Full Analysis
  → What We Learned
  → Unlabeled closing question, only when justified
```

Homepage curation controls Featured placement and ordering; Metrocar's analytical repository does not determine that ordering.

Metrocar remains one independent repository and deployment. Its dashboard and Full Analysis are two reading depths on **one continuous page**, with the detailed analysis and code below the dashboard. Metrocar source must not be copied into the Homepage repository.

## Public Experience

The **Business Dashboard** is the compact entry for a non-technical business reader, including a recruiter or hiring manager. Its short introduction and business question are the first content seen, in the header or immediately above it. **Explore Full Analysis** moves to the analysis below on the same page.

A **3–5 second** understanding of the main result is a readability goal, not a measured visitor outcome. Keep the primary dashboard within the agreed desktop viewport; allow mobile scrolling for readable, complete content. The full project page remains scrollable.

After the source-derived Full Analysis, **What We Learned** states supported learning. Add one visually distinct, unlabeled closing question only when the evidence justifies it. Do not add a separate *Better Question*, *Next Question*, or *Wisdom* heading.

The Full Analysis is a readable web or HTML presentation of the real learner-facing `metrocar_funnel_analysis.py`, not a second analytical implementation. GitHub remains available for repository and history access, but it is not required merely to follow the analytical reasoning.

The local candidate uses Astro to render the authored Python source at build time; it does not execute Python or reconstruct runtime tables. Preserve authentic source explanations, code order, and evidence. Keep supplementary web explanations identifiable as additional interpretation; do not change analytical evidence to improve the story.

In the local candidate, `web/src/components/FullAnalysis.astro` holds the source renderer within the root page. `web/src/pages/analysis.astro` is a compatibility redirect to the unified page, retaining section hashes when JavaScript is available. These local implementation facts do not establish publication status.

## Shared Shell

Metrocar's continuous project page uses its own presentation shell. The Homepage and independent projects share quality and usability standards; they do not require identical visual treatments. Coordinate:

- navigation conventions;
- typography hierarchy;
- content width and spacing rhythm;
- button and link treatment;
- surface and card geometry;
- responsive behavior;
- footer;
- Back to Portfolio behavior.

The dashboard is compact; the Full Analysis is a long-form reading experience in the same shell. Use selective navigation for meaningful sections, with a desktop outline and a collapsible mobile **On this page** control. Do not turn every source heading or code cell into a navigation item.

### Homepage return link

The shared shell supports a **Back to Homepage** link throughout the continuous project page through the optional build-time `HOMEPAGE_URL`, an absolute Homepage base URL.
It resolves `#projects` against that base URL, preserving its path and consistently targeting the Projects section.
When `HOMEPAGE_URL` is unset or empty, the link is omitted.
Supply the value only at build time; do not persist validation or production hostnames in repository files.

## Visual Relationship

The approved relationship follows this principle:

> **Independent project identities. Shared quality and usability.**

The Homepage maintains its own visual identity. Shared standards are clarity, accessibility, navigation quality, responsiveness, performance, maintainability, and truthful presentation.

Data has approved the following Metrocar palette as an **MSIT-inspired design interpretation**, not a verified official Masterschool brand palette or an affiliation claim:

| Role | Color |
| --- | --- |
| Forest headings and body text on light surfaces | `#10382E` |
| Retained dark panel tone | `#20483D` |
| Primary peach accent | `#F4BFA7` |
| Restrained lavender accent | `#CBBBEF` |
| Analytical teal | `#71C6B1` |
| Warm White reading surface / text on dark surfaces | `#F6F3EE` |
| Secondary text on dark surfaces | `#C6CEC8` |

Use a light reading surface and dark code cells with the accepted VS Code-style syntax highlighting. Harmonize chart backgrounds with their surrounding light panels; avoid large dark green chart backdrops. Preserve the existing palette rather than introducing a new color system.

Use peach for the primary action and key result, lavender sparingly for secondary emphasis, and teal for analytical charts. Preserve readable contrast, restrained effects, long-form reading comfort, analytical hierarchy, and the exact meaning of the evidence. **50.24% is the completion rate among requesting users**, not the loss rate.

Future MasterSchool projects may adopt this visual identity following Data's review. Each independent project remains authoritative for its own implementation, evidence, and analytical presentation. This design approval does not itself establish deployment status.

## Metrocar-Specific Grammar

Across its two presentation depths, Metrocar should preserve:

- the business question and `Requested → Completed` loss;
- the Customer Funnel and Ride Funnel on the dashboard;
- a prominent **Explore Full Analysis** anchor to the analysis below;
- the acceptance-history diagnostic as the analytical climax of the Full Analysis;
- visible analytical grain, validation, and evidence limitations in the deeper presentation.

## Hero Direction

Data has accepted the hero headline:

> **Where does Metrocar lose momentum?**

The current analytical business question remains:

> **Where does Metrocar lose customers on the path from app download to a completed ride?**

The accepted hero headline provides the entry point while the business question retains the analytical framing.

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

## Status and remaining decisions

The continuous page, light reading surface, dark code cells, and selective navigation are the agreed direction. Their local candidate still needs the final visual and technical review before a separately authorized release. Future visual changes beyond this direction, hosting configuration, deployment, and publication remain separate decisions.

`METROCAR_STORY.md` remains the analytical narrative authority. Its older presentation wording and `METROCAR_VISUAL_DESIGN.md`'s older reading model are not rewritten in this four-document task; report any material conflict during final review rather than changing those files implicitly. The continuous-page decision recorded here governs this integration scope.

The final Learning review remains deferred.
