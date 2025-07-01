// src/components/donation/DonationStatsCard.jsx
import React from 'react';
import { Heart, Calendar, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const DonationStatsCard = ({ stats = {} }) => {
  const {
    totalDonations = 0,
    completedDonations = 0,
    upcomingAppointments = 0,
    totalVolumeDonated = 0,
  } = stats;

  const statItems = [
    {
      label: 'Tổng số lần hiến',
      value: totalDonations,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Hoàn thành',
      value: completedDonations,
      icon: Award,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Lịch hẹn sắp tới',
      value: upcomingAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Tổng thể tích (ml)',
      value: totalVolumeDonated,
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <Card className='bg-gradient-to-br from-red-50 to-pink-50 border-red-200'>
      <CardHeader>
        <CardTitle className='text-xl text-red-800'>
          <Heart className='w-6 h-6 inline mr-2' />
          Thống kê hiến máu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {statItems.map((item, index) => (
            <div key={index} className='text-center'>
              {' '}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.bg} mb-2`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {item.value}
              </div>
              <div className='text-sm text-gray-600'>{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationStatsCard;
