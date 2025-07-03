// src/components/admin/AdminPageLayout.jsx
import React from 'react';
import PageHeader from '../common/PageHeader';
import SearchBar from '../common/SearchBar.jsx';

const AdminPageLayout = ({
  title,
  headerActions,
  children,
  onSearch,
  searchPlaceholder,
  showSearch = false,
  className = 'p-6',
}) => (
  <div className={className}>
    <PageHeader title={title} actions={headerActions} />
    {showSearch && onSearch && (
      <div className='mb-4'>
        <SearchBar
          onSearch={onSearch}
          placeholder={searchPlaceholder || 'Tìm kiếm...'}
        />
      </div>
    )}
    {children}
  </div>
);

export default AdminPageLayout;
