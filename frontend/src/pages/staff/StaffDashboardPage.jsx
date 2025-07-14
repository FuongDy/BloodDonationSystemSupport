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
  Target,
  Shield
} from 'lucide-react';
import RoleBadge from '../../components/common/RoleBadge';
import { useAuth } from '../../hooks/useAuth';
import { useStaffDashboard } from '../../hooks/useStaffDashboard';
import WeeklyActivitiesChart from '../../components/staff/WeeklyActivitiesChart';
import StaffDashboardHeader from '../../components/staff/StaffDashboardHeader';

const StaffDashboardPage = () => {
  const { user } = useAuth();
  const { dashboardStats, quickStats, weeklyActivities, loading: dashboardLoading, error, refreshStats, weekOffset, setWeekOffset, startOfWeek, endOfWeek } = useStaffDashboard();
  
  // Đã xóa toàn bộ đoạn code liên quan đến useStaffAnalytics
  // const {
  //   weeklyActivities,
  //   realTimeStats,
  //   loading: analyticsLoading,
  //   lastUpdated,
  //   refreshAllData: refreshAnalytics
  // } = useStaffAnalytics({
  //   autoRefresh: true,
  //   refreshInterval: 5 * 60 * 1000, // 5 minutes
  //   enableRealTime: true
  // });

  const loading = dashboardLoading; // Đã bỏ analyticsLoading

  // Enhanced stats cards với dữ liệu real-time
  const statsCards = [
    {
      title: 'Yêu cầu hoạt động',
      value: dashboardStats?.activeBloodRequests?.toString() || '12', // Đã bỏ realTimeStats
      change: '+3 từ hôm qua',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      // isLive: !!realTimeStats
    },
    {
      title: 'Hiến máu hôm nay',
      value: dashboardStats?.todayDonations?.toString() || '8', // Đã bỏ realTimeStats
      change: `+${dashboardStats?.donationGrowthRate || 2}% từ hôm qua`,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      // isLive: !!realTimeStats
    },
    {
      title: 'Người đăng ký mới',
      value: dashboardStats?.newRegistrations?.toString() || '18',
      change: '+12% từ tuần trước',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Kho máu hiện tại',
      value: `${dashboardStats?.totalBloodUnits || 156} đơn vị`,
      change: '85% công suất',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    }
  ];

  // Quick actions với màu sắc và icon đẹp hơn
  const quickActions = [
    {
      title: 'Đặt lịch hiến máu',
      description: 'Quản lý và tạo lịch hẹn mới',
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      href: '/staff/appointments'
    },
    {
      title: 'Kiểm tra kho máu',
      description: 'Cập nhật tình trạng kho máu',
      icon: Package,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      href: '/staff/inventory'
    },
    {
      title: 'Yêu cầu khẩn cấp',
      description: 'Xử lý các yêu cầu máu khẩn cấp',
      icon: AlertTriangle,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      href: '/staff/emergency'
    },
    {
      title: 'Báo cáo thống kê',
      description: 'Xem báo cáo chi tiết và phân tích',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      href: '/staff/reports'
    }
  ];

  // Recent activities với status icon
  const recentActivities = [
    {
      type: 'donation',
      title: 'Nguyễn Văn A đã hoàn thành hiến máu',
      time: '15 phút trước',
      status: 'success',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'appointment',
      title: 'Lịch hẹn mới được tạo cho Trần Thị B',
      time: '1 giờ trước',
      status: 'pending',
      icon: Clock,
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

  // Create quick stats for header
  const headerStats = [
    {
      value: dashboardStats?.activeBloodRequests?.toString() || '12',
      label: 'Yêu cầu hoạt động',
      icon: <AlertTriangle className="w-5 h-5 text-white" />
    },
    {
      value: dashboardStats?.todayDonations?.toString() || '8',
      label: 'Hiến máu hôm nay',
      icon: <Heart className="w-5 h-5 text-white" />
    },
    {
      value: dashboardStats?.newRegistrations?.toString() || '18',
      label: 'Đăng ký mới',
      icon: <Users className="w-5 h-5 text-white" />
    },
    {
      value: `${dashboardStats?.totalBloodUnits || 156}`,
      label: 'Đơn vị máu',
      icon: <Package className="w-5 h-5 text-white" />
    }
  ];

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
    <div className="space-y-8">
      {/* Enhanced Dashboard Header */}
      <StaffDashboardHeader 
        title="Staff Dashboard"
        description="Theo dõi và quản lý các hoạt động hiến máu"
        stats={headerStats}
        showTime={true}
        showWeather={true}
        showActivityFeed={true}
        variant="default"
      />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className={`${card.bgColor} rounded-2xl p-6 border-2 ${card.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative`}
            >
              {/* {card.isLive && (
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              )} */}
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

      {/* Weekly Activities Chart + Tuần chọn */}
      <div className="mb-4 flex flex-col items-start justify-between">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => setWeekOffset(weekOffset - 1)}
          >
            ← Tuần trước
          </button>
          <span className="font-semibold text-orange-700 px-3">{getWeekLabel(weekOffset)}</span>
          <button
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
          >
            Tuần sau →
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-1 ml-2">
          Từ <span className="font-semibold">{formatDate(startOfWeek)}</span> đến <span className="font-semibold">{formatDate(endOfWeek)}</span>
        </div>
      </div>
      <WeeklyActivitiesChart 
        weeklyActivities={weeklyActivities}
        loading={loading} 
      />

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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="w-6 h-6 text-orange-500 mr-2" />
                Hoạt động gần đây
              </h3>
              <Link to="/staff/activities" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Xem tất cả
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color} bg-gray-100`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Schedule & Quick Stats */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 text-orange-500 mr-2" />
                Lịch hôm nay
              </h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-16 text-sm font-medium text-orange-600 flex-shrink-0">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.type === 'emergency' ? 'bg-red-100 text-red-800' :
                      item.type === 'appointment' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'meeting' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type === 'emergency' ? 'Khẩn cấp' :
                       item.type === 'appointment' ? 'Hẹn' :
                       item.type === 'meeting' ? 'Họp' : 'Khác'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Performance Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Hiệu suất hôm nay
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Cuộc hẹn hoàn thành</span>
                <span className="font-semibold">12/15</span>
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
  );
};

export default StaffDashboardPage;
