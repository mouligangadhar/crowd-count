import React from 'react';
type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  suffix?: string;
};
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  suffix = ''
}: SliderProps) {
  const percentage = (value - min) / (max - min) * 100;
  return <div className="w-full">
      {(label || showValue) && <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
          {showValue && <span className="text-sm font-mono text-neon-cyan">
              {value}
              {suffix}
            </span>}
        </div>}
      <div className="relative">
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 bg-dark-600 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-neon-cyan
            [&::-webkit-slider-thumb]:shadow-neon-cyan
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-neon-cyan
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer" style={{
        background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${percentage}%, #334155 ${percentage}%, #334155 100%)`
      }} />
      </div>
    </div>;
}