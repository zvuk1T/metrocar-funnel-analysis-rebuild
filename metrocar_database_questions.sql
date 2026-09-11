-- Q01 — How many app downloads occurred?
-- Grain: one row per app download record.

SELECT COUNT(*) AS app_downloads
FROM app_downloads;

-- Verified result: 23,608 app downloads.


-- Q02 — How many registered users were present?
-- Grain: one row per registered user record.

SELECT COUNT(*) AS registered_users
FROM signups;

-- Verified result: 17,623 registered users.


-- Q03 — How many ride requests occurred?
-- Grain: one row per ride request record.

SELECT COUNT(*) AS ride_requests
FROM ride_requests;

-- Verified result: 385,477 ride requests.


-- Q04 — How many rides were requested versus completed?
-- Unit: ride-request rows; completion requires pickup and drop-off timestamps.

SELECT
    COUNT(*) AS requested_rides,
    -- FILTER counts only rows where both completion timestamps are present.
    COUNT(*) FILTER (
        WHERE pickup_ts IS NOT NULL
          AND dropoff_ts IS NOT NULL
    ) AS completed_rides
FROM ride_requests;

-- Verified result: 385,477 requested; 223,652 completed.


-- Q05 — How do ride requests compare with distinct requesting user IDs?
-- Units: ride-request rows versus distinct user_id values.

SELECT
    COUNT(*) AS ride_requests,
    COUNT(DISTINCT user_id) AS distinct_requesting_user_ids
FROM ride_requests;

-- Verified result: 385,477 requests; 12,406 distinct requesting user IDs.


-- Q06 — What was the average ride duration from pickup to drop-off?
-- Unit: completed rides with present, correctly ordered timestamps; minutes.

SELECT
    COUNT(*) AS valid_completed_rides,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (dropoff_ts - pickup_ts)) / 60.0),
        2
    ) AS average_duration_minutes
FROM ride_requests
WHERE pickup_ts IS NOT NULL
  AND dropoff_ts IS NOT NULL
  AND dropoff_ts >= pickup_ts;

-- Verified result: 52.61 minutes across 223,652 valid completed rides.


-- Q07 — How many rides were accepted by a driver?
-- Unit: ride-request rows with a recorded acceptance timestamp.

SELECT COUNT(*) AS accepted_ride_requests
FROM ride_requests
WHERE accept_ts IS NOT NULL;

-- Verified result: 248,379 accepted ride requests.


-- Q08 — How many rides had a successful recorded payment, and how much was collected?
-- Grain: one transaction row per unique ride in the observed table.

SELECT
    COUNT(DISTINCT ride_id) AS rides_with_successful_payment,
    ROUND(SUM(purchase_amount_usd)::numeric, 2) AS total_collected_usd
FROM transactions
WHERE charge_status = 'Approved';

-- Verified result: 212,628 rides; $4,251,667.61 collected.


-- Q09 — How were ride requests distributed by signup-linked download platform?
-- Unit: one ride request attributed through its user's signup and app download.

WITH platform_request_counts AS (
    SELECT
        app_downloads.platform,
        COUNT(*) AS ride_requests
    FROM ride_requests
    JOIN signups
      ON ride_requests.user_id = signups.user_id
    JOIN app_downloads
      ON signups.session_id = app_downloads.app_download_key
    GROUP BY app_downloads.platform
)
SELECT
    platform,
    ride_requests,
    ROUND(
        100.0 * ride_requests / SUM(ride_requests) OVER (),
        2
    ) AS request_share_percent
FROM platform_request_counts
ORDER BY ride_requests DESC;

-- Verified result: iOS 234,693 (60.88%); Android 112,317 (29.14%);
-- Web 38,467 (9.98%).


-- Q10 — What was the signup-to-ride-request drop-off?
-- Unit: one signed-up user; denominator is all signups, numerator has no request.

WITH requesting_users AS (
    SELECT DISTINCT user_id
    FROM ride_requests
)
SELECT
    COUNT(*) AS signed_up_users,
    COUNT(requesting_users.user_id) AS users_requesting_at_least_one_ride,
    COUNT(*) - COUNT(requesting_users.user_id) AS dropoff_users,
    ROUND(
        100.0 * (COUNT(*) - COUNT(requesting_users.user_id)) / COUNT(*),
        2
    ) AS dropoff_percent
FROM signups
LEFT JOIN requesting_users
  ON signups.user_id = requesting_users.user_id;

-- Verified result: 17,623 signups; 12,406 requested; 5,217 did not request;
-- 29.60% drop-off.
