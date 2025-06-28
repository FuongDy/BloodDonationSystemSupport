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
    <div className='min-h-screen bg-white'>
      <main className='pt-16'>
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
