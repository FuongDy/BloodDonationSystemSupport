// src/components/home/StatsSection.jsx
import React from 'react';
import { Users, Droplet, Heart } from 'lucide-react';
import PageContainer from '../layout/PageContainer';

const StatsSection = () => {
  const stats = [
    { number: '10,000+', label: 'Người hiến máu', icon: Users },
    { number: '5,000+', label: 'Lượt hiến máu thành công', icon: Droplet },
    { number: '50+', label: 'Bệnh viện & Đối tác', icon: Heart },
  ];

  return (
    <section className='section-padding bg-red-600 text-white relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-r from-red-700/20 to-pink-600/20'></div>
      <PageContainer className='relative'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className='animate-fade-in-up'
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className='mb-4'>
                <stat.icon className='w-12 h-12 mx-auto mb-2 text-red-200' />
              </div>
              <div className='text-4xl lg:text-5xl font-bold mb-2 animate-pulse-soft'>
                {stat.number}
              </div>
              <div className='text-red-100 text-lg'>{stat.label}</div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default StatsSection;
