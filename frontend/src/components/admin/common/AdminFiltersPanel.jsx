// src/components/admin/common/AdminFiltersPanel.jsx
import React from 'react';
import { Search } from 'lucide-react';
import Select from '../../common/Select';

const AdminFiltersPanel = ({
  // Search
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  
  // Filters
  filters = [], // Array of filter objects: { key, label, value, onChange, options }
  
  // View mode toggle
  showViewMode = false,
  viewMode = 'table',
  onViewModeChange,
  viewModeOptions = [
    { value: 'table', label: 'Bảng' },
    { value: 'cards', label: 'Thẻ' }
  ],
  
  // Filter summary
  totalCount = 0,
  filteredCount = 0,
  itemLabel = 'mục',
  
  // Clear filters
  onClearFilters,
  hasActiveFilters = false,
  
  // Additional content
  children,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            <Select
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
              placeholder={filter.placeholder || `Chọn ${filter.label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* View Mode Toggle */}
        {showViewMode && (
          <div className="flex items-end gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiển thị
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {viewModeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onViewModeChange(option.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional content slot */}
        {children}
      </div>

      {/* Filter Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Hiển thị <span className="font-semibold text-gray-900">{filteredCount}</span> trong tổng số{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> {itemLabel}
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600">
              (đã lọc)
            </span>
          )}
        </div>
        
        {/* Clear filters */}
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminFiltersPanel;
