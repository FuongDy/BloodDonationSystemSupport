// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  EmergencyRequestsInfoBox,
  EmergencyRequestsFilters,
  EmergencyRequestsTable,
} from '../../components/admin/admin_emergencyRequests';
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

  return (
    <AdminPageLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Yêu cầu khẩn cấp
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý các yêu cầu hiến máu khẩn cấp
            </p>
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
