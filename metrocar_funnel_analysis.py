# region 00 — Setup & Database Connection
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

# endregion
# region Q01 — App Downloads
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
# .tolist() → convert the column-label Index to a regular Python list
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
# .nunique() → count distinct key values
distinct_app_download_keys = app_download_keys["app_download_key"].nunique()
# .duplicated().any() → check whether any key value repeats
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

# endregion
# region Q02 — Registered Users
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

# endregion
# region Q03 — Ride Requests
# %% [markdown]
# ## Business Question 3: How many ride requests occurred?
#
# ### 🎯 Goal — What & Why
#
# Establish the `ride_requests` grain before counting request records.
#
# ### 🗺️ Mental Model
#
# ```text
# one ride_requests row ──?── one ride request
# ride_id               ──?── unique row identifier
# ```
#
# ### ⚠️ Watch Out
#
# One user can make multiple requests, so request rows are not user counts.

# %%
ride_requests = pd.read_sql(
    """
    SELECT ride_id, user_id, request_ts
    FROM ride_requests
    """,
    connection,
)
ride_requests.head()

# %%
ride_request_column_names = ride_requests.columns.tolist()
ride_request_column_names

# %%
total_ride_request_rows = len(ride_requests)
distinct_ride_ids = ride_requests["ride_id"].nunique()
duplicate_ride_ids_exist = ride_requests["ride_id"].duplicated().any()
# .isna() → mark missing timestamps so they can be counted
# int(...) → return the count as a normal Python integer
missing_request_timestamps = int(ride_requests["request_ts"].isna().sum())

ride_request_grain_check = {
    "total_rows": total_ride_request_rows,
    "distinct_ride_ids": distinct_ride_ids,
    "duplicate_ride_ids_exist": duplicate_ride_ids_exist,
    "missing_request_timestamps": missing_request_timestamps,
}
ride_request_grain_check

# %%
total_ride_requests = total_ride_request_rows
total_ride_requests

# %% [markdown]
# ### ✅ Result
#
# 385,477 ride requests; all 385,477 `ride_id` values are distinct.
#
# ### 🧠 What We Learned
#
# The supported grain is one ride-request record per row, uniquely identified
# by `ride_id`.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** What evidence supports counting rows as ride requests?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The table has 385,477 rows and 385,477 distinct `ride_id` values, with no
# missing request timestamps. This supports one keyed ride request per row.
#
# </details>

# endregion
# region Q04 — Requested vs Completed Rides
# %% [markdown]
# ## Business Question 4: How many rides were requested versus completed?
#
# ### 🎯 Goal — What & Why
#
# Compare all validated request rows with requests that contain a complete ride.
#
# ### 🗺️ Mental Model
#
# ```text
# request_ts → pickup_ts → dropoff_ts
# requested                completed
# ```
#
# ### ⚠️ Watch Out
#
# There is no completion flag, so completed means both pickup and drop-off
# timestamps are present.

# %%
ride_completion_fields = pd.read_sql(
    """
    SELECT ride_id, pickup_ts, dropoff_ts
    FROM ride_requests
    """,
    connection,
)
ride_completion_fields.head()

# %%
# .notna() → mark rows where each timestamp is present
pickup_timestamp_present = ride_completion_fields["pickup_ts"].notna()
dropoff_timestamp_present = ride_completion_fields["dropoff_ts"].notna()
# & → require both Boolean conditions to be True
completed_ride_mask = pickup_timestamp_present & dropoff_timestamp_present

completed_rides = int(completed_ride_mask.sum())
# ~ → invert a Boolean condition, here meaning the timestamp is absent
pickup_without_dropoff = int(
    (pickup_timestamp_present & ~dropoff_timestamp_present).sum()
)
dropoff_without_pickup = int(
    (~pickup_timestamp_present & dropoff_timestamp_present).sum()
)

requested_vs_completed = {
    "requested_rides": total_ride_requests,
    "completed_rides": completed_rides,
    "pickup_without_dropoff": pickup_without_dropoff,
    "dropoff_without_pickup": dropoff_without_pickup,
}
requested_vs_completed

# %% [markdown]
# ### ✅ Result
#
# 385,477 rides were requested and 223,652 were completed; no record has only
# one of the two ride timestamps.
#
# ### 🧠 What We Learned
#
# Completion is a ride-request state defined here by both pickup and drop-off
# timestamps, not by the existence of a request alone.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why require both pickup and drop-off timestamps for completion?
#
# <details>
# <summary>💡 Show answer</summary>
#
# They show that the recorded ride both started and ended. The data also contain
# no pickup-only or drop-off-only records, so the two markers agree.
#
# </details>

# endregion
# region Q05 — Requests vs Requesting Users
# %% [markdown]
# ## Business Question 5: How do ride requests compare with requesting users?
#
# ### 🎯 Goal — What & Why
#
# Separate the number of request records from the number of users who made them.
#
# ### ⚠️ Watch Out
#
# Counting `ride_id` answers how many requests occurred; counting distinct
# `user_id` answers how many users requested at least one ride.

# %%
distinct_requesting_users = ride_requests["user_id"].nunique()
missing_request_user_ids = int(ride_requests["user_id"].isna().sum())

ride_requests_vs_users = {
    "ride_requests": total_ride_requests,
    "distinct_requesting_users": distinct_requesting_users,
    "missing_user_ids": missing_request_user_ids,
}
ride_requests_vs_users

# %% [markdown]
# ### ✅ Result
#
# 385,477 ride requests were associated with 12,406 distinct requesting
# `user_id` values.
#
# ### 🧠 What We Learned
#
# The analytical unit changes the answer: request rows measure activity, while
# distinct `user_id` values measure distinct registered user records represented
# in that activity.
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why is the ride-request count much larger than the user count?
#
# <details>
# <summary>💡 Show answer</summary>
#
# A user can request more than one ride. Each request has its own `ride_id`,
# while `.nunique()` counts each requesting `user_id` only once.
#
# </details>

# endregion
# region Q06 — Average Ride Duration
# %% [markdown]
# ## Business Question 6: What was the average ride duration?
#
# ### 🎯 Goal — What & Why
#
# Measure elapsed minutes only for rides with valid pickup and drop-off times.
#
# ### ⚠️ Watch Out
#
# Requests without both timestamps cannot contribute a pickup-to-drop-off
# duration, and drop-off must not precede pickup.

# %%
valid_duration_mask = completed_ride_mask & (
    ride_completion_fields["dropoff_ts"]
    >= ride_completion_fields["pickup_ts"]
)

# .loc[] → select only valid rows and the columns needed for duration
valid_duration_rides = ride_completion_fields.loc[
    valid_duration_mask,
    ["ride_id", "pickup_ts", "dropoff_ts"],
].copy()

# .dt.total_seconds() / 60 → convert time differences to minutes
valid_duration_rides["duration_minutes"] = (
    valid_duration_rides["dropoff_ts"] - valid_duration_rides["pickup_ts"]
).dt.total_seconds() / 60

invalid_duration_order_count = int(
    (
        completed_ride_mask
        & (
            ride_completion_fields["dropoff_ts"]
            < ride_completion_fields["pickup_ts"]
        )
    ).sum()
)
valid_duration_ride_count = len(valid_duration_rides)
# float(...) and round(..., 2) → return a normal two-decimal Python number
average_ride_duration_minutes = round(
    float(valid_duration_rides["duration_minutes"].mean()),
    2,
)

ride_duration_summary = {
    "valid_duration_rides": valid_duration_ride_count,
    "invalid_time_order": invalid_duration_order_count,
    "average_duration_minutes": average_ride_duration_minutes,
}
ride_duration_summary

# %% [markdown]
# ### ✅ Result
#
# Across 223,652 rides with valid timestamps, average pickup-to-drop-off
# duration was 52.61 minutes.
#
# ### 🧠 What We Learned
#
# This average describes completed rides with valid time order, not all ride
# requests.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Which rows belong in the average ride-duration calculation?
#
# <details>
# <summary>💡 Show answer</summary>
#
# Only rows with both timestamps and a drop-off at or after pickup. Their time
# difference is converted from seconds to minutes before averaging.
#
# </details>

# endregion
# region Q07 — Driver Acceptance
# %% [markdown]
# ## Business Question 7: How many rides were accepted by a driver?
#
# ### 🎯 Goal — What & Why
#
# Count requests with a recorded acceptance and validate the acceptance marker.
#
# ### ⚠️ Watch Out
#
# Driver acceptance is a separate state from ride completion.

# %%
ride_acceptance_fields = pd.read_sql(
    """
    SELECT ride_id, driver_id, accept_ts
    FROM ride_requests
    """,
    connection,
)
ride_acceptance_fields.head()

# %%
acceptance_timestamp_present = ride_acceptance_fields["accept_ts"].notna()
driver_id_present = ride_acceptance_fields["driver_id"].notna()
acceptance_driver_mismatches = int(
    (acceptance_timestamp_present != driver_id_present).sum()
)
accepted_rides = int(acceptance_timestamp_present.sum())

ride_acceptance_summary = {
    "accepted_rides": accepted_rides,
    "acceptance_driver_mismatches": acceptance_driver_mismatches,
}
ride_acceptance_summary

# %% [markdown]
# ### ✅ Result
#
# 248,379 ride requests were accepted; `accept_ts` and `driver_id` agree on
# every row.
#
# ### 🧠 What We Learned
#
# Acceptance is supported by a recorded acceptance time and assigned driver;
# its count is distinct from the completed-ride count.
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why use `accept_ts` and also check `driver_id`?
#
# <details>
# <summary>💡 Show answer</summary>
#
# A non-missing `accept_ts` marks acceptance. `driver_id` is present on exactly
# the same rows, which corroborates that interpretation.
#
# </details>

# endregion
# region Q08 — Successful Payments
# %% [markdown]
# ## Business Question 8: How many successful payments occurred, and how much was collected?
#
# ### 🎯 Goal — What & Why
#
# Establish the `transactions` grain, identify the observed success status, and
# aggregate only successful payment rows.
#
# ### ⚠️ Watch Out
#
# A purchase amount on a declined transaction is not collected revenue.

# %%
transactions = pd.read_sql(
    """
    SELECT transaction_id, ride_id, purchase_amount_usd, charge_status
    FROM transactions
    """,
    connection,
)
transactions.head()

# %%
transaction_column_names = transactions.columns.tolist()
transaction_column_names

# %%
total_transaction_rows = len(transactions)
distinct_transaction_ids = transactions["transaction_id"].nunique()
duplicate_transaction_ids_exist = transactions[
    "transaction_id"
].duplicated().any()
distinct_transaction_ride_ids = transactions["ride_id"].nunique()
duplicate_transaction_ride_ids_exist = transactions["ride_id"].duplicated().any()

transaction_grain_check = {
    "total_rows": total_transaction_rows,
    "distinct_transaction_ids": distinct_transaction_ids,
    "duplicate_transaction_ids_exist": duplicate_transaction_ids_exist,
    "distinct_ride_ids": distinct_transaction_ride_ids,
    "duplicate_ride_ids_exist": duplicate_transaction_ride_ids_exist,
}
transaction_grain_check

# %%
# .value_counts() → count rows in each observed payment status
transaction_status_counts = transactions["charge_status"].value_counts(
    dropna=False
)
transaction_status_counts

# %%
successful_payments = transactions.loc[
    transactions["charge_status"] == "Approved"
]
successful_payment_count = len(successful_payments)
missing_successful_payment_amounts = int(
    successful_payments["purchase_amount_usd"].isna().sum()
)
total_collected_usd = round(
    float(successful_payments["purchase_amount_usd"].sum()),
    2,
)

successful_payment_summary = {
    "successful_payments": successful_payment_count,
    "missing_successful_amounts": missing_successful_payment_amounts,
    "total_collected_usd": total_collected_usd,
}
successful_payment_summary

# %% [markdown]
# ### ✅ Result
#
# The observed table has one row per unique `transaction_id` and one unique
# `ride_id` per row. Therefore, 212,628 `Approved` transactions equal 212,628
# rides with a successful recorded payment, totaling $4,251,667.61.
#
# ### 🧠 What We Learned
#
# This equality is supported by the observed one-transaction-per-ride grain; it
# is not an assumption about payment systems generally.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why filter to `Approved` before counting and summing payments?
#
# <details>
# <summary>💡 Show answer</summary>
#
# The only statuses are `Approved` and `Decline`. Including declined rows would
# overstate both successful-payment count and collected value.
#
# </details>

# endregion
# region Q09 — Requests by Platform
# %% [markdown]
# ## Business Question 9: How were ride requests distributed by platform?
#
# ### 🎯 Goal — What & Why
#
# Attribute each ride request to the platform of its signup-linked app download.
#
# ### 🗺️ Mental Model
#
# ```text
# ride_requests: one row/request
#       │ user_id, many-to-one LEFT JOIN
#       ↓
# signups: one row/user
#       │ session_id = app_download_key, many-to-one LEFT JOIN
#       ↓
# app_downloads: one row/download → platform
#       ↓
# output: one row/ride request
# ```
#
# ### ⚠️ Watch Out
#
# This is the signup-linked download platform, not a request-time device field.

# %%
app_download_platforms = pd.read_sql(
    "SELECT app_download_key, platform FROM app_downloads",
    connection,
)
app_download_platforms.head()

# %%
# .merge() → attach each request's signup using user_id
# how="left" → preserve every ride request from the left DataFrame
# validate="many_to_one" → reject a join that could multiply request rows
# indicator=... → record whether each request found a signup match
ride_requests_with_signup = ride_requests[["ride_id", "user_id"]].merge(
    signup_identifiers[["user_id", "session_id"]],
    on="user_id",
    how="left",
    validate="many_to_one",
    indicator="_signup_match",
)

ride_requests_with_platform = ride_requests_with_signup.merge(
    app_download_platforms,
    left_on="session_id",
    right_on="app_download_key",
    how="left",
    validate="many_to_one",
    indicator="_download_match",
)

platform_join_check = {
    "input_ride_requests": len(ride_requests),
    "after_signup_join": len(ride_requests_with_signup),
    "after_download_join": len(ride_requests_with_platform),
    "distinct_output_ride_ids": ride_requests_with_platform["ride_id"].nunique(),
    "missing_signup_links": int(
        (ride_requests_with_platform["_signup_match"] != "both").sum()
    ),
    "missing_download_links": int(
        (ride_requests_with_platform["_download_match"] != "both").sum()
    ),
    "missing_platforms": int(
        ride_requests_with_platform["platform"].isna().sum()
    ),
}
platform_join_check

# %%
ride_requests_by_platform = (
    ride_requests_with_platform["platform"]
    .value_counts(dropna=False)
    # .rename_axis() → name the platform-label index
    .rename_axis("platform")
    # .reset_index() → turn the indexed counts into DataFrame columns
    .reset_index(name="ride_requests")
)
ride_requests_by_platform["share_percent"] = (
    100 * ride_requests_by_platform["ride_requests"] / total_ride_requests
).round(2)
ride_requests_by_platform

# %% [markdown]
# ### ✅ Result
#
# At ride-request grain: iOS 234,693 (60.88%), Android 112,317 (29.14%), and
# Web 38,467 (9.98%). All 385,477 requests were preserved and matched.
#
# ### 🧠 What We Learned
#
# Most request rows are associated with an iOS app download; this descriptive
# distribution does not explain why platforms differ.
#
# ### 📚 DataCamp Reference
#
# **Course:** Joining Data with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** How did you prevent the platform joins from multiplying requests?
#
# <details>
# <summary>💡 Show answer</summary>
#
# Each lookup key was validated as unique, both merges required a many-to-one
# relationship, and row and distinct-`ride_id` counts remained 385,477.
#
# </details>

# endregion
# region Q10 — Signup to Ride Request Drop-off
# %% [markdown]
# ## Business Question 10: What was the signup-to-ride-request drop-off?
#
# ### 🎯 Goal — What & Why
#
# Measure the share of signed-up users who never requested a ride.
#
# ### 🗺️ Mental Model
#
# ```text
# all signed-up users = denominator
#       │ LEFT JOIN distinct requesting users on user_id
#       ├── match    → requested at least one ride
#       └── no match → drop-off numerator
# output: one row/signed-up user
# ```
#
# ### ⚠️ Watch Out
#
# Joining raw ride requests would repeat users and corrupt the signup denominator.

# %%
# .drop_duplicates() → reduce repeated requests to one row per user
requesting_users = ride_requests[["user_id"]].drop_duplicates()
# .isin() → check whether each requesting user appears in signups
requesting_users_without_signup = int(
    (~requesting_users["user_id"].isin(signup_identifiers["user_id"])).sum()
)

# validate="one_to_one" → require one row per user on both sides
signup_request_status = signup_identifiers[["user_id"]].merge(
    requesting_users,
    on="user_id",
    how="left",
    validate="one_to_one",
    indicator="_request_match",
)
signup_request_status["requested_at_least_one_ride"] = (
    signup_request_status["_request_match"] == "both"
)

signup_to_request_join_check = {
    "input_signup_rows": total_signup_rows,
    "output_signup_rows": len(signup_request_status),
    "distinct_output_users": signup_request_status["user_id"].nunique(),
    "requesting_users_without_signup": requesting_users_without_signup,
}
signup_to_request_join_check

# %%
signup_dropoff_denominator = len(signup_request_status)
registered_users_requesting_rides = int(
    signup_request_status["requested_at_least_one_ride"].sum()
)
signup_dropoff_numerator = (
    signup_dropoff_denominator - registered_users_requesting_rides
)
signup_to_ride_request_dropoff_percent = round(
    100 * signup_dropoff_numerator / signup_dropoff_denominator,
    2,
)

signup_to_request_dropoff = {
    "denominator_signed_up_users": signup_dropoff_denominator,
    "users_requesting_at_least_one_ride": registered_users_requesting_rides,
    "dropoff_users": signup_dropoff_numerator,
    "dropoff_percent": signup_to_ride_request_dropoff_percent,
}
signup_to_request_dropoff

# %% [markdown]
# ### ✅ Result
#
# Of 17,623 signed-up users, 12,406 requested at least one ride and 5,217 did
# not. The signup-to-request drop-off was 29.60%.
#
# ### 🧠 What We Learned
#
# The observed drop-off describes stage participation only; it does not explain
# why 5,217 registered users made no ride request.
#
# ### 📚 DataCamp Reference
#
# **Course:** Joining Data with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why deduplicate requesting users before the drop-off join?
#
# <details>
# <summary>💡 Show answer</summary>
#
# Drop-off uses one signed-up user as its analytical unit. Deduplicating
# `user_id` before a left join prevents repeat requests from multiplying signup
# rows and preserves all 17,623 users in the denominator.
#
# </details>
# endregion
# region Constructing the Customer Funnel — First Learning Slice
# %% [markdown]
# # Constructing the Customer Funnel
#
# ## Learning Slice 1A: Does every signup link to a recorded app download?
#
# ### 🎯 Goal — What & Why
#
# Validate the full signup-to-download relationship before using it in a
# customer funnel. This separates relationship integrity from funnel behavior.
#
# ### 🗺️ Mental Model
#
# ```text
# app_downloads: one row/download, unique app_download_key
#                                ↑ membership check
# signups:       one row/user,    session_id
#                                ↓
#                    one match result/signup row
# ```
#
# ### ⚠️ Watch Out
#
# A missing relationship would be an integrity exception, not automatically a
# customer drop-off.

# %%
# .isin() returns one Boolean match result for every signup row
signup_has_download_match = signup_identifiers["session_id"].isin(
    app_download_keys["app_download_key"]
)

matched_signup_records = int(signup_has_download_match.sum())
unmatched_signup_records = int((~signup_has_download_match).sum())

signup_download_integrity = pd.DataFrame(
    [
        {
            "total_signup_records": total_signup_rows,
            "matched_signup_records": matched_signup_records,
            "unmatched_signup_records": unmatched_signup_records,
        }
    ]
)
signup_download_integrity

# %% [markdown]
# ### ✅ Result
#
# All 17,623 signup records matched an `app_download_key`; 0 signup records were
# unmatched.
#
# ### 🧠 What We Learned
#
# The observed signup table has complete link coverage to `app_downloads`.
# This validates relationship integrity only; it is not a conversion or
# drop-off calculation.
#
# ### 📚 DataCamp Reference
#
# **Course:** Joining Data with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why test every signup-to-download link before building the funnel?
#
# <details>
# <summary>💡 Show answer</summary>
#
# A complete link check shows whether the tables connect as expected. Missing
# links would first be integrity exceptions, not evidence of customer drop-off.
#
# </details>

# %% [markdown]
# ## Learning Slice 1B: How can ride activity become one state row per user?
#
# ### 🎯 Goal — What & Why
#
# Reduce repeated ride requests to one row per requesting `user_id`, with
# Boolean columns showing whether that user requested and completed at least
# one ride.
#
# ### 🗺️ Mental Model
#
# ```text
# ride_requests:          one row/ride request
#        │ one-to-one merge on ride_id
#        ↓
# ride activity:          one row/ride request + completion state
#        │ group by user_id and ask .any()
#        ↓
# requesting user state:  one row/requesting user
# ```
#
# ### ⚠️ Watch Out
#
# The request and completion DataFrames were loaded separately, so their rows
# must be joined by `ride_id` rather than assumed to be in the same order.

# %%
# validate="one_to_one" rejects duplicate ride IDs that could multiply rows
ride_activity = ride_requests[["ride_id", "user_id"]].merge(
    ride_completion_fields[["ride_id", "pickup_ts", "dropoff_ts"]],
    on="ride_id",
    how="left",
    validate="one_to_one",
    indicator="_completion_fields_match",
)

# Every input row is a request; completion requires both ride timestamps
ride_activity["ride_requested"] = True
ride_activity["completed_ride"] = (
    ride_activity["pickup_ts"].notna()
    & ride_activity["dropoff_ts"].notna()
)

completed_ride_records_after_join = int(
    ride_activity["completed_ride"].sum()
)

ride_activity_validation = {
    "input_ride_request_rows": len(ride_requests),
    "output_ride_activity_rows": len(ride_activity),
    "distinct_output_ride_ids": ride_activity["ride_id"].nunique(),
    "unmatched_completion_rows": int(
        (ride_activity["_completion_fields_match"] != "both").sum()
    ),
    "completed_ride_records": completed_ride_records_after_join,
    "matches_q04_completed_rides": (
        completed_ride_records_after_join == completed_rides
    ),
}
ride_activity_validation

# %%
# .any() means that at least one ride row for the user has a True value
requesting_user_ride_state = (
    ride_activity.groupby("user_id", as_index=False)
    .agg(
        requested_at_least_one_ride=("ride_requested", "any"),
        completed_at_least_one_ride=("completed_ride", "any"),
    )
)
requesting_user_ride_state.head()

# %%
completed_without_request = int(
    (
        requesting_user_ride_state["completed_at_least_one_ride"]
        & ~requesting_user_ride_state["requested_at_least_one_ride"]
    ).sum()
)
users_completed_at_least_one_ride = int(
    requesting_user_ride_state["completed_at_least_one_ride"].sum()
)

requesting_user_state_validation = {
    "ride_rows_with_missing_user_id": missing_request_user_ids,
    "distinct_requesting_user_ids": distinct_requesting_users,
    "user_state_rows": len(requesting_user_ride_state),
    "rows_match_distinct_requesting_users": (
        len(requesting_user_ride_state) == distinct_requesting_users
    ),
    "user_id_is_unique": (
        not requesting_user_ride_state["user_id"].duplicated().any()
    ),
    "all_requested_flags_are_true": bool(
        requesting_user_ride_state["requested_at_least_one_ride"].all()
    ),
    "completed_without_request": completed_without_request,
    "users_completed_at_least_one_ride": users_completed_at_least_one_ride,
}
requesting_user_state_validation

# %% [markdown]
# ### ✅ Result
#
# The `ride_id` merge preserved 385,477 ride-request rows and 385,477 distinct
# ride IDs without multiplication. The same pickup-and-drop-off rule identified
# 223,652 completed ride records, matching Q04.
#
# The user-state output has 12,406 rows — one for each distinct requesting
# `user_id` — and `user_id` is unique. Every requested flag is `True`, and no
# completed flag is `True` without a requested flag. In this observed output,
# 6,233 users completed at least one ride.
#
# ### 🧠 What We Learned
#
# Grouping Boolean ride states with `.any()` changes the grain from many ride
# requests per user to one row per requesting user while retaining stage
# attainment.
#
# ### 📚 DataCamp Reference
#
# **Course:** Data Manipulation with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why use `.any()` when reducing ride rows to user state?
#
# <details>
# <summary>💡 Show answer</summary>
#
# `.any()` returns `True` when at least one ride row for that user meets the
# condition. It therefore represents “at least one” without counting the user
# more than once.
#
# </details>
# endregion
# region Constructing the Customer Funnel — Download-Anchored Base Table
# %% [markdown]
# ## Learning Slice 2: How can we build one state row per app download?
#
# ### 🎯 Goal — What & Why
#
# Keep every recorded app download as the base population, then attach signup
# and ride-stage state without changing the one-row-per-download grain.
#
# ### 📐 Input and Output Grain
#
# - `signups`: one row per registered `user_id`
# - `requesting_user_ride_state`: one row per requesting `user_id`
# - `app_downloads`: one row per `app_download_key`
# - `download_anchored_funnel_base`: one row per `app_download_key`; this key
#   defines the grain. `user_id` is a nullable downstream identifier available
#   only after signup, so a missing `user_id` for a download without signup is
#   expected and does not change the grain.
#
# ### 🗺️ Mental Model
#
# ```text
# signups (17,623 rows)
#   LEFT JOIN requesting-user state on user_id
#         ↓
# enriched signups (17,623 rows)
#
# app downloads (23,608 rows)
#   LEFT JOIN enriched signups on app_download_key = session_id
#         ↓
# download-anchored base (23,608 rows)
# ```
#
# ### ⚠️ Watch Out
#
# Join the reduced user-state table, not raw ride rows. Repeated ride rows
# would multiply signup and download records.

# %%
ride_stage_columns = [
    "requested_at_least_one_ride",
    "completed_at_least_one_ride",
]

# Both inputs are unique on user_id, but requesting_user_ride_state contains
# only registered users who requested at least one ride. The LEFT JOIN therefore
# preserves one row per signup.
signup_funnel_state = signup_identifiers[["user_id", "session_id"]].merge(
    requesting_user_ride_state,
    on="user_id",
    how="left",
    validate="one_to_one",
    indicator="_ride_state_match",
)

signup_without_ride_state = (
    signup_funnel_state["_ride_state_match"] == "left_only"
)

# No ride-state match means this signed-up user did not request or complete a ride
signup_funnel_state[ride_stage_columns] = (
    signup_funnel_state[ride_stage_columns]
    .fillna(False)
    .astype(bool)
)

signup_ride_state_join_validation = {
    "input_signup_rows": total_signup_rows,
    "output_signup_rows": len(signup_funnel_state),
    "signup_rows_added_by_join": (
        len(signup_funnel_state) - total_signup_rows
    ),
    "distinct_output_user_ids": (
        signup_funnel_state["user_id"].nunique()
    ),
    "user_id_is_unique": (
        not signup_funnel_state["user_id"].duplicated().any()
    ),
    "absent_requested_flags_are_false": bool(
        (
            ~signup_funnel_state.loc[
                signup_without_ride_state,
                "requested_at_least_one_ride",
            ]
        ).all()
    ),
    "absent_completed_flags_are_false": bool(
        (
            ~signup_funnel_state.loc[
                signup_without_ride_state,
                "completed_at_least_one_ride",
            ]
        ).all()
    ),
}
signup_ride_state_join_validation

# %%
# Downloads stay on the left so every app_download_key remains in the base
downloads_with_signup_state = app_download_keys[["app_download_key"]].merge(
    signup_funnel_state[
        [
            "session_id",
            "user_id",
            "requested_at_least_one_ride",
            "completed_at_least_one_ride",
        ]
    ],
    left_on="app_download_key",
    right_on="session_id",
    how="left",
    validate="one_to_one",
    indicator="_signup_match",
)

downloads_with_signup_state["downloaded"] = True
downloads_with_signup_state["signed_up"] = (
    downloads_with_signup_state["_signup_match"] == "both"
)

# Downloads without a signup have no later user-stage membership
downloads_with_signup_state[ride_stage_columns] = (
    downloads_with_signup_state[ride_stage_columns]
    .fillna(False)
    .astype(bool)
)

base_funnel_columns = [
    "app_download_key",
    "user_id",
    "downloaded",
    "signed_up",
    "requested_at_least_one_ride",
    "completed_at_least_one_ride",
]

download_anchored_funnel_base = downloads_with_signup_state[
    base_funnel_columns
].copy()
download_anchored_funnel_base.head()

# %%
downloaded_count = int(
    download_anchored_funnel_base["downloaded"].sum()
)
signed_up_count = int(
    download_anchored_funnel_base["signed_up"].sum()
)
requested_user_count = int(
    download_anchored_funnel_base[
        "requested_at_least_one_ride"
    ].sum()
)
completed_user_count = int(
    download_anchored_funnel_base[
        "completed_at_least_one_ride"
    ].sum()
)

download_anchored_base_validation = {
    "input_download_rows": total_app_download_rows,
    "output_base_rows": len(download_anchored_funnel_base),
    "download_rows_added_by_join": (
        len(download_anchored_funnel_base) - total_app_download_rows
    ),
    "distinct_app_download_keys": (
        download_anchored_funnel_base["app_download_key"].nunique()
    ),
    "app_download_key_is_unique": (
        not download_anchored_funnel_base[
            "app_download_key"
        ].duplicated().any()
    ),
    "columns_match_required_order": (
        download_anchored_funnel_base.columns.tolist()
        == base_funnel_columns
    ),
    "missing_stage_flags": int(
        download_anchored_funnel_base[
            [
                "downloaded",
                "signed_up",
                "requested_at_least_one_ride",
                "completed_at_least_one_ride",
            ]
        ].isna().sum().sum()
    ),
    "all_downloaded_flags_are_true": bool(
        download_anchored_funnel_base["downloaded"].all()
    ),
    "downloaded": downloaded_count,
    "signed_up": signed_up_count,
    "requested_at_least_one_ride": requested_user_count,
    "completed_at_least_one_ride": completed_user_count,
    "stage_counts_match_accepted_results": (
        downloaded_count == total_app_download_rows
        and signed_up_count == registered_users
        and requested_user_count == distinct_requesting_users
        and completed_user_count == users_completed_at_least_one_ride
    ),
}
download_anchored_base_validation

# %%
funnel_nesting_validation = {
    "completed_true_requested_false": int(
        (
            download_anchored_funnel_base[
                "completed_at_least_one_ride"
            ]
            & ~download_anchored_funnel_base[
                "requested_at_least_one_ride"
            ]
        ).sum()
    ),
    "requested_true_signed_up_false": int(
        (
            download_anchored_funnel_base[
                "requested_at_least_one_ride"
            ]
            & ~download_anchored_funnel_base["signed_up"]
        ).sum()
    ),
    "signed_up_true_downloaded_false": int(
        (
            download_anchored_funnel_base["signed_up"]
            & ~download_anchored_funnel_base["downloaded"]
        ).sum()
    ),
}
funnel_nesting_validation

# %% [markdown]
# ### ✅ Result
#
# Both left joins preserved their input grains: 17,623 signup rows after the
# user-state join and 23,608 download rows with 23,608 distinct
# `app_download_key` values in the final base.
#
# The stage flags reconcile to the accepted counts: 23,608 downloaded, 17,623
# signed up, 12,406 requested at least one ride, and 6,233 completed at least
# one ride. All three nesting checks returned 0 violations.
#
# ### 🧠 What We Learned
#
# Reducing ride activity before joining lets the source tables become one
# cumulative state row per download without duplicating the base population.
# Missing later-stage values become `False` only after their join meaning is
# established.
# We intentionally defer platform, age-group, and download-date segmentation
# until the stage-state base is validated.
#
# ### 📚 DataCamp Reference
#
# **Course:** Joining Data with pandas
#
# ### 🧑‍💼 Recruiter Check
#
# **Question:** Why must app downloads be the left table in the final join?
#
# <details>
# <summary>💡 Show answer</summary>
#
# Downloads define the required base grain. A left join retains downloads that
# never matched a signup, while one-to-one validation prevents row
# multiplication.
#
# </details>
# endregion
