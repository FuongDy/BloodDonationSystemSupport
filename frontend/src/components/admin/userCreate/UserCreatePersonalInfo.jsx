// src/components/admin/userCreate/UserCreatePersonalInfo.jsx
import React from 'react';
import InputField from '../../common/InputField';

const UserCreatePersonalInfo = ({ formData, onInputChange, errors, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Ngày sinh"
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={onInputChange}
          required
          error={errors.dateOfBirth}
          disabled={isLoading}
        />
        <InputField
          label="Số điện thoại"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onInputChange}
          required
          error={errors.phone}
          disabled={isLoading}
          placeholder="VD: 0901234567"
        />
      </div>
      <InputField
        label="Địa chỉ"
        id="address"
        name="address"
        as="textarea"
        rows={3}
        value={formData.address}
        onChange={onInputChange}
        required
        error={errors.address}
        disabled={isLoading}
        placeholder="Nhập địa chỉ đầy đủ (tối thiểu 10 ký tự)"
      />
    </div>
  );
};

export default UserCreatePersonalInfo;
