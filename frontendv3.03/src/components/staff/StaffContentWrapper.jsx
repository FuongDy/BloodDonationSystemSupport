// src/components/staff/StaffContentWrapper.jsx
import React from 'react';
import StaffLoadingState from './StaffLoadingState';
import StaffEmptyState from './StaffEmptyState';
import StaffPaginationInfo from './StaffPaginationInfo';

const StaffContentWrapper = ({
  isLoading,
  hasData,
  loadingMessage,
  emptyMessage,
  emptyIcon,
  children,
  showPagination = false,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  paginationLoading = false,
}) => {
  if (isLoading && !hasData) {
    return <StaffLoadingState message={loadingMessage} />;
  }
  if (!hasData) {
    return <StaffEmptyState message={emptyMessage} icon={emptyIcon} />;
  }
  return (
    <>
      {children}
      {showPagination && (
        <StaffPaginationInfo
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

export default StaffContentWrapper;
