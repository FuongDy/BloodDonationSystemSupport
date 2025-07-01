// src/pages/profile/UserProfileEditPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, Eye } from 'lucide-react';

import userService from '../../services/userService';
import bloodTypeService from '../../services/bloodTypeService';
import InputField from '../../components/common/InputField';
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const UserProfileEditPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    latitude: '',
    longitude: '',
    emergencyContact: '',
    bloodTypeId: '',
    medicalConditions: '',
    lastDonationDate: '',
    isReadyToDonate: true,
  });
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [userData, bloodTypesData] = await Promise.all([
        userService.getProfile(forceRefresh),
        bloodTypeService.getAll(),
      ]);

      setUser(userData);
      setBloodTypes(bloodTypesData || []);

      // Initialize form data
      const newFormData = {
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        address: userData.address || '',
        latitude: userData.latitude || '',
        longitude: userData.longitude || '',
        emergencyContact: userData.emergencyContact || '',
        bloodTypeId: userData.bloodType?.id || userData.bloodTypeId || '',
        medicalConditions: userData.medicalConditions || '',
        lastDonationDate: userData.lastDonationDate || '',
        isReadyToDonate:
          userData.isReadyToDonate !== null ? userData.isReadyToDonate : true,
      };
      setFormData(newFormData);
    } catch (error) {
      // console.error(error);
      toast.error(`Cập nhật thất bại: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = 'Họ tên không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại các trường thông tin.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    const toastId = toast.loading('Đang cập nhật thông tin...');
    
    const requestData = {
      ...formData,
      bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
    };
    
    // Clean empty strings
    if (requestData.phone === '') requestData.phone = null;
    if (requestData.gender === '') requestData.gender = null;
    if (requestData.address === '') requestData.address = null;
    if (requestData.emergencyContact === '') requestData.emergencyContact = null;
    if (requestData.medicalConditions === '') requestData.medicalConditions = null;
    if (!requestData.dateOfBirth) requestData.dateOfBirth = null;
    if (!requestData.lastDonationDate) requestData.lastDonationDate = null;
    
    try {
      await userService.updateProfile(requestData);
      toast.success('Cập nhật thông tin thành công!', { id: toastId });
      navigate('/profile');
    } catch (error) {
      toast.error(
        `Cập nhật thất bại: ${error.message || 'Vui lòng thử lại.'}`,
        { id: toastId }
      );
      if (error.response?.data && typeof error.response.data === 'object') {
        setErrors(prev => ({ ...prev, ...error.response.data }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='12' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center py-10'>
        Không thể tải thông tin người dùng.
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                Chỉnh sửa hồ sơ: {user.fullName}
              </h1>
              <p className='text-sm text-gray-500'>
                <span className='font-semibold'>{user.email}</span>
              </p>
            </div>
            <div className='flex space-x-2'>
              <Button onClick={() => navigate('/profile')} variant='secondary'>
                <Eye size={16} className='mr-2' /> Xem hồ sơ
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <h2 className='text-xl font-semibold text-gray-700 border-b pb-2 mb-4'>
            Thông tin cá nhân
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              label='Họ và tên đầy đủ'
              id='fullName'
              name='fullName'
              value={formData.fullName}
              onChange={handleInputChange}
              required
              error={errors.fullName}
              disabled={isSubmitting}
            />
            <InputField
              label='Số điện thoại'
              id='phone'
              name='phone'
              type='tel'
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              disabled={isSubmitting}
            />
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <DatePicker
              label='Ngày sinh'
              name='dateOfBirth'
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              maxDate={(() => {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                return `${day}-${month}-${year}`;
              })()}
              placeholder='Chọn ngày sinh'
              disabled={isSubmitting}
            />
            <div>
              <label
                htmlFor='gender'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Giới tính
              </label>
              <select
                id='gender'
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value=''>-- Chọn giới tính --</option>
                <option value='Male'>Nam</option>
                <option value='Female'>Nữ</option>
                <option value='Other'>Khác</option>
              </select>
              {errors.gender && (
                <p className='mt-1 text-xs text-red-600'>{errors.gender}</p>
              )}
            </div>
          </div>
          
          <InputField
            label='Địa chỉ'
            id='address'
            name='address'
            type='textarea'
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            disabled={isSubmitting}
            rows={3}
          />
          
          {/* <InputField
            label='Vĩ độ'
            id='latitude'
            name='latitude'
            type='number'
            value={formData.latitude}
            onChange={handleInputChange}
            error={errors.latitude}
            disabled={isSubmitting}
          />
          <InputField
            label='Kinh độ'
            id='longitude'
            name='longitude'
            type='number'
            value={formData.longitude}
            onChange={handleInputChange}
            error={errors.longitude}
            disabled={isSubmitting}
          /> */}
          
          <InputField
            label='Liên hệ khẩn cấp'
            id='emergencyContact'
            name='emergencyContact'
            value={formData.emergencyContact}
            onChange={handleInputChange}
            error={errors.emergencyContact}
            disabled={isSubmitting}
          />
          
          <h2 className='text-xl font-semibold text-gray-700 border-b pb-2 mb-4 pt-4'>
            Thông tin Y tế & Hiến máu
          </h2>
          
          <div>
            <label
              htmlFor='bloodTypeId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Nhóm máu
            </label>
            <select
              id='bloodTypeId'
              name='bloodTypeId'
              value={formData.bloodTypeId}
              onChange={handleInputChange}
              disabled={isSubmitting || bloodTypes.length === 0}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value=''>-- Chọn nhóm máu --</option>
              {bloodTypes
                .filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex(t => t.bloodGroup === value.bloodGroup)
                )
                .map(bt => (
                  <option key={bt.id} value={bt.id}>
                    {bt.bloodGroup}
                  </option>
                ))}
            </select>
            {errors.bloodTypeId && (
              <p className='mt-1 text-xs text-red-600'>{errors.bloodTypeId}</p>
            )}
          </div>
          
          <InputField
            label='Tình trạng bệnh lý'
            id='medicalConditions'
            name='medicalConditions'
            value={formData.medicalConditions}
            onChange={handleInputChange}
            error={errors.medicalConditions}
            disabled={isSubmitting}
          />
          
          {/* <DatePicker
            label='Lần hiến máu cuối'
            id='lastDonationDate'
            name='lastDonationDate'
            value={formData.lastDonationDate}
            onChange={handleInputChange}
            error={errors.lastDonationDate}
            disabled={isSubmitting}
          /> */}
          
          <div className='flex items-center space-x-2'>
            <label htmlFor='isReadyToDonate' className='text-sm font-medium text-gray-700'>
              Sẵn sàng hiến máu
            </label>
            <input
              id='isReadyToDonate'
              name='isReadyToDonate'
              type='checkbox'
              checked={formData.isReadyToDonate}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className='ml-2 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500'
            />
          </div>
          
          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              type='button'
              variant='secondary'
              disabled={isSubmitting}
              onClick={() => navigate('/profile')}
            >
              Hủy bỏ
            </Button>
            <Button type='submit' variant='primary' disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner size='5' color='white' className='mr-2' />
              ) : (
                <Save size={18} className='mr-2' />
              )}
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
      
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title='Xác nhận lưu thay đổi'
        footerContent={
          <>
            <Button variant='outline' onClick={() => setShowConfirmModal(false)}>
              Hủy
            </Button>
            <Button
              variant='primary'
              onClick={handleConfirmSubmit}
              isLoading={isSubmitting}
            >
              Xác nhận
            </Button>
          </>
        }
      >
        <div>Bạn có chắc chắn muốn lưu thay đổi thông tin hồ sơ?</div>
      </Modal>
    </div>
  );
};

export default UserProfileEditPage;
