# 📊 Crowd Log Database Integration Guide

## 🎯 Overview

Your application is now integrated with the `crowd_log` table in Supabase for real-time crowd counting and analytics!

## 📋 Table Structure

```sql
CREATE TABLE crowd_log (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamptz default now(),
  entries int,
  exits int,
  current_count int
);
```

### **Columns:**
- **`id`** (uuid) - Unique identifier for each entry
- **`timestamp`** (timestamptz) - When the count was recorded (auto-generated)
- **`entries`** (int) - Number of people who entered
- **`exits`** (int) - Number of people who exited
- **`current_count`** (int) - Current total crowd count

---

## 🚀 Quick Start

### **1. Insert Sample Data (Testing)**

Run this in Supabase SQL Editor to add test data:

```sql
-- Insert sample data for today
INSERT INTO crowd_log (entries, exits, current_count) VALUES
  (10, 2, 8),
  (15, 5, 18),
  (20, 8, 30),
  (12, 15, 27),
  (25, 10, 42),
  (18, 12, 48),
  (30, 20, 58),
  (22, 18, 62);

-- Insert data with specific timestamps (last 24 hours)
INSERT INTO crowd_log (timestamp, entries, exits, current_count) VALUES
  (NOW() - INTERVAL '23 hours', 10, 2, 8),
  (NOW() - INTERVAL '22 hours', 15, 5, 18),
  (NOW() - INTERVAL '21 hours', 20, 8, 30),
  (NOW() - INTERVAL '20 hours', 12, 15, 27),
  (NOW() - INTERVAL '19 hours', 25, 10, 42),
  (NOW() - INTERVAL '18 hours', 18, 12, 48),
  (NOW() - INTERVAL '17 hours', 30, 20, 58),
  (NOW() - INTERVAL '16 hours', 22, 18, 62);
```

### **2. Use in Your Components**

```typescript
import { CrowdCounter } from '../components/crowd/CrowdCounter';
import { useLatestCrowdCount, useCrowdStats } from '../hooks/useCrowdData';

function MyComponent() {
  // Option 1: Use the pre-built component
  return <CrowdCounter showTrend={true} size="lg" />;

  // Option 2: Use the hook for custom UI
  const { count, timestamp, loading } = useLatestCrowdCount();
  
  return (
    <div>
      <h1>Current Crowd: {count}</h1>
      <p>Last updated: {timestamp}</p>
    </div>
  );
}
```

---

## 📦 Available Components

### **1. CrowdCounter**
Real-time crowd count display with trend indicator

```typescript
import { CrowdCounter } from '../components/crowd/CrowdCounter';

<CrowdCounter 
  showTrend={true}    // Show trend indicator
  size="lg"           // 'sm' | 'md' | 'lg'
  className="mb-4"
/>
```

**Features:**
- ✅ Real-time updates
- ✅ Trend indicator (increasing/decreasing/stable)
- ✅ Last update timestamp
- ✅ Loading and error states
- ✅ Animated count changes

### **2. CrowdStatsCard**
Display entries, exits, and net change

```typescript
import { CrowdStatsCard } from '../components/crowd/CrowdCounter';

<CrowdStatsCard 
  entries={150}
  exits={80}
  currentCount={70}
/>
```

---

## 🎣 Available Hooks

### **1. useLatestCrowdCount**
Get the most recent crowd count with real-time updates

```typescript
import { useLatestCrowdCount } from '../hooks/useCrowdData';

function MyComponent() {
  const { count, timestamp, loading, error } = useLatestCrowdCount();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Current count: {count}</div>;
}
```

### **2. useCrowdLogs**
Fetch crowd logs with filters

```typescript
import { useCrowdLogs } from '../hooks/useCrowdData';

function LogsComponent() {
  const { logs, loading, error } = useCrowdLogs({
    limit: 50,
    startDate: new Date('2024-01-01'),
    endDate: new Date(),
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  });
  
  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>
          {log.current_count} people at {log.timestamp}
        </div>
      ))}
    </div>
  );
}
```

### **3. useCrowdStats**
Get aggregated statistics

```typescript
import { useCrowdStats } from '../hooks/useCrowdData';

function StatsComponent() {
  const { stats, loading } = useCrowdStats(
    new Date('2024-01-01'), // start date
    new Date()              // end date
  );
  
  if (!stats) return null;
  
  return (
    <div>
      <p>Total Entries: {stats.totalEntries}</p>
      <p>Total Exits: {stats.totalExits}</p>
      <p>Current Count: {stats.currentCount}</p>
      <p>Peak Count: {stats.peakCount}</p>
      <p>Average Count: {stats.averageCount}</p>
    </div>
  );
}
```

### **4. useCrowdDataByHour**
Get hourly aggregated data for charts

```typescript
import { useCrowdDataByHour } from '../hooks/useCrowdData';

function ChartComponent() {
  const { data, loading } = useCrowdDataByHour(new Date());
  
  return (
    <div>
      {data.map(hour => (
        <div key={hour.hour}>
          {hour.hour}: {hour.avgCount} people
        </div>
      ))}
    </div>
  );
}
```

### **5. useCrowdTrend**
Get crowd trend (increasing/decreasing/stable)

```typescript
import { useCrowdTrend } from '../hooks/useCrowdData';

function TrendComponent() {
  const { trend, loading } = useCrowdTrend(30); // last 30 minutes
  
  return <div>Trend: {trend}</div>;
}
```

### **6. useRealtimeCrowd**
Real-time monitoring with all data

```typescript
import { useRealtimeCrowd } from '../hooks/useCrowdData';

function RealtimeComponent() {
  const { 
    currentCount, 
    entries, 
    exits, 
    timestamp, 
    connected 
  } = useRealtimeCrowd();
  
  return (
    <div>
      <p>Status: {connected ? '🟢 Live' : '🔴 Disconnected'}</p>
      <p>Count: {currentCount}</p>
      <p>Entries: {entries}</p>
      <p>Exits: {exits}</p>
    </div>
  );
}
```

---

## 🔧 Service Functions

### **Direct API Calls**

```typescript
import {
  getCrowdLogs,
  getLatestCrowdCount,
  getCrowdStats,
  getCrowdDataByHour,
  addCrowdLog,
  subscribeToCrowdLogs,
  getCrowdTrend
} from '../services/crowdService';

// Fetch logs
const { data, error } = await getCrowdLogs({ limit: 100 });

// Get latest count
const { data } = await getLatestCrowdCount();

// Add new entry
const { data } = await addCrowdLog({
  entries: 10,
  exits: 5,
  current_count: 45
});

// Subscribe to real-time updates
const subscription = subscribeToCrowdLogs((payload) => {
  console.log('New data:', payload.new);
});
```

---

## 📊 Example Queries

### **View All Logs**
```sql
SELECT * FROM crowd_log 
ORDER BY timestamp DESC 
LIMIT 100;
```

### **Get Today's Data**
```sql
SELECT * FROM crowd_log 
WHERE timestamp >= CURRENT_DATE 
ORDER BY timestamp DESC;
```

### **Get Statistics for Today**
```sql
SELECT 
  SUM(entries) as total_entries,
  SUM(exits) as total_exits,
  MAX(current_count) as peak_count,
  AVG(current_count) as avg_count
FROM crowd_log 
WHERE timestamp >= CURRENT_DATE;
```

### **Hourly Averages**
```sql
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(current_count) as avg_count,
  MAX(current_count) as peak_count,
  SUM(entries) as total_entries,
  SUM(exits) as total_exits
FROM crowd_log 
WHERE timestamp >= CURRENT_DATE
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour;
```

### **Last 24 Hours Trend**
```sql
SELECT 
  timestamp,
  current_count,
  entries,
  exits
FROM crowd_log 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp ASC;
```

---

## 🔐 Row Level Security (RLS)

Enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE crowd_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read access" 
ON crowd_log FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert access" 
ON crowd_log FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" 
ON crowd_log FOR ALL 
TO service_role 
USING (true);
```

---

## 🎨 Integration Examples

### **Example 1: Dashboard Widget**

```typescript
import { CrowdCounter } from '../components/crowd/CrowdCounter';

function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CrowdCounter size="lg" showTrend={true} />
      {/* Other widgets */}
    </div>
  );
}
```

### **Example 2: Analytics Page**

```typescript
import { useCrowdStats, useCrowdDataByHour } from '../hooks/useCrowdData';

function AnalyticsPage() {
  const { stats } = useCrowdStats();
  const { data: hourlyData } = useCrowdDataByHour();
  
  return (
    <div>
      <h1>Crowd Analytics</h1>
      {stats && (
        <div>
          <p>Peak: {stats.peakCount}</p>
          <p>Average: {stats.averageCount}</p>
        </div>
      )}
      {/* Chart with hourlyData */}
    </div>
  );
}
```

### **Example 3: Real-time Monitor**

```typescript
import { useRealtimeCrowd } from '../hooks/useCrowdData';

function LiveMonitor() {
  const { currentCount, connected } = useRealtimeCrowd();
  
  return (
    <div>
      <div className={connected ? 'text-green-500' : 'text-red-500'}>
        {connected ? '🟢 Live' : '🔴 Offline'}
      </div>
      <h1 className="text-6xl">{currentCount}</h1>
    </div>
  );
}
```

---

## 🧪 Testing

### **1. Add Test Data**
```sql
INSERT INTO crowd_log (entries, exits, current_count) 
VALUES (10, 5, 25);
```

### **2. Verify Real-time Updates**
- Open your app
- Add data via SQL Editor
- Watch the count update automatically!

### **3. Test Trends**
```sql
-- Add increasing trend
INSERT INTO crowd_log (entries, exits, current_count) VALUES
  (10, 2, 50),
  (15, 3, 62),
  (20, 5, 77);
```

---

## 📚 Next Steps

1. **Enable RLS** - Secure your data
2. **Add Test Data** - Populate with sample data
3. **Use Components** - Add CrowdCounter to your dashboard
4. **Build Charts** - Use hourly data for visualizations
5. **Set up Alerts** - Trigger alerts on thresholds

---

## 🎯 Quick Reference

```typescript
// Get latest count
const { count } = useLatestCrowdCount();

// Get stats
const { stats } = useCrowdStats();

// Get hourly data
const { data } = useCrowdDataByHour();

// Real-time monitoring
const { currentCount, connected } = useRealtimeCrowd();

// Display component
<CrowdCounter size="lg" showTrend={true} />
```

---

**Your crowd counting system is ready to use! 🎉**
