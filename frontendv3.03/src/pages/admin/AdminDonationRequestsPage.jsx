// src/pages/admin/AdminDonationRequestsPage.jsx
import React from 'react';
import { Users, Filter, Search } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { useDonationRequests } from '../../hooks/useDonationRequests';
import { DONATION_STATUS, STATUS_COLORS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminDonationRequestsPage = () => {
    const {
        requests,
        isLoading,
        filters,
        setFilters,
        handleApprove,
        handleReject,
        fetchRequests,
    } = useDonationRequests();

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
            render: value => {
                return (
                    <div>
                        <div className='font-medium'>{value?.fullName || 'N/A'}</div>
                        <div className='text-sm text-gray-500'>{value?.email}</div>
                        <div className='text-sm text-red-600 font-semibold'>
                            {value?.bloodType ||
                                value?.bloodTypeDescription ||
                                'N/A'}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'status',
            title: 'Trạng thái',
            dataIndex: 'status',
            render: value => <StatusBadge status={value} type="donation" variant={STATUS_COLORS[value] || 'default'} />,
        },
        {
            key: 'createdAt',
            title: 'Ngày đăng ký',
            render: value => formatDateTime(value),
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
            key: 'actions',
            title: 'Hành động',
            render: (_, request) => (
                <div className='flex space-x-2'>
                    {request.status === DONATION_STATUS.PENDING_APPROVAL && (
                        <>
                            <Button
                                size='sm'
                                variant='success'
                                onClick={() => handleApprove(request.id)}
                            >
                                Duyệt
                            </Button>
                            <Button
                                size='sm'
                                variant='danger'
                                onClick={() => handleReject(request.id)}
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const statusOptions = [
        { value: DONATION_STATUS.PENDING_APPROVAL, label: 'Chờ duyệt' },
        { value: DONATION_STATUS.APPOINTMENT_PENDING, label: 'Chờ đặt lịch' },
        { value: DONATION_STATUS.REJECTED, label: 'Từ chối' },
        { value: DONATION_STATUS.APPOINTMENT_SCHEDULED, label: 'Đã lên lịch' },
        { value: DONATION_STATUS.HEALTH_CHECK_PASSED, label: 'Khám đạt' },
        { value: DONATION_STATUS.HEALTH_CHECK_FAILED, label: 'Khám không đạt' },
        { value: DONATION_STATUS.BLOOD_COLLECTED, label: 'Đã lấy máu' },
        { value: DONATION_STATUS.TESTING_PASSED, label: 'Xét nghiệm đạt' },
        { value: DONATION_STATUS.TESTING_FAILED, label: 'Xét nghiệm không đạt' },
        { value: DONATION_STATUS.COMPLETED, label: 'Hoàn thành' },
        { value: DONATION_STATUS.CANCELLED, label: 'Đã hủy' },
    ];

    const headerActions = [
        {
            label: 'Làm mới',
            icon: Users,
            variant: 'outline',
            onClick: fetchRequests,
        },
    ];

    return (
        <AdminPageLayout
            title='Quản lý đơn yêu cầu hiến máu'
            description='Duyệt và quản lý các đơn đăng ký hiến máu từ người dùng'
            headerActions={headerActions}
        >
            <div className='p-6'>
                {/* Filters */}
                <div className='bg-white rounded-lg shadow p-4 mb-6'>
                    <h3 className='text-lg font-semibold mb-4 flex items-center'>
                        <Filter className='w-5 h-5 mr-2' />
                        Bộ lọc
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <InputField
                            label='Tìm kiếm'
                            placeholder='Tên, email người hiến...'
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            icon={Search}
                        />
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Trạng thái
                            </label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <AdminContentWrapper
                    isLoading={isLoading}
                    hasData={requests.length > 0}
                    loadingMessage='Đang tải danh sách đơn yêu cầu...'
                    emptyMessage='Chưa có đơn yêu cầu hiến máu nào'
                >
                    <div className='bg-white rounded-lg shadow'>
                        <DataTable
                            data={requests}
                            columns={columns}
                            loading={isLoading}
                        />
                    </div>
                </AdminContentWrapper>
            </div>
        </AdminPageLayout>
    );
};

export default AdminDonationRequestsPage;
