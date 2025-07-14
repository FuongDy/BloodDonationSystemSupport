// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { 
  Users, 
  Droplet, 
  Clock, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Heart,
  AlertTriangle,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { useAuth } from '../../hooks/useAuth';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import WeeklyActivitiesChart from '../../components/staff/WeeklyActivitiesChart';
import useStaffDashboard from '../../hooks/useStaffDashboard';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { weeklyActivities, loading, weekOffset, setWeekOffset, startOfWeek, endOfWeek } = useStaffDashboard();

  // Mock data for recent activity
  const recentActivities = [
    { id: 1, type: 'donation', user: 'Nguyễn Văn A', time: '2 giờ trước', status: 'completed' },
    { id: 2, type: 'appointment', user: 'Trần Thị B', time: '4 giờ trước', status: 'scheduled' },
    { id: 3, type: 'emergency', user: 'Lê Văn C', time: '6 giờ trước', status: 'urgent' },
    { id: 4, type: 'donation', user: 'Phạm Thị D', time: '8 giờ trước', status: 'completed' },
    { id: 5, type: 'appointment', user: 'Hoàng Văn E', time: '1 ngày trước', status: 'cancelled' },
  ];

  // Mock data for active donors
  const activeDonors = [
    { name: 'Nguyễn Minh Tuấn', donations: 12, bloodType: 'O+', lastDonation: '2 tuần trước' },
    { name: 'Trần Thị Lan', donations: 8, bloodType: 'A+', lastDonation: '1 tháng trước' },
    { name: 'Lê Hoàng Nam', donations: 15, bloodType: 'B+', lastDonation: '3 tuần trước' },
    { name: 'Phạm Thị Mai', donations: 6, bloodType: 'AB+', lastDonation: '2 tháng trước' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'donation':
        return <Droplet className="w-4 h-4 text-red-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'urgent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Hàm hiển thị label tuần
  const getWeekLabel = (offset) => {
    if (offset === 0) return 'Tuần này';
    if (offset === -1) return 'Tuần trước';
    if (offset < -1) return `${Math.abs(offset)} tuần trước`;
    if (offset === 1) return 'Tuần sau';
    return `${offset} tuần sau`;
  };
  // Hàm format ngày dd/mm/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader
        title="Admin Dashboard"
        description={`Chào mừng trở lại, ${user?.fullName || user?.email}! Đây là tổng quan về hoạt động hệ thống hiến máu BloodConnect.`}
        showActivityFeed={true}
      />

      {/* Enhanced Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {/* Users Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-purple-500/50 to-blue-500/60 backdrop-blur-md rounded-2xl border border-white/30"></div>
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-md mb-1">1,234</div>
            <div className="text-sm text-white/80 mb-2">Người dùng</div>
            <div className="text-xs text-white/70">Tổng số người dùng đã đăng ký</div>
            <div className="mt-2 text-xs text-green-300 font-medium">+12%</div>
          </div>
        </div>

        {/* Blood Donations Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-red-500/50 to-pink-500/60 backdrop-blur-md rounded-2xl border border-white/30"></div>
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Droplet className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-md mb-1">567</div>
            <div className="text-sm text-white/80 mb-2">Lượt hiến máu</div>
            <div className="text-xs text-white/70">Trong tháng này</div>
            <div className="mt-2 text-xs text-green-300 font-medium">+8%</div>
          </div>
        </div>

        {/* Blood Requests Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-orange-500/50 to-amber-500/60 backdrop-blur-md rounded-2xl border border-white/30"></div>
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-md mb-1">89</div>
            <div className="text-sm text-white/80 mb-2">Yêu cầu máu</div>
            <div className="text-xs text-white/70">Đang chờ xử lý</div>
            <div className="mt-2 text-xs text-green-300 font-medium">+5%</div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/60 via-green-500/50 to-emerald-500/60 backdrop-blur-md rounded-2xl border border-white/30"></div>
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-md mb-1">92%</div>
            <div className="text-sm text-white/80 mb-2">Tỷ lệ hoàn thành</div>
            <div className="text-xs text-white/70">Mục tiêu tháng này</div>
            <div className="mt-2 text-xs text-green-300 font-medium">+3%</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Weekly Chart - Takes 2 columns */}
        <div className='lg:col-span-2'>
          <div className='mb-4 flex flex-col items-start justify-between'>
            <div className='flex items-center space-x-2'>
              <button
                className='px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200'
                onClick={() => setWeekOffset(weekOffset - 1)}
              >
                ← Tuần trước
              </button>
              <span className='font-semibold text-purple-700 px-3'>{getWeekLabel(weekOffset)}</span>
              <button
                className='px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                onClick={() => setWeekOffset(weekOffset + 1)}
                disabled={weekOffset >= 0}
              >
                Tuần sau →
              </button>
            </div>
            <div className='text-sm text-gray-500 mt-1 ml-2'>
              Từ <span className='font-semibold'>{formatDate(startOfWeek)}</span> đến <span className='font-semibold'>{formatDate(endOfWeek)}</span>
            </div>
          </div>
          <WeeklyActivitiesChart 
            weeklyActivities={weeklyActivities}
            loading={loading}
          />
        </div>

        {/* Recent Activities - Takes 1 column */}
        <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>Hoạt động gần đây</h3>
              <p className='text-gray-600 text-sm'>Cập nhật mới nhất</p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Clock className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='space-y-3 max-h-80 overflow-y-auto'>
            {recentActivities.map((activity) => (
              <div key={activity.id} className='flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-white/40 to-purple-50/30 border border-white/30 hover:shadow-md transition-all duration-300'>
                <div className='w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center shadow-sm'>
                  {getActivityIcon(activity.type)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-800 truncate'>{activity.user}</p>
                  <p className='text-xs text-gray-600'>{activity.time}</p>
                </div>
                <span className={getStatusBadge(activity.status)}>
                  {activity.status === 'completed' && 'Hoàn thành'}
                  {activity.status === 'scheduled' && 'Đã hẹn'}
                  {activity.status === 'urgent' && 'Khẩn cấp'}
                  {activity.status === 'cancelled' && 'Đã hủy'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {/* Active Donors */}
        <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>Người hiến máu tích cực</h3>
              <p className='text-gray-600 text-sm'>Top người hiến máu nhiều nhất</p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Heart className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='space-y-3'>
            {activeDonors.map((donor, index) => (
              <div key={index} className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/40 to-red-50/30 border border-white/30 hover:shadow-md transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg'>
                    {donor.name.charAt(0)}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{donor.name}</p>
                    <p className='text-xs text-gray-600'>{donor.lastDonation}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-bold text-purple-600'>{donor.donations} lần</p>
                  <p className='text-xs text-gray-600'>{donor.bloodType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>Hành động nhanh</h3>
              <p className='text-gray-600 text-sm'>Các tác vụ thường dùng</p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg'>
              <CheckCircle className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <button className='p-4 bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 rounded-xl border border-purple-200/50 transition-all duration-300 hover:shadow-lg group'>
              <UserPlus className='w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <p className='text-sm font-medium text-purple-800'>Thêm người dùng</p>
            </button>
            <button className='p-4 bg-gradient-to-br from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 rounded-xl border border-red-200/50 transition-all duration-300 hover:shadow-lg group'>
              <Droplet className='w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <p className='text-sm font-medium text-red-800'>Quản lý kho máu</p>
            </button>
            <button className='p-4 bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-xl border border-blue-200/50 transition-all duration-300 hover:shadow-lg group'>
              <Calendar className='w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <p className='text-sm font-medium text-blue-800'>Lịch hẹn</p>
            </button>
            <button className='p-4 bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl border border-orange-200/50 transition-all duration-300 hover:shadow-lg group'>
              <AlertTriangle className='w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <p className='text-sm font-medium text-orange-800'>Khẩn cấp</p>
            </button>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminDashboardPage;
