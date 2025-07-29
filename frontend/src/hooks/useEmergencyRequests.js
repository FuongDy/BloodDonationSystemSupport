// src/hooks/useEmergencyRequests.js
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import bloodRequestService from '../services/bloodRequestService';

export const useEmergencyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.getEmergencyRequests();
      const requestsData = response.data || response || [];
      
      // Debug logging to check data structure
      console.log('Emergency requests data:', requestsData);
      if (requestsData.length > 0) {
        console.log('First request sample:', requestsData[0]);
        console.log('Available fields:', Object.keys(requestsData[0]));
      }
      
      setRequests(requestsData);
    } catch (error) {
      console.error(error);

      // Handle different types of errors
      if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập để xem danh sách yêu cầu khẩn cấp');
      } else if (
        error.response?.status === 0 ||
        error.code === 'ECONNABORTED'
      ) {
        toast.error(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          'Không thể tải danh sách yêu cầu khẩn cấp';
        toast.error(errorMessage);
      }

      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await bloodRequestService.updateRequestStatus(requestId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Handle bloodType which could be an object
      const bloodTypeText = typeof request.bloodType === 'object'
        ? request.bloodType.bloodGroup || ''
        : (request.bloodType || '');
        
      const matchesSearch =
        request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bloodTypeText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filterStatus === 'all') {
        matchesFilter = true;
      } else if (filterStatus === 'ready') {
        // Sẵn sàng hoàn thành: status là PENDING và đã có đủ người đăng ký
        matchesFilter = request.status === 'PENDING' && (request.pledgeCount >= request.quantityInUnits);
      } else {
        matchesFilter = request.status === filterStatus;
      }

      return matchesSearch && matchesFilter;
    });
  }, [requests, searchTerm, filterStatus]);

  const getStatusColor = status => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ xử lý';
      case 'FULFILLED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  return {
    requests,
    filteredRequests,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    fetchRequests,
    handleStatusUpdate,
    getStatusColor,
    getStatusText,
  };
};
