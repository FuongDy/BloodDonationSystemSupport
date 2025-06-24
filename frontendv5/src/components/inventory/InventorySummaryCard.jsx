// src/components/inventory/InventorySummaryCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import InfoRow from '../common/InfoRow';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const InventorySummaryCard = ({ summary, className = '' }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className='w-5 h-5 text-green-500' />;
    if (trend < 0) return <TrendingDown className='w-5 h-5 text-red-500' />;
    return <Clock className='w-5 h-5 text-gray-500' />;
  };

  const statItems = [
    {
      label: 'Tổng số đơn vị',
      value: summary.totalUnits,
      valueClassName: 'text-xl font-bold text-gray-900'
    },
    {
      label: 'Có sẵn',
      value: summary.availableUnits,
      valueClassName: 'text-lg font-semibold text-green-600'
    },
    {
      label: 'Sắp hết hạn',
      value: summary.expiringSoon || 0,
      valueClassName: 'text-lg font-semibold text-yellow-600'
    },
    {
      label: 'Đã hết hạn',
      value: summary.expiredUnits || 0,
      valueClassName: 'text-lg font-semibold text-red-600'
    }
  ];

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-gray-900'>
            {summary.bloodType?.name || 'N/A'}
          </CardTitle>
          {getTrendIcon(summary.trend)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {statItems.map((item, index) => (
          <InfoRow
            key={index}
            label={item.label}
            value={item.value}
            valueClassName={item.valueClassName}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default InventorySummaryCard;

