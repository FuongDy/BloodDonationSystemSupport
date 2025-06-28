// src/components/admin/userForm/UserContactSection.jsx
import React from 'react';
import { Mail, Phone, MapPin, UserCircle } from 'lucide-react';
import UserDetailItem from './UserDetailItem';

const UserContactSection = ({ 
  user, 
  isEditMode, 
  formData, 
  onInputChange, 
  errors, 
  isSubmitting 
}) => {
  return (
    <>
      <h3 className='text-lg font-semibold text-gray-700 my-3'>
        Thông tin liên hệ
      </h3>
      <UserDetailItem 
        icon={Mail} 
        label='Email' 
        value={user.email} 
      />
      <UserDetailItem
        icon={Phone}
        label='Số điện thoại'
        value={user.phone}
        isEditable={true}
        fieldName='phone'
        fieldType='tel'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={MapPin}
        label='Địa chỉ'
        value={user.address}
        isEditable={true}
        fieldName='address'
        fieldType='textarea'
        rows={3}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={UserCircle}
        label='Liên hệ khẩn cấp'
        value={user.emergencyContact}
        isEditable={true}
        fieldName='emergencyContact'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default UserContactSection;
