// src/hooks/useAdminDashboard.js
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dashboardService from '../services/dashboardService';

export const useAdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [weeklyActivityData, setWeeklyActivityData] = useState(null);
  const [activeDonors, setActiveDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setError(null);
      const stats = await dashboardService.getAdminDashboardStats();
      setDashboardStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err);
      toast.error('Không thể tải dữ liệu thống kê dashboard');
      throw err;
    }
  }, []);

  // Fetch weekly activity data
  const fetchWeeklyActivityData = useCallback(async () => {
    try {
      setError(null);
      const weeklyData = await dashboardService.getWeeklyActivityData();
      setWeeklyActivityData(weeklyData);
      return weeklyData;
    } catch (err) {
      console.error('Error fetching weekly activity data:', err);
      setError(err);
      toast.error('Không thể tải dữ liệu hoạt động trong tuần');
      throw err;
    }
  }, []);

  // Fetch active donors data
  const fetchActiveDonors = useCallback(async () => {
    try {
      setError(null);
      const donors = await dashboardService.getActiveDonors(5); // Lấy top 5 người hiến máu tích cực
      setActiveDonors(donors);
      return donors;
    } catch (err) {
      console.error('Error fetching active donors:', err);
      setError(err);
      toast.error('Không thể tải danh sách người hiến máu tích cực');
      throw err;
    }
  }, []);

  // Fetch all dashboard data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchWeeklyActivityData(),
        fetchActiveDonors()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats, fetchWeeklyActivityData, fetchActiveDonors]);

  // Refresh all data
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Transform data for charts if needed
  const transformedWeeklyData = weeklyActivityData?.weeklyData || [];

  // Calculate additional metrics
  const totalDonationsThisWeek = transformedWeeklyData.reduce((sum, item) => sum + item.donations, 0);
  const totalAppointmentsThisWeek = transformedWeeklyData.reduce((sum, item) => sum + item.appointments, 0);
  const totalRequestsThisWeek = transformedWeeklyData.reduce((sum, item) => sum + item.requests, 0);

  return {
    // Data
    dashboardStats,
    weeklyActivityData: transformedWeeklyData,
    activeDonors,
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    refreshData,
    fetchDashboardStats,
    fetchWeeklyActivityData,
    fetchActiveDonors,
    
    // Computed values
    totalDonationsThisWeek,
    totalAppointmentsThisWeek,
    totalRequestsThisWeek,
  };
};

export default useAdminDashboard;
