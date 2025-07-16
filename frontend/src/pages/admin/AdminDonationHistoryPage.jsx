// src/pages/admin/AdminDonationHistoryPage.jsx
import React, { useState, useMemo } from 'react';
import { History, TrendingUp, Users, Heart, Activity, Eye, RefreshCw, Download, Calendar } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import { useAdminDonationHistory } from '../../hooks/useAdminDonationHistory';
import {
  DonationDetailPanel,
  DonationHistoryEmptyState,
} from '../../components/admin/donationHistory';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDateTime } from '../../utils/formatters';

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
    refreshData,
  } = useAdminDonationHistory();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);

  // Handler để mở modal chi tiết
  const handleViewDetail = (donation) => {
    setCurrentDonation(donation);
    setShowDetailModal(true);
    handleSelectDonation(donation);
  };

  // Handler để đóng modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setCurrentDonation(null);
  };

  const filteredDonations = useMemo(() => {
    let filtered = donations || [];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((d) =>
        (d.donor?.fullName || '').toLowerCase().includes(searchLower) ||
        (d.donor?.email || '').toLowerCase().includes(searchLower) ||
        (d.donor?.phone || '').toLowerCase().includes(searchLower) ||
        (d.id || '').toString().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'TODAY':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'WEEK':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'MONTH':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'QUARTER':
          startDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      if (dateRange !== 'ALL') {
        filtered = filtered.filter(d => new Date(d.createdAt) >= startDate);
      }
    }

    return filtered;
  }, [donations, search, statusFilter, dateRange]);

  // Calculate stats
  const totalDonations = donations?.length || 0;
  const completedDonations = donations?.filter(d => d.status === 'completed')?.length || 0;
  const pendingDonations = donations?.filter(d => d.status === 'pending')?.length || 0;
  const cancelledDonations = donations?.filter(d => d.status === 'cancelled')?.length || 0;
  const successRate = totalDonations > 0 ? Math.round((completedDonations / totalDonations) * 100) : 0;

  // Status options for filter
  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Đang xử lý' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'ALL', label: 'Tất cả thời gian' },
    { value: 'TODAY', label: 'Hôm nay' },
    { value: 'WEEK', label: '7 ngày qua' },
    { value: 'MONTH', label: '30 ngày qua' },
    { value: 'QUARTER', label: '3 tháng qua' },
  ];

  // Filters configuration for AdminFiltersPanel
  const filtersConfig = [
    {
      key: 'status',
      label: 'Trạng thái',
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
    },
    {
      key: 'dateRange',
      label: 'Thời gian',
      value: dateRange,
      onChange: setDateRange,
      options: dateRangeOptions,
    },
  ];

  // Check if filters are active
  const hasActiveFilters = search || statusFilter !== 'ALL' || dateRange !== 'ALL';

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setDateRange('ALL');
  };

  // Header actions
  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      variant: 'outline',
      onClick: refreshData || (() => window.location.reload()),
    },
  ];

  return (
    <AdminPageLayout
      title="Quản lý Lịch sử hiến máu"
      description="Theo dõi và quản lý các quy trình hiến máu đã hoàn thành, bao gồm thông tin người hiến và kết quả xét nghiệm."
      headerActions={headerActions}
    >
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Lịch sử hiến máu"
        description="Theo dõi và quản lý các quy trình hiến máu đã hoàn thành"
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
        {/* Filters and Search */}
        <AdminFiltersPanel
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại hoặc ID..."
          filters={filtersConfig}
          showViewMode={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={totalDonations}
          filteredCount={filteredDonations.length}
          itemLabel="lượt hiến máu"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={filteredDonations.length > 0}
          loadingMessage="Đang tải lịch sử hiến máu..."
          emptyMessage={<DonationHistoryEmptyState />}
        >
          {/* Table/Cards List - Full width */}
          <div className="w-full">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map((col) => (
                          <th 
                            key={col.key} 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDonations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleViewDetail(donation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{donation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {donation.donor?.fullName || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation.donor?.phone || 'Chưa cập nhật'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.donor?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {donation.donor?.bloodType || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={donation.status} type="donation" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(donation.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              onClick={e => { 
                                e.stopPropagation(); 
                                handleViewDetail(donation); 
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewDetail(donation)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donation.donor?.fullName || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-500">#{donation.id}</p>
                      </div>
                      <StatusBadge status={donation.status} type="donation" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 truncate ml-2">{donation.donor?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nhóm máu:</span>
                        <span className="text-red-600 font-medium">
                          {donation.donor?.bloodType || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="text-gray-900">{formatDateTime(donation.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        className="w-full text-center text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
                        onClick={e => { 
                          e.stopPropagation(); 
                          handleViewDetail(donation); 
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminContentWrapper>

        {/* Modal chi tiết */}
        <Modal
          isOpen={showDetailModal}
          onClose={handleCloseModal}
          title={`Chi tiết lịch sử hiến máu #${currentDonation?.id || ''}`}
          size="lg"
        >
          <div className="p-6">
            <DonationDetailPanel
              selectedDonation={currentDonation}
              onStatusUpdate={handleStatusUpdate}
              isModal={true}
            />
          </div>
        </Modal>
      </div>
    </AdminPageLayout>
  );
};

export default AdminDonationHistoryPage;
