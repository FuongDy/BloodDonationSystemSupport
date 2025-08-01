// src/components/donation/DonationHistoryTable.jsx
import React from 'react';
import DonationTableDesktop from './DonationTableDesktop';
import DonationCardMobile from './DonationCardMobile';
import { useAuth } from '../../hooks/useAuth';

const DonationHistoryTable = ({ donationProcesses, onViewDetails }) => {
  const { user } = useAuth();
  
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
      {/* Desktop Table View */}
      <DonationTableDesktop 
        donationProcesses={donationProcesses} 
        user={user} 
        onViewDetails={onViewDetails}
      />
      
      {/* Mobile Card View
      <div className='lg:hidden space-y-4 p-4'>
        {donationProcesses.map(process => (
          <DonationCardMobile 
            key={process.id} 
            process={process}
            user={user}
            onViewDetails={onViewDetails}
          />
        ))}
      </div> */}
    </div>
  );
};

export default DonationHistoryTable;
