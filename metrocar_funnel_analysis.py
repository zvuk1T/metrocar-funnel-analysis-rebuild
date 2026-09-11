# %% [markdown]
# # Metrocar Funnel Analysis
#
# Metrocar is an educational ride-sharing project about a platform that
# connects riders and drivers. We will study its customer funnel to find
# drop-offs, investigate business questions, visualize evidence, and develop
# evidence-backed recommendations.
#
# **Conceptual customer journey**
#
# App Download → Signup → Ride Request → Driver Acceptance → Ride → Payment → Review

# %% [markdown]
# ## Connect to the Metrocar PostgreSQL database
#
# ### 🎯 Goal — What & Why
#
# Establish a connection so later learning cells can inspect source data
# without changing it.
#
# ### 🗺️ Mental Model
#
# ```text
# metrocar_url → sa.create_engine() → connection
#                                      ↓
#                              sa.inspect() → table names
#                                      ↓
#                                pd.read_sql()
# ```
#
# ### ⚠️ Watch Out
#
# `load_dotenv()` reads the approved local `.env`. Its credential value remains
# untracked and is never displayed.

# %%
import os

import pandas as pd
import sqlalchemy as sa
from dotenv import load_dotenv


load_dotenv()
metrocar_url = os.environ["METROCAR_DATABASE_URL"]
engine = sa.create_engine(metrocar_url)
connection = engine.connect()

# %% [markdown]
# ### 🧑‍💼 Recruiter Check
#
# **Question:** What is the difference between the database URL, SQLAlchemy engine, and connection?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The URL describes how to reach the database. The engine manages how SQLAlchemy
# communicates with it. The connection is the active channel used to execute
# database operations.
#
# </details>

# %% [markdown]
# ## Verify access and list the source tables
#
# ### 🎯 Goal — What & Why
#
# Use SQLAlchemy's inspector to see which source tables are available.

# %%
inspector = sa.inspect(engine)
table_names = inspector.get_table_names()
table_names

# %% [markdown]
# ## Read a small table preview with pandas
#
# ### 🎯 Goal — What & Why
#
# Read five download rows into a DataFrame to confirm that pandas can use the
# same database connection. This is only a connection check, not analysis.

# %%
app_downloads_preview = pd.read_sql(
    "SELECT * FROM app_downloads LIMIT 5",
    connection,
)
app_downloads_preview

# %% [markdown]
# ### ✅ Result
#
# The inspector returns the visible table names, and pandas returns a five-row
# DataFrame preview.
#
# ### 🧠 What We Learned
#
# Connecting and previewing rows confirms access only; it does not establish
# table grain, quality, relationships, or funnel meaning.
#
# ### 📚 DataCamp Reference
#
# **Course:** Introduction to Databases in Python
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** What does listing the tables and previewing five rows prove — and what does it not prove?
#
# <details>
# <summary>💡 Show answer</summary>
#
# It proves that the database is reachable and that pandas can read data. It does
# not establish table grain, key uniqueness, relationships, data quality, or
# funnel meaning.
#
# </details>

# %% [markdown]
# ## Understand the `app_downloads` table grain
#
# ### 🎯 Goal — What & Why
#
# Determine what one row represents and whether `app_download_key` uniquely
# identifies each row before using downloads in a funnel.
#
# ### 🗺️ Mental Model
#
# ```text
# one app_downloads row ──?── one download record
# app_download_key       ──?── unique row identifier
# ```
#
# ### ⚠️ Watch Out
#
# A five-row preview shows structure but cannot prove key uniqueness; that check
# must use every row.

# %%
app_downloads_column_names = app_downloads_preview.columns.tolist()
app_downloads_column_names

# %% [markdown]
# ### 🧑‍💼 Recruiter Check
#
# **Question:** What are df.columns and df.index, and what does .tolist() do?
#
# <details>
# <summary>💡 Show answer</summary>
#
# df.columns is a pandas Index containing the column labels, while df.index is a
# pandas Index containing the row labels. .tolist() converts either Index into a
# regular Python list.
#
# ```text
# DataFrame → .columns / .index → pandas Index → .tolist() → Python list
# ```
#
# </details>

# %%
app_downloads_preview

# %%
app_download_keys = pd.read_sql(
    "SELECT app_download_key FROM app_downloads",
    connection,
)

total_app_download_rows = len(app_download_keys)
distinct_app_download_keys = app_download_keys["app_download_key"].nunique()
duplicate_app_download_keys_exist = app_download_keys[
    "app_download_key"
].duplicated().any()

app_download_key_check = {
    "total_rows": total_app_download_rows,
    "distinct_app_download_keys": distinct_app_download_keys,
    "duplicates_exist": duplicate_app_download_keys_exist,
}
app_download_key_check

# %% [markdown]
# ### ✅ Result
#
# `app_downloads` has 23,608 rows and 23,608 distinct `app_download_key` values;
# no duplicate keys were found.
#
# ### 🧠 What We Learned
#
# The supported table grain is one app download record per row, uniquely
# identified by `app_download_key`; this does not mean one row per person or device.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# **Course:** [https://www.datacamp.com/courses/data-manipulation-with-pandas](https://www.datacamp.com/courses/data-manipulation-with-pandas)
#
# **Relevant lesson:** Slicing and Indexing DataFrames → Explicit indexes
#
# **Lesson:** [https://campus.datacamp.com/courses/data-manipulation-with-pandas/slicing-and-indexing-dataframes?ex=1](https://campus.datacamp.com/courses/data-manipulation-with-pandas/slicing-and-indexing-dataframes?ex=1)
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** How did you verify that `app_download_key` is unique?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The full table has 23,608 rows and 23,608 distinct keys, and the duplicate
# check found no repeats. This supports one keyed download record per row, not
# one unique person or device.
#
# </details>

# %% [markdown]
# ## Business Question 1: How many times was the app downloaded?
#
# ### 🎯 Goal — What & Why
#
# Use the verified `app_downloads` grain to count recorded app downloads.

# %%
recorded_app_downloads = total_app_download_rows
recorded_app_downloads

# %% [markdown]
# ### ✅ Result
#
# 23,608 recorded app downloads.
#
# ### 🧠 What We Learned
#
# Counting rows is valid here because one row was verified to represent one
# keyed download record.
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why is counting rows a valid way to count app downloads in this table?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The grain was verified first: each row represents one download record, and
# `app_download_key` is unique. Therefore, counting rows counts recorded app
# downloads without counting any key twice.
#
# </details>

# %% [markdown]
# ## Understand the `signups` table grain
#
# ### 🎯 Goal — What & Why
#
# Verify what one `signups` row represents before counting registered users.
#
# ### 🗺️ Mental Model
#
# ```text
# app_downloads.app_download_key
#               ↓ future link — not tested here
#       signups.session_id
#               ↓
#        signups.user_id
# ```
#
# ### ⚠️ Watch Out
#
# A signup row is not automatically a unique user; validate `user_id` first.

# %%
signups_preview = pd.read_sql(
    "SELECT * FROM signups LIMIT 5",
    connection,
)
signups_preview

# %%
signups_column_names = signups_preview.columns.tolist()
signups_column_names

# %%
signup_identifiers = pd.read_sql(
    "SELECT user_id, session_id FROM signups",
    connection,
)

total_signup_rows = len(signup_identifiers)
distinct_signup_user_ids = signup_identifiers["user_id"].nunique()
duplicate_signup_user_ids_exist = signup_identifiers["user_id"].duplicated().any()
distinct_signup_session_ids = signup_identifiers["session_id"].nunique()
duplicate_signup_session_ids_exist = signup_identifiers[
    "session_id"
].duplicated().any()

signups_grain_check = {
    "total_rows": total_signup_rows,
    "distinct_user_ids": distinct_signup_user_ids,
    "duplicate_user_ids_exist": duplicate_signup_user_ids_exist,
    "distinct_session_ids": distinct_signup_session_ids,
    "duplicate_session_ids_exist": duplicate_signup_session_ids_exist,
}
signups_grain_check

# %% [markdown]
# ### ✅ Result
#
# `signups` has 17,623 rows and 17,623 distinct `user_id` values, with no
# duplicate user IDs. `session_id` is also unique within this table.
#
# ### 🧠 What We Learned
#
# The supported grain is one registered-user signup record per row, uniquely
# identified by `user_id`; the cross-table role of `session_id` is not yet tested.

# %% [markdown]
# ## Business Question 2: How many registered users were present?
#
# ### 🎯 Goal — What & Why
#
# Use the validated `signups` grain to count registered users.

# %%
registered_users = distinct_signup_user_ids
registered_users

# %% [markdown]
# ### ✅ Result
#
# 17,623 registered users.
#
# ### 🧠 What We Learned
#
# The row count and distinct-user count agree because each row has a unique
# `user_id` in the observed table.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why is counting signup rows valid for counting registered users here?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The grain was verified first: 17,623 rows contain 17,623 distinct `user_id`
# values with no duplicates. Therefore, each signup row counts one registered
# user in this table.
#
# </details>
