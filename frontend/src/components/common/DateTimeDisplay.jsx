// src/components/common/DateTimeDisplay.jsx

const DateTimeDisplay = ({
  date,
  format = 'full',
  locale = 'vi-VN',
  className = '',
  fallback = 'N/A',
}) => {
  if (!date) return <span className={className}>{fallback}</span>;

  const _formatDate = (dateString, formatType) => {
    let dateObj;
    
    console.log('DateTimeDisplay parsing:', dateString); // Debug log
    
    // Handle different date formats from backend
    if (typeof dateString === 'string') {
      // Try to parse different formats
      if (dateString.includes('-')) {
        const parts = dateString.split(' '); // Split date and time if exists
        const datePart = parts[0];
        const timePart = parts[1];
        
        const dateComponents = datePart.split('-');
        if (dateComponents.length === 3) {
          if (dateComponents[0].length === 2) {
            // dd-MM-yyyy format
            let isoString = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
            if (timePart) {
              isoString += `T${timePart}`;
            }
            console.log('Converted to ISO:', isoString); // Debug log
            dateObj = new Date(isoString);
          } else {
            // yyyy-MM-dd format
            dateObj = new Date(dateString);
          }
        } else {
          dateObj = new Date(dateString);
        }
      } else {
        dateObj = new Date(dateString);
      }
    } else {
      dateObj = new Date(dateString);
    }

    console.log('Parsed date object:', dateObj); // Debug log
    
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date format:', dateString);
      return fallback;
    }

    const formatOptions = {
      full: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      date: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
