// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React from 'react';
import { Plus, AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardHeader from '../../components/admin/DashboardHeader';
import {
  EmergencyRequestsInfoBox,
  EmergencyRequestsFilters,
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
  const pendingRequests = filteredRequests?.filter(req => req.status === 'pending')?.length || 0;
  const approvedRequests = filteredRequests?.filter(req => req.status === 'approved')?.length || 0;
  const urgentRequests = filteredRequests?.filter(req => req.urgencyLevel === 'critical')?.length || 0;

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
            label: "Đang chờ"
          },
          {
            icon: <CheckCircle className="w-5 h-5 text-green-300" />,
            value: approvedRequests,
            label: "Đã duyệt"
          },
          {
            icon: <Users className="w-5 h-5 text-orange-300" />,
            value: urgentRequests,
            label: "Rất khẩn cấp"
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
        <EmergencyRequestsInfoBox />

        {/* Filters */}
        <EmergencyRequestsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Requests List */}
        <EmergencyRequestsTable
          filteredRequests={filteredRequests}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </AdminPageLayout>
  );
};

export default AdminEmergencyRequestsPage;
