// src/services/appointmentService.js
import apiClient from './apiClient';

export const appointmentService = {
  // Create appointment (Admin/Staff only)
  createAppointment: async appointmentData => {
    try {
      console.log('Creating appointment with data:', appointmentData);
      const response = await apiClient.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('=== APPOINTMENT SERVICE ERROR (createAppointment) ===');
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request data:', appointmentData);
      
      // Log detailed error information
      if (error.response?.data) {
        console.error('Detailed error data:', JSON.stringify(error.response.data, null, 2));
      }
      
      // Throw error with more detailed message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else {
        throw new Error('Không thể tạo lịch hẹn. Vui lòng thử lại.');
      }
    }
  },

  // Request reschedule (Admin/Staff only)
  requestReschedule: async (appointmentId, rescheduleData) => {
    try {
      const response = await apiClient.put(
        `/appointments/${appointmentId}/request-reschedule`,
        {
          reason: rescheduleData.reason
        }
      );
      return response.data;
    } catch (error) {
      console.error('=== APPOINTMENT SERVICE ERROR (requestReschedule) ===');
      console.error(error.response?.data);
      throw error;
    }
  },

  // Bổ sung: Lấy appointments của donor
  getMyAppointments: async () => {
    try {
      const response = await apiClient.get('/appointments/my-appointments');
      return response.data;
    } catch (error) {
      console.error('=== APPOINTMENT SERVICE ERROR (getMyAppointments) ===');
      console.error(error.response?.data);
      throw error;
    }
  },

  // Note: No getAllAppointments endpoint exists in backend
  // Staff/Admin should manage appointments through donation process management
};

export default appointmentService;
