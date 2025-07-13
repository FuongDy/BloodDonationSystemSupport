// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, TrendingUp, Droplet, Clock, Search, Filter, Eye, AlertTriangle, Warehouse, Package, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

import inventoryService from '../../services/inventoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TabNavigation from '../../components/common/TabNavigation';
import BloodUnitCard from '../../components/inventory/BloodUnitCard';
import InventorySummaryCard from '../../components/inventory/InventorySummaryCard';
import EmptyState from '../../components/common/EmptyState';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Select from '../../components/common/Select';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import { INVENTORY_STATUS, BLOOD_GROUPS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminBloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [recentAdditions, setRecentAdditions] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortField, setSortField] = useState('collectionDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Sử dụng admin endpoints vì đây là trang admin
      const [inventoryData, summaryData, recentData] = await Promise.all([
        inventoryService.getAllInventory(),
        inventoryService.getInventorySummary(),
        inventoryService.getRecentAdditions(),
      ]);

      setInventory(inventoryData);
      setSummary(summaryData);
      setRecentAdditions(recentData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Không thể tải dữ liệu kho máu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
    toast.success('Đã cập nhật dữ liệu!');
  };

  // Filter and search logic
  const filteredInventory = useMemo(() => {
    let filtered = [...inventory];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(unit => 
        unit.id.toLowerCase().includes(term) ||
        unit.donorName?.toLowerCase().includes(term) ||
        unit.bloodType?.bloodGroup?.toLowerCase().includes(term) ||
        unit.storageLocation?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(unit => unit.status === statusFilter);
    }

    // Blood group filter
    if (bloodGroupFilter !== 'ALL') {
      filtered = filtered.filter(unit => unit.bloodType?.bloodGroup === bloodGroupFilter);
    }

    return filtered;
  }, [inventory, searchTerm, statusFilter, bloodGroupFilter]);

  // Sort logic
  const sortedInventory = useMemo(() => {
    const sorted = [...filteredInventory];
    
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'bloodGroup':
          aValue = a.bloodType?.bloodGroup || '';
          bValue = b.bloodType?.bloodGroup || '';
          break;
        case 'donorName':
          aValue = a.donorName || '';
          bValue = b.donorName || '';
          break;
        case 'volumeMl':
          aValue = a.volumeMl || 0;
          bValue = b.volumeMl || 0;
          break;
        case 'collectionDate':
          aValue = new Date(a.collectionDate);
          bValue = new Date(b.collectionDate);
          break;
        case 'expiryDate':
          aValue = new Date(a.expiryDate);
          bValue = new Date(b.expiryDate);
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredInventory, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'unknown';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring';
    return 'valid';
  };

  const tabs = [
    {
      key: 'summary',
      label: 'Tổng quan',
      icon: TrendingUp,
      count: summary.length,
    },
    {
      key: 'inventory',
      label: 'Kho máu',
      icon: Droplet,
      count: inventory.length,
    },
    {
      key: 'recent',
      label: 'Mới nhất',
      icon: Clock,
      count: recentAdditions.length,
    },
  ];

  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: 'outline',
    },
  ];

  // Table columns for inventory
  const inventoryColumns = [
    {
      key: 'id',
      title: 'Mã đơn vị',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900">
          {value}
        </span>
      ),
    },
    {
      key: 'bloodGroup',
      title: 'Nhóm máu',
      sortable: true,
      render: (_, unit) => (
        <div className="flex items-center">
          <Droplet className="w-4 h-4 text-red-500 mr-2" />
          <span className="font-medium">{unit.bloodType?.bloodGroup || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'donorName',
      title: 'Người hiến',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'volumeMl',
      title: 'Thể tích',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">{value || 'N/A'} ml</span>
      ),
    },
    {
      key: 'collectionDate',
      title: 'Ngày thu thập',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">{formatDateTime(value, 'date')}</span>
      ),
    },
    {
      key: 'expiryDate',
      title: 'Ngày hết hạn',
      sortable: true,
      render: (value, unit) => {
        const status = getExpiryStatus(value);
        return (
          <div className="flex items-center">
            <span className="text-gray-900">{formatDateTime(value, 'date')}</span>
            {status === 'expiring' && (
              <AlertTriangle className="w-4 h-4 text-orange-500 ml-2" />
            )}
            {status === 'expired' && (
              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value} type="inventory" />
      ),
    },
    {
      key: 'actions',
      title: 'Hành động',
      sortable: false,
      render: (_, unit) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // TODO: Implement view details modal
            console.log('View unit details:', unit.id);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          Chi tiết
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </AdminPageLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              Tóm tắt tồn kho theo nhóm máu
            </h2>
            {summary.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {summary.map((item, index) => (
                  <InventorySummaryCard key={index} summary={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                type='results'
                title='Không có dữ liệu tóm tắt'
                description='Chưa có dữ liệu tóm tắt tồn kho để hiển thị.'
              />
            )}
          </div>
        );
      case 'inventory':
        return (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Danh sách đơn vị máu ({filteredInventory.length})
              </h2>
              <div className='flex items-center space-x-2'>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('cards')}
                >
                  <Droplet className='w-4 h-4 mr-1' />
                  Thẻ
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('table')}
                >
                  <Filter className='w-4 h-4 mr-1' />
                  Bảng
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className='bg-white rounded-lg shadow-sm border p-4 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <InputField
                    type='text'
                    placeholder='Tìm kiếm theo mã, tên người hiến...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  options={[
                    { value: 'ALL', label: 'Tất cả trạng thái' },
                    { value: INVENTORY_STATUS.AVAILABLE, label: 'Có sẵn' },
                    { value: INVENTORY_STATUS.RESERVED, label: 'Đã đặt chỗ' },
                    { value: INVENTORY_STATUS.USED, label: 'Đã sử dụng' },
                    { value: INVENTORY_STATUS.EXPIRED, label: 'Hết hạn' },
                    { value: INVENTORY_STATUS.DISPOSED, label: 'Đã tiêu hủy' },
                  ]}
                />

                <Select
                  value={bloodGroupFilter}
                  onChange={(value) => setBloodGroupFilter(value)}
                  options={[
                    { value: 'ALL', label: 'Tất cả nhóm máu' },
                    ...BLOOD_GROUPS.map(group => ({ value: group, label: group })),
                  ]}
                />

                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                    setBloodGroupFilter('ALL');
                  }}
                  className='w-full'
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'cards' ? (
              filteredInventory.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {sortedInventory.map(unit => (
                    <BloodUnitCard key={unit.id} unit={unit} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  type='results'
                  title='Không có đơn vị máu nào'
                  description='Không có đơn vị máu nào phù hợp với bộ lọc hiện tại.'
                />
              )
            ) : (
              <DataTable
                data={sortedInventory}
                columns={inventoryColumns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                emptyState={
                  <EmptyState
                    type='results'
                    title='Không có đơn vị máu nào'
                    description='Không có đơn vị máu nào phù hợp với bộ lọc hiện tại.'
                  />
                }
              />
            )}
          </div>
        );

      case 'recent':
        return (
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              Đơn vị máu mới thêm gần đây ({recentAdditions.length})
            </h2>
            {recentAdditions.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {recentAdditions.map(unit => (
                  <BloodUnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <EmptyState
                type='results'
                title='Không có đơn vị máu mới'
                description='Không có đơn vị máu mới nào được thêm gần đây.'
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Kho máu"
        description="Theo dõi và quản lý toàn bộ tồn kho máu, bao gồm thông tin về số lượng, thời hạn sử dụng và trạng thái."
        variant="inventory"
        showActivityFeed={false}
        stats={[
          {
            icon: <Warehouse className="w-5 h-5 text-emerald-300" />,
            value: inventory?.length || 0,
            label: "Tổng đơn vị"
          },
          {
            icon: <Package className="w-5 h-5 text-green-300" />,
            value: inventory?.filter(unit => unit.status === 'AVAILABLE')?.length || 0,
            label: "Sẵn sàng sử dụng"
          },
          {
            icon: <Clock className="w-5 h-5 text-yellow-300" />,
            value: inventory?.filter(unit => getExpiryStatus(unit.expiryDate) === 'expiring')?.length || 0,
            label: "Sắp hết hạn"
          },
          {
            icon: <TrendingDown className="w-5 h-5 text-red-300" />,
            value: inventory?.filter(unit => getExpiryStatus(unit.expiryDate) === 'expired')?.length || 0,
            label: "Đã hết hạn"
          }
        ]}
      />

      <div className="space-y-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className='mb-8'
        />

        {renderTabContent()}
      </div>
    </AdminPageLayout>
  );
};

export default AdminBloodInventoryPage;
