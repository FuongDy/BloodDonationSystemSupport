// src/components/register/RegisterHeroSection.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const RegisterHeroSection = () => {
  return (
    <div className='hidden lg:flex lg:w-2/5 flex-col justify-center items-center bg-gradient-to-br from-red-600 to-pink-600 text-white p-8'>
      <div className='max-w-sm text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
            <Heart className='w-10 h-10 text-white' />
          </div>
        </div>
        <h1 className='text-3xl font-bold mb-4'>Tham gia cộng đồng</h1>
        <p className='text-lg text-red-100 mb-6 font-light'>
          Trở thành người hùng cứu người với những giọt máu quý giá
        </p>

        {/* Process Steps */}
        <div className='space-y-3 text-left'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-sm font-bold'>1</span>
            </div>
            <span className='text-red-100'>Đăng ký tài khoản</span>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-sm font-bold'>2</span>
            </div>
            <span className='text-red-100'>Xác thực thông tin</span>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-sm font-bold'>3</span>
            </div>
            <span className='text-red-100'>Bắt đầu hiến máu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterHeroSection;
