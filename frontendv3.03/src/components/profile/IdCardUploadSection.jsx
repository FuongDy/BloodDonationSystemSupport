import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const IdCardUploadSection = ({ onFileChange, isSubmitting }) => {
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const fileInputFrontRef = useRef(null);
  const fileInputBackRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp ảnh (JPG, PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Kích thước tệp không được vượt quá 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') setPreviewFront(reader.result);
      else setPreviewBack(reader.result);
    };
    reader.readAsDataURL(file);

    onFileChange(type === 'front' ? 'frontImage' : 'backImage', file);
  };

  const triggerFileInput = (ref) => ref.current?.click();

  const renderUploadBox = (type, previewSrc, ref) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {type === 'front' ? 'Mặt trước CCCD/CMND' : 'Mặt sau CCCD/CMND'} *
      </label>
      {previewSrc ? (
        <div className="relative">
          <img src={previewSrc} alt={`${type} preview`} className="w-full h-48 object-cover rounded-lg border" />
          <Button
            variant="danger" size="sm"
            className="absolute top-2 right-2 rounded-full p-1 h-auto"
            onClick={() => {
              if (type === 'front') setPreviewFront(null); else setPreviewBack(null);
              onFileChange(type === 'front' ? 'frontImage' : 'backImage', null);
            }}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => triggerFileInput(ref)}
          className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Nhấn để tải ảnh</span>
          <span className="text-xs text-gray-500">Tối đa 5MB</span>
        </div>
      )}
      <input
        type="file"
        ref={ref}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={(e) => handleFileSelect(e, type)}
        disabled={isSubmitting}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderUploadBox('front', previewFront, fileInputFrontRef)}
      {renderUploadBox('back', previewBack, fileInputBackRef)}
    </div>
  );
};

export default IdCardUploadSection;