import React from 'react';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <main className="pt-16">
                <FeaturesSection />
                <StatsSection />
            </main>
        </div>
    );
};

export default HomePage;