// src/services/appointmentService.js
import apiClient from './apiClient';

const appointmentService = {
  // Create appointment (Admin/Staff only)
  createAppointment: appointmentData => {
    return apiClient.post('/appointments', appointmentData);
  },
};

export default appointmentService;
