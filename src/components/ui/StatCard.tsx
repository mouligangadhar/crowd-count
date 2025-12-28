import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { Card } from './Card';
type StatCardProps = {
  label: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  iconColor?: 'cyan' | 'purple' | 'blue' | 'green' | 'red' | 'yellow';
  animate?: boolean;
  compact?: boolean;
};
const iconBgColors = {
  cyan: 'bg-neon-cyan/20 text-neon-cyan',
  purple: 'bg-neon-purple/20 text-neon-purple',
  blue: 'bg-neon-blue/20 text-neon-blue',
  green: 'bg-neon-green/20 text-neon-green',
  red: 'bg-neon-red/20 text-neon-red',
  yellow: 'bg-neon-yellow/20 text-neon-yellow'
};
export function StatCard({
  label,
  value,
  previousValue,
  suffix = '',
  prefix = '',
  icon,
  iconColor = 'cyan',
  animate = true,
  compact = false
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, animate]);
  const trend = previousValue !== undefined ? (value - previousValue) / previousValue * 100 : null;
  const isPositive = trend !== null && trend >= 0;
  return <Card padding={compact ? 'sm' : 'md'} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex items-baseline gap-1">
            <span className={`font-bold text-white ${compact ? 'text-2xl' : 'text-3xl'}`}>
              {prefix}
              {displayValue.toLocaleString()}
              {suffix}
            </span>
          </motion.div>
          {trend !== null && <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-neon-green' : 'text-neon-red'}`}>
              {isPositive ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
              <span className="text-slate-500">vs last period</span>
            </div>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColors[iconColor]}`}>
          {icon}
        </div>
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-neon-cyan/5 pointer-events-none" />
    </Card>;
}