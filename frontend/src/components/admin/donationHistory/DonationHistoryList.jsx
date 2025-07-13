// src/components/admin/donationHistory/DonationHistoryList.jsx
import React from 'react';
import DonationCard from '../DonationCard';

const DonationHistoryList = ({ 
  donations, 
  onSelectDonation, 
  onStatusUpdate 
}) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {donations.map(donation => (
        <DonationCard
          key={donation.id}
          donation={donation}
          onViewDetails={onSelectDonation}
          onStatusUpdate={onStatusUpdate}
          showActions={true}
        />
      ))}
    </div>
  );
};

export default DonationHistoryList;
