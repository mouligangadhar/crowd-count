import React from 'react';
import { motion } from 'framer-motion';
type HeatmapCell = {
  id: string;
  label: string;
  value: number;
  maxValue?: number;
};
type HeatmapProps = {
  data: HeatmapCell[][];
  showLabels?: boolean;
  showValues?: boolean;
  cellSize?: 'sm' | 'md' | 'lg';
  onCellClick?: (cell: HeatmapCell) => void;
};
const getDensityColor = (value: number, maxValue: number = 100) => {
  const percentage = value / maxValue * 100;
  if (percentage < 25) return {
    bg: 'bg-neon-green/30',
    border: 'border-neon-green/50',
    text: 'text-neon-green'
  };
  if (percentage < 50) return {
    bg: 'bg-neon-yellow/30',
    border: 'border-neon-yellow/50',
    text: 'text-neon-yellow'
  };
  if (percentage < 75) return {
    bg: 'bg-neon-orange/30',
    border: 'border-neon-orange/50',
    text: 'text-neon-orange'
  };
  return {
    bg: 'bg-neon-red/30',
    border: 'border-neon-red/50',
    text: 'text-neon-red'
  };
};
const cellSizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20'
};
export function Heatmap({
  data,
  showLabels = true,
  showValues = true,
  cellSize = 'md',
  onCellClick
}: HeatmapProps) {
  return <div className="space-y-2">
      {data.map((row, rowIndex) => <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((cell, cellIndex) => {
        const colors = getDensityColor(cell.value, cell.maxValue);
        return <motion.button key={cell.id} initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: (rowIndex * row.length + cellIndex) * 0.05
        }} onClick={() => onCellClick?.(cell)} className={`
                  ${cellSizes[cellSize]} rounded-lg border
                  ${colors.bg} ${colors.border}
                  flex flex-col items-center justify-center
                  transition-transform hover:scale-105
                  ${onCellClick ? 'cursor-pointer' : 'cursor-default'}
                `}>
                {showLabels && <span className="text-[10px] text-slate-400 truncate max-w-full px-1">
                    {cell.label}
                  </span>}
                {showValues && <span className={`text-sm font-bold ${colors.text}`}>
                    {cell.value}
                  </span>}
              </motion.button>;
      })}
        </div>)}
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-neon-green/30 border border-neon-green/50" />
          <span className="text-slate-400">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-neon-yellow/30 border border-neon-yellow/50" />
          <span className="text-slate-400">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-neon-orange/30 border border-neon-orange/50" />
          <span className="text-slate-400">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-neon-red/30 border border-neon-red/50" />
          <span className="text-slate-400">Critical</span>
        </div>
      </div>
    </div>;
}