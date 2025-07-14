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
import staffService from '../../../services/staffService';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffUserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State for donor search
  const [showDonorSearch, setShowDonorSearch] = useState(false);
  const [searchLocation, setSearchLocation] = useState({
    latitude: '',
    longitude: '',
    radius: 10,
    bloodTypeId: ''
  });

  // Fetch users from API (Staff chỉ có thể search donors by location)
  const fetchUsers = useCallback(async (page = 0, size = 10) => {
    try {
      setIsLoading(true);
      // Staff không có quyền xem all users, chỉ có thể search donors by location
      // Sử dụng mock data cho demo
      setUsers(mockUsersData);
      setTotalPages(1);
      setTotalElements(mockUsersData.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng. Hiển thị dữ liệu mẫu.');
      // Use mock data as fallback
      setUsers(mockUsersData);
      setTotalPages(1);
      setTotalElements(mockUsersData.length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search donors by location
  const searchDonorsByLocation = async () => {
    if (!searchLocation.latitude || !searchLocation.longitude) {
      toast.error('Vui lòng nhập tọa độ vị trí');
      return;
    }

    try {
      setIsLoading(true);
      const response = await staffService.searchDonorsByLocation(searchLocation);
      
      if (response.data) {
        setUsers(response.data);
        setTotalElements(response.data.length);
        setTotalPages(1);
        toast.success(`Tìm thấy ${response.data.length} người hiến máu trong khu vực`);
      }
    } catch (error) {
      console.error('Error searching donors:', error);
      toast.error('Không thể tìm kiếm người hiến máu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, 10);
  }, [fetchUsers]);

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

  // Moved fetchUsers function to top - using API with mock fallback

  useEffect(() => {
    fetchUsers(currentPage, 10);
  }, [fetchUsers, currentPage]);

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
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Quản lý người dùng"
        description="Tìm kiếm và quản lý thông tin người hiến máu trong hệ thống"
        variant="users"
        showTime={true}
        showWeather={true}
      />
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
            <h3 className="text-sm font-medium text-yellow-800">Chế độ Development - Staff User Management</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Staff có quyền hạn chế: chỉ có thể tìm kiếm người hiến máu theo vị trí địa lý. 
              Sử dụng dữ liệu mẫu cho demo. Tính năng tìm kiếm theo vị trí sẽ gọi API /staff/users/search/donors-by-location.
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
          <div className="flex space-x-3">
            <button 
              onClick={() => fetchUsers(currentPage)}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
            <button 
              onClick={() => setShowDonorSearch(!showDonorSearch)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Tìm người hiến máu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Donor Search Form */}
      {showDonorSearch && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tìm kiếm người hiến máu theo vị trí</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vĩ độ</label>
              <input
                type="number"
                step="any"
                placeholder="10.762622"
                value={searchLocation.latitude}
                onChange={(e) => setSearchLocation(prev => ({ ...prev, latitude: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kinh độ</label>
              <input
                type="number"
                step="any"
                placeholder="106.660172"
                value={searchLocation.longitude}
                onChange={(e) => setSearchLocation(prev => ({ ...prev, longitude: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bán kính (km)</label>
              <input
                type="number"
                placeholder="10"
                value={searchLocation.radius}
                onChange={(e) => setSearchLocation(prev => ({ ...prev, radius: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm máu (tùy chọn)</label>
              <select
                value={searchLocation.bloodTypeId}
                onChange={(e) => setSearchLocation(prev => ({ ...prev, bloodTypeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả nhóm máu</option>
                <option value="1">O+</option>
                <option value="2">O-</option>
                <option value="3">A+</option>
                <option value="4">A-</option>
                <option value="5">B+</option>
                <option value="6">B-</option>
                <option value="7">AB+</option>
                <option value="8">AB-</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={searchDonorsByLocation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      )}

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
