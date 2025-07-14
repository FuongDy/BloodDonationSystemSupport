import React from 'react';
import {
  HeroSection,
  QuickActionsSection,
  StatsSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
} from '../components/home';

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 relative overflow-hidden'>
      {/* Background Glass Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-100/20 via-transparent to-pink-100/20'></div>
      <div className='absolute top-0 left-0 w-full h-full bg-white/60 backdrop-blur-3xl'></div>
      
      <main className='relative pt-16'>
        <HeroSection />
        <QuickActionsSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default HomePage;
