// src/services/inventoryService.js
import apiClient from './apiClient';

const inventoryService = {
  // Get all inventory (Staff/Admin)
  getAllInventory: () => {
    return apiClient.get('/inventory').then(res => res.data);
  },

  // Get inventory summary (Staff/Admin)
  getInventorySummary: () => {
    return apiClient.get('/inventory/summary').then(res => res.data);
  },

  // Get recent additions (Staff/Admin)
  getRecentAdditions: () => {
    return apiClient.get('/inventory/recent').then(res => res.data);
  },
};

export default inventoryService;

