// src/components/staff/blood-requests/StaffBloodRequestManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';

const StaffBloodRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch blood requests
  const fetchRequests = async (page = 0) => {
    try {
      setIsLoading(true);
      const response = await staffService.getAllBloodRequests({ page, size: 10 });
      
      if (response.data) {
        setRequests(response.data.content || []);
        setCurrentPage(response.data.number || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      toast.error('Không thể tải danh sách yêu cầu máu');
      
      // Fallback to mock data
      const mockRequests = [
        {
          id: 1,
          bloodTypeId: 1,
          bloodTypeName: 'O+',
          unitsNeeded: 3,
          urgency: 'URGENT',
          patientName: 'Nguyễn Văn A',
          hospitalName: 'Bệnh viện Chợ Rẫy',
          requestDescription: 'Cần máu khẩn cấp cho ca phẫu thuật',
          contactPhone: '0123456789',
          roomNumber: 201,
          bedNumber: 5,
          status: 'ACTIVE',
          createdAt: '2025-01-15T10:00:00Z',
          pledgeCount: 2
        },
        {
          id: 2,
          bloodTypeId: 2,
          bloodTypeName: 'A+',
          unitsNeeded: 2,
          urgency: 'HIGH',
          patientName: 'Trần Thị B',
          hospitalName: 'Bệnh viện Bình Dan',
          requestDescription: 'Điều trị thalassemia',
          contactPhone: '0987654321',
          roomNumber: 305,
          bedNumber: 12,
          status: 'ACTIVE',
          createdAt: '2025-01-14T14:30:00Z',
          pledgeCount: 1
        }
      ];
      setRequests(mockRequests);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await staffService.updateBloodRequestStatus(requestId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests(currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'URGENT':
        return 'bg-orange-500 text-white';
      case 'HIGH':
        return 'bg-yellow-500 text-white';
      case 'MEDIUM':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.bloodTypeName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Droplet className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Yêu cầu Máu</h1>
              <p className="text-gray-600">Xem và quản lý các yêu cầu máu từ bệnh viện</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => fetchRequests(currentPage)}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo yêu cầu mới</span>
            </button>
          </div>
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
                placeholder="Tìm kiếm theo tên bệnh nhân, bệnh viện, nhóm máu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent w-96"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Tổng cộng: {filteredRequests.length} yêu cầu
          </div>
        </div>
      </div>

      {/* Requests Table */}
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
                      Thông tin yêu cầu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh viện
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mức độ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cam kết
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {request.bloodTypeName}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {request.unitsNeeded} đơn vị
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {request.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {request.patientName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>Phòng {request.roomNumber} - Giường {request.bedNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {request.hospitalName}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{request.contactPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.pledgeCount || 0} người
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {request.status === 'ACTIVE' && (
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {request.status === 'ACTIVE' && (
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Droplet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu máu</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Không tìm thấy yêu cầu phù hợp' : 'Chưa có yêu cầu máu nào trong hệ thống'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Trang {currentPage + 1} / {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
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

export default StaffBloodRequestManagement;
