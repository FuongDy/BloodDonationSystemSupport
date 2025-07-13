// src/hooks/useMyAppointments.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from './useAuth';

const PAGE_SIZE = 5;

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyAppointments(page);
    }
  }, [isAuthenticated, page]);

  const fetchMyAppointments = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getMyAppointments({
        page: pageNum,
        size: PAGE_SIZE,
      });
      setAppointments(data.content || data);
      setTotalPages(data.totalPages || 1);
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
      fetchMyAppointments(page);
    } catch {
      toast.error('Gửi yêu cầu đổi lịch thất bại');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RESCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    // State
    appointments,
    isLoading,
    page,
    totalPages,
    showRescheduleDialog,
    rescheduleReason,
    
    // Actions
    setPage,
    setRescheduleReason,
    setShowRescheduleDialog,
    handleOpenReschedule,
    handleConfirmReschedule,
    getStatusColor,
    fetchMyAppointments,
  };
};
