// src/components/common/DatePicker.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  minDate = null,
  maxDate = null,
  className = '',
  placeholder = 'Chọn ngày',
  ...props 
}) => {  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  // Parse initial value
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && !event.target.closest('.date-picker-container')) {
        setShowCalendar(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);// Update parent when date changes
  useEffect(() => {
    if (selectedDate !== value && onChange) {
      onChange({ target: { value: selectedDate, name: props.name } });
    }
  }, [selectedDate, value, props.name]); // Removed onChange from dependencies

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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
      const isSelected = selectedDate === date.toISOString().split('T')[0];
      const isMinRestricted = minDate && date < new Date(minDate);
      const isMaxRestricted = maxDate && date > new Date(maxDate);
      const isDisabled = isMinRestricted || isMaxRestricted;

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day.isDisabled) return;
    const dateString = day.date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setShowCalendar(false);
  };
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setShowYearPicker(false);
  };
  // Generate year range (current year ± 100 years)
  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 100; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  // Scroll to current year when year picker opens
  useEffect(() => {
    if (showYearPicker) {
      setTimeout(() => {
        const currentYearElement = document.querySelector('.current-year-button');
        if (currentYearElement) {
          currentYearElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [showYearPicker]);

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder;
    const date = new Date(selectedDate);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className={`space-y-2 ${className}`}>      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
        {/* Date Picker */}
      <div className="relative date-picker-container">
        <button
          type="button"
          onClick={() => !disabled && setShowCalendar(!showCalendar)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
              {formatDisplayDate()}
            </span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
        </button>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {/* Month Selector */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className="px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {monthNames[currentMonth.getMonth()]}
                </button>
                
                {/* Year Selector */}
                <button
                  type="button"
                  onClick={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className="px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {currentMonth.getFullYear()}
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>            </div>

            {/* Month Picker */}
            {showMonthPicker && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {monthNames.map((month, index) => (
                  <button
                    key={month}
                    type="button"
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
              <div className="max-h-60 overflow-y-auto mb-4">
                <div className="grid grid-cols-4 gap-2">                  {generateYearRange().map(year => (
                    <button
                      key={year}
                      type="button"
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
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      disabled={day.isDisabled}
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
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate('');
                  setShowCalendar(false);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
