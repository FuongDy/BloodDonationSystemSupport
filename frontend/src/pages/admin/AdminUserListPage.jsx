// src/pages/admin/AdminUserListPage.jsx
import { PlusCircle, Shield, UserCheck, Users, UserX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import { AdminTableActions } from '../../components/admin/common';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import DashboardHeader from '../../components/admin/DashboardHeader';
import UserManagementTable from '../../components/admin/UserManagementTable';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';

const AdminUserListPage = () => {
  const [usersPage, setUsersPage] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [sort, setSort] = useState(['id', 'asc']);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { user } = useAuth();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Debounced search term:', searchTerm);
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async (page, size, currentSort, search) => {
    setIsLoading(true);
    try {
      console.log('Fetching users with params:', { page, size, currentSort, search });
      
      // Convert sort array to string format expected by backend
      const sortString = Array.isArray(currentSort) 
        ? `${currentSort[0]},${currentSort[1]}` 
        : currentSort;
      
      // If no search term, just fetch normally with pagination
      if (!search || !search.trim()) {
        const params = {
          page,
          size,
          sort: sortString,
        };
        
        console.log('API params (no search):', params);
        const data = await userService.getAllUsers(params);
        console.log('API response:', data);
        setUsersPage(data);
        return;
      }
      
      // If search term exists, get all users and filter client-side
      // This is a fallback if backend doesn't support search
      const params = {
        page: 0,
        size: 1000, // Get a large number to get all users for filtering
        sort: sortString,
      };
      
      console.log('API params (for search):', params);
      const data = await userService.getAllUsers(params);
      console.log('API response (for search):', data);
      
      // Client-side filter
      const searchTerm = search.toLowerCase().trim();
      const filteredUsers = (data.content || []).filter(user => {
        return (
          user.id?.toString().toLowerCase().includes(searchTerm) ||
          user.firstName?.toLowerCase().includes(searchTerm) ||
          user.lastName?.toLowerCase().includes(searchTerm) ||
          user.fullName?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm) ||
          user.phoneNumber?.toLowerCase().includes(searchTerm) ||
          user.phone?.toLowerCase().includes(searchTerm) ||
          `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm)
        );
      });
      
      // Apply pagination to filtered results
      const totalElements = filteredUsers.length;
      const totalPages = Math.ceil(totalElements / size);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Update users page with filtered and paginated results
      setUsersPage({
        content: paginatedUsers,
        totalPages,
        totalElements,
      });
      
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
      setUsersPage({
        content: [],
        totalPages: 0,
        totalElements: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize, sort, debouncedSearchTerm);
  }, [currentPage, pageSize, sort, debouncedSearchTerm, fetchUsers]);

  const handleRefresh = () => {
    setCurrentPage(0);
    setSearchTerm('');
    setSort(['id', 'asc']);
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleSearch = term => {
    console.log('Search term received:', term);
    setSearchTerm(term);
    setCurrentPage(0);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSort(['id', 'asc']);
    setCurrentPage(0);
  };

  // Check if filters are active
  const hasActiveFilters = debouncedSearchTerm || (sort[0] !== 'id' || sort[1] !== 'asc');

  const handleSort = field => {
    const newDirection =
      sort[0] === field && sort[1] === 'asc' ? 'desc' : 'asc';
    setSort([field, newDirection]);
    setCurrentPage(0);
  };

  // Header actions configuration
  const headerActions = [
      {
            label: 'Làm mới',
            icon: Users,
            variant: 'outline',
            onClick: handleRefresh,
        },
    ...(user?.role === 'Admin'
      ? [
          {
            label: 'Thêm người dùng',
            icon: PlusCircle,
            variant: 'primary',
            to: '/admin/users/new',
            disabled: isLoading,
          },
        ]
      : []),
  ];

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Người dùng"
        description="Quản lý toàn bộ người dùng trong hệ thống HiBlood, bao gồm người hiến máu, người cần máu và nhân viên."
        variant="users"
        showActivityFeed={false}
        stats={[
          {
            icon: <Users className="w-5 h-5 text-blue-300" />,
            value: usersPage?.totalElements || 0,
            label: "Tổng người dùng"
          },
          {
            icon: <UserCheck className="w-5 h-5 text-green-300" />,
            value: usersPage?.content?.filter(user => user.active)?.length || 0,
            label: "Đang hoạt động"
          },
          {
            icon: <UserX className="w-5 h-5 text-red-300" />,
            value: usersPage?.content?.filter(user => !user.active)?.length || 0,
            label: "Không hoạt động"
          },
          {
            icon: <Shield className="w-5 h-5 text-purple-300" />,
            value: usersPage?.content?.filter(user => user.role === 'Admin' || user.role === 'Staff')?.length || 0,
            label: "Quản trị viên"
          }
        ]}
      />

      <div className='space-y-6'>
        {/* Header Actions */}
        <div className='flex items-center justify-between'>
          <div className="text-lg font-medium text-gray-700">
            Danh sách người dùng
          </div>
          <AdminTableActions actions={headerActions} isLoading={isLoading} />
        </div>

        {/* Filters */}
        <AdminFiltersPanel
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          searchPlaceholder="Tìm kiếm theo ID, họ tên hoặc email..."
          filters={[]}
          showViewMode={false}
          totalCount={usersPage?.totalElements || 0}
          filteredCount={usersPage?.totalElements || 0}
          itemLabel="người dùng"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Table Content */}
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={usersPage?.content?.length > 0}
          loadingMessage='Đang tải danh sách người dùng...'
          emptyMessage='Không có người dùng nào phù hợp.'
          showPagination={true}
          currentPage={currentPage}
          totalPages={usersPage?.totalPages || 0}
          totalElements={usersPage?.totalElements || 0}
          onPageChange={handlePageChange}
          paginationLoading={isLoading}
        >
          <UserManagementTable
            users={usersPage?.content || []}
            onRefresh={handleRefresh}
            onSort={handleSort}
            currentSortField={sort[0]}
            currentSortDirection={sort[1]}
          />
        </AdminContentWrapper>
      </div>
    </AdminPageLayout>
  );
};

export default AdminUserListPage;
