// src/services/bloodTypeService.js
import apiClient from './apiClient';

const bloodTypeService = {
  getAll: () => {
    // For testing: Check if we're in mock mode (when no real backend)
    if (!import.meta.env.VITE_API_BASE_URL || window.location.hostname === 'localhost') {
      const mockBloodTypes = [
        { id: 1, bloodGroup: 'O+', description: 'O positive' },
        { id: 2, bloodGroup: 'O-', description: 'O negative' },
        { id: 3, bloodGroup: 'A+', description: 'A positive' },
        { id: 4, bloodGroup: 'A-', description: 'A negative' },
        { id: 5, bloodGroup: 'B+', description: 'B positive' },
        { id: 6, bloodGroup: 'B-', description: 'B negative' },
        { id: 7, bloodGroup: 'AB+', description: 'AB positive' },
        { id: 8, bloodGroup: 'AB-', description: 'AB negative' }
      ];
      
      return Promise.resolve(mockBloodTypes);
    }
    
    return apiClient.get('/blood-types').then(res => res.data).catch(error => {
      console.error('BloodTypeService.getAll error:', error);
      throw error;
    });
  },
  getById: id => {
    return apiClient.get(`/blood-types/${id}`).then(res => res.data);
  },
  create: data => {
    return apiClient.post('/blood-types', data).then(res => res.data);
  },
  update: (id, data) => {
    const updateData = { description: data.description };
    return apiClient
      .put(`/blood-types/${id}`, updateData)
      .then(res => res.data);
  },
  delete: id => {
    return apiClient.delete(`/blood-types/${id}`);
  },
  getUsersByBloodType: id => {
    return apiClient.get(`/blood-types/${id}/users`).then(res => res.data);
  },
};

export default bloodTypeService;
