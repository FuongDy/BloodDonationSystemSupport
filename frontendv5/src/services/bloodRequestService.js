// src/services/bloodRequestService.js
import apiClient from './apiClient';

const bloodRequestService = {
  // Create blood request (Staff/Admin)
  createBloodRequest: requestData => {
    return apiClient.post('/blood-requests', requestData);
  },

  // Search active requests
  searchActiveRequests: () => {
    return apiClient.get('/blood-requests/search/active');
  },

  // Get request by ID
  getRequestById: id => {
    return apiClient.get(`/blood-requests/${id}`);
  },

  // Pledge to donate for a request
  pledgeForRequest: requestId => {
    return apiClient.post(`/blood-requests/${requestId}/pledge`);
  },

  // Get user's pledges
  getUserPledges: () => {
    return apiClient.get('/users/me/pledges');
  },
};

export default bloodRequestService;
