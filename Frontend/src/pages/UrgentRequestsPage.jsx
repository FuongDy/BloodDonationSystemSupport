import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UrgentRequestCard from '../components/urgent-requests/UrgentRequestCard';
import UrgentRequestFilters from '../components/urgent-requests/UrgentRequestFilters';
import apiClient from '../services/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ShieldAlert, PlusCircle } from 'lucide-react';
import UrgentRequestDetailModal from '../components/urgent-requests/UrgentRequestDetailModal';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const UrgentRequestsPage = () => {
  const { user } = useAuth(); // Get user from auth context
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    bloodType: '',
    urgency: '',
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchUrgentRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/urgent-requests');
        setRequests(response.data);
      } catch (err) {
        setError('Không thể tải danh sách các trường hợp khẩn cấp. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrgentRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests
      .filter(req => {
        // Filter by blood type
        return filters.bloodType ? req.bloodType === filters.bloodType : true;
      })
      .filter(req => {
        // Filter by urgency
        return filters.urgency ? req.urgency === filters.urgency : true;
      })
      .filter(req => {
        // Filter by search term
        const searchTerm = filters.searchTerm.toLowerCase();
        if (!searchTerm) return true;
        return (
          req.patientName.toLowerCase().includes(searchTerm) ||
          req.hospital.toLowerCase().includes(searchTerm) ||
          req.location.toLowerCase().includes(searchTerm)
        );
      });
  }, [requests, filters]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-10 relative">
            <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">Các Trường Hợp Cần Máu Khẩn Cấp</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
                Mỗi giọt máu cho đi, một cuộc đời ở lại. Hãy cùng chung tay giúp đỡ những bệnh nhân đang cần máu.
            </p>

            {/* Add Create Request Button for Admin/Staff */}
            {user && (user.role === 'Admin' || user.role === 'Staff') && (
                <div className="absolute top-0 right-0">
                    <Link to="/urgent-requests/create">
                        <Button variant="primary">
                            <PlusCircle size={20} className="mr-2" />
                            Tạo yêu cầu mới
                        </Button>
                    </Link>
                </div>
            )}
        </div>

        {/* Filters */}
        <UrgentRequestFilters filters={filters} setFilters={setFilters} />

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Tìm thấy <span className="font-bold text-red-600">{filteredRequests.length}</span> trường hợp cần máu khẩn cấp.
            </p>
            {filteredRequests.length > 0 ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRequests.map(request => (
                        <UrgentRequestCard 
                            key={request.id} 
                            request={request} 
                            onViewDetails={() => handleViewDetails(request)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">Không tìm thấy kết quả phù hợp</h3>
                    <p>Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
                </div>
            )}
          </div>
        )}
      </main>
      <Footer />

      <UrgentRequestDetailModal 
        request={selectedRequest} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default UrgentRequestsPage;
