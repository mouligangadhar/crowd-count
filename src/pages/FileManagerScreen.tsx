import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { FileTextIcon, DownloadIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { Input } from '../components/ui/Input';
const files = [{
  id: 1,
  name: 'Daily_Report_Oct24.pdf',
  size: '2.4 MB',
  date: 'Today, 10:00 AM'
}, {
  id: 2,
  name: 'Incident_Log_Oct23.xlsx',
  size: '1.1 MB',
  date: 'Yesterday, 5:30 PM'
}, {
  id: 3,
  name: 'Weekly_Analysis_W42.pdf',
  size: '5.8 MB',
  date: 'Oct 22, 9:00 AM'
}, {
  id: 4,
  name: 'Camera_Snapshots.zip',
  size: '45 MB',
  date: 'Oct 20, 2:15 PM'
}];
export function FileManagerScreen() {
  return <MobileLayout title="Files" subtitle="Stored reports & logs" showBack>
      <div className="mb-4">
        <Input placeholder="Search files..." icon={<SearchIcon className="w-5 h-5" />} />
      </div>

      <div className="space-y-3">
        {files.map(file => <Card key={file.id} padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-dark-700 rounded-lg">
                  <FileTextIcon className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {file.size} • {file.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white">
                  <DownloadIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-neon-red">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>)}
      </div>
    </MobileLayout>;
}