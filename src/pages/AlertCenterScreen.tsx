import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon, InfoIcon } from 'lucide-react';
import { useActiveAlerts } from '../hooks/useEnhancedCrowdData';
import { acknowledgeAlert } from '../services/enhancedCrowdService';
import { useCrowdStats, useLatestCrowdCount, useCrowdTrend } from '../hooks/useCrowdData';

export function AlertCenterScreen() {
  const [filter, setFilter] = useState('all');

  // Use the NEW hook that fetches alerts from the Python project
  const { alerts: dbAlerts, loading: alertsLoading } = useActiveAlerts();

  // Stats for the "Current Status" card
  const { stats } = useCrowdStats();
  const { count: currentCount } = useLatestCrowdCount();
  const { trend } = useCrowdTrend(30);

  const filterTabs = [{
    id: 'all',
    label: 'All',
    count: dbAlerts.length
  }, {
    id: 'critical',
    label: 'Critical',
    count: dbAlerts.filter(a => a.alert_type === 'critical').length
  }, {
    id: 'warning',
    label: 'Warning',
    count: dbAlerts.filter(a => a.alert_type === 'warning').length
  }, {
    id: 'info',
    label: 'Info',
    count: dbAlerts.filter(a => a.alert_type === 'info' || a.alert_type === 'success').length
  }];

  const filteredAlerts = filter === 'all'
    ? dbAlerts
    : filter === 'info'
      ? dbAlerts.filter(a => a.alert_type === 'info' || a.alert_type === 'success')
      : dbAlerts.filter(a => a.alert_type === filter);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      default:
        return <InfoIcon className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-neon-red/20 text-neon-red border-neon-red/30';
      case 'warning':
        return 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30';
      case 'success':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      default:
        return 'bg-neon-blue/20 text-neon-blue border-neon-blue/30';
    }
  };

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlert(id);
    // The real-time subscription will automatically remove it from the list
  };

  return <>
    <MobileLayout title="Alert Center" subtitle="Real-time notifications">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card padding="md" className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-red/20 flex items-center justify-center">
            <XCircleIcon className="w-5 h-5 text-neon-red" />
          </div>
          <p className="text-2xl font-bold text-white">
            {dbAlerts.filter(a => a.alert_type === 'critical').length}
          </p>
          <p className="text-xs text-slate-400">Critical</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-yellow/20 flex items-center justify-center">
            <AlertTriangleIcon className="w-5 h-5 text-neon-yellow" />
          </div>
          <p className="text-2xl font-bold text-white">
            {dbAlerts.filter(a => a.alert_type === 'warning').length}
          </p>
          <p className="text-xs text-slate-400">Warning</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-blue/20 flex items-center justify-center">
            <InfoIcon className="w-5 h-5 text-neon-blue" />
          </div>
          <p className="text-2xl font-bold text-white">
            {dbAlerts.filter(a => a.alert_type === 'info' || a.alert_type === 'success').length}
          </p>
          <p className="text-xs text-slate-400">Info</p>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="mb-4">
        <Tabs
          tabs={filterTabs.map(tab => ({
            id: tab.id,
            label: `${tab.label} (${tab.count})`
          }))}
          activeTab={filter}
          onChange={setFilter}
          variant="pills"
        />
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {alertsLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    padding="md"
                    className={alert.alert_type === 'critical' ? 'pulse-critical' : ''}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getAlertColor(alert.alert_type)}`}>
                        {getAlertIcon(alert.alert_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm">
                            {alert.title}
                          </h3>
                          <Badge variant={alert.alert_type as any} size="sm">
                            {alert.alert_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <span>•</span>
                            <span>{alert.zone || 'Camera'}</span>
                          </div>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-xs text-neon-cyan hover:underline"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
                      <CheckCircleIcon className="w-8 h-8 text-neon-green" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">All Clear!</h3>
                    <p className="text-sm text-slate-400">
                      No active alerts from your camera system.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Info card */}
      {stats && currentCount !== null && (
        <Card variant="neon" glowColor="cyan" className="mt-4">
          <h3 className="font-semibold text-white mb-3">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Occupancy</span>
              <span className="font-medium text-white">{currentCount} people</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg Density</span>
              <span className="font-medium text-white">{stats.averageCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Trend</span>
              <span className={`font-medium ${trend === 'increasing' ? 'text-neon-green' : 'text-neon-red'}`}>
                {trend === 'increasing' ? '↑ Increasing' : trend === 'decreasing' ? '↓ Decreasing' : 'Stable'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </MobileLayout>
    <BottomNavigation />
  </>;
}