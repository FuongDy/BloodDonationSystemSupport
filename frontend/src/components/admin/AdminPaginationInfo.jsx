// src/components/admin/AdminPaginationInfo.jsx
import React from 'react';
import Pagination from '../common/Pagination';

const AdminPaginationInfo = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  isLoading = false,
  className = 'mt-6 flex flex-col sm:flex-row justify-between items-center gap-4'
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <div className='text-sm text-gray-700'>
        Trang{' '}
        <span className='font-medium'>{currentPage + 1}</span> /{' '}
        <span className='font-medium'>{totalPages}</span> (
        {totalElements} kết quả)
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminPaginationInfo;
