// src/components/admin/AdminContentWrapper.jsx
import React from 'react';
import AdminLoadingState from './AdminLoadingState';
import AdminEmptyState from './AdminEmptyState';
import AdminPaginationInfo from './AdminPaginationInfo';

const AdminContentWrapper = ({
  isLoading,
  hasData,
  loadingMessage,
  emptyMessage,
  emptyIcon,
  children,
  // Pagination props
  showPagination = false,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  paginationLoading = false
}) => {
  if (isLoading && !hasData) {
    return <AdminLoadingState message={loadingMessage} />;
  }

  if (!hasData) {
    return (
      <AdminEmptyState 
        message={emptyMessage}
        icon={emptyIcon}
      />
    );
  }

  return (
    <>
      {children}
      
      {showPagination && (
        <AdminPaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={onPageChange}
          isLoading={paginationLoading}
        />
      )}
    </>
  );
};

export default AdminContentWrapper;

