// src/components/admin/BloodCollectionForm.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import { Formik, Form } from 'formik';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import donationService from '../../services/donationService';
import toast from 'react-hot-toast';
import { bloodCollectionSchema } from '../../utils/validationSchemas';

const BloodCollectionForm = ({ processId, isOpen, onClose, onSuccess }) => {
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
    collectedVolumeMl: 450,
    notes: '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      if (!processId) {
        showToast('error', 'Không có ID quy trình');
        return;
      }

      setSubmitting(true);
      
      // Convert form data to match backend expectations
      const collectionData = {
        collectedVolumeMl: values.collectedVolumeMl ? parseInt(values.collectedVolumeMl) : 450,
      };

      await donationService.markBloodAsCollected(processId, collectionData);
      showToast('success', 'Đánh dấu đã lấy máu thành công');
      
      onSuccess(collectionData);
      onClose();

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error marking blood as collected:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors from the server
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : value;
          setFieldError(key, errorMessage);
        });
      } else {
        showToast('error', 
          error.response?.data?.message || 
          'Không thể đánh dấu đã lấy máu'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Ghi nhận lấy máu'>
      <Formik
        initialValues={initialValues}
        validationSchema={bloodCollectionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form className='space-y-4'>
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
              value={values.collectedVolumeMl}
              onChange={handleChange}
              onBlur={handleBlur}
              min='100'
              max='500'
              step='10'
              required
              disabled={isSubmitting}
              placeholder='450'
              error={touched.collectedVolumeMl && errors.collectedVolumeMl}
            />

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ghi chú
              </label>
              <textarea
                name='notes'
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  touched.notes && errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder='Nhập ghi chú về quá trình lấy máu...'
              />
              {touched.notes && errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
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
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BloodCollectionForm;
