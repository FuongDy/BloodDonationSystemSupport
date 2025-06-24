// src/services/appointmentService.js
import apiClient from './apiClient';

export const appointmentService = {
    // Create appointment (Admin/Staff only)
    createAppointment: async(appointmentData) => {
        try {
            const response = await apiClient.post('/appointments', appointmentData);
            return response.data;        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (createAppointment) ===');
            console.error(error.response?.data);
            throw error;
        }
    },

    // Request reschedule (Admin/Staff only)
    requestReschedule: async(appointmentId, rescheduleData) => {
        try {
            const response = await apiClient.put(`/appointments/${appointmentId}/request-reschedule`, rescheduleData);
            return response.data;
        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (requestReschedule) ===');
            console.error(error.response?.data);
            throw error;
        }
    },

    // Bổ sung: Lấy appointments của donor
    getMyAppointments: async() => {
        try {
            const response = await apiClient.get('/appointments/my-appointments');
            return response.data;
        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (getMyAppointments) ===');
            console.error(error.response?.data);
            throw error;
        }
    },

    // Bổ sung: Admin xem tất cả appointments
    getAllAppointments: async(params = {}) => {
        try {
            const response = await apiClient.get('/appointments', { params });
            return response.data;
        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (getAllAppointments) ===');
            console.error(error.response?.data);
            throw error;
        }
    },

    // Bổ sung: Cập nhật trạng thái appointment
    updateAppointmentStatus: async(appointmentId, status) => {
        try {
            const response = await apiClient.put(`/appointments/${appointmentId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (updateAppointmentStatus) ===');
            console.error(error.response?.data);
            throw error;
        }
    },

    // Bổ sung: Lấy appointments theo donor ID (cho admin)
    getAppointmentsByDonor: async(donorId) => {
        try {
            const response = await apiClient.get(`/appointments/donor/${donorId}`);
            return response.data;
        } catch (error) {
            console.error('=== APPOINTMENT SERVICE ERROR (getAppointmentsByDonor) ===');
            console.error(error.response?.data);
            throw error;
        }
    }
};

export default appointmentService;


