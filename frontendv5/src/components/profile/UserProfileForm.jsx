// src/components/profile/UserProfileForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Save, 
  Edit3, 
  Eye,
  Mail,
  Phone,
  UserCircle,
  MapPin,
  Heart,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import bloodTypeService from '../../services/bloodTypeService';
import InputField from '../common/InputField';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * UserProfileForm Component
 * 
 * Component cho user profile có thể hoạt động ở 2 modes:
 * - mode="view": Hiển thị thông tin chi tiết (read-only)
 * - mode="edit": Form chỉnh sửa thông tin
 * 
 * @param {Object} props
 * @param {string} props.mode - "view" hoặc "edit"
 */
const UserProfileForm = ({ mode = "view" }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
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

  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [userData, bloodTypesData] = await Promise.all([
        userService.getProfile(forceRefresh),
        bloodTypeService.getAll(),
      ]);
      
      setUser(userData);
      setBloodTypes(bloodTypesData || []);

      // Initialize form data for edit mode
      if (isEditMode) {
        const newFormData = {
          fullName: userData.fullName || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          address: userData.address || '',
          emergencyContact: userData.emergencyContact || '',
          bloodTypeId: userData.bloodType?.id || userData.bloodTypeId || '',
          medicalConditions: userData.medicalConditions || '',
          lastDonationDate: userData.lastDonationDate || '',
          isReadyToDonate: userData.isReadyToDonate !== null ? userData.isReadyToDonate : true,
        };
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error(`Lỗi khi tải dữ liệu người dùng: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  const handleInputChange = useCallback(e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

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
    setIsSubmitting(true);
    const toastId = toast.loading('Đang cập nhật thông tin...');

    const requestData = {
      ...formData,
      bloodTypeId: formData.bloodTypeId
        ? parseInt(formData.bloodTypeId, 10)
        : null,
    };
    if (requestData.phone === '') requestData.phone = null;
    if (requestData.gender === '') requestData.gender = null;
    if (requestData.address === '') requestData.address = null;
    if (requestData.emergencyContact === '')
      requestData.emergencyContact = null;
    if (requestData.medicalConditions === '')
      requestData.medicalConditions = null;
    if (!requestData.dateOfBirth) requestData.dateOfBirth = null;
    if (!requestData.lastDonationDate) requestData.lastDonationDate = null;

    try {
      const updatedUser = await userService.updateProfile(requestData);
      toast.success('Cập nhật thông tin thành công!', { id: toastId });
      
      // Force refresh dữ liệu user từ server
      setUser(null);
      await fetchUserData(true);
      
      // Switch back to view mode after successful update
      navigate('/profile');
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(`Lỗi khi cập nhật: ${error.message || 'Vui lòng thử lại.'}`, {
        id: toastId,
      });
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'object'
      ) {
        setErrors(prev => ({ ...prev, ...error.response.data }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component hiển thị chi tiết (view mode)
  const DetailItem = ({ icon: IconComponent, label, value, highlight = false }) => {
    const Icon = IconComponent;
    return (
      <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
        <dt className='text-sm font-medium text-gray-500 flex items-center'>
          <Icon size={16} className='mr-2 text-red-600' />
          {label}
        </dt>
        <dd
          className={`mt-1 text-sm ${highlight ? 'font-semibold text-red-700' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}
        >
          {value !== null && value !== undefined && value !== '' ? (
            value
          ) : (
            <span className='italic text-gray-400'>Chưa có thông tin</span>
          )}
        </dd>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='12' />
      </div>
    );
  }

  if (!user) {
    return <div className='text-center py-10'>Không thể tải thông tin người dùng.</div>;
  }

  const bloodTypeDesc = user.bloodTypeDescription || 'Chưa cập nhật';

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {isEditMode ? 'Chỉnh sửa hồ sơ: ' : 'Hồ sơ cá nhân: '}{user.fullName}
              </h1>
              <p className='text-sm text-gray-500'>
                <span className='font-semibold'>{user.email}</span>
              </p>
            </div>
            <div className='flex space-x-2'>
              {isViewMode && (
                <Button onClick={() => navigate('/profile/edit')} variant='outline'>
                  <Edit3 size={16} className='mr-2' /> Chỉnh sửa
                </Button>
              )}
              {isEditMode && (
                <Button onClick={() => navigate('/profile')} variant='secondary'>
                  <Eye size={16} className='mr-2' /> Xem hồ sơ
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* VIEW MODE */}
        {isViewMode && (
          <div className='px-6 py-5'>
            <dl className='divide-y divide-gray-200'>
              <h3 className='text-lg font-semibold text-gray-700 my-3'>
                Thông tin liên hệ
              </h3>
              <DetailItem icon={Mail} label='Email' value={user.email} />
              <DetailItem icon={Phone} label='Số điện thoại' value={user.phone} />
              <DetailItem icon={MapPin} label='Địa chỉ' value={user.address} />
              <DetailItem icon={UserCircle} label='Liên hệ khẩn cấp' value={user.emergencyContact} />

              <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
                Thông tin cá nhân & Y tế
              </h3>
              <DetailItem
                icon={CalendarDays}
                label='Ngày sinh'
                value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null}
              />
              <DetailItem icon={UserCircle} label='Giới tính' value={user.gender} />
              <DetailItem
                icon={Heart}
                label='Nhóm máu'
                value={bloodTypeDesc}
                highlight={bloodTypeDesc !== 'Chưa cập nhật'}
              />
              <DetailItem icon={UserCircle} label='Tình trạng bệnh lý' value={user.medicalConditions} />
              <DetailItem
                icon={CalendarDays}
                label='Lần hiến máu cuối'
                value={user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : null}
              />
              <DetailItem
                icon={user.isReadyToDonate ? CheckCircle : XCircle}
                label='Sẵn sàng hiến máu'
                value={user.isReadyToDonate ? 'Có' : 'Không'}
                highlight={user.isReadyToDonate === true}
              />

              <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
                Thông tin tài khoản
              </h3>
              <DetailItem
                icon={CheckCircle}
                label='Email đã xác thực'
                value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              />
              <DetailItem
                icon={CheckCircle}
                label='SĐT đã xác thực'
                value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              />
              <DetailItem
                icon={Clock}
                label='Ngày tạo tài khoản'
                value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null}
              />
            </dl>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditMode && (
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
            </div>            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <DatePicker
                label='Ngày sinh'
                name='dateOfBirth'
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                maxDate={new Date().toISOString().split('T')[0]} // Không cho chọn ngày tương lai
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
              label='Tình trạng bệnh lý (nếu có)'
              id='medicalConditions'
              name='medicalConditions'
              type='textarea'
              value={formData.medicalConditions}
              onChange={handleInputChange}
              error={errors.medicalConditions}
              disabled={isSubmitting}
              rows={3}
            />            <DatePicker
              label='Ngày hiến máu gần nhất'
              name='lastDonationDate'
              value={formData.lastDonationDate}
              onChange={handleInputChange}
              maxDate={new Date().toISOString().split('T')[0]} // Không cho chọn ngày tương lai
              placeholder='Chọn ngày hiến máu gần nhất'
              disabled={isSubmitting}
            />
            <div className='flex items-center'>
              <input
                id='isReadyToDonate'
                name='isReadyToDonate'
                type='checkbox'
                checked={formData.isReadyToDonate}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
              />
              <label
                htmlFor='isReadyToDonate'
                className='ml-2 block text-sm text-gray-900'
              >
                Sẵn sàng hiến máu
              </label>
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
        )}
      </div>
    </div>
  );
};

export default UserProfileForm;
