// src/components/admin/BloodCollectionForm.jsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import donationService from '../../services/donationService';
import toast from 'react-hot-toast';

const BloodCollectionForm = ({ processId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    collectedVolumeMl: 450,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!processId) {
      toast.error('Không có ID quy trình');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert form data to match backend expectations
      const collectionData = {
        collectedVolumeMl: formData.collectedVolumeMl ? parseInt(formData.collectedVolumeMl) : 450,
      };

      await donationService.markBloodAsCollected(processId, collectionData);
      toast.success('Đánh dấu đã lấy máu thành công');
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        collectedVolumeMl: 450,
        notes: '',
      });
    } catch (error) {
      console.error('Error marking blood as collected:', error);
      toast.error('Không thể đánh dấu đã lấy máu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Ghi nhận lấy máu'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex items-center mb-4'>
          <Heart className='w-5 h-5 text-red-600 mr-2' />
          <span className='text-sm text-gray-600'>
            Ghi nhận việc lấy máu từ người hiến
          </span>
        </div>

        <InputField
          label='Thể tích thu thập (ml)'
          type='number'
          name='collectedVolumeMl'
          value={formData.collectedVolumeMl}
          onChange={handleChange}
          min='100'
          max='500'
          step='10'
          required
          disabled={isSubmitting}
          placeholder='450'
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Ghi chú
          </label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
            placeholder='Nhập ghi chú về quá trình lấy máu...'
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
            variant='success'
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            <Heart className='w-4 h-4 mr-2' />
            Xác nhận lấy máu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BloodCollectionForm;
