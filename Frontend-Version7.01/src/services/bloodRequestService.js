// src/services/bloodRequestService.js
import apiClient from './apiClient';

const bloodRequestService = {
  // Create blood request (Staff/Admin)
  createBloodRequest: requestData => {
    return apiClient.post('/blood-requests', requestData);
  }, // Get all blood requests with pagination (Staff/Admin)
  getAllRequests: (options = {}) => {
    const { page = 0, size = 10 } = options;
    return apiClient.get('/blood-requests', { params: { page, size } }); // Return full axios response
  },

  // Create blood request (Staff/Admin) - alias for consistency
  createRequest: requestData => {
    return apiClient.post('/blood-requests', requestData);
  },
  
  // Create emergency blood request (Staff/Admin only)
  createEmergencyRequest: requestData => {
    // Sử dụng endpoint chung và đảm bảo urgency là URGENT hoặc CRITICAL
    const emergencyData = {
      ...requestData,
      urgency: requestData.urgency || 'URGENT' // Đảm bảo luôn có mức độ khẩn cấp cao
    };
    return apiClient.post('/blood-requests', emergencyData);
  },

  // Update request status (Staff/Admin) - simplified method name
  updateStatus: (requestId, newStatus) => {
    return apiClient.put(
      `/blood-requests/${requestId}/status?newStatus=${newStatus}`
    );
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
  }, // Update request status (Staff/Admin)
  updateRequestStatus: (requestId, newStatus) => {
    return apiClient.put(
      `/blood-requests/${requestId}/status?newStatus=${newStatus}`
    );
  },
  // Get emergency requests (Admin/Staff only) - using active requests endpoint
  getEmergencyRequests: (params = {}) => {
    // The endpoint returns the full data including pledgeCount
    return apiClient.get('/blood-requests/search/active', { params });
  },
  
  // Lấy các đơn yêu cầu máu đã hoàn thành
  getCompletedRequests: (options = {}) => {
    const { page = 0, size = 10 } = options;
    return apiClient.get('/blood-requests/search/completed', { params: { page, size, status: 'FULFILLED' } });
  },
};

export default bloodRequestService;
