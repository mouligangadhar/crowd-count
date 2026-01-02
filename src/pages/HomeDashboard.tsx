import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ActivityIcon, BellIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon, ArrowUpIcon, ArrowDownIcon, AlertCircleIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
import { useLatestCrowdCount, useCrowdStats, useCrowdDataByHour, useCrowdTrend } from '../hooks/useCrowdData';
import { useActiveAlerts, useLatestCrowdDataByCamera } from '../hooks/useEnhancedCrowdData';

export function HomeDashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Real data from crowd_log table
  const { count: currentCount, loading: countLoading } = useLatestCrowdCount();
  const { stats, loading: statsLoading } = useCrowdStats();
  const { data: hourlyData, loading: chartLoading } = useCrowdDataByHour();
  const { trend } = useCrowdTrend(30);

  // Real alerts and camera info from enhanced schema
  const { alerts: dbAlerts, loading: alertsLoading } = useActiveAlerts();
  const { data: cameraData, loading: cameraLoading } = useLatestCrowdDataByCamera();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Transform hourly data for chart
  const chartData = hourlyData.map(item => ({
    name: item.hour,
    value: item.avgCount
  }));

  // Get current camera capacity info
  const latestCam = cameraData && cameraData.length > 0 ? cameraData[0] : null;
  const maxCapacity = latestCam?.max_capacity || 50;
  const remainingSpace = Math.max(0, maxCapacity - (currentCount || 0));
  const occupancyPercentage = Math.min(100, Math.round(((currentCount || 0) / maxCapacity) * 100));

  const getTrendIcon = () => {
    if (trend === 'increasing') return <TrendingUpIcon className="w-4 h-4" />;
    if (trend === 'decreasing') return <TrendingDownIcon className="w-4 h-4" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'increasing') return 'text-neon-green';
    if (trend === 'decreasing') return 'text-neon-red';
    return 'text-slate-400';
  };

  const getTrendText = () => {
    if (trend === 'increasing') return 'Increasing';
    if (trend === 'decreasing') return 'Decreasing';
    return 'Stable';
  };

  const isLoading = countLoading || statsLoading || alertsLoading || cameraLoading;

  return <>
    <MobileLayout noPadding>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">CrowdVision</h1>
            <p className="text-sm text-slate-400">
              {time.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={occupancyPercentage > 90 ? "danger" : occupancyPercentage > 75 ? "warning" : "success"} dot pulse>
              {occupancyPercentage > 90 ? "Critical" : occupancyPercentage > 75 ? "Near Limit" : "Live Data"}
            </Badge>
            <motion.button whileTap={{
              scale: 0.95
            }} onClick={() => navigate('/alerts')} className="relative p-2 rounded-xl bg-dark-700 text-slate-400 hover:text-white">
              <BellIcon className="w-5 h-5" />
              {dbAlerts.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />}
            </motion.button>
          </div>
        </div>

        {/* Main stat - Real-time crowd count & Capacity */}
        <Card variant="neon" glowColor={occupancyPercentage > 90 ? "red" : occupancyPercentage > 75 ? "orange" : "cyan"} className="mb-4">
          {countLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Current Occupancy
                  </p>
                  <motion.div key={currentCount} initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gradient">
                      {currentCount !== null ? currentCount.toLocaleString() : '--'}
                    </span>
                    <span className="text-slate-400 font-medium">/ {maxCapacity}</span>
                  </motion.div>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${occupancyPercentage > 90 ? 'border-neon-red bg-neon-red/10' :
                  occupancyPercentage > 75 ? 'border-orange-500 bg-orange-500/10' :
                    'border-neon-cyan bg-neon-cyan/10'
                  }`}>
                  <span className={`text-sm font-bold ${occupancyPercentage > 90 ? 'text-neon-red' :
                    occupancyPercentage > 75 ? 'text-orange-500' :
                      'text-neon-cyan'
                    }`}>
                    {occupancyPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-dark-600 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancyPercentage}%` }}
                  className={`h-full ${occupancyPercentage > 90 ? 'bg-neon-red' :
                    occupancyPercentage > 75 ? 'bg-orange-500' :
                      'bg-neon-cyan'
                    }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 ${getTrendColor()} text-sm`}>
                  {getTrendIcon()}
                  <span>{getTrendText()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Remaining Space:</span>
                  <span className={`font-bold ${remainingSpace < 10 ? 'text-neon-red' : 'text-neon-green'}`}>
                    {remainingSpace}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Stats row - Real data */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-4">
        <StatCard
          label="Total In"
          value={stats?.totalEntries || 0}
          icon={<ArrowUpIcon className="w-5 h-5" />}
          iconColor="green"
          compact
        />
        <StatCard
          label="Total Out"
          value={stats?.totalExits || 0}
          icon={<ArrowDownIcon className="w-5 h-5" />}
          iconColor="red"
          compact
        />
        <StatCard
          label="Peak"
          value={stats?.peakCount || 0}
          icon={<TrendingUpIcon className="w-5 h-5" />}
          iconColor="purple"
          compact
        />
      </div>

      {/* Crowd trend chart - Real data */}
      <div className="px-4 mb-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Today's Trend</h2>
            <button onClick={() => navigate('/analytics')} className="text-sm text-neon-cyan flex items-center gap-1">
              View All <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[150px]">
              <div className="w-6 h-6 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            <LineChart data={chartData} height={150} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[150px] text-slate-500">
              <ActivityIcon className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No data available yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent alerts from Database */}
      {dbAlerts.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Active Alerts</h2>
            <button onClick={() => navigate('/alerts')} className="text-sm text-neon-cyan flex items-center gap-1">
              View All <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {dbAlerts.slice(0, 3).map((alert, index) => (
              <motion.div key={alert.id} initial={{
                opacity: 0,
                x: -10
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.1
              }}>
                <Card padding="sm" className={alert.alert_type === 'critical' ? 'pulse-critical' : ''}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${alert.alert_type === 'critical' ? 'bg-neon-red/20 text-neon-red' :
                      alert.alert_type === 'warning' ? 'bg-neon-yellow/20 text-neon-yellow' :
                        'bg-neon-blue/20 text-neon-blue'
                      }`}>
                      <AlertCircleIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{alert.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-500">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-[10px] text-slate-500">
                          {alert.camera_name || alert.zone || 'Live Camera'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {!isLoading && !stats && (
        <div className="px-4 pb-4">
          <Card>
            <div className="text-center py-8">
              <ActivityIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No Data Available</h3>
              <p className="text-sm text-slate-400">
                Connect your camera to see real-time analytics
              </p>
            </div>
          </Card>
        </div>
      )}
    </MobileLayout>
    <BottomNavigation />
  </>;
}
