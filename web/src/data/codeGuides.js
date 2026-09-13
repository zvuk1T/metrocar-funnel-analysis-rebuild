// Frontend-only explanations for the executable Python cells.
// Each source matcher identifies exactly one code cell at build time.
export const codeGuides = [
  {
    id: "open-database-connection",
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
    id: "preview-download-rows",
    sourceMatcher: "app_downloads_preview = pd.read_sql(",
    steps: [
      {
        code: 'pd.read_sql("SELECT * FROM app_downloads LIMIT 5", connection)',
        explanation:
          "`read_sql()` runs the query through the open connection and returns a pandas DataFrame. `LIMIT 5` restricts this preview to five rows; it does not test the whole table.",
      },
    ],
  },
  {
    id: "list-download-columns",
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
];
