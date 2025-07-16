// src/components/admin/TestResultForm.jsx
import React, { useState, useEffect } from 'react';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import donationService from '../../services/donationService';
import bloodTypeService from '../../services/bloodTypeService';
import toast from 'react-hot-toast';

const TestResultForm = ({ processId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bloodUnitId: processId ? processId.toString() : '',
    isSafe: true,
    notes: '',
    bloodTypeId: '',
    componentType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoadingBloodTypes, setIsLoadingBloodTypes] = useState(false);

  // Helper function to remove duplicate blood types
  const getUniqueBloodTypes = (bloodTypes) => {
    if (!bloodTypes || bloodTypes.length === 0) return [];
    
    return bloodTypes.filter((bloodType, index, self) => 
      index === self.findIndex(bt => bt.bloodGroup === bloodType.bloodGroup)
    );
  };

  // Update bloodUnitId when processId changes
  useEffect(() => {
    if (processId) {
      setFormData(prev => ({
        ...prev,
        bloodUnitId: processId.toString(),
      }));
    }
  }, [processId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        bloodUnitId: processId ? processId.toString() : '',
        isSafe: true,
        notes: '',
        bloodTypeId: '',
        componentType: '',
      });
      setIsSubmitting(false);
    }
  }, [isOpen, processId]);

  // Fetch blood types on component mount
  useEffect(() => {
    const fetchBloodTypes = async () => {
      setIsLoadingBloodTypes(true);
      try {
        const response = await bloodTypeService.getAll();
        const uniqueBloodTypes = getUniqueBloodTypes(response);
        setBloodTypes(uniqueBloodTypes);
      } catch (error) {
        console.error('Error fetching blood types:', error);
        toast.error('Không thể tải danh sách nhóm máu');
      } finally {
        setIsLoadingBloodTypes(false);
      }
    };

    fetchBloodTypes();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!processId) {
      toast.error('Không có ID quy trình');
      return;
    }

    if (!formData.bloodUnitId || !formData.bloodUnitId.toString().trim()) {
      toast.error('Vui lòng nhập mã đơn vị máu');
      return;
    }

    if (!formData.bloodTypeId || !formData.bloodTypeId.toString().trim()) {
      toast.error('Vui lòng chọn nhóm máu');
      return;
    }

    // componentType is optional, remove validation
    // if (!formData.componentType || !formData.componentType.trim()) {
    //   toast.error('Vui lòng chọn thành phần máu trước khi ghi nhận kết quả');
    //   return;
    // }

    // Validate that selected blood type exists
    const selectedBloodType = bloodTypes.find(bt => bt.id.toString() === formData.bloodTypeId);
    if (!selectedBloodType) {
      toast.error('Nhóm máu đã chọn không hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data to match backend BloodTestResultRequest expectations
      const testResultData = {
        bloodUnitId: formData.bloodUnitId.toString().trim(),
        isSafe: formData.isSafe,
        notes: formData.notes || null,
        bloodTypeId: formData.bloodTypeId.trim(),
        componentType: formData.componentType ? formData.componentType.trim() : null,
      };

      await donationService.recordBloodTestResult(processId, testResultData);
      toast.success('Ghi nhận kết quả xét nghiệm thành công');
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        bloodUnitId: processId ? processId.toString() : '',
        isSafe: true,
        notes: '',
        bloodTypeId: '',
        componentType: '',
      });
    } catch (error) {
      console.error('Error recording test result:', error);
      toast.error('Không thể ghi nhận kết quả xét nghiệm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Ghi nhận kết quả xét nghiệm'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex items-center mb-4'>
          <TestTube className='w-5 h-5 text-blue-600 mr-2' />
          <span className='text-sm text-gray-600'>
            Ghi nhận kết quả xét nghiệm máu
          </span>
        </div>

        <InputField
          label='Mã đơn vị máu'
          type='text'
          name='bloodUnitId'
          value={formData.bloodUnitId}
          onChange={handleChange}
          required
          placeholder='Mã tự động từ process ID'
          disabled={true}
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nhóm máu
          </label>
          <select
            name='bloodTypeId'
            value={formData.bloodTypeId}
            onChange={handleChange}
            disabled={isSubmitting || isLoadingBloodTypes}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            required
          >
            <option value=''>
              {isLoadingBloodTypes ? 'Đang tải...' : '-- Chọn nhóm máu --'}
            </option>
            {bloodTypes.length > 0 ? (
              bloodTypes.map(bt => (
                <option key={bt.id} value={bt.id}>
                  {bt.bloodGroup}
                </option>
              ))
            ) : (
              <option value='' disabled>
                Không có nhóm máu nào
              </option>
            )}
          </select>
          {isLoadingBloodTypes && (
            <p className='text-sm text-gray-500 mt-1'>Đang tải danh sách nhóm máu...</p>
          )}
        </div>

        {/* <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Thành phần máu <span className="text-gray-400">(tùy chọn)</span>
          </label>
          <select
            name='componentType'
            value={formData.componentType || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>-- Chọn thành phần máu (không bắt buộc) --</option>
            <option value='Whole Blood'>Máu toàn phần</option>
            <option value='Red Blood Cells'>Hồng cầu</option>
            <option value='Plasma'>Huyết tương</option>
            <option value='Platelets'>Tiểu cầu</option>
            <option value='White Blood Cells'>Bạch cầu</option>
          </select>
        </div> */}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Kết quả xét nghiệm
          </label>
          <div className='flex items-center space-x-6'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='isSafe'
                value={true}
                checked={formData.isSafe === true}
                onChange={() =>
                  setFormData(prev => ({ ...prev, isSafe: true }))
                }
                disabled={isSubmitting}
                className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300'
              />
              <CheckCircle className='w-4 h-4 text-green-600 ml-2 mr-1' />
              <span className='text-sm text-green-700'>An toàn</span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='isSafe'
                value={false}
                checked={formData.isSafe === false}
                onChange={() =>
                  setFormData(prev => ({ ...prev, isSafe: false }))
                }
                disabled={isSubmitting}
                className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300'
              />
              <XCircle className='w-4 h-4 text-red-600 ml-2 mr-1' />
              <span className='text-sm text-red-700'>Không an toàn</span>
            </label>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Ghi chú thêm
          </label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Nhập ghi chú thêm về kết quả xét nghiệm...'
          />
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            variant={formData.isSafe ? 'success' : 'warning'}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            <TestTube className='w-4 h-4 mr-2' />
            Lưu kết quả
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestResultForm;
