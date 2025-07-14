// src/components/staff/StaffPageLayout.jsx
import React from 'react';
import StaffPageHeader from './StaffPageHeader';
import StaffSearchBar from './StaffSearchBar';

const StaffPageLayout = ({
  title,
  subtitle,
  headerActions,
  children,
  onSearch,
  searchPlaceholder,
  showSearch = false,
  className = 'p-6',
  icon,
}) => (
  <div className={className}>
    {title && (
      <StaffPageHeader 
        title={title} 
        subtitle={subtitle}
        actions={headerActions} 
        icon={icon}
      />
    )}
    {showSearch && onSearch && (
      <div className='mb-6'>
        <StaffSearchBar
          onSearch={onSearch}
          placeholder={searchPlaceholder || 'Tìm kiếm...'}
        />
      </div>
    )}
    {children}
  </div>
);

export default StaffPageLayout;
