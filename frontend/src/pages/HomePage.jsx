import React from 'react';
import { Box } from '@mantine/core';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';

const HomePage = () => {
    return (
        <Box mih="100vh" bg="white">
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
        </Box>
    );
};

export default HomePage;