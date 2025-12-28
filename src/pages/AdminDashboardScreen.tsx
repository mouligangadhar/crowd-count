import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { ServerIcon, UsersIcon, ActivityIcon, DatabaseIcon, ShieldAlertIcon } from 'lucide-react';
const systemLoad = [{
  name: '00:00',
  value: 20
}, {
  name: '04:00',
  value: 15
}, {
  name: '08:00',
  value: 45
}, {
  name: '12:00',
  value: 85
}, {
  name: '16:00',
  value: 70
}, {
  name: '20:00',
  value: 55
}];
const userActivity = [{
  name: 'Admin',
  value: 5
}, {
  name: 'Security',
  value: 12
}, {
  name: 'Manager',
  value: 3
}, {
  name: 'Operator',
  value: 8
}];
export function AdminDashboardScreen() {
  return <MobileLayout title="Admin Dashboard" subtitle="System overview" showBack>
      {/* System Health */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="System Status" value={99.9} suffix="%" icon={<ServerIcon className="w-5 h-5" />} iconColor="green" compact />
        <StatCard label="Active Users" value={28} icon={<UsersIcon className="w-5 h-5" />} iconColor="blue" compact />
      </div>

      {/* Server Load */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Server Load</h3>
          <div className="flex items-center gap-2 text-sm">
            <ActivityIcon className="w-4 h-4 text-neon-cyan" />
            <span className="text-slate-300">CPU: 45%</span>
          </div>
        </div>
        <LineChart data={systemLoad} height={180} color="#06B6D4" />
      </Card>

      {/* Storage & Database */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <DatabaseIcon className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-white">Storage</span>
          </div>
          <p className="text-2xl font-bold text-white">1.2 TB</p>
          <p className="text-xs text-slate-400">of 2.0 TB used</p>
          <div className="mt-2 h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full bg-neon-purple w-[60%]" />
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlertIcon className="w-4 h-4 text-neon-yellow" />
            <span className="text-sm font-medium text-white">Security</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400">Threats detected</p>
          <div className="mt-2 h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full bg-neon-green w-[100%]" />
          </div>
        </Card>
      </div>

      {/* User Distribution */}
      <Card>
        <h3 className="font-semibold text-white mb-4">User Roles Active</h3>
        <BarChart data={userActivity} height={180} horizontal />
      </Card>
    </MobileLayout>;
}