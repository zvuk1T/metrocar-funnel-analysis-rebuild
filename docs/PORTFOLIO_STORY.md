# Metrocar Portfolio Story

## Purpose

Metrocar is an educational ride-sharing funnel analysis rebuilt as a recruiter-facing portfolio case study.

The story should show not only what the data says, but how the analysis moves from a business question to evidence, deeper investigation, and an evidence-bounded conclusion.

The validated analytical rebuild remains the source of truth. This document defines only the story.

## Audience

Recruiter or hiring manager first. Technical reader second.

A quick reader should understand the analytical reasoning without reading code. Deeper methodology, validation, and implementation remain available through GitHub.

## Business Question

**Where does Metrocar lose customers on the path from app download to a completed ride?**

## Main Point

The largest customer-level loss occurs after a user has already requested a ride.

Only **50.24%** of requesting users complete at least one ride.

## Recruiter Takeaway

> He identified where the customer journey breaks down, investigated the obvious explanation, and stopped where the evidence stopped.

## Story Backbone

```text
Business problem
→ Key funnel loss
→ Deeper investigation
→ Analytical climax
→ Evidence boundary
→ Next useful question
```

## 1. Business Problem

The customer funnel narrows from:

`23,608 Download → 17,623 Signup → 12,406 Requested ≥1 → 6,233 Completed ≥1`

The weakest transition is:

**Requested ≥1 → Completed ≥1**

- Conversion: **50.24%**
- Drop-off: **49.76%**
- Non-completing requesters: **6,173**

This identifies where the customer journey deserves deeper investigation.

## 2. Deeper Investigation

A natural explanation is that many users may request a ride but never receive any recorded acceptance.

The next question is therefore:

**Are the 6,173 non-completing requesters mostly users who never had a recorded ride acceptance?**

## 3. Analytical Climax

Among the **6,173** non-completing requesters:

- **128 (2.07%)** never had a recorded acceptance.
- **6,045 (97.93%)** had at least one recorded acceptance somewhere in their ride history.

The simple explanation that most non-completing users never received any acceptance does not fit the observed user-history evidence.

## 4. Evidence Boundary

The acceptance diagnostic is at **user-history grain**.

It does not prove that acceptance and non-completion occurred on the same ride.

It does not establish why a user failed to complete a ride.

The available evidence therefore does not support causal claims about driver supply, waiting time, price, cancellation reasons, or other operational causes.

## 5. Supporting Ride Context

A second funnel examines the journey at a different grain: one `ride_id`.

`385,477 Request → 223,652 Finished → 212,628 Paid → 148,464 Reviewed`

The ride funnel provides supporting operational context without being mixed with the customer-level funnel.

The two funnels answer different questions:

```text
Customer funnel
→ progression of funnel entrants/users

Ride funnel
→ progression of individual rides
```

## 6. Resolution

The analysis identifies where the customer journey breaks down and tests one obvious explanation.

That explanation does not account for most affected users.

The available data does not establish the underlying cause.

The next useful investigation would require **same-ride operational or cancellation evidence**.

## Visual Anchors

1. **Metrocar Customer Funnel** — primary evidence and main visual.
2. **Metrocar Ride Funnel** — supporting evidence at ride grain.
3. **Acceptance-history diagnostic** — analytical reasoning climax.

## Reader Journey

**5–10 seconds**

Understand the business problem and the weakest customer transition.

**30–90 seconds**

Understand both analytical grains, the deeper investigation, the main discovery, and the evidence boundary.

**Deep read**

Inspect stage definitions, grain, validation, limitations, and analytical code through GitHub.

## Story Test

Every public section should support the story backbone.

A chart, metric, paragraph, or interaction belongs on the page only if it helps explain:

```text
the problem
→ the evidence
→ the discovery
→ the limitation
→ the next useful question
```

> **If we cannot summarize the story, we do not understand it well enough yet.**
