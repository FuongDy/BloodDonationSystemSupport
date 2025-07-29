import React, { Suspense } from 'react';
import { HeroSection, QuickActionsSection } from '../components/home';

// Lazy load các component nặng
const UrgencySection = React.lazy(
  () => import('../components/home/UrgencySection')
);
const BloodCompatibilitySection = React.lazy(
  () => import('../components/home/BloodCompatibilitySection')
);
const StatsSection = React.lazy(
  () => import('../components/home/StatsSection')
);
const BlogSection = React.lazy(() => import('../components/home/BlogSection'));
const FeaturesSection = React.lazy(
  () => import('../components/home/FeaturesSection')
);
const CTASection = React.lazy(() => import('../components/home/CTASection'));

// Component loading placeholder nhẹ
const LoadingSection = () => (
  <div className='py-16'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='animate-pulse space-y-6'>
        <div className='h-8 bg-gray-200 rounded w-1/3 mx-auto'></div>
        <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto'></div>
        <div className='grid md:grid-cols-3 gap-6'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-64 bg-gray-200 rounded-xl'></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className='min-h-screen bg-white'>
      <main className='relative pt-16'>
        <HeroSection />

        <Suspense fallback={<LoadingSection />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <StatsSection />
        </Suspense>

        {/* Lazy load các component khác */}
        <Suspense fallback={<LoadingSection />}>
          <UrgencySection />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <BloodCompatibilitySection />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <BlogSection />
        </Suspense>

        <QuickActionsSection />

        <Suspense fallback={<LoadingSection />}>
          <CTASection />
        </Suspense>
      </main>
    </div>
  );
};

export default HomePage;
