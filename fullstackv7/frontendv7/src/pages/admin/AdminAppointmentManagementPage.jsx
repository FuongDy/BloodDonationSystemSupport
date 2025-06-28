// src/pages/admin/AdminAppointmentManagementPage.jsx
import React from 'react';
import { Plus, Calendar } from 'lucide-react';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import {
  AppointmentStatsCards,
  AppointmentTable,
  CreateAppointmentModal,
  RescheduleAppointmentModal,
} from '../../components/admin/admin_appointments';
import { useAppointmentManagement } from '../../hooks/useAppointmentManagement';

const AdminAppointmentManagementPage = () => {
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
            appointments={appointments}
            isLoading={isLoading}
            onReschedule={openRescheduleModal}
            getStatusColor={getStatusColor}
            isUpcoming={isUpcoming}
          />
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
      </div>
    </AdminPageLayout>
  );
};

export default AdminAppointmentManagementPage;
