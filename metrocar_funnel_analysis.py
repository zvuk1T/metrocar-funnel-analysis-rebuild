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
