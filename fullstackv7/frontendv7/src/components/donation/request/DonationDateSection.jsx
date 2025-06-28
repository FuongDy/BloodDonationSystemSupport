// src/components/donation/request/DonationDateSection.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const DonationDateSection = ({ appointmentDate, onChange, loading }) => {
  return (
    <div className='bg-gray-50 rounded-xl p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <Calendar className='h-5 w-5 text-red-600 mr-2' />
        Chọn ngày hẹn
      </h3>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Ngày hẹn <span className='text-red-500'>*</span>
        </label>
        <input
          type='date'
          name='appointmentDate'
          value={appointmentDate}
          onChange={onChange}
          required
          disabled={loading}
          min={new Date().toISOString().split('T')[0]}
          className='w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white'
        />
        <p className='mt-2 text-xs text-gray-500'>
          Chúng tôi sẽ liên hệ với bạn để xác nhận giờ cụ thể
        </p>
      </div>
    </div>
  );
};

export default DonationDateSection;
