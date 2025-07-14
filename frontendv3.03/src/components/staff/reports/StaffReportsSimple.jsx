// src/components/staff/reports/StaffReportsSimple.jsx - Phiên bản đơn giản để debug
import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Users,
  Heart,
  Package,
  Activity,
  PieChart,
  Target,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

const StaffReportsSimple = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for reports
  const reportData = {
    week: {
      donations: 42,
      newUsers: 18,
      appointments: 65,
      bloodCollected: 18900,
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
      bloodCollected: 70200,
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
      bloodCollected: 850500,
      growthRate: 15.7,
      successRate: 93.1,
      avgDonationTime: 31,
      emergencyRequests: 156,
      cancelledAppointments: 187
    }
  };

  const currentData = reportData[selectedPeriod];

  const topDonors = [
    { name: 'Nguyễn Văn A', donations: 12, bloodType: 'O+', lastDonation: '2025-06-25', totalML: 5400 },
    { name: 'Trần Thị B', donations: 10, bloodType: 'A+', lastDonation: '2025-06-28', totalML: 4500 },
    { name: 'Lê Văn C', donations: 9, bloodType: 'B-', lastDonation: '2025-06-29', totalML: 4050 },
    { name: 'Phạm Thị D', donations: 8, bloodType: 'O-', lastDonation: '2025-06-27', totalML: 3600 },
    { name: 'Hoàng Văn E', donations: 7, bloodType: 'AB+', lastDonation: '2025-06-26', totalML: 3150 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
              <p className="text-gray-600">Phân tích dữ liệu hoạt động hiến máu</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm này</option>
            </select>
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg">
              <Download className="w-5 h-5" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
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

      {/* Simple Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
              Biểu đồ sẽ được thêm vào
            </h3>
          </div>
          <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Biểu đồ Recharts sẽ xuất hiện ở đây</p>
              <p className="text-sm text-gray-400 mt-2">Đang khắc phục lỗi import</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 text-purple-500 mr-2" />
              Phân bố nhóm máu (tạm thời)
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { type: 'O+', percentage: 35, count: 156 },
              { type: 'A+', percentage: 28, count: 124 },
              { type: 'B+', percentage: 15, count: 67 },
              { type: 'AB+', percentage: 8, count: 36 },
              { type: 'O-', percentage: 7, count: 31 },
              { type: 'A-', percentage: 4, count: 18 },
              { type: 'B-', percentage: 2, count: 9 },
              { type: 'AB-', percentage: 1, count: 4 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">{item.type}</span>
                  </div>
                  <span className="text-sm text-gray-900">{item.count} đơn vị</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffReportsSimple;
