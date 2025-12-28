import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangleIcon, BellIcon, FilterIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MapPinIcon, CameraIcon, ChevronRightIcon, BellOffIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
type AlertType = 'critical' | 'warning' | 'info' | 'resolved';
type Alert = {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  zone: string;
  camera: string;
  time: string;
  timestamp: Date;
  acknowledged: boolean;
};
const mockAlerts: Alert[] = [{
  id: 1,
  type: 'critical',
  title: 'Overcrowding Detected',
  message: 'Crowd density exceeded 95% threshold at Main Entrance',
  zone: 'Zone A',
  camera: 'CAM-001',
  time: '2 min ago',
  timestamp: new Date(),
  acknowledged: false
}, {
  id: 2,
  type: 'critical',
  title: 'Emergency Exit Blocked',
  message: 'Obstruction detected near emergency exit in Food Court',
  zone: 'Zone B',
  camera: 'CAM-005',
  time: '8 min ago',
  timestamp: new Date(),
  acknowledged: false
}, {
  id: 3,
  type: 'warning',
  title: 'High Density Warning',
  message: 'Approaching 80% capacity threshold',
  zone: 'Zone C',
  camera: 'CAM-003',
  time: '15 min ago',
  timestamp: new Date(),
  acknowledged: true
}, {
  id: 4,
  type: 'warning',
  title: 'Unusual Movement Pattern',
  message: 'Rapid crowd movement detected in parking area',
  zone: 'Zone D',
  camera: 'CAM-007',
  time: '32 min ago',
  timestamp: new Date(),
  acknowledged: false
}, {
  id: 5,
  type: 'info',
  title: 'Camera Reconnected',
  message: 'CAM-004 is back online after maintenance',
  zone: 'System',
  camera: 'CAM-004',
  time: '1 hour ago',
  timestamp: new Date(),
  acknowledged: true
}, {
  id: 6,
  type: 'resolved',
  title: 'Overcrowding Resolved',
  message: 'Crowd density returned to normal levels',
  zone: 'Zone A',
  camera: 'CAM-001',
  time: '2 hours ago',
  timestamp: new Date(),
  acknowledged: true
}];
const alertStyles: Record<AlertType, {
  bg: string;
  border: string;
  icon: string;
  badge: 'danger' | 'warning' | 'info' | 'success';
}> = {
  critical: {
    bg: 'bg-neon-red/10',
    border: 'border-neon-red/30',
    icon: 'text-neon-red',
    badge: 'danger'
  },
  warning: {
    bg: 'bg-neon-yellow/10',
    border: 'border-neon-yellow/30',
    icon: 'text-neon-yellow',
    badge: 'warning'
  },
  info: {
    bg: 'bg-neon-blue/10',
    border: 'border-neon-blue/30',
    icon: 'text-neon-blue',
    badge: 'info'
  },
  resolved: {
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    icon: 'text-neon-green',
    badge: 'success'
  }
};
export function AlertCenterScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(mockAlerts);
  const filterTabs = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'critical',
    label: 'Critical'
  }, {
    id: 'warning',
    label: 'Warning'
  }, {
    id: 'resolved',
    label: 'Resolved'
  }];
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.type === filter;
  });
  const handleAcknowledge = (id: number) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? {
      ...alert,
      acknowledged: true
    } : alert));
  };
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
  return <>
      <MobileLayout title="Alert Center" subtitle={`${criticalCount} critical • ${warningCount} warnings`} rightAction={<button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <BellOffIcon className="w-5 h-5" />
          </button>}>
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card padding="sm" className={criticalCount > 0 ? 'pulse-critical' : ''}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-red/20">
                <AlertTriangleIcon className="w-5 h-5 text-neon-red" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{criticalCount}</p>
                <p className="text-xs text-slate-400">Critical</p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-yellow/20">
                <BellIcon className="w-5 h-5 text-neon-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{warningCount}</p>
                <p className="text-xs text-slate-400">Warnings</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="mb-4">
          <Tabs tabs={filterTabs} activeTab={filter} onChange={setFilter} variant="pills" />
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
            const styles = alertStyles[alert.type];
            return <motion.div key={alert.id} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              x: -100
            }} transition={{
              delay: index * 0.05
            }}>
                  <Card padding="none" className={`overflow-hidden border ${styles.border} ${alert.type === 'critical' && !alert.acknowledged ? 'pulse-critical' : ''}`}>
                    <div className={`${styles.bg} p-4`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-dark-800/50 ${styles.icon}`}>
                          {alert.type === 'resolved' ? <CheckCircleIcon className="w-5 h-5" /> : <AlertTriangleIcon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-white">
                              {alert.title}
                            </h3>
                            <Badge variant={styles.badge} size="sm">
                              {alert.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {alert.zone}
                            </span>
                            <span className="flex items-center gap-1">
                              <CameraIcon className="w-3 h-3" />
                              {alert.camera}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {!alert.acknowledged && alert.type !== 'resolved' && <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-600/50">
                          <Button size="sm" variant="secondary" onClick={() => handleAcknowledge(alert.id)} className="flex-1">
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => navigate(`/camera/${alert.id}`)} className="flex-1">
                            View Camera
                          </Button>
                        </div>}
                      {alert.acknowledged && <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-600/50 text-sm text-slate-500">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Acknowledged</span>
                        </div>}
                    </div>
                  </Card>
                </motion.div>;
          })}
          </AnimatePresence>
        </div>

        {filteredAlerts.length === 0 && <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
              <BellIcon className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400">No alerts to display</p>
          </div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}