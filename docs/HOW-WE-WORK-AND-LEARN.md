# How We Work and Learn

## Purpose

Metrocar is a MasterSchool learning project first.

The main Python analytical document contains the real analysis while also functioning as a small interactive course that another student can follow from top to bottom.

Use VS Code/Jupyter percent cells:

- `# %% [markdown]` → explanation and learning
- `# %%` → executable Python

Markdown teaches WHY; code demonstrates HOW.

## Learning Flow

For each meaningful analytical idea:

question → source/grain → concept → simple code → result → interpretation → recruiter check

Keep each step as short as possible.

## Learning Cell Pattern

Use only the elements that help the current step. Do not force every label into every cell.

### 🎯 Goal — What & Why

One or two short sentences: what are we trying to learn or answer, and why does this step matter?

### 🗺️ Mental Model

Optional. Use a small ASCII diagram when it makes a join, grain change, funnel, transformation, or relationship easier to understand and remember.

Example:
```text
app_downloads
      │
      │ LEFT JOIN
      ↓
   signups
      │
      ↓
Downloaded → Signed Up
```

### ⚠️ Watch Out

Optional. One short sentence only when there is a real analytical trap, assumption, or common mistake worth seeing before the code.

### 💻 Code

Use the simplest readable implementation with descriptive intermediate variables and visible transformations.

Prefer one analytical idea per code cell or small coherent group of cells.

### ✅ Result

One short sentence: what did the code produce?

### 🧠 What We Learned

One short sentence: what does the result mean, what should be remembered, and what does the evidence not justify?

Keep fact, interpretation, hypothesis, and recommendation distinct.

### 📚 DataCamp Reference

Optional for obvious code. For non-obvious code, normally identify only the relevant official DataCamp course.

Add chapter, lesson/concept, or direct official lesson link details only when they materially help learning.

Do not invent a more precise reference than the source supports.

### 🧑‍💼 Recruiter Check

One realistic recruiter/interview question that also serves as the Learning Check, plus a concise model answer.

Hide the answer with `<details><summary>💡 Show answer</summary>...</details>` where the Markdown renderer supports it.

Keep the answer short enough for Data to understand and later explain in his own words before the slice is accepted.

## Learning Style

- Keep explanations concise; one sentence is enough when one sentence is enough.
- Use emojis as stable visual markers, not decoration.
- Prefer ASCII mental models when they compress an important relationship better than prose.
- Do not hide analytical reasoning behind unnecessary helpers, generic engines, abstractions, frameworks, or clever compression.
- The learner-facing Python document contains the real analysis, not a simplified reconstruction of a separate complicated implementation.

## Learning PASS

A meaningful slice passes when Data can explain:

question → input grain → operation → output → validation → meaning

Technical PASS alone is not Learning PASS.

## Recruiter Storytelling

Use STAR only for completed larger analytical slices or the final Metrocar case study:
```text
Situation → Task → Action → Result
```

Do not force STAR onto individual code cells.
