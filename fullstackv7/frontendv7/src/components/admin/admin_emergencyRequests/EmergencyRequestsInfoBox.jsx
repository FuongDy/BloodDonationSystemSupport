// src/components/admin/emergencyRequests/EmergencyRequestsInfoBox.jsx
import React from 'react';
import { Info } from 'lucide-react';

const EmergencyRequestsInfoBox = () => {
  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
      <div className='flex items-start'>
        <Info className='w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0' />
        <div>
          <h4 className='text-sm font-medium text-blue-800'>
            Theo dõi số lượng đăng ký hiến máu
          </h4>
          <p className='text-sm text-blue-700 mt-1'>
            Bạn có thể theo dõi số lượng người đã đăng ký hiến máu cho mỗi yêu cầu khẩn cấp. 
            Khi số lượng đăng ký đạt đủ hoặc vượt quá số lượng cần, hệ thống sẽ đánh dấu để bạn có thể 
            hoàn thành yêu cầu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestsInfoBox;
