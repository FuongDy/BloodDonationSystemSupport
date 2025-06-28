// src/components/donation/request/DonationRequestForm.jsx
import React from 'react';
import DonationFormHeader from './DonationFormHeader';
import AuthNotice from './AuthNotice';
import DonationDateSection from './DonationDateSection';
import DonationLocationSection from './DonationLocationSection';
import DonationNotesSection from './DonationNotesSection';
import DonationSubmitSection from './DonationSubmitSection';

const DonationRequestForm = ({
  formData,
  loading,
  isAuthenticated,
  onChange,
  onSubmit,
}) => {
  return (
    <div className='xl:col-span-2 order-1 xl:order-2'>
      <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
        <DonationFormHeader />
        
        <AuthNotice isAuthenticated={isAuthenticated} />
        
        <form onSubmit={onSubmit} className='space-y-6'>
          <DonationDateSection
            appointmentDate={formData.appointmentDate}
            onChange={onChange}
            loading={loading}
          />

          <DonationLocationSection />

          <DonationNotesSection
            notes={formData.notes}
            onChange={onChange}
            loading={loading}
          />

          <DonationSubmitSection
            loading={loading}
            onSubmit={onSubmit}
          />
        </form>
      </div>
    </div>
  );
};

export default DonationRequestForm;
