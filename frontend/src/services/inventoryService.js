// src/services/inventoryService.js
import apiClient from './apiClient';

const inventoryService = {
  // Get all inventory (Admin)
  getAllInventory: () => {
    return apiClient.get('/admin/inventory').then(res => res.data);
  },

  // Get inventory summary (Admin)
  getInventorySummary: () => {
    return apiClient.get('/admin/inventory/summary').then(res => res.data);
  },

  // Get recent additions (Admin)
  getRecentAdditions: () => {
    return apiClient.get('/admin/inventory/recent').then(res => res.data);
  },

  // Staff versions (for staff users)
  staff: {
    getAllInventory: () => {
      return apiClient.get('/staff/inventory').then(res => res.data);
    },

    getInventorySummary: () => {
      return apiClient.get('/staff/inventory/summary').then(res => res.data);
    },

    getRecentAdditions: () => {
      return apiClient.get('/staff/inventory/recent').then(res => res.data);
    },
  },
};

export default inventoryService;
