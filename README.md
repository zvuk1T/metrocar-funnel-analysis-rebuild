# Metrocar Funnel Analysis

An educational MasterSchool ride-sharing case study, not a client engagement.

**Python · pandas · PostgreSQL · SQL · Plotly**

## Question and main finding

**Where does Metrocar lose customers between app download and a completed ride?**

The weakest transition is **Requested → Completed**:
only **50.24%** of requesting users completed at least one ride.
```bash
23,608 download records
       |
       | 74.65%
       v
17,623 signed-up users
       |
       | 70.40%
       v
12,406 requesting users
       |
       | 50.24%
       v
 6,233 completing users
```

Requested and completed mean **at least one ride**.
Percentages compare with the previous stage.
Downloads are records, not verified unique people.

## Deeper investigation

Did non-completing requesters ever receive a recorded acceptance?
```sql
6,173 requesters with no completed ride
|
+--   128 ( 2.07%) never had an acceptance
|
+-- 6,045 (97.93%) had at least one acceptance
```

Most had some acceptance in their recorded history, so
“most never received any acceptance” does not explain this group.

**Boundary:** this user-history summary does not identify ride-level
failure causes. The next investigation should examine individual rides
and operational or cancellation evidence.

A separate ride-level funnel provides supporting context without
mixing ride counts with user counts.

## Validation

The execution review on **20 October 2026** reproduced the recorded
results at analytical checkpoint
[986e278](https://github.com/zvuk1T/metrocar-funnel-analysis-rebuild/commit/986e27853d30f736137fcec64154032f79f0d929).

Checks covered source keys, joins, preserved populations, stage nesting,
denominators, and chart values. SQL/Python reconciliation covered
**Q01–Q10 only**.

## Explore

- [Findings and limitations](docs/METROCAR_STORY.md)
- [Python analysis and explanations](metrocar_funnel_analysis.py)
- [SQL Q01–Q10](metrocar_database_questions.sql)
- [Web presentation source](web/)
- [Historical MasterSchool source brief](docs/MASTERSCHOOL_METROCAR_SOURCE_BRIEF.md)
- [How we work and learn](docs/HOW-WE-WORK-AND-LEARN.md)
- [Image assets](assets/)

## Reproduce

Requires Python 3.12 and authorized access to the Metrocar PostgreSQL
dataset. Data and credentials are not included.

In a virtual environment:
```
python -m pip install -r requirements.txt
```

Set `METROCAR_DATABASE_URL` locally; never commit credentials.
Run the Python `# %%` cells top-to-bottom in VS Code/Jupyter and inspect
the validation outputs.

Without database access, the documented findings and source remain
available for review.
