// src/components/donation/DonationHistoryTable.jsx
import React from 'react';
import DonationTableDesktop from './DonationTableDesktop';
import DonationCardMobile from './DonationCardMobile';

const DonationHistoryTable = ({ donationProcesses }) => {
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
      {/* Desktop Table View */}
      <DonationTableDesktop donationProcesses={donationProcesses} />
      
      {/* Mobile Card View */}
      <div className='lg:hidden space-y-4 p-4'>
        {donationProcesses.map(process => (
          <DonationCardMobile 
            key={process.id} 
            process={process} 
          />
        ))}
      </div>
    </div>
  );
};

export default DonationHistoryTable;
