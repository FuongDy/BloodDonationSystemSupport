// src/pages/admin/AdminTestResultsPage.jsx
import React from 'react';
import { TestTube, CheckCircle, XCircle, Users, FlaskConical } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import TestResultForm from '../../components/admin/TestResultForm';
import { useTestResults } from '../../hooks/useTestResults';
import { DONATION_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminTestResultsPage = () => {
  const {
    testResults,
    isLoading,
    selectedProcess,
    showTestResultModal,
    setShowTestResultModal,
    setSelectedProcess,
    fetchTestResults,
  } = useTestResults();

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
      key: 'collectedVolumeMl',
      title: 'Thể tích thu thập',
      render: value => (
        <div className='flex items-center'>
          <FlaskConical className='w-4 h-4 text-blue-500 mr-1' />
          <span className='font-semibold'>
            {value ? `${value} ml` : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: value => (
        <div className='flex items-center space-x-2'>
          <StatusBadge status={value} />
          {value === DONATION_STATUS.COMPLETED && (
            <CheckCircle className='w-4 h-4 text-green-500' />
          )}
          {value === DONATION_STATUS.TESTING_FAILED && (
            <XCircle className='w-4 h-4 text-red-500' />
          )}
        </div>
      ),
    },
    {
      key: 'note',
      title: 'Ghi chú',
      render: value => (
        <div className='max-w-xs'>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {value || 'Không có ghi chú'}
          </p>
        </div>
      ),
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
          {process.status === DONATION_STATUS.BLOOD_COLLECTED && (
            <Button
              size='sm'
              variant='warning'
              onClick={() => {
                setSelectedProcess(process);
                setShowTestResultModal(true);
              }}
            >
              <TestTube className='w-4 h-4 mr-1' />
              Kết quả XN
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
      onClick: fetchTestResults,
    },
  ];

  // Calculate stats
  const pendingTests = testResults.filter(
    t => t.status === DONATION_STATUS.BLOOD_COLLECTED
  ).length;
  
  const passedTests = testResults.filter(
    t => t.status === DONATION_STATUS.COMPLETED
  ).length;
  
  const failedTests = testResults.filter(
    t => t.status === DONATION_STATUS.TESTING_FAILED
  ).length;

  return (
    <AdminPageLayout
      title='Quản lý kết quả xét nghiệm'
      description='Ghi nhận và quản lý kết quả xét nghiệm máu từ phòng lab'
      headerActions={headerActions}
    >
      <div className='p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <TestTube className='w-6 h-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Chờ xét nghiệm</p>
                <p className='text-2xl font-bold text-gray-900'>{pendingTests}</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Đạt yêu cầu</p>
                <p className='text-2xl font-bold text-gray-900'>{passedTests}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Không đạt</p>
                <p className='text-2xl font-bold text-gray-900'>{failedTests}</p>
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
                <p className='text-2xl font-bold text-gray-900'>{testResults.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        {(passedTests + failedTests) > 0 && (
          <div className='bg-white rounded-lg shadow p-4 mb-6'>
            <h3 className='text-lg font-semibold mb-2'>Tỷ lệ thành công</h3>
            <div className='flex items-center'>
              <div className='flex-1 bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-green-500 h-3 rounded-full transition-all duration-300'
                  style={{
                    width: `${(passedTests / (passedTests + failedTests)) * 100}%`
                  }}
                ></div>
              </div>
              <span className='ml-3 text-sm font-medium'>
                {Math.round((passedTests / (passedTests + failedTests)) * 100)}%
              </span>
            </div>
          </div>
        )}

        <AdminContentWrapper
          isLoading={isLoading}
          hasData={testResults.length > 0}
          loadingMessage='Đang tải danh sách kết quả xét nghiệm...'
          emptyMessage='Chưa có kết quả xét nghiệm nào'
        >
          <div className='bg-white rounded-lg shadow'>
            <DataTable 
              data={testResults} 
              columns={columns} 
              loading={isLoading} 
            />
          </div>
        </AdminContentWrapper>

        {/* Test Result Modal */}
        {showTestResultModal && (
          <TestResultForm
            processId={selectedProcess?.id}
            isOpen={showTestResultModal}
            onClose={() => {
              setShowTestResultModal(false);
              setSelectedProcess(null);
            }}
            onSuccess={() => {
              setShowTestResultModal(false);
              setSelectedProcess(null);
              fetchTestResults();
            }}
          />
        )}
      </div>
    </AdminPageLayout>
  );
};

export default AdminTestResultsPage;
