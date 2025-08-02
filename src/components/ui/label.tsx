import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ children, className, ...props }) => {
  return (
    <label
      className={`text-sm font-medium text-gray-300 ${className || ''}`}
      {...props}
    >
      {children}
    </label>
  );
};
