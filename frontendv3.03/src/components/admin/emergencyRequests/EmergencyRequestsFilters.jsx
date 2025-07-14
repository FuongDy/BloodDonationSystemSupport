// src/components/admin/emergencyRequests/EmergencyRequestsFilters.jsx
import React from 'react';
import { Search } from 'lucide-react';
import InputField from '../../common/InputField';

const EmergencyRequestsFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus 
}) => {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <InputField
            label='Tìm kiếm'
            placeholder='Tên bệnh nhân, nhóm máu, bệnh viện...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            icon={<Search className='w-4 h-4' />}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Trạng thái
          </label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
          >
            <option value='all'>Tất cả</option>
            <option value='PENDING'>Đang chờ xử lý</option>
            <option value='ready'>Sẵn sàng hoàn thành</option>
            <option value='FULFILLED'>Đã hoàn thành</option>
            <option value='COMPLETED'>Đã hoàn thành</option>
            <option value='CANCELLED'>Đã hủy</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestsFilters;
