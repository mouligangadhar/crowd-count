import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
type DataPoint = {
  name: string;
  value: number;
  color?: string;
};
type BarChartProps = {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  color?: string;
  horizontal?: boolean;
  showLabels?: boolean;
};
export function BarChart({
  data,
  height = 200,
  showGrid = true,
  color = '#06B6D4',
  horizontal = false,
  showLabels = false
}: BarChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className="text-sm font-semibold text-neon-cyan">
            {payload[0].value.toLocaleString()}
          </p>
        </div>;
    }
    return null;
  };
  if (horizontal) {
    return <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} layout="vertical" margin={{
        top: 5,
        right: 30,
        left: 40,
        bottom: 5
      }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />}
          <XAxis type="number" axisLine={false} tickLine={false} tick={{
          fill: '#64748B',
          fontSize: 12
        }} />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{
          fill: '#64748B',
          fontSize: 12
        }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || color} />)}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>;
  }
  return <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{
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
        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || color} />)}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>;
}