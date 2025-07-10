// src/hooks/useDonationProcess.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import appointmentService from '../services/appointmentService';

export const useDonationProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      setProcesses(response.data || []);
    } catch (error) {
      console.error('Error fetching donation processes:', error);
      toast.error('Không thể tải danh sách quy trình hiến máu');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (processId, statusForm) => {
    try {
      await donationService.updateDonationStatus(processId, statusForm);
      toast.success('Cập nhật trạng thái thành công');
      fetchProcesses();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
      return false;
    }
  };

  const recordHealthCheck = async (processId, healthCheckForm) => {
    try {
      await donationService.recordHealthCheck(processId, healthCheckForm);
      toast.success('Ghi nhận kết quả khám sàng lọc thành công');
      fetchProcesses();
      return true;
    } catch (error) {
      console.error('Error recording health check:', error);
      toast.error('Không thể ghi nhận kết quả khám sàng lọc');
      return false;
    }
  };

  const markBloodAsCollected = async (processId, collectionForm) => {
    try {
      await donationService.markBloodAsCollected(processId, collectionForm);
      toast.success('Đánh dấu đã lấy máu thành công');
      fetchProcesses();
      return true;
    } catch (error) {
      console.error('Error marking blood as collected:', error);
      toast.error('Không thể đánh dấu đã lấy máu');
      return false;
    }
  };

  const recordTestResult = async (processId, testResultForm) => {
    try {
      await donationService.recordBloodTestResult(processId, testResultForm);
      toast.success('Ghi nhận kết quả xét nghiệm thành công');
      fetchProcesses();
      return true;
    } catch (error) {
      console.error('Error recording test result:', error);
      toast.error('Không thể ghi nhận kết quả xét nghiệm');
      return false;
    }
  };

  const createAppointment = async appointmentData => {
    try {
      await appointmentService.createAppointment(appointmentData);
      toast.success('Tạo lịch hẹn thành công');
      fetchProcesses();
      return true;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Không thể tạo lịch hẹn');
      return false;
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return {
    processes,
    isLoading,
    selectedProcess,
    setSelectedProcess,
    fetchProcesses,
    updateStatus,
    recordHealthCheck,
    markBloodAsCollected,
    recordTestResult,
    createAppointment,
  };
};
