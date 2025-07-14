import apiClient from './apiClient';

/**
 * Lớp dịch vụ để quản lý các tương tác API liên quan đến người dùng.
 */
class UserService {
  // =================================================================
  // CÁC PHƯƠNG THỨC DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
  // =================================================================

  /**
   * Lấy danh sách tất cả người dùng với các tùy chọn phân trang và lọc.
   * @param {object} options - Tùy chọn cho truy vấn (ví dụ: page, size, role).
   * @returns {Promise<object>} - Dữ liệu phân trang của người dùng.
   */
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

  /**
   * Lấy thông tin chi tiết của một người dùng theo ID (dành cho admin).
   * @param {number} userId - ID của người dùng.
   * @param {boolean} forceRefresh - Bỏ qua cache và lấy dữ liệu mới.
   * @returns {Promise<object>} - Đối tượng thông tin người dùng.
   */
  async getUserByIdForAdmin(userId, forceRefresh = false) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }

  /**
   * Tạo người dùng mới (dành cho admin).
   * @param {object} userData - Dữ liệu người dùng mới.
   * @returns {Promise<object>} - Đối tượng người dùng đã được tạo.
   */
  async createUserByAdmin(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tạo người dùng');
    }
  }

  /**
   * Cập nhật thông tin người dùng (dành cho admin).
   * @param {number} userId - ID của người dùng.
   * @param {object} userData - Dữ liệu cập nhật.
   * @returns {Promise<object>} - Đối tượng người dùng đã được cập nhật.
   */
  async updateUserByAdmin(userId, userData) {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật người dùng');
    }
  }

  /**
   * Vô hiệu hóa người dùng (soft delete - dành cho admin).
   * @param {number} userId - ID của người dùng.
   * @returns {Promise<object>} - Đối tượng người dùng đã được vô hiệu hóa.
   */
  async softDeleteUserByAdmin(userId) {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi vô hiệu hóa người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể vô hiệu hóa người dùng');
    }
  }

  // =================================================================
  // CÁC PHƯƠNG THỨC CHO HỒ SƠ CÁ NHÂN CỦA NGƯỜI DÙNG
  // =================================================================

  /**
   * Lấy thông tin hồ sơ của người dùng hiện tại đang đăng nhập.
   * @returns {Promise<object>} - Đối tượng hồ sơ người dùng.
   */
  async getCurrentUserProfile() {
    try {
      const response = await apiClient.get('/users/me/profile');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ người dùng:', error.message);
      throw new Error(error.response?.data?.message || 'Không thể tải hồ sơ người dùng');
    }
  }

  /**
   * Hàm alias cho `getCurrentUserProfile`, có thể mở rộng với logic cache.
   * @param {boolean} forceRefresh - Bỏ qua cache và lấy dữ liệu mới (chưa triển khai).
   * @returns {Promise<object>} - Đối tượng hồ sơ người dùng.
   */
  async getProfile(forceRefresh = false) {
    // Hiện tại, luôn gọi API để lấy dữ liệu mới nhất
    return this.getCurrentUserProfile();
  }

  /**
   * Cập nhật thông tin hồ sơ người dùng (chỉ gửi dữ liệu dạng JSON).
   * @param {object} profileData - Đối tượng chứa các trường thông tin cần cập nhật.
   * @returns {Promise<object>} - Đối tượng hồ sơ người dùng sau khi đã cập nhật.
   */
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

  /**
   * Tải lên ảnh CCCD mặt trước và mặt sau để xác minh.
   * API này sử dụng Content-Type là 'multipart/form-data'.
   * @param {FormData} idCardFormData - Đối tượng FormData chứa `frontImage` và `backImage`.
   * @returns {Promise<object>} - Đối tượng hồ sơ người dùng sau khi đã cập nhật, bao gồm cờ 'idCardVerified'.
   */
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

  /**
   * Tìm kiếm người hiến máu phù hợp dựa trên vị trí.
   * @param {object} locationData - Dữ liệu vị trí (kinh độ, vĩ độ).
   * @returns {Promise<Array<object>>} - Danh sách người hiến máu phù hợp.
   */
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