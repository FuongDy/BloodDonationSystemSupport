// src/components/donation/request/DonationBenefitsCard.jsx
import React from 'react';
import { Heart, CheckCircle } from 'lucide-react';

const DonationBenefitsCard = () => {
  const benefits = [
    'Kiểm tra sức khỏe miễn phí',
    'Cải thiện tuần hoàn máu',
    'Giảm nguy cơ bệnh tim mạch',
    'Cảm giác hạnh phúc và ý nghĩa',
  ];

  return (
    <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <Heart className='h-5 w-5 text-green-600 mr-2' />
        Lợi ích khi hiến máu
      </h3>
      <ul className='space-y-2 text-sm text-gray-700'>
        {benefits.map((benefit, index) => (
          <li key={index} className='flex items-start space-x-2'>
            <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
            <span className='break-words'>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationBenefitsCard;
