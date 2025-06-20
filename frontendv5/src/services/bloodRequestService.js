// src/services/bloodRequestService.js
import apiClient from './apiClient';

const bloodRequestService = {
  // Create blood request (Staff/Admin)
  createBloodRequest: requestData => {
    return apiClient.post('/blood-requests', requestData);
  },

  // Search active requests
  searchActiveRequests: params => {
    return apiClient.get('/blood-requests/search/active', { params });
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
    // Backend endpoint not implemented yet, return mock data
    return Promise.resolve({ 
      data: [] // Empty array for now - no pledges
    });
  },

  // Update request status (placeholder - implement when backend provides this endpoint)
  updateRequestStatus: (requestId, status) => {
    // Tạm thời return Promise resolved để tránh lỗi
    return Promise.resolve({ success: true });
  },
};

export default bloodRequestService;
