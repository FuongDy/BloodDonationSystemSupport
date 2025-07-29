// src/pages/admin/AdminDashboardPage.jsx
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Droplet,
  Heart,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import StatsCard from '../../components/admin/StatsCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const {
    dashboardStats,
    weeklyActivityData,
    activeDonors,
    isLoading,
    error,
    refreshData,
    totalDonationsThisWeek,
    totalAppointmentsThisWeek,
    totalRequestsThisWeek,
  } = useAdminDashboard();

  // Mock data for recent activity (có thể tạo API riêng sau)
  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      user: 'Nguyễn Văn A',
      time: '2 giờ trước',
      status: 'completed',
    },
    {
      id: 2,
      type: 'appointment',
      user: 'Trần Thị B',
      time: '4 giờ trước',
      status: 'scheduled',
    },
    {
      id: 3,
      type: 'emergency',
      user: 'Lê Văn C',
      time: '6 giờ trước',
      status: 'urgent',
    },
    {
      id: 4,
      type: 'donation',
      user: 'Phạm Thị D',
      time: '8 giờ trước',
      status: 'completed',
    },
    {
      id: 5,
      type: 'appointment',
      user: 'Hoàng Văn E',
      time: '1 ngày trước',
      status: 'cancelled',
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </AdminPageLayout>
    );
  }

  // Error state
  if (error && !dashboardStats) {
    return (
      <AdminPageLayout>
        <div className='flex flex-col justify-center items-center py-20'>
          <AlertTriangle className='w-16 h-16 text-red-500 mb-4' />
          <p className='text-gray-600 mb-4'>Không thể tải dữ liệu dashboard</p>
          <Button onClick={refreshData} variant='primary'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Thử lại
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  const getActivityIcon = type => {
    switch (type) {
      case 'donation':
        return <Droplet className='w-4 h-4 text-red-500' />;
      case 'appointment':
        return <Calendar className='w-4 h-4 text-blue-500' />;
      case 'emergency':
        return <AlertTriangle className='w-4 h-4 text-orange-500' />;
      default:
        return <Activity className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusBadge = status => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
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

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader
        title={user?.role === 'Staff' ? 'Staff Dashboard' : 'Admin Dashboard'}
        description={`Chào mừng trở lại, ${user?.fullName || user?.email}! Đây là tổng quan về hoạt động hệ thống hiến máu HiBlood.`}
        showActivityFeed={true}
        actions={
          <Button onClick={refreshData} variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Làm mới
          </Button>
        }
      />

      {/* Enhanced Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <StatsCard
          title='Người dùng'
          value={dashboardStats?.totalUsers || 0}
          subtitle='Tổng số người dùng đã đăng ký'
          icon={Users}
          gradientFrom='from-purple-600/60 via-purple-500/50'
          gradientTo='to-blue-500/60'
        />

        <StatsCard
          title='Lượt hiến máu'
          value={dashboardStats?.completedDonations || 0}
          subtitle='Đã hoàn thành'
          icon={Droplet}
          gradientFrom='from-red-600/60 via-red-500/50'
          gradientTo='to-pink-500/60'
        />

        <StatsCard
          title='Yêu cầu máu'
          value={dashboardStats?.activeBloodRequests || 0}
          subtitle='Đang chờ xử lý'
          icon={Clock}
          gradientFrom='from-orange-600/60 via-orange-500/50'
          gradientTo='to-amber-500/60'
        />

        <StatsCard
          title='Yêu cầu khẩn cấp'
          value={dashboardStats?.emergencyRequests || 0}
          subtitle='Cần xử lý ngay'
          icon={AlertTriangle}
          gradientFrom='from-green-600/60 via-green-500/50'
          gradientTo='to-emerald-500/60'
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Weekly Chart - Takes 4 columns */}
        <div className='lg:col-span-4'>
          <div className='bg-white rounded-2xl p-5 shadow border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='text-lg font-bold text-gray-800'>
                  Hoạt động trong tuần
                </h3>
                <p className='text-gray-600 text-sm'>
                  Số lượng hiến máu, lịch hẹn và yêu cầu theo ngày
                </p>
              </div>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Activity className='w-5 h-5 text-white' />
              </div>
            </div>
            {weeklyActivityData.length > 0 ? (
              <ResponsiveContainer width='100%' height={280}>
                <BarChart
                  data={weeklyActivityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                  <XAxis dataKey='name' stroke='#64748b' fontSize={12} />
                  <YAxis stroke='#64748b' fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(147, 51, 234, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                    }}
                  />
                  <Bar
                    dataKey='donations'
                    fill='url(#donationGradient)'
                    radius={[4, 4, 0, 0]}
                    name='Hiến máu'
                  />
                  <Bar
                    dataKey='appointments'
                    fill='url(#appointmentGradient)'
                    radius={[4, 4, 0, 0]}
                    name='Lịch hẹn'
                  />
                  <Bar
                    dataKey='requests'
                    fill='url(#requestGradient)'
                    radius={[4, 4, 0, 0]}
                    name='Yêu cầu'
                  />
                  <defs>
                    <linearGradient
                      id='donationGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#8b5cf6' />
                      <stop offset='100%' stopColor='#c084fc' />
                    </linearGradient>
                    <linearGradient
                      id='appointmentGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#3b82f6' />
                      <stop offset='100%' stopColor='#93c5fd' />
                    </linearGradient>
                    <linearGradient
                      id='requestGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#f59e0b' />
                      <stop offset='100%' stopColor='#fbbf24' />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-64'>
                <p className='text-gray-500'>
                  Không có dữ liệu hoạt động trong tuần
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {/* Weekly Summary */}
        <div className='bg-white rounded-2xl p-5 shadow border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>
                Tóm tắt tuần này
              </h3>
              <p className='text-gray-600 text-sm'>
                Thống kê hoạt động trong 7 ngày qua
              </p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              <TrendingUp className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/40 to-purple-50/30 border border-white/30'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center'>
                  <Droplet className='w-4 h-4 text-white' />
                </div>
                <span className='text-sm font-medium text-gray-800'>
                  Hiến máu
                </span>
              </div>
              <span className='text-lg font-bold text-purple-600'>
                {totalDonationsThisWeek}
              </span>
            </div>
            <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/40 to-blue-50/30 border border-white/30'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                  <Calendar className='w-4 h-4 text-white' />
                </div>
                <span className='text-sm font-medium text-gray-800'>
                  Lịch hẹn
                </span>
              </div>
              <span className='text-lg font-bold text-blue-600'>
                {totalAppointmentsThisWeek}
              </span>
            </div>
            <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/40 to-amber-50/30 border border-white/30'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center'>
                  <Clock className='w-4 h-4 text-white' />
                </div>
                <span className='text-sm font-medium text-gray-800'>
                  Yêu cầu
                </span>
              </div>
              <span className='text-lg font-bold text-amber-600'>
                {totalRequestsThisWeek}
              </span>
            </div>
          </div>
        </div>

        {/* Active Donors */}
        <div className='bg-white rounded-2xl p-5 shadow border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>
                Người hiến máu tích cực
              </h3>
              <p className='text-gray-600 text-sm'>
                Top người hiến máu nhiều nhất
              </p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Heart className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='space-y-3'>
            {activeDonors && activeDonors.length > 0 ? (
              activeDonors.map((donor, index) => (
                <div
                  key={donor.id || index}
                  className='flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg'>
                      {donor.name ? donor.name.charAt(0) : 'N'}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-800'>
                        {donor.name || 'N/A'}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {donor.lastDonation
                          ? new Date(donor.lastDonation).toLocaleDateString(
                              'vi-VN'
                            )
                          : 'Chưa có dữ liệu'}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-purple-600'>
                      {donor.totalDonations || 0} lần
                    </p>
                    <p className='text-xs text-gray-600'>
                      {donor.bloodType || 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6 text-gray-500'>
                <Heart className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                <p className='text-sm font-medium'>
                  Dữ liệu người hiến máu tích cực
                </p>
                <p className='text-xs'>đang được cập nhật</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions
        <div className='bg-white rounded-2xl p-5 shadow border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>
                Hành động nhanh
              </h3>
              <p className='text-gray-600 text-sm'>Các tác vụ thường dùng</p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg'>
              <CheckCircle className='w-5 h-5 text-white' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <Link to='/admin/users/new' className='p-4 bg-purple-50 rounded-xl border border-purple-200'>
              <button className='p-4 bg-purple-50 rounded-xl border border-purple-200'>
                <UserPlus className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                <p className='text-sm font-medium text-purple-800'>
                  Thêm người dùng
                </p>
              </button>
            </Link>
            <button className='p-4 bg-red-50 rounded-xl border border-red-200'>
              <Droplet className='w-8 h-8 text-red-600 mx-auto mb-2' />
              <p className='text-sm font-medium text-red-800'>
                Quản lý kho máu
              </p>
            </button>
            <button className='p-4 bg-blue-50 rounded-xl border border-blue-200'>
              <Calendar className='w-8 h-8 text-blue-600 mx-auto mb-2' />
              <p className='text-sm font-medium text-blue-800'>Lịch hẹn</p>
            </button>
            <button className='p-4 bg-orange-50 rounded-xl border border-orange-200'>
              <AlertTriangle className='w-8 h-8 text-orange-600 mx-auto mb-2' />
              <p className='text-sm font-medium text-orange-800'>Khẩn cấp</p>
            </button>
          </div>
        </div> */}
      </div>
    </AdminPageLayout>
  );
};

export default AdminDashboardPage;
