// src/services/appointmentService.js
import apiClient from './apiClient';

const appointmentService = {
    // /**
    //  * [Admin] Tạo một cuộc hẹn mới.
    //  * @param {object} appointmentData - Dữ liệu cuộc hẹn (ví dụ: userId, appointmentDate, location).
    //  */
    createAppointment: (appointmentData) => {
        return apiClient.post('/appointments', appointmentData);
    },

    /**
     * [Admin] Lấy tất cả các cuộc hẹn.
     */
    getAllAppointments: () => {
        return apiClient.get('/appointments');
    },

    // /**
    //  * Lấy các cuộc hẹn của một người dùng cụ thể.
    //  * @param {string} userId - ID của người dùng.
    //  */
    getAppointmentsByUser: (userId) => {
        return apiClient.get(`/appointments/user/${userId}`);
    },

    // /**
    //  * Tìm kiếm các lịch hẹn còn trống.
    //  * @param {object} searchParams - Tham số tìm kiếm (ví dụ: location, date).
    //  */
    searchAppointments: (searchParams) => {
        return apiClient.get('/appointments/search', { params: searchParams });
    },

    /**
     * Gửi yêu cầu đặt lịch hẹn hiến máu.
     * @param {object} appointmentData - Dữ liệu cuộc hẹn { appointmentDate, location, notes }
     */
    requestDonationAppointment: (appointmentData) => {
        return apiClient.post('/donations/request-appointment', appointmentData);
    },

    /**
     * Lấy tất cả các cuộc hẹn của người dùng hiện tại.
     */
    getMyAppointmentHistory: () => {
        return apiClient.get('/appointments/my-history');
    }
};

export default appointmentService;