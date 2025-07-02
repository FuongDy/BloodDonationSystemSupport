import React, { useState, useEffect } from 'react';
import DonorSearchControls from '../../components/nearby/DonorSearchControls';
import DonorList from '../../components/nearby/DonorList';
import useNearbyDonors from '../../hooks/useNearbyDonors';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import bloodTypeService from '../../services/bloodTypeService';
import toast from 'react-hot-toast';

const AdminFindDonorPage = () => {
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

  // Fetch blood types once for the whole page
  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        const data = await bloodTypeService.getAll();
        const uniqueBloodTypes = data.filter((bt, index, self) =>
          index === self.findIndex(t => t.bloodGroup === bt.bloodGroup)
        );
        setBloodTypes(uniqueBloodTypes || []);
      } catch (error) {
        console.error('Failed to fetch blood types for page:', error);
      }
    };
    fetchBloodTypes();
  }, []);

  const onSearch = () => {
    if (searchParams.latitude && searchParams.longitude) {
      triggerSearch();
      setHasSearched(true);
    } else {
      toast.error('Vui lòng chọn một địa chỉ hợp lệ để tìm kiếm.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <PageHeader
            title="Tìm kiếm người hiến máu gần đây"
            description="Tìm kiếm và liên hệ với người hiến máu phù hợp theo vị trí, nhóm máu, bán kính..."
          />
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFindDonorPage; 