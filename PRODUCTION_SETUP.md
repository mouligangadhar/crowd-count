# 🎥 Production Camera Setup Guide

## ✅ **Step-by-Step Setup**

### **Step 1: Remove Demo Cameras** (1 minute)

Run this in **Supabase SQL Editor**:

```sql
-- File: remove_demo_cameras.sql
DELETE FROM cameras;
DELETE FROM crowd_log_detailed;
DELETE FROM person_tracking;
DELETE FROM alerts_log;
```

**Result:** ✓ All demo data removed, database is clean

---

### **Step 2: Configure Your Camera** (2 minutes)

Open `crowd_tracking_production.py` and customize these settings:

```python
# =====================================================
# CAMERA CONFIGURATION - CUSTOMIZE THIS!
# =====================================================

# Camera Identity
CAMERA_NAME = "Main Entrance"           # ← Change to your camera name
CAMERA_LOCATION = "Building A - Floor 1"  # ← Change to your location
CAMERA_ZONE = "Entrance"                # ← Change to your zone

# Detection Line
LINE_Y = 300                            # ← Adjust based on camera view
OFFSET = 6                              # ← Pixel buffer (usually 5-10)

# Alert Thresholds
CROWD_THRESHOLD_CRITICAL = 50   # ← Critical alert threshold
CROWD_THRESHOLD_WARNING = 30    # ← Warning alert threshold
```

---

### **Step 3: Run Your Camera** (Start tracking!)

```bash
python crowd_tracking_production.py
```

**You should see:**
```
============================================================
🎥 CrowdVision - Enhanced Crowd Analytics
============================================================
✓ Camera created successfully: Main Entrance (ID: xxx-xxx)
📍 Location: Building A - Floor 1
🏷️  Zone: Entrance
📏 Line Y: 300
⚠️  Critical Threshold: 50
⚠️  Warning Threshold: 30
============================================================
🟢 System Ready - Press ESC to quit
============================================================
✓ Data pushed - In: 0, Out: 0, Inside: 0, Peak: 0, Dwell: 0.0s
✓ Data pushed - In: 2, Out: 0, Inside: 2, Peak: 2, Dwell: 3.2s
✓ Data pushed - In: 5, Out: 1, Inside: 4, Peak: 4, Dwell: 5.8s
...
```

---

## 🎯 **Camera Configuration Examples**

### **Example 1: Main Entrance**
```python
CAMERA_NAME = "Main Entrance"
CAMERA_LOCATION = "Building A - Ground Floor"
CAMERA_ZONE = "Entrance"
LINE_Y = 300
CROWD_THRESHOLD_CRITICAL = 100
CROWD_THRESHOLD_WARNING = 75
```

### **Example 2: Food Court**
```python
CAMERA_NAME = "Food Court Camera"
CAMERA_LOCATION = "Building A - Floor 2"
CAMERA_ZONE = "Dining Area"
LINE_Y = 250
CROWD_THRESHOLD_CRITICAL = 150
CROWD_THRESHOLD_WARNING = 100
```

### **Example 3: Parking Lot**
```python
CAMERA_NAME = "Parking Lot A"
CAMERA_LOCATION = "Outdoor - North Side"
CAMERA_ZONE = "Parking"
LINE_Y = 200
CROWD_THRESHOLD_CRITICAL = 80
CROWD_THRESHOLD_WARNING = 60
```

---

## 📏 **How to Set LINE_Y**

The `LINE_Y` value determines where people are counted.

### **Method 1: Visual Adjustment**
1. Run the camera
2. Watch the blue line on screen
3. Adjust `LINE_Y` until it's at the right height
4. Restart the script

### **Method 2: Calculate from Frame**
```python
# Add this temporarily to see frame dimensions
print(f"Frame size: {frame.shape[1]}x{frame.shape[0]}")
# Then set LINE_Y to about 40-60% of frame height
LINE_Y = int(frame.shape[0] * 0.5)  # Middle of frame
```

### **Tips:**
- ✅ Place line where people clearly cross
- ✅ Avoid areas with shadows or reflections
- ✅ Higher = count people closer to camera
- ✅ Lower = count people farther from camera

---

## ⚠️ **Setting Alert Thresholds**

### **How to Choose Thresholds:**

1. **Run camera for 1 day** without alerts
2. **Check peak count** in Supabase:
   ```sql
   SELECT MAX(current_count) as peak FROM crowd_log_detailed;
   ```
3. **Set thresholds** based on peak:
   - **Warning**: 60-70% of peak
   - **Critical**: 80-90% of peak

### **Example:**
If peak count is 100:
```python
CROWD_THRESHOLD_WARNING = 60   # 60% of peak
CROWD_THRESHOLD_CRITICAL = 85  # 85% of peak
```

---

## 🔄 **Adding Multiple Cameras**

To run multiple cameras, create separate Python scripts:

### **Camera 1: Main Entrance**
```python
# main_entrance.py
CAMERA_NAME = "Main Entrance"
CAMERA_LOCATION = "Building A - Floor 1"
CAMERA_ZONE = "Entrance"
LINE_Y = 300
cap = cv2.VideoCapture(0)  # Camera 0
```

### **Camera 2: Food Court**
```python
# food_court.py
CAMERA_NAME = "Food Court"
CAMERA_LOCATION = "Building A - Floor 2"
CAMERA_ZONE = "Dining"
LINE_Y = 250
cap = cv2.VideoCapture(1)  # Camera 1
```

### **Run Both:**
```bash
# Terminal 1
python main_entrance.py

# Terminal 2
python food_court.py
```

---

## 📊 **What Gets Logged**

### **Every 5 Seconds:**
1. **crowd_log** (original table)
   - entries, exits, current_count

2. **crowd_log_detailed** (enhanced table)
   - camera_id, entries, exits, current_count
   - tracked_objects_count
   - average_dwell_time
   - peak_count
   - metadata

### **When People Cross Line:**
3. **person_tracking**
   - track_id, direction (entry/exit)
   - entry_time or exit_time
   - camera_id

### **When Thresholds Exceeded:**
4. **alerts_log**
   - alert_type (critical/warning)
   - title, message
   - current_count, threshold_value
   - camera_id

---

## 🧪 **Verify It's Working**

### **Check Camera Status:**
```sql
SELECT * FROM cameras WHERE status = 'active';
```

**Expected:** Your camera with status = 'active'

### **Check Recent Data:**
```sql
SELECT * FROM crowd_log_detailed 
ORDER BY timestamp DESC 
LIMIT 10;
```

**Expected:** New entries every 5 seconds

### **Check Person Tracking:**
```sql
SELECT * FROM person_tracking 
ORDER BY first_seen DESC 
LIMIT 10;
```

**Expected:** Entries when people cross the line

### **Check Alerts:**
```sql
SELECT * FROM alerts_log 
ORDER BY timestamp DESC 
LIMIT 5;
```

**Expected:** Alerts when thresholds are exceeded

---

## 🎨 **Your React App Will Show:**

Once camera is running, your app will display:

### **Home Dashboard:**
- ✅ Real-time count from your camera
- ✅ Entries/exits today
- ✅ Peak count
- ✅ Trend (increasing/decreasing)
- ✅ Hourly chart

### **Analytics:**
- ✅ Total statistics
- ✅ Entry/exit flow
- ✅ Peak hours
- ✅ Dwell time analysis

### **Alerts:**
- ✅ Live alerts from your camera
- ✅ Critical/warning indicators
- ✅ Real-time notifications

---

## 🚀 **Quick Start Checklist**

- [ ] Run `remove_demo_cameras.sql` in Supabase
- [ ] Customize camera settings in `crowd_tracking_production.py`
- [ ] Adjust `LINE_Y` for your camera view
- [ ] Set appropriate alert thresholds
- [ ] Run `python crowd_tracking_production.py`
- [ ] Verify data in Supabase
- [ ] Check your React app
- [ ] Adjust thresholds based on actual usage

---

## 💡 **Pro Tips**

### **Tip 1: Test LINE_Y First**
Run camera for 5 minutes and watch if people are counted correctly.

### **Tip 2: Start with High Thresholds**
Better to have fewer alerts initially, then lower thresholds.

### **Tip 3: Monitor First Day**
Watch the data for 24 hours before finalizing thresholds.

### **Tip 4: Use Descriptive Names**
Camera names should be clear: "Building A - Main Entrance" not "Cam1"

### **Tip 5: Document Your Setup**
Keep notes on LINE_Y values and why you chose them.

---

## 🎯 **Your Action Plan**

1. **Now (5 min):** Remove demo cameras, configure settings
2. **Next (2 min):** Run Python code, verify it works
3. **Then (5 min):** Check data in Supabase
4. **Finally (2 min):** Open React app, see real data!

---

**Ready to start? Run `remove_demo_cameras.sql` then start your camera! 🎥**
