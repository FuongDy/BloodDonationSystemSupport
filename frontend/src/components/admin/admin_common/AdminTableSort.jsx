// src/components/admin/common/AdminTableSort.jsx
import React from 'react';
import { ArrowDownUp } from 'lucide-react';

const AdminTableSort = ({ 
  field, 
  currentSortField, 
  currentSortDirection, 
  onSort,
  children,
  className = ''
}) => {
  const isActive = currentSortField === field;
  
  const handleSort = () => {
    onSort?.(field);
  };

  const renderSortIcon = () => {
    if (!isActive) {
      return (
        <ArrowDownUp 
          size={14} 
          className='ml-1 text-gray-300 group-hover:text-gray-400' 
        />
      );
    }
    
    return currentSortDirection === 'asc' ? (
      <ArrowDownUp size={14} className='ml-1 rotate-180' />
    ) : (
      <ArrowDownUp size={14} className='ml-1' />
    );
  };

  return (
    <button
      onClick={handleSort}
      className={`flex items-center text-left hover:text-gray-900 transition-colors group ${className}`}
    >
      {children}
      {renderSortIcon()}
    </button>
  );
};

export default AdminTableSort;
