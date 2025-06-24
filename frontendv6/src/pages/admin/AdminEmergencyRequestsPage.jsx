// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import bloodRequestService from '../../services/bloodRequestService';

const AdminEmergencyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.getEmergencyRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error(
      error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập để xem danh sách yêu cầu khẩn cấp');
      } else if (error.response?.status === 0 || error.code === 'ECONNABORTED') {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        const errorMessage = error.response?.data?.message || 'Không thể tải danh sách yêu cầu khẩn cấp';
        toast.error(errorMessage);
      }
      
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await bloodRequestService.updateRequestStatus(requestId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.bloodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'FULFILLED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'FULFILLED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="12" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yêu cầu khẩn cấp</h1>
            <p className="text-gray-600 mt-1">
              Quản lý các yêu cầu hiến máu khẩn cấp
            </p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo yêu cầu mới
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputField
                label="Tìm kiếm"
                placeholder="Tên bệnh nhân, nhóm máu, bệnh viện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="FULFILLED">Đã hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có yêu cầu khẩn cấp
              </h3>
              <p className="text-gray-600">
                Chưa có yêu cầu hiến máu khẩn cấp nào được tạo.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhóm máu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh viện
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.patientName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.contactPhone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {request.bloodType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.hospital || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {request.status === 'PENDING' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                              >
                                Duyệt
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                          {request.status === 'APPROVED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(request.id, 'FULFILLED')}
                            >
                              Hoàn thành
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminEmergencyRequestsPage;


