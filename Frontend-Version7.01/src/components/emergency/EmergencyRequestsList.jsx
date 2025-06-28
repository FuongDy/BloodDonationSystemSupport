// src/components/emergency/EmergencyRequestsList.jsx
import React from 'react';
import EmptyState from '../common/EmptyState';
import EmergencyRequestCard from './EmergencyRequestCard';

const EmergencyRequestsList = ({ requests, onPledgeSuccess }) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        type='results'
        title='Hiện tại không có yêu cầu máu khẩn cấp'
        description='Tuyệt vời! Hiện tại không có yêu cầu máu khẩn cấp nào. Hãy quay lại sau hoặc kiểm tra các yêu cầu hiến máu thường xuyên khác.'
        action={{
          label: 'Xem tất cả yêu cầu',
          href: '/blood-requests',
        }}
      />
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {requests.map(request => (
        <EmergencyRequestCard
          key={request.id}
          request={request}
          onPledgeSuccess={onPledgeSuccess}
        />
      ))}
    </div>
  );
};

export default EmergencyRequestsList;
