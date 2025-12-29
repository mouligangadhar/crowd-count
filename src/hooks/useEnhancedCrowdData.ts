import { useState, useEffect } from 'react';
import {
    getCameras,
    getActiveCameras,
    getCrowdLogDetailed,
    getLatestCrowdDataByCamera,
    getCrowdStatsByCamera,
    getPersonTracking,
    getDwellTimeAnalysis,
    getAlerts,
    getActiveAlerts,
    getHourlyStats,
    getPeakHours,
    subscribeToCrowdLogDetailed,
    subscribeToAlerts,
    Camera,
    AlertLog
} from '../services/enhancedCrowdService';

/**
 * Hook to get all cameras
 */
export function useCameras() {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCameras = async () => {
            setLoading(true);
            const { data, error } = await getCameras();

            if (error) {
                setError(error.message);
            } else if (data) {
                setCameras(data);
            }
            setLoading(false);
        };

        fetchCameras();
    }, []);

    return { cameras, loading, error };
}

/**
 * Hook to get active cameras only
 */
export function useActiveCameras() {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCameras = async () => {
            setLoading(true);
            const { data, error } = await getActiveCameras();

            if (error) {
                setError(error.message);
            } else if (data) {
                setCameras(data);
            }
            setLoading(false);
        };

        fetchCameras();
    }, []);

    return { cameras, loading, error };
}

/**
 * Hook to get latest crowd data for all cameras
 */
export function useLatestCrowdDataByCamera() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await getLatestCrowdDataByCamera();

            if (error) {
                setError(error.message);
            } else if (data) {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();

        // Subscribe to real-time updates
        const subscription = subscribeToCrowdLogDetailed((payload) => {
            if (payload.eventType === 'INSERT') {
                fetchData(); // Refresh data
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { data, loading, error };
}

/**
 * Hook to get crowd statistics by camera
 */
export function useCrowdStatsByCamera(cameraId?: string) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const { data, error } = await getCrowdStatsByCamera(cameraId);

            if (error) {
                setError(error.message);
            } else if (data && data.length > 0) {
                setStats(data[0]);
            }
            setLoading(false);
        };

        fetchStats();
    }, [cameraId]);

    return { stats, loading, error };
}

/**
 * Hook to get dwell time analysis
 */
export function useDwellTimeAnalysis(cameraId?: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await getDwellTimeAnalysis(cameraId);

            if (error) {
                setError(error.message);
            } else if (data) {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, [cameraId]);

    return { data, loading, error };
}

/**
 * Hook to get alerts with real-time updates
 */
export function useAlerts(options?: {
    cameraId?: string;
    alertType?: string;
    acknowledged?: boolean;
}) {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            const { data, error } = await getAlerts(options);

            if (error) {
                setError(error.message);
            } else if (data) {
                setAlerts(data);
            }
            setLoading(false);
        };

        fetchAlerts();

        // Subscribe to new alerts
        const subscription = subscribeToAlerts((payload) => {
            if (payload.eventType === 'INSERT' && payload.new) {
                setAlerts(prev => [payload.new, ...prev]);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [options?.cameraId, options?.alertType, options?.acknowledged]);

    return { alerts, loading, error };
}

/**
 * Hook to get active (unacknowledged) alerts
 */
export function useActiveAlerts() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            const { data, error } = await getActiveAlerts();

            if (error) {
                setError(error.message);
            } else if (data) {
                setAlerts(data);
            }
            setLoading(false);
        };

        fetchAlerts();

        // Refresh every 30 seconds
        const interval = setInterval(fetchAlerts, 30000);

        // Subscribe to new alerts
        const subscription = subscribeToAlerts((payload) => {
            if (payload.eventType === 'INSERT') {
                fetchAlerts();
            }
        });

        return () => {
            clearInterval(interval);
            subscription.unsubscribe();
        };
    }, []);

    return { alerts, loading, error };
}

/**
 * Hook to get hourly statistics
 */
export function useHourlyStats(cameraId?: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await getHourlyStats(cameraId);

            if (error) {
                setError(error.message);
            } else if (data) {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, [cameraId]);

    return { data, loading, error };
}

/**
 * Hook to get peak hours
 */
export function usePeakHours(cameraId?: string, date: Date = new Date()) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await getPeakHours(cameraId, date);

            if (error) {
                setError(error.message);
            } else if (data) {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, [cameraId, date.toDateString()]);

    return { data, loading, error };
}

/**
 * Hook to get person tracking data
 */
export function usePersonTracking(options?: {
    cameraId?: string;
    limit?: number;
}) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await getPersonTracking(options);

            if (error) {
                setError(error.message);
            } else if (data) {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, [options?.cameraId, options?.limit]);

    return { data, loading, error };
}

/**
 * Hook for multi-camera dashboard
 */
export function useMultiCameraDashboard() {
    const { cameras, loading: camerasLoading } = useActiveCameras();
    const { data: latestData, loading: dataLoading } = useLatestCrowdDataByCamera();
    const { alerts, loading: alertsLoading } = useActiveAlerts();

    const loading = camerasLoading || dataLoading || alertsLoading;

    // Calculate totals across all cameras
    const totals = latestData.reduce((acc, curr) => ({
        currentCount: acc.currentCount + (curr.current_count || 0),
        entries: acc.entries + (curr.entries || 0),
        exits: acc.exits + (curr.exits || 0),
        peakCount: Math.max(acc.peakCount, curr.peak_count || 0)
    }), { currentCount: 0, entries: 0, exits: 0, peakCount: 0 });

    return {
        cameras,
        latestData,
        alerts,
        totals,
        loading
    };
}
