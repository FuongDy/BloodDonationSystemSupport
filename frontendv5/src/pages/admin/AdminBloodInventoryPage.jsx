// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Droplet,
} from 'lucide-react';
import toast from 'react-hot-toast';

import inventoryService from '../../services/inventoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const InventoryCard = ({ item }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'USED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isExpiringSoon = expiryDate => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Droplet className='w-8 h-8 text-red-500 mr-3' />
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              {item.bloodType?.name || 'N/A'}
            </h3>
            <p className='text-sm text-gray-500'>Đơn vị: {item.unitId}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
        >
          {item.status === 'AVAILABLE'
            ? 'Có sẵn'
            : item.status === 'EXPIRED'
              ? 'Hết hạn'
              : item.status === 'USED'
                ? 'Đã sử dụng'
                : item.status === 'RESERVED'
                  ? 'Đã đặt chỗ'
                  : item.status}
        </span>
      </div>

      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Ngày thu thập:</span>
          <span className='font-medium'>{formatDate(item.collectionDate)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Ngày hết hạn:</span>
          <span
            className={`font-medium ${isExpiringSoon(item.expiryDate) ? 'text-red-600' : ''}`}
          >
            {formatDate(item.expiryDate)}
            {isExpiringSoon(item.expiryDate) && (
              <span className='ml-1 text-xs'>(Sắp hết hạn)</span>
            )}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Dung tích:</span>
          <span className='font-medium'>{item.volume || 450}ml</span>
        </div>
        {item.location && (
          <div className='flex justify-between'>
            <span className='text-gray-600'>Vị trí:</span>
            <span className='font-medium'>{item.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ summary }) => {
  const getTrendIcon = trend => {
    if (trend > 0) return <TrendingUp className='w-5 h-5 text-green-500' />;
    if (trend < 0) return <TrendingDown className='w-5 h-5 text-red-500' />;
    return <Clock className='w-5 h-5 text-gray-500' />;
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {summary.bloodType?.name || 'N/A'}
        </h3>
        {getTrendIcon(summary.trend)}
      </div>

      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Tổng số đơn vị:</span>
          <span className='text-xl font-bold text-gray-900'>
            {summary.totalUnits}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Có sẵn:</span>
          <span className='text-lg font-semibold text-green-600'>
            {summary.availableUnits}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Sắp hết hạn:</span>
          <span className='text-lg font-semibold text-yellow-600'>
            {summary.expiringSoon || 0}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Đã hết hạn:</span>
          <span className='text-lg font-semibold text-red-600'>
            {summary.expiredUnits || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminBloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [recentAdditions, setRecentAdditions] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [inventoryData, summaryData, recentData] = await Promise.all([
        inventoryService.getAllInventory(),
        inventoryService.getInventorySummary(),
        inventoryService.getRecentAdditions(),
      ]);

      setInventory(inventoryData);
      setSummary(summaryData);
      setRecentAdditions(recentData);
    } catch (error) {
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

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý Kho Máu</h1>
          <p className='text-gray-600 mt-2'>Theo dõi và quản lý tồn kho máu</p>
        </div>
        <Button onClick={handleRefresh} variant='outline'>
          <RefreshCw className='w-4 h-4 mr-2' />
          Làm mới
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className='border-b border-gray-200 mb-8'>
        <nav className='-mb-px flex space-x-8'>
          {[
            { key: 'summary', label: 'Tổng quan', icon: TrendingUp },
            { key: 'inventory', label: 'Kho máu', icon: Droplet },
            { key: 'recent', label: 'Mới nhất', icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className='w-4 h-4 mr-2' />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Tóm tắt tồn kho theo nhóm máu
          </h2>
          {summary.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {summary.map((item, index) => (
                <SummaryCard key={index} summary={item} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500'>Không có dữ liệu tóm tắt</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Danh sách đơn vị máu
          </h2>
          {inventory.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {inventory.map((item, index) => (
                <InventoryCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500'>Không có đơn vị máu nào trong kho</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Đơn vị máu mới thêm gần đây
          </h2>
          {recentAdditions.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recentAdditions.map((item, index) => (
                <InventoryCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500'>
                Không có đơn vị máu mới nào gần đây
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBloodInventoryPage;
