// src/components/home/TestimonialsSection.jsx
import { Star } from 'lucide-react';
import React, { useMemo } from 'react';
import PageContainer from '../layout/PageContainer';

const TestimonialsSection = () => {
  // Memoize static data
  const testimonials = useMemo(() => [
    {
      name: 'Nguyễn Văn An',
      role: 'Người hiến máu tình nguyện',
      content: 'HiBlood đã giúp tôi dễ dàng tìm được những người cần máu gần nhà. Cảm giác được giúp đỡ người khác thật tuyệt vời!',
      avatar: 'N',
    },
    {
      name: 'Trần Thị Bình',
      role: 'Bác sĩ tại BV Chợ Rẫy',
      content: 'Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.',
      avatar: 'T',
    },
    {
      name: 'Lê Minh Châu',
      role: 'Người nhận máu',
      content: 'Nhờ có HiBlood, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn tất cả những người hiến máu tình nguyện!',
      avatar: 'L',
    },
  ], []);

  return (
    <section className='py-16 bg-white'>
      <PageContainer>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Câu chuyện từ cộng đồng</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Những chia sẻ chân thực từ những người đã tham gia vào hành
            trình lan tỏa yêu thương.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className='bg-gray-50 rounded-xl p-6'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold mr-4'>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900'>{testimonial.name}</h4>
                  <p className='text-sm text-gray-600'>{testimonial.role}</p>
                </div>
              </div>
              <div className='flex mb-4'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className='w-4 h-4 text-yellow-400 fill-current' />
                ))}
              </div>
              <p className='text-gray-700 italic'>"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(TestimonialsSection);
