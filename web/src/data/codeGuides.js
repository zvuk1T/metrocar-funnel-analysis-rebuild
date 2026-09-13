// Optional frontend-only refreshers for selected non-obvious Python cells.
// Each source matcher must identify exactly one code cell at build time.
export const codeGuides = [
  {
    id: "validate-download-key",
    sourceMatcher:
      'duplicate_app_download_keys_exist = app_download_keys[',
    walkthrough: {
      context:
        "The earlier five-row preview confirmed database access and the table structure, but it could not establish the full `app_downloads` grain.",
      goal:
        "Test whether `app_download_key` uniquely identifies one download record before downloads are used as the customer-funnel base.",
      action:
        "Load every download key, compare the total row count with the distinct-key count, explicitly check for duplicates, and keep the three checks together in one validation result.",
      result:
        "The table has 23,608 rows and 23,608 distinct keys, with no duplicates. This supports one download record per `app_download_key` for the next count; it does not establish one person or device per key.",
    },
    items: [
      {
        construct: ".nunique()",
        what: "Counts distinct non-missing values in a Series.",
        whyHere: "Comparing distinct download keys with total rows helps test the proposed one-row-per-key grain.",
        output: "An integer containing the distinct key count.",
      },
      {
        construct: ".duplicated().any()",
        what: "Marks repeated values and then asks whether at least one duplicate exists.",
        whyHere: "It gives a direct Boolean warning if the candidate key repeats anywhere in the full table.",
        output: "True when any duplicate key exists; otherwise False.",
      },
    ],
  },
  {
    id: "completed-ride-mask",
    sourceMatcher:
      "completed_ride_mask = pickup_timestamp_present & dropoff_timestamp_present",
    walkthrough: {
      context:
        "The preceding step established 385,477 unique ride-request rows at `ride_id` grain. The source has no separate completion flag, so completion must be derived from the accepted timestamp definition.",
      goal:
        "Identify completed ride records while preserving one row per `ride_id` and check for inconsistent partial timestamp states.",
      action:
        "Create row-aligned masks for pickup and drop-off presence, combine them with AND to define completion, and sum the completed mask. Count pickup-only and drop-off-only rows separately so partial timestamp states remain visible rather than being silently grouped with other incomplete rides.",
      result:
        "223,652 of 385,477 ride requests meet the accepted completion rule, and no row has only a pickup or only a drop-off timestamp. This establishes the row-level completion state used later in the analysis.",
    },
    items: [
      {
        construct: ".notna()",
        what: "Tests every value and returns True where a timestamp is present.",
        whyHere: "Completion requires both pickup and drop-off timestamps on the same ride row.",
        output: "A row-aligned Boolean Series.",
      },
      {
        construct: "& and ~",
        what: "Combine Boolean Series with AND, or invert one with NOT.",
        whyHere: "AND defines completed rides, while inversion isolates partial timestamp states for validation.",
        output: "Boolean masks that can filter or count matching ride rows.",
      },
      {
        construct: "Boolean .sum()",
        what: "Counts True values because pandas treats True as 1 and False as 0 when summing.",
        whyHere: "It converts each row-level completion mask into an auditable ride count.",
        output: "An integer count of rows where the condition is True.",
      },
    ],
  },
  {
    id: "calculate-valid-ride-duration",
    sourceMatcher: 'valid_duration_rides["duration_minutes"] = (',
    walkthrough: {
      context:
        "The accepted completion mask already identifies rides with both timestamps, but elapsed time is valid only when drop-off is not earlier than pickup.",
      goal:
        "Measure average pickup-to-drop-off duration for valid completed rides without including incomplete or reversed records.",
      action:
        "Filter completed rides to chronological timestamps and copy only the needed columns. Subtract pickup from drop-off, convert the resulting timedeltas to minutes, count any reversed completed records, and then calculate the mean from the valid rows.",
      result:
        "All 223,652 completed rides have valid timestamp order, and their average recorded duration is 52.61 minutes. The result describes valid completed rides, not all ride requests.",
    },
    items: [
      {
        construct: ".loc[mask, columns].copy()",
        what: "Selects rows and columns by label, then creates an independent DataFrame copy.",
        whyHere: "Only completed rides with chronological timestamps should enter the duration calculation, and the source timestamps should remain unchanged.",
        output: "A separate DataFrame containing only valid ride IDs and their two timestamps.",
      },
      {
        construct: "Datetime subtraction",
        what: "Subtracting two pandas datetime Series produces a duration for each aligned row.",
        whyHere: "Drop-off time minus pickup time measures the recorded duration of each valid ride.",
        output: "A pandas timedelta Series.",
      },
      {
        construct: ".dt.total_seconds() / 60",
        what: "Converts each timedelta to seconds and then to minutes.",
        whyHere: "Minutes are easier to summarize and explain than raw timedelta values.",
        output: "A numeric duration_minutes column.",
      },
    ],
  },
  {
    id: "many-to-one-platform-joins",
    sourceMatcher:
      'ride_requests_with_signup = ride_requests[["ride_id", "user_id"]].merge(',
    walkthrough: {
      context:
        "Ride requests carry `user_id`, while platform is stored on the signup-linked download record. The request, signup, and download grains were validated earlier, so the two relationships can now be joined explicitly.",
      goal:
        "Attach the signup-linked platform to every ride request without changing the one-row-per-`ride_id` denominator, while exposing any missing relationships.",
      action:
        "LEFT JOIN requests to signups on `user_id`, then join the resulting session key to downloads through `session_id = app_download_key`. Require many-to-one cardinality, retain merge indicators, and reconcile rows, distinct ride IDs, and missing matches after both joins.",
      result:
        "Both joins preserve all 385,477 ride requests and distinct ride IDs, with no missing signup, download, or platform matches. The next cell can therefore aggregate the preserved request rows by platform.",
    },
    items: [
      {
        construct: '.merge(..., how="left")',
        what: "Adds matching columns while preserving every row from the left DataFrame.",
        whyHere: "Ride requests define the denominator, so missing signup or download links must not remove requests.",
        output: "A joined DataFrame with the same left-side row population when cardinality is valid.",
      },
      {
        construct: 'validate="many_to_one"',
        what: "Asks pandas to verify that many left rows may match only one right-side key row.",
        whyHere: "A user can request many rides, but the signup lookup is expected to contain one row per user.",
        output: "The merge succeeds only when the expected key relationship holds.",
      },
      {
        construct: "indicator=",
        what: "Adds a column recording whether each output row matched on both sides or only one side.",
        whyHere: "The analysis uses it to count relationship gaps after preserving the request rows.",
        output: "A categorical merge-status column such as both or left_only.",
      },
    ],
  },
  {
    id: "requesting-user-membership",
    sourceMatcher:
      'requesting_users = ride_requests[["user_id"]].drop_duplicates()',
    walkthrough: {
      context:
        "`ride_requests` is still at one row per ride request, so the same registered `user_id` can appear many times. `signup_identifiers` has one row per registered user, and that complete signup population must remain the denominator for Signup → Request drop-off.",
      goal:
        "Create one request-membership flag for every signup without allowing repeat ride requests to multiply signup rows, and verify that every requester belongs to the signup population.",
      action:
        "First reduce the ride table to distinct requesting-user keys and check those keys against the signup IDs. Then left-join them onto the complete signup population with one-to-one validation, use the merge indicator to mark request membership, and reconcile the signup row count and user grain.",
      result:
        "`signup_request_status` contains one row per signed-up `user_id` with an explicit request flag. All 17,623 signup records are preserved and no requesting user falls outside that population, so the next cell can calculate drop-off from a stable denominator.",
    },
    items: [
      {
        construct: ".drop_duplicates()",
        what: "Keeps one copy of each repeated row value.",
        whyHere: "Many ride rows are reduced to one requesting-user key before the signup join.",
        output: "A one-row-per-requesting-user DataFrame.",
      },
      {
        construct: ".isin() and ~",
        what: "Tests set membership row by row, while ~ inverts the resulting Boolean mask.",
        whyHere: "Together they identify requesting user IDs that are absent from the signup population.",
        output: "A Boolean Series marking the out-of-signup requester keys.",
      },
      {
        construct: 'validate="one_to_one"',
        what: "Asks pandas to verify that both merge keys are unique.",
        whyHere: "Both inputs should contain one row per user, so an unexpected duplicate should stop the join.",
        output: "The merge succeeds only when the expected one-to-one relationship holds.",
      },
    ],
  },
  {
    id: "reduce-rides-to-user-state",
    sourceMatcher: "requesting_user_ride_state = (",
    walkthrough: {
      context:
        "The preceding join produced `ride_activity` at one row per `ride_id`, preserving all 385,477 requests and applying the accepted completion rule. A single user may still have many ride rows.",
      goal:
        "Reduce those repeated ride rows to one state row per requesting `user_id` while retaining whether each user ever requested and ever completed a ride.",
      action:
        "Group the ride-level rows by `user_id`. Within each group, use `any` on the request and completion flags so a user receives `True` when at least one of their rides reached that state.",
      result:
        "`requesting_user_ride_state` has one row per requesting user with two at-least-one Boolean states. The following validation confirms 12,406 requesting users, including 6,233 who completed at least one ride, so this table can be joined without multiplying signup rows.",
    },
    items: [
      {
        construct: ".groupby(..., as_index=False)",
        what: "Collects rows with the same user_id while keeping user_id as a normal output column.",
        whyHere: "The input has many ride rows per user, but the output needs one requesting-user state row.",
        output: "Grouped ride rows ready for one aggregation per user.",
      },
      {
        construct: '.agg(..., "any")',
        what: "Returns True for a group when at least one row has a True value.",
        whyHere: "It turns ride-level request and completion flags into at-least-one user states.",
        output: "One Boolean request state and one Boolean completion state per requesting user.",
      },
    ],
  },
  {
    id: "fill-absent-ride-state",
    sourceMatcher: "signup_funnel_state[ride_stage_columns] = (",
    walkthrough: {
      context:
        "`signup_identifiers` contains every registered user, while `requesting_user_ride_state` contains only the subset who requested at least one ride. Both inputs are unique on `user_id`, so a left join will leave missing ride-state values only for signups absent from the requester table.",
      goal:
        "Attach request and completion state to every signup, preserve one row per registered `user_id`, and represent absence from the requester table as explicit `False` stage membership.",
      action:
        "Left-join the requesting-user state onto the signup population with one-to-one validation and retain the merge indicator. Identify unmatched signups, replace their missing request and completion values with `False`, convert both columns to Boolean type, and validate the preserved grain and filled states.",
      result:
        "`signup_funnel_state` contains all 17,623 signup rows with explicit request and completion flags and no multiplication. It is now a safe one-row-per-signup lookup for the next join onto the download population.",
    },
    items: [
      {
        construct: ".fillna(False).astype(bool)",
        what: "Replaces missing stage values with False and stores the columns as Boolean values.",
        whyHere: "A signup with no matched ride-state row did not reach Request or Complete in the recorded data.",
        output: "Explicit True/False stage columns with no missing values.",
      },
      {
        construct: ".all()",
        what: "Returns True only when every value in the checked Boolean Series is True.",
        whyHere: "It verifies that every unmatched signup received False stage flags, not just a sample.",
        output: "One Boolean validation result for the full unmatched subset.",
      },
    ],
  },
  {
    id: "derive-funnel-percentages",
    sourceMatcher:
      'core_funnel_summary["previous_stage_count"] = core_funnel_summary[',
    walkthrough: {
      context:
        "`core_funnel_summary` already contains four ordered rows, one per customer-funnel stage, with counts derived from the validated download-level base. The remaining question is how each stage compares with both its immediate predecessor and the selected top stage.",
      goal:
        "Add previous-stage conversion, adjacent percentage drop-off, and Percent of Top with explicit denominators while leaving the first stage's previous-stage metrics undefined.",
      action:
        "Shift `stage_count` down one row so each downstream stage aligns with its preceding count. Divide by that aligned denominator for Percent of Previous, subtract from 100 for percentage drop-off, use the Download count as the Percent-of-Top denominator, and round only the displayed metrics.",
      result:
        "The grain remains one row per ordered stage, now with both denominator-based percentage views. Download keeps missing previous-stage metrics and 100.00% of top; the downstream values are ready for the following reconciliation checks.",
    },
    items: [
      {
        construct: ".shift(1)",
        what: "Moves values down by one ordered row and leaves the first row missing.",
        whyHere: "Each stage needs the preceding stage count as its Percent-of-Previous denominator.",
        output: "A Series aligned so every downstream row carries its previous-stage count.",
      },
      {
        construct: "Vectorized division",
        what: "Divides aligned Series values row by row.",
        whyHere: "The same explicit formulas calculate previous-stage and top-stage percentages for all stages.",
        output: "Numeric percentage columns; the first previous-stage percentage remains missing.",
      },
      {
        construct: ".round(2)",
        what: "Rounds numeric values to two decimal places.",
        whyHere: "The analysis keeps full precision through calculation and rounds only the displayed metrics.",
        output: "The same percentage columns rounded to the agreed analytical precision.",
      },
    ],
  },
  {
    id: "find-weakest-transition",
    sourceMatcher: "lowest_conversion_index = adjacent_stage_rows[",
    walkthrough: {
      context:
        "The ordered `core_funnel_summary` already contains validated counts, Percent of Previous, percentage drop-off, and absolute drop-off count. The weakest adjacent transition should now be identified from those calculated metrics rather than named in advance.",
      goal:
        "Find the transition with the lowest Percent of Previous, confirm that it also has the highest percentage drop-off, and collect its relative and absolute losses.",
      action:
        "Shift the stage labels so every downstream row can be paired with its predecessor, then exclude Download because it has no previous-stage denominator. Use `.idxmin()` and `.idxmax()` to locate the extreme rows, build the readable transition label, and retrieve that row's metrics.",
      result:
        "`weakest_transition_result` identifies Requested at least one ride → Completed at least one ride: 50.24% converted, 49.76% dropped off, and the absolute drop-off is 6,173 users. The following cell verifies that both percentage measures select the same transition.",
    },
    items: [
      {
        construct: ".idxmin() and .idxmax()",
        what: "Return the index labels of the smallest and largest values in a Series.",
        whyHere: "They identify the weakest adjacent transition from calculated metrics instead of a hard-coded stage name.",
        output: "Index labels pointing to the relevant funnel-summary row.",
      },
      {
        construct: ".loc[index, column]",
        what: "Selects a value by its row label and column name.",
        whyHere: "The chosen index is used to retrieve the transition label and its relative and absolute losses.",
        output: "The exact value stored at the named summary-table position.",
      },
    ],
  },
  {
    id: "plot-customer-funnel",
    sourceMatcher: "metrocar_customer_funnel = px.funnel(",
    walkthrough: {
      context:
        "The validated `core_funnel_summary` already contains one row per ordered customer-funnel stage, and the weakest transition has been established. This cell is presentation-only: it should visualize accepted values without rebuilding membership.",
      goal:
        "Create a clean Plotly customer funnel that shows absolute counts directly and keeps both denominator-based percentages available in hover.",
      action:
        "Copy the stage, count, Percent of Previous, and Percent of Top columns into a plotting view. Add concise labels, format the first hover percentage as `N/A`, pass the view to `px.funnel()`, carry both percentages in `custom_data`, and define the visible counts and exact hover text.",
      result:
        "`metrocar_customer_funnel` displays 23,608 → 17,623 → 12,406 → 6,233 in validated order. It adds presentation labels and hover text only; `core_funnel_summary` and customer-stage membership remain unchanged.",
    },
    items: [
      {
        construct: "px.funnel()",
        what: "Builds a Plotly funnel figure from named DataFrame columns.",
        whyHere: "It visualizes the already validated one-row-per-stage customer summary without recalculating membership.",
        output: "An interactive Plotly Figure object.",
      },
      {
        construct: "custom_data=",
        what: "Carries extra values with each plotted stage without drawing them as additional marks.",
        whyHere: "Percent of Previous and Percent of Top stay available in hover while the chart remains visually minimal.",
        output: "Stage-aligned values addressable from the hover template.",
      },
      {
        construct: "hovertemplate=",
        what: "Defines the exact text Plotly shows when a reader hovers over a stage.",
        whyHere: "It exposes both denominator-based metrics and removes Plotly's extra trace label.",
        output: "A consistent Stage, Count, Percent-of-Previous, and Percent-of-Top tooltip.",
      },
    ],
  },
  {
    id: "build-strict-ride-path",
    sourceMatcher:
      'ride_level_stage_state["reviewed_in_approved_payment_path"] = (',
    walkthrough: {
      context:
        "Reviews have been validated at `ride_id` grain and reduced to a unique lookup. Approved-payment records and the existing ride-level completion state are also available, but raw review membership must remain distinct from the strict Paid → Reviewed path.",
      goal:
        "Produce one state row per requested `ride_id` containing Requested, Finished, Approved payment, all-Reviewed, and strict Reviewed-within-Approved flags.",
      action:
        "Reduce Approved-payment rides to one marked row per `ride_id`, then start from the request-based `ride_activity` table and reuse its completion state as Finished. Left-join the unique payment and review lookups with one-to-one validation, convert absent matches to `False`, and intersect Reviewed with Approved payment for the strict final-stage flag.",
      result:
        "`ride_level_stage_state` preserves one row per requested `ride_id` and retains both all-review and strict-review membership. The next cell can validate the nested ride path while separately preserving the 7,747 reviewed rides outside Paid.",
    },
    items: [
      {
        construct: ".drop_duplicates()",
        what: "Reduces the Approved-payment rows to one state row per ride_id before joining.",
        whyHere: "Payment membership must attach without multiplying the request-based ride grain; reviewed ride IDs were already reduced in the preceding cell.",
        output: "A unique Approved-payment ride_id lookup table.",
      },
      {
        construct: 'Repeated .merge(..., how="left")',
        what: "Adds each downstream state while preserving every requested ride on the left.",
        whyHere: "Request remains the ride-funnel denominator and absent downstream states remain visible.",
        output: "One ride-level table containing requested, finished, payment, and review evidence.",
      },
      {
        construct: "Boolean &",
        what: "Returns True only where both row-aligned conditions are True.",
        whyHere: "The strict Reviewed stage includes only rides that are both reviewed and in the Approved-payment path.",
        output: "A nested reviewed_in_approved_payment_path flag at ride_id grain.",
      },
      {
        construct: ".fillna(False).astype(bool)",
        what: "Replaces missing lookup matches with False and stores the stage columns as Boolean values.",
        whyHere: "A requested ride absent from a downstream lookup did not reach that recorded state, so the final table needs an explicit False rather than a missing value.",
        output: "Complete True/False payment and review flags for every requested ride row.",
      },
    ],
  },
];
