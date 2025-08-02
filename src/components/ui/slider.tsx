import React from 'react';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, value = 0, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      onValueChange?.(newValue);
      onChange?.(event);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}: {value}
          </label>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${className || ''}`}
          {...props}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';
