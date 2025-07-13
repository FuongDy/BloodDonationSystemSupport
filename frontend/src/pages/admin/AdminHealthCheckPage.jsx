// src/pages/admin/AdminHealthCheckPage.jsx
import React from 'react';
import { Activity, Stethoscope, Users } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import HealthCheckForm from '../../components/admin/HealthCheckForm';
import { useHealthChecks } from '../../hooks/useHealthChecks';
import { DONATION_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminHealthCheckPage = () => {
  const {
    healthChecks,
    isLoading,
    selectedProcess,
    showHealthCheckModal,
    setShowHealthCheckModal,
    setSelectedProcess,
    fetchHealthChecks,
  } = useHealthChecks();

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
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: value => <StatusBadge status={value} type="donation" />,
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
          {process.status === DONATION_STATUS.APPOINTMENT_SCHEDULED && (
            <Button
              size='sm'
              variant='info'
              onClick={() => {
                setSelectedProcess(process);
                setShowHealthCheckModal(true);
              }}
            >
              <Activity className='w-4 h-4 mr-1' />
              Khám sàng lọc
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
      onClick: fetchHealthChecks,
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý đơn khám sức khỏe'
      description='Thực hiện khám sức khỏe cho người hiến máu'
      headerActions={headerActions}
    >
      <div className='p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Stethoscope className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Chờ khám</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {healthChecks.filter(hc => hc.status === DONATION_STATUS.APPOINTMENT_SCHEDULED).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Activity className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Đạt yêu cầu</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {healthChecks.filter(hc => hc.status === DONATION_STATUS.HEALTH_CHECK_PASSED).length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <Activity className='w-6 h-6 text-red-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Không đạt</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {healthChecks.filter(hc => hc.status === DONATION_STATUS.HEALTH_CHECK_FAILED).length}
                </p>
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
                <p className='text-2xl font-bold text-gray-900'>{healthChecks.length}</p>
              </div>
            </div>
          </div>
        </div>

        <AdminContentWrapper
          isLoading={isLoading}
          hasData={healthChecks.length > 0}
          loadingMessage='Đang tải danh sách khám sức khỏe...'
          emptyMessage='Chưa có đơn khám sức khỏe nào'
        >
          <div className='bg-white rounded-lg shadow'>
            <DataTable 
              data={healthChecks} 
              columns={columns} 
              loading={isLoading} 
            />
          </div>
        </AdminContentWrapper>

        {/* Health Check Modal */}
        {showHealthCheckModal && (
          <HealthCheckForm
            processId={selectedProcess?.id}
            isOpen={showHealthCheckModal}
            onClose={() => {
              setShowHealthCheckModal(false);
              setSelectedProcess(null);
            }}
            onSuccess={() => {
              setShowHealthCheckModal(false);
              setSelectedProcess(null);
              fetchHealthChecks();
            }}
          />
        )}
      </div>
    </AdminPageLayout>
  );
};

export default AdminHealthCheckPage;
