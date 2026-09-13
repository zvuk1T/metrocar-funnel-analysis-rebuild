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
          "`sa.inspect()` creates a schema inspector for this engine. `get_table_names()` returns the database's table-name list, and the final expression displays it.",
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
          "`.columns` contains the preview DataFrame's column labels; `.tolist()` turns them into an ordinary Python list for display.",
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
          "Counts distinct non-missing `app_download_key` values. Comparing that count with `len(app_download_keys)` checks whether every table row contributes a unique key; equality also rules out missing keys here because `.nunique()` excludes them.",
      },
      {
        code: ".duplicated().any()",
        explanation:
          "`.duplicated()` marks repeated keys after their first occurrence, and `.any()` reduces those row-level flags to one Boolean answer: did any duplicate key occur?",
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
          "Assigns the previously checked full-table row count to the named download result. This is an alias, not a new count or filter.",
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
          "Converts the preview DataFrame's column labels to a regular Python list so they can be read directly.",
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
          "`.nunique()` counts distinct non-missing user IDs, and `.duplicated().any()` checks for a repeated user ID. The code repeats both checks for `session_id` and compares the counts with all signup rows.",
      },
      {
        code: "signups_grain_check = {...}",
        explanation:
          "Collects row count and both identifier checks in one displayed result. The two identifiers are reported separately because uniqueness as a signup key and usefulness as a download link are different claims.",
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
          "Loads the ride key, requester key, and request timestamp from every request row. `.head()` then displays only the first few loaded rows.",
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
          "`len()` counts all request rows, while `.nunique()` counts distinct non-missing ride IDs. Comparing them is part of checking whether one row represents one keyed request.",
      },
      {
        code: '.duplicated().any()\nride_requests["request_ts"].isna().sum()',
        explanation:
          "The duplicate check detects repeated `ride_id` values. `.isna().sum()` counts missing request timestamps so keyed rows with incomplete request evidence stay visible.",
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
          "Loads one ride identifier with its pickup and drop-off timestamps. These fields let the next cell evaluate completion on each ride row.",
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
          "Creates one Boolean value per ride row: `True` when the pickup timestamp is present and `False` when it is missing. The same operation creates the aligned drop-off mask.",
      },
      {
        code: "completed_ride_mask = pickup_timestamp_present & dropoff_timestamp_present",
        explanation:
          "The `&` operator performs a row-by-row AND, so a ride is marked complete only when both timestamp masks are `True`. Summing this Boolean mask counts completed ride rows because `True` contributes 1.",
      },
      {
        code: "pickup_timestamp_present & ~dropoff_timestamp_present",
        explanation:
          "The `~` operator reverses the drop-off mask, isolating pickup-only rows; the mirrored expression checks drop-off-only rows. Summing both masks keeps partial timestamp exceptions visible without changing the completion definition.",
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
          "Counts each non-missing requester key once, even when that `user_id` appears on several ride rows. The result has user-key grain, unlike the ride-request count.",
      },
      {
        code: 'ride_requests["user_id"].isna().sum()',
        explanation:
          "Counts missing requester IDs separately because `.nunique()` excludes them; such rows cannot later match a signup by `user_id`.",
      },
    ],
    after: "Many ride-request rows → a distinct-`user_id` requester count, with missing keys exposed.",
  },
  {
    id: "calculate-valid-ride-duration",
    sourceMatcher: 'valid_duration_rides["duration_minutes"] = (',
    steps: [
      {
        code: "valid_duration_mask = completed_ride_mask & (dropoff_ts >= pickup_ts)",
        explanation:
          "Combines the existing completion rule with a chronological-order check, so only rides with both timestamps and drop-off at or after pickup enter the duration calculation. The later `<` comparison counts completed rows rejected by this rule.",
      },
      {
        code: '.loc[valid_duration_mask, ["ride_id", "pickup_ts", "dropoff_ts"]].copy()',
        explanation:
          "`.loc` selects only qualifying rows and the three needed columns. `.copy()` creates an independent DataFrame before `duration_minutes` is added, leaving the source timestamp table unchanged.",
      },
      {
        code: "(dropoff_ts - pickup_ts).dt.total_seconds() / 60",
        explanation:
          "Subtracting the aligned datetime columns produces one timedelta per valid ride. `.dt.total_seconds() / 60` converts those durations to numeric minutes, after which `.mean()` calculates the average and `round(..., 2)` formats the final value.",
      },
    ],
    after:
      "One valid completed-ride row → one duration in minutes; the mean summarizes that validated subset.",
  },
  {
    id: "load-acceptance-fields",
    sourceMatcher: "ride_acceptance_fields = pd.read_sql(",
    steps: [
      {
        code: "SELECT ride_id, driver_id, accept_ts FROM ride_requests",
        explanation:
          "Loads the ride key and two possible acceptance signals for every request. `.head()` displays a small sample of the loaded DataFrame.",
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
          "Creates one Boolean flag per ride for a present `accept_ts`, and another for a present `driver_id`. The flags remain aligned to the same ride rows.",
      },
      {
        code: "(acceptance_timestamp_present != driver_id_present).sum()",
        explanation:
          "`!=` flags rides where the two signals disagree; summing counts those mismatches. Separately summing the timestamp flag counts rides marked accepted by `accept_ts`.",
      },
    ],
    after: "Ride-level acceptance count and signal disagreement are displayed separately.",
  },
  {
    id: "load-transactions",
    sourceMatcher: "transactions = pd.read_sql(",
    steps: [
      {
        code: "transactions = pd.read_sql(..., connection)",
        explanation:
          "Runs the selected SQL query and loads its transaction columns into a pandas DataFrame. The next cells check its keys before treating rows as distinct transactions or rides.",
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
          "Compares table rows with distinct, non-missing transaction IDs to check the transaction key.",
      },
      {
        code: 'transactions["transaction_id"].duplicated().any()',
        explanation:
          "Flags whether a transaction ID repeats. The same distinct-count and duplicate checks are applied to `ride_id` to test the observed transaction-to-ride relationship.",
      },
      {
        code: "transaction_grain_check = {...}",
        explanation:
          "Collects the row, distinct-key, and duplicate checks in one inspectable result before payment rows are counted.",
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
          "Counts every observed status label. `dropna=False` keeps missing statuses visible instead of silently excluding them.",
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
          "Selects Approved rows before counting or adding amounts, so declined transactions cannot enter either measure.",
      },
      {
        code: 'successful_payments["purchase_amount_usd"].isna().sum()',
        explanation:
          "Counts missing amounts in the selected rows. This matters because pandas `.sum()` otherwise skips missing values.",
      },
      {
        code: 'round(float(successful_payments["purchase_amount_usd"].sum()), 2)',
        explanation:
          "Adds the selected purchase amounts and rounds the dollar total to cents; the summary also records the number of selected rows.",
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
          "Loads the download key and its platform as a lookup table for the request-level joins. `.head()` previews the loaded fields.",
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
          "`how=\"left\"` keeps every ride request while adding its signup `session_id`. `validate=\"many_to_one\"` requires each requesting user to match at most one signup row, and the indicator records whether the relationship matched.",
      },
      {
        code: '.merge(..., left_on="session_id", right_on="app_download_key", validate="many_to_one")',
        explanation:
          "The second join follows the signup session to its download record and platform. Requests remain on the left, while the many-to-one check prevents duplicate download keys from multiplying ride rows.",
      },
      {
        code: "platform_join_check = {...}",
        explanation:
          "This validation compares row counts after both joins, recounts distinct `ride_id` values, and uses the two merge indicators plus the missing-platform count to expose unmatched relationships.",
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
          "Counts request rows by their joined platform. Keeping missing labels ensures the grouped counts can still reconcile to all requests.",
      },
      {
        code: '.rename_axis("platform").reset_index(name="ride_requests")',
        explanation:
          "Converts the platform labels and counts into named DataFrame columns, one row per platform label.",
      },
      {
        code: '100 * ride_requests_by_platform["ride_requests"] / total_ride_requests',
        explanation:
          "Divides each platform's request count by the original total request count, then rounds its percentage to two decimals.",
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
          "The preserved signup rows form the denominator. Summing the Boolean flag counts signed-up users who requested at least one ride.",
      },
      {
        code: "signup_dropoff_denominator - registered_users_requesting_rides",
        explanation:
          "Subtracts those who requested from all signups to count signups that did not reach Request.",
      },
      {
        code: "100 * signup_dropoff_numerator / signup_dropoff_denominator",
        explanation:
          "Expresses that loss as a percentage of the same signup population; the result is rounded to two decimals.",
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
          "Produces one match flag per signup row by checking its `session_id` against all download keys, without joining or multiplying rows.",
      },
      {
        code: "signup_has_download_match.sum()\n(~signup_has_download_match).sum()",
        explanation:
          "Counts matched flags and their inverse over the identical signup population, so the two counts partition all signup records.",
      },
      {
        code: "signup_download_integrity = pd.DataFrame([...])",
        explanation:
          "Puts the total, matched, and unmatched counts into one row for the relationship-integrity check.",
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
          "Attaches timestamps by `ride_id` while retaining each request row. The validation rejects duplicate ride keys that would multiply rows, and the indicator exposes missing matches.",
      },
      {
        code: 'ride_activity["pickup_ts"].notna() & ride_activity["dropoff_ts"].notna()',
        explanation:
          "Creates a ride-level completion flag that is `True` only when both timestamps exist on that ride; every preserved row is already a request.",
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
          "This gathers all ride rows belonging to the same requester. `as_index=False` keeps `user_id` as a regular column so the resulting user-state table remains straightforward to validate and join.",
      },
      {
        code: '.agg(..., "any")',
        explanation:
          "For each user, `\"any\"` returns `True` when the corresponding ride-level flag was true at least once. Named aggregation produces the two explicit output columns: `requested_at_least_one_ride` and `completed_at_least_one_ride`.",
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
          "Checks the one-row-per-user grain, requested flags, missing user IDs, and the completion-without-request count together.",
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
          "Missing stage values belong to signups absent from the requesting-user table, so they become `False` for both Request and Complete. `.astype(bool)` leaves the two stage columns as explicit Boolean state rather than mixed Boolean and missing values.",
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
          "Keeps every download as one base row and attaches its signup and reduced user-stage state when available. The one-to-one check guards against row multiplication.",
      },
      {
        code: 'downloads_with_signup_state["_signup_match"] == "both"',
        explanation:
          "A matched signup becomes `signed_up=True`; every base row has `downloaded=True`. Missing later-stage flags become `False` for downloads without a matching signup.",
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
          "Summing each Boolean stage column counts downloads that reached that stage, once per download-base row.",
      },
      {
        code: "download_anchored_base_validation = {...}",
        explanation:
          "Checks preserved download rows and unique keys, required column order, non-missing stage flags, and whether all base rows have the Download flag.",
      },
      {
        code: "stage_counts_match_accepted_results",
        explanation:
          "Compares the four newly counted stage memberships with their previously established counts before using this table as the funnel base.",
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
          "A row is flagged only when it reached Completed but not the required Requested stage. `.sum()` counts these violations; the other two comparisons test Requested versus Signup and Signup versus Download.",
      },
      {
        code: "funnel_nesting_validation = {...}",
        explanation:
          "Collects all three exception counts before treating the flags as a nested funnel.",
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
          "Selects the four Boolean stage flags from the one-row-per-download base. Summing each column counts `True` rows, and `.astype(int)` makes the stage counts explicit integers.",
      },
      {
        code: "core_funnel_summary = pd.DataFrame(",
        explanation:
          "Pairs each count with its label in the declared stage order. The output changes grain from one row per download to one row per funnel stage.",
      },
    ],
    after: "One download-state row per entrant → four ordered aggregate stage rows.",
  },
  {
    id: "derive-funnel-percentages",
    sourceMatcher:
      'core_funnel_summary["previous_stage_count"] = core_funnel_summary[',
    steps: [
      {
        code: 'core_funnel_summary["stage_count"].shift(1)',
        explanation:
          "`.shift(1)` moves each stage count down beside the next ordered stage, creating its previous-stage denominator. The Download row remains missing because no stage precedes it.",
      },
      {
        code: "stage_count / previous_stage_count * 100",
        explanation:
          "This row-aligned division calculates Percent of Previous for every downstream stage. `100 - percent_of_previous` then expresses the same transition as percentage drop-off.",
      },
      {
        code: 'top_stage_count = core_funnel_summary.loc[0, "stage_count"]',
        explanation:
          "The first ordered row is Download, so its count becomes the fixed Percent-of-Top denominator for all four rows. The percentage columns are calculated first and rounded to two decimals only after all formulas are complete.",
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
          "Collects the already validated stage counts in funnel order so the new summary can be compared with its source values.",
      },
      {
        code: 'core_funnel_summary.loc[1:, "percent_of_previous"] + core_funnel_summary.loc[1:, "dropoff_from_previous"]',
        explanation:
          "Adds each downstream conversion percentage to its complementary drop-off percentage; each pair should total 100% after rounding.",
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
          "Subtracts each current count from the preceding stage count to get an absolute number of entrants who did not continue. Download remains missing because it has no preceding stage.",
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
          "`.idxmin()` finds the row with the lowest Percent of Previous, while `.idxmax()` finds the row with the highest percentage drop-off. Recording both indices allows the next validation to confirm that the complementary metrics identify the same transition.",
      },
      {
        code: "core_funnel_summary.loc[lowest_conversion_index, ...]",
        explanation:
          "`.loc[...]` retrieves the selected row's stage label, conversion percentage, percentage drop-off, and absolute drop-off count. The transition and its metrics therefore come from the calculated summary rather than a hard-coded winner.",
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
          "This creates a separate plotting view from the validated stage, count, and percentage columns. The following assignments can add concise labels and hover strings without changing `core_funnel_summary` or recalculating membership.",
      },
      {
        code: '\"N/A\" if pd.isna(value) else f\"{value:.2f}%\"',
        explanation:
          "The list comprehension turns Percent of Previous into reader-friendly hover text. Download becomes `N/A` because it has no previous stage, while downstream percentages are formatted to two decimals.",
      },
      {
        code: "metrocar_customer_funnel = px.funnel(..., custom_data=[...])\nmetrocar_customer_funnel.update_traces(..., hovertemplate=...)",
        explanation:
          "`px.funnel()` draws the validated counts in display-stage order. `custom_data` carries both percentage strings without adding marks, and `hovertemplate` places them in the tooltip while `<extra></extra>` removes Plotly's extra trace label.",
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
          "Attaches each ride's acceptance timestamp while keeping every requested ride. The one-to-one check rejects duplicate `ride_id` values that could multiply rows.",
      },
      {
        code: 'ride_activity_with_acceptance["accept_ts"].notna()',
        explanation:
          "Creates a ride-level acceptance flag from the recorded timestamp, using the existing Q07 rule.",
      },
      {
        code: "ride_acceptance_join_validation = {",
        explanation:
          "Checks ride-row preservation, distinct ride IDs, join matches, and reconciliation of the accepted-ride count to Q07 before aggregating to users.",
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
          "Groups all ride rows for each requesting `user_id` while retaining that key as a regular output column.",
      },
      {
        code: '.agg(accepted_at_least_one_ride=("accepted_ride", "any"), completed_at_least_one_ride=("completed_ride", "any"))',
        explanation:
          "Independently checks whether each user has any accepted ride and any completed ride across their history. These flags do not assert that acceptance and completion occurred on the same ride.",
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
          "Sums Boolean flags only after reducing to one row per user, so this counts requesting users with an accepted ride rather than accepted ride records. Completion is counted at the same grain.",
      },
      {
        code: '~requesting_user_acceptance_completion_state["completed_at_least_one_ride"]',
        explanation:
          "Selects requesters with no completed ride anywhere in their history, then divides them by whether they ever had a recorded accepted ride.",
      },
      {
        code: 'non_completer_acceptance_split["user_count"] / non_completing_requester_count * 100',
        explanation:
          "Uses all non-completing requesters as the common denominator for both subgroup shares. The acceptance flag describes user history, not acceptance of a particular unfinished ride.",
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
          "Counts users with some completed ride but no recorded accepted ride anywhere in their history. A zero result supports the user-history relationship; it does not prove same-ride acceptance.",
      },
      {
        code: "acceptance_diagnostic_validation = {",
        explanation:
          "Checks unique one-row-per-requester grain, accepted and completed user counts, reconciliation of non-completers to the core drop-off, and whether the two subgroup counts and shares cover that cohort.",
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
          "Loads only each review's identifier and linked ride identifier. This step examines review-to-ride linkage, not ratings or review content.",
      },
    ],
    after: "Each returned row is a review record; `ride_id` identifies its associated ride.",
  },
  {
    id: "validate-review-ride-links",
    sourceMatcher: "review_relationship_validation = {",
    steps: [
      {
        code: 'reviews["review_id"].nunique()\nreviews["ride_id"].nunique()',
        explanation:
          "These are separate distinct-count checks: unique review records do not by themselves establish that a ride has only one review. The code also checks missing and repeated identifiers.",
      },
      {
        code: 'reviewed_ride_ids = reviews[["ride_id"]].drop_duplicates()',
        explanation:
          "Builds a one-row-per-reviewed-ride lookup before joining, preventing repeated review records from multiplying ride rows.",
      },
      {
        code: '~reviewed_ride_ids["ride_id"].isin(ride_requests["ride_id"])',
        explanation:
          "Flags reviewed ride IDs absent from the requested-ride base. The validation dictionary records this linkage check alongside the identifier checks.",
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
          "Approved-payment rows are reduced to one lookup row per `ride_id` so repeated transaction records cannot multiply the ride base. The review lookup already starts from distinct, validated ride IDs; added Boolean columns mark membership in each lookup.",
      },
      {
        code: '.merge(..., how="left", validate="one_to_one")',
        explanation:
          "The state table starts from every row in `ride_activity` and reuses `completed_ride` under the funnel name `finished`. Both LEFT JOINs preserve the one-row-per-`ride_id` request denominator, while `validate=\"one_to_one\"` rejects row multiplication and `.fillna(False)` marks absent downstream matches explicitly.",
      },
      {
        code: "reviewed_in_approved_payment_path = reviewed & approved_payment",
        explanation:
          "The Boolean intersection marks strict Reviewed only when the same ride is both reviewed and in the Approved-payment path. The separate all-review flag remains in the table, so the following analysis can still report the 7,747 reviewed rides outside Paid.",
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
          "Counts reviewed rides outside Paid as a separate observed exception. The other Boolean comparisons check downstream stages against their required upstream stages before the strict path is summarized.",
      },
      {
        code: 'ride_level_stage_state["reviewed_in_approved_payment_path"].sum()',
        explanation:
          "Uses only the reviewed-and-approved intersection for strict Reviewed. All reviewed rides remain recorded separately; the raw review count is not inserted after Paid.",
      },
      {
        code: 'ride_funnel_summary["stage_count"].shift(1)\nride_funnel_summary["stage_count"] / ride_funnel_summary["previous_stage_count"] * 100',
        explanation:
          "Aligns each ride-stage count with its preceding count for Percent of Previous. A separate division by the Request count produces Percent of Top; these summarize validated ride states rather than redefine membership.",
      },
    ],
    after: "Ride-level state → four ordered strict ride-stage counts.",
  },
  {
    id: "validate-strict-ride-funnel",
    sourceMatcher: "ride_funnel_validation = {",
    steps: [
      {
        code: 'not ride_level_stage_state["ride_id"].duplicated().any()',
        explanation:
          "Checks that a requested ride appears only once in the ride-level state before stage counts are trusted. The same dictionary compares Request, Finished, and Paid with their accepted counts.",
      },
      {
        code: "finished_outside_requested == 0 and paid_outside_finished == 0 and strict_reviewed_outside_paid == 0",
        explanation:
          "Checks the adjacent subset relationships needed for the strict Request → Finished → Paid → Reviewed path. A non-increasing chart alone would not prove these relationships.",
      },
      {
        code: "reviewed_outside_paid + reviewed_with_approved_payment == distinct_reviewed_ride_ids",
        explanation:
          "Reconciles all reviewed rides across outside-Paid and within-Paid groups, preserving exceptions that cannot appear as the strict final stage.",
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
          "Creates a plotting copy of validated stage counts and percentages. Display strings make the first stage's absent previous-stage percentage read `N/A`.",
      },
      {
        code: "metrocar_ride_funnel = px.funnel(...)\nmetrocar_ride_funnel.update_traces(...)",
        explanation:
          "`px.funnel()` displays the existing counts; `custom_data` and `hovertemplate` add denominator-based percentages to hover without recalculating ride-stage membership.",
      },
      {
        code: "ride_funnel_chart_validation = {",
        explanation:
          "Compares the figure's trace type, title, labels, and plotted counts with the validated summary to catch presentation drift.",
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
