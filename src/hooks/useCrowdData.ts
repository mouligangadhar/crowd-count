import { useState, useEffect } from 'react';
import {
    getCrowdLogs,
    getLatestCrowdCount,
    getCrowdStats,
    getCrowdDataByHour,
    subscribeToCrowdLogs,
    getCrowdTrend,
    CrowdLogEntry,
    CrowdStats
} from '../services/crowdService';

/**
 * Hook to get latest crowd count with real-time updates
 */
export function useLatestCrowdCount() {
    const [count, setCount] = useState<number | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch initial data
        const fetchLatest = async () => {
            setLoading(true);
            const { data, error } = await getLatestCrowdCount();

            if (error) {
                setError(error.message);
            } else if (data) {
                setCount(data.current_count);
                setTimestamp(data.timestamp);
            }
            setLoading(false);
        };

        fetchLatest();

        // Subscribe to real-time updates
        const subscription = subscribeToCrowdLogs((payload) => {
            if (payload.new && payload.eventType === 'INSERT') {
                setCount(payload.new.current_count);
                setTimestamp(payload.new.timestamp);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { count, timestamp, loading, error };
}

/**
 * Hook to get crowd logs with optional filters
 */
export function useCrowdLogs(options?: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    autoRefresh?: boolean;
    refreshInterval?: number;
}) {
    const [logs, setLogs] = useState<CrowdLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { autoRefresh = false, refreshInterval = 30000, ...fetchOptions } = options || {};

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const { data, error } = await getCrowdLogs(fetchOptions);

            if (error) {
                setError(error.message);
            } else if (data) {
                setLogs(data);
            }
            setLoading(false);
        };

        fetchLogs();

        // Auto-refresh if enabled
        let interval: NodeJS.Timeout | null = null;
        if (autoRefresh) {
            interval = setInterval(fetchLogs, refreshInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, refreshInterval, JSON.stringify(fetchOptions)]);

    return { logs, loading, error, refresh: () => setLoading(true) };
}

/**
 * Hook to get crowd statistics
 * CRITICAL: Automatically updates in real-time when new logs are added
 */
export function useCrowdStats(startDate?: Date, endDate?: Date) {
    const [stats, setStats] = useState<CrowdStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        const { stats: data, error } = await getCrowdStats(startDate, endDate);

        if (error) {
            setError(error.message || 'Failed to fetch statistics');
        } else if (data) {
            setStats(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();

        // Subscribe to updates to refresh stats in real-time
        const subscription = subscribeToCrowdLogs((payload) => {
            if (payload.eventType === 'INSERT') {
                fetchStats();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [startDate?.toISOString(), endDate?.toISOString()]);

    return { stats, loading, error, refresh: fetchStats };
}

/**
 * Hook to get hourly crowd data for charts
 */
export function useCrowdDataByHour(date: Date = new Date()) {
    const [data, setData] = useState<Array<{
        hour: string;
        entries: number;
        exits: number;
        avgCount: number;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const hourlyData = await getCrowdDataByHour(date);
        setData(hourlyData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();

        // Refresh on new data
        const subscription = subscribeToCrowdLogs((payload) => {
            if (payload.eventType === 'INSERT') {
                fetchData();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [date.toDateString()]);

    return { data, loading, error, refresh: fetchData };
}

/**
 * Hook to get crowd trend
 */
export function useCrowdTrend(minutes: number = 30) {
    const [trend, setTrend] = useState<'increasing' | 'decreasing' | 'stable'>('stable');
    const [loading, setLoading] = useState(true);

    const fetchTrend = async () => {
        setLoading(true);
        const trendData = await getCrowdTrend(minutes);
        setTrend(trendData as 'increasing' | 'decreasing' | 'stable');
        setLoading(false);
    };

    useEffect(() => {
        fetchTrend();

        // Refresh trend on new data
        const subscription = subscribeToCrowdLogs((payload) => {
            if (payload.eventType === 'INSERT') {
                fetchTrend();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [minutes]);

    return { trend, loading };
}

/**
 * Hook for real-time crowd monitoring
 */
export function useRealtimeCrowd() {
    const [currentCount, setCurrentCount] = useState<number>(0);
    const [entries, setEntries] = useState<number>(0);
    const [exits, setExits] = useState<number>(0);
    const [timestamp, setTimestamp] = useState<string>('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Fetch initial data (latest stats)
        const fetchInitial = async () => {
            const { stats } = await getCrowdStats();
            if (stats) {
                setCurrentCount(stats.currentCount);
                setEntries(stats.totalEntries);
                setExits(stats.totalExits);
            }
        };

        fetchInitial();

        // Subscribe to real-time updates
        const subscription = subscribeToCrowdLogs((payload) => {
            setConnected(true);

            if (payload.new && payload.eventType === 'INSERT') {
                // Update with the LATEST values from the newest row
                setCurrentCount(payload.new.current_count || 0);
                setEntries(payload.new.entries || 0);
                setExits(payload.new.exits || 0);
                setTimestamp(payload.new.timestamp || '');
            }
        });

        return () => {
            subscription.unsubscribe();
            setConnected(false);
        };
    }, []);

    return {
        currentCount,
        entries,
        exits,
        timestamp,
        connected
    };
}
