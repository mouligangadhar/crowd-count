import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldIcon, CalendarIcon, StoreIcon, SettingsIcon, CheckIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
type Role = 'admin' | 'security' | 'event' | 'mall';
type RoleOption = {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
};
const roles: RoleOption[] = [{
  id: 'admin',
  title: 'Administrator',
  description: 'Full system access and user management',
  icon: <SettingsIcon className="w-6 h-6" />,
  color: 'purple',
  features: ['User management', 'System configuration', 'All analytics', 'Camera management']
}, {
  id: 'security',
  title: 'Security Staff',
  description: 'Monitor crowds and respond to alerts',
  icon: <ShieldIcon className="w-6 h-6" />,
  color: 'cyan',
  features: ['Live monitoring', 'Alert response', 'Incident reporting', 'Team chat']
}, {
  id: 'event',
  title: 'Event Manager',
  description: 'Manage event crowd monitoring',
  icon: <CalendarIcon className="w-6 h-6" />,
  color: 'blue',
  features: ['Event setup', 'Crowd analytics', 'Staff allocation', 'Reports']
}, {
  id: 'mall',
  title: 'Mall Operator',
  description: 'Monitor retail space occupancy',
  icon: <StoreIcon className="w-6 h-6" />,
  color: 'green',
  features: ['Zone monitoring', 'Occupancy tracking', 'Queue management', 'Daily reports']
}];
const colorClasses: Record<string, {
  bg: string;
  border: string;
  text: string;
  shadow: string;
}> = {
  purple: {
    bg: 'bg-neon-purple/20',
    border: 'border-neon-purple',
    text: 'text-neon-purple',
    shadow: 'shadow-neon-purple'
  },
  cyan: {
    bg: 'bg-neon-cyan/20',
    border: 'border-neon-cyan',
    text: 'text-neon-cyan',
    shadow: 'shadow-neon-cyan'
  },
  blue: {
    bg: 'bg-neon-blue/20',
    border: 'border-neon-blue',
    text: 'text-neon-blue',
    shadow: 'shadow-neon-blue'
  },
  green: {
    bg: 'bg-neon-green/20',
    border: 'border-neon-green',
    text: 'text-neon-green',
    shadow: 'shadow-neon-green'
  }
};
export function RoleSelectionScreen() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    navigate('/home');
  };
  return <div className="min-h-screen bg-dark-900 cyber-grid flex flex-col">
      {/* Header gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-neon-cyan/10 via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col px-4 py-8 max-w-md mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Select Your Role
          </h1>
          <p className="text-slate-400">Choose how you'll use CrowdVision</p>
        </motion.div>

        {/* Role cards */}
        <div className="space-y-3 flex-1">
          {roles.map((role, index) => {
          const colors = colorClasses[role.color];
          const isSelected = selectedRole === role.id;
          return <motion.button key={role.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.1
          }} onClick={() => setSelectedRole(role.id)} className={`
                  w-full text-left p-4 rounded-2xl border-2 transition-all
                  ${isSelected ? `${colors.border} ${colors.bg} ${colors.shadow}` : 'border-dark-600 bg-dark-800 hover:border-dark-500'}
                `}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{role.title}</h3>
                      {isSelected && <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} className={`w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}>
                          <CheckIcon className="w-4 h-4" />
                        </motion.div>}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {role.description}
                    </p>
                    {isSelected && <motion.div initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} className="mt-3 pt-3 border-t border-dark-600">
                        <p className="text-xs text-slate-500 mb-2">
                          Features included:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {role.features.map(feature => <span key={feature} className="text-xs px-2 py-1 rounded-full bg-dark-700 text-slate-300">
                              {feature}
                            </span>)}
                        </div>
                      </motion.div>}
                  </div>
                </div>
              </motion.button>;
        })}
        </div>

        {/* Continue button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="mt-6">
          <Button fullWidth disabled={!selectedRole} loading={loading} onClick={handleContinue} icon={<ArrowRightIcon className="w-4 h-4" />} iconPosition="right">
            Continue as{' '}
            {selectedRole ? roles.find(r => r.id === selectedRole)?.title : '...'}
          </Button>
        </motion.div>
      </div>
    </div>;
}