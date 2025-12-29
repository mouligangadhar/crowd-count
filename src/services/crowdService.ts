import { supabase } from '../lib/supabase';

export interface CrowdLogEntry {
    id: string;
    timestamp: string;
    entries: number;
    exits: number;
    current_count: number;
}

export interface CrowdStats {
    totalEntries: number;
    totalExits: number;
    currentCount: number;
    peakCount: number;
    averageCount: number;
}

/**
 * Fetch crowd log entries with optional filters
 */
export async function getCrowdLogs(options?: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    orderBy?: 'asc' | 'desc';
}) {
    const {
        limit = 100,
        startDate,
        endDate,
        orderBy = 'desc'
    } = options || {};

    let query = supabase
        .from('crowd_log')
        .select('*')
        .order('timestamp', { ascending: orderBy === 'asc' });

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

    if (error) {
        console.error('Error fetching crowd logs:', error);
        return { data: null, error };
    }

    return { data: data as CrowdLogEntry[], error: null };
}

/**
 * Get the latest crowd count
 */
export async function getLatestCrowdCount() {
    const { data, error } = await supabase
        .from('crowd_log')
        .select('current_count, timestamp')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching latest count:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

/**
 * Get crowd statistics for a time period
 * CRITICAL FIX: Always returns values from the LATEST row to ensure accuracy
 * with cumulative data from Python tracking script.
 */
export async function getCrowdStats(startDate?: Date, endDate?: Date): Promise<{ stats: CrowdStats | null; error: any }> {
    // 1. Fetch the LATEST row for total entries and exits (cumulative)
    const { data: latestRow, error: latestError } = await supabase
        .from('crowd_log')
        .select('entries, exits, current_count, timestamp')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    if (latestError && latestError.code !== 'PGRST116') {
        console.error('Error fetching latest stats:', latestError);
        return { stats: null, error: latestError };
    }

    // 2. Fetch all rows (optionally within time range) for peak and average calculation
    let rangeQuery = supabase
        .from('crowd_log')
        .select('current_count, timestamp');

    if (startDate) {
        rangeQuery = rangeQuery.gte('timestamp', startDate.toISOString());
    }
    if (endDate) {
        rangeQuery = rangeQuery.lte('timestamp', endDate.toISOString());
    }

    const { data: rangeData, error: rangeError } = await rangeQuery;

    if (rangeError) {
        console.error('Error fetching range data:', rangeError);
    }

    const counts = rangeData?.map(d => d.current_count || 0) || [];
    const peakCount = counts.length > 0 ? Math.max(...counts) : (latestRow?.current_count || 0);
    const averageCount = counts.length > 0
        ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
        : (latestRow?.current_count || 0);

    const stats: CrowdStats = {
        totalEntries: latestRow?.entries || 0,
        totalExits: latestRow?.exits || 0,
        currentCount: latestRow?.current_count || 0,
        peakCount,
        averageCount
    };

    return { stats, error: null };
}

/**
 * Get crowd data grouped by hour for charts
 */
export async function getCrowdDataByHour(date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from('crowd_log')
        .select('timestamp, entries, exits, current_count')
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString())
        .order('timestamp', { ascending: true });

    if (error || !data) {
        console.error('Error fetching hourly data:', error);
        return [];
    }

    // Group by hour
    const hourlyData: { [key: string]: { entries: number; exits: number; count: number; samples: number; latestEntries: number; latestExits: number } } = {};

    data.forEach(entry => {
        const hour = new Date(entry.timestamp).getHours();
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;

        if (!hourlyData[hourKey]) {
            hourlyData[hourKey] = { entries: 0, exits: 0, count: 0, samples: 0, latestEntries: 0, latestExits: 0 };
        }

        // For cumulative data, we take the MAX (latest) value in that hour for totals
        hourlyData[hourKey].latestEntries = Math.max(hourlyData[hourKey].latestEntries, entry.entries || 0);
        hourlyData[hourKey].latestExits = Math.max(hourlyData[hourKey].latestExits, entry.exits || 0);

        // For current count, we average it over the hour
        hourlyData[hourKey].count += entry.current_count || 0;
        hourlyData[hourKey].samples += 1;
    });

    // Convert to array
    return Object.entries(hourlyData).map(([hour, data]) => ({
        hour,
        entries: data.latestEntries,
        exits: data.latestExits,
        avgCount: Math.round(data.count / data.samples)
    }));
}

/**
 * Insert a new crowd log entry
 */
export async function addCrowdLog(entry: {
    entries: number;
    exits: number;
    current_count: number;
}) {
    const { data, error } = await supabase
        .from('crowd_log')
        .insert([entry])
        .select()
        .single();

    if (error) {
        console.error('Error adding crowd log:', error);
        return { data: null, error };
    }

    return { data: data as CrowdLogEntry, error: null };
}

/**
 * Subscribe to real-time crowd log updates
 */
export function subscribeToCrowdLogs(callback: (payload: any) => void) {
    const subscription = supabase
        .channel('crowd_log_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'crowd_log'
            },
            callback
        )
        .subscribe();

    return subscription;
}

/**
 * Get crowd trend (increasing/decreasing/stable)
 */
export async function getCrowdTrend(minutes: number = 30) {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - minutes);

    const { data, error } = await supabase
        .from('crowd_log')
        .select('current_count, timestamp')
        .gte('timestamp', startTime.toISOString())
        .order('timestamp', { ascending: true })
        .limit(20); // Get more samples for better trend

    if (error || !data || data.length < 2) {
        return 'stable';
    }

    const firstCount = data[0].current_count;
    const lastCount = data[data.length - 1].current_count;
    const difference = lastCount - firstCount;

    if (difference > 1) return 'increasing';
    if (difference < -1) return 'decreasing';
    return 'stable';
}
