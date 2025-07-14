// src/services/staffService.js
import apiClient from './apiClient';

const staffService = {
  // Dashboard API
  getDashboardStats: () => {
    return apiClient.get('/staff/dashboard/stats');
  },

  getQuickStats: () => {
    return apiClient.get('/staff/quick-stats');
  },

  // Weekly Activities API
  getWeeklyActivities: (weekOffset = 0) => {
    return apiClient.get(`/staff/weekly-activities?weekOffset=${weekOffset}`);
  },

  // User Management API (Read-only for Staff)
  getAllUsers: (options = {}) => {
    const { page = 0, size = 10, sort = ['id', 'asc'] } = options;
    const params = { page, size, sort };
    return apiClient.get('/staff/users', { params });
  },

  getUserById: (userId) => {
    return apiClient.get(`/staff/users/${userId}`);
  },

  // Donation Management API - Staff endpoints
  getAllDonations: () => {
    return apiClient.get('/staff/donations/requests');
  },

  getTodayDonations: () => {
    return apiClient.get('/staff/donations/today');
  },

  getDonationStats: () => {
    return apiClient.get('/staff/donations/stats');
  },

  getAllDonationRequests: () => {
    return apiClient.get('/staff/donations/requests');
  },

  // Appointment Management API
  getTodayAppointments: () => {
    return apiClient.get('/appointments/today');
  },

  getUpcomingAppointments: () => {
    return apiClient.get('/appointments/upcoming');
  },

  getAllAppointments: () => {
    // Nếu muốn lấy lịch hẹn của staff hiện tại, dùng endpoint /appointments/my-appointments
    return apiClient.get('/appointments/my-appointments');
  },

  // Blood Request Management API
  getAllBloodRequests: (options = {}) => {
    const { page = 0, size = 10 } = options;
    return apiClient.get('/blood-requests', { params: { page, size } });
  },

  getActiveEmergencyRequests: () => {
    return apiClient.get('/blood-requests/search/active');
  },

  // Inventory Management API
  getInventoryStats: () => {
    return apiClient.get('/inventory/summary');
  },

  getAllInventory: () => {
    return apiClient.get('/inventory');
  },

  getRecentInventoryAdditions: () => {
    return apiClient.get('/inventory/recent');
  }
};

export default staffService;
