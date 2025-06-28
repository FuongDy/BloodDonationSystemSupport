// src/components/common/DateTimeDisplay.jsx
import React from 'react';
import { formatDate } from '../../utils/formatters';

const DateTimeDisplay = ({
  date,
  format = 'full',
  locale = 'vi-VN',
  className = '',
  fallback = 'N/A',
}) => {
  if (!date) return <span className={className}>{fallback}</span>;

  const _formatDate = (dateString, formatType) => {
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
      return fallback;
    }

    const formatOptions = {
      full: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
      date: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
      },
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      relative: null, // Will use relative time
    };

    if (formatType === 'relative') {
      const now = new Date();
      const diffInSeconds = Math.floor((now - dateObj) / 1000);

      if (diffInSeconds < 60) return 'Vừa xong';
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

      return dateObj.toLocaleDateString(locale, formatOptions.short);
    }

    return dateObj.toLocaleDateString(
      locale,
      formatOptions[formatType] || formatOptions.full
    );
  };
  return <span className={className}>{_formatDate(date, format)}</span>;
};

export default DateTimeDisplay;
