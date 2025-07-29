// src/components/home/FeaturesSection.jsx
import { Heart, MapPin, Shield, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import PageContainer from '../layout/PageContainer';

const FeaturesSection = () => {
  // Memoize static data
  const features = useMemo(() => [
    {
      icon: Heart,
      title: 'Hiến máu dễ dàng',
      description: 'Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      icon: Users,
      title: 'Cộng đồng lớn mạnh',
      description: 'Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      icon: MapPin,
      title: 'Tìm kiếm nhanh chóng',
      description: 'Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Shield,
      title: 'An toàn & Bảo mật',
      description: 'Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
  ], []);

  return (
    <section className='py-16 bg-gray-50'>
      <PageContainer>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Tại sao chọn HiBlood?</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi
            để kết nối cộng đồng hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div key={feature.title} className='bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${feature.bgColor} ${feature.color}`}>
                <feature.icon className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(FeaturesSection);
