-- Complete Fix for Both Functions
-- Run this entire file in Supabase SQL Editor

-- =====================================================
-- Fix 1: get_crowd_stats function
-- =====================================================

-- Drop the old function
DROP FUNCTION IF EXISTS get_crowd_stats(uuid, timestamptz, timestamptz);

-- Create the corrected function with table aliases
CREATE OR REPLACE FUNCTION get_crowd_stats(
  p_camera_id uuid DEFAULT NULL,
  p_start_time timestamptz DEFAULT NOW() - INTERVAL '24 hours',
  p_end_time timestamptz DEFAULT NOW()
)
RETURNS TABLE (
  total_entries bigint,
  total_exits bigint,
  peak_count int,
  avg_count numeric,
  current_count int
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(cd.entries)::bigint as total_entries,
    SUM(cd.exits)::bigint as total_exits,
    MAX(cd.current_count) as peak_count,
    ROUND(AVG(cd.current_count), 0) as avg_count,
    (SELECT cd2.current_count 
     FROM crowd_log_detailed cd2
     WHERE (p_camera_id IS NULL OR cd2.camera_id = p_camera_id)
     AND cd2.timestamp <= p_end_time
     ORDER BY cd2.timestamp DESC 
     LIMIT 1) as current_count
  FROM crowd_log_detailed cd
  WHERE (p_camera_id IS NULL OR cd.camera_id = p_camera_id)
    AND cd.timestamp BETWEEN p_start_time AND p_end_time;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Fix 2: get_peak_hours function (preventive fix)
-- =====================================================

-- Drop the old function
DROP FUNCTION IF EXISTS get_peak_hours(uuid, date);

-- Create the corrected function with table aliases
CREATE OR REPLACE FUNCTION get_peak_hours(
  p_camera_id uuid DEFAULT NULL,
  p_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  hour int,
  avg_count numeric,
  peak_count int
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(HOUR FROM cd.timestamp)::int as hour,
    ROUND(AVG(cd.current_count), 0) as avg_count,
    MAX(cd.current_count) as peak_count
  FROM crowd_log_detailed cd
  WHERE (p_camera_id IS NULL OR cd.camera_id = p_camera_id)
    AND DATE(cd.timestamp) = p_date
  GROUP BY EXTRACT(HOUR FROM cd.timestamp)
  ORDER BY avg_count DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Verification Tests
-- =====================================================

-- Test 1: get_crowd_stats
SELECT * FROM get_crowd_stats(NULL, NOW() - INTERVAL '24 hours', NOW());

-- Test 2: get_peak_hours
SELECT * FROM get_peak_hours(NULL, CURRENT_DATE);

-- Test 3: Verify functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_crowd_stats', 'get_peak_hours');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Functions fixed successfully! ✓';
END $$;
