// src/components/staff/inventory/StaffInventoryManagement.jsx
import React, { useState, useEffect } from 'react';
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
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffInventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [recentAdditions, setRecentAdditions] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');

  // Mock data for blood inventory - used as fallback
  const mockBloodInventory = [
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

  // Fetch inventory data from API
  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      
      const [inventoryResponse, summaryResponse, recentResponse] = await Promise.allSettled([
        staffService.getAllInventory(),
        staffService.getInventorySummary(),
        staffService.getRecentInventoryAdditions()
      ]);

      // Handle inventory data
      if (inventoryResponse.status === 'fulfilled' && inventoryResponse.value && inventoryResponse.value.data) {
        setBloodInventory(inventoryResponse.value.data);
      } else {
        console.log('Using mock inventory data');
        setBloodInventory(mockBloodInventory);
      }

      // Handle summary data
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value && summaryResponse.value.data) {
        setInventorySummary(summaryResponse.value.data);
      } else {
        console.log('Using mock summary data');
        // Generate summary from mock data
        const summary = mockBloodInventory.map(item => ({
          bloodType: item.bloodType,
          unitsAvailable: item.quantity,
          status: item.status.toUpperCase()
        }));
        setInventorySummary(summary);
      }

      // Handle recent additions data
      if (recentResponse.status === 'fulfilled' && recentResponse.value && recentResponse.value.data) {
        setRecentAdditions(recentResponse.value.data);
      } else {
        console.log('Using mock recent additions data');
        const recentMock = [
          {
            id: 1,
            bloodType: 'O+',
            unitsAdded: 5,
            addedDate: new Date().toISOString(),
            donorName: 'Nguyễn Văn A',
            bagNumber: 'BG001240'
          },
          {
            id: 2,
            bloodType: 'A+',
            unitsAdded: 3,
            addedDate: new Date(Date.now() - 86400000).toISOString(),
            donorName: 'Trần Thị B',
            bagNumber: 'BG001241'
          }
        ];
        setRecentAdditions(recentMock);
      }

    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Không thể tải dữ liệu kho máu. Hiển thị dữ liệu mẫu.');
      setBloodInventory(mockBloodInventory);
      
      // Generate mock summary
      const summary = mockBloodInventory.map(item => ({
        bloodType: item.bloodType,
        unitsAvailable: item.quantity,
        status: item.status.toUpperCase()
      }));
      setInventorySummary(summary);
      
      // Set mock recent additions
      const recentMock = [
        {
          id: 1,
          bloodType: 'O+',
          unitsAdded: 5,
          addedDate: new Date().toISOString(),
          donorName: 'Nguyễn Văn A',
          bagNumber: 'BG001240'
        }
      ];
      setRecentAdditions(recentMock);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

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
    const matchesSearch = item.bloodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const totalUnits = bloodInventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const criticalItems = bloodInventory.filter(item => item.status === 'critical').length;
  const lowItems = bloodInventory.filter(item => item.status === 'low').length;
  const expiringItems = bloodInventory.filter(item => getDaysUntilExpiry(item.expiryDate) <= 3).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Quản lý kho máu"
        description="Theo dõi và quản lý tồn kho máu, kiểm soát chất lượng và hạn sử dụng"
        variant="inventory"
        showTime={true}
        showWeather={true}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{bloodInventory.length}</span> loại máu trong kho
          </div>
          {lowItems > 0 && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowItems} loại sắp hết</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchInventoryData}
            disabled={isLoading}
            className="bg-white/80 hover:bg-white/90 border border-green-200 hover:border-green-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Nhập kho</span>
          </button>
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

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'inventory', label: 'Kho máu', count: bloodInventory.length },
            { key: 'recent', label: 'Bổ sung gần đây', count: recentAdditions.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search - only show for inventory tab */}
      {activeTab === 'inventory' && (
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
      )}

      {/* Content based on active tab */}
      {activeTab === 'inventory' ? (
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
          )}

          {filteredInventory.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      ) : (
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
                      Nhóm máu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng bổ sung
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người hiến
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã túi máu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian bổ sung
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAdditions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                          {item.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">+{item.unitsAdded} đơn vị</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.donorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.bagNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.addedDate).toLocaleString('vi-VN')}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {recentAdditions.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bổ sung gần đây</h3>
              <p className="text-gray-500">
                Không có máu được bổ sung vào kho trong thời gian gần đây
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffInventoryManagement;
