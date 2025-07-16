// src/hooks/useBloodCollection.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';
import { useDonationProcess } from '../contexts/DonationProcessContext';

export const useBloodCollection = () => {
  const { navigateToTestResults } = useDonationProcess();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      let data = response.data || [];
      
      // Filter for blood collection related statuses
      data = data.filter(process => [
        DONATION_STATUS.HEALTH_CHECK_PASSED,
        DONATION_STATUS.BLOOD_COLLECTED
      ].includes(process.status));
      
      setCollections(data);
    } catch (error) {
      console.error('Error fetching blood collections:', error);
      toast.error('Không thể tải danh sách thu thập máu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBloodCollection = async (processId, collectionData) => {
    try {
      await donationService.markBloodAsCollected(processId, collectionData);
      toast.success('Thu thập máu thành công - Chuyển sang xét nghiệm');
      fetchCollections();
      
      // Navigate to test results after successful blood collection with a small delay
      setTimeout(() => {
        navigateToTestResults(processId);
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error marking blood as collected:', error);
      toast.error('Không thể đánh dấu đã lấy máu');
      return false;
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return {
    collections,
    isLoading,
    selectedProcess,
    showCollectionModal,
    setShowCollectionModal,
    handleBloodCollection,
    setSelectedProcess,
    fetchCollections,
  };
};
