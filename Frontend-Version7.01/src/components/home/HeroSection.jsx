// src/components/home/HeroSection.jsx
import React from 'react';
import { ArrowRight, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-50'>
      <div className='absolute inset-0 bg-gradient-to-r from-red-600/5 to-pink-600/5'></div>
      <PageContainer className='relative section-padding'>
        <div className='text-center animate-fade-in-up'>
          <div className='mb-8'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-bounce-gentle'>
              <Droplet className='w-10 h-10 text-red-600' />
            </div>
          </div>

          <h1 className='heading-1 mb-6'>
            Kết nối yêu thương, <br />
            <span className='text-red-600 relative'>
              Chia sẻ sự sống
              <div className='absolute -bottom-2 left-0 right-0 h-1 bg-red-200 rounded-full'></div>
            </span>
          </h1>

          <p className='text-body-large mb-10 max-w-3xl mx-auto'>
            BloodConnect là nền tảng kết nối người hiến máu tình nguyện với
            những người đang cần máu, góp phần lan tỏa giá trị nhân ái và
            mang lại hy vọng cho cộng đồng.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register'>
              <Button size='lg' className='btn-primary group'>
                Tham gia ngay
                <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
            <Link to='/blood-compatibility'>
              <Button variant='outline' size='lg'>
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default HeroSection;
