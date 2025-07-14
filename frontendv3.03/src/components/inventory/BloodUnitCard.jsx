// src/components/inventory/BloodUnitCard.jsx
import React from 'react';
import { Droplet, User, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import InfoRow from '../common/InfoRow';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';

const BloodUnitCard = ({ unit, className = '' }) => {
  // Debug logging
  if (!unit) {
    console.error('BloodUnitCard: unit is null or undefined');
    return <div>Unit data is missing</div>;
  }

  const isExpiringToon = () => {
    if (!unit.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(unit.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = () => {
    if (!unit.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(unit.expiryDate);
    return expiry < today;
  };

  const getExpiryStatus = () => {
    if (isExpired()) return 'expired';
    if (isExpiringToon()) return 'expiring';
    return 'valid';
  };

  return (
    <Card
      className={`${className} ${isExpiringToon() ? 'border-orange-200 bg-orange-50' : ''} ${isExpired() ? 'border-red-200 bg-red-50' : ''}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center'>
            <Droplet className='w-5 h-5 mr-2 text-red-500' />
            {unit.id}
          </CardTitle>
          <div className='flex items-center space-x-2'>
            <StatusBadge status={unit.status} type='inventory' />
            {isExpiringToon() && (
              <div className='flex items-center text-orange-600 text-sm'>
                <AlertTriangle className='w-4 h-4 mr-1' />
                Sắp hết hạn
              </div>
            )}
            {isExpired() && (
              <div className='flex items-center text-red-600 text-sm'>
                <AlertTriangle className='w-4 h-4 mr-1' />
                Đã hết hạn
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        <InfoRow 
          label='Nhóm máu' 
          value={unit.bloodType?.bloodGroup || 'N/A'} 
        />

        <InfoRow 
          label='Thể tích' 
          value={`${unit.volumeMl || 'N/A'} ml`} 
        />

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
          label='Ngày hết hạn'
          value={
            <div className='flex items-center'>
              <DateTimeDisplay date={unit.expiryDate} />
              {getExpiryStatus() === 'expiring' && (
                <span className='ml-2 text-orange-600 text-xs'>⚠️ Sắp hết hạn</span>
              )}
              {getExpiryStatus() === 'expired' && (
                <span className='ml-2 text-red-600 text-xs'>❌ Đã hết hạn</span>
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
          <InfoRow
            label='Vị trí lưu trữ'
            value={unit.storageLocation}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BloodUnitCard;
