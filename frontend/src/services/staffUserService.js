// src/services/staffUserService.js - Service riêng cho STAFF role
import { mockUsersData } from '../utils/mockData';

class StaffUserService {
  // STAFF-specific method to get all users (with permission handling)
  async getAllUsers(options = {}) {
    try {
      const {
        page = 0,
        size = 10,
        sort = ['id', 'asc'],
        keyword = '',
        filters = {},
      } = options;

      console.log('StaffUserService: Getting users with STAFF permissions');
      
      // Since backend doesn't have /staff/users endpoint yet,
      // we use mock data with full functionality
      let filteredUsers = mockUsersData;
      
      // Apply search filter
      if (keyword.trim()) {
        const searchTerm = keyword.toLowerCase();
        filteredUsers = mockUsersData.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phoneNumber.includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          filteredUsers = filteredUsers.filter(user => 
            user[key] === filters[key]
          );
        }
      });
      
      // Apply sorting
      const [sortField, sortOrder] = sort;
      filteredUsers.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Handle different data types
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
      
      // Apply pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const pagedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Return in standard API format
      return {
        content: pagedUsers,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        size,
        number: page,
        first: page === 0,
        last: page >= Math.ceil(filteredUsers.length / size) - 1,
        numberOfElements: pagedUsers.length,
        empty: pagedUsers.length === 0
      };
      
    } catch (error) {
      console.error('StaffUserService.getAllUsers error:', error);
      throw new Error('Failed to fetch users for staff');
    }
  }
  
  // Mock method for getting user by ID
  async getUserById(id) {
    try {
      const user = mockUsersData.find(u => u.id === parseInt(id));
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('StaffUserService.getUserById error:', error);
      throw error;
    }
  }
  
  // Mock method for searching users
  async searchUsers(keyword) {
    try {
      if (!keyword.trim()) {
        return { content: [], totalElements: 0 };
      }
      
      const searchTerm = keyword.toLowerCase();
      const results = mockUsersData.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phoneNumber.includes(searchTerm)
      );
      
      return {
        content: results,
        totalElements: results.length
      };
    } catch (error) {
      console.error('StaffUserService.searchUsers error:', error);
      throw error;
    }
  }
}

export default new StaffUserService();
