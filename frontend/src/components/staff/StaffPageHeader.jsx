// src/components/staff/StaffPageHeader.jsx
import React from 'react';

const StaffPageHeader = ({ title, subtitle, actions, icon: Icon }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200">
            <Icon className="w-8 h-8 text-orange-600" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
    <div className="mt-6 h-px bg-gradient-to-r from-orange-200 via-orange-100 to-transparent"></div>
  </div>
);

export default StaffPageHeader;
