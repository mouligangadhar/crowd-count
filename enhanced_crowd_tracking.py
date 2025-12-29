import cv2
import time
from datetime import datetime
from ultralytics import YOLO
from supabase import create_client

# =====================
# Configuration & Auth
# =====================
SUPABASE_URL = "https://wyppwghdbwiiujgglqdf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHB3Z2hkYndpaXVqZ2dscWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTAxOTksImV4cCI6MjA4MjQyNjE5OX0.uKYC-ZAIjeQYwK1hijvz0CatTQJo3Zy2zz8L0QJWhZw"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Camera Configuration
CAMERA_NAME = "Main Entrance"
CAMERA_LOCATION = "Building A - Floor 1"
CAMERA_ZONE = "Entrance"

# Initialize or get camera ID
def get_or_create_camera():
    try:
        # Check if camera exists
        result = supabase.table("cameras").select("*").eq("name", CAMERA_NAME).execute()
        
        if result.data and len(result.data) > 0:
            camera_id = result.data[0]['id']
            # Update last_seen
            supabase.table("cameras").update({
                "last_seen": datetime.now().isoformat(),
                "status": "active"
            }).eq("id", camera_id).execute()
            return camera_id
        else:
            # Create new camera
            result = supabase.table("cameras").insert({
                "name": CAMERA_NAME,
                "location": CAMERA_LOCATION,
                "zone": CAMERA_ZONE,
                "line_y": LINE_Y,
                "status": "active"
            }).execute()
            return result.data[0]['id']
    except Exception as e:
        print(f"Camera setup error: {e}")
        return None

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)

# Line setup
LINE_Y = 300 
OFFSET = 6

# Tracking state
tracked_objects = {}  # tid -> {last_y, first_seen, last_seen, path}
counted_ids = set()
entry_count = 0
exit_count = 0
peak_count = 0

PUSH_INTERVAL = 5
last_push_time = time.time()

# Get camera ID
camera_id = get_or_create_camera()
if not camera_id:
    print("Failed to setup camera. Exiting.")
    exit(1)

print(f"Camera initialized: {CAMERA_NAME} (ID: {camera_id})")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, persist=True, tracker="bytetrack.yaml", classes=[0], verbose=False)

    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy()
        ids = results[0].boxes.id.cpu().numpy().astype(int)

        for box, tid in zip(boxes, ids):
            x1, y1, x2, y2 = map(int, box)
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            current_time = time.time()

            # Initialize tracking for new ID
            if tid not in tracked_objects:
                tracked_objects[tid] = {
                    'last_y': cy,
                    'first_seen': current_time,
                    'last_seen': current_time,
                    'path': [(cx, cy)],
                    'crossed': False,
                    'direction': None
                }
            else:
                prev_y = tracked_objects[tid]['last_y']
                tracked_objects[tid]['last_seen'] = current_time
                tracked_objects[tid]['path'].append((cx, cy))

                # Entry: Moving Down
                if prev_y < LINE_Y and cy >= (LINE_Y - OFFSET):
                    if tid not in counted_ids:
                        entry_count += 1
                        counted_ids.add(tid)
                        tracked_objects[tid]['crossed'] = True
                        tracked_objects[tid]['direction'] = 'entry'
                        
                        # Log to person_tracking
                        try:
                            supabase.table("person_tracking").insert({
                                "camera_id": camera_id,
                                "track_id": tid,
                                "entry_time": datetime.now().isoformat(),
                                "direction": "entry",
                                "crossed_line": True
                            }).execute()
                        except Exception as e:
                            print(f"Tracking log error: {e}")
                
                # Exit: Moving Up
                elif prev_y > LINE_Y and cy <= (LINE_Y + OFFSET):
                    if tid not in counted_ids:
                        exit_count += 1
                        counted_ids.add(tid)
                        tracked_objects[tid]['crossed'] = True
                        tracked_objects[tid]['direction'] = 'exit'
                        
                        # Log to person_tracking
                        try:
                            supabase.table("person_tracking").insert({
                                "camera_id": camera_id,
                                "track_id": tid,
                                "exit_time": datetime.now().isoformat(),
                                "direction": "exit",
                                "crossed_line": True
                            }).execute()
                        except Exception as e:
                            print(f"Tracking log error: {e}")

            tracked_objects[tid]['last_y'] = cy

            # Visual Feedback
            color = (0, 255, 0) if tid in counted_ids else (0, 255, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.circle(frame, (cx, cy), 4, (0, 0, 255), -1)
            cv2.putText(frame, f"ID:{tid}", (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

    # Calculate current occupancy and peak
    current_occupancy = max(0, entry_count - exit_count)
    peak_count = max(peak_count, current_occupancy)
    
    # Calculate average dwell time
    active_tracks = len([t for t in tracked_objects.values() if time.time() - t['last_seen'] < 5])
    avg_dwell = 0
    if tracked_objects:
        dwell_times = [t['last_seen'] - t['first_seen'] for t in tracked_objects.values()]
        avg_dwell = sum(dwell_times) / len(dwell_times) if dwell_times else 0

    # Database Sync
    now = time.time()
    if now - last_push_time >= PUSH_INTERVAL:
        try:
            # Insert to crowd_log (original table)
            supabase.table("crowd_log").insert({
                "entries": entry_count,
                "exits": exit_count,
                "current_count": current_occupancy
            }).execute()
            
            # Insert to crowd_log_detailed (if table exists)
            try:
                supabase.table("crowd_log_detailed").insert({
                    "camera_id": camera_id,
                    "entries": entry_count,
                    "exits": exit_count,
                    "current_count": current_occupancy,
                    "tracked_objects_count": active_tracks,
                    "average_dwell_time": avg_dwell,
                    "peak_count": peak_count,
                    "metadata": {
                        "total_tracked": len(tracked_objects),
                        "counted_ids": len(counted_ids)
                    }
                }).execute()
            except:
                pass  # Table might not exist yet
            
            # Check for alerts
            # Critical: High density
            if current_occupancy > 50:  # Adjust threshold
                try:
                    supabase.table("alerts_log").insert({
                        "camera_id": camera_id,
                        "alert_type": "critical",
                        "title": "High Crowd Density",
                        "message": f"Current count ({current_occupancy}) exceeds threshold",
                        "current_count": current_occupancy,
                        "threshold_value": 50
                    }).execute()
                except:
                    pass
            
            last_push_time = now
            print(f"✓ Data pushed - Entries: {entry_count}, Exits: {exit_count}, Inside: {current_occupancy}")
            
        except Exception as e:
            print(f"DB Error: {e}")

    # Cleanup old tracked objects (not seen in 30 seconds)
    current_time = time.time()
    tracked_objects = {
        tid: data for tid, data in tracked_objects.items() 
        if current_time - data['last_seen'] < 30
    }

    # UI Overlay
    cv2.line(frame, (0, LINE_Y), (frame.shape[1], LINE_Y), (255, 0, 0), 3)
    cv2.putText(frame, f"ENTRIES: {entry_count} | EXITS: {exit_count}", (20, 50), 
                cv2.FONT_HERSHEY_DUPLEX, 1, (255, 255, 255), 2)
    cv2.putText(frame, f"INSIDE: {current_occupancy} | PEAK: {peak_count}", (20, 90), 
                cv2.FONT_HERSHEY_DUPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f"TRACKING: {active_tracks} | AVG DWELL: {avg_dwell:.1f}s", (20, 130), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

    cv2.imshow("Advanced Crowd Analytics", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

# Cleanup: Mark camera as inactive
try:
    supabase.table("cameras").update({
        "status": "inactive",
        "last_seen": datetime.now().isoformat()
    }).eq("id", camera_id).execute()
except:
    pass

cap.release()
cv2.destroyAllWindows()
print("Camera stopped.")
