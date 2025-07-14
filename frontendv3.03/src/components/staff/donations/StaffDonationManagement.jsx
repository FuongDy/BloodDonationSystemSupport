// src/components/staff/donations/StaffDonationManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Heart,
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
  Phone,
  Activity,
  TestTube,
  Droplets,
  ClipboardCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';
import StatusBadge from '../../common/StatusBadge';
import Button from '../../common/Button';
import { formatDateTime } from '../../../utils/formatters';
import { DONATION_STATUS } from '../../../utils/constants';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffDonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Fetch donation requests
  const fetchDonations = async (page = 0) => {
    try {
      setIsLoading(true);
      const response = await staffService.getAllDonationRequests({ page, size: 10 });
      
      if (response.data) {
        setDonations(response.data.content || response.data || []);
        setCurrentPage(response.data.number || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Không thể tải danh sách đơn hiến máu');
      
      // Fallback to mock data
      const mockDonations = [
        {
          id: 1,
          donor: {
            id: 1,
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789',
            bloodGroup: 'O+'
          },
          status: 'PENDING_APPROVAL',
          createdAt: '2025-01-10T10:00:00',
          note: 'Đăng ký hiến máu tình nguyện',
          preferredDonationDate: '2025-01-15',
          location: 'Bệnh viện Chợ Rẫy'
        },
        {
          id: 2,
          donor: {
            id: 2,
            fullName: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321',
            bloodGroup: 'A+'
          },
          status: 'APPOINTMENT_SCHEDULED',
          createdAt: '2025-01-09T14:30:00',
          note: 'Hiến máu lần 3',
          preferredDonationDate: '2025-01-14',
          location: 'Trung tâm hiến máu quốc gia'
        },
        {
          id: 3,
          donor: {
            id: 3,
            fullName: 'Lê Văn C',
            email: 'levanc@email.com',
            phone: '0369852741',
            bloodGroup: 'B+'
          },
          status: 'HEALTH_CHECK_PASSED',
          createdAt: '2025-01-08T09:15:00',
          note: 'Sức khỏe tốt, sẵn sàng hiến máu',
          preferredDonationDate: '2025-01-13',
          location: 'Bệnh viện Bình Dân'
        }
      ];
      setDonations(mockDonations);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter donations based on search and status
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.donor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusUpdate = async (donationId, newStatus, note = '') => {
    try {
      await staffService.updateDonationStatus(donationId, {
        newStatus,
        note
      });
      toast.success('Cập nhật trạng thái thành công');
      fetchDonations(currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    const statusMap = {
      'PENDING_APPROVAL': { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
      'APPOINTMENT_PENDING': { color: 'bg-blue-100 text-blue-800', text: 'Chờ đặt lịch' },
      'APPOINTMENT_SCHEDULED': { color: 'bg-green-100 text-green-800', text: 'Đã lên lịch' },
      'HEALTH_CHECK_PASSED': { color: 'bg-purple-100 text-purple-800', text: 'Khám đạt' },
      'HEALTH_CHECK_FAILED': { color: 'bg-red-100 text-red-800', text: 'Khám không đạt' },
      'BLOOD_COLLECTED': { color: 'bg-indigo-100 text-indigo-800', text: 'Đã lấy máu' },
      'TESTING_PASSED': { color: 'bg-teal-100 text-teal-800', text: 'Xét nghiệm đạt' },
      'TESTING_FAILED': { color: 'bg-red-100 text-red-800', text: 'Xét nghiệm không đạt' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Từ chối' }
    };
    return statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
  };

  // Render action buttons based on status
  const renderActionButtons = (donation) => {
    switch (donation.status) {
      case 'PENDING_APPROVAL':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusUpdate(donation.id, 'APPOINTMENT_PENDING', 'Đơn được duyệt')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Duyệt
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleStatusUpdate(donation.id, 'REJECTED', 'Đơn bị từ chối')}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Từ chối
            </Button>
          </div>
        );
      case 'APPOINTMENT_SCHEDULED':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(donation.id, 'HEALTH_CHECK_PASSED', 'Khám sức khỏe đạt yêu cầu')}
          >
            <Activity className="w-4 h-4 mr-1" />
            Khám sức khỏe
          </Button>
        );
      case 'HEALTH_CHECK_PASSED':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(donation.id, 'BLOOD_COLLECTED', 'Đã thu thập máu thành công')}
          >
            <Droplets className="w-4 h-4 mr-1" />
            Thu thập máu
          </Button>
        );
      case 'BLOOD_COLLECTED':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusUpdate(donation.id, 'TESTING_PASSED', 'Xét nghiệm đạt yêu cầu')}
            >
              <TestTube className="w-4 h-4 mr-1" />
              XN Đạt
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleStatusUpdate(donation.id, 'TESTING_FAILED', 'Xét nghiệm không đạt')}
            >
              <XCircle className="w-4 h-4 mr-1" />
              XN Không đạt
            </Button>
          </div>
        );
      case 'TESTING_PASSED':
        return (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleStatusUpdate(donation.id, 'COMPLETED', 'Quy trình hiến máu hoàn tất')}
          >
            <ClipboardCheck className="w-4 h-4 mr-1" />
            Hoàn thành
          </Button>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  if (isLoading && donations.length === 0) {
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
        title="Quản lý hiến máu"
        description="Theo dõi và xử lý các đơn đăng ký hiến máu từ người dùng"
        variant="donations"
        showTime={true}
        showWeather={true}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{donations.length}</span> đơn hiến máu
          </div>
        </div>
        <Button
          onClick={() => fetchDonations(currentPage)}
          variant="outline"
          className="flex items-center space-x-2 bg-white/80 hover:bg-white/90 border-orange-200 hover:border-orange-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING_APPROVAL">Chờ duyệt</option>
              <option value="APPOINTMENT_PENDING">Chờ đặt lịch</option>
              <option value="APPOINTMENT_SCHEDULED">Đã lên lịch</option>
              <option value="HEALTH_CHECK_PASSED">Khám đạt</option>
              <option value="BLOOD_COLLECTED">Đã lấy máu</option>
              <option value="TESTING_PASSED">Xét nghiệm đạt</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredDonations.length} / {donations.length} đơn hiến máu
        </p>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy đơn hiến máu
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Thử thay đổi bộ lọc để xem thêm kết quả'
                : 'Chưa có đơn đăng ký hiến máu nào'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người hiến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhóm máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => {
                  const statusInfo = getStatusInfo(donation.status);
                  return (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {donation.donor?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donation.donor?.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              <Phone className="w-3 h-3 inline mr-1" />
                              {donation.donor?.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {donation.donor?.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDateTime(donation.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {donation.location || 'Chưa xác định'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {renderActionButtons(donation)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => fetchDonations(currentPage - 1)}
            >
              Trang trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages - 1}
              onClick={() => fetchDonations(currentPage + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDonationManagement;