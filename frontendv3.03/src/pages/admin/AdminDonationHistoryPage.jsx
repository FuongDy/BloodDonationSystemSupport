// src/pages/admin/AdminDonationHistoryPage.jsx
import React, { useState, useMemo } from 'react';
import { History, TrendingUp, Users, Heart, Activity } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DashboardHeader from '../../components/admin/DashboardHeader';
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

  // Calculate stats
  const totalDonations = donations?.length || 0;
  const completedDonations = donations?.filter(d => d.status === 'completed')?.length || 0;
  const pendingDonations = donations?.filter(d => d.status === 'pending')?.length || 0;
  const successRate = totalDonations > 0 ? Math.round((completedDonations / totalDonations) * 100) : 0;

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Lịch sử hiến máu"
        description="Theo dõi và quản lý các quy trình hiến máu đã hoàn thành, bao gồm thông tin người hiến và kết quả xét nghiệm."
        variant="donation-history"
        showActivityFeed={false}
        stats={[
          {
            icon: <History className="w-5 h-5 text-amber-300" />,
            value: totalDonations,
            label: "Tổng lượt hiến"
          },
          {
            icon: <Heart className="w-5 h-5 text-red-300" />,
            value: completedDonations,
            label: "Hoàn thành"
          },
          {
            icon: <Activity className="w-5 h-5 text-blue-300" />,
            value: pendingDonations,
            label: "Đang xử lý"
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-green-300" />,
            value: `${successRate}%`,
            label: "Tỷ lệ thành công"
          }
        ]}
      />

      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-gray-700">
            Danh sách lịch sử hiến máu
          </div>
          <div className="w-96">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email người hiến máu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

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
                        <td className="px-4 py-2">{donation.donor?.bloodType|| 'N/A'}</td>
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
