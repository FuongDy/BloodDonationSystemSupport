// src/components/inventory/BloodUnitCard.jsx
import React from 'react';
import { AlertTriangle, Calendar, User, Droplet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import InfoRow from '../common/InfoRow';
import DateTimeDisplay from '../common/DateTimeDisplay';

const BloodUnitCard = ({ unit, className = '' }) => {
  // Debug logging
  if (!unit) {
    console.error('BloodUnitCard: unit is null or undefined');
    return <div>Unit data is missing</div>;
  }

  const isExpiring = () => {
    if (!unit.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(unit.expiryDate);
    const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 7; // Cảnh báo khi còn 7 ngày hết hạn
  };

  const getDaysToExpiry = () => {
    if (!unit.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(unit.expiryDate);
    const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysToExpiry; // Add missing return statement
  };

  const daysToExpiry = getDaysToExpiry();
  const isExpiringToon = isExpiring();

  return (
    <Card
      className={`${className} ${isExpiringToon ? 'border-orange-200 bg-orange-50' : ''}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center'>
            <Droplet className='w-5 h-5 mr-2 text-red-500' />
            {unit.id}
          </CardTitle>
          <div className='flex items-center space-x-2'>
            <StatusBadge status={unit.status} type='inventory' />
            {isExpiringToon && (
              <div className='flex items-center text-orange-600 text-sm'>
                <AlertTriangle className='w-4 h-4 mr-1' />
                Sắp hết hạn
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        <InfoRow label='Nhóm máu' value={unit.bloodType?.bloodGroup || 'N/A'} />

        <InfoRow label='Thể tích' value={`${unit.volumeMl || 'N/A'} ml`} />

        <InfoRow
          label='Người hiến'
          value={unit.donorName || 'N/A'}
          icon={User}
        />

        <InfoRow
          label='Ngày thu thập'
          value={<DateTimeDisplay date={unit.collectionDate} />}
          icon={Calendar}
        />

        <InfoRow
          label='Hạn sử dụng'
          value={
            <div className='flex items-center space-x-2'>
              <DateTimeDisplay date={unit.expiryDate} />
              {daysToExpiry !== null && (
                <span
                  className={`text-sm ${
                    daysToExpiry <= 3
                      ? 'text-red-600'
                      : daysToExpiry <= 7
                        ? 'text-orange-600'
                        : 'text-gray-600'
                  }`}
                >
                  (
                  {daysToExpiry > 0 ? `còn ${daysToExpiry} ngày` : 'đã hết hạn'}
                  )
                </span>
              )}
            </div>
          }
          icon={Calendar}
        />

        {unit.shelfLifeDays && (
          <InfoRow
            label='Thời hạn bảo quản'
            value={`${unit.shelfLifeDays} ngày`}
          />
        )}

        {unit.storageLocation && (
          <InfoRow label='Vị trí lưu trữ' value={unit.storageLocation} />
        )}
      </CardContent>
    </Card>
  );
};

export default BloodUnitCard;
