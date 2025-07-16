// src/services/bloodTypeService.js
import apiClient from './apiClient';

const bloodTypeService = {
  getAll: () => {
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
