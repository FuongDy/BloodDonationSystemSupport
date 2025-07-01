import React, { useState } from 'react';
import { User, Edit, Check, X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/userService';
import { useAppToast } from '../../../hooks/useAppToast';
import { useNavigate } from 'react-router-dom';

const UserInfoSection = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useAppToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    emergencyContact: user?.emergencyContact || '',
    medicalConditions: user?.medicalConditions || '',
    lastDonationDate: user?.lastDonationDate || '',
    isReadyToDonate: user?.isReadyToDonate ?? true,
  });
  const navigate = useNavigate();

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditData({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || '',
        emergencyContact: user?.emergencyContact || '',
        medicalConditions: user?.medicalConditions || '',
        lastDonationDate: user?.lastDonationDate || '',
        isReadyToDonate: user?.isReadyToDonate ?? true,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile(editData);
      setUser(updatedUser);
      setIsEditing(false);
      showSuccess('Cập nhật thông tin thành công!');
      navigate('/request-donation');
    } catch (error) {
      console.error('Update error:', error);
      showError('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa hiến máu';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Chưa cập nhật';
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className='bg-purple-50 rounded-xl p-6 border border-purple-200'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
          <User className='h-5 w-5 text-purple-600 mr-2' />
          Thông tin cá nhân
        </h3>
        <button
          type="button"
          onClick={handleEditToggle}
          className='flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors'
        >
          {isEditing ? (
            <>
              <X className='h-4 w-4 mr-1' />
              Hủy
            </>
          ) : (
            <>
              <Edit className='h-4 w-4 mr-1' />
              Chỉnh sửa
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Họ và tên <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='fullName'
              value={editData.fullName}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Số điện thoại <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              name='phone'
              value={editData.phone}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Địa chỉ <span className='text-red-500'>*</span>
            </label>
            <textarea
              name='address'
              value={editData.address}
              onChange={handleInputChange}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Ngày sinh <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              name='dateOfBirth'
              value={editData.dateOfBirth}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Giới tính
            </label>
            <select
              name='gender'
              value={editData.gender}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            >
              <option value=''>Chưa chọn</option>
              <option value='MALE'>Nam</option>
              <option value='FEMALE'>Nữ</option>
              <option value='OTHER'>Khác</option>
            </select>
          </div>

          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Liên hệ khẩn cấp
            </label>
            <input
              type='text'
              name='emergencyContact'
              value={editData.emergencyContact}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            />
          </div> */}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tình trạng bệnh lý
            </label>
            <input
              type='text'
              name='medicalConditions'
              value={editData.medicalConditions}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lần hiến máu cuối
            </label>
            <input
              type='date'
              name='lastDonationDate'
              value={editData.lastDonationDate}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            />
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='isReadyToDonate'
              checked={editData.isReadyToDonate}
              onChange={handleInputChange}
              className='h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
            />
            <label htmlFor='isReadyToDonate' className='text-sm font-medium text-gray-700'>
              Sẵn sàng hiến máu
            </label>
          </div>

          <div className='flex gap-2 pt-2'>
            <button
              onClick={handleSave}
              disabled={loading}
              className='flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
              ) : (
                <Check className='h-4 w-4 mr-2' />
              )}
              Lưu thay đổi
            </button>
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Họ và tên:</span>
            <span className='text-sm text-gray-900 font-medium'>{user?.fullName || 'Chưa cập nhật'}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Email:</span>
            <span className='text-sm text-gray-900'>{user?.email || 'Chưa cập nhật'}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Số điện thoại:</span>
            <span className='text-sm text-gray-900'>{formatPhone(user?.phone)}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Ngày sinh:</span>
            <span className='text-sm text-gray-900'>{formatDate(user?.dateOfBirth)}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Địa chỉ:</span>
            <span className='text-sm text-gray-900 text-right max-w-xs'>{user?.address || 'Chưa cập nhật'}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Nhóm máu:</span>
            <span className='text-sm text-gray-900'>{user?.bloodType?.bloodGroup || 'Chưa cập nhật'}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Giới tính:</span>
            <span className='text-sm text-gray-900'>{user?.gender === 'MALE' ? 'Nam' : user?.gender === 'FEMALE' ? 'Nữ' : 'Khác' || 'Chưa cập nhật'}</span>
          </div>
          {/* <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Liên hệ khẩn cấp:</span>
            <span className='text-sm text-gray-900'>{user?.emergencyContact || 'Chưa cập nhật'}</span>
          </div> */}
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Tình trạng bệnh lý:</span>
            <span className='text-sm text-gray-900'>{user?.medicalConditions || 'Chưa cập nhật'}</span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Lần hiến máu cuối:</span>
            <span className='text-sm text-gray-900'>{formatDate(user?.lastDonationDate)}</span>
          </div>
          {/* <div className='flex justify-between items-start'>
            <span className='text-sm font-medium text-gray-600'>Sẵn sàng hiến máu:</span>
            <span className='text-sm text-gray-900'>{user?.isReadyToDonate ? 'Có' : 'Không'}</span>
          </div> */}
        </div>
      )}

      <div className='mt-4 p-3 bg-purple-100 rounded-lg'>
        <p className='text-xs text-purple-800'>
          <strong>Lưu ý:</strong> Vui lòng kiểm tra và cập nhật thông tin cá nhân chính xác trước khi đăng ký hiến máu. 
          Thông tin này sẽ được sử dụng để liên hệ và lập hồ sơ hiến máu của bạn.
        </p>
      </div>
    </div>
  );
};

export default UserInfoSection; 