// src/services/donationService.js
import apiClient from './apiClient';

const donationService = {
    // Lấy tất cả các yêu cầu/quy trình hiến máu (cho Admin/Staff)
    getAllDonationProcesses: (page = 0, size = 10, sort = 'createdAt,desc') => {
        return apiClient.get(`/donations/requests?page=${page}&size=${size}&sort=${sort}`);
    },

    // User xem lịch sử của mình
    getMyDonationHistory: () => {
        return apiClient.get('/donations/my-history');
    },

    // Staff/Admin cập nhật trạng thái
    updateProcessStatus: (processId, newStatus, note = '') => {
        return apiClient.put(`/donations/requests/${processId}/status`, { newStatus, note });
    },

    // Tạo lịch hẹn
    createAppointment: (appointmentData) => {
        return apiClient.post('/appointments', appointmentData);
    },

    // Ghi nhận kết quả khám sức khỏe
    recordHealthCheck: (processId, healthCheckData) => {
        return apiClient.post(`/donations/${processId}/health-check`, healthCheckData);
    },

    // Đánh dấu đã lấy máu
    markBloodAsCollected: (processId) => {
        return apiClient.put(`/donations/${processId}/collect`);
    },

    // Ghi nhận kết quả xét nghiệm
    recordBloodTestResult: (processId, testResultData) => {
        return apiClient.post(`/donations/${processId}/test-result`, testResultData);
    }
};

export default donationService;