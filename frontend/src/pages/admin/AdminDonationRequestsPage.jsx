import { Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import DonationTypeBadge from '../../components/common/DonationTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
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
            key: 'donationType',
            title: 'Loại đơn',
            render: value => <DonationTypeBadge donationType={value} size="small" />,
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
        { value: DONATION_STATUS.APPOINTMENT_PENDING, label: 'Chờ lịch hẹn' },
        { value: DONATION_STATUS.REJECTED, label: 'Từ chối' },
        // { value: DONATION_STATUS.APPOINTMENT_SCHEDULED, label: 'Đã lên lịch' },
        // { value: DONATION_STATUS.HEALTH_CHECK_PASSED, label: 'Khám đạt' },
        // { value: DONATION_STATUS.HEALTH_CHECK_FAILED, label: 'Khám không đạt' },
        // { value: DONATION_STATUS.BLOOD_COLLECTED, label: 'Đã lấy máu' },
        // { value: DONATION_STATUS.TESTING_PASSED, label: 'Xét nghiệm đạt' },
        // { value: DONATION_STATUS.TESTING_FAILED, label: 'Xét nghiệm không đạt' },
        // { value: DONATION_STATUS.COMPLETED, label: 'Hoàn thành' },
        // { value: DONATION_STATUS.CANCELLED, label: 'Đã hủy' },
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

    // Pagination state (admin style: 10/page, always visible)
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const totalPages = Math.ceil(requests.length / pageSize) || 1;
    const paginatedRequests = useMemo(() => {
        const startIdx = currentPage * pageSize;
        return requests.slice(startIdx, startIdx + pageSize);
    }, [requests, currentPage, pageSize]);

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
                            data={paginatedRequests}
                            columns={columns}
                            loading={isLoading}
                        />
                    </div>
                    {/* Pagination (admin style, always visible) */}
                    <div className="flex justify-end mt-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                Trang {currentPage + 1} / {totalPages}
                            </span>
                            <button
                                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                Trước
                            </button>
                            <button
                                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </AdminContentWrapper>
            </div>
        </AdminPageLayout>
    );
};

export default AdminDonationRequestsPage;
