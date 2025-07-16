// src/components/admin/HealthCheckForm.jsx
import React from 'react';
import { Heart, Scale, Thermometer, Activity } from 'lucide-react';
import { Formik, Form } from 'formik';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Modal from '../common/Modal';
import donationService from '../../services/donationService';
import { FORM_SUCCESS_MESSAGES, FORM_ERROR_MESSAGES } from '../../utils/validationSchemas';
import { showToast, showApiErrorToast } from '../../utils/toastHelpers';

const HealthCheckForm = ({ processId, isOpen, onClose, onSuccess }) => {
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      
      // Convert form data to match backend expectations
      const healthCheckData = {
        bloodPressureSystolic: values.bloodPressureSystolic ? parseInt(values.bloodPressureSystolic, 10) : null,
        bloodPressureDiastolic: values.bloodPressureDiastolic ? parseInt(values.bloodPressureDiastolic, 10) : null,
        heartRate: values.heartRate ? parseInt(values.heartRate, 10) : null,
        temperature: values.temperature ? parseFloat(values.temperature) : null,
        weight: values.weight ? parseFloat(values.weight) : null,
        hemoglobinLevel: values.hemoglobinLevel ? parseFloat(values.hemoglobinLevel) : null,
        notes: values.notes?.trim() || null,
        isEligible: Boolean(values.isEligible),
      };

      // Validate that required fields are not null/0
      const requiredFields = [
        'bloodPressureSystolic', 
        'bloodPressureDiastolic', 
        'heartRate', 
        'temperature', 
        'weight', 
        'hemoglobinLevel'
      ];
      
      const missingFields = requiredFields.filter(field => 
        healthCheckData[field] === null || 
        healthCheckData[field] === 0 || 
        isNaN(healthCheckData[field])
      );
      
      if (missingFields.length > 0) {
        showToast('error', `🚫 Vui lòng nhập đầy đủ: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Submitting health check for process ID:', processId);
      console.log('Health check data:', healthCheckData);

      await donationService.recordHealthCheck(processId, healthCheckData);
      showToast('success', FORM_SUCCESS_MESSAGES.HEALTH_CHECK);
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(healthCheckData);
      }
      onClose();
    } catch (error) {
      console.error('Health check error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      if (error.response?.status === 409) {
        showToast('error', '🚫 Không thể thực hiện khám sức khỏe. Trạng thái quy trình không phù hợp (cần có lịch hẹn đã xác nhận).');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Dữ liệu không hợp lệ';
        showToast('error', `🚫 Lỗi validation: ${errorMessage}`);
      } else {
        showApiErrorToast(error, 'Không thể ghi nhận kết quả khám sức khỏe');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-evaluation logic cho eligibility
  const evaluateEligibility = (values) => {
    const {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      weight,
      hemoglobinLevel,
    } = values;

    // Check if all values are filled
    if (!bloodPressureSystolic || !bloodPressureDiastolic || !heartRate || 
        !temperature || !weight || !hemoglobinLevel) {
      return null; // Can't evaluate without all values
    }

    // Medical standards for blood donation
    const isEligible = 
      bloodPressureSystolic >= 90 && bloodPressureSystolic <= 180 &&
      bloodPressureDiastolic >= 50 && bloodPressureDiastolic <= 100 &&
      bloodPressureDiastolic < bloodPressureSystolic &&
      heartRate >= 50 && heartRate <= 100 &&
      temperature >= 36.0 && temperature <= 37.5 &&
      weight >= 45 &&
      hemoglobinLevel >= 12.0 && hemoglobinLevel <= 18.0;

    return isEligible;
  };

  // Initial values cho Formik
  const initialValues = {
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    weight: '',
    hemoglobinLevel: '',
    notes: '',
    isEligible: true,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Ghi nhận khám sức khỏe'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, isSubmitting, setFieldValue }) => {
          // Auto-evaluate eligibility when values change (optional, không bắt buộc)
          const autoEligibility = evaluateEligibility(values);

          return (
          <Form className='space-y-4'>
            {/* Medical Standards Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Tiêu chuẩn khám sức khỏe hiến máu</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Huyết áp: 90-180/50-100 mmHg</div>
                <div>• Nhịp tim: 50-100 bpm</div>
                <div>• Nhiệt độ: 36.0-37.5°C</div>
                <div>• Cân nặng: ≥45kg</div>
                <div>• Hemoglobin: Nam ≥13 g/dL, Nữ ≥12 g/dL</div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                label='Huyết áp tâm thu'
                name="bloodPressureSystolic"
                type='number'
                value={values.bloodPressureSystolic}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='120'
                icon={Heart}
              />

              <InputField
                label='Huyết áp tâm trương'
                name="bloodPressureDiastolic"
                type='number'
                value={values.bloodPressureDiastolic}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='80'
                icon={Heart}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                label='Nhịp tim (bpm)'
                name="heartRate"
                type='number'
                value={values.heartRate}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='72'
                icon={Activity}
              />

              <InputField
                label='Nhiệt độ (°C)'
                name="temperature"
                type='number'
                step='0.1'
                value={values.temperature}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='36.5'
                icon={Thermometer}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                label='Cân nặng (kg)'
                name="weight"
                type='number'
                step='0.1'
                value={values.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='65'
                icon={Scale}
              />

              <InputField
                label='Hemoglobin (g/dL)'
                name="hemoglobinLevel"
                type='number'
                step='0.1'
                value={values.hemoglobinLevel}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='13.5'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder='Thêm ghi chú nếu cần...'
              />
            </div>

            <div className='flex items-center space-x-3'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='isEligible'
                  checked={values.isEligible === true}
                  onChange={() => setFieldValue('isEligible', true)}
                  className='mr-2'
                />
                <span className={`font-medium ${values.isEligible === true ? 'text-green-600' : 'text-gray-500'}`}>
                  ✅ Đạt tiêu chuẩn
                </span>
              </label>

              <label className='flex items-center'>
                <input
                  type='radio'
                  name='isEligible'
                  checked={values.isEligible === false}
                  onChange={() => setFieldValue('isEligible', false)}
                  className='mr-2'
                />
                <span className={`font-medium ${values.isEligible === false ? 'text-red-600' : 'text-gray-500'}`}>
                  ❌ Không đạt
                </span>
              </label>
              
              {autoEligibility !== null && (
                <div className="ml-4 text-xs">
                  <span className={`px-2 py-1 rounded-full ${autoEligibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {autoEligibility ? '🤖 Đạt' : '🤖 Không đạt'}
                  </span>
                </div>
              )}
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu kết quả'}
              </Button>
            </div>
          </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default HealthCheckForm;
