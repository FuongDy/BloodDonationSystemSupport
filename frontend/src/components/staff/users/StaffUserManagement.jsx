// src/components/staff/users/StaffUserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import LoadingSpinner from '../../common/LoadingSpinner';
import RoleBadge from '../../common/RoleBadge';

const StaffUserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Mock data - comprehensive user list for development
  const mockUsersData = [
    {
      id: 1,
      fullName: 'Nguyễn Văn Anh',
      email: 'nguyenvanh@bloodconnect.com',
      phoneNumber: '0123456789',
      role: 'USER',
      createdAt: '2025-01-15T10:00:00Z',
      status: 'ACTIVE',
      bloodType: 'O+',
      donationCount: 5
    },
    {
      id: 2,
      fullName: 'Trần Thị Bình',
      email: 'tranthib@bloodconnect.com', 
      phoneNumber: '0987654321',
      role: 'STAFF',
      createdAt: '2025-02-01T14:30:00Z',
      status: 'ACTIVE',
      bloodType: 'A+',
      donationCount: 0
    },
    {
      id: 3,
      fullName: 'Lê Văn Cường',
      email: 'levanc@bloodconnect.com',
      phoneNumber: '0456789123',
      role: 'USER',
      createdAt: '2025-03-10T09:15:00Z',
      status: 'ACTIVE',
      bloodType: 'B+',
      donationCount: 3
    },
    {
      id: 4,
      fullName: 'Phạm Thị Dung',
      email: 'phamthid@bloodconnect.com',
      phoneNumber: '0789123456',
      role: 'ADMIN',
      createdAt: '2025-01-01T08:00:00Z',
      status: 'ACTIVE',
      bloodType: 'AB+',
      donationCount: 0
    },
    {
      id: 5,
      fullName: 'Hoàng Văn Em',
      email: 'hoangvane@bloodconnect.com',
      phoneNumber: '0321654987',
      role: 'USER',
      createdAt: '2025-04-05T11:20:00Z',
      status: 'ACTIVE',
      bloodType: 'O-',
      donationCount: 8
    },
    {
      id: 6,
      fullName: 'Vũ Thị Phương',
      email: 'vuthif@bloodconnect.com',
      phoneNumber: '0654321789',
      role: 'USER',
      createdAt: '2025-05-12T16:45:00Z',
      status: 'INACTIVE',
      bloodType: 'A-',
      donationCount: 1
    },
    {
      id: 7,
      fullName: 'Đặng Văn Giang',
      email: 'dangvang@bloodconnect.com',
      phoneNumber: '0147258369',
      role: 'STAFF',
      createdAt: '2025-03-20T13:10:00Z',
      status: 'ACTIVE',
      bloodType: 'B-',
      donationCount: 0
    },
    {
      id: 8,
      fullName: 'Bùi Thị Hoa',
      email: 'buithih@bloodconnect.com',
      phoneNumber: '0963741852',
      role: 'USER',
      createdAt: '2025-06-01T07:30:00Z',
      status: 'ACTIVE',
      bloodType: 'AB-',
      donationCount: 2
    }
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Loading users with Staff permissions (using mock data)');
      
      // Filter users based on search term
      let filteredUsers = mockUsersData;
      if (searchTerm.trim()) {
        const keyword = searchTerm.toLowerCase();
        filteredUsers = mockUsersData.filter(user => 
          user.fullName.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.phoneNumber.includes(keyword) ||
          user.role.toLowerCase().includes(keyword)
        );
      }
      
      // Apply pagination
      const pageSize = 10;
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const pagedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(pagedUsers);
      setTotalPages(Math.ceil(filteredUsers.length / pageSize));
      setTotalElements(filteredUsers.length);
      
      console.log(`Loaded ${pagedUsers.length} users from mock data`);
      
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Lỗi khi tải danh sách người dùng');
      setUsers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleRefresh = () => {
    fetchUsers();
    toast.success('Đã làm mới danh sách người dùng');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Authentication Status */}
      {!isAuthenticated && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Chưa đăng nhập</h3>
              <p className="text-sm text-red-700 mt-1">
                Bạn cần đăng nhập với tài khoản Staff để xem danh sách người dùng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current User Info */}
      {isAuthenticated && user && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Đang đăng nhập</h3>
              <p className="text-sm text-blue-700 mt-1">
                {user.fullName || user.username} ({user.role}) - {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Development Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Chế độ Development</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Hiện tại đang sử dụng dữ liệu mẫu do backend chưa có endpoint cho STAFF role. 
              Tất cả chức năng tìm kiếm, phân trang vẫn hoạt động bình thường.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
              <p className="text-gray-600">Xem danh sách và thông tin người dùng hệ thống</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc vai trò..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Tổng cộng: {totalElements} người dùng {searchTerm && `(tìm kiếm: "${searchTerm}")`}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhóm máu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lần hiến
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.fullName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {userItem.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-900">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{userItem.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{userItem.phoneNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={userItem.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {userItem.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userItem.donationCount} lần
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(userItem.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có người dùng</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Không tìm thấy người dùng phù hợp với từ khóa tìm kiếm' : 'Chưa có người dùng nào trong hệ thống'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Trang {currentPage + 1} / {totalPages} - Hiển thị {users.length} / {totalElements} người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Trước
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm border rounded ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffUserManagement;
