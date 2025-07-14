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
  const [weekOffset, setWeekOffset] = useState(0);

  // Tính ngày đầu tuần và cuối tuần dựa trên weekOffset
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7); // getDay: 0=CN, 1=T2...
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startOfWeek = monday;
  const endOfWeek = sunday;

  const fetchDashboardStats = async (offset = weekOffset) => {
    try {
      setLoading(true);
      setError(null);
      const [statsResponse, quickResponse, weeklyResponse] = await Promise.all([
        staffService.getDashboardStats(),
        staffService.getQuickStats(),
        staffService.getWeeklyActivities(offset)
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
    fetchDashboardStats(weekOffset);
    // eslint-disable-next-line
  }, [weekOffset]);

  return {
    dashboardStats,
    quickStats,
    weeklyActivities,
    loading,
    error,
    refreshStats,
    weekOffset,
    setWeekOffset,
    startOfWeek,
    endOfWeek
  };
};

export default useStaffDashboard;
