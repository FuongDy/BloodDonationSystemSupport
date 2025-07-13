// src/components/appointments/AppointmentCard.jsx
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import DateTimeDisplay from '../common/DateTimeDisplay';

const AppointmentCard = ({ appointment, onRequestReschedule }) => {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-xl'>
            Lịch hẹn hiến máu #{appointment.id}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='flex items-center space-x-3'>
            <Calendar className='w-5 h-5 text-blue-500' />
            <div>
              <p className='font-medium'>Ngày hẹn</p>
              <DateTimeDisplay
                date={appointment.appointmentDate}
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
          </div>

          {/* <button
            onClick={() => onRequestReschedule(appointment.id)}
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            Yêu cầu đổi lịch
          </button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
