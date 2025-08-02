import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={popoverRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
          }
          if (child.type === PopoverContent && isOpen) {
            return child;
          }
        }
        return child;
      })}
    </div>
  );
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export const PopoverContent: React.FC<PopoverContentProps> = ({ children, className }) => {
  return (
    <div className={`absolute z-50 mt-2 p-4 bg-gray-800 border border-gray-600 rounded-md shadow-lg ${className || ''}`}>
      {children}
    </div>
  );
};
