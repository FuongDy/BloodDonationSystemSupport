// src/components/admin/BloodRequestForm.jsx
import React from 'react';
import Button from '../common/Button';
import InputField from '../common/InputField';

const BloodRequestForm = ({ 
  formData, 
  bloodTypes, 
  onInputChange, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <InputField
          label='Tên bệnh nhân'
          name='patientName'
          value={formData.patientName}
          onChange={onInputChange}
          required
          disabled={isLoading}
        />
        
        <InputField
          label='Bệnh viện'
          name='hospital'
          value={formData.hospital}
          onChange={onInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
            onChange={onInputChange}
            className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
            required
            disabled={isLoading}
          >
            <option value=''>-- Chọn nhóm máu --</option>
            {bloodTypes
              .filter(
                (bt, index, self) =>
                  index ===
                  self.findIndex(t => t.bloodGroup === bt.bloodGroup)
              )
              .map(bt => (
                <option key={bt.id} value={bt.id}>
                  {bt.bloodGroup}
                </option>
              ))}
          </select>
        </div>

        <InputField
          label='Số lượng (đơn vị)'
          name='quantityInUnits'
          type='number'
          value={formData.quantityInUnits}
          onChange={onInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Mức độ khẩn cấp
        </label>        <select
          name='urgency'
          value={formData.urgency}
          onChange={onInputChange}
          className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500'
          disabled={isLoading}
        >
          <option value='CRITICAL'>Cực kỳ khẩn cấp</option>
          <option value='URGENT'>Khẩn cấp</option>
          <option value='NORMAL'>Bình thường</option>
        </select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button 
          type='submit' 
          disabled={isLoading}
          isLoading={isLoading}
        >
          Tạo yêu cầu
        </Button>
      </div>
    </form>
  );
};

export default BloodRequestForm;
