// src/components/appointments/AppointmentsList.jsx
import React from 'react';
import EmptyState from '../common/EmptyState';
import AppointmentCard from './AppointmentCard';

const AppointmentsList = ({ appointments, getStatusColor, onRequestReschedule }) => {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title='Chưa có lịch hẹn nào'
        description='Bạn chưa có lịch hẹn hiến máu nào. Hãy đăng ký hiến máu để tạo lịch hẹn.'
        action={{
          label: 'Đăng ký hiến máu',
          href: '/request-donation',
        }}
      />
    );
  }

  return (
    <div className='grid gap-6'>
      {appointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          getStatusColor={getStatusColor}
          onRequestReschedule={onRequestReschedule}
        />
      ))}
    </div>
  );
};

export default AppointmentsList;
