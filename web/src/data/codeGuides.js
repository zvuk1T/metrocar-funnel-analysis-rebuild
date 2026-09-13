// Optional frontend-only refreshers for selected non-obvious Python cells.
// Each source matcher must identify exactly one code cell at build time.
export const codeGuides = [
  {
    id: "validate-download-key",
    sourceMatcher:
      'duplicate_app_download_keys_exist = app_download_keys[',
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
    ],
  },
];
