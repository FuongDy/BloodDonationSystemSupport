// src/hooks/useMyAppointments.js
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from './useAuth';

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  
  // New state for detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyAppointments();
    }
  }, [isAuthenticated]);

  const fetchMyAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getMyAppointments();
      setAppointments(data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn');
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReschedule = appointmentId => {
    setSelectedAppointmentId(appointmentId);
    setRescheduleReason('');
    setShowRescheduleDialog(true);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleReason.trim()) {
      toast.error('Vui lòng nhập lý do đổi lịch');
      return;
    }
    // eslint-disable-next-line no-alert
    if (!window.confirm('Bạn chắc chắn muốn yêu cầu đổi lịch này?')) return;
    
    try {
      await appointmentService.requestReschedule(selectedAppointmentId, {
        reason: rescheduleReason,
      });
      toast.success('Yêu cầu đổi lịch đã được gửi!');
      setShowRescheduleDialog(false);
      fetchMyAppointments();
    } catch {
      toast.error('Gửi yêu cầu đổi lịch thất bại');
    }
  };

  // New function to handle view detail
  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedAppointment(null);
  };

  return {
    // State
    appointments,
    isLoading,
    showRescheduleDialog,
    rescheduleReason,
    showDetailModal,
    selectedAppointment,
    
    // Actions
    setRescheduleReason,
    setShowRescheduleDialog,
    handleOpenReschedule,
    handleConfirmReschedule,
    handleViewDetail,
    handleCloseDetailModal,
    fetchMyAppointments,
  };
};
