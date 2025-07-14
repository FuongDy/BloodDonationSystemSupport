// src/components/admin/userCreate/UserCreatePersonalInfo.jsx
import React from 'react';
import InputField from '../../common/InputField';
import { formatDateForInput } from '../../../utils/dateUtils';

const UserCreatePersonalInfo = ({ formData, onInputChange, errors, isLoading }) => {
  // Convert dd-MM-yyyy to YYYY-MM-DD for HTML date input
  const dateValue = formatDateForInput(formData.dateOfBirth);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Ngày sinh"
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={dateValue}
          onChange={onInputChange}
          required
          error={errors.dateOfBirth}
          disabled={isLoading}
        />
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onInputChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <InputField
          label="Liên hệ khẩn cấp"
          id="emergencyContact"
          name="emergencyContact"
          type="tel"
          value={formData.emergencyContact}
          onChange={onInputChange}
          error={errors.emergencyContact}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Tình trạng bệnh lý"
          id="medicalConditions"
          name="medicalConditions"
          as="textarea"
          rows={3}
          value={formData.medicalConditions}
          onChange={onInputChange}
          error={errors.medicalConditions}
          disabled={isLoading}
          placeholder="Nhập tình trạng bệnh lý (nếu có)"
        />
        <div>
          <InputField
            label="Lần hiến máu cuối"
            id="lastDonationDate"
            name="lastDonationDate"
            type="date"
            value={formatDateForInput(formData.lastDonationDate)}
            onChange={onInputChange}
            error={errors.lastDonationDate}
            disabled={isLoading}
          />
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isReadyToDonate"
                checked={formData.isReadyToDonate}
                onChange={onInputChange}
                disabled={isLoading}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sẵn sàng hiến máu</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreatePersonalInfo;
