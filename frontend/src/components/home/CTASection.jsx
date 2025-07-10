// src/components/home/CTASection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const CTASection = () => {
  return (
    <section className='section-padding bg-gradient-to-br from-red-600 via-red-700 to-pink-600 text-white relative overflow-hidden'>
      {/* Enhanced Glass Background */}
      <div className='absolute inset-0 bg-gradient-to-r from-red-700/30 to-pink-600/30'></div>
      <div className='absolute inset-0 bg-black/10 backdrop-blur-sm'></div>
      
      {/* Floating Elements */}
      <div className='absolute top-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse'></div>
      <div className='absolute bottom-10 right-10 w-40 h-40 bg-pink-300/10 rounded-full blur-xl animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-300/5 rounded-full blur-3xl'></div>
      
      <PageContainer className='relative'>
        {/* Glass Container */}
        <div className='bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-5 drop-shadow-lg'>
            Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
          </h2>
          <p className='text-red-100 mb-10 text-lg max-w-3xl mx-auto drop-shadow-sm leading-relaxed'>
            Tham gia cộng đồng BloodConnect ngay hôm nay và trở thành một
            phần của những điều kỳ diệu, mang lại hy vọng và sự sống cho
            những người cần giúp đỡ.
          </p>
          
          {/* Enhanced Button Container */}
          <div className='inline-block'>
            <Link 
              to='/register' 
              className='bg-red-600 text-white hover:bg-red-700 hover:text-white font-bold group shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-2xl text-lg flex items-center backdrop-blur-sm border border-red-300/40'
            >
              Đăng ký hiến máu
              <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default CTASection;
