// src/pages/MyAppointmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import StatusBadge from '../components/common/StatusBadge';
import DateTimeDisplay from '../components/common/DateTimeDisplay';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';

const PAGE_SIZE = 5;

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyAppointments(page);
    }
  }, [isAuthenticated, page]);

  const fetchMyAppointments = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getMyAppointments({
        page: pageNum,
        size: PAGE_SIZE,
      });
      setAppointments(data.content || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn');
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RESCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenReschedule = appointmentId => {
    setSelectedAppointmentId(appointmentId);
    setRescheduleReason('');
    setShowRescheduleDialog(true);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleReason.trim()) {
      toast.error('Vui lòng nhập lý do đổi lịch');
      return;
    }
    // eslint-disable-next-line no-alert
    if (!window.confirm('Bạn chắc chắn muốn yêu cầu đổi lịch này?')) return;
    try {
      await appointmentService.requestReschedule(selectedAppointmentId, {
        reason: rescheduleReason,
      });
      toast.success('Yêu cầu đổi lịch đã được gửi!');
      setShowRescheduleDialog(false);
      fetchMyAppointments(page);
    } catch {
      toast.error('Gửi yêu cầu đổi lịch thất bại');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message='Đang tải lịch hẹn...' />
      </MainLayout>
    );
  }

  return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Lịch hẹn của tôi
          </h1>
          <p className='text-gray-600'>
            Xem và quản lý các lịch hẹn hiến máu của bạn
          </p>
        </div>

        {appointments.length === 0 ? (
          <EmptyState
            title='Chưa có lịch hẹn nào'
            description='Bạn chưa có lịch hẹn hiến máu nào. Hãy đăng ký hiến máu để tạo lịch hẹn.'
            action={{
              label: 'Đăng ký hiến máu',
              href: '/request-donation',
            }}
          />
        ) : (
          <>
            <div className='grid gap-6'>
              {appointments.map(appointment => (
                <Card
                  key={appointment.id}
                  className='hover:shadow-lg transition-shadow'
                >
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-xl'>
                        Lịch hẹn hiến máu #{appointment.id}
                      </CardTitle>
                      <StatusBadge
                        status={appointment.status}
                        className={getStatusColor(appointment.status)}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div className='flex items-center space-x-3'>
                        <Calendar className='w-5 h-5 text-blue-500' />
                        <div>
                          <p className='font-medium'>Ngày giờ hẹn</p>
                          <DateTimeDisplay
                            date={appointment.appointmentDateTime}
                            format='full'
                          />
                        </div>
                      </div>

                      <div className='flex items-center space-x-3'>
                        <MapPin className='w-5 h-5 text-green-500' />
                        <div>
                          <p className='font-medium'>Địa điểm</p>
                          <p className='text-gray-600'>
                            {appointment.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className='bg-gray-50 p-3 rounded-lg'>
                        <p className='font-medium text-gray-700 mb-1'>
                          Ghi chú:
                        </p>
                        <p className='text-gray-600'>{appointment.notes}</p>
                      </div>
                    )}

                    <div className='flex items-center justify-between pt-4 border-t'>
                      <div className='flex items-center space-x-2 text-sm text-gray-500'>
                        <Clock className='w-4 h-4' />
                        <span>Tạo lúc: </span>
                        <DateTimeDisplay
                          date={appointment.createdAt}
                          format='short'
                        />
                      </div>

                      {appointment.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleOpenReschedule(appointment.id)}
                          className='text-blue-600 hover:text-blue-800 font-medium'
                        >
                          Yêu cầu đổi lịch
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className='mt-8 flex justify-center'>
              <Pagination
                currentPage={page - 1}
                totalPages={totalPages}
                onPageChange={p => setPage(p + 1)}
              />
            </div>
            <Modal
              open={showRescheduleDialog}
              onClose={() => setShowRescheduleDialog(false)}
            >
              <div className='p-4'>
                <h2 className='text-lg font-bold mb-2'>Yêu cầu đổi lịch</h2>
                <textarea
                  className='w-full border rounded p-2 mb-4'
                  rows={3}
                  placeholder='Nhập lý do đổi lịch...'
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                />
                <div className='flex justify-end space-x-2'>
                  <button
                    className='px-4 py-2 bg-gray-200 rounded'
                    onClick={() => setShowRescheduleDialog(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded'
                    onClick={handleConfirmReschedule}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
  );
};

export default MyAppointmentsPage;
