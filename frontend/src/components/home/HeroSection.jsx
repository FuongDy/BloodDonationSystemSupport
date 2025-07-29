// src/components/home/HeroSection.jsx
import { ArrowRight } from 'lucide-react';
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
    <section className='relative min-h-screen flex items-center -mt-16 pt-16'>
      {/* Cover Image Background */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm'
        style={{
          backgroundImage: 'url(/CoverImageBDSS.png)'
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div className='absolute inset-0 bg-black/50'></div>
      
      <PageContainer className='relative section-padding'>
        <div className='text-center'>

          {/* Simplified title - removed complex gradients and animations */}
          <h1 className='text-4xl md:text-6xl font-bold mb-8 text-white drop-shadow-lg'>
            {heroContent.title.part1}
            <br />
            <span className='text-red-500'>
              {heroContent.title.part2}
            </span>
          </h1>

          {/* Simplified description */}
          <p className='text-xl md:text-3xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed drop-shadow'>
            <span className='text-white font-semibold'>HiBlood</span> {heroContent.description}
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
                className='border-white text-red-600 hover:bg-red-100 hover:text-red-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200 backdrop-blur-sm'
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
