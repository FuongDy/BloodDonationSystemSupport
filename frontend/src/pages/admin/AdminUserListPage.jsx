// src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, Users, UserCheck, UserX, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import userService from '../../services/userService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { AdminTableActions, AdminTableFilters } from '../../components/admin/common';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/admin/DashboardHeader';

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
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Người dùng"
        description="Quản lý toàn bộ người dùng trong hệ thống BloodConnect, bao gồm người hiến máu, người cần máu và nhân viên."
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
