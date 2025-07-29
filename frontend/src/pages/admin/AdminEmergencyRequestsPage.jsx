// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React, { useState, useMemo } from 'react';
import { Plus, AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import {
  EmergencyRequestsInfoBox,
  EmergencyRequestsTable,
} from '../../components/admin/emergencyRequests';
import { useEmergencyRequests } from '../../hooks/useEmergencyRequests';

const AdminEmergencyRequestsPage = () => {
  const navigate = useNavigate();
  const {
    filteredRequests,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    handleStatusUpdate,
    getStatusColor,
    getStatusText,
  } = useEmergencyRequests();

  // Pagination state (admin style: 10/page, 0-based index)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil((filteredRequests?.length || 0) / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const startIdx = currentPage * pageSize;
    return filteredRequests?.slice(startIdx, startIdx + pageSize) || [];
  }, [filteredRequests, currentPage, pageSize]);

  // Handler for page change
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev') return Math.max(prev - 1, 0);
      if (direction === 'next') return Math.min(prev + 1, totalPages - 1);
      return prev;
    });
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </AdminPageLayout>
    );
  }

  // Calculate stats
  const totalRequests = filteredRequests?.length || 0;
  const pendingRequests = filteredRequests?.filter(req => req.status === 'PENDING')?.length || 0;
  const fulfilledRequests = filteredRequests?.filter(req => req.status === 'FULFILLED' || req.status === 'COMPLETED')?.length || 0;
  const urgentRequests = filteredRequests?.filter(req => req.urgency === 'CRITICAL' || req.urgencyLevel === 'critical')?.length || 0;
  const readyToCompleteRequests = filteredRequests?.filter(req => 
    req.status === 'PENDING' && (req.pledgeCount >= req.quantityInUnits)
  )?.length || 0;

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'ready', label: 'Sẵn sàng hoàn thành' },
    // { value: 'FULFILLED', label: 'Đã hoàn thành' },
    // { value: 'COMPLETED', label: 'Đã hoàn thành' },
    // { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  // Filters configuration for AdminFiltersPanel
  const filtersConfig = [
    {
      key: 'status',
      label: 'Trạng thái',
      value: filterStatus,
      onChange: setFilterStatus,
      options: statusOptions,
    },
  ];

  // Check if filters are active
  const hasActiveFilters = searchTerm || filterStatus !== 'all';

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Yêu cầu khẩn cấp"
        description="Theo dõi và xử lý các yêu cầu hiến máu khẩn cấp, đảm bảo phản ứng nhanh chóng với các tình huống cần thiết."
        variant="emergency"
        showActivityFeed={false}
        stats={[
          {
            icon: <AlertTriangle className="w-5 h-5 text-red-300" />,
            value: totalRequests,
            label: "Tổng yêu cầu"
          },
          {
            icon: <Clock className="w-5 h-5 text-yellow-300" />,
            value: pendingRequests,
            label: "Đang chờ xử lý"
          },
          {
            icon: <CheckCircle className="w-5 h-5 text-green-300" />,
            value: fulfilledRequests,
            label: "Đã hoàn thành"
          },
          {
            icon: <Users className="w-5 h-5 text-blue-300" />,
            value: readyToCompleteRequests,
            label: "Sẵn sàng hoàn thành"
          }
        ]}
      />

      <div className='space-y-6'>
        {/* Header Actions */}
        <div className='flex items-center justify-between'>
          <div className="text-lg font-medium text-gray-700">
            Danh sách yêu cầu khẩn cấp
          </div>
          <Button 
            variant='primary'
            onClick={() => navigate('/admin/emergency-requests/create')}
          >
            <Plus className='w-4 h-4 mr-2' />
            Tạo yêu cầu mới
          </Button>
        </div>

        {/* Info Box */}
        {/* <EmergencyRequestsInfoBox /> */}

        {/* Filters */}
        <AdminFiltersPanel
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tên bệnh nhân, nhóm máu, bệnh viện..."
          filters={filtersConfig}
          showViewMode={false}
          totalCount={filteredRequests?.length || 0}
          filteredCount={filteredRequests?.length || 0}
          itemLabel="yêu cầu khẩn cấp"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Requests List */}
        <EmergencyRequestsTable
          filteredRequests={paginatedRequests}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          onStatusUpdate={handleStatusUpdate}
        />
        {/* Pagination (admin style, always visible) */}
        <div className="flex justify-end mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 0}
            >
              Trước
            </button>
            <button
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handlePageChange('next')}
              disabled={currentPage >= totalPages - 1}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminEmergencyRequestsPage;
