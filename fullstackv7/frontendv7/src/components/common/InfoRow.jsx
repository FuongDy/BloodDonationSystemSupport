// src/components/common/InfoRow.jsx
import React from 'react';

const InfoRow = ({
  label,
  value,
  icon: IconComponent,
  className = '',
  labelClassName = '',
  valueClassName = '',
}) => {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <span
        className={`text-sm font-medium text-gray-600 flex items-center ${labelClassName}`}
      >
        {IconComponent && <IconComponent className='w-4 h-4 mr-1' />}
        {label}:
      </span>
      <span
        className={`text-sm text-gray-900 text-right max-w-[60%] break-words ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
};

export default InfoRow;
