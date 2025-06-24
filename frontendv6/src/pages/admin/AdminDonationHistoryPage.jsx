// src/pages/admin/AdminDonationHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import donationService from '../../services/donationService';
import StatusBadge from '../../components/common/StatusBadge';
import DonationCard from '../../components/admin/DonationCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import Button from '../../components/common/Button';
import { HOSPITAL_INFO } from '../../utils/constants';

const AdminDonationHistoryPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const response = await donationService.getAllDonationRequests();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Lỗi khi tải đơn yêu cầu hiến máu');
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await donationService.updateDonationStatus(donationId, { newStatus });
      toast.success('Cập nhật trạng thái thành công');
      fetchDonations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const renderEmptyState = () => (
    <AdminEmptyState
      icon={Calendar}
      title="Chưa có đơn yêu cầu hiến máu nào"
      description="Hiện tại chưa có ai đăng ký hiến máu trong hệ thống."
    />
  );

  return (
    <AdminPageLayout
      title='Quản lý đơn yêu cầu hiến máu'
      description='Theo dõi và quản lý tất cả các quy trình hiến máu'
    >
      <AdminContentWrapper
        isLoading={isLoading}
        isEmpty={donations.length === 0}
        emptyStateComponent={renderEmptyState()}
      >
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Donation List */}
          <div className='lg:col-span-2 space-y-4'>
            {donations.map(donation => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onViewDetails={setSelectedDonation}
                onStatusUpdate={handleStatusUpdate}
                showActions={true}
              />
            ))}
          </div>

          {/* Donation Details */}
          <div className='lg:col-span-1'>
            {selectedDonation ? (
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết hiến máu</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-medium'>Người hiến máu</h4>
                    <p className='text-sm text-gray-600'>
                      {selectedDonation.donor?.fullName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {selectedDonation.donor?.email}
                    </p>
                  </div>

                  <div>
                    <h4 className='font-medium'>Trạng thái</h4>
                    <StatusBadge status={selectedDonation.status} type="donation" />
                  </div>

                  {selectedDonation.appointment && (
                    <div>
                      <h4 className='font-medium'>Lịch hẹn</h4>
                      <p className='text-sm text-gray-600'>
                        {new Date(
                          selectedDonation.appointment.appointmentDateTime
                        ).toLocaleString('vi-VN')}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {HOSPITAL_INFO.FULL_NAME}
                      </p>
                    </div>
                  )}

                  {selectedDonation.note && (
                    <div>
                      <h4 className='font-medium'>Ghi chú</h4>
                      <p className='text-sm text-gray-600'>
                        {selectedDonation.note}
                      </p>
                    </div>
                  )}

                  {/* Status Update Actions */}
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Cập nhật trạng thái</h4>
                    {selectedDonation.status === 'PENDING_APPROVAL' && (
                      <div className='space-y-2'>
                        <Button
                          size='sm'
                          className='w-full'
                          onClick={() =>
                            handleStatusUpdate(
                              selectedDonation.id,
                              'APPOINTMENT_PENDING'
                            )
                          }
                        >
                          Duyệt đơn
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full'
                          onClick={() =>
                            handleStatusUpdate(selectedDonation.id, 'REJECTED')
                          }
                        >
                          Từ chối
                        </Button>
                      </div>
                    )}

                    {selectedDonation.status === 'APPOINTMENT_SCHEDULED' && (
                      <Button
                        size='sm'
                        className='w-full'
                        onClick={() =>
                          handleStatusUpdate(
                            selectedDonation.id,
                            'HEALTH_CHECK_PASSED'
                          )
                        }
                      >
                        Khám sàng lọc đạt
                      </Button>
                    )}

                    {selectedDonation.status === 'HEALTH_CHECK_PASSED' && (
                      <Button
                        size='sm'
                        className='w-full'
                        onClick={() =>
                          handleStatusUpdate(
                            selectedDonation.id,
                            'BLOOD_COLLECTED'
                          )
                        }
                      >
                        Đã lấy máu
                      </Button>
                    )}

                    {selectedDonation.status === 'BLOOD_COLLECTED' && (
                      <div className='space-y-2'>
                        <Button
                          size='sm'
                          className='w-full'
                          onClick={() =>
                            handleStatusUpdate(
                              selectedDonation.id,
                              'TESTING_PASSED'
                            )
                          }
                        >
                          Xét nghiệm đạt
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full'
                          onClick={() =>
                            handleStatusUpdate(
                              selectedDonation.id,
                              'TESTING_FAILED'
                            )
                          }
                        >
                          Xét nghiệm không đạt
                        </Button>
                      </div>
                    )}

                    {selectedDonation.status === 'TESTING_PASSED' && (
                      <Button
                        size='sm'
                        className='w-full'
                        onClick={() =>
                          handleStatusUpdate(selectedDonation.id, 'COMPLETED')
                        }
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className='p-6 text-center text-gray-500'>
                  Chọn một quy trình hiến máu để xem chi tiết
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminContentWrapper>
    </AdminPageLayout>
  );
};

export default AdminDonationHistoryPage;

