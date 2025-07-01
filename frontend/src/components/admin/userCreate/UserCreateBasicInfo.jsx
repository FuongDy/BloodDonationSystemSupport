// src/components/admin/userCreate/UserCreateBasicInfo.jsx
import React from 'react';
import InputField from '../../common/InputField';

const UserCreateBasicInfo = ({ formData, onInputChange, errors, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Tên đăng nhập"
          id="username"
          name="username"
          value={formData.username}
          onChange={onInputChange}
          required
          error={errors.username}
          disabled={isLoading}
        />
        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          required
          error={errors.email}
          disabled={isLoading}
        />
      </div>
      <InputField
        label="Họ và tên đầy đủ"
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={onInputChange}
        required
        error={errors.fullName}
        disabled={isLoading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Mật khẩu"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onInputChange}
          required
          error={errors.password}
          disabled={isLoading}
        />
        <InputField
          label="Xác nhận mật khẩu"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={onInputChange}
          required
          error={errors.confirmPassword}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default UserCreateBasicInfo;
