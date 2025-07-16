// src/pages/admin/AdminDonationRequestsPage.jsx
import React from 'react';
import { Users } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
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
        { value: 'ALL', label: 'Tất cả trạng thái' },
        { value: DONATION_STATUS.PENDING_APPROVAL, label: 'Chờ duyệt' },
        { value: DONATION_STATUS.APPOINTMENT_PENDING, label: 'Chờ đặt lịch' },
        { value: DONATION_STATUS.REJECTED, label: 'Từ chối' },
        { value: DONATION_STATUS.APPOINTMENT_SCHEDULED, label: 'Đã lên lịch' },
    ];

    // Filters configuration for AdminFiltersPanel
    const filtersConfig = [
        {
            key: 'status',
            label: 'Trạng thái',
            value: filters.status,
            onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
            options: statusOptions,
        },
    ];

    // Check if filters are active
    const hasActiveFilters = filters.search || filters.status !== 'ALL';

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: 'ALL',
        });
    };

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
                <AdminFiltersPanel
                    searchValue={filters.search}
                    onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                    searchPlaceholder="Tên, email người hiến..."
                    filters={filtersConfig}
                    showViewMode={false}
                    totalCount={requests.length}
                    filteredCount={requests.length}
                    itemLabel="đơn yêu cầu hiến máu"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

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
