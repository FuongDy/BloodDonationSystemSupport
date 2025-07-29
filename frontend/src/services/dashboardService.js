// src/services/dashboardService.js
import apiClient from './apiClient';

export const dashboardService = {
  // Lấy thống kê dashboard admin
  getAdminDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  },

  // Lấy dữ liệu hoạt động trong tuần
  getWeeklyActivityData: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/weekly-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly activity data:', error);
      throw error;
    }
  },

  // Lấy danh sách người hiến máu tích cực
  getActiveDonors: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/admin/dashboard/active-donors?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active donors:', error);
      throw error;
    }
  },

  // Lấy thống kê dashboard user (nếu cần)
  getUserDashboardStats: async () => {
    try {
      const response = await apiClient.get('/user/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user dashboard stats:', error);
      throw error;
    }
  }
};

export default dashboardService;
