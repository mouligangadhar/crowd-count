import { supabase } from '../lib/supabase';

// =====================================================
// Camera Management
// =====================================================

export interface Camera {
    id: string;
    name: string;
    location: string | null;
    zone: string | null;
    status: 'active' | 'inactive' | 'maintenance';
    line_y: number | null;
    created_at: string;
    last_seen: string;
    metadata: any;
}

export async function getCameras() {
    const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .order('name');

    return { data: data as Camera[] | null, error };
}

export async function getActiveCameras() {
    const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('status', 'active')
        .order('name');

    return { data: data as Camera[] | null, error };
}

export async function getCameraById(id: string) {
    const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('id', id)
        .single();

    return { data: data as Camera | null, error };
}

// =====================================================
// Enhanced Crowd Data
// =====================================================

export interface CrowdLogDetailed {
    id: string;
    camera_id: string;
    timestamp: string;
    entries: number;
    exits: number;
    current_count: number;
    tracked_objects_count: number;
    average_dwell_time: number;
    peak_count: number;
    metadata: any;
}

export async function getCrowdLogDetailed(options?: {
    cameraId?: string;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
}) {
    const { cameraId, limit = 100, startDate, endDate } = options || {};

    let query = supabase
        .from('crowd_log_detailed')
        .select('*, cameras(name, zone)')
        .order('timestamp', { ascending: false });

    if (cameraId) {
        query = query.eq('camera_id', cameraId);
    }

    if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
    }

    if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    return { data, error };
}

export async function getLatestCrowdDataByCamera() {
    const { data, error } = await supabase
        .from('v_latest_crowd_data')
        .select('*');

    return { data, error };
}

export async function getCrowdStatsByCamera(cameraId?: string) {
    const { data, error } = await supabase
        .rpc('get_crowd_stats', {
            p_camera_id: cameraId || null,
            p_start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            p_end_time: new Date().toISOString()
        });

    return { data, error };
}

// =====================================================
// Person Tracking
// =====================================================

export interface PersonTracking {
    id: string;
    camera_id: string;
    track_id: number;
    first_seen: string;
    last_seen: string;
    entry_time: string | null;
    exit_time: string | null;
    dwell_time_seconds: number | null;
    crossed_line: boolean;
    direction: 'entry' | 'exit' | null;
    path_data: any;
    metadata: any;
}

export async function getPersonTracking(options?: {
    cameraId?: string;
    limit?: number;
    startDate?: Date;
}) {
    const { cameraId, limit = 100, startDate } = options || {};

    let query = supabase
        .from('person_tracking')
        .select('*, cameras(name, zone)')
        .order('first_seen', { ascending: false });

    if (cameraId) {
        query = query.eq('camera_id', cameraId);
    }

    if (startDate) {
        query = query.gte('first_seen', startDate.toISOString());
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    return { data, error };
}

export async function getDwellTimeAnalysis(cameraId?: string) {
    const { data, error } = await supabase
        .from('v_dwell_time_analysis')
        .select('*')
        .order('date', { ascending: false });

    if (cameraId) {
        return {
            data: data?.filter(d => d.camera_id === cameraId) || null,
            error
        };
    }

    return { data, error };
}

// =====================================================
// Alerts
// =====================================================

export interface AlertLog {
    id: string;
    camera_id: string | null;
    alert_type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    current_count: number | null;
    threshold_value: number | null;
    timestamp: string;
    acknowledged: boolean;
    acknowledged_by: string | null;
    acknowledged_at: string | null;
    metadata: any;
}

export async function getAlerts(options?: {
    cameraId?: string;
    alertType?: string;
    acknowledged?: boolean;
    limit?: number;
}) {
    const { cameraId, alertType, acknowledged, limit = 50 } = options || {};

    let query = supabase
        .from('alerts_log')
        .select('*, cameras(name, zone)')
        .order('timestamp', { ascending: false });

    if (cameraId) {
        query = query.eq('camera_id', cameraId);
    }

    if (alertType) {
        query = query.eq('alert_type', alertType);
    }

    if (acknowledged !== undefined) {
        query = query.eq('acknowledged', acknowledged);
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    return { data, error };
}

export async function getActiveAlerts() {
    const { data, error } = await supabase
        .from('v_active_alerts')
        .select('*');

    return { data, error };
}

export async function acknowledgeAlert(alertId: string, userId?: string) {
    const { data, error } = await supabase
        .from('alerts_log')
        .update({
            acknowledged: true,
            acknowledged_by: userId || null,
            acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

    return { data, error };
}

// =====================================================
// Analytics
// =====================================================

export async function getHourlyStats(cameraId?: string) {
    let query = supabase
        .from('v_hourly_stats')
        .select('*')
        .order('hour', { ascending: false })
        .limit(24);

    if (cameraId) {
        query = query.eq('camera_id', cameraId);
    }

    const { data, error } = await query;

    return { data, error };
}

export async function getPeakHours(cameraId?: string, date: Date = new Date()) {
    const { data, error } = await supabase
        .rpc('get_peak_hours', {
            p_camera_id: cameraId || null,
            p_date: date.toISOString().split('T')[0]
        });

    return { data, error };
}

// =====================================================
// Real-time Subscriptions
// =====================================================

export function subscribeToCrowdLogDetailed(callback: (payload: any) => void) {
    const subscription = supabase
        .channel('crowd_log_detailed_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'crowd_log_detailed'
            },
            callback
        )
        .subscribe();

    return subscription;
}

export function subscribeToAlerts(callback: (payload: any) => void) {
    const subscription = supabase
        .channel('alerts_changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'alerts_log'
            },
            callback
        )
        .subscribe();

    return subscription;
}

export function subscribeToCameraStatus(callback: (payload: any) => void) {
    const subscription = supabase
        .channel('camera_status_changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'cameras'
            },
            callback
        )
        .subscribe();

    return subscription;
}
