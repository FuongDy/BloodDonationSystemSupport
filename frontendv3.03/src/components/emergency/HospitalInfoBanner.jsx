// src/components/emergency/HospitalInfoBanner.jsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { HOSPITAL_INFO } from '../../utils/constants';

const HospitalInfoBanner = () => {
  return (
    <div className='mb-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg'>
      <div className='flex items-center'>
        <MapPin className='w-5 h-5 text-blue-400 mr-2' />
        <div>
          <h3 className='text-lg font-medium text-blue-900'>
            Địa điểm hiến máu
          </h3>
          <p className='text-blue-700 mt-1'>{HOSPITAL_INFO.FULL_ADDRESS}</p>
          <p className='text-sm text-blue-600 mt-2'>
            💡 <strong>Lưu ý:</strong> Sau khi cam kết, vui lòng đến bệnh
            viện trong vòng 24 giờ để hoàn thành quá trình hiến máu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalInfoBanner;
