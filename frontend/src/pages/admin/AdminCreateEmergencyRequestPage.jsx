// src/pages/admin/AdminCreateEmergencyRequestPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RoomBedSelector from '../../components/staff/RoomBedSelector';
import bloodRequestService from '../../services/bloodRequestService';
import bloodTypeService from '../../services/bloodTypeService';
import { HOSPITAL_INFO } from '../../utils/constants';
import { emergencyRequestSchema } from '../../utils/validationSchemas';

// Initial values cho Formik
const initialValues = {
  patientName: '',
  bloodTypeId: '',
  hospital: HOSPITAL_INFO.FULL_NAME,
  quantityInUnits: 1,
  urgency: 'URGENT',
  roomNumber: '',
  bedNumber: '',
  notes: '',
};

const AdminCreateEmergencyRequestPage = () => {
  const navigate = useNavigate();
  
  // Tối ưu toast với duration ngắn và dismiss cũ
  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      duration: 2500,
      position: 'top-center',
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);

  useEffect(() => {
    fetchBloodTypes();
  }, []);

  const fetchBloodTypes = async () => {
    try {
      setIsLoading(true);
      const response = await bloodTypeService.getAll();
      
      // Xử lý trùng lặp: Lọc các nhóm máu trùng lặp, chỉ giữ lại một
      // Tạo một Map dựa trên bloodGroup để loại bỏ trùng lặp
      const uniqueBloodTypes = [];
      const bloodGroupMap = new Map();
      
      // Ưu tiên loại máu toàn phần (WHOLE_BLOOD) nếu có
      response?.forEach(type => {
        if (!bloodGroupMap.has(type.bloodGroup) || type.componentType === 'WHOLE_BLOOD') {
          bloodGroupMap.set(type.bloodGroup, type);
        }
      });
      
      // Chuyển Map thành array
      bloodGroupMap.forEach((value) => {
        uniqueBloodTypes.push(value);
      });
      
      // Sắp xếp theo thứ tự A, B, AB, O
      uniqueBloodTypes.sort((a, b) => {
        const order = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return order.indexOf(a.bloodGroup) - order.indexOf(b.bloodGroup);
      });
      
      setBloodTypes(uniqueBloodTypes || []);
    } catch (error) {
      console.error('Error fetching blood types:', error);
      showToast('error', 'Không thể tải danh sách nhóm máu');
    } finally {
      setIsLoading(false);
    }
  };

  // Room bed handlers cho Formik
  const createRoomBedHandlers = (setFieldValue, setFieldError) => ({
    handleRoomBedSelect: (roomNumber, bedNumber) => {
      setFieldValue('roomNumber', roomNumber?.toString() || '');
      setFieldValue('bedNumber', bedNumber?.toString() || '');
      setFieldError('roomNumber', '');
      setFieldError('bedNumber', '');
    },
    handleRoomChange: (roomNumber) => {
      setFieldValue('roomNumber', roomNumber || '');
      setFieldValue('bedNumber', ''); // Reset bed when room changes
      setFieldError('roomNumber', '');
      setFieldError('bedNumber', '');
    },
    handleBedChange: (bedNumber) => {
      setFieldValue('bedNumber', bedNumber || '');
      setFieldError('bedNumber', '');
    }
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsSubmitting(true);
      setSubmitting(true);
      
      // Create a new emergency request - chỉ lấy các trường mà backend yêu cầu
      const requestPayload = {
        patientName: values.patientName.trim(),
        hospital: values.hospital.trim(),
        bloodTypeId: Number(values.bloodTypeId),
        quantityInUnits: Number(values.quantityInUnits),
        urgency: values.urgency,
        roomNumber: values.roomNumber ? Number(values.roomNumber) : null,
        bedNumber: values.bedNumber ? Number(values.bedNumber) : null,
        notes: values.notes?.trim() || null,
      };
      
      await bloodRequestService.createEmergencyRequest(requestPayload);
      
      showToast('success', 'Tạo yêu cầu khẩn cấp thành công');
      navigate('/admin/emergency-requests');
    } catch (error) {
      console.error('Error creating emergency request:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors from the server
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : value;
          setFieldError(key, errorMessage);
        });
      } else {
        showToast('error',
          error.response?.data?.message || 
          'Không thể tạo yêu cầu khẩn cấp. Vui lòng thử lại.'
        );
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const getHeaderActions = (isSubmitting, submitForm) => [
    {
      label: 'Quay lại',
      icon: ArrowLeft,
      variant: 'outline',
      onClick: () => navigate('/admin/emergency-requests'),
      disabled: isSubmitting,
    },
    {
      label: 'Tạo yêu cầu',
      icon: Save,
      variant: 'primary',
      onClick: submitForm,
      disabled: isLoading || isSubmitting,
    },
  ];

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="12" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={emergencyRequestSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue, setFieldError }) => {
        const roomBedHandlers = createRoomBedHandlers(setFieldValue, setFieldError);
        
        return (
          <AdminPageLayout
            title="Tạo yêu cầu khẩn cấp mới"
            description="Thêm một yêu cầu hiến máu khẩn cấp mới vào hệ thống"
            headerActions={getHeaderActions(isSubmitting, submitForm)}
          >
            <Form className="space-y-6">
              {/* Emergency Alert */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-red-700">
                      Đây là yêu cầu khẩn cấp với mức độ ưu tiên cao. 
                      Hệ thống sẽ tự động thông báo đến người dùng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <div>
                    <InputField
                      label="Tên bệnh nhân"
                      name="patientName"
                      value={values.patientName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Nhập tên bệnh nhân"
                      required
                      error={touched.patientName && errors.patientName}
                    />
                  </div>

                  {/* Blood Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhóm máu <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bloodTypeId"
                      value={values.bloodTypeId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        touched.bloodTypeId && errors.bloodTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">-- Chọn nhóm máu --</option>
                      {bloodTypes.map(bloodType => (
                        <option key={bloodType.id} value={bloodType.id}>
                          {bloodType.bloodGroup} {bloodType.componentType === 'WHOLE_BLOOD' ? '(Máu toàn phần)' : ''}
                        </option>
                      ))}
                    </select>
                    {touched.bloodTypeId && errors.bloodTypeId && (
                      <p className="mt-1 text-sm text-red-600">{errors.bloodTypeId}</p>
                    )}
                  </div>

                  {/* Hospital */}
                  <div>
                    <InputField
                      label="Bệnh viện"
                      name="hospital"
                      value={values.hospital}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tên bệnh viện"
                      required
                      error={touched.hospital && errors.hospital}
                      disabled // Bệnh viện sẽ được lấy từ constants
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <InputField
                      label="Số lượng (đơn vị)"
                      name="quantityInUnits"
                      type="number"
                      min="1"
                      value={values.quantityInUnits}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      error={touched.quantityInUnits && errors.quantityInUnits}
                    />
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mức độ khẩn cấp <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="urgency"
                      value={values.urgency}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        touched.urgency && errors.urgency ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="CRITICAL">Rất khẩn cấp</option>
                      <option value="URGENT">Khẩn cấp</option>
                      <option value="NORMAL">Bình thường</option>
                    </select>
                    {touched.urgency && errors.urgency && (
                      <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>
                    )}
                  </div>
                </div>

                {/* Room and Bed Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Chọn phòng và giường
                  </h3>
                  <RoomBedSelector
                    selectedRoom={values.roomNumber}
                    selectedBed={values.bedNumber}
                    onRoomChange={roomBedHandlers.handleRoomChange}
                    onBedChange={roomBedHandlers.handleBedChange}
                    error={(touched.roomNumber && errors.roomNumber) || (touched.bedNumber && errors.bedNumber)}
                  />
                  {touched.roomNumber && errors.roomNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
                  )}
                  {touched.bedNumber && errors.bedNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.bedNumber}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú bổ sung
                  </label>
                  <textarea
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      touched.notes && errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Nhập ghi chú hoặc thông tin bổ sung về yêu cầu này (nếu có)"
                  />
                  {touched.notes && errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="4" className="mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Tạo yêu cầu
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </AdminPageLayout>
        );
      }}
    </Formik>
  );
};

export default AdminCreateEmergencyRequestPage;
