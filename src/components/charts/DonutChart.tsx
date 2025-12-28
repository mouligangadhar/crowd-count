import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
type DonutChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string | number;
};
export function DonutChart({
  data,
  size = 150,
  innerRadius = 50,
  outerRadius = 70,
  centerLabel,
  centerValue
}: DonutChartProps) {
  return <div className="relative" style={{
    width: size,
    height: size
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value" animationDuration={1500}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-2xl font-bold text-white">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-slate-400">{centerLabel}</span>}
        </div>}
    </div>;
}