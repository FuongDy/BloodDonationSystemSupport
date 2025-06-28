// src/components/blood/compatibility/BloodCompatibilityTabs.jsx
import React from 'react';
import { Info, ArrowRightLeft, Activity } from 'lucide-react';

const BloodCompatibilityTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'types',
      label: 'Nhóm Máu',
      description: 'Tìm hiểu về các nhóm máu và phân bố',
      icon: Info,
      gradient: 'from-blue-600 to-indigo-600',
      hoverColor: 'hover:border-blue-300',
      iconColor: 'text-blue-600'
    },
    {
      id: 'compatibility',
      label: 'Tương Thích',
      description: 'Kiểm tra tương thích hiến và nhận máu',
      icon: ArrowRightLeft,
      gradient: 'from-red-600 to-pink-600',
      hoverColor: 'hover:border-red-300',
      iconColor: 'text-red-600'
    },
    {
      id: 'process',
      label: 'Quy Trình',
      description: 'Hướng dẫn quy trình hiến máu',
      icon: Activity,
      gradient: 'from-green-600 to-emerald-600',
      hoverColor: 'hover:border-green-300',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-12">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${tab.gradient} text-white border-current shadow-xl transform scale-105`
                : `bg-white text-gray-700 border-gray-200 ${tab.hoverColor} hover:shadow-lg hover:scale-102`
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Icon
                className={`w-8 h-8 ${isActive ? 'text-white' : tab.iconColor}`}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tab.label}</h3>
            <p
              className={`text-sm ${
                isActive 
                  ? tab.id === 'types' ? 'text-blue-100' : 
                    tab.id === 'compatibility' ? 'text-red-100' : 'text-green-100'
                  : 'text-gray-600'
              }`}
            >
              {tab.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default BloodCompatibilityTabs;
