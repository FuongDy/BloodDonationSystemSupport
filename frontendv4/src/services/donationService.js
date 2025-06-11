// src/services/donationService.js
import apiClient from './apiClient';

const donationService = {
    /**
     * Lấy lịch sử hiến máu của người dùng hiện tại.
     */
    getUserDonationHistory: () => {
        return apiClient.get('/donations/history');
    },

    /**
     * Gửi yêu cầu đăng ký hiến máu.
     */
    requestToDonate: (donationData) => {
        return apiClient.post('/donations/request', donationData);
    },

    /**
     * [Admin] Lấy tất cả các yêu cầu hiến máu từ người dùng.
     */
    getAllDonationRequests: () => {
        return apiClient.get('/donations/requests');
    },

    /**
     * [Admin] Cập nhật trạng thái của một yêu cầu hiến máu.
     */
    updateDonationRequestStatus: (requestId, status) => {
        return apiClient.put(`/donations/requests/${requestId}/status`, { status });
    },
};

export default donationService;