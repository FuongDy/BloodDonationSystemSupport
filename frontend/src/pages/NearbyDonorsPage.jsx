// src/pages/NearbyDonorsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DonorSearchControls from '../components/nearby/DonorSearchControls';
import DonorList from '../components/nearby/DonorList';
import useNearbyDonors from '../hooks/useNearbyDonors';
import LoadingSpinner from '../components/common/LoadingSpinner';
import bloodTypeService from '../services/bloodTypeService';
import toast from 'react-hot-toast';
import ContactDonorModal from '../components/nearby/ContactDonorModal'; // Import the new modal

const NearbyDonorsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasSearched, setHasSearched] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const {
    searchParams,
    handleSearch,
    donors,
    isLoading: donorsLoading,
    error,
    triggerSearch,
  } = useNearbyDonors();

  // State for the contact modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        const data = await bloodTypeService.getAll();
        const uniqueBloodTypes = data.filter((bt, index, self) =>
            index === self.findIndex(t => t.bloodGroup === bt.bloodGroup)
        );
        setBloodTypes(uniqueBloodTypes || []);
      } catch (error) {
        console.error("Failed to fetch blood types for page:", error);
      }
    };
    fetchBloodTypes();
  }, []);

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="12" />
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/find-donors' } }} replace />;
  }

  const onSearch = () => {
    if (searchParams.latitude && searchParams.longitude) {
      triggerSearch();
      setHasSearched(true);
    } else {
      toast.error("Vui lòng chọn một địa chỉ hợp lệ để tìm kiếm.");
    }
  };

  // Handlers for the contact modal
  const handleOpenContactModal = (donor) => {
    setSelectedDonor(donor);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedDonor(null);
  };

  return (
      <>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">Tìm người hiến máu</h1>
              <p className="text-gray-600">Tìm kiếm người hiến máu phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-4">
                <DonorSearchControls
                    searchParams={searchParams}
                    onSearchChange={handleSearch}
                    onSearch={onSearch}
                    isLoading={donorsLoading}
                    bloodTypes={bloodTypes}
                />
              </div>

              <div className="lg:col-span-8">
                <div className='bg-white p-4 rounded-lg border border-gray-200 min-h-[600px] flex flex-col'>
                  <h3 className="text-lg font-semibold mb-4 flex-shrink-0 border-b pb-3">Kết quả tìm kiếm</h3>
                  <div className="flex-grow pt-4">
                    <DonorList
                        donors={donors}
                        isLoading={donorsLoading}
                        error={error}
                        hasSearched={hasSearched}
                        searchParams={searchParams}
                        bloodTypes={bloodTypes}
                        onContact={handleOpenContactModal} // Pass the handler down
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Render the modal */}
        <ContactDonorModal
            isOpen={isContactModalOpen}
            onClose={handleCloseContactModal}
            donor={selectedDonor}
        />
      </>
  );
};

export default NearbyDonorsPage;