// src/pages/MyAppointmentsPage.jsx
import {
    AppointmentDetailModal,
    AppointmentsList,
    AppointmentsPageHeader,
    RescheduleModal,
} from '../components/appointments';
import CCCDVerificationBanner from '../components/common/CCCDVerificationBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useMyAppointments } from '../hooks/useMyAppointments';
import Pagination from '@mui/material/Pagination';
import { useState, useMemo } from 'react';

const MyAppointmentsPage = () => {
  const { user } = useAuth();

  const {
    appointments,
    isLoading,
    showRescheduleDialog,
    rescheduleReason,
    setRescheduleReason,
    setShowRescheduleDialog,
    handleOpenReschedule,
    handleConfirmReschedule,
    showDetailModal,
    selectedAppointment,
    handleViewDetail,
    handleCloseDetailModal,
  } = useMyAppointments();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [pageSize] = useState(6);

  // Pagination logic
  const totalPages = Math.ceil(appointments.length / pageSize) || 1;
  const paginatedAppointments = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return appointments.slice(startIdx, startIdx + pageSize);
  }, [appointments, currentPage, pageSize]);

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message='Đang tải lịch hẹn...' />
      </MainLayout>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <AppointmentsPageHeader />
      
      <CCCDVerificationBanner 
        user={user} 
        className="mb-6"
        showOnVerified={false}
      />
      
      <AppointmentsList
        appointments={paginatedAppointments}
        onRequestReschedule={handleOpenReschedule}
        onViewDetail={handleViewDetail}
      />
      <div className="flex justify-center my-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </div>
      {/* <RescheduleModal
        isOpen={showRescheduleDialog}
        onClose={() => setShowRescheduleDialog(false)}
        rescheduleReason={rescheduleReason}
        setRescheduleReason={setRescheduleReason}
        onConfirm={handleConfirmReschedule}
      /> */}

      <AppointmentDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default MyAppointmentsPage;
