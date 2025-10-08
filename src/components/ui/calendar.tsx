import React from 'react';

interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled = false
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(selected);

  const handleDateSelect = (date: Date) => {
    if (disabled) return;
    setSelectedDate(date);
    onSelect?.(date);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={`p-3 ${className || ''}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded"
          disabled={disabled}
        >
          ←
        </button>
        <div className="font-semibold">
          {monthNames[month]} {year}
        </div>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
          disabled={disabled}
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(year, month, day);
          const isSelected = selectedDate && 
            date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={day}
              onClick={() => handleDateSelect(date)}
              disabled={disabled}
              className={`
                h-8 rounded text-sm
                ${isSelected ? 'bg-blue-500 text-white' : ''}
                ${isToday && !isSelected ? 'border border-blue-500' : ''}
                ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}