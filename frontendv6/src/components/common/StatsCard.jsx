// src/components/common/StatsCard.jsx
import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: IconComponent, 
  color = 'red',
  className = ''
}) => {
  const colorClasses = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  const iconColorClasses = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500'
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-700">
          {title}
        </h2>
        {IconComponent && (
          <IconComponent className={`w-8 h-8 ${iconColorClasses[color] || iconColorClasses.red}`} />
        )}
      </div>
      <p className={`text-3xl font-bold ${colorClasses[color] || colorClasses.red} mb-1`}>
        {value}
      </p>
      {description && (
        <p className="text-sm text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatsCard;


