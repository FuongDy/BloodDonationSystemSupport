import React from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useRequestDonation } from '../hooks/useRequestDonation';
import {
  DonationHeroSection,
  DonationSidebar,
  DonationRequestForm,
} from '../components/donation/request';

const RequestDonationPage = () => {
  const {
    formData,
    loading,
    showConfirmModal,
    isAuthenticated,
    setShowConfirmModal,
    handleChange,
    handleSubmit,
    handleConfirmSubmit,
  } = useRequestDonation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-x-hidden'>
      <DonationHeroSection />

      <div className='container mx-auto px-4 py-12 overflow-x-hidden'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8'>
            <DonationSidebar />

            <DonationRequestForm
              formData={formData}
              loading={loading}
              isAuthenticated={isAuthenticated}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title='Xác nhận đăng ký hiến máu'
        footerContent={
          <>
            <Button
              variant='outline'
              onClick={() => setShowConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant='primary'
              onClick={handleConfirmSubmit}
              isLoading={loading}
            >
              Xác nhận đăng ký
            </Button>
          </>
        }
      >
        <div>
          <p className='mb-4'>
            Bạn có chắc chắn muốn đăng ký hiến máu? Chúng tôi sẽ liên hệ với bạn để sắp xếp lịch hẹn phù hợp.
          </p>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <p className='text-sm text-blue-800'>
              <strong>Lưu ý:</strong> Vui lòng đảm bảo thông tin cá nhân của bạn đã chính xác. 
              Nhân viên sẽ liên hệ để sắp xếp thời gian hiến máu phù hợp với lịch trình của bạn.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestDonationPage;
