// src/components/admin/common/AdminTableFilters.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const AdminTableFilters = ({
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  filters = [],
  onFilterChange,
  searchTerm = '',
  className = '',
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch?.(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearch?.('');
  };

  const hasActiveFilters = filters.some(filter => 
    filter.value && filter.value !== 'ALL' && filter.value !== ''
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          type='text'
          placeholder={searchPlaceholder}
          value={localSearchTerm}
          onChange={handleSearchChange}
          className='pl-10 pr-10'
        />
        {localSearchTerm && (
          <button
            onClick={handleClearSearch}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className='flex flex-wrap gap-4 items-center'>
          <div className='flex items-center text-sm text-gray-600'>
            <Filter className='h-4 w-4 mr-2' />
            Bộ lọc:
          </div>
          {filters.map((filter, index) => (
            <div key={index} className='min-w-[150px]'>
              <Select
                value={filter.value}
                onChange={(value) => onFilterChange?.(filter.key, value)}
                options={filter.options}
                placeholder={filter.placeholder}
              />
            </div>
          ))}
          
          {hasActiveFilters && (
            <button
              onClick={() => {
                filters.forEach(filter => {
                  onFilterChange?.(filter.key, 'ALL');
                });
              }}
              className='text-sm text-red-600 hover:text-red-800 underline'
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTableFilters;
