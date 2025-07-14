import React from 'react';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const CCCDVerificationAlert = ({ 
  isVisible, 
  onClose, 
  title = "Cần xác minh danh tính", 
  message = "Bạn cần tải lên ảnh CCCD/CMND để tiếp tục đặt lịch hiến máu.",
  showNavigateButton = true,
  navigateButtonText = "Cập nhật thông tin",
  navigateUrl = "/profile/edit"
}) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleNavigate = () => {
    navigate(navigateUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon and title */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Upload className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tại sao cần CCCD/CMND?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Xác minh danh tính người hiến máu</li>
                    <li>• Đảm bảo an toàn cho quá trình hiến máu</li>
                    <li>• Tuân thủ quy định pháp luật về y tế</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 order-2 sm:order-1"
            >
              Để sau
            </Button>
            {showNavigateButton && (
              <Button
                variant="primary"
                onClick={handleNavigate}
                className="flex-1 order-1 sm:order-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                {navigateButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCCDVerificationAlert;
