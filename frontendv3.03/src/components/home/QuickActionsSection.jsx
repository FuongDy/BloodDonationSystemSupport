// src/components/home/QuickActionsSection.jsx
import React from 'react';
import { Calendar, Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import Button from '../common/Button';
import PageContainer from '../layout/PageContainer';

const QuickActionsSection = () => {
  const quickActions = [
    {
      icon: Calendar,
      title: 'Đặt lịch hiến máu',
      description: 'Chọn thời gian và địa điểm phù hợp để hiến máu',
      buttonText: 'Đặt lịch ngay',
      link: '/request-donation',
      bgColor: 'bg-red-100',
      hoverColor: 'group-hover:bg-red-200',
      iconColor: 'text-red-600',
    },
    {
      icon: Heart,
      title: 'Tìm người cần máu',
      description: 'Xem các yêu cầu máu khẩn cấp trong khu vực',
      buttonText: 'Xem yêu cầu',
      link: '/blood-requests',
      bgColor: 'bg-blue-100',
      hoverColor: 'group-hover:bg-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Liên hệ hỗ trợ',
      description: 'Cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn',
      buttonText: 'Liên hệ ngay',
      link: '#',
      bgColor: 'bg-green-100',
      hoverColor: 'group-hover:bg-green-200',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <section className='section-padding bg-gradient-to-br from-gray-50/80 via-red-50/30 to-pink-50/30 relative overflow-hidden'>
      {/* Background Glass Elements */}
      <div className='absolute inset-0 bg-white/50 backdrop-blur-sm'></div>
      <div className='absolute top-0 left-1/4 w-64 h-64 bg-red-100/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-1/4 w-48 h-48 bg-pink-100/20 rounded-full blur-2xl'></div>
      
      <PageContainer className='relative'>
        <div className='text-center mb-12'>
          <h2 className='heading-2 mb-4 drop-shadow-sm'>Bắt đầu ngay hôm nay</h2>
          <p className='text-body-large max-w-2xl mx-auto drop-shadow-sm text-gray-700'>
            Chọn hành động phù hợp với bạn để tham gia vào cộng đồng hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {quickActions.map((action) => (
            <div key={action.title} className='group'>
              <div className='bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-1'>
                <div className={`w-16 h-16 ${action.bgColor}/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 ${action.hoverColor} transition-all duration-300 shadow-md border border-white/30`}>
                  <action.icon className={`w-8 h-8 ${action.iconColor} drop-shadow-sm`} />
                </div>
                <h3 className='text-xl font-semibold mb-2 drop-shadow-sm'>{action.title}</h3>
                <p className='text-gray-600 mb-6 drop-shadow-sm'>{action.description}</p>
                {action.link === '#' ? (
                  <div className='bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 shadow-md hover:shadow-lg'>
                    <Button variant='outline' className='w-full border-none bg-transparent hover:bg-transparent'>
                      {action.buttonText}
                    </Button>
                  </div>
                ) : (
                  <Link to={action.link}>
                    <div className='bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 shadow-md hover:shadow-lg'>
                      <Button variant='outline' className='w-full border-none bg-transparent hover:bg-transparent'>
                        {action.buttonText}
                      </Button>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default QuickActionsSection;
