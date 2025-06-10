import apiClient from './apiClient';

class BloodRequestService {
    // Public endpoint to create an emergency request
    createEmergencyRequest(requestData) {
        return apiClient.post('/blood-requests/emergency', requestData);
    }

    // Admin endpoint to get all requests with pagination
    getAllBloodRequests(page = 0, size = 10, sort = 'requestDate,desc') {
        return apiClient.get(`/blood-requests?page=${page}&size=${size}&sort=${sort}`);
    }

    // Admin endpoint to get a single request by ID
    getBloodRequestById(id) {
        return apiClient.get(`/blood-requests/${id}`);
    }

    // Admin endpoint to update a request (e.g., change status)
    updateBloodRequest(id, updateData) {
        return apiClient.put(`/blood-requests/${id}`, updateData);
    }
}

export default new BloodRequestService();