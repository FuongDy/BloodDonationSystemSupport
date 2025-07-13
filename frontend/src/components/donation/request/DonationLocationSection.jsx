// src/components/donation/request/DonationLocationSection.jsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { HOSPITAL_INFO } from '../../../utils/constants';

const DonationLocationSection = () => {
  return (
    <div className='bg-blue-50 rounded-xl p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <MapPin className='h-5 w-5 text-blue-600 mr-2' />
        Địa điểm hiến máu
      </h3>
      <div className='bg-white rounded-lg p-4 border border-gray-200'>
        <div className='flex items-start space-x-3'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <MapPin className='w-5 h-5 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h4 className='font-semibold text-gray-900'>
              {HOSPITAL_INFO.FULL_NAME}
            </h4>
            <p className='text-sm text-gray-600 mt-1'>
              {HOSPITAL_INFO.ADDRESS}
            </p>
            <div className='mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              ✓ Địa điểm
            </div>
          </div>
        </div>
      </div>
      <div className='mt-3 text-xs text-gray-500'>
        <p>
          Tất cả các hoạt động hiến máu sẽ được thực hiện tại địa điểm này.
        </p>
      </div>
    </div>
  );
};

export default DonationLocationSection;
