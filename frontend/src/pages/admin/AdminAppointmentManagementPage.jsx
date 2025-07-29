// src/pages/admin/AdminAppointmentManagementPage.jsx
import React, { useState, useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import {
  AppointmentStatsCards,
  AppointmentTable,
  CreateAppointmentModal,
  RescheduleAppointmentModal,
} from '../../components/admin/appointments';
import { AppointmentDetailModal } from '../../components/admin/modals';
import { useAppointmentManagement } from '../../hooks/useAppointmentManagement';
import StatusBadge from '../../components/common/StatusBadge';

const AdminAppointmentManagementPage = () => {
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    // Data
    appointments,
    processes,
    isLoading,
    selectedAppointment,
    
    // Modals
    showCreateModal,
    showRescheduleModal,
    setShowCreateModal,
    setShowRescheduleModal,
    
    // Forms
    appointmentForm,
    setAppointmentForm,
    rescheduleForm,
    setRescheduleForm,
    
    // Handlers
    fetchData,
    handleCreateAppointment,
    handleRequestReschedule,
    openCreateModal,
    openRescheduleModal,
    
    // Utilities
    getStatusColor,
    isUpcoming,
    isPast,
  } = useAppointmentManagement();

  const handleViewDetail = (appointment) => {
    setSelectedAppointmentDetail(appointment);
    setShowDetailModal(true);
  };

  // Pagination state (admin style: 10/page, always visible)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(appointments.length / pageSize) || 1;
  const paginatedAppointments = useMemo(() => {
    const startIdx = currentPage * pageSize;
    return appointments.slice(startIdx, startIdx + pageSize);
  }, [appointments, currentPage, pageSize]);

  const headerActions = [
    {
      label: 'Tạo lịch hẹn',
      icon: Plus,
      variant: 'primary',
      onClick: openCreateModal,
    },
    {
      label: 'Làm mới',
      icon: Calendar,
      variant: 'outline',
      onClick: fetchData,
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý Lịch hẹn'
      description='Quản lý lịch hẹn hiến máu và theo dõi tình hình thực hiện'
      headerActions={headerActions}
    >
      <div className='p-6 space-y-6'>
        {/* Statistics Cards */}
        <AppointmentStatsCards
          appointments={appointments}
          processes={processes}
          isUpcoming={isUpcoming}
          isPast={isPast}
        />

        {/* Table */}
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={appointments.length > 0}
          loadingMessage='Đang tải danh sách lịch hẹn...'
          emptyMessage='Chưa có lịch hẹn nào'
        >
          <AppointmentTable
            appointments={paginatedAppointments}
            isLoading={isLoading}
            onReschedule={openRescheduleModal}
            onViewDetail={handleViewDetail}
            getStatusColor={getStatusColor}
            isUpcoming={isUpcoming}
            columns={[
              {
                key: 'status',
                title: 'Trạng thái',
                dataIndex: 'status',
                render: value => <StatusBadge status={value} type="donation" />,
              },
            ]}
          />
          {/* Pagination (admin style, always visible) */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                Trước
              </button>
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </div>
        </AdminContentWrapper>

        {/* Create Appointment Modal */}
        <CreateAppointmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          appointmentForm={appointmentForm}
          setAppointmentForm={setAppointmentForm}
          processes={processes}
          onSubmit={handleCreateAppointment}
        />

        {/* Reschedule Modal */}
        <RescheduleAppointmentModal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          selectedAppointment={selectedAppointment}
          rescheduleForm={rescheduleForm}
          setRescheduleForm={setRescheduleForm}
          onSubmit={handleRequestReschedule}
        />

        {/* Appointment Detail Modal */}
        <AppointmentDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          appointment={selectedAppointmentDetail}
        />
      </div>
    </AdminPageLayout>
  );
};

export default AdminAppointmentManagementPage;
