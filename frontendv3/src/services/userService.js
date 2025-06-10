import apiClient from './apiClient';

class UserService {
    getAllUsers(page = 0, size = 10, sort = 'id,asc') {
        return apiClient.get(`/admin/users?page=${page}&size=${size}&sort=${sort}`);
    }

    getUserById(id) {
        return apiClient.get(`/admin/users/${id}`);
    }

    createUserByAdmin(userData) {
        return apiClient.post('/admin/users', userData);
    }

    updateUserByAdmin(id, userData) {
        return apiClient.put(`/admin/users/${id}`, userData);
    }

    // Backend thực hiện soft-delete
    deleteUser(id) {
        return apiClient.delete(`/admin/users/${id}`);
    }

    // --- Public user endpoints ---
    getCurrentUserProfile() {
        return apiClient.get('/users/me');
    }

    updateCurrentUserProfile(userData) {
        return apiClient.put('/users/me', userData);
    }
}

export default new UserService();