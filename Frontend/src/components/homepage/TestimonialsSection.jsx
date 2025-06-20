import React from 'react';

const testimonials = [
  {
    quote: "BloodConnect đã giúp tôi dễ dàng tìm được những người cần máu gần nhà. Cảm giác được giúp đỡ người khác thật tuyệt vời!",
    author: "Nguyễn Văn An",
    role: "Người hiến máu tình nguyện",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    quote: "Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.",
    author: "Trần Thị Bình",
    role: "Bác sĩ tại BV Chợ Rẫy",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
  },
  {
    quote: "Nhờ có BloodConnect, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn tất cả những người hiến máu tình nguyện!",
    author: "Lê Minh Châu",
    role: "Người nhận máu",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
  },
];

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-4">
        <div className="text-yellow-400">
            {[...Array(5)].map((_, i) => <span key={i}>&#9733;</span>)}
        </div>
    </div>
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Câu chuyện từ cộng đồng</h2>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Những chia sẻ chân thực từ những người đã tham gia vào hành trình lan tỏa yêu thương.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
