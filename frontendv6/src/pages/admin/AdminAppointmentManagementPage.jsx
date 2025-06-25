// src/pages/admin/AdminAppointmentManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/common/InputField';
import StatusBadge from '../../components/common/StatusBadge';
import DateTimeDisplay from '../../components/common/DateTimeDisplay';

import appointmentService from '../../services/appointmentService';
import donationService from '../../services/donationService';
import { DONATION_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const AdminAppointmentManagementPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Form states
  const [appointmentForm, setAppointmentForm] = useState({
    processId: '',
    appointmentDateTime: '',
    location: 'Bệnh viện Huyết học - FPT',
    notes: '',
    staffId: null,
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    reason: '',
    suggestedDateTime: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Lấy danh sách tất cả donation processes để hiển thị appointments
      const processResponse = await donationService.getAllDonationRequests();
      const allProcesses = processResponse.data || [];

      // Lọc các processes có appointment
      const processesWithAppointments = allProcesses.filter(p => p.appointment);
      setAppointments(processesWithAppointments);

      // Lấy processes cần tạo appointment (APPOINTMENT_PENDING, RESCHEDULE_REQUESTED)
      const processesNeedingAppointment = allProcesses.filter(
        p =>
          p.status === DONATION_STATUS.APPOINTMENT_PENDING ||
          p.status === DONATION_STATUS.RESCHEDULE_REQUESTED
      );
      setProcesses(processesNeedingAppointment);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu lịch hẹn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!appointmentForm.processId || !appointmentForm.appointmentDateTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await appointmentService.createAppointment(appointmentForm);
      toast.success('Tạo lịch hẹn thành công');
      setShowCreateModal(false);
      setAppointmentForm({
        processId: '',
        appointmentDateTime: '',
        location: 'Bệnh viện Huyết học - FPT',
        notes: '',
        staffId: null,
      });
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Không thể tạo lịch hẹn');
    }
  };

  const handleRequestReschedule = async () => {
    if (!rescheduleForm.reason) {
      toast.error('Vui lòng nhập lý do đổi lịch');
      return;
    }

    try {
      await appointmentService.requestReschedule(
        selectedAppointment.appointment.id,
        rescheduleForm
      );
      toast.success('Yêu cầu đổi lịch thành công');
      setShowRescheduleModal(false);
      setRescheduleForm({ reason: '', suggestedDateTime: '' });
      fetchData();
    } catch (error) {
      console.error('Error requesting reschedule:', error);
      toast.error('Không thể yêu cầu đổi lịch');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case DONATION_STATUS.APPOINTMENT_SCHEDULED:
        return 'info';
      case DONATION_STATUS.RESCHEDULE_REQUESTED:
        return 'warning';
      case DONATION_STATUS.HEALTH_CHECK_PASSED:
        return 'success';
      case DONATION_STATUS.HEALTH_CHECK_FAILED:
        return 'error';
      default:
        return 'info';
    }
  };

  const isUpcoming = dateTime => {
    return new Date(dateTime) > new Date();
  };

  const isPast = dateTime => {
    return new Date(dateTime) < new Date();
  };

  const appointmentColumns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: value => `#${value}`,
    },
    {
      key: 'donor',
      title: 'Người hiến',
      render: value => (
        <div className='flex items-center space-x-2'>
          <User size={16} className='text-gray-400' />
          <div>
            <div className='font-medium'>{value?.fullName || 'N/A'}</div>
            <div className='text-sm text-gray-500 flex items-center space-x-1'>
              <Mail size={12} />
              <span>{value?.email}</span>
            </div>
            {value?.phoneNumber && (
              <div className='text-sm text-gray-500 flex items-center space-x-1'>
                <Phone size={12} />
                <span>{value.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'appointment',
      title: 'Thông tin lịch hẹn',
      render: (value, _process) =>
        value ? (
          <div className='space-y-1'>
            <div className='flex items-center space-x-1'>
              <Calendar
                size={14}
                className={
                  isUpcoming(value.appointmentDateTime)
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }
              />
              <span
                className={`text-sm ${isUpcoming(value.appointmentDateTime) ? 'font-medium' : 'text-gray-500'}`}
              >
                {formatDateTime(value.appointmentDateTime)}
              </span>
            </div>
            <div className='flex items-center space-x-1 text-gray-500'>
              <MapPin size={12} />
              <span className='text-xs'>{value.location}</span>
            </div>
            {value.notes && (
              <div className='text-xs text-gray-400 italic'>{value.notes}</div>
            )}
          </div>
        ) : (
          <span className='text-gray-400'>Chưa có lịch hẹn</span>
        ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: value => (
        <StatusBadge status={value} variant={getStatusColor(value)} />
      ),
    },
    {
      key: 'appointmentStatus',
      title: 'Tình trạng',
      render: (_, process) => {
        const value = process.appointment;
        if (!value) return <span className='text-gray-400'>-</span>;

        const appointmentTime = new Date(value.appointmentDateTime);
        const now = new Date();

        if (appointmentTime > now) {
          return (
            <div className='flex items-center space-x-1 text-green-600'>
              <Clock size={14} />
              <span className='text-sm'>Sắp tới</span>
            </div>
          );
        } else {
          return (
            <div className='flex items-center space-x-1 text-gray-500'>
              <CheckCircle size={14} />
              <span className='text-sm'>Đã qua</span>
            </div>
          );
        }
      },
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, process) => (
        <div className='flex space-x-2'>
          {process.appointment &&
            isUpcoming(process.appointment.appointmentDateTime) && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setSelectedAppointment(process);
                  setRescheduleForm({ reason: '', suggestedDateTime: '' });
                  setShowRescheduleModal(true);
                }}
              >
                <Edit3 size={14} className='mr-1' />
                Đổi lịch
              </Button>
            )}
          <Button
            size='sm'
            variant='outline'
            onClick={() => navigate(`/admin/donation-process/${process.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const headerActions = [
    {
      label: 'Tạo lịch hẹn',
      icon: Plus,
      variant: 'primary',
      onClick: () => {
        setAppointmentForm({
          processId: '',
          appointmentDateTime: '',
          location: 'Bệnh viện Huyết học - FPT',
          notes: '',
          staffId: null,
        });
        setShowCreateModal(true);
      },
    },
    {
      label: 'Làm mới',
      icon: Calendar,
      variant: 'outline',
      onClick: fetchData,
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý Lịch hẹn'
      description='Quản lý lịch hẹn hiến máu và theo dõi tình hình thực hiện'
      headerActions={headerActions}
    >
      <div className='p-6 space-y-6'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-blue-600'>Tổng lịch hẹn</p>
                <p className='text-2xl font-bold text-blue-700'>
                  {appointments.length}
                </p>
              </div>
              <Calendar className='text-blue-500' size={24} />
            </div>
          </div>

          <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-green-600'>Sắp tới</p>
                <p className='text-2xl font-bold text-green-700'>
                  {
                    appointments.filter(
                      a =>
                        a.appointment &&
                        isUpcoming(a.appointment.appointmentDateTime)
                    ).length
                  }
                </p>
              </div>
              <Clock className='text-green-500' size={24} />
            </div>
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-yellow-600'>Cần tạo lịch</p>
                <p className='text-2xl font-bold text-yellow-700'>
                  {processes.length}
                </p>
              </div>
              <AlertTriangle className='text-yellow-500' size={24} />
            </div>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Đã hoàn thành</p>
                <p className='text-2xl font-bold text-gray-700'>
                  {
                    appointments.filter(
                      a =>
                        a.appointment &&
                        isPast(a.appointment.appointmentDateTime)
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className='text-gray-500' size={24} />
            </div>
          </div>
        </div>

        <AdminContentWrapper
          isLoading={isLoading}
          hasData={appointments.length > 0}
          loadingMessage='Đang tải danh sách lịch hẹn...'
          emptyMessage='Chưa có lịch hẹn nào'
        >
          <DataTable
            data={appointments}
            columns={appointmentColumns}
            loading={isLoading}
          />
        </AdminContentWrapper>

        {/* Create Appointment Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title='Tạo lịch hẹn mới'
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Chọn quy trình hiến máu
              </label>
              <select
                value={appointmentForm.processId}
                onChange={e =>
                  setAppointmentForm(prev => ({
                    ...prev,
                    processId: e.target.value,
                  }))
                }
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
              >
                <option value=''>Chọn quy trình</option>
                {processes.map(process => (
                  <option key={process.id} value={process.id}>
                    #{process.id} - {process.donor?.fullName} (
                    {process.donor?.email})
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label='Ngày giờ hẹn'
              type='datetime-local'
              value={appointmentForm.appointmentDateTime}
              onChange={e =>
                setAppointmentForm(prev => ({
                  ...prev,
                  appointmentDateTime: e.target.value,
                }))
              }
              required
            />

            <InputField
              label='Địa điểm'
              value={appointmentForm.location}
              onChange={e =>
                setAppointmentForm(prev => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder='Bệnh viện Huyết học - FPT'
              required
            />

            <InputField
              label='Ghi chú'
              value={appointmentForm.notes}
              onChange={e =>
                setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))
              }
              placeholder='Nhập ghi chú (tùy chọn)...'
            />

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                variant='outline'
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateAppointment}>Tạo lịch hẹn</Button>
            </div>
          </div>
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          title='Yêu cầu đổi lịch hẹn'
        >
          <div className='space-y-4'>
            <div className='bg-yellow-50 p-3 rounded-lg border border-yellow-200'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle size={16} className='text-yellow-600' />{' '}
                <span className='text-sm text-yellow-700'>
                  Lịch hẹn hiện tại:{' '}
                  {selectedAppointment?.appointment &&
                    formatDateTime(
                      selectedAppointment.appointment.appointmentDateTime
                    )}
                </span>
              </div>
            </div>

            <InputField
              label='Lý do đổi lịch'
              value={rescheduleForm.reason}
              onChange={e =>
                setRescheduleForm(prev => ({ ...prev, reason: e.target.value }))
              }
              placeholder='Nhập lý do cần đổi lịch...'
              required
            />

            <InputField
              label='Đề xuất thời gian mới (tùy chọn)'
              type='datetime-local'
              value={rescheduleForm.suggestedDateTime}
              onChange={e =>
                setRescheduleForm(prev => ({
                  ...prev,
                  suggestedDateTime: e.target.value,
                }))
              }
            />

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                variant='outline'
                onClick={() => setShowRescheduleModal(false)}
              >
                Hủy
              </Button>
              <Button variant='warning' onClick={handleRequestReschedule}>
                Yêu cầu đổi lịch
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminPageLayout>
  );
};

export default AdminAppointmentManagementPage;
