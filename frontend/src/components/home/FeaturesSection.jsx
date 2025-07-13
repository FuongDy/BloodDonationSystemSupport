// src/components/home/FeaturesSection.jsx
import React from 'react';
import { Heart, Users, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import PageContainer from '../layout/PageContainer';

const FeaturesSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Hiến máu dễ dàng',
      description:
        'Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.',
      color: 'text-red-500',
      bgColor: 'bg-red-100/70',
      hoverBg: 'group-hover:bg-red-100/90',
    },
    {
      icon: Users,
      title: 'Cộng đồng lớn mạnh',
      description:
        'Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100/70',
      hoverBg: 'group-hover:bg-blue-100/90',
    },
    {
      icon: MapPin,
      title: 'Tìm kiếm nhanh chóng',
      description:
        'Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.',
      color: 'text-green-500',
      bgColor: 'bg-green-100/70',
      hoverBg: 'group-hover:bg-green-100/90',
    },
    {
      icon: Shield,
      title: 'An toàn & Bảo mật',
      description:
        'Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100/70',
      hoverBg: 'group-hover:bg-purple-100/90',
    },
  ];

  return (
    <section className='section-padding bg-gradient-to-br from-gray-50/90 via-red-50/20 to-pink-50/30 relative overflow-hidden'>
      {/* Background Glass Elements */}
      <div className='absolute inset-0 bg-white/60 backdrop-blur-sm'></div>
      <div className='absolute top-0 right-0 w-72 h-72 bg-red-100/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-56 h-56 bg-pink-100/20 rounded-full blur-2xl'></div>
      
      <PageContainer className='relative'>
        <div className='text-center mb-16 animate-fade-in-up'>
          <h2 className='heading-2 mb-4 drop-shadow-sm'>Tại sao chọn BloodConnect?</h2>
          <p className='text-body-large max-w-2xl mx-auto drop-shadow-sm text-gray-700'>
            Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi
            để kết nối cộng đồng hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className='group animate-fade-in-up'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glass Card */}
              <div className='bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-1'>
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${feature.bgColor} backdrop-blur-sm ${feature.hoverBg} transition-all duration-300 ${feature.color} shadow-md border border-white/30`}
                >
                  <feature.icon className='w-8 h-8 drop-shadow-sm' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2 drop-shadow-sm'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed drop-shadow-sm'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default FeaturesSection;
