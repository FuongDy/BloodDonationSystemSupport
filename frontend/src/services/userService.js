import apiClient from './apiClient';

/**
 * Lớp dịch vụ để quản lý các tương tác API liên quan đến người dùng.
 */
class UserService {
  async getAllUsers(options = {}) {
    try {
      const params = new URLSearchParams(options);
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách người dùng');
    }
  }

  async getUserByIdForAdmin(userId, forceRefresh = false) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }

  async createUserByAdmin(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tạo người dùng');
    }
  }

  async updateUserByAdmin(userId, userData) {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật người dùng');
    }
  }

  async softDeleteUserByAdmin(userId) {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi vô hiệu hóa người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể vô hiệu hóa người dùng');
    }
  }

  async getCurrentUserProfile() {
    try {
      const response = await apiClient.get('/users/me/profile');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải hồ sơ người dùng');
    }
  }

  async getProfile(forceRefresh = false) {
    // Hiện tại, luôn gọi API để lấy dữ liệu mới nhất
    return this.getCurrentUserProfile();
  }

  async hasUserEverDonated() {
    try {
      const response = await apiClient.get('/users/me/has-donated');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi kiểm tra lịch sử hiến máu:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể kiểm tra lịch sử hiến máu');
    }
  }


  async updateUserProfile(profileData) {
    try {
      // Sử dụng phương thức PUT để cập nhật tài nguyên
      const response = await apiClient.put('/users/me/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
    }
  }

  async uploadIdCard(idCardFormData) {
    try {
      // Sử dụng phương thức POST và chỉ định header đúng cho việc tải tệp
      const response = await apiClient.post('/users/me/upload-id-card', idCardFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải lên CCCD:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải lên CCCD');
    }
  }

  async searchDonorsByLocation(locationData) {
    try {
      const response = await apiClient.post('/users/search/donors-by-location', locationData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm người hiến máu:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm người hiến máu');
    }
  }
}

export default new UserService();