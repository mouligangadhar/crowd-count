import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PlusIcon, MoreVerticalIcon } from 'lucide-react';
const users = [{
  id: 1,
  name: 'John Smith',
  role: 'Security',
  status: 'active',
  email: 'john@crowdvision.com'
}, {
  id: 2,
  name: 'Sarah Connor',
  role: 'Admin',
  status: 'active',
  email: 'sarah@crowdvision.com'
}, {
  id: 3,
  name: 'Mike Ross',
  role: 'Manager',
  status: 'offline',
  email: 'mike@crowdvision.com'
}, {
  id: 4,
  name: 'Jane Doe',
  role: 'Operator',
  status: 'active',
  email: 'jane@crowdvision.com'
}];
export function UserManagementScreen() {
  return <MobileLayout title="User Management" subtitle="Manage access & permissions" showBack rightAction={<Button size="sm" icon={<PlusIcon className="w-4 h-4" />}>
          Add
        </Button>}>
      <div className="space-y-3">
        {users.map(user => <Card key={user.id} padding="sm">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="md" status={user.status as any} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white truncate">
                    {user.name}
                  </h3>
                  <Badge variant="neutral" size="sm">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                <MoreVerticalIcon className="w-5 h-5" />
              </button>
            </div>
          </Card>)}
      </div>
    </MobileLayout>;
}