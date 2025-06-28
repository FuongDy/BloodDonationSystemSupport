// src/components/home/CTASection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const CTASection = () => {
  return (
    <section className='section-padding bg-gradient-to-r from-red-600 to-pink-600 text-white'>
      <PageContainer>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-5'>
            Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
          </h2>
          <p className='text-red-100 mb-10 text-lg max-w-3xl mx-auto'>
            Tham gia cộng đồng BloodConnect ngay hôm nay và trở thành một
            phần của những điều kỳ diệu, mang lại hy vọng và sự sống cho
            những người cần giúp đỡ.
          </p>
          <Link to='/register'>
            <Button
              size='lg'
              className='bg-red-600 text-red-600 hover:bg-gray-100 font-semibold group'
            >
              Đăng ký hiến máu
              <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
};

export default CTASection;
