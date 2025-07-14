// src/hooks/useHealthChecks.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';
import { useDonationProcess } from '../contexts/DonationProcessContext';

export const useHealthChecks = () => {
  const { navigateToBloodCollection } = useDonationProcess();
  const [healthChecks, setHealthChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);

  const fetchHealthChecks = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      let data = response.data || [];
      
      console.log('All donation processes:', data);
      console.log('Processes statuses:', data.map(p => ({ id: p.id, status: p.status })));
      
      // Filter for health check related statuses
      data = data.filter(process => [
        DONATION_STATUS.APPOINTMENT_SCHEDULED,
        DONATION_STATUS.HEALTH_CHECK_PASSED,
        DONATION_STATUS.HEALTH_CHECK_FAILED
      ].includes(process.status));
      
      console.log('Filtered health check processes:', data);
      setHealthChecks(data);
    } catch (error) {
      console.error('Error fetching health checks:', error);
      toast.error('Không thể tải danh sách khám sức khỏe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async (processId, healthCheckData) => {
    try {
      await donationService.recordHealthCheck(processId, healthCheckData);
      
      if (healthCheckData.isEligible === true) {
        toast.success('Khám sàng lọc đạt - Chuyển sang thu thập máu');
        // Navigate to blood collection if health check passed with a small delay
        setTimeout(() => {
          navigateToBloodCollection(processId);
        }, 1000);
      } else {
        toast.success('Ghi nhận kết quả khám sàng lọc thành công');
      }
      
      fetchHealthChecks();
      return true;
    } catch (error) {
      console.error('Error recording health check:', error);
      toast.error('Không thể ghi nhận kết quả khám sàng lọc');
      return false;
    }
  };

  // Simple navigation function that doesn't call API
  const handleHealthCheckNavigation = (processId, healthCheckData) => {
    if (healthCheckData.isEligible === true) {
      setTimeout(() => {
        navigateToBloodCollection(processId);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

  return {
    healthChecks,
    isLoading,
    selectedProcess,
    showHealthCheckModal,
    setShowHealthCheckModal,
    handleHealthCheck,
    handleHealthCheckNavigation,
    setSelectedProcess,
    fetchHealthChecks,
  };
};
