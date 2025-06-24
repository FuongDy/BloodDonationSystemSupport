// src/components/common/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ 
  tabs = [], 
  activeTab, 
  onTabChange, 
  className = '' 
}) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className='-mb-px flex space-x-8'>
        {tabs.map(({ key, label, icon: IconComponent, count }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === key
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {IconComponent && <IconComponent className='w-4 h-4 mr-2' />}
            {label}
            {count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === key 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;


