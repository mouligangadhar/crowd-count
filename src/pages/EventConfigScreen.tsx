import React, { useState } from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
export function EventConfigScreen() {
  const [loading, setLoading] = useState(false);
  return <MobileLayout title="Event Configuration" subtitle="Set up temporary monitoring" showBack>
      <Card variant="neon" padding="lg">
        <div className="space-y-4">
          <Input label="Event Name" placeholder="e.g., Summer Concert" icon={<CalendarIcon className="w-5 h-5" />} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="Start Time" type="time" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="End Date" type="date" />
            <Input label="End Time" type="time" />
          </div>

          <Select label="Primary Zone" options={[{
          value: 'hall',
          label: 'Event Hall'
        }, {
          value: 'outdoor',
          label: 'Outdoor Area'
        }, {
          value: 'all',
          label: 'Entire Venue'
        }]} />

          <Input label="Expected Attendance" type="number" placeholder="5000" />

          <div className="pt-4 border-t border-dark-600 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Strict Thresholds</p>
                <p className="text-sm text-slate-400">
                  Lower alert triggers for safety
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Report Generation</p>
                <p className="text-sm text-slate-400">
                  Email report after event
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>

          <div className="pt-4">
            <Button fullWidth loading={loading} onClick={() => setLoading(true)}>
              Activate Event Mode
            </Button>
          </div>
        </div>
      </Card>
    </MobileLayout>;
}