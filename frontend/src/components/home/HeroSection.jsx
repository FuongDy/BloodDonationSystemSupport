// src/components/home/HeroSection.jsx
import React from 'react';
import { ArrowRight, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-red-100/50 via-pink-100/30 to-rose-100/50 backdrop-blur-xl min-h-[80vh] flex items-center'>
      {/* Enhanced Glass Background with blood-themed gradients */}
      <div className='absolute inset-0 bg-gradient-to-r from-red-600/10 via-pink-600/8 to-red-500/10 animate-pulse'></div>
      <div className='absolute inset-0 bg-white/40 backdrop-blur-md'></div>
      
      {/* Enhanced Floating Elements with blood theme colors */}
      <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-300/40 to-pink-300/40 rounded-full blur-xl animate-float'></div>
      <div className='absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-300/40 to-red-400/40 rounded-full blur-lg animate-float-delayed'></div>
      <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-red-400/30 to-pink-300/30 rounded-full blur-md animate-pulse delay-500'></div>
      <div className='absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-rose-300/30 to-red-300/30 rounded-full blur-lg animate-bounce delay-1000'></div>
      
      {/* Sparkling particles with blood theme */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-ping delay-700'></div>
        <div className='absolute top-3/4 left-1/4 w-1 h-1 bg-red-300 rounded-full animate-ping delay-1500'></div>
        <div className='absolute top-1/3 right-1/4 w-3 h-3 bg-pink-200 rounded-full animate-pulse delay-2000'></div>
      </div>
      
      <PageContainer className='relative section-padding'>
        <div className='text-center animate-fade-in-up'>
          <div className='mb-8'>
            <div className='relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-sm rounded-full mb-6 animate-bounce-gentle shadow-2xl border-2 border-red-200/60 hover:scale-110 transition-transform duration-500'>
              <Droplet className='w-12 h-12 text-red-600 drop-shadow-lg' />
              {/* Glow effect with red theme */}
              <div className='absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse'></div>
            </div>
          </div>

          <h1 className='heading-1 mb-8 drop-shadow-lg'>
            <span className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent'>
              Kết nối yêu thương,
            </span>
            <br />
            <span className='relative inline-block mt-2'>
              <span className='bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg text-6xl md:text-7xl font-black'>
                Chia sẻ sự sống
              </span>
              {/* Enhanced underline with blood-themed gradient */}
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse'></div>
              {/* Additional glow with blood theme */}
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-sm opacity-70'></div>
            </span>
          </h1>

          <p className='text-body-large mb-12 max-w-4xl mx-auto drop-shadow-sm text-gray-700 leading-relaxed font-medium bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg'>
            <span className='text-red-600 font-semibold'>BloodConnect</span> là nền tảng kết nối người hiến máu tình nguyện với
            những người đang cần máu, góp phần lan tỏa giá trị nhân ái và
            mang lại hy vọng cho cộng đồng. Hãy cùng chúng tôi xây dựng một thế giới
            <span className='text-pink-600 font-semibold'> yêu thương và chia sẻ</span>.
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
            <Link to='/register'>
              <Button size='lg' className='relative group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1'>
                <span className='relative z-10'>Tham gia ngay</span>
                <ArrowRight className='ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300' />
                {/* Button glow effect with red theme */}
                <div className='absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500'></div>
              </Button>
            </Link>
            <Link to='/blood-compatibility'>
              <Button variant='outline' size='lg' className='relative group bg-white/80 backdrop-blur-sm border-2 border-red-300 hover:bg-white/95 hover:border-red-400 text-red-700 font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105'>
                <span className='relative z-10'>Tìm hiểu thêm</span>
                {/* Button subtle glow with red theme */}
                <div className='absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500'></div>
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default HeroSection;
