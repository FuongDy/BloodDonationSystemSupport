// src/components/admin/AdminUserForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Edit3, 
  Eye,
  Mail,
  Phone,
  UserCircle,
  MapPin,
  Briefcase,
  Shield,
  Heart,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

import userService from '../../services/userService';
import bloodTypeService from '../../services/bloodTypeService';
import InputField from '../common/InputField';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * AdminUserForm Component
 * 
 * Component có thể hoạt động ở 2 modes:
 * - mode="view": Hiển thị thông tin chi tiết (read-only)
 * - mode="edit": Form chỉnh sửa thông tin
 * 
 * @param {Object} props
 * @param {string} props.userId - ID của user
 * @param {string} props.mode - "view" hoặc "edit"
 */
const AdminUserForm = ({ userId, mode = "view" }) => {
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
    roleName: '',
    status: '',
    emailVerified: false,
    phoneVerified: false,
  });
  const [roles, setRoles] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {      // Tạo danh sách roles cố định vì chưa có API
      const rolesData = [
        { name: 'ADMIN', description: 'Quản trị viên' },
        { name: 'STAFF', description: 'Nhân viên' },
        { name: 'MEMBER', description: 'Thành viên' }
      ];

      const [userData, bloodTypesData] = await Promise.all([
        userService.getUserByIdForAdmin(userId, forceRefresh),
        bloodTypeService.getAll(),
      ]);
      
      setUser(userData);
      setRoles(rolesData);
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
          roleName: userData.role || userData.roleName || '',
          status: userData.status || 'ACTIVE',
          emailVerified: userData.emailVerified || false,
          phoneVerified: userData.phoneVerified || false,
        };
        setFormData(newFormData);
      }    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error(`Failed to create user: ${error.message}`);
      navigate('/admin/users');
    } finally {
      setIsLoading(false);
    }
  }, [userId, navigate, isEditMode]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

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
    const toastId = toast.loading('Đang cập nhật người dùng...');

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
      const _updatedUser = await userService.updateUserByAdmin(userId, requestData);
      toast.success('Cập nhật người dùng thành công!', { id: toastId });
      
      // Force refresh dữ liệu user từ server
      setUser(null);
      await fetchUserData(true);
        // Có thể redirect về view mode hoặc list
      // navigate(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(`Cập nhật người dùng thất bại: ${error.message || 'Vui lòng thử lại.'}`, {
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
  // Component hiển thị chi tiết cho cả view và edit mode
  const DetailItem = ({ 
    icon: IconComponent, 
    label, 
    value, 
    highlight = false, 
    isEditable = false,
    fieldName = '',
    fieldType = 'text',
    options = [],
    rows = 1
  }) => {
    const Icon = IconComponent;
    
    return (
      <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
        <dt className='text-sm font-medium text-gray-500 flex items-center'>
          <IconComponent size={16} className='mr-2 text-red-600' />
          {label}
          {isEditMode && isEditable && <span className='text-red-500 ml-1'>*</span>}
        </dt>
        <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2`}>
          {isEditMode && isEditable ? (
            // Edit mode - render input/select/textarea
            <>
              {fieldType === 'select' ? (
                <select
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : fieldType === 'textarea' ? (
                <textarea
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={rows}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
                />
              ) : fieldType === 'checkbox' ? (
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    name={fieldName}
                    checked={formData[fieldName] || false}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                  />
                  <span className='ml-2 text-sm text-gray-900'>
                    {formData[fieldName] ? 'Có' : 'Không'}
                  </span>
                </div>
              ) : (
                <input
                  type={fieldType}
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
              {errors[fieldName] && (
                <p className='mt-1 text-xs text-red-600'>{errors[fieldName]}</p>
              )}
            </>
          ) : (
            // View mode - render value
            <span className={highlight ? 'font-semibold text-red-700' : 'text-gray-900'}>
              {value !== null && value !== undefined && value !== '' ? (
                value
              ) : (
                <span className='italic text-gray-400'>Chưa có thông tin</span>
              )}
            </span>
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
    return <div className='text-center py-10'>Không tìm thấy người dùng.</div>;
  }

  const bloodTypeDesc = user.bloodTypeDescription || 'Chưa cập nhật';

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Link
        to='/admin/users'
        className='flex items-center text-red-600 hover:text-red-800 mb-4'
      >
        <ArrowLeft size={20} className='mr-2' />
        Quay lại danh sách
      </Link>

      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {isEditMode ? 'Chỉnh sửa: ' : ''}{user.fullName}
              </h1>
              <p className='text-sm text-gray-500'>
                ID: {user.id} - <span className='font-semibold'>{user.username || user.email}</span>
              </p>
            </div>
            <div className='flex space-x-2'>
              {isViewMode && (
                <Link to={`/admin/users/${userId}/edit`}>
                  <Button variant='outline'>
                    <Edit3 size={16} className='mr-2' /> Chỉnh sửa
                  </Button>
                </Link>
              )}
              {isEditMode && (
                <Link to={`/admin/users/${userId}`}>
                  <Button variant='secondary'>
                    <Eye size={16} className='mr-2' /> Xem chi tiết
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>        {/* UNIFIED VIEW/EDIT MODE */}
        {isEditMode ? (
          <form onSubmit={handleSubmit} className='px-6 py-5'>
            <dl className='divide-y divide-gray-200'>
              <h3 className='text-lg font-semibold text-gray-700 my-3'>
                Thông tin liên hệ
              </h3>
              <DetailItem 
                icon={Mail} 
                label='Email' 
                value={user.email} 
              />
              <DetailItem 
                icon={Phone} 
                label='Số điện thoại' 
                value={user.phone}
                isEditable={isEditMode}
                fieldName='phone'
                fieldType='tel'
              />
              <DetailItem 
                icon={MapPin} 
                label='Địa chỉ' 
                value={user.address}
                isEditable={isEditMode}
                fieldName='address'
                fieldType='textarea'
                rows={3}
              />
              <DetailItem 
                icon={UserCircle} 
                label='Liên hệ khẩn cấp' 
                value={user.emergencyContact}
                isEditable={isEditMode}
                fieldName='emergencyContact'
              />

              <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
                Thông tin cá nhân & Y tế
              </h3>
              <DetailItem 
                icon={UserCircle} 
                label='Họ và tên đầy đủ' 
                value={user.fullName}
                isEditable={isEditMode}
                fieldName='fullName'
                highlight={true}
              />
              <DetailItem
                icon={CalendarDays}
                label='Ngày sinh'
                value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null}
                isEditable={isEditMode}
                fieldName='dateOfBirth'
                fieldType='date'
              />
              <DetailItem 
                icon={UserCircle} 
                label='Giới tính' 
                value={user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : user.gender === 'Other' ? 'Khác' : user.gender}
                isEditable={isEditMode}
                fieldName='gender'
                fieldType='select'
                options={[
                  { value: '', label: '-- Chọn giới tính --' },
                  { value: 'Male', label: 'Nam' },
                  { value: 'Female', label: 'Nữ' },
                  { value: 'Other', label: 'Khác' }
                ]}
              />
              <DetailItem
                icon={Heart}
                label='Nhóm máu'
                value={bloodTypeDesc}
                highlight={bloodTypeDesc !== 'Chưa cập nhật'}
                isEditable={isEditMode}
                fieldName='bloodTypeId'
                fieldType='select'
                options={[
                  { value: '', label: '-- Chọn nhóm máu --' },
                  ...bloodTypes
                    .filter((value, index, self) => index === self.findIndex(t => t.bloodGroup === value.bloodGroup))
                    .map(bt => ({ value: bt.id, label: bt.bloodGroup }))
                ]}
              />
              <DetailItem 
                icon={Briefcase} 
                label='Tình trạng bệnh lý' 
                value={user.medicalConditions}
                isEditable={isEditMode}
                fieldName='medicalConditions'
                fieldType='textarea'
                rows={3}
              />
              <DetailItem
                icon={CalendarDays}
                label='Lần hiến máu cuối'
                value={user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : null}
                isEditable={isEditMode}
                fieldName='lastDonationDate'
                fieldType='date'
              />
              <DetailItem
                icon={user.isReadyToDonate ? CheckCircle : XCircle}
                label='Sẵn sàng hiến máu'
                value={user.isReadyToDonate ? 'Có' : 'Không'}
                highlight={user.isReadyToDonate === true}
                isEditable={isEditMode}
                fieldName='isReadyToDonate'
                fieldType='checkbox'
              />

              <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
                Thông tin tài khoản
              </h3>
              <DetailItem 
                icon={Shield} 
                label='Vai trò' 
                value={user.role} 
                highlight={true}
                isEditable={isEditMode}
                fieldName='roleName'
                fieldType='select'
                options={roles.map(role => ({ value: role.name, label: `${role.name} (${role.description})` }))}
              />
              <DetailItem
                icon={user.status === 'ACTIVE' ? CheckCircle : user.status === 'SUSPENDED' ? XCircle : HelpCircle}
                label='Trạng thái'
                value={user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'SUSPENDED' ? 'Tạm khóa' : user.status === 'DEACTIVATED' ? 'Vô hiệu hóa' : user.status}
                highlight={user.status === 'ACTIVE'}
                isEditable={isEditMode}
                fieldName='status'
                fieldType='select'
                options={[
                  { value: 'ACTIVE', label: 'Active (Hoạt động)' },
                  { value: 'SUSPENDED', label: 'Suspended (Tạm khóa)' },
                  { value: 'DEACTIVATED', label: 'Deactivated (Vô hiệu hóa)' }
                ]}
              />
              <DetailItem
                icon={user.emailVerified ? CheckCircle : XCircle}
                label='Email đã xác thực'
                value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                isEditable={isEditMode}
                fieldName='emailVerified'
                fieldType='checkbox'
              />
              <DetailItem
                icon={user.phoneVerified ? CheckCircle : XCircle}
                label='SĐT đã xác thực'
                value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                isEditable={isEditMode}
                fieldName='phoneVerified'
                fieldType='checkbox'
              />
              <DetailItem
                icon={Clock}
                label='Ngày tạo'
                value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null}
              />
              <DetailItem
                icon={Clock}
                label='Cập nhật lần cuối'
                value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null}
              />
            </dl>
            
            <div className='flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200'>
              <Link to='/admin/users'>
                <Button type='button' variant='secondary' disabled={isSubmitting}>
                  Quay lại danh sách
                </Button>
              </Link>
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
        ) : (
          <div className='px-6 py-5'>
            <dl className='divide-y divide-gray-200'>
              <h3 className='text-lg font-semibold text-gray-700 my-3'>
                Thông tin liên hệ
              </h3>
              <DetailItem 
                icon={Mail} 
                label='Email' 
                value={user.email} 
              />
              <DetailItem 
                icon={Phone} 
                label='Số điện thoại' 
                value={user.phone}
              />
              <DetailItem 
                icon={MapPin} 
                label='Địa chỉ' 
                value={user.address}
              />
              <DetailItem 
                icon={UserCircle} 
                label='Liên hệ khẩn cấp' 
                value={user.emergencyContact}
              />

              <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
                Thông tin cá nhân & Y tế
              </h3>
              <DetailItem 
                icon={UserCircle} 
                label='Họ và tên đầy đủ' 
                value={user.fullName}
                highlight={true}
              />
              <DetailItem
                icon={CalendarDays}
                label='Ngày sinh'
                value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null}
              />
              <DetailItem 
                icon={UserCircle} 
                label='Giới tính' 
                value={user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : user.gender === 'Other' ? 'Khác' : user.gender}
              />
              <DetailItem
                icon={Heart}
                label='Nhóm máu'
                value={bloodTypeDesc}
                highlight={bloodTypeDesc !== 'Chưa cập nhật'}
              />
              <DetailItem 
                icon={Briefcase} 
                label='Tình trạng bệnh lý' 
                value={user.medicalConditions}
              />
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
                icon={Shield} 
                label='Vai trò' 
                value={user.role} 
                highlight={true}
              />
              <DetailItem
                icon={user.status === 'ACTIVE' ? CheckCircle : user.status === 'SUSPENDED' ? XCircle : HelpCircle}
                label='Trạng thái'
                value={user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'SUSPENDED' ? 'Tạm khóa' : user.status === 'DEACTIVATED' ? 'Vô hiệu hóa' : user.status}
                highlight={user.status === 'ACTIVE'}
              />
              <DetailItem
                icon={user.emailVerified ? CheckCircle : XCircle}
                label='Email đã xác thực'
                value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              />
              <DetailItem
                icon={user.phoneVerified ? CheckCircle : XCircle}
                label='SĐT đã xác thực'
                value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              />
              <DetailItem
                icon={Clock}
                label='Ngày tạo'
                value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null}
              />
              <DetailItem
                icon={Clock}
                label='Cập nhật lần cuối'
                value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null}
              />
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserForm;


