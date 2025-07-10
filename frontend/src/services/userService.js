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
      filters = {},
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
      console.error(error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  async createUserByAdmin(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData); //
      return response.data;
    } catch (error) {
      console.error(error.message);
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
      console.error(error.message);
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
      console.error(error.message);
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
      console.error(error.message);
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
      console.error(error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }

  // Alias for getCurrentUserProfile for consistency with UserProfileForm
  async getProfile(forceRefresh = false) {
    return this.getCurrentUserProfile();
  }

  async updateUserProfile(updateData) {
    try {
      const response = await apiClient.put('/users/me/profile', updateData);
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }

  async uploadIdCard(frontImage, backImage) {
    try {
      const formData = new FormData();
      formData.append('frontImage', frontImage);
      formData.append('backImage', backImage);
      
      const response = await apiClient.post('/users/me/upload-id-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to upload ID card'
      );
    }
  }

  // Alias for updateUserProfile for consistency with UserProfileForm
  async updateProfile(updateData) {
    // Check if updateData is FormData (contains files)
    if (updateData instanceof FormData) {
      const hasImages = updateData.has('frontImage') || updateData.has('backImage');
      
      if (hasImages) {
        // Handle both profile update and ID card upload
        const frontImage = updateData.get('frontImage');
        const backImage = updateData.get('backImage');
        
        // First, update profile data (without images)
        const profileData = {};
        for (const [key, value] of updateData.entries()) {
          if (key !== 'frontImage' && key !== 'backImage') {
            profileData[key] = value;
          }
        }
        
        // Update profile first
        const updatedUser = await this.updateUserProfile(profileData);
        
        // Then upload ID card if both images are provided
        if (frontImage && backImage) {
          await this.uploadIdCard(frontImage, backImage);
        }
        
        return updatedUser;
      } else {
        // No images, just convert FormData to object
        const profileData = {};
        for (const [key, value] of updateData.entries()) {
          profileData[key] = value;
        }
        return this.updateUserProfile(profileData);
      }
    }
    
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
      console.error(error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to search donors'
      );
    }
  }
}

export default new UserService();
