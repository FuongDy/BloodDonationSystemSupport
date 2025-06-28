// src/pages/MyDonationHistoryPage.jsx
import React from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  DonationHistoryHeader,
  DonationStatsGrid,
  DonationHistoryTable,
  DonationHistoryEmptyState,
  DonationHistoryErrorState,
} from '../components/donation';
import { useDonationHistory } from '../hooks/useDonationHistory';

const MyDonationHistoryPage = () => {
  const { donationProcesses, loading, error, stats, handleRefresh } = useDonationHistory();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size='large' />
          <p className='mt-4 text-gray-600'>Đang tải lịch sử hiến máu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <DonationHistoryHeader />
        <DonationStatsGrid stats={stats} />

        {error ? (
          <DonationHistoryErrorState 
            error={error} 
            onRetry={handleRefresh} 
          />
        ) : donationProcesses.length === 0 ? (
          <DonationHistoryEmptyState />
        ) : (
          <DonationHistoryTable donationProcesses={donationProcesses} />
        )}
      </div>
    </div>
  );
};

export default MyDonationHistoryPage;
