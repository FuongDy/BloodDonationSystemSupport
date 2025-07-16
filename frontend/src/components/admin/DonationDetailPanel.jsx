// src/components/admin/DonationDetailPanel.jsx
import React from 'react';
import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Droplets,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import InfoRow from '../common/InfoRow';
import ActionButtonGroup from '../common/ActionButtonGroup';
import SectionHeader from '../common/SectionHeader';
import DateTimeDisplay from '../common/DateTimeDisplay';
import { HOSPITAL_INFO } from '../../utils/constants';

const DonationDetailPanel = ({
  donation,
  onStatusUpdate,
  onClose,
  className = '',
}) => {
  if (!donation) {
    return (
      <Card className={className}>
        <CardContent className='p-6 text-center text-gray-500'>
          Chọn một đơn yêu cầu để xem chi tiết
        </CardContent>
      </Card>
    );
  }
  const getStatusActions = status => {
    const statusActionsMap = {
      PENDING_APPROVAL: [
        {
          label: 'Duyệt đơn',
          onClick: () => onStatusUpdate(donation.id, 'APPOINTMENT_PENDING'),
        },
        {
          label: 'Từ chối',
          variant: 'outline',
          onClick: () => onStatusUpdate(donation.id, 'REJECTED'),
        },
      ],
      APPOINTMENT_PENDING: [
        {
          label: 'Lên lịch hẹn',
          onClick: () => onStatusUpdate(donation.id, 'APPOINTMENT_SCHEDULED'),
        },
      ],
      APPOINTMENT_SCHEDULED: [
        {
          label: 'Khám sức khỏe đạt',
          onClick: () => onStatusUpdate(donation.id, 'HEALTH_CHECK_PASSED'),
        },
      ],
      HEALTH_CHECK_PASSED: [
        {
          label: 'Đã lấy máu',
          onClick: () => onStatusUpdate(donation.id, 'BLOOD_COLLECTED'),
        },
      ],
      BLOOD_COLLECTED: [
        {
          label: 'Xét nghiệm đạt',
          onClick: () => onStatusUpdate(donation.id, 'TESTING_PASSED'),
        },
        {
          label: 'Xét nghiệm không đạt',
          variant: 'outline',
          onClick: () => onStatusUpdate(donation.id, 'TESTING_FAILED'),
        },
      ],
      TESTING_PASSED: [
        {
          label: 'Hoàn thành',
          onClick: () => onStatusUpdate(donation.id, 'COMPLETED'),
        },
      ],
    };

    return statusActionsMap[status] || [];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Chi tiết đơn hiến máu</CardTitle>
          {onClose && (
            <Button variant='outline' size='sm' onClick={onClose}>
              Đóng
            </Button>
          )}
        </div>
      </CardHeader>{' '}
      <CardContent className='space-y-6'>
        {/* Donor Information */}
        <div>
          <SectionHeader title='Thông tin người hiến' icon={User} />
          <div className='space-y-2'>
            <InfoRow label='Họ tên' value={donation.donor?.fullName || 'N/A'} />
            <InfoRow
              label='Email'
              value={donation.donor?.email || 'N/A'}
              icon={Mail}
            />
            <InfoRow
              label='Điện thoại'
              value={donation.donor?.phone || 'N/A'}
              icon={Phone}
            />
            <InfoRow
              label='Nhóm máu'
              value={donation.donor?.bloodType || 'N/A'}
              icon={Droplets}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <SectionHeader title='Trạng thái' />
          <StatusBadge status={donation.status} type='donation' />
        </div>

        {/* Dates */}
        <div>
          <SectionHeader title='Thời gian' icon={Calendar} />
          <div className='space-y-2'>
            <InfoRow
              label='Ngày tạo đơn'
              value={<DateTimeDisplay date={donation.createdAt} />}
            />
            <InfoRow
              label='Cập nhật gần nhất'
              value={<DateTimeDisplay date={donation.updatedAt} />}
            />
            {donation.appointment?.scheduledDate && (
              <InfoRow
                label='Ngày hẹn'
                value={
                  <DateTimeDisplay date={donation.appointment.scheduledDate} />
                }
              />
            )}
          </div>
        </div>

        {/* Appointment Details */}
        {donation.appointment && (
          <div>
            <SectionHeader title='Thông tin lịch hẹn' icon={MapPin} />
            <div className='space-y-2'>
              {' '}
              <InfoRow label='Địa điểm' value={HOSPITAL_INFO.FULL_NAME} />
              {donation.appointment.address && (
                <InfoRow label='Địa chỉ' value={donation.appointment.address} />
              )}
              <InfoRow
                label='Trạng thái lịch hẹn'
                value={donation.appointment.status || 'N/A'}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {donation.collectedVolumeMl && (
          <div>
            <SectionHeader title='Kết quả hiến máu' icon={Droplets} />
            <InfoRow
              label='Thể tích thu được'
              value={`${donation.collectedVolumeMl}ml`}
            />
          </div>
        )}

        {/* Notes */}
        {donation.note && (
          <div>
            <SectionHeader title='Ghi chú' icon={FileText} />
            <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-md'>
              {donation.note}
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default DonationDetailPanel;
