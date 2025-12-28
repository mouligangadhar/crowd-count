import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ClockIcon, UsersIcon, AlertTriangleIcon } from 'lucide-react';
const queues = [{
  id: 1,
  name: 'Ticket Counter',
  count: 12,
  waitTime: 5,
  status: 'good'
}, {
  id: 2,
  name: 'Security Check A',
  count: 45,
  waitTime: 15,
  status: 'warning'
}, {
  id: 3,
  name: 'Security Check B',
  count: 8,
  waitTime: 3,
  status: 'good'
}, {
  id: 4,
  name: 'Food Stall 1',
  count: 25,
  waitTime: 20,
  status: 'critical'
}];
export function QueueMonitorScreen() {
  return <MobileLayout title="Queue Monitoring" subtitle="Real-time wait times" showBack>
      <div className="space-y-4">
        {queues.map(queue => <Card key={queue.id} className={queue.status === 'critical' ? 'border-neon-red' : ''}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{queue.name}</h3>
              <Badge variant={queue.status === 'good' ? 'success' : queue.status === 'warning' ? 'warning' : 'danger'}>
                {queue.waitTime} min wait
              </Badge>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 text-slate-400">
                <UsersIcon className="w-4 h-4" />
                <span>{queue.count} people</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ClockIcon className="w-4 h-4" />
                <span>
                  ~{Math.round(queue.waitTime / queue.count * 10 * 10) / 10}{' '}
                  min/person
                </span>
              </div>
            </div>

            <ProgressBar value={queue.count} max={50} color={queue.status === 'good' ? 'green' : queue.status === 'warning' ? 'yellow' : 'red'} />

            {queue.status !== 'good' && <div className="mt-3 flex items-center gap-2 text-sm text-slate-300 bg-dark-700 p-2 rounded-lg">
                <AlertTriangleIcon className={`w-4 h-4 ${queue.status === 'critical' ? 'text-neon-red' : 'text-neon-yellow'}`} />
                <span>Recommendation: Open additional counter</span>
              </div>}
          </Card>)}
      </div>
    </MobileLayout>;
}