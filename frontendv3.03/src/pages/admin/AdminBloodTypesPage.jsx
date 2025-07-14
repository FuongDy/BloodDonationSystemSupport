// src/pages/admin/AdminBloodTypesPage.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, RefreshCw, Droplets, Users, Heart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { AdminTableActions, AdminTableFilters } from '../../components/admin/common';

const AdminBloodTypesPage = () => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for blood types
  const mockBloodTypes = [
    { id: 1, type: 'A+', donorsCount: 1245, recipientsCount: 987, compatibility: ['A+', 'AB+'], stockLevel: 85, status: 'active' },
    { id: 2, type: 'A-', donorsCount: 342, recipientsCount: 278, compatibility: ['A+', 'A-', 'AB+', 'AB-'], stockLevel: 72, status: 'active' },
    { id: 3, type: 'B+', donorsCount: 1087, recipientsCount: 856, compatibility: ['B+', 'AB+'], stockLevel: 91, status: 'active' },
    { id: 4, type: 'B-', donorsCount: 289, recipientsCount: 234, compatibility: ['B+', 'B-', 'AB+', 'AB-'], stockLevel: 68, status: 'active' },
    { id: 5, type: 'AB+', donorsCount: 156, recipientsCount: 445, compatibility: ['AB+'], stockLevel: 45, status: 'low' },
    { id: 6, type: 'AB-', donorsCount: 67, recipientsCount: 89, compatibility: ['AB+', 'AB-'], stockLevel: 23, status: 'critical' },
    { id: 7, type: 'O+', donorsCount: 2134, recipientsCount: 1789, compatibility: ['A+', 'B+', 'AB+', 'O+'], stockLevel: 95, status: 'active' },
    { id: 8, type: 'O-', donorsCount: 456, recipientsCount: 1567, compatibility: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], stockLevel: 38, status: 'low' },
  ];

  const fetchBloodTypes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setBloodTypes(mockBloodTypes);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodTypes();
  }, []);

  const handleRefresh = () => {
    setSearchTerm('');
    fetchBloodTypes();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredBloodTypes = bloodTypes.filter(bloodType =>
    bloodType.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalDonors = bloodTypes.reduce((sum, bt) => sum + bt.donorsCount, 0);
  const totalRecipients = bloodTypes.reduce((sum, bt) => sum + bt.recipientsCount, 0);
  const averageStock = bloodTypes.length > 0 ? Math.round(bloodTypes.reduce((sum, bt) => sum + bt.stockLevel, 0) / bloodTypes.length) : 0;
  const criticalTypes = bloodTypes.filter(bt => bt.status === 'critical').length;

  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      variant: 'secondary',
      onClick: handleRefresh,
      disabled: isLoading,
      className: isLoading ? 'animate-spin' : '',
    },
    {
      label: 'Thêm loại máu',
      icon: PlusCircle,
      variant: 'primary',
      onClick: () => toast.success('Tính năng thêm loại máu sẽ được phát triển'),
      disabled: isLoading,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Loại máu"
        description="Theo dõi và quản lý các nhóm máu trong hệ thống, bao gồm thông tin người hiến, người nhận và mức tồn kho."
        variant="blood-types"
        showActivityFeed={false}
        stats={[
          {
            icon: <Droplets className="w-5 h-5 text-red-300" />,
            value: bloodTypes.length,
            label: "Nhóm máu"
          },
          {
            icon: <Users className="w-5 h-5 text-blue-300" />,
            value: totalDonors.toLocaleString(),
            label: "Tổng người hiến"
          },
          {
            icon: <Heart className="w-5 h-5 text-pink-300" />,
            value: totalRecipients.toLocaleString(),
            label: "Tổng người nhận"
          },
          {
            icon: <Activity className="w-5 h-5 text-orange-300" />,
            value: `${averageStock}%`,
            label: "Mức tồn kho TB"
          }
        ]}
      />

      <div className='space-y-6'>
        {/* Actions and Filters */}
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
          <AdminTableFilters
            searchPlaceholder='Tìm kiếm theo nhóm máu...'
            onSearch={handleSearch}
            searchTerm={searchTerm}
          />
          <AdminTableActions actions={headerActions} isLoading={isLoading} />
        </div>

        {/* Table Content */}
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={filteredBloodTypes?.length > 0}
          loadingMessage='Đang tải danh sách nhóm máu...'
          emptyMessage='Không có nhóm máu nào phù hợp.'
        >
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhóm máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người hiến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mức tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tương thích
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBloodTypes.map((bloodType) => (
                  <tr key={bloodType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-bold text-gray-900">{bloodType.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bloodType.donorsCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bloodType.recipientsCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-3">
                          <div 
                            className={`h-2.5 rounded-full ${
                              bloodType.stockLevel > 70 ? 'bg-green-500' :
                              bloodType.stockLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${bloodType.stockLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{bloodType.stockLevel}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {bloodType.compatibility.slice(0, 3).map((comp, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {comp}
                          </span>
                        ))}
                        {bloodType.compatibility.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{bloodType.compatibility.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bloodType.status)}`}>
                        {bloodType.status === 'critical' ? 'Nguy hiểm' :
                         bloodType.status === 'low' ? 'Thấp' : 'Bình thường'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminContentWrapper>
      </div>
    </AdminPageLayout>
  );
};

export default AdminBloodTypesPage;
