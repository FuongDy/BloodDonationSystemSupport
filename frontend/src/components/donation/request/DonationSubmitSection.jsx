// src/components/donation/request/DonationSubmitSection.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import Button from '../../common/Button';

const DonationSubmitSection = ({ loading, onSubmit }) => {
  return (
    <div className='pt-6'>
      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base'
        disabled={loading}
        isLoading={loading}
        size='lg'
        onClick={onSubmit}
      >
        <Heart className='mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
        <span className='truncate'>
          {loading ? 'Đang đăng ký...' : 'Đăng ký hiến máu'}
        </span>
      </Button>
      <p className='mt-3 text-center text-xs text-gray-500 break-words px-2'>
        Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để sắp xếp lịch hẹn phù hợp
      </p>
    </div>
  );
};

export default DonationSubmitSection;
