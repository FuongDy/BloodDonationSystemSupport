// src/components/admin/BloodRequestCard.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import UrgencyBadge from '../common/UrgencyBadge';
import Button from '../common/Button';
import InfoRow from '../common/InfoRow';
import DateTimeDisplay from '../common/DateTimeDisplay';

const BloodRequestCard = ({
  request,
  onStatusUpdate,
  showActions = true,
  className = '',
}) => {
  const handleStatusUpdate = status => {
    if (onStatusUpdate) {
      onStatusUpdate(request.id, status);
    }
  };

  return (
    <Card key={request.id} hover className={className}>
      {' '}
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>
            Cần máu {request.bloodType?.bloodGroup}
          </CardTitle>
          <UrgencyBadge urgency={request.urgency} />
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <InfoRow label='Bệnh nhân' value={request.patientName} />
        <InfoRow label='Bệnh viện' value={request.hospital} />
        <InfoRow label='Số lượng' value={`${request.quantityInUnits} đơn vị`} />
        <InfoRow
          label='Trạng thái'
          value={<StatusBadge status={request.status} type='request' />}
        />
        <div className='flex items-center space-x-2'>
          <Clock className='w-4 h-4 text-gray-500' />
          <span className='text-sm'>
            <DateTimeDisplay date={request.createdAt} />
          </span>
        </div>{' '}
        {showActions && request.status === 'PENDING' && (
          <Button
            size='sm'
            className='w-full'
            onClick={() => handleStatusUpdate('FULFILLED')}
          >
            Đánh dấu hoàn thành
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodRequestCard;
