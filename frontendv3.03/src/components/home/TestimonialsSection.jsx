// src/components/home/TestimonialsSection.jsx
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import PageContainer from '../layout/PageContainer';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      role: 'Người hiến máu tình nguyện',
      content:
        'BloodConnect đã giúp tôi dễ dàng tìm được những người cần máu gần nhà. Cảm giác được giúp đỡ người khác thật tuyệt vời!',
      avatar: 'N',
    },
    {
      name: 'Trần Thị Bình',
      role: 'Bác sĩ tại BV Chợ Rẫy',
      content:
        'Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.',
      avatar: 'T',
    },
    {
      name: 'Lê Minh Châu',
      role: 'Người nhận máu',
      content:
        'Nhờ có BloodConnect, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn tất cả những người hiến máu tình nguyện!',
      avatar: 'L',
    },
  ];

  return (
    <section className='section-padding bg-gradient-to-br from-white/90 via-red-50/30 to-pink-50/40 relative overflow-hidden'>
      {/* Background Glass Elements */}
      <div className='absolute inset-0 bg-white/50 backdrop-blur-sm'></div>
      <div className='absolute top-0 left-1/3 w-80 h-80 bg-red-100/20 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-0 right-1/3 w-64 h-64 bg-pink-100/20 rounded-full blur-2xl animate-pulse delay-1000'></div>
      
      <PageContainer className='relative'>
        <div className='text-center mb-16'>
          <h2 className='heading-2 mb-4 drop-shadow-sm'>Câu chuyện từ cộng đồng</h2>
          <p className='text-body-large max-w-2xl mx-auto drop-shadow-sm text-gray-700'>
            Những chia sẻ chân thực từ những người đã tham gia vào hành
            trình lan tỏa yêu thương.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className='group animate-fade-in-up'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glass Card */}
              <div className='bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-1'>
                {/* Stars */}
                <div className='flex items-center mb-4 justify-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current drop-shadow-sm'
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className='text-gray-600 mb-6 italic text-center drop-shadow-sm leading-relaxed'>
                  "{testimonial.content}"
                </p>
                
                {/* User Info */}
                <div className='flex items-center justify-center space-x-3'>
                  {/* Avatar */}
                  <div className='w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-md border border-white/30'>
                    <span className='text-white font-bold text-lg drop-shadow-sm'>
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className='text-center'>
                    <h4 className='font-semibold text-gray-900 drop-shadow-sm'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-gray-500 drop-shadow-sm'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default TestimonialsSection;
