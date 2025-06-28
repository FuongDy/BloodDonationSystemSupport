// src/components/donation/request/DonationNotesSection.jsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

const DonationNotesSection = ({ notes, onChange, loading }) => {
  return (
    <div className='bg-purple-50 rounded-xl p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <MessageSquare className='h-5 w-5 text-purple-600 mr-2' />
        Ghi chú thêm
      </h3>
      <div className='relative'>
        <textarea
          name='notes'
          rows='4'
          value={notes}
          onChange={onChange}
          disabled={loading}
          className='block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white resize-none'
          placeholder='Ví dụ: Tôi có thể đến sau 18:00, có tiền sử bệnh tim, cần tư vấn thêm...'
        />
      </div>
      <p className='mt-2 text-xs text-gray-500'>
        Hãy cho chúng tôi biết bất kỳ thông tin nào có thể hữu ích
      </p>
    </div>
  );
};

export default DonationNotesSection;
