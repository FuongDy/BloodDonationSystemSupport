// src/components/admin/userCreate/UserCreateRoleAndStatus.jsx
import React from 'react';

const UserCreateRoleAndStatus = ({ 
  formData, 
  onInputChange, 
  errors, 
  isLoading, 
  roles, 
  bloodTypes 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="roleName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vai trò <span className="text-red-500">*</span>
          </label>
          <select
            id="roleName"
            name="roleName"
            value={formData.roleName}
            onChange={onInputChange}
            disabled={isLoading || roles.length === 0}
            required
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
              errors.roleName ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {roles.map(role => (
              <option key={role.name} value={role.name}>
                {role.name} ({role.description})
              </option>
            ))}
          </select>
          {errors.roleName && (
            <p className="mt-1 text-xs text-red-600">{errors.roleName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onInputChange}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="bloodTypeId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nhóm máu (Tùy chọn)
        </label>
        <select
          id="bloodTypeId"
          name="bloodTypeId"
          value={formData.bloodTypeId}
          onChange={onInputChange}
          disabled={isLoading || bloodTypes.length === 0}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        >
          <option value="">-- Chọn nhóm máu --</option>
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
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <input
            id="emailVerified"
            name="emailVerified"
            type="checkbox"
            checked={formData.emailVerified}
            onChange={onInputChange}
            disabled={isLoading}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="emailVerified"
            className="ml-2 block text-sm text-gray-900"
          >
            Email đã xác thực
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="phoneVerified"
            name="phoneVerified"
            type="checkbox"
            checked={formData.phoneVerified}
            onChange={onInputChange}
            disabled={isLoading}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="phoneVerified"
            className="ml-2 block text-sm text-gray-900"
          >
            SĐT đã xác thực
          </label>
        </div>
      </div>
    </div>
  );
};

export default UserCreateRoleAndStatus;
