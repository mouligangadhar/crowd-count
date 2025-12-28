import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { UsersIcon, TrendingUpIcon, ClockIcon, CalendarIcon, DownloadIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
// Mock data
const hourlyData = [{
  name: '6AM',
  value: 120
}, {
  name: '8AM',
  value: 450
}, {
  name: '10AM',
  value: 780
}, {
  name: '12PM',
  value: 1250
}, {
  name: '2PM',
  value: 980
}, {
  name: '4PM',
  value: 1100
}, {
  name: '6PM',
  value: 1450
}, {
  name: '8PM',
  value: 890
}, {
  name: '10PM',
  value: 320
}];
const weeklyData = [{
  name: 'Mon',
  value: 8500
}, {
  name: 'Tue',
  value: 9200
}, {
  name: 'Wed',
  value: 8800
}, {
  name: 'Thu',
  value: 9500
}, {
  name: 'Fri',
  value: 12000
}, {
  name: 'Sat',
  value: 15000
}, {
  name: 'Sun',
  value: 11000
}];
const zoneDistribution = [{
  name: 'Main Entrance',
  value: 35,
  color: '#06B6D4'
}, {
  name: 'Food Court',
  value: 25,
  color: '#A855F7'
}, {
  name: 'Retail Area',
  value: 20,
  color: '#3B82F6'
}, {
  name: 'Parking',
  value: 12,
  color: '#10B981'
}, {
  name: 'Others',
  value: 8,
  color: '#64748B'
}];
const peakHours = [{
  name: '12PM',
  value: 1250,
  color: '#EF4444'
}, {
  name: '6PM',
  value: 1450,
  color: '#EF4444'
}, {
  name: '2PM',
  value: 980,
  color: '#F97316'
}, {
  name: '4PM',
  value: 1100,
  color: '#F97316'
}, {
  name: '10AM',
  value: 780,
  color: '#F59E0B'
}];
export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('today');
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
  return <>
      <MobileLayout title="Analytics" subtitle="Crowd insights & trends" rightAction={<Button size="sm" variant="secondary" icon={<DownloadIcon className="w-4 h-4" />}>
            Export
          </Button>}>
        {/* Time range selector */}
        <div className="mb-4">
          <Tabs tabs={timeRangeTabs} activeTab={timeRange} onChange={setTimeRange} variant="pills" />
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Total Visitors" value={timeRange === 'today' ? 8547 : timeRange === 'week' ? 74000 : 285000} previousValue={timeRange === 'today' ? 7890 : timeRange === 'week' ? 68000 : 260000} icon={<UsersIcon className="w-5 h-5" />} iconColor="cyan" compact />
          <StatCard label="Peak Count" value={timeRange === 'today' ? 1450 : timeRange === 'week' ? 2100 : 2800} icon={<TrendingUpIcon className="w-5 h-5" />} iconColor="purple" compact />
          <StatCard label="Avg Dwell Time" value={45} suffix=" min" icon={<ClockIcon className="w-5 h-5" />} iconColor="blue" compact />
          <StatCard label="Alerts Triggered" value={timeRange === 'today' ? 12 : timeRange === 'week' ? 67 : 234} icon={<CalendarIcon className="w-5 h-5" />} iconColor="red" compact />
        </div>

        {/* Main trend chart */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Crowd Trend</h3>
            <div className="flex items-center gap-1 text-neon-green text-sm">
              <ArrowUpIcon className="w-4 h-4" />
              <span>8.3%</span>
            </div>
          </div>
          <LineChart data={timeRange === 'today' ? hourlyData : weeklyData} height={200} color="#06B6D4" />
        </Card>

        {/* Zone distribution */}
        <Card className="mb-4">
          <h3 className="font-semibold text-white mb-4">Zone Distribution</h3>
          <div className="flex items-center gap-6">
            <DonutChart data={zoneDistribution} centerValue="100%" centerLabel="Total" />
            <div className="flex-1 space-y-2">
              {zoneDistribution.map(zone => <div key={zone.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: zone.color
                }} />
                    <span className="text-sm text-slate-300">{zone.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {zone.value}%
                  </span>
                </div>)}
            </div>
          </div>
        </Card>

        {/* Peak hours */}
        <Card className="mb-4">
          <h3 className="font-semibold text-white mb-4">Peak Hours</h3>
          <BarChart data={peakHours} height={180} horizontal />
        </Card>

        {/* Comparison card */}
        <Card variant="neon" glowColor="purple">
          <h3 className="font-semibold text-white mb-3">vs Previous Period</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Visitors</span>
              <div className="flex items-center gap-1 text-neon-green">
                <ArrowUpIcon className="w-4 h-4" />
                <span className="font-medium">+8.3%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Peak Crowd</span>
              <div className="flex items-center gap-1 text-neon-green">
                <ArrowUpIcon className="w-4 h-4" />
                <span className="font-medium">+12.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg Dwell Time</span>
              <div className="flex items-center gap-1 text-neon-red">
                <ArrowDownIcon className="w-4 h-4" />
                <span className="font-medium">-5.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Alert Rate</span>
              <div className="flex items-center gap-1 text-neon-red">
                <ArrowDownIcon className="w-4 h-4" />
                <span className="font-medium">-15.8%</span>
              </div>
            </div>
          </div>
        </Card>
      </MobileLayout>
      <BottomNavigation />
    </>;
}