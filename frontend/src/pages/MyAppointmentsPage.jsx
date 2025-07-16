// src/pages/MyAppointmentsPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CCCDVerificationBanner from '../components/common/CCCDVerificationBanner';
import { useAuth } from '../hooks/useAuth';
import { useMyAppointments } from '../hooks/useMyAppointments';
import {
  AppointmentsPageHeader,
  AppointmentsList,
  RescheduleModal,
} from '../components/appointments';

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
  } = useMyAppointments();

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
        appointments={appointments}
        onRequestReschedule={handleOpenReschedule}
      />
      
      <RescheduleModal
        isOpen={showRescheduleDialog}
        onClose={() => setShowRescheduleDialog(false)}
        rescheduleReason={rescheduleReason}
        setRescheduleReason={setRescheduleReason}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  );
};

export default MyAppointmentsPage;
