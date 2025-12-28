import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { LineChart } from '../components/charts/LineChart';
import { Badge } from '../components/ui/Badge';
import { TrendingUpIcon, ClockIcon, AlertTriangleIcon, CalendarIcon, CloudRainIcon } from 'lucide-react';
const predictionData = [{
  name: 'Now',
  value: 850,
  value2: 800
}, {
  name: '+1h',
  value: 920,
  value2: 850
}, {
  name: '+2h',
  value: 1100,
  value2: 900
}, {
  name: '+3h',
  value: 1250,
  value2: 950
}, {
  name: '+4h',
  value: 1150,
  value2: 900
}, {
  name: '+5h',
  value: 980,
  value2: 800
}];
export function FlowPredictionScreen() {
  return <MobileLayout title="AI Flow Prediction" subtitle="Crowd forecast for next 5 hours" showBack>
      {/* Main forecast card */}
      <Card variant="neon" glowColor="purple" className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Predicted Peak</p>
            <p className="text-3xl font-bold text-white">1,250</p>
            <p className="text-sm text-neon-cyan">in 3 hours</p>
          </div>
          <div className="text-right">
            <Badge variant="warning" pulse>
              High Traffic Expected
            </Badge>
          </div>
        </div>
        <LineChart data={predictionData} height={200} color="#A855F7" secondaryColor="#334155" />
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-neon-purple rounded-full" />
            <span>Prediction</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-slate-600 rounded-full" />
            <span>Historical Avg</span>
          </div>
        </div>
      </Card>

      {/* Contributing factors */}
      <h3 className="font-semibold text-white mb-3">Contributing Factors</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-medium text-white">Weekend</span>
          </div>
          <p className="text-xs text-slate-400">+25% traffic expected</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <CloudRainIcon className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">
              Clear Weather
            </span>
          </div>
          <p className="text-xs text-slate-400">Normal outdoor flow</p>
        </Card>
      </div>

      {/* Recommendations */}
      <h3 className="font-semibold text-white mb-3">AI Recommendations</h3>
      <div className="space-y-3">
        <Card className="border-l-4 border-l-neon-yellow">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-neon-yellow flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Increase Staff at Zone A</p>
              <p className="text-sm text-slate-400">
                Predicted bottleneck at main entrance in 2 hours.
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-neon-blue">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-neon-blue flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Open Overflow Parking</p>
              <p className="text-sm text-slate-400">
                Parking capacity expected to reach 90% by 2 PM.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>;
}