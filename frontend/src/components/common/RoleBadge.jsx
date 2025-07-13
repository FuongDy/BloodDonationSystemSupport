// src/components/common/RoleBadge.jsx
import React from 'react';

const RoleBadge = ({ role, size = 'md' }) => {
  const getColorClasses = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200 shadow-sm';
      case 'staff':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'donor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'recipient':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full border font-medium
        ${getColorClasses(role)}
        ${getSizeClasses(size)}
      `}
    >
      {role || 'Unknown'}
    </span>
  );
};

export default RoleBadge;
