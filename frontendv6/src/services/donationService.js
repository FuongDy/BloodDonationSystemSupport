// src/services/donationService.js
import apiClient from './apiClient';

const donationService = {  // User donation requests
  createDonationRequest: (requestData) => {
    return apiClient.post('/donations/request', requestData);
  },

  getMyDonationHistory: () => {
    return apiClient.get('/donations/my-history');
  },

  // Admin/Staff donation management
  getAllDonationRequests: () => {
    return apiClient.get('/donations/requests');
  },

  updateDonationStatus: (processId, statusData) => {
    return apiClient.put(`/donations/requests/${processId}/status`, statusData);
  },

  // Health check operations
  recordHealthCheck: (processId, healthData) => {
    return apiClient.post(`/donations/${processId}/health-check`, healthData);
  },

  markBloodAsCollected: (processId, collectionData) => {
    return apiClient.post(`/donations/${processId}/collect`, collectionData);
  },

  recordBloodTestResult: (processId, testData) => {
    return apiClient.post(`/donations/${processId}/test-result`, testData);
  },

  // Bổ sung: Get detailed donation process
  getDonationProcessDetails: async (processId) => {
    const response = await apiClient.get(`/donations/${processId}/details`);
    return response.data;
  }
};

export default donationService;

