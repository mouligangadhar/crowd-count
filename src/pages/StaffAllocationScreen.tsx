import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { UsersIcon, MapPinIcon, GripVerticalIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
type Staff = {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'offline';
  avatar?: string;
};
type ZoneAllocation = {
  zoneId: string;
  zoneName: string;
  required: number;
  staff: Staff[];
};
const initialAllocations: ZoneAllocation[] = [{
  zoneId: 'A',
  zoneName: 'Main Entrance',
  required: 3,
  staff: [{
    id: '1',
    name: 'John Smith',
    role: 'Guard',
    status: 'active'
  }, {
    id: '2',
    name: 'Sarah Connor',
    role: 'Supervisor',
    status: 'active'
  }]
}, {
  zoneId: 'B',
  zoneName: 'Food Court',
  required: 2,
  staff: [{
    id: '3',
    name: 'Mike Ross',
    role: 'Guard',
    status: 'break'
  }]
}, {
  zoneId: 'Unassigned',
  zoneName: 'Available Staff',
  required: 0,
  staff: [{
    id: '4',
    name: 'Jane Doe',
    role: 'Guard',
    status: 'active'
  }, {
    id: '5',
    name: 'Tom Hardy',
    role: 'Guard',
    status: 'active'
  }]
}];
export function StaffAllocationScreen() {
  const [allocations, setAllocations] = useState(initialAllocations);
  // Note: Full drag and drop would require a more complex library like dnd-kit or react-beautiful-dnd
  // For this demo, we'll simulate the UI structure
  return <MobileLayout title="Staff Allocation" subtitle="Manage security deployment" showBack rightAction={<Button size="sm" icon={<PlusIcon className="w-4 h-4" />}>
          Add
        </Button>}>
      <div className="space-y-6">
        {allocations.map(zone => <div key={zone.zoneId}>
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                {zone.zoneId !== 'Unassigned' && <MapPinIcon className="w-4 h-4 text-neon-cyan" />}
                {zone.zoneName}
              </h3>
              {zone.zoneId !== 'Unassigned' && <Badge variant={zone.staff.length < zone.required ? 'warning' : 'success'} size="sm">
                  {zone.staff.length}/{zone.required} Staff
                </Badge>}
            </div>

            <div className="space-y-2 min-h-[60px] bg-dark-800/50 rounded-xl p-2 border border-dashed border-dark-600">
              {zone.staff.map(staff => <motion.div key={staff.id} layoutId={staff.id} className="bg-dark-700 p-3 rounded-lg flex items-center gap-3 border border-dark-600 shadow-sm">
                  <GripVerticalIcon className="w-4 h-4 text-slate-500 cursor-grab" />
                  <Avatar name={staff.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {staff.name}
                    </p>
                    <p className="text-xs text-slate-400">{staff.role}</p>
                  </div>
                  <Badge variant={staff.status === 'active' ? 'success' : staff.status === 'break' ? 'warning' : 'offline'} size="sm" dot>
                    {staff.status}
                  </Badge>
                </motion.div>)}
              {zone.staff.length === 0 && <div className="text-center py-4 text-slate-500 text-sm">
                  No staff assigned
                </div>}
            </div>
          </div>)}
      </div>

      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
        <Button fullWidth>Save Allocation</Button>
      </div>
    </MobileLayout>;
}