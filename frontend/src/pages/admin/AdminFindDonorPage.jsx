import { Heart, MapPin, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import ContactDonorModal from '../../components/nearby/ContactDonorModal';
import DonorList from '../../components/nearby/DonorList';
import DonorSearchControls from '../../components/nearby/DonorSearchControls';
import useNearbyDonors from '../../hooks/useNearbyDonors';
import bloodTypeService from '../../services/bloodTypeService';

const AdminFindDonorPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
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

  // Handlers for the contact modal
  const handleOpenContactModal = (donor) => {
    setSelectedDonor(donor);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedDonor(null);
  };

  // Calculate stats
  const totalDonors = donors?.length || 0;
  const availableDonors = donors?.filter(donor => donor.isAvailable)?.length || 0;
  const verifiedDonors = donors?.filter(donor => donor.isVerified)?.length || 0;
  const avgDistance = donors?.length > 0 ? 
    Math.round(donors.reduce((sum, donor) => sum + (donor.distance || 0), 0) / donors.length * 10) / 10 : 0;

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Tìm người hiến máu"
        description="Tìm kiếm và liên hệ với những người hiến máu phù hợp theo vị trí địa lý, nhóm máu và độ ưu tiên."
        variant="find-donor"
        showActivityFeed={false}
        stats={[
          {
            icon: <Search className="w-5 h-5 text-pink-300" />,
            value: totalDonors,
            label: "Tìm thấy"
          },
          {
            icon: <Users className="w-5 h-5 text-purple-300" />,
            value: availableDonors,
            label: "Sẵn sàng hiến"
          },
          {
            icon: <Heart className="w-5 h-5 text-red-300" />,
            value: verifiedDonors,
            label: "Đã xác thực"
          },
          {
            icon: <MapPin className="w-5 h-5 text-blue-300" />,
            value: `${avgDistance}km`,
            label: "Khoảng cách TB"
          }
        ]}
      />

      <div className="space-y-6">
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
                  onContact={handleOpenContactModal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the contact modal */}
      <ContactDonorModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        donor={selectedDonor}
      />
    </AdminPageLayout>
  );
};

export default AdminFindDonorPage; 