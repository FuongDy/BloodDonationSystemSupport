// src/components/register/IdCardUploadSection.jsx
import React, { useState } from 'react';
import { FileImage, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { compressImage, ultraCompressImage, validateImageFile, formatFileSize } from '../../utils/imageUtils';

const IdCardUploadSection = ({
  formData,
  validationErrors,
  authLoading,
  onChange,
  onFileUpload
}) => {
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState('');

  const handleFileChange = async (event, side) => {
    const file = event.target.files[0];
    
    if (!file) return;

    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        onChange({
          target: {
            name: side === 'front' ? 'frontImage' : 'backImage',
            value: validation.error
          }
        });
        return;
      }

      // Compress image if needed
      let compressedFile;
      
      // Try normal compression first
      compressedFile = await compressImage(file, 850); // 850KB target
      
      // If still too large, use ultra compression
      if (compressedFile.size > 900 * 1024) { // If larger than 900KB
        console.log('File still large, applying ultra compression...');
        compressedFile = await ultraCompressImage(file, 800);
      }
      
      // Show compression info
      if (compressedFile.size < file.size) {
        const reductionPercent = ((1 - compressedFile.size/file.size) * 100).toFixed(1);
        const info = `Đã nén: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (giảm ${reductionPercent}%)`;
        setCompressionInfo(info);
        console.log(`Image compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${reductionPercent}% reduction)`);
        
        // Clear compression info after 5 seconds
        setTimeout(() => setCompressionInfo(''), 5000);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === 'front') {
          setFrontPreview(e.target.result);
        } else {
          setBackPreview(e.target.result);
        }
      };
      reader.readAsDataURL(compressedFile);

      // Store compressed file in form data
      if (onFileUpload) {
        onFileUpload(side, compressedFile);
      }

      // Clear any previous validation errors
      onChange({
        target: {
          name: side === 'front' ? 'frontImage' : 'backImage',
          value: ''
        }
      });

    } catch (error) {
      console.error('Error processing image:', error);
      onChange({
        target: {
          name: side === 'front' ? 'frontImage' : 'backImage',
          value: 'Lỗi khi xử lý ảnh. Vui lòng thử lại.'
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (side) => {
    if (side === 'front') {
      setFrontPreview(null);
      if (onFileUpload) {
        onFileUpload('front', null);
      }
    } else {
      setBackPreview(null);
      if (onFileUpload) {
        onFileUpload('back', null);
      }
    }
  };

  const FileUploadBox = ({ side, preview, error }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        <FileImage className="w-4 h-4 mr-1 text-gray-500" />
        Ảnh mặt {side === 'front' ? 'trước' : 'sau'} CCCD *
      </label>
      
      <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={`CCCD mặt ${side === 'front' ? 'trước' : 'sau'}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeFile(side)}
              disabled={authLoading || isProcessing}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600 bg-white px-1 rounded">
                Đã tải lên
              </span>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => handleFileChange(e, side)}
              disabled={authLoading || isProcessing}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Nhấn để chọn ảnh mặt {side === 'front' ? 'trước' : 'sau'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, JPEG, PNG - Tối đa 20MB (nén thông minh)
              </p>
            </div>
          </label>
        )}
      </div>
      
      {error && (
        <div className="flex items-center text-xs text-red-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b pb-2">
        <FileImage className="w-5 h-5 mr-2 text-red-600" />
        Xác minh danh tính
      </h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">
              Yêu cầu xác minh danh tính
            </p>
            <ul className="text-blue-700 space-y-1">
              <li>• Tải lên ảnh mặt trước và mặt sau của CCCD/CMND</li>
              <li>• Ảnh phải rõ nét, đủ sáng và hiển thị đầy đủ thông tin</li>
              <li>• Hệ thống sẽ tự động nén và xác minh tính hợp lệ của giấy tờ</li>
              <li>• Hỗ trợ nén thông minh: file lớn sẽ được tự động tối ưu</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploadBox
          side="front"
          preview={frontPreview}
          error={validationErrors.frontImage}
        />
        <FileUploadBox
          side="back"
          preview={backPreview}
          error={validationErrors.backImage}
        />
      </div>

      {validationErrors.idCard && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center text-red-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{validationErrors.idCard}</span>
          </div>
        </div>
      )}

      {compressionInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{compressionInfo}</span>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-blue-700">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-sm">Đang xử lý ảnh...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdCardUploadSection;
