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
    <section className='section-padding bg-gray-50'>
      <PageContainer>
        <div className='text-center mb-12'>
          <h2 className='heading-2 mb-4'>Bắt đầu ngay hôm nay</h2>
          <p className='text-body-large max-w-2xl mx-auto'>
            Chọn hành động phù hợp với bạn để tham gia vào cộng đồng hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {quickActions.map((action) => (
            <Card key={action.title} hover className='text-center group'>
              <CardContent className='p-8'>
                <div className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${action.hoverColor} transition-colors`}>
                  <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                </div>
                <h3 className='text-xl font-semibold mb-2'>{action.title}</h3>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default QuickActionsSection;
