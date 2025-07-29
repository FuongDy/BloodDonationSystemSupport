// src/components/admin/appointments/AppointmentStatsCards.jsx
import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AppointmentStatsCards = ({ 
  appointments, 
  processes, 
  isUpcoming, 
  isPast 
}) => {
  const upcomingCount = appointments.filter(
    a => a.appointment && isUpcoming(a.appointment.appointmentDateTime)
  ).length;

  const completedCount = appointments.filter(
    a => a.appointment && isPast(a.appointment.appointmentDateTime)
  ).length;

  const stats = [
    {
      title: 'Tổng lịch hẹn',
      value: appointments.length,
      icon: Calendar,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-700',
      iconColor: 'text-blue-500',
    },
    // {
    //   title: 'Sắp tới',
    //   value: upcomingCount,
    //   icon: Clock,
    //   bgColor: 'bg-green-50',
    //   borderColor: 'border-green-200',
    //   textColor: 'text-green-600',
    //   valueColor: 'text-green-700',
    //   iconColor: 'text-green-500',
    // },
    {
      title: 'Cần tạo lịch',
      value: processes.length,
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-600',
      valueColor: 'text-yellow-700',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Đã hoàn thành',
      value: completedCount,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      valueColor: 'text-green-700',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} p-4 rounded-lg border ${stat.borderColor}`}
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className={`text-sm ${stat.textColor}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </p>
            </div>
            <stat.icon className={stat.iconColor} size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStatsCards;
