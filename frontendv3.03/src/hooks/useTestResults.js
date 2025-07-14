// src/hooks/useTestResults.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { DONATION_STATUS } from '../utils/constants';

export const useTestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showTestResultModal, setShowTestResultModal] = useState(false);

  const fetchTestResults = async () => {
    setIsLoading(true);
    try {
      const response = await donationService.getAllDonationRequests();
      let data = response.data || [];
      
      // Filter for test result related statuses
      data = data.filter(process => [
        DONATION_STATUS.BLOOD_COLLECTED,
        DONATION_STATUS.COMPLETED,
        DONATION_STATUS.TESTING_FAILED
      ].includes(process.status));
      
      setTestResults(data);
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Không thể tải danh sách kết quả xét nghiệm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestResult = async (processId, testResultData) => {
    try {
      await donationService.recordBloodTestResult(processId, testResultData);
      toast.success('Ghi nhận kết quả xét nghiệm thành công');
      fetchTestResults();
      return true;
    } catch (error) {
      console.error('Error recording test result:', error);
      toast.error('Không thể ghi nhận kết quả xét nghiệm');
      return false;
    }
  };

  useEffect(() => {
    fetchTestResults();
  }, []);

  return {
    testResults,
    isLoading,
    selectedProcess,
    showTestResultModal,
    setShowTestResultModal,
    handleTestResult,
    setSelectedProcess,
    fetchTestResults,
  };
};
