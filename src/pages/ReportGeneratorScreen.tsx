import React, { useState } from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { FileTextIcon, DownloadIcon, MailIcon } from 'lucide-react';
export function ReportGeneratorScreen() {
  const [loading, setLoading] = useState(false);
  return <MobileLayout title="Generate Report" subtitle="Export analytics & logs" showBack>
      <Card variant="neon" padding="lg">
        <div className="space-y-4">
          <Select label="Report Type" options={[{
          value: 'daily',
          label: 'Daily Summary'
        }, {
          value: 'weekly',
          label: 'Weekly Analysis'
        }, {
          value: 'incident',
          label: 'Incident Log'
        }, {
          value: 'occupancy',
          label: 'Occupancy Heatmap'
        }]} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>

          <Select label="Format" options={[{
          value: 'pdf',
          label: 'PDF Document'
        }, {
          value: 'excel',
          label: 'Excel Spreadsheet'
        }, {
          value: 'csv',
          label: 'CSV Data'
        }]} />

          <div className="p-4 bg-dark-700 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-neon-blue/20 rounded-lg">
              <FileTextIcon className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <p className="text-white font-medium">Preview Available</p>
              <p className="text-sm text-slate-400">Estimated size: 2.4 MB</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" icon={<MailIcon className="w-4 h-4" />}>
              Email
            </Button>
            <Button className="flex-1" loading={loading} onClick={() => setLoading(true)} icon={<DownloadIcon className="w-4 h-4" />}>
              Download
            </Button>
          </div>
        </div>
      </Card>
    </MobileLayout>;
}