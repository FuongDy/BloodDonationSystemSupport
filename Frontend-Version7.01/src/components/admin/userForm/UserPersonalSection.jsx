// src/components/admin/userForm/UserPersonalSection.jsx
import React from 'react';
import { UserCircle, CalendarDays, Heart, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import UserDetailItem from './UserDetailItem';

const UserPersonalSection = ({ 
  user, 
  bloodTypes,
  isEditMode, 
  formData, 
  onInputChange, 
  errors, 
  isSubmitting 
}) => {
  const bloodTypeDesc = user.bloodTypeDescription || 'Chưa cập nhật';

  return (
    <>
      <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
        Thông tin cá nhân & Y tế
      </h3>
      <UserDetailItem
        icon={UserCircle}
        label='Họ và tên đầy đủ'
        value={user.fullName}
        isEditable={true}
        fieldName='fullName'
        highlight={true}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={CalendarDays}
        label='Ngày sinh'
        value={
          user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString()
            : null
        }
        isEditable={true}
        fieldName='dateOfBirth'
        fieldType='date'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={UserCircle}
        label='Giới tính'
        value={
          user.gender === 'Male'
            ? 'Nam'
            : user.gender === 'Female'
              ? 'Nữ'
              : user.gender === 'Other'
                ? 'Khác'
                : user.gender
        }
        isEditable={true}
        fieldName='gender'
        fieldType='select'
        options={[
          { value: '', label: '-- Chọn giới tính --' },
          { value: 'Male', label: 'Nam' },
          { value: 'Female', label: 'Nữ' },
          { value: 'Other', label: 'Khác' },
        ]}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={Heart}
        label='Nhóm máu'
        value={bloodTypeDesc}
        highlight={bloodTypeDesc !== 'Chưa cập nhật'}
        isEditable={true}
        fieldName='bloodTypeId'
        fieldType='select'
        options={[
          { value: '', label: '-- Chọn nhóm máu --' },
          ...bloodTypes
            .filter(
              (value, index, self) =>
                index ===
                self.findIndex(t => t.bloodGroup === value.bloodGroup)
            )
            .map(bt => ({ value: bt.id, label: bt.bloodGroup })),
        ]}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={Briefcase}
        label='Tình trạng bệnh lý'
        value={user.medicalConditions}
        isEditable={true}
        fieldName='medicalConditions'
        fieldType='textarea'
        rows={3}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={CalendarDays}
        label='Lần hiến máu cuối'
        value={
          user.lastDonationDate
            ? new Date(user.lastDonationDate).toLocaleDateString()
            : null
        }
        isEditable={true}
        fieldName='lastDonationDate'
        fieldType='date'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={user.isReadyToDonate ? CheckCircle : XCircle}
        label='Sẵn sàng hiến máu'
        value={user.isReadyToDonate ? 'Có' : 'Không'}
        highlight={user.isReadyToDonate === true}
        isEditable={true}
        fieldName='isReadyToDonate'
        fieldType='checkbox'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default UserPersonalSection;
