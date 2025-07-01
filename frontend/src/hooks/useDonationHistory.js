// src/hooks/useDonationHistory.js
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import donationService from '../services/donationService';
import { useAuth } from './useAuth';

export const useDonationHistory = () => {
  const { user } = useAuth();
  const [donationProcesses, setDonationProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonationHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationService.getMyDonationHistory();
      setDonationProcesses(response.data || []);
    } catch (error) {
      console.error('Error fetching donation history:', error);
      setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại.');
      toast.error('Không thể tải lịch sử hiến máu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDonationHistory();
    }
  }, [user]);

  // Calculate statistics using useMemo for performance
  const stats = useMemo(() => {
    const total = donationProcesses.length;
    const completed = donationProcesses.filter(p => p.status === 'COMPLETED').length;
    const scheduled = donationProcesses.filter(p => p.status === 'SCHEDULED').length;
    const pending = donationProcesses.filter(p => p.status === 'PENDING').length;
    const totalVolume = donationProcesses
      .filter(p => p.status === 'COMPLETED' && p.collectedVolumeMl)
      .reduce((sum, p) => sum + p.collectedVolumeMl, 0);

    return {
      total,
      completed,
      scheduled,
      pending,
      totalVolume,
    };
  }, [donationProcesses]);

  const handleRefresh = () => {
    fetchDonationHistory();
  };

  return {
    donationProcesses,
    loading,
    error,
    stats,
    handleRefresh,
  };
};
