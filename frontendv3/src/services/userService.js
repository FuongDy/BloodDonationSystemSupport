import apiClient from './apiClient';

class UserService {
    getAllUsers(page = 0, size = 10, sort = 'id,asc', search = '') {
        const searchParam = search ? `&search=${search}` : '';
        return apiClient.get(`/admin/users?page=${page}&size=${size}&sort=${sort}${searchParam}`);
    }

    getUserById(id) {
        return apiClient.get(`/admin/users/${id}`);
    }

    createUser(userData) {
        return apiClient.post('/admin/users', userData);
    }
    
    updateUser(id, userData) {
        return apiClient.put(`/admin/users/${id}`, userData);
    }

    deleteUser(id) {
        return apiClient.delete(`/admin/users/${id}`);
    }

    async getBloodTypes() {
        try {
            const response = await apiClient.get('/blood-types?size=500'); 
            return response.data.content; 
        } catch (error) { 
            console.error("Error fetching blood types in userService:", error.response?.data || error.message);
            return [];
        }
    }

    // SỬA: Hoàn thiện hàm getRoles để gọi API
    async getRoles() {
        try {
            const response = await apiClient.get('/roles');
            return response.data;
        } catch (error) {
            console.error("Error fetching roles:", error.response?.data || error.message);
            // Trả về dữ liệu mặc định nếu API lỗi để tránh crash ứng dụng
            return [
                { id: 1, name: 'Admin' },
                { id: 2, name: 'Staff' },
                { id: 3, name: 'Member' },
            ];
        }
    }
}

export default new UserService();