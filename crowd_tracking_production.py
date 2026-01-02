import cv2
import time
from datetime import datetime
from ultralytics import YOLO
from supabase import create_client

# =====================================================
# Configuration & Auth
# =====================================================
SUPABASE_URL = "https://wyppwghdbwiiujgglqdf.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHB3Z2hkYndpaXVqZ2dscWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTAxOTksImV4cCI6MjA4MjQyNjE5OX0.uKYC-ZAIjeQYwK1hijvz0CatTQJo3Zy2zz8L0QJWhZw"
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Camera Info
CAMERA_NAME = "Main Entrance"
CAMERA_LOCATION = "Building A - Floor 1"
CAMERA_ZONE = "Entrance"

# --- CAPACITY SETTINGS ---
MAX_COUNT = 50          # SET YOUR MAX CAPACITY HERE!
LINE_Y = 300 
BUFFER = 15 

# =====================
# State Variables
# =====================
tracked_objects = {} 
counted_ids = set()

# COUNTERS (Cumulative)
entry_count = 0
exit_count = 0

last_push_time = 0
last_pushed_data = {"in": -1, "out": -1} 
last_alert_time = 0
MIN_PUSH_INTERVAL = 2 
PULSE_INTERVAL = 300   

def get_or_create_camera():
    try:
        result = supabase.table("cameras").select("*").eq("name", CAMERA_NAME).execute()
        if result.data:
            id_ = result.data[0]['id']
            # Update camera with latest info
            supabase.table("cameras").update({
                "status": "active", 
                "last_seen": datetime.now().isoformat()
            }).eq("id", id_).execute()
            return id_
        
        # Create new camera
        res = supabase.table("cameras").insert({
            "name": CAMERA_NAME, 
            "location": CAMERA_LOCATION, 
            "zone": CAMERA_ZONE, 
            "line_y": LINE_Y, 
            "status": "active"
        }).execute()
        return res.data[0]['id']
    except Exception as e:
        print(f"Error setting up camera: {e}")
        return None

camera_id = get_or_create_camera()
if not camera_id: exit(1)

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)

print(f"✓ Analytics Started. Max Capacity Set To: {MAX_COUNT}")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    results = model.track(frame, persist=True, tracker="bytetrack.yaml", classes=[0], verbose=False)

    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy()
        ids = results[0].boxes.id.cpu().numpy().astype(int)

        for box, tid in zip(boxes, ids):
            _, y1, _, y2 = map(int, box)
            cy = (y1 + y2) // 2

            if tid not in tracked_objects:
                side = "top" if cy < LINE_Y else "bottom"
                tracked_objects[tid] = {'start_side': side, 'last_seen': time.time()}
            else:
                obj = tracked_objects[tid]
                obj['last_seen'] = time.time()
                
                if tid not in counted_ids:
                    if obj['start_side'] == "top" and cy > (LINE_Y + BUFFER):
                        entry_count += 1
                        counted_ids.add(tid)
                        print(f"➕ Total In: {entry_count}")
                    elif obj['start_side'] == "bottom" and cy < (LINE_Y - BUFFER):
                        exit_count += 1
                        counted_ids.add(tid)
                        print(f"➖ Total Out: {exit_count}")

    # =====================================================
    # SYNC & ALERT LOGIC
    # =====================================================
    now = time.time()
    occupancy = max(0, entry_count - exit_count)
    
    data_changed = (entry_count != last_pushed_data["in"] or exit_count != last_pushed_data["out"])
    is_pulse_time = (now - last_push_time) >= PULSE_INTERVAL

    if (data_changed and (now - last_push_time >= MIN_PUSH_INTERVAL)) or is_pulse_time:
        try:
            # Sync to crowd_log
            supabase.table("crowd_log").insert({
                "entries": entry_count, 
                "exits": exit_count, 
                "current_count": occupancy
            }).execute()
            
            # Sync to crowd_log_detailed
            supabase.table("crowd_log_detailed").insert({
                "camera_id": camera_id,
                "entries": entry_count,
                "exits": exit_count,
                "current_count": occupancy,
                "timestamp": datetime.now().isoformat()
            }).execute()

            # --- AUTOMATIC MAX CAPACITY ALERT ---
            if occupancy >= MAX_COUNT and (now - last_alert_time > 60):
                supabase.table("alerts_log").insert({
                    "camera_id": camera_id,
                    "alert_type": "critical",
                    "title": "CAPACITY REACHED",
                    "message": f"Zone {CAMERA_ZONE} is at full capacity ({occupancy}/{MAX_COUNT})",
                    "current_count": occupancy,
                    "threshold_value": MAX_COUNT
                }).execute()
                last_alert_time = now
                print("🚨 ALERT: Capacity Full!")

            last_pushed_data = {"in": entry_count, "out": exit_count}
            last_push_time = now
            print(f"📡 Sync: In: {entry_count} | Out: {exit_count} | Inside: {occupancy}")
        except Exception as e:
            print(f"DB Error: {e}")

    # UI Overlay
    is_full = occupancy >= MAX_COUNT
    color = (0, 0, 255) if is_full else (255, 255, 255) # Red if full, white if safe
    
    cv2.line(frame, (0, LINE_Y), (frame.shape[1], LINE_Y), (255, 0, 0), 2)
    cv2.putText(frame, f"IN: {entry_count} | OUT: {exit_count}", (20, 50), cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), 2)
    
    # Large occupancy counter
    status_text = f"NOW: {occupancy}/{MAX_COUNT}"
    if is_full: status_text += " - CAPACITY FULL!"
    
    cv2.putText(frame, status_text, (20, 90), cv2.FONT_HERSHEY_DUPLEX, 0.8, color, 2)
    
    cv2.imshow("CrowdVision", frame)
    if cv2.waitKey(1) & 0xFF == 27: break

cap.release()
cv2.destroyAllWindows()
