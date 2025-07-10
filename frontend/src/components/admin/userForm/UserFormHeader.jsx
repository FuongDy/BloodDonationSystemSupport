// src/components/admin/userForm/UserFormHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Eye } from 'lucide-react';
import Button from '../../common/Button';

const UserFormHeader = ({ user, userId, isEditMode, isViewMode }) => {
  return (
    <>
      <Link
        to='/admin/users'
        className='flex items-center text-red-600 hover:text-red-800 mb-4'
      >
        <ArrowLeft size={20} className='mr-2' />
        Quay lại danh sách
      </Link>

      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {isEditMode ? 'Chỉnh sửa: ' : ''}
                {user.fullName}
              </h1>
              <p className='text-sm text-gray-500'>
                ID: {user.id} -{' '}
                <span className='font-semibold'>
                  {user.username || user.email}
                </span>
              </p>
            </div>
            <div className='flex space-x-2'>
              {isViewMode && (
                <Link to={`/admin/users/${userId}/edit`}>
                  <Button variant='outline'>
                    <Edit3 size={16} className='mr-2' /> Chỉnh sửa
                  </Button>
                </Link>
              )}
              {isEditMode && (
                <Link to={`/admin/users/${userId}`}>
                  <Button variant='secondary'>
                    <Eye size={16} className='mr-2' /> Xem chi tiết
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormHeader;
