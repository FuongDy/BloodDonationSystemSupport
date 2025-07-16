// src/pages/staff/StaffDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Droplet, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Package,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  PlusCircle,
  BarChart3,
  FileText,
  Bell,
  ChevronRight,
  Target
} from 'lucide-react';
import RoleBadge from '../../components/common/RoleBadge';
import { useAuth } from '../../hooks/useAuth';
import { useStaffDashboard } from '../../hooks/useStaffDashboard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WeeklyActivitiesChart from '../../components/staff/WeeklyActivitiesChart';

const StaffDashboardPage = () => {
  const { user } = useAuth();
  const { dashboardStats, quickStats, weeklyActivities, loading, error, refreshStats } = useStaffDashboard();

  // Tạo statsCards từ dữ liệu API hoặc fallback sang mock data
  const statsCards = [
    {
      title: 'Yêu cầu hoạt động',
      value: dashboardStats?.activeBloodRequests?.toString() || '12',
      change: '+3 từ hôm qua',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Hiến máu hôm nay',
      value: dashboardStats?.todayDonations?.toString() || '8',
      change: `+${dashboardStats?.donationGrowthRate || 2}% từ hôm qua`,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    {
      title: 'Người đăng ký mới',
      value: dashboardStats?.totalUsers?.toString() || '45',
      change: `+${dashboardStats?.userGrowthRate || 12}% tuần này`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Kho máu',
      value: '156 đơn vị',
      change: 'Đủ cho 3 ngày',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
  ];

  const quickActions = [
    {
      title: 'Tạo yêu cầu hiến máu',
      description: 'Tạo yêu cầu hiến máu mới cho bệnh nhân khẩn cấp',
      icon: PlusCircle,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      href: '/staff/donations'
    },
    {
      title: 'Quản lý hiến máu',
      description: 'Xem và quản lý các cuộc hiến máu đang diễn ra',
      icon: Activity,
      color: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      href: '/staff/donations'
    },
    {
      title: 'Cập nhật kho máu',
      description: 'Cập nhật số lượng và tình trạng kho máu',
      icon: Package,
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      href: '/staff/inventory'
    },
    {
      title: 'Báo cáo & Thống kê',
      description: 'Xem báo cáo chi tiết và phân tích dữ liệu',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      href: '/staff/reports'
    },
  ];

  const recentActivities = [
    {
      type: 'appointment',
      title: 'Yêu cầu hiến máu O+ từ bệnh nhân ABC',
      time: '2 phút trước',
      status: 'pending',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      type: 'donation',
      title: 'Hoàn thành hiến máu - Nguyễn Văn A',
      time: '15 phút trước',
      status: 'completed',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'user',
      title: 'Đăng ký tài khoản mới - Trần Thị B',
      time: '1 giờ trước',
      status: 'new',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      type: 'inventory',
      title: 'Cập nhật kho máu AB-',
      time: '2 giờ trước',
      status: 'updated',
      icon: Package,
      color: 'text-purple-600'
    },
  ];

  const todaySchedule = [
    { time: '09:00', event: 'Cuộc hẹn hiến máu - Lê Văn C', type: 'appointment' },
    { time: '10:30', event: 'Kiểm tra kho máu định kỳ', type: 'inventory' },
    { time: '14:00', event: 'Họp team y tế', type: 'meeting' },
    { time: '16:00', event: 'Xử lý yêu cầu khẩn cấp', type: 'emergency' },
  ];

  // Hiển thị loading spinner nếu đang tải dữ liệu
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Modern Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Chào mừng đến Staff Panel
                </h1>
                <p className="text-orange-100 text-lg">
                  Xin chào {user?.fullName}! Quản lý hiệu quả các hoạt động hiến máu.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <RoleBadge role="Staff" size="lg" />
                </div>
                <div className="text-right text-white">
                  <p className="text-sm text-orange-100">Hôm nay</p>
                  <p className="text-lg font-semibold">{new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                className={`${card.bgColor} rounded-2xl p-6 border-2 ${card.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.color} bg-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-gray-700 text-sm font-medium mb-1">{card.title}</h3>
                <p className={`text-2xl font-bold ${card.color} mb-1`}>{card.value}</p>
                <p className="text-xs text-gray-500">{card.change}</p>
              </div>
            );
          })}
        </div>

        {/* Weekly Activities Chart */}
        <WeeklyActivitiesChart weeklyActivities={weeklyActivities} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions - Enhanced */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 text-orange-500 mr-2" />
                  Hành động nhanh
                </h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link 
                      key={index}
                      to={action.href}
                      className="group cursor-pointer"
                    >
                      <div className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
                        <div className="flex items-start justify-between mb-3">
                          <Icon className="w-8 h-8 text-white" />
                          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                        <p className="text-white/90 text-sm">{action.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-6 h-6 text-blue-500 mr-2" />
                Hoạt động gần đây
              </h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${activity.color} bg-gray-100`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {activity.status === 'pending' && <Clock className="w-4 h-4 text-orange-500" />}
                        {activity.status === 'new' && <Bell className="w-4 h-4 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-purple-500 mr-2" />
                Lịch trình hôm nay
              </h2>
              
              <div className="space-y-4">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.time}</p>
                      <p className="text-xs text-gray-500 truncate">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl text-white p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Thống kê tuần này
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Hiến máu thành công</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Người đăng ký mới</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Yêu cầu xử lý</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Tỷ lệ thành công</span>
                  <span className="font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;