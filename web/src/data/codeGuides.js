// Optional frontend-only refreshers for selected non-obvious Python cells.
// Each source matcher must identify exactly one code cell at build time.
export const codeGuides = [
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
];
