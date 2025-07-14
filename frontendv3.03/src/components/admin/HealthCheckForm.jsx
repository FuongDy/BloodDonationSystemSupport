// src/components/admin/HealthCheckForm.jsx
import React, { useState } from 'react';
import { Heart, Scale, Thermometer, Activity } from 'lucide-react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Modal from '../common/Modal';
import donationService from '../../services/donationService';
import toast from 'react-hot-toast';

const HealthCheckForm = ({ processId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    weight: '',
    hemoglobinLevel: '',
    notes: '',
    isEligible: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to match backend expectations
      const healthCheckData = {
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        hemoglobinLevel: formData.hemoglobinLevel ? parseFloat(formData.hemoglobinLevel) : null,
        notes: formData.notes || null,
        isEligible: formData.isEligible,
      };

      console.log('Submitting health check for process ID:', processId);
      console.log('Health check data:', healthCheckData);

      await donationService.recordHealthCheck(processId, healthCheckData);
      toast.success('Đã ghi nhận kết quả khám sức khỏe');
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(healthCheckData);
      }
      onClose();
    } catch (error) {
      console.error('Health check error:', error);
      console.error('Error response:', error?.response?.data);
      
      let errorMessage = 'Lỗi khi ghi nhận kết quả khám sức khỏe';
      
      if (error?.response?.status === 409) {
        errorMessage = 'Không thể thực hiện khám sức khỏe. Trạng thái quy trình không phù hợp (cần có lịch hẹn đã xác nhận).';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Ghi nhận khám sức khỏe'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <InputField
            label='Huyết áp tâm thu'
            type='number'
            value={formData.bloodPressureSystolic}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                bloodPressureSystolic: e.target.value,
              }))
            }
            placeholder='120'
            icon={Heart}
            required
          />

          <InputField
            label='Huyết áp tâm trương'
            type='number'
            value={formData.bloodPressureDiastolic}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                bloodPressureDiastolic: e.target.value,
              }))
            }
            placeholder='80'
            icon={Heart}
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <InputField
            label='Nhịp tim (bpm)'
            type='number'
            value={formData.heartRate}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                heartRate: e.target.value,
              }))
            }
            placeholder='72'
            icon={Activity}
            required
          />

          <InputField
            label='Nhiệt độ (°C)'
            type='number'
            step='0.1'
            value={formData.temperature}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                temperature: e.target.value,
              }))
            }
            placeholder='36.5'
            icon={Thermometer}
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <InputField
            label='Cân nặng (kg)'
            type='number'
            step='0.1'
            value={formData.weight}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                weight: e.target.value,
              }))
            }
            placeholder='65'
            icon={Scale}
            required
          />

          <InputField
            label='Hemoglobin (g/dL)'
            type='number'
            step='0.1'
            value={formData.hemoglobinLevel}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                hemoglobinLevel: e.target.value,
              }))
            }
            placeholder='13.5'
            required
          />
        </div>

        <InputField
          label='Ghi chú'
          value={formData.notes}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          placeholder='Thêm ghi chú nếu cần...'
        />

        <div className='flex items-center space-x-3'>
          <label className='flex items-center'>
            <input
              type='radio'
              name='isEligible'
              checked={formData.isEligible === true}
              onChange={() => setFormData(prev => ({ ...prev, isEligible: true }))}
              className='mr-2'
            />
            <span className='text-green-600 font-medium'>Đạt tiêu chuẩn</span>
          </label>

          <label className='flex items-center'>
            <input
              type='radio'
              name='isEligible'
              checked={formData.isEligible === false}
              onChange={() => setFormData(prev => ({ ...prev, isEligible: false }))}
              className='mr-2'
            />
            <span className='text-red-600 font-medium'>Không đạt</span>
          </label>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu kết quả'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HealthCheckForm;
