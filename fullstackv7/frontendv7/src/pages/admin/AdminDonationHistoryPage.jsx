// src/pages/admin/AdminDonationHistoryPage.jsx
import React from 'react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { useAdminDonationHistory } from '../../hooks/useAdminDonationHistory';
import {
  DonationHistoryList,
  DonationDetailPanel,
  DonationHistoryEmptyState,
} from '../../components/admin/admin_donationHistory';

const AdminDonationHistoryPage = () => {
  const {
    donations,
    isLoading,
    selectedDonation,
    handleStatusUpdate,
    handleSelectDonation,
  } = useAdminDonationHistory();

  return (
    <AdminPageLayout
      title="Quản lý đơn yêu cầu hiến máu"
      description="Theo dõi và quản lý tất cả các quy trình hiến máu"
    >
      <AdminContentWrapper
        isLoading={isLoading}
        isEmpty={donations.length === 0}
        emptyStateComponent={<DonationHistoryEmptyState />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DonationHistoryList
            donations={donations}
            onSelectDonation={handleSelectDonation}
            onStatusUpdate={handleStatusUpdate}
          />

          <div className="lg:col-span-1">
            <DonationDetailPanel
              selectedDonation={selectedDonation}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>
      </AdminContentWrapper>
    </AdminPageLayout>
  );
};

export default AdminDonationHistoryPage;
