// src/pages/admin/AdminBloodCollectionPage.jsx
import React from 'react';
import { Heart, Droplets, Users, Award } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import BloodCollectionForm from '../../components/admin/BloodCollectionForm';
import { useBloodCollection } from '../../hooks/useBloodCollection';
import { DONATION_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminBloodCollectionPage = () => {
  const {
    collections,
    isLoading,
    selectedProcess,
    showCollectionModal,
    setShowCollectionModal,
    setSelectedProcess,
    fetchCollections,
  } = useBloodCollection();

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: value => `#${value}`,
    },
    {
      key: 'donor',
      title: 'Người hiến',
      render: value => (
        <div>
          <div className='font-medium'>{value?.fullName || 'N/A'}</div>
          <div className='text-sm text-gray-500'>{value?.email}</div>
          <div className='text-sm text-red-600 font-semibold'>
            {value?.bloodType || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'appointment',
      title: 'Lịch hẹn',
      render: value => (
        <div>
          {value ? (
            <>
              <div className='text-sm font-medium'>
                {formatDateTime(value.scheduledDate)}
              </div>
              <div className='text-sm text-gray-500'>{value.location}</div>
            </>
          ) : (
            <span className='text-gray-400'>Chưa có lịch hẹn</span>
          )}
        </div>
      ),
    },
    {
      key: 'collectedVolumeMl',
      title: 'Thể tích (ml)',
      render: value => (
        <div className='flex items-center'>
          <Droplets className='w-4 h-4 text-red-500 mr-1' />
          <span className='font-semibold'>
            {value ? `${value} ml` : 'Chưa thu thập'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: value => <StatusBadge status={value} />,
    },
    {
      key: 'updatedAt',
      title: 'Cập nhật',
      render: value => formatDateTime(value),
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, process) => (
        <div className='flex space-x-2'>
          {process.status === DONATION_STATUS.HEALTH_CHECK_PASSED && (
            <Button
              size='sm'
              variant='success'
              onClick={() => {
                setSelectedProcess(process);
                setShowCollectionModal(true);
              }}
            >
              <Heart className='w-4 h-4 mr-1' />
              Lấy máu
            </Button>
          )}
        </div>
      ),
    },
  ];

  const headerActions = [
    {
      label: 'Làm mới',
      icon: Users,
      variant: 'outline',
      onClick: fetchCollections,
    },
  ];

  // Calculate total volume collected
  const totalVolume = collections.reduce((sum, collection) => {
    return sum + (collection.collectedVolumeMl || 0);
  }, 0);

  const completedCollections = collections.filter(
    c => c.status === DONATION_STATUS.BLOOD_COLLECTED
  ).length;

  return (
    <AdminPageLayout
      title='Quản lý thu thập máu'
      description='Thực hiện và quản lý quá trình thu thập máu từ người hiến'
      headerActions={headerActions}
    >
      <div className='p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Heart className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Sẵn sàng lấy máu</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {collections.filter(c => c.status === DONATION_STATUS.HEALTH_CHECK_PASSED).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Droplets className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Đã thu thập</p>
                <p className='text-2xl font-bold text-gray-900'>{completedCollections}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <Award className='w-6 h-6 text-red-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Tổng thể tích</p>
                <p className='text-2xl font-bold text-gray-900'>{totalVolume} ml</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-gray-100 rounded-lg'>
                <Users className='w-6 h-6 text-gray-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Tổng số</p>
                <p className='text-2xl font-bold text-gray-900'>{collections.length}</p>
              </div>
            </div>
          </div>
        </div>

        <AdminContentWrapper
          isLoading={isLoading}
          hasData={collections.length > 0}
          loadingMessage='Đang tải danh sách thu thập máu...'
          emptyMessage='Chưa có quy trình thu thập máu nào'
        >
          <div className='bg-white rounded-lg shadow'>
            <DataTable 
              data={collections} 
              columns={columns} 
              loading={isLoading} 
            />
          </div>
        </AdminContentWrapper>

        {/* Blood Collection Modal */}
        {showCollectionModal && (
          <BloodCollectionForm
            processId={selectedProcess?.id}
            isOpen={showCollectionModal}
            onClose={() => {
              setShowCollectionModal(false);
              setSelectedProcess(null);
            }}
            onSuccess={() => {
              setShowCollectionModal(false);
              setSelectedProcess(null);
              fetchCollections();
            }}
          />
        )}
      </div>
    </AdminPageLayout>
  );
};

export default AdminBloodCollectionPage;
