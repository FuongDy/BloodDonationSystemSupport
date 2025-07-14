// src/components/donation/request/DonationProcessCard.jsx
import React from 'react';
import { Info } from 'lucide-react';

const DonationProcessCard = () => {
  const processSteps = [
    {
      number: 1,
      title: 'Đăng ký hiến máu',
      description: 'Kiểm tra và cập nhật thông tin cá nhân',
    },
    {
      number: 2,
      title: 'Liên hệ xác nhận',
      description: 'Nhân viên sẽ liên hệ để sắp xếp lịch hẹn',
    },
    {
      number: 3,
      title: 'Khám sức khỏe',
      description: 'Kiểm tra sức khỏe trước khi hiến',
    },
    {
      number: 4,
      title: 'Hiến máu',
      description: 'Chỉ mất 10-15 phút',
    },
    {
      number: 5,
      title: 'Nghỉ ngơi',
      description: 'Thưởng thức đồ ăn nhẹ',
    },
  ];

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <Info className='h-5 w-5 text-blue-600 mr-2' />
        Quy trình hiến máu
      </h3>
      <div className='space-y-4'>
        {processSteps.map((step) => (
          <div key={step.number} className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600'>
              {step.number}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-gray-900 break-words'>
                {step.title}
              </p>
              <p className='text-xs text-gray-600 break-words'>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationProcessCard;
