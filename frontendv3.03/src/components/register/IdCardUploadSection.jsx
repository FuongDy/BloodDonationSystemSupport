import React, { useState, useRef } from 'react';
import { Upload, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const IdCardUploadSection = ({
  validationErrors,
  authLoading,
  isFetchingBloodTypes,
  onChange
}) => {
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const fileInputFrontRef = useRef(null);
  const fileInputBackRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File ảnh không được lớn hơn 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'front') {
        setPreviewFront(e.target.result);
      } else {
        setPreviewBack(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    // Update form data
    const event = {
      target: {
        name: type === 'front' ? 'frontImage' : 'backImage',
        value: file
      }
    };
    onChange(event);
  };

  const removeFile = (type) => {
    if (type === 'front') {
      setPreviewFront(null);
      if (fileInputFrontRef.current) {
        fileInputFrontRef.current.value = '';
      }
    } else {
      setPreviewBack(null);
      if (fileInputBackRef.current) {
        fileInputBackRef.current.value = '';
      }
    }

    // Clear form data
    const event = {
      target: {
        name: type === 'front' ? 'frontImage' : 'backImage',
        value: null
      }
    };
    onChange(event);
  };

  const triggerFileInput = (type) => {
    if (type === 'front') {
      fileInputFrontRef.current?.click();
    } else {
      fileInputBackRef.current?.click();
    }
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'>
        <Upload className='w-5 h-5 mr-2 text-red-600' />
        Tải lên ảnh CCCD/CMND
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Front Image */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Mặt trước CCCD/CMND *
          </label>
          <div className='relative'>
            {previewFront ? (
              <div className='relative'>
                <img
                  src={previewFront}
                  alt='CCCD mặt trước'
                  className='w-full h-48 object-cover rounded-lg border border-gray-300'
                />
                <button
                  type='button'
                  onClick={() => removeFile('front')}
                  className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                  disabled={authLoading || isFetchingBloodTypes}
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <div
                onClick={() => triggerFileInput('front')}
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  validationErrors.frontImage
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50'
                } ${authLoading || isFetchingBloodTypes ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className='w-8 h-8 text-gray-400 mb-2' />
                <p className='text-sm text-gray-600 text-center'>
                  Nhấp để tải ảnh<br />
                  <span className='text-xs text-gray-500'>JPG, PNG (tối đa 5MB)</span>
                </p>
              </div>
            )}
            <input
              ref={fileInputFrontRef}
              type='file'
              accept='image/*'
              onChange={(e) => handleFileChange(e, 'front')}
              className='hidden'
              disabled={authLoading || isFetchingBloodTypes}
            />
          </div>
          {validationErrors.frontImage && (
            <p className='text-xs text-red-600'>
              {validationErrors.frontImage}
            </p>
          )}
        </div>

        {/* Back Image */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Mặt sau CCCD/CMND *
          </label>
          <div className='relative'>
            {previewBack ? (
              <div className='relative'>
                <img
                  src={previewBack}
                  alt='CCCD mặt sau'
                  className='w-full h-48 object-cover rounded-lg border border-gray-300'
                />
                <button
                  type='button'
                  onClick={() => removeFile('back')}
                  className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                  disabled={authLoading || isFetchingBloodTypes}
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <div
                onClick={() => triggerFileInput('back')}
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  validationErrors.backImage
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50'
                } ${authLoading || isFetchingBloodTypes ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className='w-8 h-8 text-gray-400 mb-2' />
                <p className='text-sm text-gray-600 text-center'>
                  Nhấp để tải ảnh<br />
                  <span className='text-xs text-gray-500'>JPG, PNG (tối đa 5MB)</span>
                </p>
              </div>
            )}
            <input
              ref={fileInputBackRef}
              type='file'
              accept='image/*'
              onChange={(e) => handleFileChange(e, 'back')}
              className='hidden'
              disabled={authLoading || isFetchingBloodTypes}
            />
          </div>
          {validationErrors.backImage && (
            <p className='text-xs text-red-600'>
              {validationErrors.backImage}
            </p>
          )}
        </div>
      </div>

      <div className='p-3 bg-blue-50 rounded-lg'>
        <p className='text-xs text-blue-800'>
          <strong>Lưu ý:</strong> Vui lòng tải lên ảnh CCCD/CMND rõ ràng, đầy đủ thông tin. 
          Ảnh sẽ được sử dụng để xác minh danh tính của bạn.
        </p>
      </div>
    </div>
  );
};

export default IdCardUploadSection;
