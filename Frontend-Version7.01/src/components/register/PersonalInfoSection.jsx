// src/components/register/PersonalInfoSection.jsx
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Droplets } from 'lucide-react';
import DatePicker from '../common/DatePicker';
import AddressPicker from '../common/AddressPicker';

const PersonalInfoSection = ({
    formData,
    validationErrors,
    authLoading,
    isFetchingBloodTypes,
    bloodTypesFromApi,
    onChange,
    handleAddressSelect
}) => {
    return (
        <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'>
                <User className='w-5 h-5 mr-2 text-red-600' />
                Thông tin cá nhân
            </h3>

            {/* Full Name */}
            <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                    Họ và tên đầy đủ *
                </label>
                <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    value={formData.fullName}
                    onChange={onChange}
                    placeholder='Ví dụ: Nguyễn Văn An'
                    required
                    disabled={authLoading || isFetchingBloodTypes}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.fullName
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                />
                {validationErrors.fullName && (
                    <p className='text-xs text-red-600'>
                        {validationErrors.fullName}
                    </p>
                )}
            </div>

            {/* Email and Phone */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Mail className='w-4 h-4 mr-1 text-gray-500' />
                        Email *
                    </label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={onChange}
                        placeholder='your.email@example.com'
                        required
                        disabled={authLoading || isFetchingBloodTypes}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.email
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 bg-white'
                            }`}
                    />
                    {validationErrors.email && (
                        <p className='text-xs text-red-600'>
                            {validationErrors.email}
                        </p>
                    )}
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Phone className='w-4 h-4 mr-1 text-gray-500' />
                        Số điện thoại *
                    </label>
                    <input
                        id='phone'
                        name='phone'
                        type='tel'
                        value={formData.phone}
                        onChange={onChange}
                        placeholder='0987654321'
                        required
                        disabled={authLoading || isFetchingBloodTypes}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.phone
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 bg-white'
                            }`}
                    />
                    {validationErrors.phone && (
                        <p className='text-xs text-red-600'>
                            {validationErrors.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Date of Birth and Blood Type */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <DatePicker
                        label={
                            <div className='flex items-center text-sm font-medium text-gray-700'>
                                <Calendar className='w-4 h-4 mr-1 text-gray-500' />
                                Ngày sinh *
                            </div>
                        }
                        name='dateOfBirth'
                        value={formData.dateOfBirth}
                        onChange={onChange}
                        required
                        maxDate={(() => {
                            // Format today's date as DD-MM-YYYY for max date
                            const today = new Date();
                            const day = String(today.getDate()).padStart(2, '0');
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const year = today.getFullYear();
                            return `${day}-${month}-${year}`;
                        })()} // Không cho chọn ngày tương lai
                        minDate={(() => {
                            // Format date 100 years ago as DD-MM-YYYY
                            const pastDate = new Date();
                            pastDate.setFullYear(pastDate.getFullYear() - 100);
                            const day = String(pastDate.getDate()).padStart(2, '0');
                            const month = String(pastDate.getMonth() + 1).padStart(2, '0');
                            const year = pastDate.getFullYear();
                            return `${day}-${month}-${year}`;
                        })()} // Giới hạn ngày sinh từ 100 năm trước
                        placeholder='Tối thiểu 16 tuổi'
                        disabled={authLoading || isFetchingBloodTypes}
                        error={validationErrors.dateOfBirth}
                    />
                    {validationErrors.dateOfBirth && (
                        <p className='text-xs text-red-600'>
                            {validationErrors.dateOfBirth}
                        </p>
                    )}
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Droplets className='w-4 h-4 mr-1 text-gray-500' />
                        Nhóm máu (tùy chọn)
                    </label>
                    {isFetchingBloodTypes ? (
                        <div className='w-full px-4 py-3 border rounded-lg bg-gray-50 flex items-center justify-center'>
                            <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2'></div>
                            <span className='text-sm text-gray-600'>Đang tải...</span>
                        </div>
                    ) : (
                        <select
                            id='bloodTypeId'
                            name='bloodTypeId'
                            value={formData.bloodTypeId}
                            onChange={onChange}
                            disabled={
                                authLoading ||
                                isFetchingBloodTypes ||
                                bloodTypesFromApi.length === 0
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.bloodTypeId
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 bg-white'
                                }`}
                        >
                            <option value=''>-- Chọn nhóm máu --</option>
                            {bloodTypesFromApi
                                .filter(
                                    (value, index, self) =>
                                        index === self.findIndex(t => t.bloodGroup === value.bloodGroup)
                                )
                                .map(bt => (
                                    <option key={bt.id} value={bt.id}>
                                        {bt.bloodGroup}
                                    </option>
                                ))}
                        </select>
                    )}
                    {validationErrors.bloodTypeId && (
                        <p className='text-xs text-red-600'>
                            {validationErrors.bloodTypeId}
                        </p>
                    )}
                </div>
            </div>

            {/* Address */}
            <AddressPicker 
              onAddressSelect={handleAddressSelect} 
              value={formData.address}
              error={validationErrors.address}
              disabled={authLoading || isFetchingBloodTypes}
            />
        </div>
    );
};

export default PersonalInfoSection;
