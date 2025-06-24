// src/services/userService.js
import apiClient from './apiClient';

class UserService {
  // Admin User Service Methods
  // Cập nhật hàm getAllUsers để nhận thêm tham số search
  async getAllUsers(options = {}) {
    const {
      page = 0,
      size = 10,
      sort = ['id', 'asc'],
      keyword = '',
      filters = {}
    } = options;
    
    try {
      const sortParams = sort.join(',');
      const params = {
        page,
        size,
        sort: sortParams,
        ...(keyword && { keyword }), // Use object shorthand
        ...filters,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/admin/users?${queryString}`);
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  async createUserByAdmin(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData); //
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          'Failed to create user'
      );
    }
  }

  async getUserByIdForAdmin(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`); //
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          'Failed to fetch user details'
      );
    }
  }

  async updateUserByAdmin(userId, userData) {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData); //
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          'Failed to update user'
      );
    }
  }

  async softDeleteUserByAdmin(userId) {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`); //
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          'Failed to disable user'
      );
    }
  }

  // General User Profile Methods
  async getCurrentUserProfile() {
    try {
      const response = await apiClient.get('/users/me/profile');
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }

  // Alias for getCurrentUserProfile for consistency with UserProfileForm
  async getProfile(_forceRefresh = false) {
    return this.getCurrentUserProfile();
  }

  async updateUserProfile(updateData) {
    try {
      const response = await apiClient.put('/users/me/profile', updateData);
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }

  // Alias for updateUserProfile for consistency with UserProfileForm
  async updateProfile(updateData) {
    return this.updateUserProfile(updateData);
  }

  // Search donors by location
  async searchDonorsByLocation(locationData) {
    try {
      const response = await apiClient.post(
        '/users/search/donors-by-location',
        locationData
      );
      return response.data;
    } catch (error) {
      console.error(error.message
      );
      throw new Error(
        error.response?.data?.message || 'Failed to search donors'
      );
    }
  }
}

export default new UserService();


