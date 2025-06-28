// src/components/appointments/AppointmentCard.jsx
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';

const AppointmentCard = ({ appointment, getStatusColor, onRequestReschedule }) => {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-xl'>
            Lịch hẹn hiến máu #{appointment.id}
          </CardTitle>
          <StatusBadge
            status={appointment.status}
            className={getStatusColor(appointment.status)}
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='flex items-center space-x-3'>
            <Calendar className='w-5 h-5 text-blue-500' />
            <div>
              <p className='font-medium'>Ngày giờ hẹn</p>
              <DateTimeDisplay
                date={appointment.appointmentDateTime}
                format='full'
              />
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <MapPin className='w-5 h-5 text-green-500' />
            <div>
              <p className='font-medium'>Địa điểm</p>
              <p className='text-gray-600'>
                {appointment.location}
              </p>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className='bg-gray-50 p-3 rounded-lg'>
            <p className='font-medium text-gray-700 mb-1'>
              Ghi chú:
            </p>
            <p className='text-gray-600'>{appointment.notes}</p>
          </div>
        )}

        <div className='flex items-center justify-between pt-4 border-t'>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Clock className='w-4 h-4' />
            <span>Tạo lúc: </span>
            <DateTimeDisplay
              date={appointment.createdAt}
              format='short'
            />
          </div>

          {appointment.status === 'SCHEDULED' && (
            <button
              onClick={() => onRequestReschedule(appointment.id)}
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Yêu cầu đổi lịch
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
