// src/components/donation/request/DonationSidebar.jsx
import React from 'react';
import DonationProcessCard from './DonationProcessCard';
import DonationBenefitsCard from './DonationBenefitsCard';

const DonationSidebar = () => {
  return (
    <div className='xl:col-span-1 space-y-6 order-2 xl:order-1'>
      <DonationProcessCard />
      <DonationBenefitsCard />
    </div>
  );
};

export default DonationSidebar;
