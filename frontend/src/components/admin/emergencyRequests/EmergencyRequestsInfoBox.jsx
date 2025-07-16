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
            Quy trình quản lý yêu cầu khẩn cấp
          </h4>
          <div className='text-sm text-blue-700 mt-1 space-y-1'>
            <p>• <strong>Khi có người đăng ký hiến máu:</strong> Yêu cầu vẫn giữ trạng thái "Đang chờ xử lý"</p>
            <p>• <strong>Đủ người đăng ký:</strong> Hệ thống hiển thị "✓ Đã đủ người đăng ký" và nút "Hoàn thành" sẽ nổi bật</p>
            <p>• <strong>Chỉ Admin/Staff</strong> mới có thể đánh dấu yêu cầu là "Hoàn thành" hoặc "Hủy"</p>
            <p>• <strong>Yêu cầu sẽ luôn hiển thị</strong> cho đến khi được Admin/Staff xử lý thủ công</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestsInfoBox;
