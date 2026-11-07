# Original school notebook and extended analysis

The two primary reading paths are the original school notebook supplied and identified by Data, and the extended Python analysis. Both are in the root of the local working folder; the original notebook is not included on GitHub. The later Python version from the older Git repository and its requirements are preserved in `archive/`; that version must not be presented as the original school submission.

The only active local working folder is `metrocar-funnel-analysis-rebuild`. Python changes, captured results and the web preview belong to this checkout, which retains the existing GitHub and Render connection. Other Metrocar checkouts are preserved reference copies.

| | Original school notebook | Extended analysis |
| --- | --- | --- |
| Source | `metrocar_original.ipynb`, unchanged local copy; not included on GitHub | [`metrocar_funnel_analysis.py`](../metrocar_funnel_analysis.py) |
| Provenance | The notebook supplied by Data as the original school project | The analysis from the rebuild repository |
| Form | Jupyter notebook: 62 cells, including 39 code and 23 Markdown cells | Python percent cells; linear pandas/Plotly code, without functions or classes |
| Evidence status | Historical saved outputs preserved; not rerun or analytically revalidated during consolidation | Captured evidence used by the current Astro presentation |
| Environment | Historical notebook environment; not established by either current requirements file | [`requirements.txt`](../requirements.txt) |
| Customer funnel | Download → Signup → Requested → Completed | Same four stages and recorded counts, with explicit adjacent-stage conversions and validation |
| Platform and age | Customer funnels grouped by platform and recorded age | Restored using the validated customer flags and the original grouping/Plotly-loop approach |
| Ride funnel | No separate Request → Finished → Paid → Reviewed funnel | Added at individual-ride grain, overall and by platform/age; Reviewed is restricted to the Approved-payment path |

The original notebook contains embedded historical database connection details and saved outputs. Its exact local copy is excluded from Git through `.gitignore` and `.git/info/exclude`. Review those contents separately before publication; keeping the original unchanged does not authorize publishing credentials or private records.

## The later Python version

[`archive/metrocar_legacy.py`](../archive/metrocar_legacy.py) preserves the 253-line, 14-cell Python document from `analysis/metrocar_project.py` in the older repository. Its two funnel sections were completed in commit `9c10efe`. It is a later Python version, not the original submitted notebook or a verified export of that notebook.

Its code remains byte-identical. Use [`archive/requirements-legacy.txt`](../archive/requirements-legacy.txt) for that version (pandas 2.3.3, psycopg 3.3.4). The extended analysis uses pandas 3.0.5 and psycopg 3.3.5 in a separate environment.

## Extended analysis and comparison limits

The extended analysis covers SQL Q01–Q10, source/grain checks, EDA, both funnels, transition losses, acceptance history, restored customer segmentation and added ride segmentation by platform and age. Its acceptance-history diagnostic does not establish what happened on the same unfinished ride or prove a cause.

The school notebook's saved customer counts are 23,608 download records, 17,623 signed-up users, 12,406 requesting users and 6,233 completing users. The rebuild preserves those counts. It defines a request independently of completion and requires both pickup and drop-off timestamps for a completed ride. Matching aggregates do not prove that historical and current source rows are identical.

The original and extended customer age breakdowns retain `Unknown`, including downloads without signup. Known-age Download and Signup counts are equal by construction because age is recorded at signup; this is not evidence of perfect signup conversion by age. In the added ride breakdown, `Unknown` means the requesting user has no recorded signup age. Repeat requests by the same user count as separate rides.

The website continues to read `metrocar_funnel_analysis.py`, with captured outputs and source fingerprints bound to that file. Both funnels' exported Python Plotly traces appear on the dashboard and beside their source cells in Full Analysis. Customer percentages use each segment's Download count; ride percentages use its Request count. The added ride breakdowns were executed in a read-only database transaction and reconciled to all four overall ride stages, with platform requests also matching Q09. A future school-versus-rebuild presentation can distinguish the original customer analysis from the added ride funnel; that comparison page is not part of this chart integration.

## Preservation checkpoints

| Source | Checkpoint | SHA-256 |
| --- | --- | --- |
| Original school notebook | User-supplied notebook; filename normalized only | `d5eb71c4f2e1ce38d16e3261621e0d91f719d0aea00f12915a9c5ab8d52197bf` |
| [Older repository](https://github.com/zvuk1T/metrocar-funnel-analysis/tree/f7a92c1930d590fa28c90e173522a20b7355e59c) Python version | `f7a92c1930d590fa28c90e173522a20b7355e59c` | `a122e35e1643759ae49884714460ad23f809b51887b4b83f6eaab51c0733cf01` |
| [Rebuild repository](https://github.com/zvuk1T/metrocar-funnel-analysis-rebuild/tree/6fee0e247c0f9493effb08ce8141ab2b9a4133bb) Python version | `6fee0e247c0f9493effb08ce8141ab2b9a4133bb` | `1253a33b593e439ca090b93726f01d5901411cee91f1b607fd0bf863d237bddd` |

Historical checkpoints refer to their source repositories. This local transfer preserves the rebuild repository's Git history and `origin`; it does not merge Git histories or rename a remote. Earlier modular analysis, the React Funnel Explorer and reset-era planning documents remain historical material in the older Git history. The earlier metric contract is inspectable at its [source checkpoint](https://github.com/zvuk1T/metrocar-funnel-analysis/blob/f7a92c1930d590fa28c90e173522a20b7355e59c/docs/METRIC_DEFINITION_CONTRACT.md).

These checkpoints confirm preservation, not a new execution or deployment. The web build renders the extended source and its captured evidence without executing the notebook or either Python analysis.
