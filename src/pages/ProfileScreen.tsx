import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserIcon, SettingsIcon, BellIcon, ShieldIcon, LogOutIcon, MoonIcon, HelpCircleIcon, ChevronRightIcon, MailIcon, PhoneIcon, BuildingIcon, BriefcaseIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Extract user metadata
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const phone = user?.user_metadata?.phone || 'Not provided';
  const organization = user?.user_metadata?.organization || 'Not specified';
  const role = user?.user_metadata?.role || 'user';
  const department = user?.user_metadata?.department || '';

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Role display mapping
  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'security': 'Security Staff',
      'event_manager': 'Event Manager',
      'mall_operator': 'Mall Operator',
      'admin': 'Administrator',
    };
    return roleMap[role] || role;
  };

  // Generate avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-neon-cyan to-neon-blue',
      'from-neon-purple to-neon-pink',
      'from-neon-green to-neon-cyan',
      'from-neon-orange to-neon-red',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

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
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="flex flex-col items-center mb-8">
        <div className="mb-4 relative">
          {/* Avatar with gradient background */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarColor(fullName)} flex items-center justify-center shadow-lg shadow-neon-cyan/20 ring-4 ring-dark-800`}>
            <span className="text-3xl font-bold text-white">
              {getInitials(fullName)}
            </span>
          </div>
          {/* Online status indicator */}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-neon-green rounded-full border-4 border-dark-900" />
        </div>
        <h2 className="text-xl font-bold text-white">{fullName}</h2>
        <p className="text-slate-400">{getRoleDisplay(role)}</p>
        {department && <p className="text-sm text-slate-500">{department}</p>}
        <div className="mt-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium">
          {role === 'admin' ? 'Admin Access' : 'Active User'}
        </div>
      </motion.div>

      {/* User Info Card */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }}>
        <Card padding="lg" className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-white break-all">{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneIcon className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-white">{phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BuildingIcon className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Organization</p>
                <p className="text-white">{organization}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BriefcaseIcon className="w-5 h-5 text-neon-orange flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-white">{getRoleDisplay(role)}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Menu */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }}>
        <Card padding="none" className="overflow-hidden mb-6">
          {menuItems.map((item, index) => <button key={index} onClick={() => navigate(item.path)} className="w-full flex items-center justify-between p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="text-slate-400">{item.icon}</div>
              <span className="text-white">{item.label}</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-slate-500" />
          </button>)}
        </Card>
      </motion.div>

      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
        <Button variant="secondary" fullWidth icon={<LogOutIcon className="w-4 h-4" />} onClick={handleLogout} className="text-neon-red border-neon-red/30 hover:bg-neon-red/10">
          Log Out
        </Button>
      </motion.div>

      <p className="text-center text-xs text-slate-600 mt-6">
        CrowdVision v2.1.0 (Build 458)
      </p>
    </MobileLayout>
    <BottomNavigation />
  </>;
}