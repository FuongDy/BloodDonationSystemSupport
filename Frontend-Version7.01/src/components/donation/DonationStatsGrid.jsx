// src/components/donation/DonationStatsGrid.jsx
import React from 'react';
import { Activity, Award, Calendar, Clock, Droplets } from 'lucide-react';

const DonationStatsGrid = ({ stats }) => {
  const statsConfig = [
    {
      key: 'total',
      label: 'Tổng số lần',
      value: stats.total,
      icon: Activity,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      key: 'completed',
      label: 'Hoàn thành',
      value: stats.completed,
      icon: Award,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      key: 'scheduled',
      label: 'Đã lên lịch',
      value: stats.scheduled,
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      key: 'pending',
      label: 'Chờ xử lý',
      value: stats.pending,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {statsConfig.map(({ key, label, value, icon: Icon, iconBg, iconColor }) => (
        <div key={key} className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
          <div className='flex items-center'>
            <div className={`p-3 rounded-lg ${iconBg}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>{label}</p>
              <p className='text-2xl font-bold text-gray-900'>{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationStatsGrid;
