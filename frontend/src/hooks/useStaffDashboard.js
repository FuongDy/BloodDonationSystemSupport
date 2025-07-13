// src/hooks/useStaffDashboard.js
import { useState, useEffect } from 'react';
import staffService from '../services/staffService';
import toast from 'react-hot-toast';

export const useStaffDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [weeklyActivities, setWeeklyActivities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, quickResponse, weeklyResponse] = await Promise.all([
        staffService.getDashboardStats(),
        staffService.getQuickStats(),
        staffService.getWeeklyActivities()
      ]);

      setDashboardStats(statsResponse.data);
      setQuickStats(quickResponse.data);
      setWeeklyActivities(weeklyResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchDashboardStats();
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    dashboardStats,
    quickStats,
    weeklyActivities,
    loading,
    error,
    refreshStats
  };
};

export default useStaffDashboard;
