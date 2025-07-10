// src/components/admin/donationHistory/DonationHistoryEmptyState.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const DonationHistoryEmptyState = () => {
  return (
    <div className="text-center text-gray-500 py-8">
      <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Chưa có đơn yêu cầu hiến máu nào
      </h3>
      <div className="text-gray-600">
        Hiện tại chưa có ai đăng ký hiến máu trong hệ thống.
      </div>
    </div>
  );
};

export default DonationHistoryEmptyState;
