// src/hooks/useAppointmentManagement.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import appointmentService from '../services/appointmentService';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';

export const useAppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Form states
  const [appointmentForm, setAppointmentForm] = useState({
    processId: '',
    appointmentDateTime: '',
    location: 'Bệnh viện Huyết học - FPT',
    notes: '',
    staffId: null,
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    reason: '',
    suggestedDateTime: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Lấy danh sách tất cả donation processes để hiển thị appointments
      const processResponse = await donationService.getAllDonationRequests();
      const allProcesses = processResponse.data || [];

      // Lọc các processes có appointment
      const processesWithAppointments = allProcesses.filter(p => p.appointment);
      setAppointments(processesWithAppointments);

      // Lấy processes cần tạo appointment (APPOINTMENT_PENDING, RESCHEDULE_REQUESTED)
      const processesNeedingAppointment = allProcesses.filter(
        p =>
          p.status === DONATION_STATUS.APPOINTMENT_PENDING ||
          p.status === DONATION_STATUS.RESCHEDULE_REQUESTED
      );
      setProcesses(processesNeedingAppointment);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu lịch hẹn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!appointmentForm.processId || !appointmentForm.appointmentDateTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await appointmentService.createAppointment(appointmentForm);
      toast.success('Tạo lịch hẹn thành công');
      setShowCreateModal(false);
      setAppointmentForm({
        processId: '',
        appointmentDateTime: '',
        location: 'Bệnh viện Huyết học - FPT',
        notes: '',
        staffId: null,
      });
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Không thể tạo lịch hẹn');
    }
  };

  const handleRequestReschedule = async () => {
    if (!rescheduleForm.reason) {
      toast.error('Vui lòng nhập lý do đổi lịch');
      return;
    }

    try {
      await appointmentService.requestReschedule(
        selectedAppointment.appointment.id,
        rescheduleForm
      );
      toast.success('Yêu cầu đổi lịch thành công');
      setShowRescheduleModal(false);
      setRescheduleForm({ reason: '', suggestedDateTime: '' });
      fetchData();
    } catch (error) {
      console.error('Error requesting reschedule:', error);
      toast.error('Không thể yêu cầu đổi lịch');
    }
  };

  const openCreateModal = () => {
    setAppointmentForm({
      processId: '',
      appointmentDateTime: '',
      location: 'Bệnh viện Huyết học - FPT',
      notes: '',
      staffId: null,
    });
    setShowCreateModal(true);
  };

  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({ reason: '', suggestedDateTime: '' });
    setShowRescheduleModal(true);
  };

  const getStatusColor = status => {
    switch (status) {
      case DONATION_STATUS.APPOINTMENT_SCHEDULED:
        return 'info';
      case DONATION_STATUS.RESCHEDULE_REQUESTED:
        return 'warning';
      case DONATION_STATUS.HEALTH_CHECK_PASSED:
        return 'success';
      case DONATION_STATUS.HEALTH_CHECK_FAILED:
        return 'error';
      default:
        return 'info';
    }
  };

  const isUpcoming = dateTime => {
    return new Date(dateTime) > new Date();
  };

  const isPast = dateTime => {
    return new Date(dateTime) < new Date();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
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
  };
};
