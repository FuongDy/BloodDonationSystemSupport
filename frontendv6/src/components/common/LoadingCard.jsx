// src/components/common/LoadingCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import LoadingSpinner from './LoadingSpinner';

const LoadingCard = ({
  title = 'Đang tải...',
  message = 'Vui lòng chờ trong giây lát',
  className = '',
  showSpinner = true,
  spinnerSize = '8',
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className='text-center text-gray-600'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='text-center py-8'>
        {showSpinner && (
          <div className='flex justify-center mb-4'>
            <LoadingSpinner size={spinnerSize} />
          </div>
        )}
        <p className='text-gray-500'>{message}</p>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
