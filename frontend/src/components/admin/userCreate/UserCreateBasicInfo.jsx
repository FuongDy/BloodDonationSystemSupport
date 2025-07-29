// src/components/admin/userCreate/UserCreateBasicInfo.jsx
import InputField from '../../common/InputField';

const UserCreateBasicInfo = ({ formData, onInputChange, errors, isLoading }) => {
  return (
    <div className="space-y-6">
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
