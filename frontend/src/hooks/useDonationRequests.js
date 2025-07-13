// src/hooks/useDonationRequests.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';

export const useDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      let data = response.data || [];
      
      // Filter by status
      if (filters.status) {
        data = data.filter(request => request.status === filters.status);
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        data = data.filter(request =>
          request.donor?.fullName?.toLowerCase().includes(searchTerm) ||
          request.donor?.email?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Only show requests that need approval or are in early stages
      data = data.filter(request => [
        DONATION_STATUS.PENDING_APPROVAL,
        DONATION_STATUS.APPOINTMENT_PENDING,
        DONATION_STATUS.REJECTED
      ].includes(request.status));
      
      setRequests(data);
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      toast.error('Không thể tải danh sách đơn yêu cầu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await donationService.updateDonationStatus(requestId, {
        newStatus: DONATION_STATUS.APPOINTMENT_PENDING,
        note: 'Đơn yêu cầu đã được duyệt, chờ tạo lịch hẹn'
      });
      toast.success('Duyệt đơn yêu cầu thành công');
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Không thể duyệt đơn yêu cầu');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await donationService.updateDonationStatus(requestId, {
        newStatus: DONATION_STATUS.REJECTED,
        note: 'Đơn yêu cầu bị từ chối'
      });
      toast.success('Từ chối đơn yêu cầu thành công');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Không thể từ chối đơn yêu cầu');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  return {
    requests,
    isLoading,
    filters,
    setFilters,
    handleApprove,
    handleReject,
    fetchRequests,
  };
};
