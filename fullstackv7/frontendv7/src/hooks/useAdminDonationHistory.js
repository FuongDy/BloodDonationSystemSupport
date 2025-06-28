// src/hooks/useAdminDonationHistory.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';

export const useAdminDonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const response = await donationService.getAllDonationRequests();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Lỗi khi tải đơn yêu cầu hiến máu');
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await donationService.updateDonationStatus(donationId, { newStatus });
      toast.success('Cập nhật trạng thái thành công');
      await fetchDonations();
      
      // Update selected donation if it's the one being updated
      if (selectedDonation && selectedDonation.id === donationId) {
        const updatedDonations = await donationService.getAllDonationRequests();
        const updatedDonation = updatedDonations.data?.find(d => d.id === donationId);
        if (updatedDonation) {
          setSelectedDonation(updatedDonation);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation);
  };

  return {
    donations,
    isLoading,
    selectedDonation,
    handleStatusUpdate,
    handleSelectDonation,
    refetchDonations: fetchDonations,
  };
};
