// src/pages/admin/AdminDonationHistoryPage.jsx
import React, { useState, useMemo } from 'react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { useAdminDonationHistory } from '../../hooks/useAdminDonationHistory';
import {
  DonationDetailPanel,
  DonationHistoryEmptyState,
} from '../../components/admin/donationHistory';
import StatusBadge from '../../components/common/StatusBadge';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'donor', label: 'Người hiến máu' },
  { key: 'email', label: 'Email' },
  { key: 'bloodGroup', label: 'Nhóm máu' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: 'Ngày yêu cầu' },
  { key: 'actions', label: 'Thao tác' },
];

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
};

const AdminDonationHistoryPage = () => {
  const {
    donations,
    isLoading,
    selectedDonation,
    handleStatusUpdate,
    handleSelectDonation,
  } = useAdminDonationHistory();

  const [search, setSearch] = useState('');

  const filteredDonations = useMemo(() => {
    if (!search) return donations;
    return donations.filter((d) =>
      (d.donor?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.donor?.email || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [donations, search]);

  return (
    <AdminPageLayout
      title="Quản lý lịch sử hiến máu"
      description="Theo dõi và quản lý các quy trình hiến máu đã hoàn thành hoặc không đạt xét nghiệm."
      showSearch
      onSearch={setSearch}
      searchPlaceholder="Tìm kiếm theo tên hoặc email người hiến máu..."
    >
      <div className="p-6">
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={filteredDonations.length > 0}
          loadingMessage="Đang tải lịch sử hiến máu..."
          emptyMessage={<DonationHistoryEmptyState />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table List */}
            <div className="lg:col-span-2 overflow-x-auto">
              <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedDonation?.id === donation.id ? 'bg-red-50' : ''}`}
                        onClick={() => handleSelectDonation(donation)}
                      >
                        <td className="px-4 py-2">{donation.id}</td>
                        <td className="px-4 py-2">{donation.donor?.fullName || 'N/A'}</td>
                        <td className="px-4 py-2">{donation.donor?.email || 'N/A'}</td>
                        <td className="px-4 py-2">{donation.donor?.bloodGroup || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={donation.status} type="donation" />
                        </td>
                        <td className="px-4 py-2">{formatDate(donation.createdAt)}</td>
                        <td className="px-4 py-2">
                          <button
                            className="text-red-600 hover:underline text-sm font-medium"
                            onClick={e => { e.stopPropagation(); handleSelectDonation(donation); }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              <DonationDetailPanel
                selectedDonation={selectedDonation}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </div>
        </AdminContentWrapper>
      </div>
    </AdminPageLayout>
  );
};

export default AdminDonationHistoryPage;
