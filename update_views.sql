-- Updated view to include max_capacity
CREATE OR REPLACE VIEW v_latest_crowd_data AS
SELECT DISTINCT ON (camera_id)
  cd.camera_id,
  c.name as camera_name,
  c.zone,
  c.max_capacity,
  cd.timestamp,
  cd.current_count,
  cd.entries,
  cd.exits,
  cd.tracked_objects_count,
  cd.average_dwell_time,
  cd.peak_count
FROM crowd_log_detailed cd
JOIN cameras c ON c.id = cd.camera_id
ORDER BY camera_id, timestamp DESC;
