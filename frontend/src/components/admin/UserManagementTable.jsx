// src/components/admin/UserManagementTable.jsx
import {
  CheckCircle,
  Edit3,
  Eye,
  ShieldQuestion,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import userService from '../../services/userService';
import { USER_ROLES, USER_STATUSES } from '../../utils/constants';
import {
  getRoleSpecificClasses,
  getStatusSpecificClasses,
} from '../../utils/formatters';
import ActionButtonGroup from '../common/ActionButtonGroup';
import DateTimeDisplay from '../common/DateTimeDisplay';
import StatusBadge from '../common/StatusBadge';


const UserManagementTable = ({ users, onRefresh, onSort, renderSortIcon }) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (asyncFn, options = {}) => {
    const { showToast = false, successMessage, onSuccess } = options;
    
    setIsLoading(true);
    try {
      const result = await asyncFn();
      
      if (showToast && successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      if (showToast) {
        toast.error(error.message || 'Có lỗi xảy ra');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const _handleDeleteUser = useCallback(
    async (userId, userName, userRole) => {
      if (userRole === USER_ROLES.ADMIN) {
        await execute(
          () => Promise.reject(new Error('Không thể vô hiệu Admin.')),
          { showToast: true }
        );
        return;
      }

      const confirmMessage = `Bạn có chắc chắn muốn vô hiệu hóa người dùng "${userName}" (ID: ${userId}) không? ` +
          `Hành động này sẽ chuyển trạng thái của họ thành "Suspended".`;
      
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(confirmMessage);

      if (!confirmed) return;

      await execute(
        () => userService.softDeleteUserByAdmin(userId),
        {
          showToast: true,
          successMessage: `Người dùng ${userName} đã được vô hiệu hóa.`,
          onSuccess: () => {
            if (onRefresh) onRefresh();
          },
        }
      );
    },
    [execute, onRefresh]
  );
  const SortableHeader = ({ field, children }) => (
    <th
      scope='col'
      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group'
      onClick={() => onSort && onSort(field)}
    >
      <div className='flex items-center'>
        {children}
        {renderSortIcon && renderSortIcon(field)}
      </div>
    </th>
  );

  if (!users || users.length === 0) {
    return (
      <p className='text-center text-gray-500 py-8'>
        Không có dữ liệu người dùng.
      </p>
    );
  }

  return (
    <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <SortableHeader field='id'>ID</SortableHeader>
            <SortableHeader field='fullName'>Họ tên</SortableHeader>
            <SortableHeader field='email'>Email</SortableHeader>
            <SortableHeader field='role'>Vai trò</SortableHeader>
            <SortableHeader field='status'>Trạng thái</SortableHeader>
            <SortableHeader field='emailVerified'>Email X.Thực</SortableHeader>
            <SortableHeader field='createdAt'>Ngày tạo</SortableHeader>
            <th
              scope='col'
              className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Hành động{' '}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {users.map(user => {
            // Luôn có 3 nút để căn đều
            const userActions = [
              {
                label: 'Xem chi tiết',
                icon: Eye,
                variant: 'icon',
                className: 'text-blue-600 hover:text-blue-800',
                component: Link,
                to: `/admin/users/${user.id}`,
              },
              {
                label: 'Chỉnh sửa',
                icon: Edit3,
                variant: 'icon',
                className: 'text-indigo-600 hover:text-indigo-800',
                component: Link,
                to: `/admin/users/${user.id}/edit`,
              },
            ];

            // Nút thứ 3 - thay đổi dựa trên role và status
            if (user.role === USER_ROLES.ADMIN) {
              // Admin - nút bị disable
              userActions.push({
                label: 'Admin',
                icon: ShieldQuestion,
                variant: 'icon',
                className: 'text-gray-400 cursor-not-allowed',
                disabled: true,
              });
            } else if (user.status === USER_STATUSES.ACTIVE) {
              // User active - có thể vô hiệu hóa
              userActions.push({
                label: 'Vô hiệu hóa',
                icon: Trash2,
                variant: 'icon',
                className: 'text-red-600 hover:text-red-800',
                onClick: () =>
                  _handleDeleteUser(user.id, user.fullName, user.role),
                disabled: isLoading,
              });
            } else {
              // User đã bị vô hiệu hóa - hiển thị trạng thái
              userActions.push({
                label: 'Đã khóa',
                icon: XCircle,
                variant: 'icon',
                className: 'text-gray-400 cursor-not-allowed',
                disabled: true,
              });
            }

            return (
              <tr key={user.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {user.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {user.fullName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {user.email}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <StatusBadge
                    status={user.role}
                    text={user.role}
                    className={getRoleSpecificClasses(user.role)}
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
                  <StatusBadge
                    status={user.status}
                    text={user.status}
                    className={getStatusSpecificClasses(user.status)}
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
                  {user.emailVerified ? (
                    <CheckCircle size={18} className='text-green-500 inline' />
                  ) : (
                    <XCircle size={18} className='text-red-500 inline' />
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <DateTimeDisplay date={user.createdAt} />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
                  <ActionButtonGroup actions={userActions} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;
