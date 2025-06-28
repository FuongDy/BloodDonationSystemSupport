// src/components/admin/donationHistory/DonationHistoryEmptyState.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import AdminEmptyState from '../AdminEmptyState';

const DonationHistoryEmptyState = () => {
  return (
    <AdminEmptyState
      icon={Calendar}
      title="Chưa có đơn yêu cầu hiến máu nào"
      description="Hiện tại chưa có ai đăng ký hiến máu trong hệ thống."
    />
  );
};

export default DonationHistoryEmptyState;
