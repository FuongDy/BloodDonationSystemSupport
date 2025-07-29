// src/pages/MyDonationHistoryPage.jsx
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import CCCDVerificationBanner from '../components/common/CCCDVerificationBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  DonationHistoryErrorState,
  DonationHistoryHeader,
  DonationHistoryTable,
  DonationStatsGrid
} from '../components/donation';
import DonationDetailModal from '../components/donation/DonationDetailModal';
import { useAuth } from '../hooks/useAuth';
import { useDonationHistory } from '../hooks/useDonationHistory';

const MyDonationHistoryPage = () => {
  const { user } = useAuth();
  const { donationProcesses, loading, error, stats, handleRefresh } = useDonationHistory();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(6);

  const [activeTab, setActiveTab] = useState('STANDARD');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle view details
  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonation(null);
  };


  // Filter donations by type
  const filteredDonations = useMemo(() => {
    return donationProcesses.filter(process => 
      (process.donationType || 'STANDARD') === activeTab
    );
  }, [donationProcesses, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDonations.length / pageSize) || 1;
  const paginatedDonations = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredDonations.slice(startIdx, startIdx + pageSize);
  }, [filteredDonations, currentPage, pageSize]);

  // Calculate stats for current tab
  const tabStats = useMemo(() => {
    const filtered = filteredDonations;
    const total = filtered.length;
    const completed = filtered.filter(p => p.status === 'COMPLETED').length;
    const scheduled = filtered.filter(p => p.status === 'SCHEDULED').length;
    const pending = filtered.filter(p => p.status === 'PENDING').length;
    const totalVolume = filtered
      .filter(p => p.status === 'COMPLETED' && p.collectedVolumeMl)
      .reduce((sum, p) => sum + p.collectedVolumeMl, 0);

    return {
      total,
      completed,
      scheduled,
      pending,
      totalVolume,
    };
  }, [filteredDonations]);

  const tabs = [
    {
      id: 'STANDARD',
      name: 'Hiến máu định kỳ',
      description: 'Hiến máu tình nguyện theo lịch trình',
      icon: Clock,
      color: 'blue',
      count: donationProcesses.filter(p => (p.donationType || 'STANDARD') === 'STANDARD').length
    },
    {
      id: 'EMERGENCY',
      name: 'Hiến máu khẩn cấp',
      description: 'Hiến máu đáp ứng yêu cầu khẩn cấp',
      icon: AlertTriangle,
      color: 'red',
      count: donationProcesses.filter(p => p.donationType === 'EMERGENCY').length
    }
  ];

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
        
        <CCCDVerificationBanner 
          user={user} 
          className="mb-6"
          showOnVerified={false}
        />

        {/* Donation Type Tabs */}
        <div className='bg-white rounded-lg shadow-sm mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8 px-6' aria-label='Tabs'>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                const colorClasses = {
                  blue: {
                    active: 'border-blue-500 text-blue-600',
                    inactive: 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
                  },
                  red: {
                    active: 'border-red-500 text-red-600', 
                    inactive: 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300'
                  }
                };

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive 
                        ? colorClasses[tab.color].active
                        : colorClasses[tab.color].inactive
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent 
                      className={`
                        -ml-0.5 mr-2 h-5 w-5 transition-colors
                        ${isActive 
                          ? tab.color === 'blue' ? 'text-blue-500' : 'text-red-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                        }
                      `}
                      aria-hidden='true'
                    />
                    <span>{tab.name}</span>
                    <span className={`
                      ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                      ${isActive
                        ? tab.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-900'
                      }
                    `}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Description */}
          <div className='px-6 py-4 bg-gray-50'>
            <p className='text-sm text-gray-600'>
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        <DonationStatsGrid stats={tabStats} />

        {error ? (
          <DonationHistoryErrorState 
            error={error} 
            onRetry={handleRefresh} 
          />
        ) : filteredDonations.length === 0 ? (
          <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
            <div className='text-gray-400 mb-4'>
              {activeTab === 'EMERGENCY' ? (
                <AlertTriangle className='w-16 h-16 mx-auto' />
              ) : (
                <Clock className='w-16 h-16 mx-auto' />
              )}
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {activeTab === 'EMERGENCY' 
                ? 'Chưa có hiến máu khẩn cấp' 
                : 'Chưa có hiến máu định kỳ'
              }
            </h3>
            <p className='text-gray-600 mb-6'>
              {activeTab === 'EMERGENCY'
                ? 'Bạn chưa tham gia hiến máu khẩn cấp nào. Hiến máu khẩn cấp giúp cứu sống những bệnh nhân cần máu gấp.'
                : 'Bạn chưa có lần hiến máu định kỳ nào. Hiến máu định kỳ giúp duy trì nguồn máu ổn định cho bệnh viện.'
              }
            </p>
            <Link
              to='/request-donation'
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors
                ${activeTab === 'EMERGENCY'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {activeTab === 'EMERGENCY' ? (
                <AlertTriangle className='w-5 h-5 mr-2' />
              ) : (
                <Clock className='w-5 h-5 mr-2' />
              )}
              {activeTab === 'EMERGENCY' 
                ? 'Đăng Ký Hiến Máu Khẩn Cấp'
                : 'Đăng Ký Hiến Máu Định Kỳ'
              }
              <ChevronRight className='w-5 h-5 ml-2' />
            </Link>
          </div>
        ) : (
          <>
            <DonationHistoryTable 
              donationProcesses={paginatedDonations} 
              onViewDetails={handleViewDetails}
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
          </>
        )}

        {/* Detail Modal */}
        <DonationDetailModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          donation={selectedDonation}
          user={user}
        />
      </div>
    </div>
  );
};

export default MyDonationHistoryPage;
