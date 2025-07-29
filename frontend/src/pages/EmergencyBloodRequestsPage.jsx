// src/pages/EmergencyBloodRequestsPage.jsx
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmergencyHeroSection from '../components/emergency/EmergencyHeroSection';
import EmergencyRequestsList from '../components/emergency/EmergencyRequestsList';
import EmergencySearchAndFilter from '../components/emergency/EmergencySearchAndFilter';
import HospitalInfoBanner from '../components/emergency/HospitalInfoBanner';
import { useEmergencyBloodRequests } from '../hooks/useEmergencyBloodRequests';
import Pagination from '@mui/material/Pagination';
import { useState, useMemo } from 'react';

const EmergencyBloodRequestsPage = () => {
  const {
    requests,
    filteredRequests,
    totalRequests,
    isLoading,
    searchTerm,
    bloodGroupFilter,
    urgencyFilter,
    handleSearchChange,
    handleBloodGroupChange,
    handleUrgencyChange,
    handleClearFilters,
    fetchActiveRequests,
    handlePledgeSuccess,
  } = useEmergencyBloodRequests();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [pageSize] = useState(6);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredRequests.slice(startIdx, startIdx + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

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
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      <EmergencyHeroSection />
      <div className='container mx-auto px-4 py-12'>
        <HospitalInfoBanner />
        
        {/* Search and Filter */}
        <EmergencySearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          bloodGroupFilter={bloodGroupFilter}
          onBloodGroupChange={handleBloodGroupChange}
          urgencyFilter={urgencyFilter}
          onUrgencyChange={handleUrgencyChange}
          onClearFilters={handleClearFilters}
          totalResults={totalRequests}
          filteredResults={filteredRequests.length}
        />
        
        <EmergencyRequestsList
          requests={paginatedRequests}
          onPledgeSuccess={handlePledgeSuccess}
        />
        <div className="flex justify-center my-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyBloodRequestsPage;
