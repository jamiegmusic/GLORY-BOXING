import React from 'react';

interface SwitchProps {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ 
  className, 
  checked = false, 
  onCheckedChange, 
  disabled = false 
}) => {
  const handleToggle = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-blue-600' : 'bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className || ''}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};
