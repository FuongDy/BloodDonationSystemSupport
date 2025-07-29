// src/components/appointments/AppointmentCard.jsx
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  MapPin,
  User,
} from 'lucide-react';
import { useState } from 'react';
import Button from '../common/Button';
import DateTimeDisplay from '../common/DateTimeDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// Utility functions for status and type display
const getStatusInfo = status => {
  const statusMap = {
    PENDING_APPROVAL: {
      label: 'Chờ phê duyệt',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    REJECTED: {
      label: 'Bị từ chối',
      color: 'bg-red-100 text-red-800',
      icon: Activity,
    },
    APPOINTMENT_PENDING: {
      label: 'Chờ đặt lịch',
      color: 'bg-blue-100 text-blue-800',
      icon: Calendar,
    },
    APPOINTMENT_SCHEDULED: {
      label: 'Đã đặt lịch',
      color: 'bg-green-100 text-green-800',
      icon: Calendar,
    },
    RESCHEDULE_REQUESTED: {
      label: 'Yêu cầu đổi lịch',
      color: 'bg-orange-100 text-orange-800',
      icon: Clock,
    },
    HEALTH_CHECK_PASSED: {
      label: 'Khám sức khỏe đạt',
      color: 'bg-green-100 text-green-800',
      icon: Activity,
    },
    HEALTH_CHECK_FAILED: {
      label: 'Khám sức khỏe không đạt',
      color: 'bg-red-100 text-red-800',
      icon: Activity,
    },
    BLOOD_COLLECTED: {
      label: 'Đã lấy máu',
      color: 'bg-blue-100 text-blue-800',
      icon: Activity,
    },
    TESTING_PASSED: {
      label: 'Xét nghiệm đạt',
      color: 'bg-green-100 text-green-800',
      icon: Activity,
    },
    TESTING_FAILED: {
      label: 'Xét nghiệm không đạt',
      color: 'bg-red-100 text-red-800',
      icon: Activity,
    },
    COMPLETED: {
      label: 'Hoàn thành',
      color: 'bg-green-100 text-green-800',
      icon: Activity,
    },
    CANCELLED: {
      label: 'Đã hủy',
      color: 'bg-gray-100 text-gray-800',
      icon: Activity,
    },
  };
  return (
    statusMap[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
      icon: Activity,
    }
  );
};

const getTypeInfo = type => {
  const typeMap = {
    STANDARD: { label: 'Hiến máu thường', color: 'bg-blue-100 text-blue-800' },
    EMERGENCY: { label: 'Hiến máu khẩn cấp', color: 'bg-red-100 text-red-800' },
  };
  return typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
};

const AppointmentCard = ({
  appointment,
  onRequestReschedule,
  onViewDetail,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Extract process information from appointment
  const processId = appointment.processId;
  const donorInfo = appointment.donor;
  const staffInfo = appointment.staff;

  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='text-xl flex items-center gap-2'>
              Lịch hẹn hiến máu #{appointment.id}
            </CardTitle>

            <div className='flex gap-2 mt-2'>
              {appointment.status && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(appointment.status).color}`}
                >
                  {getStatusInfo(appointment.status).label}
                </span>
              )}
              {appointment.donationType && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(appointment.donationType).color}`}
                >
                  {getTypeInfo(appointment.donationType).label}
                </span>
              )}
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewDetail && onViewDetail(appointment)}
          >
            <Eye size={16} className='mr-1' />
            Chi tiết
          </Button>
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
              <p className='text-gray-600'>{appointment.location}</p>
            </div>
          </div>
        </div>

        {staffInfo && (
          <div className='flex items-center space-x-3'>
            <User className='w-5 h-5 text-purple-500' />
            <div>
              <p className='font-medium'>Nhân viên phụ trách</p>
              <p className='text-gray-600'>
                {staffInfo.fullName || staffInfo.email}
              </p>
            </div>
          </div>
        )}

        {appointment.notes && (
          <div className='bg-gray-50 p-3 rounded-lg'>
            <p className='font-medium text-gray-700 mb-1 flex items-center'>
              <FileText className='w-4 h-4 mr-1' />
              Ghi chú:
            </p>
            <p className='text-gray-600'>{appointment.notes}</p>
          </div>
        )}

        {/* Collapsible detailed information */}
        <div className='border-t pt-4'>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className='flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900'
          >
            <span>Thông tin chi tiết</span>
            {showDetails ? (
              <ChevronUp className='w-4 h-4' />
            ) : (
              <ChevronDown className='w-4 h-4' />
            )}
          </button>

          {showDetails && (
            <div className='mt-3 space-y-2 text-sm'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='font-medium text-gray-600'>
                    ID Lịch hẹn:
                  </span>
                  <p>#{appointment.id}</p>
                </div>

                {donorInfo && (
                  <div>
                    <span className='font-medium text-gray-600'>
                      Người hiến máu:
                    </span>
                    <p>
                      {donorInfo.fullName} ({donorInfo.email})
                    </p>
                  </div>
                )}
                {appointment.createdAt && (
                  <div>
                    <span className='font-medium text-gray-600'>Ngày tạo:</span>
                    <DateTimeDisplay
                      date={appointment.createdAt}
                      format='full'
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-4 border-t'>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span>Lịch hẹn hiến máu</span>
          </div>

          {/* Action buttons could be added here based on status */}
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
