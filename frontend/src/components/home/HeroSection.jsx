// src/components/home/HeroSection.jsx
import { ArrowRight, Droplet } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const HeroSection = () => {
  // Memoize static content để tránh re-render
  const heroContent = useMemo(() => ({
    title: {
      part1: 'Kết nối yêu thương,',
      part2: 'Chia sẻ sự sống'
    },
    description: 'là nền tảng kết nối người hiến máu tình nguyện với những người đang cần máu, góp phần lan tỏa giá trị nhân ái và mang lại hy vọng cho cộng đồng. Hãy cùng chúng tôi xây dựng một thế giới yêu thương và chia sẻ.'
  }), []);

  return (
    <section className='relative bg-gradient-to-br from-red-50 to-pink-50 min-h-[80vh] flex items-center'>
      {/* Simplified background - removed heavy animations */}
      <div className='absolute inset-0 bg-white/60'></div>
      
      <PageContainer className='relative section-padding'>
        <div className='text-center'>
          {/* Simplified icon - removed heavy animations */}
          <div className='mb-8'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg border border-red-100'>
              <Droplet className='w-10 h-10 text-red-600' />
            </div>
          </div>

          {/* Simplified title - removed complex gradients and animations */}
          <h1 className='text-5xl md:text-6xl font-bold mb-8 text-gray-800'>
            {heroContent.title.part1}
            <br />
            <span className='text-red-600'>
              {heroContent.title.part2}
            </span>
          </h1>

          {/* Simplified description */}
          <p className='text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-600 leading-relaxed'>
            <span className='text-red-600 font-semibold'>HiBlood</span> {heroContent.description}
          </p>

          {/* Simplified buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link to='/request-donation'>
              <Button 
                size='lg' 
                className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200'
              >
                Tham gia ngay
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </Link>
            <Link to='/blood-compatibility'>
              <Button 
                variant='outline' 
                size='lg' 
                className='border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200'
              >
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(HeroSection);
