// src/components/admin/appointments/CreateAppointmentModal.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import InputField from '../../common/InputField';
import { donationAppointmentSchema } from '../../../utils/validationSchemas';
import { formatDateForInput, isDateTodayOrFuture } from '../../../utils/dateUtils';

const CreateAppointmentModal = ({
  isOpen,
  onClose,
  appointmentForm,
  setAppointmentForm,
  processes,
  onSubmit,
}) => {
  // Tối ưu toast với duration ngắn 
  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      duration: 2000,
      position: 'top-center',
    });
  };

  // Initial values cho Formik
  const initialValues = {
    processId: appointmentForm?.processId || '',
    appointmentDate: appointmentForm?.appointmentDate || '',
    location: appointmentForm?.location || 'Bệnh viện Huyết học - FPT',
    notes: appointmentForm?.notes || '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      
      // Sync với appointmentForm để compatibility với parent component
      setAppointmentForm(values);
      
      // Call parent onSubmit
      await onSubmit();
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors from the server
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : value;
          setFieldError(key, errorMessage);
        });
      } else {
        showToast('error', 
          error.response?.data?.message || 
          'Không thể tạo lịch hẹn. Vui lòng thử lại.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <span>Tạo lịch hẹn mới</span>
          {processes.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {processes.length} quy trình chờ
            </span>
          )}
        </div>
      }
      size="md"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={donationAppointmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => {
          // Get selected process info for display
          const selectedProcess = processes.find(p => p.id === Number(values.processId));

          return (
            <Form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Chọn quy trình hiến máu <span className="text-red-500">*</span>
                </label>
                <select
                  name="processId"
                  value={values.processId}
                  onChange={(e) => {
                    handleChange(e);
                    setAppointmentForm(prev => ({ ...prev, processId: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    touched.processId && errors.processId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value=''>-- Chọn quy trình --</option>
                  {processes.map(process => (
                    <option key={process.id} value={process.id}>
                      #{process.id} - {process.donor?.fullName || 'N/A'} 
                      {process.bloodType?.bloodGroup && ` (${process.bloodType.bloodGroup})`}
                      {process.donor?.email && ` - ${process.donor.email}`}
                    </option>
                  ))}
                </select>
                {touched.processId && errors.processId && (
                  <p className="mt-1 text-sm text-red-600">{errors.processId}</p>
                )}
                {processes.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Không có quy trình nào cần tạo lịch hẹn
                  </p>
                )}
              </div>

              {/* Selected Process Info */}
              {selectedProcess && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Thông tin quy trình được chọn</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Người hiến:</span>
                      <span className="font-medium text-blue-900">{selectedProcess.donor?.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Email:</span>
                      <span className="font-medium text-blue-900">{selectedProcess.donor?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Nhóm máu:</span>
                      <span className="font-medium text-blue-900">{selectedProcess.bloodType?.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Trạng thái:</span>
                      <span className="font-medium text-blue-900">{selectedProcess.status || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              <InputField
                label='Ngày hẹn'
                name="appointmentDate"
                type='date'
                value={values.appointmentDate}
                onChange={(e) => {
                  handleChange(e);
                  setAppointmentForm(prev => ({ ...prev, appointmentDate: e.target.value }));
                }}
                onBlur={handleBlur}
                min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                required
                error={touched.appointmentDate && errors.appointmentDate}
              />

              <div>
                <InputField
                  label='Địa điểm'
                  name="location"
                  value={values.location}
                  placeholder='Bệnh viện Huyết học - FPT'
                  onChange={(e) => {
                    handleChange(e);
                    setAppointmentForm(prev => ({ ...prev, location: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  required
                  error={touched.location && errors.location}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Địa điểm mặc định là bệnh viện chính
                </p>
              </div>

              <div>
                <InputField
                  label='Ghi chú'
                  name="notes"
                  value={values.notes}
                  onChange={(e) => {
                    handleChange(e);
                    setAppointmentForm(prev => ({ ...prev, notes: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  placeholder='Nhập ghi chú (tùy chọn)...'
                  error={touched.notes && errors.notes}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Thông tin bổ sung cho lịch hẹn
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Lưu ý khi tạo lịch hẹn</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Chỉ chọn ngày trong tương lai</li>
                  <li>• Đảm bảo người hiến máu có thể đến đúng ngày hẹn</li>
                  <li>• Kiểm tra tình trạng sức khỏe trước khi tạo lịch hẹn</li>
                  <li>• Hệ thống sẽ tự động gửi thông báo cho người hiến máu</li>
                </ul>
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={!values.processId || !values.appointmentDate || isSubmitting}
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo lịch hẹn'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default CreateAppointmentModal;
