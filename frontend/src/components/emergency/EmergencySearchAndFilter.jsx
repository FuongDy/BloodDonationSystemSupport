// src/components/emergency/EmergencySearchAndFilter.jsx
import { Filter, Search, X } from 'lucide-react';
import Select from '../common/Select';

const EmergencySearchAndFilter = ({
  searchTerm,
  onSearchChange,
  bloodGroupFilter,
  onBloodGroupChange,
  urgencyFilter,
  onUrgencyChange,
  onClearFilters,
  totalResults,
  filteredResults
}) => {
    
  const bloodGroupOptions = [
    { value: 'ALL', label: 'Tất cả nhóm máu' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const urgencyOptions = [
    { value: 'ALL', label: 'Tất cả mức độ' },
    { value: 'CRITICAL', label: 'Cực kỳ khẩn cấp' },
    { value: 'URGENT', label: 'Khẩn cấp' },
    { value: 'NORMAL', label: 'Bình thường' },
  ];

  const hasActiveFilters = searchTerm || bloodGroupFilter !== 'ALL' || urgencyFilter !== 'ALL';

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <Filter className='w-5 h-5 text-gray-500' />
          <h3 className='text-lg font-semibold text-gray-900'>Tìm kiếm và lọc</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className='flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors'
          >
            <X className='w-4 h-4' />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className='grid grid-cols-1 md:grid-cols-12 gap-4 mb-4'>
        {/* Search Input */}
        <div className='md:col-span-6 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <input
            type='text'
            placeholder='Tìm kiếm theo tên bệnh viện, ID yêu cầu...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
          />
        </div>

        {/* Blood Group Filter */}
        <div className='md:col-span-3'>
          <Select
            value={bloodGroupFilter}
            onChange={onBloodGroupChange}
            options={bloodGroupOptions}
            placeholder='Chọn nhóm máu'
          />
        </div>

        {/* Urgency Filter */}
        <div className='md:col-span-3'>
          <Select
            value={urgencyFilter}
            onChange={onUrgencyChange}
            options={urgencyOptions}
            placeholder='Chọn mức độ khẩn cấp'
          />
        </div>
      </div>

      {/* Results Info */}
      <div className='flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100'>
        <div>
          Hiển thị <span className='font-medium text-gray-900'>{filteredResults}</span> trên{' '}
          <span className='font-medium text-gray-900'>{totalResults}</span> yêu cầu
        </div>
        {hasActiveFilters && (
          <div className='flex items-center space-x-2'>
            <span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
              Đang lọc
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencySearchAndFilter;
