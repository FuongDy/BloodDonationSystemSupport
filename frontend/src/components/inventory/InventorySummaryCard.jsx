// src/components/inventory/InventorySummaryCard.jsx
import React from 'react';
import { Droplet, Package } from 'lucide-react';
import InfoRow from '../common/InfoRow';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const InventorySummaryCard = ({ summary, className = '' }) => {
  const statItems = [
    {
      label: 'Số đơn vị',
      value: summary.unitCount,
      valueClassName: 'text-xl font-bold text-gray-900',
      icon: Package,
    },
    {
      label: 'Tổng thể tích',
      value: `${summary.totalVolumeMl} ml`,
      valueClassName: 'text-lg font-semibold text-blue-600',
      icon: Droplet,
    },
  ];

  return (
    <Card className={`${className}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-gray-900'>
            {summary.bloodType?.bloodGroup || 'N/A'}
          </CardTitle>
          <div className='flex items-center text-sm text-gray-500'>
            <Droplet className='w-4 h-4 mr-1' />
            {summary.bloodType?.componentType || 'N/A'}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {statItems.map((item, index) => (
          <InfoRow
            key={index}
            label={item.label}
            value={item.value}
            valueClassName={item.valueClassName}
            icon={item.icon}
          />
        ))}
        
        {summary.bloodType?.description && (
          <InfoRow
            label='Mô tả'
            value={summary.bloodType.description}
            valueClassName='text-sm text-gray-600'
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InventorySummaryCard;
