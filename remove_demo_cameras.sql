-- =====================================================
-- Remove Demo Cameras and Clean Database
-- =====================================================
-- Run this in Supabase SQL Editor

-- 1. Delete all demo cameras
DELETE FROM cameras;

-- 2. Clean up any test data (optional - removes all data)
DELETE FROM crowd_log_detailed;
DELETE FROM person_tracking;
DELETE FROM alerts_log;

-- 3. Reset sequences if needed
-- (This ensures clean IDs for new data)

-- 4. Verify cleanup
SELECT 'Cameras deleted: ' || COUNT(*)::text FROM cameras;
SELECT 'Crowd logs deleted: ' || COUNT(*)::text FROM crowd_log_detailed;
SELECT 'Person tracking deleted: ' || COUNT(*)::text FROM person_tracking;
SELECT 'Alerts deleted: ' || COUNT(*)::text FROM alerts_log;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Demo cameras and test data removed successfully!';
  RAISE NOTICE '✓ Database is clean and ready for your real camera.';
END $$;
