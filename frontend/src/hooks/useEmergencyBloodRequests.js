// src/hooks/useEmergencyBloodRequests.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import bloodRequestService from '../services/bloodRequestService';

export const useEmergencyBloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.searchActiveRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error(error);

      // Handle different types of errors
      if (error.response?.status === 401) {
        // Authentication error - show a more specific message
        toast.error('Bạn cần đăng nhập để xem danh sách yêu cầu máu khẩn cấp');
      } else if (
        error.response?.status === 0 ||
        error.code === 'ECONNABORTED'
      ) {
        // Network error or timeout
        toast.error(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
        );
      } else {
        // Other errors
        const errorMessage =
          error.response?.data?.message ||
          'Không thể tải danh sách yêu cầu máu khẩn cấp';
        toast.error(errorMessage);
      }

      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePledgeSuccess = () => {
    fetchActiveRequests(); // Refresh để cập nhật pledge count
    toast.success(
      'Cảm ơn bạn đã cam kết hiến máu! Vui lòng đến bệnh viện theo thông tin được cung cấp.'
    );
  };

  return {
    requests,
    isLoading,
    fetchActiveRequests,
    handlePledgeSuccess,
  };
};
