// src/hooks/useDonationRequests.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';
import { useDonationProcess } from '../contexts/DonationProcessContext';

export const useDonationRequests = () => {
  const { navigateToAppointments } = useDonationProcess();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
  });

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      let data = response.data || [];

      // Only show requests that need approval or are in early stages
      data = data.filter(request => [
        DONATION_STATUS.PENDING_APPROVAL,
        DONATION_STATUS.APPOINTMENT_PENDING,
        DONATION_STATUS.REJECTED
      ].includes(request.status));

      // Filter by status (only if not "ALL")
      if (filters.status && filters.status !== 'ALL') {
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
      toast.success('Duyệt đơn yêu cầu thành công - Chuyển sang tạo lịch hẹn');
      fetchRequests();
      
      // Navigate to appointments tab after successful approval with a small delay
      setTimeout(() => {
        navigateToAppointments(requestId);
      }, 1000);
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
