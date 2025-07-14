// src/hooks/useEmergencyPledges.js
import { useState, useCallback } from 'react';
import bloodRequestService from '../services/bloodRequestService';
import donationService from '../services/donationService';

export const useEmergencyPledges = () => {
  const [pledges, setPledges] = useState([]);
  const [donationProcesses, setDonationProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy pledges của một blood request cụ thể
  const fetchPledgesForRequest = useCallback(async (requestId) => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bloodRequestService.getRequestPledges(requestId);
      setPledges(response.data || []);
    } catch (err) {
      console.error('Error fetching pledges:', err);
      setError('Không thể tải danh sách người đăng ký hiến máu');
      setPledges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lấy tất cả donation processes (bao gồm cả từ emergency pledges)
  const fetchAllDonationProcesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await donationService.getAllDonationRequests();
      setDonationProcesses(response.data || []);
    } catch (err) {
      console.error('Error fetching donation processes:', err);
      setError('Không thể tải danh sách quy trình hiến máu');
      setDonationProcesses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lọc các donation processes được tạo từ emergency pledges
  const getEmergencyPledgeDonations = useCallback(() => {
    // Có thể lọc dựa vào thời gian tạo hoặc các tiêu chí khác
    // Hiện tại trả về tất cả, có thể cải thiện sau
    return donationProcesses.filter(process => 
      process.status === 'PENDING_APPROVAL' || 
      process.status === 'APPOINTMENT_PENDING'
    );
  }, [donationProcesses]);

  const refreshData = useCallback(async (requestId) => {
    if (requestId) {
      await fetchPledgesForRequest(requestId);
    }
    await fetchAllDonationProcesses();
  }, [fetchPledgesForRequest, fetchAllDonationProcesses]);

  return {
    pledges,
    donationProcesses,
    isLoading,
    error,
    fetchPledgesForRequest,
    fetchAllDonationProcesses,
    getEmergencyPledgeDonations,
    refreshData
  };
};
