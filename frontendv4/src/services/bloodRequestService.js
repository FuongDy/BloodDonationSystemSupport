// src/services/bloodRequestService.js
import apiClient from './apiClient';

const bloodRequestService = {
    createBloodRequest: (requestData) => {
        return apiClient.post('/blood-requests', requestData);
    },
    getAllBloodRequests: () => {
        return apiClient.get('/blood-requests');
    },
};

export default bloodRequestService;