// src/pages/EmergencyBloodRequestsPage.jsx
import React from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useEmergencyBloodRequests } from '../hooks/useEmergencyBloodRequests';
import {
  EmergencyPageHeader,
  HospitalInfoBanner,
  EmergencyRequestsList,
} from '../components/emergency';

const EmergencyBloodRequestsPage = () => {
  const {
    requests,
    isLoading,
    fetchActiveRequests,
    handlePledgeSuccess,
  } = useEmergencyBloodRequests();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-center items-center py-20'>
            <LoadingSpinner size='12' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <EmergencyPageHeader onRefresh={fetchActiveRequests} />
        <HospitalInfoBanner />
        <EmergencyRequestsList
          requests={requests}
          onPledgeSuccess={handlePledgeSuccess}
        />
      </div>
    </div>
  );
};

export default EmergencyBloodRequestsPage;
