// src/hooks/useEmergencyBloodRequests.js
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import bloodRequestService from '../services/bloodRequestService';

export const useEmergencyBloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

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

  // Filter logic
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          request.hospitalName?.toLowerCase().includes(searchLower) ||
          request.id?.toString().includes(searchLower) ||
          request.patientName?.toLowerCase().includes(searchLower) ||
          request.description?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Blood group filter
      if (bloodGroupFilter !== 'ALL') {
        // Handle both bloodType formats: string or object with bloodGroup property
        const requestBloodType = request.bloodType?.bloodGroup || request.bloodType;
        if (requestBloodType !== bloodGroupFilter) return false;
      }

      // Urgency filter
      if (urgencyFilter !== 'ALL') {
        // Handle both urgency field names: urgency and urgencyLevel
        const requestUrgency = request.urgency || request.urgencyLevel;
        if (requestUrgency !== urgencyFilter) return false;
      }

      return true;
    });
  }, [requests, searchTerm, bloodGroupFilter, urgencyFilter]);

  // Filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleBloodGroupChange = (value) => {
    setBloodGroupFilter(value);
  };

  const handleUrgencyChange = (value) => {
    setUrgencyFilter(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setBloodGroupFilter('ALL');
    setUrgencyFilter('ALL');
  };

  return {
    requests,
    filteredRequests,
    totalRequests: requests.length,
    isLoading,
    fetchActiveRequests,
    handlePledgeSuccess,
    // Filter states and handlers
    searchTerm,
    bloodGroupFilter,
    urgencyFilter,
    handleSearchChange,
    handleBloodGroupChange,
    handleUrgencyChange,
    handleClearFilters,
  };
};
