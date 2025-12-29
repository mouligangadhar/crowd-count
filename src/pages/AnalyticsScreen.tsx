import { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { UsersIcon, TrendingUpIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon, ActivityIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCrowdStats, useCrowdDataByHour, useCrowdLogs } from '../hooks/useCrowdData';

export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('today');

  // Get real data from crowd_log
  const { stats, loading: statsLoading } = useCrowdStats();
  const { data: hourlyData, loading: hourlyLoading } = useCrowdDataByHour();
  const { logs, loading: logsLoading } = useCrowdLogs({ limit: 100 });

  const timeRangeTabs = [{
    id: 'today',
    label: 'Today'
  }, {
    id: 'week',
    label: 'Week'
  }, {
    id: 'month',
    label: 'Month'
  }];

  // Transform hourly data for chart
  const chartData = hourlyData.map(item => ({
    name: item.hour,
    value: item.avgCount
  }));

  // Calculate peak hours from hourly data
  const peakHoursData = [...hourlyData]
    .sort((a, b) => b.avgCount - a.avgCount)
    .slice(0, 5)
    .map(item => ({
      name: item.hour,
      value: item.avgCount,
      color: item.avgCount > (stats?.averageCount || 0) * 1.5 ? '#EF4444' :
        item.avgCount > (stats?.averageCount || 0) * 1.2 ? '#F97316' : '#F59E0B'
    }));

  // Calculate entry/exit distribution
  const flowData = [
    {
      name: 'Entries',
      value: stats?.totalEntries || 0,
      color: '#10B981'
    },
    {
      name: 'Exits',
      value: stats?.totalExits || 0,
      color: '#EF4444'
    }
  ];

  // Calculate percentage change (mock for now - you can enhance this)
  const percentChange = stats ? ((stats.currentCount - stats.averageCount) / stats.averageCount * 100).toFixed(1) : 0;
  const isPositive = Number(percentChange) >= 0;

  const exportData = () => {
    // Create CSV from logs
    if (logs.length === 0) return;

    const headers = ['Timestamp', 'Entries', 'Exits', 'Current Count'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.entries,
      log.exits,
      log.current_count
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crowd-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const isLoading = statsLoading || hourlyLoading || logsLoading;

  return <>
    <MobileLayout title="Analytics" subtitle="Crowd insights & trends" rightAction={<Button size="sm" variant="secondary" icon={<DownloadIcon className="w-4 h-4" />} onClick={exportData} disabled={logs.length === 0}>
      Export
    </Button>}>
      {/* Time range selector */}
      <div className="mb-4">
        <Tabs tabs={timeRangeTabs} activeTab={timeRange} onChange={setTimeRange} variant="pills" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Total Entries"
              value={stats.totalEntries}
              icon={<ArrowUpIcon className="w-5 h-5" />}
              iconColor="green"
              compact
            />
            <StatCard
              label="Total Exits"
              value={stats.totalExits}
              icon={<ArrowDownIcon className="w-5 h-5" />}
              iconColor="red"
              compact
            />
            <StatCard
              label="Peak Count"
              value={stats.peakCount}
              icon={<TrendingUpIcon className="w-5 h-5" />}
              iconColor="purple"
              compact
            />
            <StatCard
              label="Average Count"
              value={stats.averageCount}
              icon={<UsersIcon className="w-5 h-5" />}
              iconColor="cyan"
              compact
            />
          </div>

          {/* Main trend chart */}
          {chartData.length > 0 && (
            <Card className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Crowd Trend</h3>
                <div className={`flex items-center gap-1 ${isPositive ? 'text-neon-green' : 'text-neon-red'} text-sm`}>
                  {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  <span>{Math.abs(Number(percentChange))}%</span>
                </div>
              </div>
              <LineChart data={chartData} height={200} color="#06B6D4" />
            </Card>
          )}

          {/* Flow distribution */}
          <Card className="mb-4">
            <h3 className="font-semibold text-white mb-4">Entry/Exit Flow</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                    <ArrowUpIcon className="w-5 h-5 text-neon-green" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Entries</p>
                    <p className="text-xl font-bold text-white">{stats.totalEntries.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Percentage</p>
                  <p className="text-lg font-bold text-neon-green">
                    {((stats.totalEntries / (stats.totalEntries + stats.totalExits)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neon-red/20 flex items-center justify-center">
                    <ArrowDownIcon className="w-5 h-5 text-neon-red" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Exits</p>
                    <p className="text-xl font-bold text-white">{stats.totalExits.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Percentage</p>
                  <p className="text-lg font-bold text-neon-red">
                    {((stats.totalExits / (stats.totalEntries + stats.totalExits)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Net Change</p>
                  <p className={`text-2xl font-bold ${stats.totalEntries - stats.totalExits >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                    {stats.totalEntries - stats.totalExits >= 0 ? '+' : ''}
                    {(stats.totalEntries - stats.totalExits).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Peak hours */}
          {peakHoursData.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-semibold text-white mb-4">Peak Hours</h3>
              <BarChart data={peakHoursData} height={180} horizontal />
            </Card>
          )}

          {/* Summary card */}
          <Card variant="neon" glowColor="purple">
            <h3 className="font-semibold text-white mb-3">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Count</span>
                <span className="font-medium text-white">{stats.currentCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peak Count</span>
                <span className="font-medium text-white">{stats.peakCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Average Count</span>
                <span className="font-medium text-white">{stats.averageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Logs</span>
                <span className="font-medium text-white">{logs.length}</span>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <ActivityIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">No Analytics Data</h3>
            <p className="text-sm text-slate-400 mb-4">
              Add entries to the crowd_log table to see analytics
            </p>
            <div className="text-xs text-slate-500 bg-dark-700 rounded-lg p-3 text-left">
              <p className="font-mono mb-2">INSERT INTO crowd_log (entries, exits, current_count)</p>
              <p className="font-mono">VALUES (10, 5, 25);</p>
            </div>
          </div>
        </Card>
      )}
    </MobileLayout>
    <BottomNavigation />
  </>;
}