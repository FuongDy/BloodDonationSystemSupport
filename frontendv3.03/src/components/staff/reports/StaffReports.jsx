import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Users,
  Heart,
  Package,
  Activity,
  PieChart,
  LineChart,
  Target,
  Clock,
  Award,
  MapPin,
  AlertTriangle
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for reports
  const reportData = {
    week: {
      donations: 42,
      newUsers: 18,
      appointments: 65,
      bloodCollected: 18900, // ml
      growthRate: 12.5,
      successRate: 94.2,
      avgDonationTime: 35,
      emergencyRequests: 8,
      cancelledAppointments: 4
    },
    month: {
      donations: 156,
      newUsers: 89,
      appointments: 234,
      bloodCollected: 70200, // ml
      growthRate: 8.3,
      successRate: 91.7,
      avgDonationTime: 33,
      emergencyRequests: 28,
      cancelledAppointments: 19
    },
    year: {
      donations: 1890,
      newUsers: 1024,
      appointments: 2567,
      bloodCollected: 850500, // ml
      growthRate: 15.7,
      successRate: 93.1,
      avgDonationTime: 31,
      emergencyRequests: 156,
      cancelledAppointments: 187
    }
  };

  const currentData = reportData[selectedPeriod];

  // Enhanced chart data for multiple visualizations
  const monthlyTrends = [
    { month: 'T1', donations: 135, appointments: 162, users: 78, bloodCollected: 60750 },
    { month: 'T2', donations: 128, appointments: 148, users: 65, bloodCollected: 57600 },
    { month: 'T3', donations: 145, appointments: 172, users: 89, bloodCollected: 65250 },
    { month: 'T4', donations: 142, appointments: 168, users: 92, bloodCollected: 63900 },
    { month: 'T5', donations: 138, appointments: 165, users: 84, bloodCollected: 62100 },
    { month: 'T6', donations: 156, appointments: 189, users: 98, bloodCollected: 70200 },
  ];

  const weeklyTrends = [
    { day: 'T2', donations: 8, appointments: 12 },
    { day: 'T3', donations: 6, appointments: 9 },
    { day: 'T4', donations: 10, appointments: 15 },
    { day: 'T5', donations: 7, appointments: 11 },
    { day: 'T6', donations: 5, appointments: 8 },
    { day: 'T7', donations: 3, appointments: 5 },
    { day: 'CN', donations: 3, appointments: 5 },
  ];

  const bloodTypeDistribution = [
    { name: 'O+', percentage: 35, count: 156, value: 35 },
    { name: 'A+', percentage: 28, count: 124, value: 28 },
    { name: 'B+', percentage: 15, count: 67, value: 15 },
    { name: 'AB+', percentage: 8, count: 36, value: 8 },
    { name: 'O-', percentage: 7, count: 31, value: 7 },
    { name: 'A-', percentage: 4, count: 18, value: 4 },
    { name: 'B-', percentage: 2, count: 9, value: 2 },
    { name: 'AB-', percentage: 1, count: 4, value: 1 },
  ];

  const appointmentStatusData = [
    { status: 'Hoàn thành', value: 156, percentage: 65.3, color: '#10B981' },
    { status: 'Đang chờ xử lý', value: 42, percentage: 17.6, color: '#3B82F6' },
    { status: 'Đã xác nhận', value: 25, percentage: 10.5, color: '#8B5CF6' },
    { status: 'Đã hủy', value: 12, percentage: 5.0, color: '#EF4444' },
    { status: 'Không đến', value: 4, percentage: 1.6, color: '#6B7280' }
  ];

  const regionData = [
    { region: 'Hà Nội', donations: 245, growth: 12.5 },
    { region: 'TP.HCM', donations: 198, growth: 8.9 },
    { region: 'Đà Nẵng', donations: 156, growth: 15.2 },
    { region: 'Cần Thơ', donations: 89, growth: 6.7 },
    { region: 'Hải Phòng', donations: 76, growth: 9.8 }
  ];

  const topDonors = [
    { name: 'Nguyễn Văn A', donations: 12, bloodType: 'O+', lastDonation: '2025-06-25', totalML: 5400 },
    { name: 'Trần Thị B', donations: 10, bloodType: 'A+', lastDonation: '2025-06-28', totalML: 4500 },
    { name: 'Lê Văn C', donations: 9, bloodType: 'B-', lastDonation: '2025-06-29', totalML: 4050 },
    { name: 'Phạm Thị D', donations: 8, bloodType: 'O-', lastDonation: '2025-06-27', totalML: 3600 },
    { name: 'Hoàng Văn E', donations: 7, bloodType: 'AB+', lastDonation: '2025-06-26', totalML: 3150 }
  ];

  // Colors for charts
  const COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];
  const chartData = selectedPeriod === 'week' ? weeklyTrends : monthlyTrends;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Báo cáo & Thống kê"
        description="Phân tích dữ liệu hoạt động hiến máu và đánh giá hiệu suất"
        variant="reports"
        showTime={true}
        showWeather={true}
      />

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Thống kê <span className="font-medium">{selectedPeriod === 'week' ? 'tuần này' : selectedPeriod === 'month' ? 'tháng này' : 'năm này'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white/80 border border-purple-200 hover:border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm này</option>
          </select>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg text-sm">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Enhanced Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="p-3 bg-red-100 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">{currentData.donations}</p>
              <p className="text-sm text-gray-600">Lượt hiến máu</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Tỷ lệ thành công</span>
            <span className="font-medium">{currentData.successRate}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+{currentData.growthRate}%</span>
            <span className="text-sm text-gray-500">so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{currentData.newUsers}</p>
              <p className="text-sm text-gray-600">Người dùng mới</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Trung bình/ngày</span>
            <span className="font-medium">{Math.round(currentData.newUsers / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365))}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+15.2%</span>
            <span className="text-sm text-gray-500">so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{currentData.appointments}</p>
              <p className="text-sm text-gray-600">Lịch hẹn</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Đã hủy</span>
            <span className="font-medium text-red-500">{currentData.cancelledAppointments}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+8.7%</span>
            <span className="text-sm text-gray-500">so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{(currentData.bloodCollected / 1000).toFixed(1)}L</p>
              <p className="text-sm text-gray-600">Máu thu được</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>TB/lần hiến</span>
            <span className="font-medium">{Math.round(currentData.bloodCollected / currentData.donations)}ml</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">+11.3%</span>
            <span className="text-sm text-gray-500">so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentData.successRate}%</p>
              <p className="text-sm text-purple-100">Tỷ lệ thành công</p>
            </div>
          </div>
          <p className="text-sm text-purple-100">Hiệu quả hoạt động cao</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentData.avgDonationTime}</p>
              <p className="text-sm text-indigo-100">Phút TB/lần</p>
            </div>
          </div>
          <p className="text-sm text-indigo-100">Thời gian hiến máu</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentData.emergencyRequests}</p>
              <p className="text-sm text-yellow-100">Yêu cầu khẩn cấp</p>
            </div>
          </div>
          <p className="text-sm text-yellow-100">Cần xử lý ưu tiên</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{topDonors.length}</p>
              <p className="text-sm text-pink-100">Người hiến tích cực</p>
            </div>
          </div>
          <p className="text-sm text-pink-100">Top contributors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Bar Chart - Donation Trends */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
              Xu hướng hiến máu {selectedPeriod === 'week' ? '7 ngày' : selectedPeriod === 'month' ? '6 tháng' : '12 tháng'} gần đây
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={selectedPeriod === 'week' ? 'day' : 'month'} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="donations" fill="#ef4444" name="Lượt hiến máu" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appointments" fill="#3b82f6" name="Lịch hẹn" radius={[4, 4, 0, 0]} />
                {selectedPeriod === 'month' && (
                  <Bar dataKey="users" fill="#10b981" name="Người dùng mới" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Pie Chart - Blood Type Distribution */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 text-purple-500 mr-2" />
              Phân bố nhóm máu
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={bloodTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Tỷ lệ']}
                  labelFormatter={(label) => `Nhóm máu: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Appointment Status Chart */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <LineChart className="w-5 h-5 text-purple-500 mr-2" />
              Trạng thái lịch hẹn
            </h3>
            <div className="text-sm text-gray-500">
              Tổng: {appointmentStatusData.reduce((sum, item) => sum + item.value, 0)} lịch hẹn
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Pie Chart - Làm to hơn */}
            <div className="lg:col-span-3">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ status, percentage }) => `${percentage}%`}
                      labelLine={false}
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} lịch hẹn (${props.payload.percentage}%)`, 
                        props.payload.status
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Chú thích rõ ràng ở dưới biểu đồ */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {appointmentStatusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">{item.status}</div>
                      <div className="text-xs text-gray-500">{item.value} ({item.percentage}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status Summary Cards */}
            <div className="lg:col-span-2 space-y-3">
              {appointmentStatusData.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.status}</div>
                    <div className="text-xs text-gray-500">
                      {item.value} lịch hẹn • {item.percentage}%
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-700">{item.value}</div>
                </div>
              ))}
              
              {/* Summary Stats */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <div className="text-sm font-medium text-blue-900 mb-3">📊 Tóm tắt thống kê</div>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Tỷ lệ thành công:</span>
                    <span className="font-semibold">{appointmentStatusData[0].percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cần xử lý:</span>
                    <span className="font-semibold">{appointmentStatusData.slice(1, 3).reduce((sum, item) => sum + item.value, 0)} lịch</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỷ lệ hủy/không đến:</span>
                    <span className="font-semibold">{(appointmentStatusData[3].percentage + appointmentStatusData[4].percentage).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced Top Donors Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 text-purple-500 mr-2" />
            Người hiến máu tích cực nhất
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Tổng cộng: </span>
            <span className="text-sm font-bold text-purple-600">{topDonors.reduce((sum, donor) => sum + donor.totalML, 0).toLocaleString()}ml</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhóm máu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lần hiến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topDonors.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {donor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      {donor.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-bold text-gray-900">{donor.donations}</div>
                      <div className="text-xs text-gray-500">lần</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-orange-600">{donor.totalML.toLocaleString()}ml</div>
                      <div className="text-xs text-gray-500">{(donor.totalML / 1000).toFixed(1)}L</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donor.lastDonation).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Award 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.min(5, Math.floor(donor.donations / 2)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{topDonors.reduce((sum, donor) => sum + donor.donations, 0)}</div>
            <div className="text-sm text-gray-500">Tổng lượt hiến</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{(topDonors.reduce((sum, donor) => sum + donor.totalML, 0) / 1000).toFixed(1)}L</div>
            <div className="text-sm text-gray-500">Tổng lượng máu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(topDonors.reduce((sum, donor) => sum + donor.totalML, 0) / topDonors.reduce((sum, donor) => sum + donor.donations, 0))}ml</div>
            <div className="text-sm text-gray-500">TB mỗi lần</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffReports;
