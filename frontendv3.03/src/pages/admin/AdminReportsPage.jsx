// src/pages/admin/AdminReportsPage.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Droplet,
  Activity,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  FileText,
  Download,
  Filter
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import StatsCard from '../../components/common/StatsCard';
import DashboardHeader from '../../components/admin/DashboardHeader';

const AdminReportsPage = () => {
  // Mock data for blood type distribution with better colors
  const bloodTypeData = [
    { name: 'O+', value: 35, count: 420, color: '#ef4444' }, // Red
    { name: 'A+', value: 28, count: 336, color: '#f59e0b' }, // Amber
    { name: 'B+', value: 20, count: 240, color: '#3b82f6' }, // Blue
    { name: 'AB+', value: 8, count: 96, color: '#10b981' }, // Emerald
    { name: 'O-', value: 5, count: 60, color: '#8b5cf6' }, // Violet
    { name: 'A-', value: 2, count: 24, color: '#ec4899' }, // Pink
    { name: 'B-', value: 1.5, count: 18, color: '#06b6d4' }, // Cyan
    { name: 'AB-', value: 0.5, count: 6, color: '#84cc16' }, // Lime
  ];

  // Mock data for age distribution with gradient colors
  const ageDistributionData = [
    { age: '18-25', donors: 120, percentage: 30, fill: '#3b82f6' },
    { age: '26-35', donors: 160, percentage: 40, fill: '#1d4ed8' },
    { age: '36-45', donors: 80, percentage: 20, fill: '#1e40af' },
    { age: '46-55', donors: 32, percentage: 8, fill: '#1e3a8a' },
    { age: '56-65', donors: 8, percentage: 2, fill: '#172554' },
  ];

  // Mock data for monthly trends with multiple lines
  const monthlyTrendsData = [
    { month: 'T1', donations: 45, appointments: 52, requests: 38 },
    { month: 'T2', donations: 52, appointments: 48, requests: 42 },
    { month: 'T3', donations: 48, appointments: 61, requests: 45 },
    { month: 'T4', donations: 61, appointments: 55, requests: 48 },
    { month: 'T5', donations: 55, appointments: 67, requests: 52 },
    { month: 'T6', donations: 67, appointments: 62, requests: 58 },
    { month: 'T7', donations: 62, appointments: 70, requests: 55 },
    { month: 'T8', donations: 70, appointments: 65, requests: 62 },
    { month: 'T9', donations: 65, appointments: 72, requests: 58 },
    { month: 'T10', donations: 72, appointments: 68, requests: 65 },
    { month: 'T11', donations: 68, appointments: 75, requests: 68 },
    { month: 'T12', donations: 75, appointments: 70, requests: 72 },
  ];

  // Mock data for yearly comparison
  const yearlyComparisonData = [
    { period: 'T1', thisYear: 15, lastYear: 12 },
    { period: 'T2', thisYear: 18, lastYear: 15 },
    { period: 'T3', thisYear: 22, lastYear: 18 },
    { period: 'T4', thisYear: 20, lastYear: 16 },
    { period: 'T5', thisYear: 25, lastYear: 20 },
    { period: 'T6', thisYear: 28, lastYear: 22 },
    { period: 'T7', thisYear: 30, lastYear: 25 },
    { period: 'T8', thisYear: 27, lastYear: 23 },
    { period: 'T9', thisYear: 32, lastYear: 28 },
    { period: 'T10', thisYear: 35, lastYear: 30 },
    { period: 'T11', thisYear: 33, lastYear: 28 },
    { period: 'T12', thisYear: 38, lastYear: 32 },
  ];

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-gray-200/50">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {`${item.dataKey}: ${item.value}${item.dataKey.includes('percentage') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-gray-200/50">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{`Số lượng: ${data.count} người`}</p>
          <p className="text-sm text-gray-600">{`Tỷ lệ: ${data.value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader
        title="Báo cáo hệ thống"
        description="Tổng quan chi tiết về các số liệu và phân tích dữ liệu của hệ thống hiến máu BloodConnect. Theo dõi xu hướng và hiệu suất hoạt động."
        variant="reports"
        showActivityFeed={false}
        stats={[
          {
            icon: <FileText className="w-5 h-5 text-blue-300" />,
            value: "12",
            label: "Báo cáo"
          },
          {
            icon: <BarChart3 className="w-5 h-5 text-green-300" />,
            value: "8",
            label: "Biểu đồ"
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-purple-300" />,
            value: "+15%",
            label: "Tăng trưởng"
          },
          {
            icon: <Download className="w-5 h-5 text-orange-300" />,
            value: "Export",
            label: "Dữ liệu"
          }
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tổng số hiến máu"
          value="1,247"
          description="+12% so với tháng trước"
          icon={Droplet}
          color="red"
          trend="up"
        />
        <StatsCard
          title="Người hiến máu"
          value="856"
          description="+8% người mới đăng ký"
          icon={Users}
          color="blue"
          trend="up"
        />
        <StatsCard
          title="Lịch hẹn"
          value="324"
          description="Trong tháng này"
          icon={Calendar}
          color="green"
          trend="stable"
        />
        <StatsCard
          title="Tỷ lệ hoàn thành"
          value="92%"
          description="+3% so với mục tiêu"
          icon={Activity}
          color="amber"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Blood Type Distribution - Pie Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Phân bố nhóm máu</h3>
              <p className="text-gray-600 text-sm">Tỷ lệ các nhóm máu trong hệ thống</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <PieChartIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={bloodTypeData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {bloodTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontWeight: 'bold' }}>
                    {value} ({entry.payload.value}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution - Bar Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Phân bố độ tuổi</h3>
              <p className="text-gray-600 text-sm">Độ tuổi của người hiến máu</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ageDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="donors" radius={[8, 8, 0, 0]}>
                {ageDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends - Line Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xu hướng theo tháng</h3>
              <p className="text-gray-600 text-sm">Hiến máu, lịch hẹn và yêu cầu</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="donations" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                name="Hiến máu"
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                name="Lịch hẹn"
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                name="Yêu cầu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Comparison - Area Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">So sánh theo năm</h3>
              <p className="text-gray-600 text-sm">Hiến máu năm nay vs năm trước</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={yearlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="lastYear"
                stackId="1"
                stroke="#f97316"
                fill="url(#lastYearGradient)"
                name="Năm trước"
              />
              <Area
                type="monotone"
                dataKey="thisYear"
                stackId="2"
                stroke="#8b5cf6"
                fill="url(#thisYearGradient)"
                name="Năm nay"
              />
              <defs>
                <linearGradient id="thisYearGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="lastYearGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt báo cáo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-green-700 mb-2">Tăng trưởng tích cực</h4>
            <p className="text-sm text-gray-600">Số lượng hiến máu tăng 12% so với tháng trước</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-blue-700 mb-2">Cộng đồng mở rộng</h4>
            <p className="text-sm text-gray-600">856 người hiến máu đã tham gia hệ thống</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-amber-700 mb-2">Hiệu suất cao</h4>
            <p className="text-sm text-gray-600">Tỷ lệ hoàn thành đạt 92%, vượt mục tiêu</p>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminReportsPage;
