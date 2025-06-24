// src/components/common/DatePicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DatePicker Component
 *
 * Reusable date picker component with consistent styling
 * Specifically optimized for date of birth selection
 *
 * @param {Object} props
 * @param {string|JSX.Element} props.label - Label for the input
 * @param {string} props.name - Name attribute
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.maxDate - Maximum selectable date
 * @param {string} props.minDate - Minimum selectable date
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 */
const DatePicker = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  minDate = null,
  maxDate = null,
  className = '',
  placeholder = 'Chọn ngày',
  error,
  ..._props
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const datePickerRef = useRef(null);
  // Parse initial value
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      try {
        if (value.includes('-')) {
          // Parse DD-MM-YYYY format
          const [day, month, year] = value.split('-');
          setCurrentMonth(new Date(`${year}-${month}-${day}T00:00:00`));
        } else {
          // Fallback for other formats
          setCurrentMonth(new Date(value));
        }
      } catch {
        // Fallback to current date if parsing fails
        setCurrentMonth(new Date());
      }
    }
  }, [value]);
  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        showCalendar &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);
  // Update parent when date changes
  useEffect(() => {
    if (selectedDate !== value && onChange && name) {
      onChange({ target: { value: selectedDate, name } });
    }
  }, [selectedDate, value, name, onChange]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const _lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();

      // Parse minDate and maxDate based on format
      let minDateObj = null;
      let maxDateObj = null;

      if (minDate) {
        if (minDate.includes('-')) {
          // Handle DD-MM-YYYY format
          const [day, month, year] = minDate.split('-');
          if (
            day &&
            month &&
            year &&
            day.length === 2 &&
            month.length === 2 &&
            year.length === 4
          ) {
            minDateObj = new Date(`${year}-${month}-${day}T00:00:00`);
          } else {
            // Fallback for other formats
            minDateObj = new Date(minDate);
          }
        } else {
          minDateObj = new Date(minDate);
        }
      }

      if (maxDate) {
        if (maxDate.includes('-')) {
          // Handle DD-MM-YYYY format
          const [day, month, year] = maxDate.split('-');
          if (
            day &&
            month &&
            year &&
            day.length === 2 &&
            month.length === 2 &&
            year.length === 4
          ) {
            maxDateObj = new Date(`${year}-${month}-${day}T00:00:00`);
          } else {
            // Fallback for other formats
            maxDateObj = new Date(maxDate);
          }
        } else {
          maxDateObj = new Date(maxDate);
        }
      }

      // Handle DD-MM-YYYY format for selected date
      let isSelected = false;
      if (selectedDate) {
        if (/^\d{2}-\d{2}-\d{4}$/.test(selectedDate)) {
          const [day, month, year] = selectedDate.split('-');
          const selectedDateObj = new Date(`${year}-${month}-${day}T00:00:00`);
          isSelected =
            selectedDateObj.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
        } else if (selectedDate.includes('T')) {
          isSelected =
            selectedDate.split('T')[0] === date.toISOString().split('T')[0];
        } else {
          isSelected = selectedDate === date.toISOString().split('T')[0];
        }
      }

      const isMinRestricted = minDateObj && date < minDateObj;
      const isMaxRestricted = maxDateObj && date > maxDateObj;
      const isDisabled = isMinRestricted || isMaxRestricted;

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
      });
    }

    return days;
  };
  const handleDateClick = day => {
    if (day.isDisabled) return;
    // Format as DD-MM-YYYY
    const date = day.date;
    const dayPart = String(date.getDate()).padStart(2, '0');
    const monthPart = String(date.getMonth() + 1).padStart(2, '0');
    const yearPart = date.getFullYear();
    const formattedDate = `${dayPart}-${monthPart}-${yearPart}`;

    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };
  const navigateMonth = direction => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleMonthSelect = monthIndex => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setShowMonthPicker(false);
  };

  const handleYearSelect = year => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setShowYearPicker(false);
  };

  // Generate year range optimized for date of birth (100 years in past to current year)
  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // For date of birth, we're mostly interested in past years
    // For birth dates, typically we allow selection from 100 years ago up to current year
    for (let year = currentYear - 100; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  // Scroll to current year when year picker opens
  useEffect(() => {
    if (showYearPicker) {
      setTimeout(() => {
        const currentYearElement = document.querySelector(
          '.current-year-button'
        );
        if (currentYearElement) {
          currentYearElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  }, [showYearPicker]);

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder;

    // If already in DD-MM-YYYY format, return it
    if (/^\d{2}-\d{2}-\d{4}$/.test(selectedDate)) {
      return selectedDate;
    }

    try {
      let date;
      if (selectedDate.includes('-')) {
        // Handle different date formats
        const parts = selectedDate.split('-');
        if (parts[0].length === 4) {
          // If YYYY-MM-DD format
          date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T00:00:00`);
          // Convert to DD-MM-YYYY
          return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        } else if (parts[2].length === 4) {
          // Already in DD-MM-YYYY format
          return selectedDate;
        }
      } else {
        date = new Date(selectedDate);
      }

      if (isNaN(date.getTime())) {
        return placeholder;
      }

      // Format as DD-MM-YYYY
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    } catch (e) {
      console.error('Date parsing error:', e);
      return placeholder;
    }
  };

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return (
    <div className={`space-y-2 ${className}`} ref={datePickerRef}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      {/* Date Picker */}
      <div className='relative date-picker-container'>
        <button
          type='button'
          onClick={() => !disabled && setShowCalendar(!showCalendar)}
          disabled={disabled}
          aria-label='Open date picker'
          aria-required={required}
          className={`
            w-full flex items-center justify-between px-4 py-3 
            border rounded-lg bg-white text-left 
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-red-300'}
          `}
        >
          <div className='flex items-center'>
            <Calendar className='w-5 h-5 text-gray-400 mr-3' />
            <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
              {formatDisplayDate()}
            </span>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transform transition-transform ${showCalendar ? 'rotate-90' : ''}`}
          />
        </button>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className='absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80'>
            {' '}
            {/* Month/Year Navigation */}
            <div className='flex items-center justify-between mb-4'>
              <button
                type='button'
                onClick={() => navigateMonth(-1)}
                className='p-2 hover:bg-gray-100 rounded-lg'
              >
                <ChevronLeft className='w-5 h-5' />
              </button>

              <div className='flex items-center space-x-2'>
                {/* Month Selector */}
                <button
                  type='button'
                  onClick={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className='px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  {monthNames[currentMonth.getMonth()]}
                </button>

                {/* Year Selector */}
                <button
                  type='button'
                  onClick={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className='px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  {currentMonth.getFullYear()}
                </button>
              </div>

              <button
                type='button'
                onClick={() => navigateMonth(1)}
                className='p-2 hover:bg-gray-100 rounded-lg'
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
            {/* Month Picker */}
            {showMonthPicker && (
              <div className='grid grid-cols-3 gap-2 mb-4'>
                {monthNames.map((month, index) => (
                  <button
                    key={month}
                    type='button'
                    onClick={() => handleMonthSelect(index)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentMonth.getMonth() === index
                        ? 'bg-red-500 text-white font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
            {/* Year Picker */}
            {showYearPicker && (
              <div className='max-h-60 overflow-y-auto mb-4'>
                <div className='grid grid-cols-4 gap-2'>
                  {generateYearRange().map(year => (
                    <button
                      key={year}
                      type='button'
                      onClick={() => handleYearSelect(year)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentMonth.getFullYear() === year
                          ? 'bg-red-500 text-white font-semibold current-year-button'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Calendar Grid - Only show when not picking month/year */}
            {!showMonthPicker && !showYearPicker && (
              <>
                {/* Day Headers */}
                <div className='grid grid-cols-7 gap-1 mb-2'>
                  {dayNames.map(day => (
                    <div
                      key={day}
                      className='text-center text-xs font-medium text-gray-500 py-2'
                    >
                      {day}
                    </div>
                  ))}{' '}
                </div>

                {/* Calendar Grid */}
                <div className='grid grid-cols-7 gap-1'>
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => handleDateClick(day)}
                      disabled={day.isDisabled}
                      aria-label={`Select date ${day.date.toLocaleDateString()}`}
                      aria-disabled={day.isDisabled}
                      aria-selected={day.isSelected}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                        ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                        ${day.isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                        ${day.isSelected ? 'bg-red-500 text-white font-semibold' : ''}
                        ${day.isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}
                        ${!day.isSelected && !day.isToday && day.isCurrentMonth ? 'text-gray-900' : ''}
                      `}
                    >
                      {day.day}
                    </button>
                  ))}{' '}
                </div>
              </>
            )}
            <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between'>
              <button
                type='button'
                onClick={() => {
                  setSelectedDate('');
                  setShowCalendar(false);
                  // Call onChange with empty value
                  if (onChange && name) {
                    onChange({ target: { value: '', name } });
                  }
                }}
                className='px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors'
              >
                Xóa
              </button>
              <button
                type='button'
                onClick={() => setShowCalendar(false)}
                className='px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors'
              >
                Đóng
              </button>{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DatePicker;
