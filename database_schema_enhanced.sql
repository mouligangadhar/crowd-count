-- =====================================================
-- Enhanced Crowd Analytics Database Schema
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Table 1: Cameras Management
-- Track multiple cameras, their locations, and status
CREATE TABLE IF NOT EXISTS cameras (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  location text,
  zone text,
  status text default 'active' check (status in ('active', 'inactive', 'maintenance')),
  line_y int,
  created_at timestamptz default now(),
  last_seen timestamptz default now(),
  metadata jsonb
);

-- Index for faster queries
CREATE INDEX idx_cameras_status ON cameras(status);
CREATE INDEX idx_cameras_zone ON cameras(zone);

-- Table 2: Enhanced Crowd Logging
-- More detailed analytics with camera association
CREATE TABLE IF NOT EXISTS crowd_log_detailed (
  id uuid default gen_random_uuid() primary key,
  camera_id uuid references cameras(id) on delete cascade,
  timestamp timestamptz default now(),
  entries int not null default 0,
  exits int not null default 0,
  current_count int not null default 0,
  tracked_objects_count int default 0,
  average_dwell_time float default 0,
  peak_count int default 0,
  metadata jsonb
);

-- Indexes for performance
CREATE INDEX idx_crowd_detailed_camera ON crowd_log_detailed(camera_id);
CREATE INDEX idx_crowd_detailed_timestamp ON crowd_log_detailed(timestamp DESC);
CREATE INDEX idx_crowd_detailed_camera_time ON crowd_log_detailed(camera_id, timestamp DESC);

-- Table 3: Individual Person Tracking
-- Track individual people for dwell time and behavior analysis
CREATE TABLE IF NOT EXISTS person_tracking (
  id uuid default gen_random_uuid() primary key,
  camera_id uuid references cameras(id) on delete cascade,
  track_id int not null,
  first_seen timestamptz default now(),
  last_seen timestamptz default now(),
  entry_time timestamptz,
  exit_time timestamptz,
  dwell_time_seconds int,
  crossed_line boolean default false,
  direction text check (direction in ('entry', 'exit')),
  path_data jsonb,
  metadata jsonb
);

-- Indexes
CREATE INDEX idx_person_tracking_camera ON person_tracking(camera_id);
CREATE INDEX idx_person_tracking_time ON person_tracking(first_seen DESC);
CREATE INDEX idx_person_tracking_direction ON person_tracking(direction);

-- Table 4: Alerts Log
-- Track all alerts for compliance and analysis
CREATE TABLE IF NOT EXISTS alerts_log (
  id uuid default gen_random_uuid() primary key,
  camera_id uuid references cameras(id) on delete set null,
  alert_type text not null check (alert_type in ('critical', 'warning', 'info', 'success')),
  title text not null,
  message text not null,
  current_count int,
  threshold_value int,
  timestamp timestamptz default now(),
  acknowledged boolean default false,
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  metadata jsonb
);

-- Indexes
CREATE INDEX idx_alerts_camera ON alerts_log(camera_id);
CREATE INDEX idx_alerts_type ON alerts_log(alert_type);
CREATE INDEX idx_alerts_timestamp ON alerts_log(timestamp DESC);
CREATE INDEX idx_alerts_acknowledged ON alerts_log(acknowledged);

-- =====================================================
-- Useful Views for Analytics
-- =====================================================

-- View 1: Current Camera Status
CREATE OR REPLACE VIEW v_camera_status AS
SELECT 
  c.id,
  c.name,
  c.location,
  c.zone,
  c.status,
  c.last_seen,
  EXTRACT(EPOCH FROM (NOW() - c.last_seen)) as seconds_since_last_seen,
  CASE 
    WHEN EXTRACT(EPOCH FROM (NOW() - c.last_seen)) < 60 THEN 'online'
    WHEN EXTRACT(EPOCH FROM (NOW() - c.last_seen)) < 300 THEN 'warning'
    ELSE 'offline'
  END as connection_status
FROM cameras c;

-- View 2: Latest Crowd Data per Camera
CREATE OR REPLACE VIEW v_latest_crowd_data AS
SELECT DISTINCT ON (camera_id)
  cd.camera_id,
  c.name as camera_name,
  c.zone,
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

-- View 3: Hourly Statistics
CREATE OR REPLACE VIEW v_hourly_stats AS
SELECT 
  camera_id,
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(current_count) as avg_count,
  MAX(current_count) as peak_count,
  SUM(entries) as total_entries,
  SUM(exits) as total_exits,
  AVG(average_dwell_time) as avg_dwell_time,
  COUNT(*) as sample_count
FROM crowd_log_detailed
GROUP BY camera_id, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC;

-- View 4: Active Alerts
CREATE OR REPLACE VIEW v_active_alerts AS
SELECT 
  a.id,
  a.alert_type,
  a.title,
  a.message,
  a.current_count,
  a.threshold_value,
  a.timestamp,
  c.name as camera_name,
  c.zone,
  EXTRACT(EPOCH FROM (NOW() - a.timestamp)) / 60 as minutes_ago
FROM alerts_log a
LEFT JOIN cameras c ON c.id = a.camera_id
WHERE a.acknowledged = false
ORDER BY 
  CASE a.alert_type
    WHEN 'critical' THEN 1
    WHEN 'warning' THEN 2
    WHEN 'info' THEN 3
    ELSE 4
  END,
  a.timestamp DESC;

-- View 5: Dwell Time Analysis
CREATE OR REPLACE VIEW v_dwell_time_analysis AS
SELECT 
  camera_id,
  DATE(first_seen) as date,
  COUNT(*) as total_people,
  AVG(EXTRACT(EPOCH FROM (last_seen - first_seen))) as avg_dwell_seconds,
  MAX(EXTRACT(EPOCH FROM (last_seen - first_seen))) as max_dwell_seconds,
  MIN(EXTRACT(EPOCH FROM (last_seen - first_seen))) as min_dwell_seconds
FROM person_tracking
WHERE first_seen IS NOT NULL AND last_seen IS NOT NULL
GROUP BY camera_id, DATE(first_seen)
ORDER BY date DESC;

-- =====================================================
-- Useful Functions
-- =====================================================

-- Function: Get crowd statistics for a time period
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
    SUM(entries)::bigint as total_entries,
    SUM(exits)::bigint as total_exits,
    MAX(current_count) as peak_count,
    ROUND(AVG(current_count), 0) as avg_count,
    (SELECT current_count FROM crowd_log_detailed 
     WHERE (p_camera_id IS NULL OR camera_id = p_camera_id)
     AND timestamp <= p_end_time
     ORDER BY timestamp DESC LIMIT 1) as current_count
  FROM crowd_log_detailed
  WHERE (p_camera_id IS NULL OR camera_id = p_camera_id)
    AND timestamp BETWEEN p_start_time AND p_end_time;
END;
$$ LANGUAGE plpgsql;

-- Function: Get peak hours
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
    EXTRACT(HOUR FROM timestamp)::int as hour,
    ROUND(AVG(current_count), 0) as avg_count,
    MAX(current_count) as peak_count
  FROM crowd_log_detailed
  WHERE (p_camera_id IS NULL OR camera_id = p_camera_id)
    AND DATE(timestamp) = p_date
  GROUP BY EXTRACT(HOUR FROM timestamp)
  ORDER BY avg_count DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_log_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read on cameras" 
  ON cameras FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated read on crowd_log_detailed" 
  ON crowd_log_detailed FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated read on person_tracking" 
  ON person_tracking FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated read on alerts_log" 
  ON alerts_log FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow service role (your Python script) to insert/update
CREATE POLICY "Allow service role full access on cameras" 
  ON cameras FOR ALL 
  TO service_role 
  USING (true);

CREATE POLICY "Allow service role full access on crowd_log_detailed" 
  ON crowd_log_detailed FOR ALL 
  TO service_role 
  USING (true);

CREATE POLICY "Allow service role full access on person_tracking" 
  ON person_tracking FOR ALL 
  TO service_role 
  USING (true);

CREATE POLICY "Allow service role full access on alerts_log" 
  ON alerts_log FOR ALL 
  TO service_role 
  USING (true);

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert a sample camera
INSERT INTO cameras (name, location, zone, line_y) VALUES
  ('Main Entrance', 'Building A - Floor 1', 'Entrance', 300),
  ('Food Court', 'Building A - Floor 2', 'Dining', 250),
  ('Parking Lot A', 'Outdoor - North', 'Parking', 200)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Maintenance Queries
-- =====================================================

-- Clean up old person tracking data (older than 30 days)
-- Run this periodically
-- DELETE FROM person_tracking WHERE first_seen < NOW() - INTERVAL '30 days';

-- Clean up old alerts (older than 90 days)
-- DELETE FROM alerts_log WHERE timestamp < NOW() - INTERVAL '90 days';

-- =====================================================
-- Useful Queries for Analytics
-- =====================================================

-- Get today's statistics
-- SELECT * FROM get_crowd_stats(NULL, CURRENT_DATE, NOW());

-- Get peak hours for today
-- SELECT * FROM get_peak_hours(NULL, CURRENT_DATE);

-- Get active cameras
-- SELECT * FROM v_camera_status WHERE connection_status = 'online';

-- Get latest crowd data
-- SELECT * FROM v_latest_crowd_data;

-- Get unacknowledged alerts
-- SELECT * FROM v_active_alerts;

-- Get dwell time analysis
-- SELECT * FROM v_dwell_time_analysis WHERE date = CURRENT_DATE;

COMMENT ON TABLE cameras IS 'Stores camera information and status';
COMMENT ON TABLE crowd_log_detailed IS 'Enhanced crowd logging with camera association and analytics';
COMMENT ON TABLE person_tracking IS 'Individual person tracking for dwell time and behavior analysis';
COMMENT ON TABLE alerts_log IS 'Alert history for compliance and analysis';
