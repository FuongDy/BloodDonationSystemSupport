// src/components/appointments/AppointmentsList.jsx
import EmptyState from '../common/EmptyState';
import AppointmentCard from './AppointmentCard';

const AppointmentsList = ({ appointments, onRequestReschedule, onViewDetail }) => {
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
          onRequestReschedule={onRequestReschedule}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
};

export default AppointmentsList;
