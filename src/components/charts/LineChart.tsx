import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
type DataPoint = {
  name: string;
  value: number;
  value2?: number;
};
type LineChartProps = {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  showArea?: boolean;
  color?: string;
  secondaryColor?: string;
  gradientId?: string;
};
export function LineChart({
  data,
  height = 200,
  showGrid = true,
  showArea = true,
  color = '#06B6D4',
  secondaryColor = '#A855F7',
  gradientId = 'lineGradient'
}: LineChartProps) {
  const hasSecondary = data.some(d => d.value2 !== undefined);
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          {payload.map((entry: any, index: number) => <p key={index} className="text-sm font-semibold" style={{
          color: entry.color
        }}>
              {entry.value.toLocaleString()}
            </p>)}
        </div>;
    }
    return null;
  };
  if (showArea) {
    return <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{
        top: 5,
        right: 5,
        left: -20,
        bottom: 5
      }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {hasSecondary && <linearGradient id={`${gradientId}-2`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
              </linearGradient>}
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />}
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
          fill: '#64748B',
          fontSize: 12
        }} />
          <YAxis axisLine={false} tickLine={false} tick={{
          fill: '#64748B',
          fontSize: 12
        }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} animationDuration={1500} />
          {hasSecondary && <Area type="monotone" dataKey="value2" stroke={secondaryColor} strokeWidth={2} fill={`url(#${gradientId}-2)`} animationDuration={1500} />}
        </AreaChart>
      </ResponsiveContainer>;
  }
  return <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{
      top: 5,
      right: 5,
      left: -20,
      bottom: 5
    }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />}
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
        fill: '#64748B',
        fontSize: 12
      }} />
        <YAxis axisLine={false} tickLine={false} tick={{
        fill: '#64748B',
        fontSize: 12
      }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{
        r: 6,
        fill: color
      }} animationDuration={1500} />
        {hasSecondary && <Line type="monotone" dataKey="value2" stroke={secondaryColor} strokeWidth={2} dot={false} activeDot={{
        r: 6,
        fill: secondaryColor
      }} animationDuration={1500} />}
      </RechartsLineChart>
    </ResponsiveContainer>;
}