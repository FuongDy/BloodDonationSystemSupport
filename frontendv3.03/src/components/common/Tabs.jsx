import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`px-4 py-2 -mb-px text-sm font-medium focus:outline-none transition border-b-2 ${
            activeTab === tab.key
              ? 'border-red-500 text-red-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-red-600 hover:bg-gray-50'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 