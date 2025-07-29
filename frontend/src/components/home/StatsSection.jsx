// src/components/home/StatsSection.jsx
import React, { useMemo } from 'react';
import { Users, Droplet, Heart } from 'lucide-react';
import PageContainer from '../layout/PageContainer';

const StatsSection = () => {
  // Memoize static data
  const stats = useMemo(() => [
    { number: '10,000+', label: 'Người hiến máu', icon: Users },
    { number: '5,000+', label: 'Lượt hiến máu thành công', icon: Droplet },
    { number: '50+', label: 'Bệnh viện & Đối tác', icon: Heart },
  ], []);

  return (
    <section className='py-16 bg-red-600 text-white'>
      <PageContainer>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          {stats.map((stat) => (
            <div key={stat.label} className='bg-white/10 rounded-xl p-8 border border-white/20'>
              <div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <stat.icon className='w-8 h-8 text-white' />
              </div>
              <div className='text-4xl font-bold mb-2'>{stat.number}</div>
              <div className='text-red-100 text-lg'>{stat.label}</div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default React.memo(StatsSection);
