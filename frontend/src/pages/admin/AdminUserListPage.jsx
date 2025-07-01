// src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import userService from '../../services/userService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { AdminTableActions, AdminTableFilters } from '../../components/admin/common';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();

  const fetchUsers = useCallback(async (page, size, currentSort, search) => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers({
        page,
        size,
        sort: currentSort,
        keyword: search,
      });
      setUsersPage(data);
    } catch (error) {
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
    fetchUsers(currentPage, pageSize, sort, searchTerm);
  }, [currentPage, pageSize, sort, searchTerm, fetchUsers]);

  const handleRefresh = () => {
    setCurrentPage(0);
    setSearchTerm('');
    setSort(['id', 'asc']);
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

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
      icon: RefreshCw,
      variant: 'secondary',
      onClick: handleRefresh,
      disabled: isLoading,
      className: isLoading ? 'animate-spin' : '',
    },
    ...(user?.role === 'Admin'
      ? [
          {
            label: 'Thêm người dùng',
            icon: PlusCircle,
            variant: 'primary',
            component: Link,
            to: '/admin/users/new',
            disabled: isLoading,
          },
        ]
      : []),
  ];

  return (
    <AdminPageLayout title='Quản lý Người dùng'>
      <div className='space-y-6'>
        {/* Actions and Filters */}
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
          <AdminTableFilters
            searchPlaceholder='Tìm kiếm theo ID, họ tên hoặc email...'
            onSearch={handleSearch}
            searchTerm={searchTerm}
          />
          <AdminTableActions actions={headerActions} isLoading={isLoading} />
        </div>

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
