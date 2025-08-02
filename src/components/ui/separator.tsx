import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  className, 
  orientation = 'horizontal' 
}) => {
  const baseClasses = orientation === 'horizontal' 
    ? 'h-px w-full bg-gray-600' 
    : 'w-px h-full bg-gray-600';
    
  return (
    <div 
      className={`${baseClasses} ${className || ''}`}
      role="separator"
    />
  );
};
