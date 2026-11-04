// Supplementary web reading guides; the preview pilot is owned by Python.
// Excerpts are maintenance references; the full source cell is displayed above each guide.
// Each source matcher identifies exactly one code cell at build time.
export const codeGuides = [
  {
    id: "open-database-connection",
    overview:
      "Before exploring Metrocar, open the connection that the later SQL queries will share.",
    why:
      "Reaching the database enables inspection; it does not establish that its records, relationships or metric definitions are reliable.",
    sourceMatcher: 'metrocar_url = os.environ["METROCAR_DATABASE_URL"]',
    steps: [
      {
        code: "load_dotenv()",
        explanation:
          "Loads locally configured environment variables before Python reads the database setting. The credential value is not written into this source file.",
      },
      {
        code: 'metrocar_url = os.environ["METROCAR_DATABASE_URL"]',
        explanation:
          "`os.environ[...]` retrieves the configured database URL by name. It raises an error if that variable is missing, instead of silently connecting elsewhere.",
      },
      {
        code: "engine = sa.create_engine(metrocar_url)\nconnection = engine.connect()",
        explanation:
          "The engine holds SQLAlchemy's database configuration; `connect()` opens the active connection that the following pandas queries use.",
      },
    ],
  },
  {
    id: "list-source-tables",
    overview:
      "Find the available tables before deciding which part of the customer journey each can describe.",
    why:
      "A table name is a starting point. Its fields, row meaning and relationships still need inspection.",
    sourceMatcher: "inspector = sa.inspect(engine)",
    steps: [
      {
        code: "inspector = sa.inspect(engine)\ntable_names = inspector.get_table_names()",
        explanation:
          "`sa.inspect()` creates a schema inspector from the database engine, and `get_table_names()` lists the available source tables. This tells us which tables we can inspect next; it does not yet verify their contents or grain.",
      },
    ],
  },
  {
    id: "list-download-columns",
    overview:
      "Locate the fields that could identify a download before choosing the customer funnel’s starting population.",
    why:
      "Seeing `app_download_key` in a column list does not prove uniqueness; that requires checking the full table.",
    sourceMatcher: "app_downloads_column_names = app_downloads_preview.columns.tolist()",
    steps: [
      {
        code: "app_downloads_preview.columns.tolist()",
        explanation:
          "`.columns` holds the preview's field names, and `.tolist()` makes them easy to read. We need to identify `app_download_key` before testing whether it can represent one download record per row.",
      },
    ],
  },
  {
    id: "display-download-preview",
    overview:
      "Look again at the download preview already held in memory, keeping the visible example beside the grain discussion.",
    why:
      "A preview helps us understand structure. Five visible rows cannot establish properties of the complete download population.",
    sourceMatcher: "app_downloads_preview",
    exactMatch: true,
    steps: [
      {
        code: "app_downloads_preview",
        explanation:
          "Writing the DataFrame name as the last expression displays the five rows already loaded; it does not run another query.",
      },
    ],
  },
  {
    id: "validate-download-key",
    overview:
      "Before counting downloads or joining other tables, test whether every download row has its own recorded key.",
    why:
      "Later joins depend on this grain. Repeated or missing keys would undermine both the base population and its stage counts.",
    sourceMatcher:
      'duplicate_app_download_keys_exist = app_download_keys[',
    steps: [
      {
        code: ".nunique()",
        explanation:
          "`.nunique()` counts distinct non-missing download keys; `len()` counts all download rows. If the counts agree, every row contributes one distinct, present key, supporting one keyed download record per row before we count downloads or use this key as the funnel base.",
      },
      {
        code: ".duplicated().any()",
        explanation:
          "`.duplicated()` marks repeated keys, and `.any()` asks whether even one exists. A repeated key would break the proposed one-row-per-download-key grain and could multiply or miscount later funnel rows.",
      },
    ],
  },
  {
    id: "record-download-count",
    overview:
      "Carry the checked download total forward under a name that makes its role in the analysis clear.",
    why:
      "The number represents recorded downloads, not necessarily distinct people. Renaming it does not change its population.",
    sourceMatcher: "recorded_app_downloads = total_app_download_rows",
    steps: [
      {
        code: "recorded_app_downloads = total_app_download_rows",
        explanation:
          "Reuses the full-table row count as the download answer because the previous cell verified one unique key per row. This is an alias, not a new count or filter.",
      },
    ],
  },
  {
    id: "preview-signup-rows",
    overview:
      "Inspect a small signup example so we can see which fields describe registration and which may link back to downloads.",
    why:
      "This reveals the table’s structure; it does not yet prove one row per user or a valid download relationship.",
    sourceMatcher: "signups_preview = pd.read_sql(",
    steps: [
      {
        code: 'pd.read_sql("SELECT * FROM signups LIMIT 5", connection)',
        explanation:
          "Runs a five-row SQL preview through the existing connection and returns it as a DataFrame. These rows show the available fields, not table-wide uniqueness.",
      },
    ],
  },
  {
    id: "list-signup-columns",
    overview:
      "Identify the two keys needed next: one for registered-user grain and another for the signup-to-download relationship.",
    why:
      "A candidate key’s name does not establish its role. Uniqueness and link coverage must be checked separately.",
    sourceMatcher: "signups_column_names = signups_preview.columns.tolist()",
    steps: [
      {
        code: "signups_preview.columns.tolist()",
        explanation:
          "Converts the preview's field names to a readable list. This lets us locate `user_id` for signup grain and `session_id` for the later download relationship before checking either one.",
      },
    ],
  },
  {
    id: "check-signup-identifiers",
    overview:
      "Decide whether signup rows can represent registered identifiers without multiplying them when downloads are joined later.",
    why:
      "Unique keys protect join cardinality. They do not prove that every signup session exists among the recorded downloads.",
    sourceMatcher: "signup_identifiers = pd.read_sql(",
    steps: [
      {
        code: "SELECT user_id, session_id FROM signups",
        explanation:
          "Loads both identifiers for every signup row. `user_id` is the candidate row key; `session_id` will later link that signup to a download.",
      },
      {
        code: 'signup_identifiers["user_id"].nunique()\nsignup_identifiers["user_id"].duplicated().any()',
        explanation:
          "`.nunique()` counts distinct non-missing IDs; `.duplicated().any()` exposes repeats. The same checks on `user_id` and `session_id` serve different purposes: one signup per registered identifier, and at most one signup per session when downloads are joined later. These within-table checks do not yet prove that each session exists in downloads.",
      },
      {
        code: "signups_grain_check = {...}",
        explanation:
          "Puts the total rows beside both distinct-key and duplicate results so we can validate signup grain before counting users. A unique `session_id` supports join cardinality, but matching it to an actual download still needs a separate integrity test.",
      },
    ],
  },
  {
    id: "record-registered-user-count",
    overview:
      "Keep the distinct signup-identifier count available as the registered-user population for later comparisons.",
    why:
      "Registered IDs and ride requests answer different questions. An identifier count also does not establish a count of physical people.",
    sourceMatcher: "registered_users = distinct_signup_user_ids",
    steps: [
      {
        code: "registered_users = distinct_signup_user_ids",
        explanation:
          "Names the previously calculated count of distinct signup `user_id` values for later questions. It does not count ride rows or infer physical people.",
      },
    ],
  },
  {
    id: "load-ride-request-fields",
    overview:
      "Move from registration to ride activity, retaining the identifiers and request times needed to understand each request row.",
    why:
      "Several request rows may belong to one user. Loading them together does not turn ride volume into a customer count.",
    sourceMatcher: "ride_requests = pd.read_sql(",
    steps: [
      {
        code: "SELECT ride_id, user_id, request_ts FROM ride_requests",
        explanation:
          "Loads `ride_id` to count request records, `user_id` to count distinct requesters later, and `request_ts` to check that requests have a recorded time. `.head()` previews only a few rows; the DataFrame still holds the full query result.",
      },
    ],
  },
  {
    id: "list-ride-request-columns",
    overview:
      "Confirm which request fields are available before using them as keys, user links or evidence of recorded request events.",
    why:
      "The field list confirms what was loaded; the next checks must establish whether those fields support the intended grain.",
    sourceMatcher: "ride_request_column_names = ride_requests.columns.tolist()",
    steps: [
      {
        code: "ride_requests.columns.tolist()",
        explanation:
          "Turns the loaded ride DataFrame's column labels into a regular list for inspection.",
      },
    ],
  },
  {
    id: "check-ride-request-grain",
    overview:
      "Test whether a request row can be counted as one keyed ride request with a recorded request time.",
    why:
      "A plausible row total is insufficient. Key and timestamp checks determine whether the request-count interpretation is supported.",
    sourceMatcher: "total_ride_request_rows = len(ride_requests)",
    steps: [
      {
        code: 'len(ride_requests)\nride_requests["ride_id"].nunique()',
        explanation:
          "`len()` counts physical request rows; `.nunique()` counts distinct non-missing `ride_id` values. Agreement supports one keyed request per row, so a later row count measures requests rather than repeated keys or users.",
      },
      {
        code: '.duplicated().any()\nride_requests["request_ts"].isna().sum()',
        explanation:
          "`.duplicated().any()` tests for repeated ride keys; `.isna().sum()` counts rows without a request time. Both checks matter: a unique key prevents double-counting requests, while a missing timestamp would weaken the claim that a keyed row records an actual request event.",
      },
      {
        code: "ride_request_grain_check = {...}",
        explanation:
          "Displays the row, key, and timestamp checks together before later code counts rides at this grain.",
      },
    ],
  },
  {
    id: "record-request-count",
    overview:
      "Name the checked request total so later comparisons can reuse the same ride-level population.",
    why:
      "This is a count of request records. It should not be read as the number of distinct requesting users.",
    sourceMatcher: "total_ride_requests = total_ride_request_rows",
    steps: [
      {
        code: "total_ride_requests = total_ride_request_rows",
        explanation:
          "Reuses the checked physical row count as the named request total. This assignment does not deduplicate by `user_id`; multiple rides by one requester remain multiple requests.",
      },
    ],
  },
  {
    id: "load-completion-timestamps",
    overview:
      "Bring pickup and drop-off evidence beside each ride key before deciding which requests meet the completion definition.",
    why:
      "Keeping both markers at ride grain lets the next step test completion on the same ride rather than across a user’s history.",
    sourceMatcher: "ride_completion_fields = pd.read_sql(",
    steps: [
      {
        code: "SELECT ride_id, pickup_ts, dropoff_ts FROM ride_requests",
        explanation:
          "Loads the ride key and both completion timestamps from the same request table. The data stay at one row per `ride_id`, so the next cell can classify each request as completed or not without switching to user counts.",
      },
    ],
  },
  {
    id: "completed-ride-mask",
    overview:
      "Turn the accepted completion definition into a decision for every request: both pickup and drop-off timestamps must be present.",
    why:
      "The count describes completion under this recorded-marker rule. It does not explain non-completion or establish valid timestamp order.",
    sourceMatcher:
      "completed_ride_mask = pickup_timestamp_present & dropoff_timestamp_present",
    steps: [
      {
        code: 'ride_completion_fields["pickup_ts"].notna()',
        explanation:
          "`.notna()` produces one True/False value per ride row for pickup, and again for drop-off. We need both recorded events because a request alone, or just one timestamp, does not meet the accepted completed-ride definition.",
      },
      {
        code: "completed_ride_mask = pickup_timestamp_present & dropoff_timestamp_present",
        explanation:
          "`&` combines the two aligned masks row by row: only a ride with both timestamps becomes `True`. Summing those flags counts completed ride records (`True` contributes 1), preserving the ride-level unit for the requested-versus-completed comparison.",
      },
      {
        code: "pickup_timestamp_present & ~dropoff_timestamp_present",
        explanation:
          "`~` reverses a mask to find pickup-only rows; the mirrored expression finds drop-off-only rows. Counting these partial states checks whether the two-marker rule hides inconsistent records; it does not redefine completion.",
      },
    ],
  },
  {
    id: "count-distinct-requesters",
    overview:
      "Separate the volume of ride requests from the number of requester IDs behind them.",
    why:
      "This counts recorded IDs, not necessarily distinct people. Missing IDs remain visible rather than silently becoming known requesters.",
    sourceMatcher: 'distinct_requesting_users = ride_requests["user_id"].nunique()',
    steps: [
      {
        code: 'ride_requests["user_id"].nunique()',
        explanation:
          "`.nunique()` counts each non-missing requester ID once, even if that `user_id` has many ride rows. This produces one scalar count, not a new user-level table; comparing it with request rows separates distinct requesting IDs from the volume of rides.",
      },
      {
        code: 'ride_requests["user_id"].isna().sum()',
        explanation:
          "Counts missing requester IDs separately because `.nunique()` excludes them; such rows cannot later match a signup by `user_id`.",
      },
    ],
    after: "Many ride-request rows → one distinct-requester count, with missing user IDs reported separately.",
  },
  {
    id: "calculate-valid-ride-duration",
    overview:
      "Measure elapsed minutes only for completed rides whose recorded timestamps are in a sensible order.",
    why:
      "The average describes that valid completed-ride subset. It is neither waiting time nor an average across all ride requests.",
    sourceMatcher: 'valid_duration_rides["duration_minutes"] = (',
    steps: [
      {
        code: "valid_duration_mask = completed_ride_mask & (dropoff_ts >= pickup_ts)",
        explanation:
          "Combines the accepted completion mask with a time-order test. Only rides with both timestamps and drop-off at or after pickup can produce a sensible nonnegative duration; the later `<` check reports any completed rides excluded for reversed times.",
      },
      {
        code: '.loc[valid_duration_mask, ["ride_id", "pickup_ts", "dropoff_ts"]].copy()',
        explanation:
          "`.loc` selects only qualifying rows and the three needed columns. `.copy()` creates an independent DataFrame before `duration_minutes` is added, leaving the source timestamp table unchanged.",
      },
      {
        code: "(dropoff_ts - pickup_ts).dt.total_seconds() / 60",
        explanation:
          "Subtracting the aligned timestamps gives one elapsed time per valid ride; `.dt.total_seconds() / 60` turns each into minutes. `.mean()` then averages only those valid ride durations, not all requests, and `round(..., 2)` makes the reported answer readable.",
      },
    ],
    after:
      "One valid completed-ride row → one duration in minutes; the reported mean uses that validated ride subset as its denominator.",
  },
  {
    id: "load-acceptance-fields",
    overview:
      "Bring the acceptance timestamp and driver assignment together so their meanings can be compared on each ride.",
    why:
      "These are candidate acceptance signals. Their presence does not by itself establish that the ride was completed.",
    sourceMatcher: "ride_acceptance_fields = pd.read_sql(",
    steps: [
      {
        code: "SELECT ride_id, driver_id, accept_ts FROM ride_requests",
        explanation:
          "Q07 needs an accepted-ride count, so this loads the acceptance timestamp and assigned driver beside each `ride_id`. The next cell can compare both signals on the same ride before choosing a definition; `.head()` only previews a few rows.",
      },
    ],
  },
  {
    id: "check-acceptance-signals",
    overview:
      "Check whether the two recorded acceptance signals agree before relying on the timestamp to count accepted rides.",
    why:
      "Agreement supports a consistent recorded definition. Acceptance remains a separate stage from completion and does not explain its outcome.",
    sourceMatcher: 'acceptance_timestamp_present = ride_acceptance_fields["accept_ts"].notna()',
    steps: [
      {
        code: '.notna()',
        explanation:
          "`.notna()` turns each field into a present-or-missing flag on every ride row. Here, the `accept_ts` flag is the proposed acceptance state; a separate `driver_id` flag lets us check whether assignment supports it.",
      },
      {
        code: "(acceptance_timestamp_present != driver_id_present).sum()",
        explanation:
          "`!=` marks rides where the timestamp and driver signals disagree, and `.sum()` counts them. Zero mismatches support using `accept_ts` as the accepted-ride marker; summing its flag then counts accepted requests without treating acceptance as completion.",
      },
    ],
    after: "Acceptance is now a checked ride-level state, separate from completed rides.",
  },
  {
    id: "load-transactions",
    overview:
      "Bring payment records into the investigation before defining which outcomes count as successful collection.",
    why:
      "A transaction row is not automatically a paid ride. Keys and payment status must first support that interpretation.",
    sourceMatcher: "transactions = pd.read_sql(",
    steps: [
      {
        code: "transactions = pd.read_sql(..., connection)",
        explanation:
          "Q08 needs successful-payment count and collected amount, so `pd.read_sql()` brings in transaction and ride keys, amount, and status. We still must check the keys and status values before a transaction row can be counted as a paid ride.",
      },
      {
        code: "transactions.head()",
        explanation:
          "Displays a small preview; it does not validate the entire table.",
      },
    ],
  },
  {
    id: "list-transaction-columns",
    overview:
      "Locate the transaction identifiers, recorded amounts and outcome field needed to define successful payments.",
    why:
      "Having an amount column does not make every amount collected revenue; the status filter determines which rows qualify.",
    sourceMatcher: "transaction_column_names = transactions.columns.tolist()",
    steps: [
      {
        code: "transactions.columns.tolist()",
        explanation:
          "Turns the DataFrame's column-label index into a plain Python list so the loaded fields can be inspected.",
      },
    ],
  },
  {
    id: "check-transaction-grain",
    overview:
      "Check how transaction rows relate to transaction IDs and ride IDs before comparing payments with the ride funnel.",
    why:
      "One transaction per ride is an observed relationship to verify here, not a rule to assume for every payment system.",
    sourceMatcher: "total_transaction_rows = len(transactions)",
    steps: [
      {
        code: 'len(transactions)\ntransactions["transaction_id"].nunique()',
        explanation:
          "`len()` counts rows; `.nunique()` counts different non-missing transaction IDs. Comparing them tests whether one row really means one transaction before counting Approved rows.",
      },
      {
        code: 'transactions["transaction_id"].duplicated().any()',
        explanation:
          "`.duplicated().any()` asks whether any key repeats. Repeating the checks for `ride_id` matters because an Approved transaction count equals a paid-ride count only if these rows do not represent multiple transactions for one ride.",
      },
      {
        code: "transaction_grain_check = {...}",
        explanation:
          "Collects the row and key checks in one result. Once both keys reconcile, the observed table supports one transaction row per ride; that relationship is evidence from this data, not a general payment-system rule.",
      },
    ],
  },
  {
    id: "inspect-transaction-statuses",
    overview:
      "Inspect the recorded payment outcomes before choosing the success condition used in the revenue calculation.",
    why:
      "Keeping missing statuses visible prevents incomplete outcome data from disappearing before the definition is assessed.",
    sourceMatcher: 'transaction_status_counts = transactions["charge_status"].value_counts(',
    steps: [
      {
        code: 'transactions["charge_status"].value_counts(dropna=False)',
        explanation:
          "`.value_counts()` shows which payment outcomes actually occur before we choose a success filter. `dropna=False` also displays missing statuses, so they cannot silently disappear from the definition check.",
      },
    ],
  },
  {
    id: "summarize-approved-payments",
    overview:
      "Restrict the payment calculation to Approved records, then count them and add their recorded amounts.",
    why:
      "An amount on a declined transaction is not evidence of collection. Missing Approved amounts would also weaken the total.",
    sourceMatcher: "successful_payments = transactions.loc[",
    steps: [
      {
        code: 'transactions.loc[transactions["charge_status"] == "Approved"]',
        explanation:
          "The comparison makes a True/False mask for `Approved`, and `.loc` keeps only those transaction rows. Filtering first prevents amounts recorded on Decline rows from being mistaken for money collected.",
      },
      {
        code: 'successful_payments["purchase_amount_usd"].isna().sum()',
        explanation:
          "`.isna()` marks Approved rows with no amount, and `.sum()` counts them. We check this before revenue because pandas would otherwise skip missing amounts and still return a plausible-looking total.",
      },
      {
        code: 'round(float(successful_payments["purchase_amount_usd"].sum()), 2)',
        explanation:
          "Only after filtering and checking missing amounts do we add Approved amounts and round to cents. Because the ride-key relationship was checked, the selected row count can also be reported as rides with an Approved payment.",
      },
    ],
  },
  {
    id: "load-download-platforms",
    overview:
      "Prepare the download-platform lookup needed to trace each request through its linked signup.",
    why:
      "The platform belongs to the linked download record. It is not a measurement of the device used for a particular request.",
    sourceMatcher: "app_download_platforms = pd.read_sql(",
    steps: [
      {
        code: "app_download_platforms = pd.read_sql(..., connection)",
        explanation:
          "Q09 attributes requests to their signup-linked download platform, so this loads one platform value beside each download key. It is a lookup for later joins, not a device field measured when the ride was requested; `.head()` only previews it.",
      },
    ],
  },
  {
    id: "many-to-one-platform-joins",
    overview:
      "Trace each request through its signup to the corresponding download platform while preserving the full request population.",
    why:
      "Join checks protect request counts, but the attribution still describes the signup-linked download platform rather than a request-time device.",
    sourceMatcher:
      'ride_requests_with_signup = ride_requests[["ride_id", "user_id"]].merge(',
    steps: [
      {
        code: '.merge(..., on="user_id", how="left", validate="many_to_one", indicator="_signup_match")',
        explanation:
          "A requester may have many rides, but the analysis must still have one row per `ride_id`. This LEFT JOIN keeps every request while attaching its signup `session_id`; `validate=\"many_to_one\"` rejects duplicate signup matches that would multiply requests, and the indicator exposes missing links.",
      },
      {
        code: '.merge(..., left_on="session_id", right_on="app_download_key", validate="many_to_one")',
        explanation:
          "This follows each signup session to its download's platform while keeping request rows on the left again. The many-to-one check prevents duplicate download keys from inflating the request count; platform still means signup-linked download platform, not request-time device.",
      },
      {
        code: "platform_join_check = {...}",
        explanation:
          "Row counts and distinct `ride_id` values must still match the 385,477 input requests. The indicators and missing-platform count also reveal any unmatched links, so the platform totals can be trusted to represent all requests rather than just matched ones.",
      },
    ],
    after:
      "One ride-request row → one row with its signup-linked download platform.",
  },
  {
    id: "summarize-requests-by-platform",
    overview:
      "Translate the request-level platform links into one count and share for each recorded platform label.",
    why:
      "The denominator is all requests. These shares describe request volume, not platform-specific user counts or conversion rates.",
    sourceMatcher: "ride_requests_by_platform = (",
    steps: [
      {
        code: 'ride_requests_with_platform["platform"].value_counts(dropna=False)',
        explanation:
          "Each row is still a ride request, so `.value_counts()` counts requests by linked download platform—not distinct users. `dropna=False` retains any unmatched platform group, allowing the counts to reconcile to all requests.",
      },
      {
        code: '.rename_axis("platform").reset_index(name="ride_requests")',
        explanation:
          "Converts the platform labels and counts into named DataFrame columns, one row per platform label.",
      },
      {
        code: '100 * ride_requests_by_platform["ride_requests"] / total_ride_requests',
        explanation:
          "Dividing by the original 385,477 request rows makes each share a share of requests. A user-based denominator would answer a different question; rounding is only for display.",
      },
    ],
    after: "Many request rows → one count and share per platform label.",
  },
  {
    id: "requesting-user-membership",
    overview:
      "Ask which registered users requested at least one ride without allowing frequent riders to count as several signups.",
    why:
      "Preserving every signup makes the later drop-off denominator meaningful. Missing requester-to-signup links remain an integrity question.",
    sourceMatcher:
      'requesting_users = ride_requests[["user_id"]].drop_duplicates()',
    steps: [
      {
        code: 'requesting_users = ride_requests[["user_id"]].drop_duplicates()',
        explanation:
          "A user can have many ride rows, so `.drop_duplicates()` reduces the selected `user_id` column to one key per requester. This prevents frequent riders from multiplying the signup denominator.",
      },
      {
        code: '~requesting_users["user_id"].isin(signup_identifiers["user_id"])',
        explanation:
          "`.isin()` checks whether each requester key exists among the signup keys, and `~` reverses that membership result. Summing the mask counts requesters who would have no valid signup relationship.",
      },
      {
        code: '.merge(..., how="left", validate="one_to_one", indicator="_request_match")',
        explanation:
          "Signups stay on the left so every registered user remains in the output. `validate=\"one_to_one\"` rejects duplicate user keys on either side, while the merge indicator records whether each signup matched a requester; `_request_match == \"both\"` then becomes the request-membership flag.",
      },
    ],
    after:
      "One row per signed-up user → one Boolean request-membership flag.",
  },
  {
    id: "calculate-signup-request-dropoff",
    overview:
      "Compare the full signup population with those who reached Request to describe the loss between those two customer stages.",
    why:
      "The percentage describes recorded stage participation. It cannot explain why a registered user did not request a ride.",
    sourceMatcher: "signup_dropoff_denominator = len(signup_request_status)",
    steps: [
      {
        code: 'len(signup_request_status)\nsignup_request_status["requested_at_least_one_ride"].sum()',
        explanation:
          "`len()` counts the preserved one-row-per-signup population, not ride requests. Boolean `.sum()` counts its True request flags, so each signed-up user contributes at most once to the next-stage count.",
      },
      {
        code: "signup_dropoff_denominator - registered_users_requesting_rides",
        explanation:
          "Subtracts those who requested from all signups to count signups that did not reach Request.",
      },
      {
        code: "100 * signup_dropoff_numerator / signup_dropoff_denominator",
        explanation:
          "Dividing by all signups makes this the relative Signup → Request loss, not a share of requests or downloads. It measures stage participation, not why any user did not request.",
      },
    ],
  },
  {
    id: "check-signup-download-links",
    overview:
      "Before anchoring the funnel on downloads, check whether each signup can be traced back to a recorded download key.",
    why:
      "An unmatched source link is an integrity issue to investigate; it should not silently be interpreted as customer drop-off.",
    sourceMatcher: 'signup_has_download_match = signup_identifiers["session_id"].isin(',
    steps: [
      {
        code: 'signup_identifiers["session_id"].isin(app_download_keys["app_download_key"])',
        explanation:
          "Before building a download-anchored funnel, `.isin()` asks whether each signup's session exists among download keys. It produces one True/False result per signup without a join, so a broken source relationship is not confused with customer drop-off.",
      },
      {
        code: "signup_has_download_match.sum()\n(~signup_has_download_match).sum()",
        explanation:
          "Counts matched flags and their inverse over the identical signup population, so the two counts partition all signup records.",
      },
      {
        code: "signup_download_integrity = pd.DataFrame([...])",
        explanation:
          "The one-row result makes complete link coverage visible: 17,623 signup records match and none are unmatched. Only after this integrity check can the later download-to-signup join be interpreted as stage membership.",
      },
    ],
  },
  {
    id: "join-ride-completion-state",
    overview:
      "Attach completion evidence to each requested ride so later user-level summaries begin from correctly matched ride states.",
    why:
      "Match by `ride_id`, not row position. Both timestamps must belong to that same ride before it is marked completed.",
    sourceMatcher: 'ride_activity = ride_requests[["ride_id", "user_id"]].merge(',
    steps: [
      {
        code: '.merge(..., on="ride_id", how="left", validate="one_to_one", indicator="_completion_fields_match")',
        explanation:
          "The two source tables were loaded separately, so row position cannot identify the same ride. Joining on `ride_id` attaches timestamps to each preserved request; one-to-one validation prevents multiplied ride rows, and the indicator reveals any missing timestamp link.",
      },
      {
        code: 'ride_activity["pickup_ts"].notna() & ride_activity["dropoff_ts"].notna()',
        explanation:
          "Each `.notna()` tests one timestamp, and `&` requires both on the same ride. That recreates the accepted Completed definition as a ride-level Boolean; a pickup alone must not be counted as completion.",
      },
      {
        code: "ride_activity_validation = {...}",
        explanation:
          "Checks output rows, distinct ride IDs, unmatched timestamp rows, and whether the completed count agrees with the earlier Q04 calculation.",
      },
    ],
    after: "One row per ride request with its same-ride completion state.",
  },
  {
    id: "reduce-rides-to-user-state",
    overview:
      "The customer funnel needs one state per requester, even when that user has made many ride requests.",
    why:
      "Reducing ride histories prevents repeat riders from inflating the customer funnel. An at-least-one completion flag is not a completed-ride count.",
    sourceMatcher: "requesting_user_ride_state = (",
    steps: [
      {
        code: 'ride_activity.groupby("user_id", as_index=False)',
        explanation:
          "Before this step, one requester can occupy many `ride_id` rows; the customer funnel needs one state per requesting `user_id`. `.groupby()` gathers each user's rides for that grain change, while `as_index=False` leaves the key as a joinable column.",
      },
      {
        code: '.agg(..., "any")',
        explanation:
          "Within each user group, `\"any\"` turns the many ride-level True/False values into at-least-one Request and Completed flags. Named aggregation creates one row per requester, preventing frequent riders from being counted repeatedly in the customer funnel.",
      },
    ],
    after:
      "Many ride rows per user → one funnel-state row per requesting user.",
  },
  {
    id: "validate-requesting-user-state",
    overview:
      "Check that reducing ride activity produced one coherent state row per requester before attaching it to signups.",
    why:
      "A smaller output is not enough: keys, population totals and stage relationships must support the new user-level grain.",
    sourceMatcher: "completed_without_request = int(",
    steps: [
      {
        code: "completed_at_least_one_ride & ~requested_at_least_one_ride",
        explanation:
          "Marks any user-state row showing a completion but no request. Summing the mask counts violations of the required stage order.",
      },
      {
        code: 'requesting_user_ride_state["completed_at_least_one_ride"].sum()',
        explanation:
          "Counts requesting users who completed at least one ride; each user appears only once in this reduced table.",
      },
      {
        code: "requesting_user_state_validation = {...}",
        explanation:
          "Checks one output row per distinct requester, a unique non-missing `user_id`, all Request flags True, and no completion without request. These checks make the reduced state safe to join to signups without silently changing their grain.",
      },
    ],
  },
  {
    id: "fill-absent-ride-state",
    overview:
      "Bring requesting-user states back to the full signup population, including users with no recorded ride request.",
    why:
      "Here, missing joined state means no match in the requester subset. That specific meaning justifies `False`; missing values are not universally false.",
    sourceMatcher: "signup_funnel_state[ride_stage_columns] = (",
    steps: [
      {
        code: '.merge(..., how="left", validate="one_to_one", indicator="_ride_state_match")',
        explanation:
          "The complete signup population stays on the left, while the requesting-user state contains only a downstream subset. The LEFT JOIN therefore preserves every signup, `validate=\"one_to_one\"` protects the unique `user_id` grain, and the indicator exposes signups with no requester-state match.",
      },
      {
        code: "signup_funnel_state[ride_stage_columns].fillna(False).astype(bool)",
        explanation:
          "Because the right table contains only requesters, a missing joined state means this signup never requested in the recorded data. `.fillna(False)` marks both downstream stages False, and `.astype(bool)` restores explicit True/False columns for later counting.",
      },
      {
        code: '(~signup_funnel_state.loc[..., "requested_at_least_one_ride"]).all()',
        explanation:
          "The validation selects unmatched signups, inverts the requested flag, and uses `.all()` to confirm that every selected value is `False`, not merely a sample. The same check is repeated for `completed_at_least_one_ride`.",
      },
    ],
    after:
      "The signup denominator remains one row per registered user, now with complete ride-stage flags.",
  },
  {
    id: "build-download-anchored-base",
    overview:
      "Start from every recorded download and attach the downstream signup, request and completion states needed for the customer funnel.",
    why:
      "Downloads must remain on the left so early losses stay visible. The base represents download-derived entrants, not individual rides.",
    sourceMatcher: 'downloads_with_signup_state = app_download_keys[["app_download_key"]].merge(',
    steps: [
      {
        code: '.merge(..., left_on="app_download_key", right_on="session_id", how="left", validate="one_to_one")',
        explanation:
          "Downloads are the core funnel entrants, including those with no signup. This LEFT JOIN attaches signup and user-stage state where `app_download_key` equals `session_id`; one-to-one validation protects the one-row-per-download grain from duplicate matches.",
      },
      {
        code: 'downloads_with_signup_state["_signup_match"] == "both"',
        explanation:
          "The match indicator turns a recorded relationship into the Signup flag. Every base row is a Download by construction; only after the join establishes non-signup status do missing Request and Completed flags become False.",
      },
      {
        code: "download_anchored_funnel_base = downloads_with_signup_state[base_funnel_columns].copy()",
        explanation:
          "Keeps only the declared base columns, with `app_download_key` as the row key and `user_id` allowed to be missing before signup.",
      },
    ],
    after: "One row per app download, carrying explicit downstream stage flags.",
  },
  {
    id: "validate-download-anchored-base",
    overview:
      "Check that the assembled base still contains one row per download and reproduces the previously established stage populations.",
    why:
      "Matching totals alone cannot rule out multiplied rows. Key, row-count and flag checks also protect the interpretation of the base.",
    sourceMatcher: "downloaded_count = int(",
    steps: [
      {
        code: 'int(download_anchored_funnel_base["downloaded"].sum())',
        explanation:
          "With one row per download, each True stage flag contributes 1 and each False contributes 0. Summing the four columns therefore counts stage membership without counting repeated ride rows.",
      },
      {
        code: "download_anchored_base_validation = {...}",
        explanation:
          "Checks preserved download rows and unique keys, required column order, non-missing stage flags, and whether all base rows have the Download flag.",
      },
      {
        code: "stage_counts_match_accepted_results",
        explanation:
          "Reconciles Download, Signup, Request, and Completed totals with earlier accepted results. Agreement plus unique download keys is what lets later aggregation treat this table as the validated funnel base.",
      },
    ],
  },
  {
    id: "validate-funnel-nesting",
    overview:
      "Test whether each downstream customer state belongs inside its required preceding stage on the same base row.",
    why:
      "Decreasing aggregate counts do not prove nested membership. Row-level violations would undermine the proposed funnel even if the bars looked correct.",
    sourceMatcher: "funnel_nesting_validation = {",
    steps: [
      {
        code: 'completed_at_least_one_ride & ~requested_at_least_one_ride',
        explanation:
          "For each download row, `&` finds a reached downstream stage while `~` finds a missing required earlier stage; `.sum()` counts those contradictions. We need zero such rows before calling the counts a funnel: decreasing totals alone would not prove that the same entrants progressed in order.",
      },
      {
        code: "funnel_nesting_validation = {...}",
        explanation:
          "Repeats that check for Requested without Signup and Signup without Download. Together, the three counts test the full Download → Signup → Requested → Completed path at the download-row grain.",
      },
    ],
  },
  {
    id: "summarize-customer-stage-flags",
    overview:
      "Compress the download-level stage states into four ordered rows that can be compared and plotted.",
    why:
      "The summary changes grain from entrants to stages. Its counts must still describe the same customer-funnel base, not ride activity.",
    sourceMatcher: "stage_counts_by_flag = (",
    steps: [
      {
        code: "download_anchored_funnel_base[funnel_stage_columns].sum().astype(int)",
        explanation:
          "Selects four stage flags from a base with exactly one row per app download. In each column `True` contributes 1 and `False` contributes 0, so `.sum()` counts download-base rows that reached the stage, not ride records; `.astype(int)` stores whole-number counts.",
      },
      {
        code: "core_funnel_summary = pd.DataFrame(",
        explanation:
          "Pairs those counts with explicit labels in journey order. This is the grain change: many individual download-state rows become four aggregate rows, one per stage, ready for stage-to-stage comparisons.",
      },
    ],
    after: "One row per app download → four ordered aggregate stage rows; neither grain is a ride count.",
  },
  {
    id: "derive-funnel-percentages",
    overview:
      "Give each stage two reference populations: the stage immediately before it and the original Download population.",
    why:
      "The denominator changes the question. Download has no previous stage, so inventing its adjacent conversion would give a nonexistent comparison.",
    sourceMatcher:
      'core_funnel_summary["previous_stage_count"] = core_funnel_summary[',
    steps: [
      {
        code: 'core_funnel_summary["stage_count"].shift(1)',
        explanation:
          "`.shift(1)` places each count beside the next stage in this ordered table. That gives Signup the Download denominator, Requested the Signup denominator, and so on; Download correctly has no previous-stage denominator.",
      },
      {
        code: "stage_count / previous_stage_count * 100",
        explanation:
          "Dividing each stage by the stage immediately before it answers 'what share continued from that stage?' For example, Completed versus Requested measures the Request → Complete transition. `100 - percent_of_previous` expresses the complementary percentage that did not continue.",
      },
      {
        code: 'top_stage_count = core_funnel_summary.loc[0, "stage_count"]',
        explanation:
          "`.loc[0, ...]` takes Download's count as one fixed denominator for every Percent-of-Top value. This answers a different question from Percent of Previous: how much of the original download population reached each stage? Rounding only after calculation preserves the formula's precision.",
      },
    ],
    after:
      "Each stage row now carries its adjacent-stage percentage and its percentage of Download.",
  },
  {
    id: "validate-customer-funnel-summary",
    overview:
      "Check that the compact summary preserves the accepted counts, stage order and meanings of both percentage views.",
    why:
      "A tidy four-row table can still pair a count with the wrong denominator. These checks protect meaning, not just appearance.",
    sourceMatcher: "core_funnel_summary_validation = {",
    steps: [
      {
        code: "accepted_funnel_stage_counts = [",
        explanation:
          "Places the four already validated base-table counts in the same order as the summary. Comparing the two prevents a mislabeled or misordered aggregate from becoming an apparently credible funnel metric.",
      },
      {
        code: 'core_funnel_summary.loc[1:, "percent_of_previous"] + core_funnel_summary.loc[1:, "dropoff_from_previous"]',
        explanation:
          "`.loc[1:, ...]` skips Download, which has no preceding stage. For each real transition, its continued share plus its non-continuing share should equal 100%; this checks the two percentages use the same previous-stage denominator.",
      },
      {
        code: "core_funnel_summary_validation = {",
        explanation:
          "Checks row and column order, source-count reconciliation, non-increasing counts, the first row's missing previous-stage metrics, and the expected percentages. The dictionary exposes each check separately for inspection.",
      },
    ],
  },
  {
    id: "add-absolute-customer-dropoff",
    overview:
      "Add the number of entrants who did not continue at each transition beside the existing relative loss percentages.",
    why:
      "Absolute and percentage losses emphasize different things. The first stage has no preceding population from which to calculate a loss.",
    sourceMatcher: "core_funnel_metrics_before_dropoff_count = core_funnel_summary.copy()",
    steps: [
      {
        code: "core_funnel_metrics_before_dropoff_count = core_funnel_summary.copy()",
        explanation:
          "Saves an independent copy of the accepted summary so a later check can confirm that adding a column did not change existing metrics.",
      },
      {
        code: 'core_funnel_summary["previous_stage_count"] - core_funnel_summary["stage_count"]',
        explanation:
          "Subtracting the current stage from the previous stage gives the number of download-base entrants who did not continue across that transition. Unlike percentage drop-off, this is an absolute count; Download stays missing because nothing precedes it here.",
      },
    ],
  },
  {
    id: "find-weakest-transition",
    overview:
      "Use the calculated percentages to identify the weakest adjacent customer transition rather than choosing it from the chart by eye.",
    why:
      "Lowest conversion identifies the largest relative loss, not necessarily the largest absolute loss. Neither ranking establishes a cause.",
    sourceMatcher: "lowest_conversion_index = adjacent_stage_rows[",
    steps: [
      {
        code: 'previous_stage_labels = core_funnel_summary["stage"].shift(1)',
        explanation:
          "`.shift(1)` aligns each current stage with the stage immediately before it. The `.notna()` filter used for `adjacent_stage_rows` removes Download because it has no previous-stage denominator.",
      },
      {
        code: ".idxmin()\n.idxmax()",
        explanation:
          "`.idxmin()` selects the weakest adjacent transition by relative conversion, not by largest absolute loss; `.idxmax()` independently selects the largest percentage drop-off. Their row indices should agree because those percentages are complements.",
      },
      {
        code: "core_funnel_summary.loc[lowest_conversion_index, ...]",
        explanation:
          "`.loc[...]` reads the winning row's stage name and three metrics from the calculated summary. This produces an observed Request → Complete result without hard-coding the winner or claiming why people did not continue.",
      },
    ],
    after:
      "Calculated funnel metrics → one factual weakest-transition result, without a cause or recommendation.",
  },
  {
    id: "validate-customer-dropoff",
    overview:
      "Reconcile the new loss counts and selected transition while checking that the existing funnel metrics remain intact.",
    why:
      "This validates the consistency of the added summary. It does not supply an explanation for the observed customer loss.",
    sourceMatcher: "core_funnel_dropoff_validation = {",
    steps: [
      {
        code: 'pd.isna(core_funnel_summary.loc[0, "dropoff_count_from_previous"])',
        explanation:
          "Checks that Download has no invented absolute drop-off when no previous stage exists.",
      },
      {
        code: "lowest_conversion_index == highest_dropoff_index",
        explanation:
          "Confirms that the lowest adjacent conversion and highest percentage drop-off select the same transition.",
      },
      {
        code: "core_funnel_summary[...].equals(core_funnel_metrics_before_dropoff_count)",
        explanation:
          "Compares every pre-existing summary column with the saved copy, protecting accepted counts and percentages from this additive change.",
      },
    ],
  },
  {
    id: "plot-customer-funnel",
    overview:
      "Turn the validated four-stage customer summary into a visual comparison, keeping its two percentage meanings available on hover.",
    why:
      "The chart presents existing membership and counts. Formatting labels or tooltips must not create a different funnel definition.",
    sourceMatcher: "metrocar_customer_funnel = px.funnel(",
    steps: [
      {
        code: "core_funnel_plot = core_funnel_summary[[...]].copy()",
        explanation:
          "Copies only validated stage labels, counts, and percentages into a display view. The chart can shorten labels and format tooltips here without changing the analytical summary or counting any entrant again.",
      },
      {
        code: '\"N/A\" if pd.isna(value) else f\"{value:.2f}%\"',
        explanation:
          "The list comprehension turns each existing percentage into readable hover text. `pd.isna()` makes Download say `N/A` rather than showing an invalid number, because there is no stage before Download.",
      },
      {
        code: "metrocar_customer_funnel = px.funnel(..., custom_data=[...])\nmetrocar_customer_funnel.update_traces(..., hovertemplate=...)",
        explanation:
          "`px.funnel()` turns the already validated four summary rows into widths and visible counts; it does not decide who entered a stage. `custom_data` passes the two denominator-based percentages to `hovertemplate`, keeping the figure uncluttered while hover shows their distinct meanings. `<extra></extra>` removes an unneeded trace label.",
      },
    ],
  },
  {
    id: "join-acceptance-to-ride-activity",
    overview:
      "Add recorded acceptance to the ride-level activity table before asking what acceptance appears anywhere in each requester’s history.",
    why:
      "Correct same-ride matching is needed before reducing histories. The later user-level conclusion will still have a different grain.",
    sourceMatcher: "ride_activity_with_acceptance = ride_activity.merge(",
    steps: [
      {
        code: 'ride_activity.merge(..., on="ride_id", how="left", validate="one_to_one")',
        explanation:
          "The diagnostic starts with one row per requested `ride_id`. Matching acceptance fields on that key, rather than assuming two tables have the same row order, attaches the right timestamp to each ride. The LEFT JOIN keeps all requests and the one-to-one check rejects duplicates that would multiply the ride population.",
      },
      {
        code: 'ride_activity_with_acceptance["accept_ts"].notna()',
        explanation:
          "`.notna()` makes one True/False acceptance flag per ride using the established Q07 rule. We need that ride-level state before asking whether each requesting user ever had an accepted ride.",
      },
      {
        code: "ride_acceptance_join_validation = {",
        explanation:
          "Checks that the join still has all 385,477 distinct ride rows, matched each ride, and reproduces Q07's accepted-ride count. Without this check, a multiplied or mismatched join could distort the later user-history diagnostic.",
      },
    ],
    after: "One requested-ride row → one ride row with a recorded-acceptance flag.",
  },
  {
    id: "reduce-acceptance-and-completion-to-users",
    overview:
      "Summarize each requester’s ride history with two separate answers: whether any ride was accepted and whether any ride was completed.",
    why:
      "The two positive flags may come from different rides. They cannot establish an accepted-then-completed sequence on one particular ride.",
    sourceMatcher: "requesting_user_acceptance_completion_state = (",
    steps: [
      {
        code: 'ride_activity_with_acceptance.groupby("user_id", as_index=False)',
        explanation:
          "One requester may have several ride rows, but this diagnostic asks about requesters, not requests. `.groupby(\"user_id\")` gathers each user's ride history for reduction; `as_index=False` keeps `user_id` as an ordinary output column.",
      },
      {
        code: '.agg(accepted_at_least_one_ride=("accepted_ride", "any"), completed_at_least_one_ride=("completed_ride", "any"))',
        explanation:
          "For each user group, `any` returns True if at least one ride has the flag. This changes many ride rows into one user-state row with separate ever-accepted and ever-completed answers. The two `any` checks may refer to different rides; they must not be read as a same-ride sequence.",
      },
    ],
    after: "Many rides per requester → one row of user-history flags per requester.",
  },
  {
    id: "split-non-completing-requesters",
    overview:
      "Focus on requesters who never completed a ride, then describe whether acceptance appears anywhere in those users’ recorded histories.",
    why:
      "The shares describe this non-completing-user cohort. Acceptance elsewhere in a history does not explain a particular unfinished ride.",
    sourceMatcher: "non_completer_acceptance_split = pd.DataFrame(",
    steps: [
      {
        code: 'requesting_user_acceptance_completion_state["accepted_at_least_one_ride"].sum()',
        explanation:
          "After the `groupby`, each True contributes one requesting user with acceptance somewhere in their ride history. Summing before that reduction would answer a different question—the number of accepted ride records. Completion is counted at the same user grain.",
      },
      {
        code: '~requesting_user_acceptance_completion_state["completed_at_least_one_ride"]',
        explanation:
          "`~` selects the user rows whose ever-completed flag is False: the 6,173 requesters who reached Request but not Complete in the core customer funnel. Their acceptance flag then partitions that same cohort into two mutually exclusive user-history states.",
      },
      {
        code: 'non_completer_acceptance_split["user_count"] / non_completing_requester_count * 100',
        explanation:
          "Divides each subgroup count by all non-completing requesters, not by all ride requests or all users, so the shares describe this exact cohort and add to 100%. Acceptance here describes any recorded ride in a user's history, not a particular unfinished ride or a cause of non-completion.",
      },
    ],
    after: "One non-completing requester belongs to exactly one acceptance-history subgroup.",
  },
  {
    id: "validate-acceptance-history-diagnostic",
    overview:
      "Check that the acceptance-history split describes the same requester population and customer loss already established by the funnel.",
    why:
      "Reconciliation supports the descriptive split. It does not turn user-history flags into same-ride evidence or a causal explanation.",
    sourceMatcher: "acceptance_diagnostic_validation = {",
    steps: [
      {
        code: "completed_at_least_one_ride & ~accepted_at_least_one_ride",
        explanation:
          "The row-by-row AND finds user histories with completion but no acceptance anywhere. Zero such rows is needed before describing acceptance as a recorded state among these requesters; because the flags came from independent `any` checks, it still does not prove that acceptance preceded completion on the same ride.",
      },
      {
        code: "acceptance_diagnostic_validation = {",
        explanation:
          "Checks one unique row per requesting user, reconciles completed users and the 6,173 non-completers with the existing funnel, and confirms both acceptance subgroups cover that cohort. These safeguards keep a ride-level input from silently changing the user-level denominator or overstating what acceptance explains.",
      },
    ],
  },
  {
    id: "load-review-ride-links",
    overview:
      "Load the identifiers needed to ask which ride requests have review evidence, without bringing rating content into the funnel.",
    why:
      "A review record and a reviewed ride are different units. The link must be checked before reviews become ride-stage membership.",
    sourceMatcher: "reviews = pd.read_sql(",
    steps: [
      {
        code: "SELECT review_id, ride_id FROM reviews",
        explanation:
          "`pd.read_sql()` loads each review's own ID and its recorded `ride_id`, with no rating details. We need to test that this ride link is reliable before letting reviews define a ride-funnel stage.",
      },
    ],
    after: "Each row is a review record with a recorded ride link; the next cell validates that link.",
  },
  {
    id: "validate-review-ride-links",
    overview:
      "Check whether review records can be linked reliably to known ride requests, then prepare one lookup key per reviewed ride.",
    why:
      "Unique review IDs alone do not ensure unique ride matches. A review lookup must not multiply the requested-ride population.",
    sourceMatcher: "review_relationship_validation = {",
    steps: [
      {
        code: 'reviews["review_id"].nunique()\nreviews["ride_id"].nunique()',
        explanation:
          "`.nunique()` counts distinct non-missing values separately for review IDs and ride IDs. A unique `review_id` proves only unique review records; checking `ride_id` too asks whether those records refer to different rides. Missing and repeated IDs are also counted before treating reviews as ride membership.",
      },
      {
        code: 'reviewed_ride_ids = reviews[["ride_id"]].drop_duplicates()',
        explanation:
          "`.drop_duplicates()` makes a one-row-per-reviewed-ride lookup even though this snapshot has no repeated ride IDs. Joining raw review rows could multiply a ride if multiple reviews appeared; the reduced lookup preserves the requested-ride grain.",
      },
      {
        code: '~reviewed_ride_ids["ride_id"].isin(ride_requests["ride_id"])',
        explanation:
          "`.isin()` checks each reviewed ride against the known request keys; `~` selects any that cannot be anchored to a request. A zero count supports adding review state to the ride-level base rather than silently losing unknown reviews in a LEFT JOIN.",
      },
    ],
  },
  {
    id: "build-strict-ride-path",
    overview:
      "Attach payment and review states to every requested ride, keeping all reviewed rides distinct from the strict Reviewed stage.",
    why:
      "Strict Reviewed requires both review and Approved payment on the same ride. Reviews outside that path remain evidence, not automatic errors.",
    sourceMatcher:
      'ride_level_stage_state["reviewed_in_approved_payment_path"] = (',
    steps: [
      {
        code: 'successful_payments[["ride_id"]].drop_duplicates()',
        explanation:
          "The Paid and Reviewed stages need yes/no membership per ride, not transaction or review rows. `.drop_duplicates()` makes one Approved-payment lookup row per `ride_id`, and the validated review lookup is also unique, preventing either source from multiplying the requested-ride base.",
      },
      {
        code: '.merge(..., how="left", validate="one_to_one")',
        explanation:
          "The table starts from every requested `ride_id` and renames the already accepted `completed_ride` flag to `finished`; no completion rule changes. Both LEFT JOINs keep the Request population, `validate=\"one_to_one\"` rejects duplicate keys, and `.fillna(False)` means no matched Paid or Reviewed record for that ride.",
      },
      {
        code: "reviewed_in_approved_payment_path = reviewed & approved_payment",
        explanation:
          "The row-by-row `&` includes a ride in strict Reviewed only when that same `ride_id` is both reviewed and Approved-paid. All 156,211 reviewed rides remain in the separate `reviewed` flag; 7,747 outside Paid are documented, not labeled errors or forced into the strict path.",
      },
    ],
    after:
      "One requested-ride row → explicit ride-stage states, with all reviews kept separate from strict Reviewed membership.",
  },
  {
    id: "summarize-strict-ride-funnel",
    overview:
      "Summarize the requested rides along the strict path, while accounting separately for reviews outside Approved payment.",
    why:
      "Reviewed / Paid must use the reviewed-and-paid intersection. Using every reviewed ride would describe a different, non-nested path.",
    sourceMatcher: "ride_funnel_summary = pd.DataFrame(",
    steps: [
      {
        code: 'ride_level_stage_state["reviewed"] & ~ride_level_stage_state["approved_payment"]',
        explanation:
          "`& ~` selects rides with a review but no Approved payment. That count explains why all reviewed rides cannot simply follow Paid in a strict funnel; separate comparisons test Finished, Paid, and strict Reviewed nesting on the same `ride_id` rows.",
      },
      {
        code: 'ride_level_stage_state["reviewed_in_approved_payment_path"].sum()',
        explanation:
          "Summing this Boolean intersection counts rides that reached Reviewed within the Approved-payment path. The summary uses that 148,464-ride subset, while the 7,747 other reviewed rides stay visible outside the strict stage rather than disappearing from the analysis.",
      },
      {
        code: 'ride_funnel_summary["stage_count"].shift(1)\nride_funnel_summary["stage_count"] / ride_funnel_summary["previous_stage_count"] * 100',
        explanation:
          "`.shift(1)` gives each ride stage its adjacent previous-stage denominator, so Reviewed / Paid means the share of Approved-paid rides in the strict Reviewed subset. A separate division by Request answers how much of the original ride population reached each stage. Neither percentage creates new membership.",
      },
    ],
    after: "One row per requested ride → four ordered strict stage counts, with outside-path reviews reported separately.",
  },
  {
    id: "validate-strict-ride-funnel",
    overview:
      "Check that the ride summary preserves unique rides, established totals and required stage relationships without losing outside-path review evidence.",
    why:
      "Nested counts must reflect the same rides. Reconciliation also keeps the strict Reviewed definition from erasing other recorded reviews.",
    sourceMatcher: "ride_funnel_validation = {",
    steps: [
      {
        code: 'not ride_level_stage_state["ride_id"].duplicated().any()',
        explanation:
          "`.duplicated().any()` finds repeated ride keys, and `not` requires none. The one-row-per-`ride_id` grain must survive both joins; otherwise summing stage flags could count a ride twice. The accepted Request, Finished, and Paid counts are reconciled separately.",
      },
      {
        code: "finished_outside_requested == 0 and paid_outside_finished == 0 and strict_reviewed_outside_paid == 0",
        explanation:
          "Requires zero rides in each downstream stage without its required preceding stage. Only then can Request → Finished → Paid → strict Reviewed be called a nested ride path; merely seeing smaller chart bars would not prove same-ride progression.",
      },
      {
        code: "reviewed_outside_paid + reviewed_with_approved_payment == distinct_reviewed_ride_ids",
        explanation:
          "Adds the outside-Paid and within-Paid review groups back to all distinct reviewed ride IDs. This confirms that defining the strict Reviewed stage did not make the 7,747 outside-path reviews vanish from the evidence.",
      },
    ],
  },
  {
    id: "plot-and-check-ride-funnel",
    overview:
      "Present the strict ride-stage summary as a funnel, then compare the figure’s labels and counts with its analytical input.",
    why:
      "A rendering check protects presentation fidelity. It does not independently validate the source data or change strict Reviewed membership.",
    sourceMatcher: "ride_funnel_chart_validation = {",
    steps: [
      {
        code: "ride_funnel_plot = ride_funnel_summary[[...]].copy()",
        explanation:
          "Copies the validated one-row-per-stage table for presentation only. Formatting its percentages as hover strings, including `N/A` for Request's nonexistent previous stage, leaves the ride-state calculations and strict counts untouched.",
      },
      {
        code: "metrocar_ride_funnel = px.funnel(...)\nmetrocar_ride_funnel.update_traces(...)",
        explanation:
          "`px.funnel()` draws widths and visible counts from the four validated ride-stage rows, not raw review or payment rows. `custom_data` and `hovertemplate` show Percent of Previous and Percent of Top on hover while preserving the strict Reviewed definition and keeping the chart itself simple.",
      },
      {
        code: "ride_funnel_chart_validation = {",
        explanation:
          "Checks that Plotly produced one funnel trace and that its title, stage order, and counts still match `ride_funnel_summary`. This guards against a presentation change silently telling a different story from the validated analysis.",
      },
    ],
  },
  {
    id: "display-ride-funnel",
    overview:
      "Show the ride funnel that the preceding cell already constructed and checked.",
    why:
      "Displaying the stored figure adds no new calculation or validation; its meaning comes from the earlier definitions and checks.",
    sourceMatcher: "metrocar_ride_funnel",
    exactMatch: true,
    steps: [
      {
        code: "metrocar_ride_funnel",
        explanation:
          "Displays the figure created and checked in the previous cell. This cell performs no new calculation.",
      },
    ],
  },
  {
    id: "profile-analytical-inputs",
    overview:
      "Before reading a blank as a customer drop-off, inspect the selected fields and keep each table's own row population visible.",
    why:
      "Complete fields can still contain incorrect values. An absent later event needs a different interpretation from a missing key, and this profile covers selected extracts rather than the entire database.",
    sourceMatcher: "eda_input_tables = {",
    steps: [
      {
        code: 'ride_requests.merge(ride_acceptance_fields, on="ride_id", how="left", validate="one_to_one")',
        explanation:
          "The two left joins put request, acceptance and completion fields back on the same `ride_id` row. One-to-one validation and the row-count assertion prevent the profile from gaining extra requests or losing unfinished ones.",
      },
      {
        code: 'missing_count = int(frame[column].isna().sum())',
        explanation:
          "The outer loop selects one existing table extract; the inner loop examines one of its fields. `isna()` marks absence and `sum()` counts it. Dividing by that table's `len(frame)` keeps download, signup, request and transaction denominators separate.",
      },
      {
        code: 'input_field_profile["missing_count"].sum()',
        explanation:
          "The final check excludes the four later-event fields before requiring zero missing inputs. Those event fields remain in the profile; excluding them from this completeness assertion does not delete their records or invent events.",
      },
    ],
    after: "Four analytical extracts → 15 field-level summaries, each retaining its source table and denominator.",
  },
  {
    id: "plot-recorded-event-coverage",
    overview:
      "Compare how often each timestamp is recorded across the same complete request population.",
    why:
      "The 0–100% scale makes coverage comparable. “Not recorded” is an evidence label; it does not identify why an event is absent.",
    sourceMatcher: "metrocar_event_coverage = px.bar(",
    steps: [
      {
        code: '.melt(id_vars="field", var_name="recording_state", value_name="request_count")',
        explanation:
          "`melt()` turns each timestamp's recorded and unrecorded counts into two labeled rows. Both shares divide by all 385,477 requests, so the paired segments account for the same population.",
      },
      {
        code: 'px.bar(event_coverage, x="share_percent", y="field", color="recording_state")',
        explanation:
          "A stacked bar shows each field against a common percentage scale. Teal marks recorded timestamps, peach marks absence, and hover preserves the underlying request counts.",
      },
    ],
  },
  {
    id: "count-recorded-event-patterns",
    overview:
      "Check which acceptance, pickup and drop-off records occur together on the same requested ride.",
    why:
      "These are same-request recording patterns. They support checking the completion definition, while leaving data-capture completeness and the causes of absent events unresolved.",
    sourceMatcher: "recorded_event_state = eda_ride_fields[",
    steps: [
      {
        code: '["accept_ts", "pickup_ts", "dropoff_ts"]',
        explanation:
          "`notna()` makes three presence flags per request without filling any timestamps. Grouping by all three flags and calling `.size()` counts each observed combination once.",
      },
      {
        code: 'event_pattern_summary["pattern"] = pattern_labels',
        explanation:
          "The small label loop spells out the events recorded in each group. Shares use all requests; the assertions reconnect the groups to the earlier acceptance and completion totals and expose partial pickup/drop-off pairs.",
      },
    ],
    after: "One row per request → one count per observed timestamp-presence pattern.",
  },
  {
    id: "plot-recorded-event-patterns",
    overview:
      "Make the three observed request patterns easy to compare without drawing hundreds of thousands of individual rows.",
    why:
      "Counts describe the recorded population. The Accepted-only group is not a cancellation diagnosis, and request counts cannot be substituted for lost-user counts.",
    sourceMatcher: "metrocar_event_patterns = px.bar(",
    steps: [
      {
        code: 'px.bar(event_pattern_summary, x="request_count", y="pattern", orientation="h")',
        explanation:
          "Each bar takes one verified pattern count from the summary. A shared zero baseline preserves relative size; direct count labels and percentage context make the comparison readable without inferring events between timestamps.",
      },
    ],
  },
  {
    id: "plot-non-completer-acceptance-history",
    overview:
      "Show the contrast that tests whether most non-completing users never received any recorded acceptance.",
    why:
      "Both shares describe the same 6,173 users. Acceptance somewhere in a user's history does not establish what happened on a particular unfinished ride or explain non-completion.",
    sourceMatcher: "metrocar_acceptance_history = px.bar(",
    steps: [
      {
        code: "acceptance_history_plot = non_completer_acceptance_split.copy()",
        explanation:
          "The copy reuses the validated two-group user-history split. Short labels clarify the comparison while the original user counts and membership rules stay intact.",
      },
      {
        code: 'orientation="h", barmode="stack"',
        explanation:
          "The two segments partition one 100% user cohort. Their 6,045 and 128 users reconcile to all non-completers; the visual emphasizes that “never accepted” describes a small minority of this group.",
      },
    ],
  },
];
