// src/components/home/CTASection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';

const CTASection = () => {
  return (
    <section className='py-16 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white'>
      <PageContainer>
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 shadow-xl'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-5 text-white'>
            Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
          </h2>
          <p className='text-red-50 mb-10 text-lg max-w-3xl mx-auto leading-relaxed'>
            Tham gia cộng đồng HiBlood ngay hôm nay và trở thành một
            phần của những điều kỳ diệu, mang lại hy vọng và sự sống cho
            những người cần giúp đỡ.
          </p>
          
          <Link to='/request-donation' className="block w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors text-center max-w-xs mx-auto shadow-lg">
            Đăng ký hiến máu
          </Link>
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(CTASection);
