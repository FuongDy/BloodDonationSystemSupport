// src/components/common/DateTimePicker.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const DateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  minDate = null,
  maxDate = null,
  className = '',
  ...props 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedTime(date.toTimeString().slice(0, 5));
      }
    }
  }, [value]);  // Update parent when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime && onChange) {
      const datetime = `${selectedDate}T${selectedTime}`;
      // Only call onChange if the value actually changed
      if (datetime !== value) {
        onChange({ target: { value: datetime, name: props.name } });
      }
    }
  }, [selectedDate, selectedTime, value, props.name]); // Removed onChange from dependencies

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
      const isPast = date < today;
      const isMinRestricted = minDate && date < new Date(minDate);
      const isMaxRestricted = maxDate && date > new Date(maxDate);
      const isDisabled = isPast || isMinRestricted || isMaxRestricted;

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

  // Generate time slots (every 30 minutes from 7:30 to 16:30)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 16 && minute > 30) break; // Stop at 16:30
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleDateClick = (date) => {
    if (date.isDisabled) return;
    setSelectedDate(date.date.toISOString().split('T')[0]);
    setShowCalendar(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return 'Chọn ngày';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDisplayTime = () => {
    if (!selectedTime) return 'Chọn giờ';
    return selectedTime;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
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
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={disabled}
            className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Chọn giờ</option>
            {generateTimeSlots().map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
          </div>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Lịch hẹn đã chọn:</span> {formatDisplayDate()} lúc {formatDisplayTime()}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        * Thời gian làm việc: 7:30 - 16:30 (Thứ 2 - Chủ nhật)
      </p>
    </div>
  );
};

export default DateTimePicker;
