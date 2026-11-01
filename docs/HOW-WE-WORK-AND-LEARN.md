# How We Work and Learn

## Purpose

Metrocar is a MasterSchool learning project first.

The main Python analytical document contains the real analysis while also functioning as a small interactive course that another student can follow from top to bottom.

Use VS Code/Jupyter percent cells:

- `# %% [markdown]` → explanation and learning
- `# %%` → executable Python

Markdown teaches WHY; code demonstrates HOW.

## Collaboration and communication

Current environments: Troi–ChatGPT, Spock–Codex, Geordi–Work. These are portable assignments; action authority remains governed by [AGENTS.md](../AGENTS.md) and Data's approved scope.

Work on one coherent analytical question at a time. Discuss purpose, assumptions, evidence, and alternatives before settling implementation choices. Involve the relevant crew without requiring every role for every task.

Build shared understanding through active listening and common-ground checks: restate consequential uncertainty in plain language and confirm the intended meaning before dependent work. Make assumptions visible without inventing false choices or asking about settled matters. Constructive disagreement identifies evidence, consequences, and useful alternatives; revise positions when better evidence appears. Close the loop by comparing the verified result with the agreed outcome and stating remaining limitations.

## Question-Driven Learning

Work on one meaningful learning unit, not every code cell. A unit may span several cells when they answer the same analytical question.

**❓ Question + 📋 Source & Context → 🎯 Goal & Approach (WHY) → 💻 Code / Method (HOW) → ✅ Evidence, Answer & Limits → 🧠 What We Learned.**

### ❓ Question + 📋 Source & Context

Start with a source-grounded question. Identify the actual inputs, relevant row grain, keys, definitions, and material assumptions before choosing an operation.

### 🎯 Goal & Approach — WHY

Explain what the unit aims to establish and why the chosen method fits the question. Identify the evidence needed to answer it.

### 💻 Code / Method — HOW

Preserve authentic source material and code. Use the simplest readable implementation, descriptive intermediate variables, and visible transformations. Explain important new objects and changes of grain beside the relevant operations.

Additional web framing or interpretation must remain distinguishable from the source analysis. Do not change analytical evidence to make the public story more attractive; changes to the analytical source require their own authorized scope.

### ✅ Evidence, Answer & Limits

Show the relevant verified output and explicitly answer the opening question. Separate fact, interpretation, hypothesis, and recommendation.

If the evidence is insufficient, state **Not established** and identify the gap. A result, graph, or subsequent question does not substitute for answering the original question.

### 🧠 What We Learned

State the supported insight or transferable understanding concisely. A new question is useful only when what the evidence revealed justifies it; do not force one into every lesson.

DIKW connects observations, context, understanding, and responsible judgment. It is not an additional set of required headings. Data Literacy keeps provenance, definitions, grain, assumptions, and limits visible.

### Optional learning aids

Use mental models, warnings, ethical notes, charts, and DataCamp references only when they improve understanding. Preserve useful source aids without adding a fixed set to every cell. Prefer a small ASCII mental model when it clarifies a join, grain change, funnel, or relationship.

For DataCamp references, identify the relevant official course; add lesson or concept details only when verified and useful. Do not invent a more precise reference than the evidence supports.

### 🧑‍💼 Recruiter / Transfer Check — optional

At a meaningful learning milestone, use one realistic question about applying or explaining the learning, with a concise, supported answer.

Hide the answer with `<details><summary>💡 Show answer</summary>...</details>` where the renderer supports it. The prepared answer supports reflection; it does not establish Data's demonstrated understanding or require a check after every cell.

## Learning Style

- Keep explanations concise; one sentence is enough when one sentence is enough.
- Use emojis as stable visual markers, not decoration.
- Prefer ASCII mental models when they compress an important relationship better than prose.
- Do not hide analytical reasoning behind unnecessary helpers, generic engines, abstractions, frameworks, or clever compression.
- The learner-facing Python document contains the real analysis, not a simplified reconstruction of a separate complicated implementation.

## Learning PASS

At a meaningful analytical slice, distinguish:

- **Technical PASS:** the analysis meets the agreed requirements and passes relevant validation.
- **Teaching PASS:** the real analytical document is accurate, concise, student-readable, and explains WHY before HOW and the evidence limits.
- **Learning PASS:** Data demonstrates the following reasoning in his own words:

question → input grain → operation → output → validation → meaning

Include the material assumptions and limits. Technical or Teaching PASS, a supplied model answer, and permission to proceed do not establish Learning PASS. An unassessed criterion remains unassessed. Use a short conversational check at a meaningful step, without mandatory per-cell confirmations or separate PASS reports for routine work.

## Recruiter Storytelling

Use STAR when helpful for completed larger analytical slices or the final Metrocar case study:
```text
Situation → Task → Action → Result
```

Do not force STAR onto individual code cells.
