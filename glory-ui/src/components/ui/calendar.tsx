import React from 'react';

interface CalendarProps {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  className, 
  selectedDate, 
  onDateSelect 
}) => {
  // Simple date input for now - can be enhanced later
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <input
      type="date"
      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className || ''}`}
      value={selectedDate ? formatDateForInput(selectedDate) : ''}
      onChange={handleDateChange}
    />
  );
};
