import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { UserIcon, SettingsIcon, BellIcon, ShieldIcon, LogOutIcon, MoonIcon, HelpCircleIcon, ChevronRightIcon } from 'lucide-react';
export function ProfileScreen() {
  const navigate = useNavigate();
  const menuItems = [{
    icon: <UserIcon className="w-5 h-5" />,
    label: 'Account Settings',
    path: '/profile/edit'
  }, {
    icon: <BellIcon className="w-5 h-5" />,
    label: 'Notifications',
    path: '/profile/notifications'
  }, {
    icon: <MoonIcon className="w-5 h-5" />,
    label: 'Appearance',
    path: '/profile/theme'
  }, {
    icon: <ShieldIcon className="w-5 h-5" />,
    label: 'Security & Privacy',
    path: '/profile/security'
  }, {
    icon: <HelpCircleIcon className="w-5 h-5" />,
    label: 'Help & Support',
    path: '/help'
  }];
  return <>
      <MobileLayout title="Profile" rightAction={<SettingsIcon className="w-5 h-5 text-slate-400" />}>
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 relative">
            <Avatar name="John Smith" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" size="xl" status="online" />
          </div>
          <h2 className="text-xl font-bold text-white">John Smith</h2>
          <p className="text-slate-400">Security Supervisor</p>
          <div className="mt-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium">
            Admin Access
          </div>
        </div>

        {/* Menu */}
        <Card padding="none" className="overflow-hidden mb-6">
          {menuItems.map((item, index) => <button key={index} onClick={() => navigate(item.path)} className="w-full flex items-center justify-between p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-slate-400">{item.icon}</div>
                <span className="text-white">{item.label}</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-500" />
            </button>)}
        </Card>

        <Button variant="secondary" fullWidth icon={<LogOutIcon className="w-4 h-4" />} onClick={() => navigate('/login')} className="text-neon-red border-neon-red/30 hover:bg-neon-red/10">
          Log Out
        </Button>

        <p className="text-center text-xs text-slate-600 mt-6">
          CrowdVision v2.1.0 (Build 458)
        </p>
      </MobileLayout>
      <BottomNavigation />
    </>;
}