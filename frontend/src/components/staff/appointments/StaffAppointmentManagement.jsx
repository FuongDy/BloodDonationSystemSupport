// src/components/staff/appointments/StaffAppointmentManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  User,
  CalendarDays,
  Timer
} from 'lucide-react';
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffAppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    bloodType: '',
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    notes: ''
  });

  // Mock data for appointments - used as fallback
  const mockAppointments = [
    {
      id: 'APT001',
      patientName: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@email.com',
      bloodType: 'O+',
      appointmentDate: '2025-06-29',
      appointmentTime: '09:00',
      purpose: 'Hiến máu tình nguyện',
      status: 'confirmed',
      location: 'Phòng khám 1',
      notes: 'Đã hiến máu 2 lần trước đó'
    },
    {
      id: 'APT002',
      patientName: 'Trần Thị B',
      phone: '0987654321',
      email: 'tranthib@email.com',
      bloodType: 'A+',
      appointmentDate: '2025-06-29',
      appointmentTime: '10:30',
      purpose: 'Khám sức khỏe định kỳ',
      status: 'pending',
      location: 'Phòng khám 2',
      notes: 'Lần đầu hiến máu'
    },
    {
      id: 'APT003',
      patientName: 'Lê Văn C',
      phone: '0123987654',
      email: 'levanc@email.com',
      bloodType: 'B-',
      appointmentDate: '2025-06-30',
      appointmentTime: '14:00',
      purpose: 'Hiến máu khẩn cấp',
      status: 'confirmed',
      location: 'Phòng cấp cứu',
      notes: 'Yêu cầu từ bệnh viện ABC'
    }
  ];

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await staffService.getAllAppointments();
      
      if (response && response.data && response.data.length > 0) {
        setAppointments(response.data);
      } else {
        console.log('Using mock appointment data');
        setAppointments(mockAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Không thể tải dữ liệu lịch hẹn. Hiển thị dữ liệu mẫu.');
      setAppointments(mockAppointments);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new appointment
  const handleCreateAppointment = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await staffService.createAppointment(newAppointment);
      
      if (response && response.data) {
        toast.success('Tạo lịch hẹn thành công!');
        setShowCreateModal(false);
        setNewAppointment({
          donorName: '',
          donorPhone: '',
          donorEmail: '',
          bloodType: '',
          appointmentDate: '',
          appointmentTime: '',
          location: '',
          notes: ''
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Không thể tạo lịch hẹn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update appointment status
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await staffService.updateAppointmentStatus(appointmentId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.phone?.includes(searchTerm);
    
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === 'today') {
      return matchesSearch && appointment.appointmentDate === today;
    } else if (activeTab === 'upcoming') {
      return matchesSearch && appointment.appointmentDate > today;
    } else if (activeTab === 'pending') {
      return matchesSearch && appointment.status === 'pending';
    }
    
    return matchesSearch;
  });

  const tabs = [
    { id: 'today', label: 'Hôm nay', count: appointments.filter(a => a.appointmentDate === new Date().toISOString().split('T')[0]).length },
    { id: 'upcoming', label: 'Sắp tới', count: appointments.filter(a => a.appointmentDate > new Date().toISOString().split('T')[0]).length },
    { id: 'pending', label: 'Chờ xác nhận', count: appointments.filter(a => a.status === 'pending').length },
    { id: 'all', label: 'Tất cả', count: appointments.length }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Quản lý lịch hẹn"
        description="Theo dõi và quản lý các cuộc hẹn hiến máu với người dùng"
        variant="appointments"
        showTime={true}
        showWeather={true}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{appointments.length}</span> cuộc hẹn
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchAppointments}
            disabled={isLoading}
            className="bg-white/80 hover:bg-white/90 border border-blue-200 hover:border-blue-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo lịch hẹn</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hôm nay</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tuần này</p>
              <p className="text-2xl font-bold text-green-600">24</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-purple-600">42</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã lịch hẹn hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin bệnh nhân
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian hẹn
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mục đích
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.id}</div>
                      <div className="text-sm text-gray-500">Nhóm máu: {appointment.bloodType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{appointment.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{appointment.appointmentDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{appointment.appointmentTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{appointment.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.purpose}</div>
                    {appointment.notes && (
                      <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span>{getStatusText(appointment.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {filteredAppointments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn</h3>
            <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp với bộ lọc hiện tại</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAppointmentManagement;
