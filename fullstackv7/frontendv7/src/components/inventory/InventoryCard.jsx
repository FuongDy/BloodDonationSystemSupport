// src/components/inventory/InventoryCard.jsx
import React from 'react';
import { Droplet } from 'lucide-react';
import InfoRow from '../common/InfoRow';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';
import { Card, CardContent, CardHeader } from '../ui/Card';

const InventoryCard = ({ item, className = '' }) => {
  const isExpiringSoon = expiryDate => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Droplet className='w-8 h-8 text-red-500 mr-3' />
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {item.bloodType?.name || 'N/A'}
              </h3>
              <p className='text-sm text-gray-500'>Đơn vị: {item.unitId}</p>
            </div>
          </div>
          <StatusBadge
            status={item.status}
            type='inventory'
            className='text-xs'
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <InfoRow
          label='Ngày thu thập'
          value={<DateTimeDisplay date={item.collectionDate} format='date' />}
        />

        <InfoRow
          label='Ngày hết hạn'
          value={
            <span
              className={
                isExpiringSoon(item.expiryDate)
                  ? 'text-red-600 font-medium'
                  : ''
              }
            >
              <DateTimeDisplay date={item.expiryDate} format='date' />
              {isExpiringSoon(item.expiryDate) && (
                <span className='ml-1 text-xs'>(Sắp hết hạn)</span>
              )}
            </span>
          }
        />

        <InfoRow label='Dung tích' value={`${item.volume || 450}ml`} />

        {item.location && <InfoRow label='Vị trí' value={item.location} />}
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
