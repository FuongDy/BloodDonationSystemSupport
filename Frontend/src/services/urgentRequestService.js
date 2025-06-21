// src/services/urgentRequestService.js
import apiClient from './apiClient';

const urgentRequestService = {
  // --- Public endpoints ---

  /**
   * Fetches all PUBLISHED urgent requests.
   */
  getUrgentRequests: () => {
    return apiClient.get('/urgent-requests');
  },

  /**
   * Submits a volunteer offer for a specific urgent request.
   * @param {string|number} requestId - The ID of the urgent request.
   */
  volunteerForRequest: (requestId) => {
    return apiClient.post(`/urgent-requests/${requestId}/volunteer`);
  },

  /**
   * Creates a new urgent request, which will be pending approval.
   * @param {object} requestData - The data for the new request.
   */
  createUrgentRequest: (requestData) => {
    return apiClient.post('/urgent-requests', requestData);
  },

  // --- Admin/Staff endpoints ---

  /**
   * Fetches all PENDING urgent requests for admin review.
   */
  getPendingRequests: () => {
    return apiClient.get('/admin/urgent-requests');
  },

  /**
   * Approves a pending urgent request.
   * @param {string|number} requestId - The ID of the request to approve.
   * @param {object} user - The admin/staff user performing the action.
   */
  approveRequest: (requestId, user) => {
    return apiClient.post(`/admin/urgent-requests/${requestId}/approve`, { user });
  },

  /**
   * Rejects a pending urgent request.
   * @param {string|number} requestId - The ID of the request to reject.
   * @param {string} reason - The reason for rejection.
   */
  rejectRequest: (requestId, reason) => {
    return apiClient.post(`/admin/urgent-requests/${requestId}/reject`, { reason });
  },
};

export default urgentRequestService;
