// src/components/home/QuickActionsSection.jsx
import React, { useMemo } from 'react';
import { Calendar, Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const QuickActionsSection = () => {
  // Memoize static data
  const quickActions = useMemo(() => [
    {
      icon: Calendar,
      title: 'Đặt lịch hiến máu',
      description: 'Chọn thời gian và địa điểm phù hợp để hiến máu',
      buttonText: 'Đặt lịch ngay',
      link: '/request-donation',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Heart,
      title: 'Tìm người cần máu',
      description: 'Xem các yêu cầu máu khẩn cấp trong khu vực',
      buttonText: 'Xem yêu cầu',
      link: '/blood-requests',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Blog và tin tức',
      description: 'Đọc tin mới nhất về hiến máu, bài viết về mạnh khỏe tốt và các sự kiện cơ bản',
      buttonText: 'Xem blog',
      link: '/blog',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ], []);

  return (
    <section className='py-16 bg-gray-50'>
      <PageContainer>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Bắt đầu ngay hôm nay</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Chọn hành động phù hợp với bạn để tham gia vào cộng đồng hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {quickActions.map((action) => (
            <div key={action.title} className='bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <action.icon className={`w-8 h-8 ${action.iconColor}`} />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>{action.title}</h3>
              <p className='text-gray-600 mb-6'>{action.description}</p>
              {action.link === '#' ? (
                <Button variant='outline' className='w-full'>
                  {action.buttonText}
                </Button>
              ) : (
                <Link to={action.link}>
                  <Button variant='outline' className='w-full'>
                    {action.buttonText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(QuickActionsSection);
