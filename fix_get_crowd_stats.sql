-- Fix for the get_crowd_stats function
-- Run this in Supabase SQL Editor to replace the function

-- Drop the old function first
DROP FUNCTION IF EXISTS get_crowd_stats(uuid, timestamptz, timestamptz);

-- Create the corrected function
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

-- Test the function
SELECT * FROM get_crowd_stats(NULL, NOW() - INTERVAL '24 hours', NOW());
