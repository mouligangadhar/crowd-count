-- Add max_capacity column to cameras table
ALTER TABLE cameras ADD COLUMN IF NOT EXISTS max_capacity int DEFAULT 100;

-- Update the view to include max_capacity
CREATE OR REPLACE VIEW v_camera_status AS
SELECT 
  c.id,
  c.name,
  c.location,
  c.zone,
  c.status,
  c.max_capacity,
  c.last_seen,
  EXTRACT(EPOCH FROM (NOW() - c.last_seen)) as seconds_since_last_seen,
  CASE 
    WHEN EXTRACT(EPOCH FROM (NOW() - c.last_seen)) < 60 THEN 'online'
    WHEN EXTRACT(EPOCH FROM (NOW() - c.last_seen)) < 300 THEN 'warning'
    ELSE 'offline'
  END as connection_status
FROM cameras c;
