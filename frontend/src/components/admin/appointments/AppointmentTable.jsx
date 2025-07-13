// src/components/admin/appointments/AppointmentTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import DataTable from '../../common/DataTable';
import Button from '../../common/Button';
import StatusBadge from '../../common/StatusBadge';
import { formatDateTime } from '../../../utils/formatters';
import { STATUS_COLORS } from '../../../utils/constants';

const AppointmentTable = ({ 
  appointments, 
  isLoading, 
  onReschedule, 
  getStatusColor: _getStatusColor, 
  isUpcoming 
}) => {
  const navigate = useNavigate();

  const appointmentColumns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: value => `#${value}`,
    },
    {
      key: 'donor',
      title: 'Người hiến',
      render: value => (
        <div className='flex items-center space-x-2'>
          <User size={16} className='text-gray-400' />
          <div>
            <div className='font-medium'>{value?.fullName || 'N/A'}</div>
            <div className='text-sm text-gray-500 flex items-center space-x-1'>
              <Mail size={12} />
              <span>{value?.email}</span>
            </div>
            {value?.phoneNumber && (
              <div className='text-sm text-gray-500 flex items-center space-x-1'>
                <Phone size={12} />
                <span>{value.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'appointment',
      title: 'Thông tin lịch hẹn',
      render: (value) =>
        value ? (
          <div className='space-y-1'>
            <div className='flex items-center space-x-1'>
              <Calendar
                size={14}
                className={
                  isUpcoming(value.appointmentDateTime)
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }
              />
              <span
                className={`text-sm ${isUpcoming(value.appointmentDateTime) ? 'font-medium' : 'text-gray-500'}`}
              >
                {formatDateTime(value.appointmentDateTime)}
              </span>
            </div>
            <div className='flex items-center space-x-1 text-gray-500'>
              <MapPin size={12} />
              <span className='text-xs'>{value.location}</span>
            </div>
            {value.notes && (
              <div className='text-xs text-gray-400 italic'>{value.notes}</div>
            )}
          </div>
        ) : (
          <span className='text-gray-400'>Chưa có lịch hẹn</span>
        ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: value => (
        <StatusBadge status={value} type="donation" variant={STATUS_COLORS[value] || 'default'} />
      ),
    },
    {
      key: 'appointmentStatus',
      title: 'Tình trạng',
      render: (_, process) => {
        const value = process.appointment;
        if (!value) return <span className='text-gray-400'>-</span>;

        const appointmentTime = new Date(value.appointmentDateTime);
        const now = new Date();

        if (appointmentTime > now) {
          return (
            <div className='flex items-center space-x-1 text-green-600'>
              <Clock size={14} />
              <span className='text-sm'>Sắp tới</span>
            </div>
          );
        } else {
          return (
            <div className='flex items-center space-x-1 text-gray-500'>
              <CheckCircle size={14} />
              <span className='text-sm'>Đã qua</span>
            </div>
          );
        }
      },
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, process) => (
        <div className='flex space-x-2'>
          {process.appointment &&
            isUpcoming(process.appointment.appointmentDateTime) && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onReschedule(process)}
              >
                <Edit3 size={14} className='mr-1' />
                Đổi lịch
              </Button>
            )}
          <Button
            size='sm'
            variant='outline'
            onClick={() => navigate(`/admin/donation-process/${process.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={appointments}
      columns={appointmentColumns}
      loading={isLoading}
    />
  );
};

export default AppointmentTable;
