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
    },
    {
      name: 'Trần Thị Bình',
      role: 'Bác sĩ tại BV Chợ Rẫy',
      content:
        'Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.',
    },
    {
      name: 'Lê Minh Châu',
      role: 'Người nhận máu',
      content:
        'Nhờ có BloodConnect, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn tất cả những người hiến máu tình nguyện!',
    },
  ];

  return (
    <section className='section-padding'>
      <PageContainer>
        <div className='text-center mb-16'>
          <h2 className='heading-2 mb-4'>Câu chuyện từ cộng đồng</h2>
          <p className='text-body-large max-w-2xl mx-auto'>
            Những chia sẻ chân thực từ những người đã tham gia vào hành
            trình lan tỏa yêu thương.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              hover
              className='animate-fade-in-up'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className='p-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-gray-600 mb-6 italic'>
                  "{testimonial.content}"
                </p>
                <div className='flex items-center'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default TestimonialsSection;
