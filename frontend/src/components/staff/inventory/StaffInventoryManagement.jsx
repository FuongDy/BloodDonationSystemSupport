// src/components/staff/inventory/StaffInventoryManagement.jsx
import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Droplet,
  Calendar,
  Clock
} from 'lucide-react';

const StaffInventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for blood inventory
  const bloodInventory = [
    {
      id: 'INV001',
      bloodType: 'O+',
      quantity: 45,
      expiryDate: '2025-07-15',
      status: 'adequate',
      location: 'Kho chính - Tủ lạnh A1',
      lastUpdated: '2025-06-29 08:30',
      donorCount: 8,
      usedToday: 3
    },
    {
      id: 'INV002',
      bloodType: 'A+',
      quantity: 32,
      expiryDate: '2025-07-10',
      status: 'adequate',
      location: 'Kho chính - Tủ lạnh A2',
      lastUpdated: '2025-06-29 09:15',
      donorCount: 6,
      usedToday: 2
    },
    {
      id: 'INV003',
      bloodType: 'B+',
      quantity: 18,
      expiryDate: '2025-07-05',
      status: 'low',
      location: 'Kho chính - Tủ lạnh B1',
      lastUpdated: '2025-06-29 07:45',
      donorCount: 4,
      usedToday: 1
    },
    {
      id: 'INV004',
      bloodType: 'AB+',
      quantity: 12,
      expiryDate: '2025-07-03',
      status: 'critical',
      location: 'Kho chính - Tủ lạnh B2',
      lastUpdated: '2025-06-29 10:00',
      donorCount: 2,
      usedToday: 4
    },
    {
      id: 'INV005',
      bloodType: 'O-',
      quantity: 28,
      expiryDate: '2025-07-12',
      status: 'adequate',
      location: 'Kho cấp cứu - Tủ lạnh C1',
      lastUpdated: '2025-06-29 06:30',
      donorCount: 5,
      usedToday: 1
    },
    {
      id: 'INV006',
      bloodType: 'A-',
      quantity: 8,
      expiryDate: '2025-07-01',
      status: 'critical',
      location: 'Kho cấp cứu - Tủ lạnh C2',
      lastUpdated: '2025-06-29 09:45',
      donorCount: 2,
      usedToday: 2
    },
    {
      id: 'INV007',
      bloodType: 'B-',
      quantity: 15,
      expiryDate: '2025-07-08',
      status: 'low',
      location: 'Kho chính - Tủ lạnh D1',
      lastUpdated: '2025-06-29 08:15',
      donorCount: 3,
      usedToday: 0
    },
    {
      id: 'INV008',
      bloodType: 'AB-',
      quantity: 6,
      expiryDate: '2025-06-30',
      status: 'critical',
      location: 'Kho cấp cứu - Tủ lạnh D2',
      lastUpdated: '2025-06-29 11:20',
      donorCount: 1,
      usedToday: 1
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'adequate':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'adequate':
        return <TrendingUp className="w-4 h-4" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'adequate':
        return 'Đủ dùng';
      case 'low':
        return 'Sắp hết';
      case 'critical':
        return 'Cần bổ sung gấp';
      default:
        return status;
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredInventory = bloodInventory.filter(item => {
    const matchesSearch = item.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const totalUnits = bloodInventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalItems = bloodInventory.filter(item => item.status === 'critical').length;
  const lowItems = bloodInventory.filter(item => item.status === 'low').length;
  const expiringItems = bloodInventory.filter(item => getDaysUntilExpiry(item.expiryDate) <= 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý kho máu</h1>
              <p className="text-gray-600">Theo dõi và quản lý tồn kho máu</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Làm mới</span>
            </button>
            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg">
              <Plus className="w-5 h-5" />
              <span>Nhập kho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng đơn vị</p>
              <p className="text-2xl font-bold text-blue-600">{totalUnits}</p>
              <p className="text-xs text-gray-500 mt-1">Tất cả nhóm máu</p>
            </div>
            <Droplet className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cần bổ sung gấp</p>
              <p className="text-2xl font-bold text-red-600">{criticalItems}</p>
              <p className="text-xs text-gray-500 mt-1">Nhóm máu thiếu</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sắp hết</p>
              <p className="text-2xl font-bold text-yellow-600">{lowItems}</p>
              <p className="text-xs text-gray-500 mt-1">Cần theo dõi</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sắp hết hạn</p>
              <p className="text-2xl font-bold text-purple-600">{expiringItems}</p>
              <p className="text-xs text-gray-500 mt-1">≤ 3 ngày</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
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
                placeholder="Tìm kiếm theo nhóm máu, mã kho hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="adequate">Đủ dùng</option>
              <option value="low">Sắp hết</option>
              <option value="critical">Cần bổ sung gấp</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhóm máu
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạn sử dụng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động hôm nay
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{item.bloodType}</div>
                          <div className="text-sm text-gray-500">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl font-bold text-gray-900">{item.quantity}</div>
                      <div className="text-sm text-gray-500">đơn vị</div>
                      <div className="text-xs text-gray-400">Từ {item.donorCount} người hiến</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.location}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cập nhật: {item.lastUpdated}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.expiryDate}</div>
                      <div className={`text-xs mt-1 ${
                        daysUntilExpiry <= 3 ? 'text-red-600 font-medium' : 
                        daysUntilExpiry <= 7 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysUntilExpiry > 0 ? `Còn ${daysUntilExpiry} ngày` : 'Đã hết hạn'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{getStatusText(item.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="text-red-600 font-medium">-{item.usedToday}</span> đã sử dụng
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Còn lại: {item.quantity} đơn vị
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffInventoryManagement;
