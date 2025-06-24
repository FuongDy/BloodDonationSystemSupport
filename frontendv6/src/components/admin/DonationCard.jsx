// src/components/admin/DonationCard.jsx
import React from 'react';
import { Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import InfoRow from '../common/InfoRow';
import ActionButtonGroup from '../common/ActionButtonGroup';
import DateTimeDisplay from '../common/DateTimeDisplay';

const DonationCard = ({
  donation,
  onViewDetails,
  onStatusUpdate,
  showActions = true,
  className = '',
}) => {
  const getActionButtons = status => {
    const actionMap = {
      PENDING_APPROVAL: [
        {
          label: 'Duyệt',
          variant: 'outline',
          onClick: () => onStatusUpdate(donation.id, 'APPOINTMENT_PENDING'),
          icon: CheckCircle,
        },
        {
          label: 'Từ chối',
          variant: 'outline',
          onClick: () => onStatusUpdate(donation.id, 'REJECTED'),
          icon: XCircle,
        },
      ],
      APPOINTMENT_PENDING: [
        {
          label: 'Lên lịch',
          onClick: () => onStatusUpdate(donation.id, 'APPOINTMENT_SCHEDULED'),
          icon: Calendar,
        },
      ],
      BLOOD_COLLECTED: [
        {
          label: 'Xét nghiệm đạt',
          onClick: () => onStatusUpdate(donation.id, 'TESTING_PASSED'),
          icon: CheckCircle,
        },
      ],
    };
    const actions = actionMap[status] || [];
    return actions.map(action => {
      const IconComponent = action.icon;
      return {
        ...action,
        label: (
          <>
            {IconComponent && (
              <IconComponentComponent className='w-4 h-4 mr-1' />
            )}
            {action.label}
          </>
        ),
      };
    });
  };

  return (
    <Card
      key={donation.id}
      hover
      className={`cursor-pointer ${className}`}
      onClick={() => onViewDetails && onViewDetails(donation)}
    >
      {' '}
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>
            <User className='w-5 h-5 inline mr-2' />
            {donation.donor?.fullName || 'N/A'}
          </CardTitle>
          <StatusBadge status={donation.status} type='donation' />
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <InfoRow
          label='Ngày yêu cầu'
          value={<DateTimeDisplay date={donation.createdAt} format='date' />}
        />

        {donation.appointment?.scheduledDate && (
          <InfoRow
            label='Ngày hẹn'
            value={
              <DateTimeDisplay
                date={donation.appointment.scheduledDate}
                format='date'
              />
            }
          />
        )}

        {donation.collectedVolumeMl && (
          <InfoRow label='Thể tích' value={`${donation.collectedVolumeMl}ml`} />
        )}

        <div className='flex items-center space-x-2 pt-2'>
          <Clock className='w-4 h-4 text-gray-500' />
          <span className='text-sm text-gray-500'>
            Cập nhật:{' '}
            <DateTimeDisplay date={donation.updatedAt} format='date' />
          </span>
        </div>

        {showActions && (
          <ActionButtonGroup
            actions={getActionButtons(donation.status)}
            orientation='horizontal'
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DonationCard;
