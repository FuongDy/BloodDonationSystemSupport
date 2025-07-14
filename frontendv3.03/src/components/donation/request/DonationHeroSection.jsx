// src/components/donation/request/DonationHeroSection.jsx
import React from 'react';
import { Heart, Clock, Users, CheckCircle } from 'lucide-react';

const DonationHeroSection = () => {
  return (
    <div className='relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 text-white'>
      <div className='absolute inset-0 bg-black/10'></div>
      <div className='relative container mx-auto px-4 py-12 sm:py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6'>
            <Heart className='h-10 w-10 text-white' />
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 break-words'>
            Đặt Lịch Hẹn Hiến Máu
          </h1>
          <p className='text-lg sm:text-xl lg:text-2xl text-red-100 mb-8 font-light break-words'>
            Mỗi giọt máu bạn hiến tặng là một cơ hội cứu sống một người
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-red-100'>
            <div className='flex items-center space-x-2 min-w-0'>
              <Clock className='h-5 w-5 flex-shrink-0' />
              <span className='whitespace-nowrap'>Nhanh chóng</span>
            </div>
            <div className='flex items-center space-x-2 min-w-0'>
              <Users className='h-5 w-5 flex-shrink-0' />
              <span className='whitespace-nowrap'>An toàn</span>
            </div>
            <div className='flex items-center space-x-2 min-w-0'>
              <CheckCircle className='h-5 w-5 flex-shrink-0' />
              <span className='whitespace-nowrap'>Tin cậy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHeroSection;
