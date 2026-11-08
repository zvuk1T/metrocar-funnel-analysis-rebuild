# Original school notebook and extended analysis

The two primary reading paths are the [public copy of the original school notebook](../metrocar_original_public.ipynb) and the [extended Python analysis](../metrocar_funnel_analysis.py), both in the repository root. The unchanged school original remains local. The later Python version from the older Git repository and its requirements are preserved in `archive/`; that version must not be presented as the original school submission.

The only active local working folder is `metrocar-funnel-analysis-rebuild`. Python changes, captured results and the web preview belong to this checkout, which retains the existing GitHub and Render connection. Other Metrocar checkouts are preserved reference copies.

| | Original school notebook | Extended analysis |
| --- | --- | --- |
| Source | [`metrocar_original_public.ipynb`](../metrocar_original_public.ipynb); unchanged local source: `metrocar_original.ipynb` | [`metrocar_funnel_analysis.py`](../metrocar_funnel_analysis.py) |
| Provenance | Public copy of the notebook supplied by Data as the original school project; database credentials removed | The analysis from the rebuild repository |
| Form | Jupyter notebook: 62 cells, including 39 code and 23 Markdown cells | Python percent cells; linear pandas/Plotly code, without functions or classes |
| Evidence status | Historical saved outputs preserved; not rerun or analytically revalidated during consolidation | Captured evidence used by the current Astro presentation |
| Environment | Historical notebook environment; not established by either current requirements file | [`requirements.txt`](../requirements.txt) |
| Customer funnel | Download → Signup → Requested → Completed | Same four stages and recorded counts, with explicit adjacent-stage conversions and validation |
| Platform and age | Customer funnels grouped by platform and recorded age | Restored using the validated customer flags and the original grouping/Plotly-loop approach |
| Ride funnel | No separate Request → Finished → Paid → Reviewed funnel | Added at individual-ride grain, overall and by platform/age; Reviewed is restricted to the Approved-payment path |

The public copy changes only the database setup in cells 7 and 9: the Markdown instructions omit the connection URL, and the code imports `os` and reads `METROCAR_DATABASE_URL` from the local environment. All analytical code, saved outputs (including charts and historical errors), execution counts and notebook metadata are preserved. The notebook was not rerun. Its source brief identifies the dataset as generated specifically for this school project.

The byte-identical original contains historical connection details and stays local, excluded from Git through `.gitignore` and `.git/info/exclude`. The public copy is a reviewed derivative, not a byte-identical original.

## The later Python version

[`archive/metrocar_legacy.py`](../archive/metrocar_legacy.py) preserves the 253-line, 14-cell Python document from `analysis/metrocar_project.py` in the older repository. Its two funnel sections were completed in commit `9c10efe`. It is a later Python version, not the original submitted notebook or a verified export of that notebook.

Its code remains byte-identical. Use [`archive/requirements-legacy.txt`](../archive/requirements-legacy.txt) for that version (pandas 2.3.3, psycopg 3.3.4). The extended analysis uses pandas 3.0.5 and psycopg 3.3.5 in a separate environment.

## Extended analysis and comparison limits

The extended analysis covers SQL Q01–Q10, source/grain checks, EDA, both funnels, transition losses, acceptance history, restored customer segmentation and added ride segmentation by platform and age. Its acceptance-history diagnostic does not establish what happened on the same unfinished ride or prove a cause.

The school notebook's saved customer counts are 23,608 download records, 17,623 signed-up users, 12,406 requesting users and 6,233 completing users. The rebuild preserves those counts. It defines a request independently of completion and requires both pickup and drop-off timestamps for a completed ride. Matching aggregates do not prove that historical and current source rows are identical.

The original and extended customer age breakdowns retain `Unknown`, including downloads without signup. Known-age Download and Signup counts are equal by construction because age is recorded at signup; this is not evidence of perfect signup conversion by age. In the added ride breakdown, `Unknown` means the requesting user has no recorded signup age. Repeat requests by the same user count as separate rides.

The website continues to read `metrocar_funnel_analysis.py`, with captured outputs and source fingerprints bound to that file. Both funnels' exported Python Plotly traces appear on the dashboard and beside their source cells in Full Analysis. Customer percentages use each segment's Download count; ride percentages use its Request count. The added ride breakdowns were executed in a read-only database transaction and reconciled to all four overall ride stages, with platform requests also matching Q09.

Below the introduction, a short school-to-rebuild comparison pairs the original Customer Funnel by platform with the Ride Funnel by platform added in the rebuild. The school chart reads the saved Plotly traces from cell 55 of the public notebook at build time; it does not execute the notebook or send its other contents to the browser. The ride chart reuses the captured Python `ride-platform` output. Both use the existing segmented-funnel component and the same platform colors, with readable customer-stage labels. Customer percentages use each platform's Download count; ride percentages use its Request count.

The introduction places the school work in the DA107 Analytical Thinking module, as documented in the [school source brief](MASTERSCHOOL_METROCAR_SOURCE_BRIEF.md#curriculum-placement). It links to [MasterSchool's current MSIT program overview](https://joinmsit.de/vergleich/) for information about the training provider, without attributing today's program names or durations to the historical course. It distinguishes course work from the rebuild, explains the different customer and ride populations, and links to both files in this repository. The dashboard remains the place to explore the overall, platform and age views.

The [optional ride-level funnel](MASTERSCHOOL_METROCAR_SOURCE_BRIEF.md#optional-ride-level-funnel) was suggested beyond the core customer analysis. The author confirmed that he did not finish it during the course and returned to the whole project with AI assistance while preparing the web presentation. The page states this provenance, describes a learning focus on grain, denominators and count validation, and invites questions about his course experience through the email and LinkedIn destinations already published on his Homepage.

The contact area also contains the author's explicitly labelled [referral link](https://referral.masterschool.com/uO7dVrRQ). The [MSIT referral overview](https://joinmsit.de/en/refer-a-friend/) and [link-specific terms](https://referral.masterschool.com/uO7dVrRQ/terms), checked on 2026-11-08, describe an Amazon gift card worth €500 for each party after eligible long-term enrolment and completion of the first month. The invitation addresses applicants living in Germany, discloses the author's reward, and links the conditions beside the offer. It does not promise a cash payment or a reward for checking eligibility alone.

## Preservation checkpoints

| Source | Checkpoint | SHA-256 |
| --- | --- | --- |
| Original school notebook | User-supplied notebook; filename normalized only | `d5eb71c4f2e1ce38d16e3261621e0d91f719d0aea00f12915a9c5ab8d52197bf` |
| [Older repository](https://github.com/zvuk1T/metrocar-funnel-analysis/tree/f7a92c1930d590fa28c90e173522a20b7355e59c) Python version | `f7a92c1930d590fa28c90e173522a20b7355e59c` | `a122e35e1643759ae49884714460ad23f809b51887b4b83f6eaab51c0733cf01` |
| [Rebuild repository](https://github.com/zvuk1T/metrocar-funnel-analysis-rebuild/tree/6fee0e247c0f9493effb08ce8141ab2b9a4133bb) Python version | `6fee0e247c0f9493effb08ce8141ab2b9a4133bb` | `1253a33b593e439ca090b93726f01d5901411cee91f1b607fd0bf863d237bddd` |

Historical checkpoints refer to their source repositories. This local transfer preserves the rebuild repository's Git history and `origin`; it does not merge Git histories or rename a remote. Earlier modular analysis, the React Funnel Explorer and reset-era planning documents remain historical material in the older Git history. The earlier metric contract is inspectable at its [source checkpoint](https://github.com/zvuk1T/metrocar-funnel-analysis/blob/f7a92c1930d590fa28c90e173522a20b7355e59c/docs/METRIC_DEFINITION_CONTRACT.md).

These checkpoints confirm preservation, not a new execution or deployment. The web build renders the extended source and its captured evidence without executing the notebook or either Python analysis.
