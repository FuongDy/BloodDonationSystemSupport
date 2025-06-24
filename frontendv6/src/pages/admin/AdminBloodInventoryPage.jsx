// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  TrendingUp,
  Droplet,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

import inventoryService from '../../services/inventoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import TabNavigation from '../../components/common/TabNavigation';
import InventoryCard from '../../components/inventory/InventoryCard';
import BloodUnitCard from '../../components/inventory/BloodUnitCard';
import InventorySummaryCard from '../../components/inventory/InventorySummaryCard';
import EmptyState from '../../components/common/EmptyState';

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

  const tabs = [
    { 
      key: 'summary', 
      label: 'Tổng quan', 
      icon: TrendingUp,
      count: summary.length
    },
    { 
      key: 'inventory', 
      label: 'Kho máu', 
      icon: Droplet,
      count: inventory.length
    },
    { 
      key: 'recent', 
      label: 'Mới nhất', 
      icon: Clock,
      count: recentAdditions.length
    },
  ];

  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: 'outline'
    }
  ];

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </div>
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
                type="results"
                title="Không có dữ liệu tóm tắt"
                description="Chưa có dữ liệu tóm tắt tồn kho để hiển thị."
              />
            )}
          </div>
        );      case 'inventory':
        return (
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              Danh sách đơn vị máu
            </h2>
            {inventory.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {inventory.map((unit) => (
                  <BloodUnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <EmptyState
                type="results"
                title="Không có đơn vị máu nào"
                description="Không có đơn vị máu nào trong kho hiện tại."
              />
            )}
          </div>
        );

      case 'recent':
        return (
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              Đơn vị máu mới thêm gần đây
            </h2>            {recentAdditions.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {recentAdditions.map((unit) => (
                  <BloodUnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <EmptyState
                type="results"
                title="Không có đơn vị máu mới"
                description="Không có đơn vị máu mới nào được thêm gần đây."
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='p-6'>
      <PageHeader
        title="Quản lý Kho Máu"
        description="Theo dõi và quản lý tồn kho máu"
        actions={headerActions}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {renderTabContent()}
    </div>
  );
};

export default AdminBloodInventoryPage;


