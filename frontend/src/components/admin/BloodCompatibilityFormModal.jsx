// src/components/admin/BloodCompatibilityFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodCompatibilityService from '../../services/bloodCompatibilityService';
import bloodTypeService from '../../services/bloodTypeService';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';

const BloodCompatibilityFormModal = ({
  isOpen,
  onClose,
  onSaveSuccess,
  rule,
}) => {
  const [formData, setFormData] = useState({
    donorBloodTypeId: '',
    recipientBloodTypeId: '',
    isCompatible: true,
    notes: '',
  });
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { execute, isLoading } = useApi();

  const fetchDropdownData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const typesData = await bloodTypeService.getAll();
      setBloodTypes(typesData || []);
    } catch (error) {
      await execute(
        () => Promise.reject(error),
        { showToast: true, errorMessage: `Lỗi khi tải dữ liệu: ${error.message}` }
      );
    } finally {
      setIsDataLoading(false);
    }
  }, [execute]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen, fetchDropdownData]);

  useEffect(() => {
    if (rule) {
      setFormData({
        donorBloodTypeId: rule.donorBloodType?.id || '',
        recipientBloodTypeId: rule.recipientBloodType?.id || '',
        isCompatible: rule.isCompatible,
        notes: rule.notes || '',
      });
    } else {
      setFormData({
        donorBloodTypeId: '',
        recipientBloodTypeId: '',
        isCompatible: true,
        notes: '',
      });
    }
    setErrors({});
  }, [rule, isOpen]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.donorBloodTypeId)
      newErrors.donorBloodTypeId = 'Vui lòng chọn loại máu người cho.';
    if (!formData.recipientBloodTypeId)
      newErrors.recipientBloodTypeId = 'Vui lòng chọn loại máu người nhận.'; // Validation rules removed as compatibilityScore is no longer needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Enhanced permission check
    if (user?.role !== 'Admin') {
      await execute(
        () => Promise.reject(new Error('Bạn không có quyền thực hiện thao tác này.')),
        { showToast: true }
      );
      return;
    }

    if (!validateForm()) {
      await execute(
        () => Promise.reject(new Error('Vui lòng kiểm tra lại các trường thông tin.')),
        { showToast: true }
      );
      return;
    }

    const dataToSend = {
      donorBloodTypeId: parseInt(formData.donorBloodTypeId),
      recipientBloodTypeId: parseInt(formData.recipientBloodTypeId),
      isCompatible: formData.isCompatible,
      notes: formData.notes.trim() === '' ? null : formData.notes.trim(),
    };

    await execute(
      () => {
        if (rule?.id) {
          return bloodCompatibilityService.update(rule.id, dataToSend);
        } else {
          return bloodCompatibilityService.create(dataToSend);
        }
      },
      {
        showToast: true,
        loadingMessage: rule ? 'Đang cập nhật...' : 'Đang tạo...',
        successMessage: rule ? 'Cập nhật thành công!' : 'Tạo thành công!',
        onSuccess: () => {
          if (onSaveSuccess && typeof onSaveSuccess === 'function') {
            onSaveSuccess();
          }
        }
      }
    );
  };

  // Vô hiệu hóa các input và nút nếu người dùng không phải Admin
  const isReadOnly = user?.role !== 'Admin';
  const combinedLoading = isLoading || isDataLoading;

  const modalFooter = (
    <>
      <Button
        variant='secondary'
        onClick={onClose}
        disabled={combinedLoading}
      >
        Hủy
      </Button>
      <Button
        variant='primary'
        type='submit'
        form='bloodCompatibilityForm'
        disabled={combinedLoading || isReadOnly}
        isLoading={isLoading}
      >
        {rule ? 'Lưu thay đổi' : 'Tạo mới'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rule ? 'Chỉnh sửa quy tắc' : 'Thêm quy tắc tương thích'}
      footerContent={modalFooter}
      size='lg'
    >
      {isDataLoading ? (
        <div className='flex justify-center items-center p-8'>
          <LoadingSpinner />
        </div>
      ) : (
        <form
          id='bloodCompatibilityForm'
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='donorBloodTypeId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Loại máu người cho <span className='text-red-500'>*</span>
              </label>
              <select
                name='donorBloodTypeId'
                id='donorBloodTypeId'
                value={formData.donorBloodTypeId}
                onChange={handleChange}
                disabled={combinedLoading || isReadOnly}
                required
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.donorBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value=''>-- Chọn loại máu --</option>

                {bloodTypes.map(bt => (
                  <option
                    key={bt.id}
                    value={bt.id}
                  >{`${bt.bloodGroup} (${bt.componentType})`}</option>
                ))}
              </select>
              {errors.donorBloodTypeId && (
                <p className='mt-1 text-xs text-red-600'>
                  {errors.donorBloodTypeId}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor='recipientBloodTypeId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Loại máu người nhận <span className='text-red-500'>*</span>
              </label>
              <select
                name='recipientBloodTypeId'
                id='recipientBloodTypeId'
                value={formData.recipientBloodTypeId}
                onChange={handleChange}
                disabled={combinedLoading || isReadOnly}
                required
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.recipientBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value=''>-- Chọn loại máu --</option>
                {bloodTypes.map(bt => (
                  <option
                    key={bt.id}
                    value={bt.id}
                  >{`${bt.bloodGroup} (${bt.componentType})`}</option>
                ))}
              </select>
              {errors.recipientBloodTypeId && (
                <p className='mt-1 text-xs text-red-600'>
                  {errors.recipientBloodTypeId}
                </p>
              )}
            </div>
          </div>{' '}
          <div className='flex items-center space-x-8 pt-2'>
            <div className='flex items-center'>
              <input
                id='isCompatible'
                name='isCompatible'
                type='checkbox'
                checked={formData.isCompatible}
                onChange={handleChange}
                disabled={combinedLoading || isReadOnly}
                className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
              />
              <label
                htmlFor='isCompatible'
                className='ml-2 block text-sm text-gray-900'
              >
                Tương thích
              </label>
            </div>
          </div>
          <InputField
            label='Ghi chú (Tùy chọn)'
            name='notes'
            as='textarea'
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            disabled={combinedLoading || isReadOnly}
            error={errors.notes}
          />
        </form>
      )}
    </Modal>
  );
};

export default BloodCompatibilityFormModal;
