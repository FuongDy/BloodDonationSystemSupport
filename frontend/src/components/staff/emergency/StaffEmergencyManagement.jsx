// src/components/staff/emergency/StaffEmergencyManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Phone,
  MapPin,
  User,
  Droplet,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Hospital,
  Users,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';
import StatusBadge from '../../common/StatusBadge';
import Button from '../../common/Button';
import { formatDateTime } from '../../../utils/formatters';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffEmergencyManagement = () => {
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock data for emergency requests
  const mockEmergencyData = [
    {
      id: 'ER001',
      patientName: 'Nguyễn Văn X',
      bloodType: 'O-',
      requiredUnits: 3,
      urgencyLevel: 'CRITICAL',
      hospitalName: 'Bệnh viện Chợ Rẫy',
      hospitalAddress: '201B Nguyễn Chí Thanh, Q.5, TP.HCM',
      contactPerson: 'BS. Trần Thị Y',
      contactPhone: '0911234567',
      requestTime: '2025-07-13T14:30:00',
      requiredTime: '2025-07-13T16:00:00',
      status: 'PENDING',
      description: 'Tai nạn giao thông nghiêm trọng, cần truyền máu khẩn cấp',
      location: {
        latitude: 10.7769,
        longitude: 106.6951
      }
    },
    {
      id: 'ER002',
      patientName: 'Lê Thị Z',
      bloodType: 'A+',
      requiredUnits: 2,
      urgencyLevel: 'HIGH',
      hospitalName: 'Bệnh viện Bình Dân',
      hospitalAddress: '371 Điện Biên Phủ, Q.3, TP.HCM',
      contactPerson: 'BS. Phạm Văn K',
      contactPhone: '0987654321',
      requestTime: '2025-07-13T13:15:00',
      requiredTime: '2025-07-13T18:00:00',
      status: 'IN_PROGRESS',
      description: 'Phẫu thuật tim cấp cứu',
      location: {
        latitude: 10.7892,
        longitude: 106.6917
      }
    },
    {
      id: 'ER003',
      patientName: 'Hoàng Văn M',
      bloodType: 'B+',
      requiredUnits: 1,
      urgencyLevel: 'MEDIUM',
      hospitalName: 'Bệnh viện Nguyễn Tri Phuong',
      hospitalAddress: '468 Minh Khai, Q.3, TP.HCM',
      contactPerson: 'BS. Lê Thị N',
      contactPhone: '0369852741',
      requestTime: '2025-07-13T12:00:00',
      requiredTime: '2025-07-13T20:00:00',
      status: 'COMPLETED',
      description: 'Phẫu thuật dạ dày',
      location: {
        latitude: 10.7831,
        longitude: 106.6914
      }
    }
  ];

  // Fetch emergency requests
  const fetchEmergencyRequests = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API first
      const response = await staffService.getEmergencyRequests();
      if (response.data) {
        setEmergencyRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Không thể tải yêu cầu khẩn cấp. Hiển thị dữ liệu mẫu.');
      setEmergencyRequests(mockEmergencyData);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await staffService.updateEmergencyRequestStatus(requestId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchEmergencyRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Filter requests
  const filteredRequests = emergencyRequests.filter(request => {
    const matchesSearch = 
      request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.urgencyLevel === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get priority color
  const getPriorityColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Yêu cầu khẩn cấp"
        description="Quản lý và xử lý các yêu cầu máu khẩn cấp từ bệnh viện"
        variant="emergency"
        showTime={true}
        showWeather={true}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredRequests.length}</span> yêu cầu
          </div>
          {filteredRequests.filter(r => r.urgencyLevel === 'CRITICAL').length > 0 && (
            <div className="flex items-center space-x-1 text-red-600 text-sm animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{filteredRequests.filter(r => r.urgencyLevel === 'CRITICAL').length} yêu cầu cấp cứu</span>
            </div>
          )}
        </div>
        <Button
          onClick={fetchEmergencyRequests}
          variant="outline"
          className="flex items-center space-x-2 bg-white/80 hover:bg-white/90 border-red-200 hover:border-red-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên bệnh nhân, bệnh viện..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="CRITICAL">Cấp cứu</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              variant="outline"
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Emergency Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div 
            key={request.id}
            className={`bg-white rounded-xl shadow-lg border-l-4 p-6 hover:shadow-xl transition-all duration-300 ${
              request.urgencyLevel === 'CRITICAL' ? 'border-red-500 bg-red-50/30' :
              request.urgencyLevel === 'HIGH' ? 'border-orange-500 bg-orange-50/30' :
              'border-yellow-500 bg-yellow-50/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.urgencyLevel)}`}>
                      {request.urgencyLevel === 'CRITICAL' ? 'CẤP CỨU' :
                       request.urgencyLevel === 'HIGH' ? 'CAO' : 'TRUNG BÌNH'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status === 'PENDING' ? 'Chờ xử lý' :
                       request.status === 'IN_PROGRESS' ? 'Đang xử lý' :
                       request.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    #{request.id}
                  </div>
                </div>

                {/* Patient & Blood Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Bệnh nhân: {request.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span>Nhóm máu: <strong>{request.bloodType}</strong></span>
                      <span className="text-gray-500">•</span>
                      <span>Số lượng: <strong>{request.requiredUnits} đơn vị</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Cần trước: {formatDateTime(request.requiredTime)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Hospital className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{request.hospitalName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{request.hospitalAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{request.contactPerson} - {request.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{request.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {request.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Bắt đầu xử lý
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        Hủy yêu cầu
                      </Button>
                    </>
                  )}
                  {request.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Hoàn thành
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu khẩn cấp</h3>
            <p className="text-gray-500">Hiện tại không có yêu cầu nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffEmergencyManagement;
