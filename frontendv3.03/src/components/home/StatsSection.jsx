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
    <section className='section-padding bg-gradient-to-br from-red-600 via-red-700 to-pink-600 text-white relative overflow-hidden'>
      {/* Enhanced Glass Background */}
      <div className='absolute inset-0 bg-gradient-to-r from-red-700/30 to-pink-600/30'></div>
      <div className='absolute inset-0 bg-black/10 backdrop-blur-sm'></div>
      
      {/* Floating Elements */}
      <div className='absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse'></div>
      <div className='absolute bottom-10 right-10 w-32 h-32 bg-pink-300/10 rounded-full blur-xl animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-300/5 rounded-full blur-3xl'></div>
      
      <PageContainer className='relative'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className='animate-fade-in-up group'
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glass Card */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1'>
                <div className='mb-4'>
                  <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg group-hover:bg-white/25 transition-all duration-300'>
                    <stat.icon className='w-8 h-8 text-white drop-shadow-lg' />
                  </div>
                </div>
                <div className='text-4xl lg:text-5xl font-bold mb-2 animate-pulse-soft drop-shadow-lg'>
                  {stat.number}
                </div>
                <div className='text-red-100 text-lg drop-shadow-sm'>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default StatsSection;
