import React from 'react';
import { AlertTriangle, Upload, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { getCCCDVerificationStatus } from '../../utils/cccvVerification';

const CCCDVerificationBanner = ({ 
  user, 
  showOnVerified = false, 
  className = "",
  onDismiss = null,
  showDismiss = false
}) => {
  const navigate = useNavigate();
  const cccvStatus = getCCCDVerificationStatus(user);
  
  // Don't show if verified and showOnVerified is false
  if (cccvStatus.isVerified && !showOnVerified) {
    return null;
  }

  const handleNavigate = () => {
    navigate('/profile/edit');
  };

  const getBannerStyle = () => {
    if (cccvStatus.isVerified) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      };
    }
    return {
      bg: 'bg-amber-50',
      border: 'border-amber-200', 
      text: 'text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    };
  };

  const style = getBannerStyle();
  const IconComponent = style.icon;

  return (
    <div className={`relative ${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
      {showDismiss && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`w-5 h-5 ${style.iconColor} mt-0.5`} />
        </div>
        
        <div className="ml-3 flex-1">
          <div className={`text-sm font-medium ${style.text} mb-1`}>
            {cccvStatus.isVerified ? 'CCCD/CMND đã được xác minh' : 'Cần xác minh CCCD/CMND'}
          </div>
          
          <div className={`text-sm ${style.text}`}>
            {cccvStatus.message}
            {!cccvStatus.isVerified && (
              <span className="block mt-1">
                Điều này là bắt buộc để đặt lịch hiến máu và đảm bảo an toàn cho quá trình hiến máu.
              </span>
            )}
          </div>
          
          {!cccvStatus.isVerified && (
            <div className="mt-3">
              <Button
                variant="outline" 
                size="sm"
                onClick={handleNavigate}
                className="inline-flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Cập nhật CCCD ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CCCDVerificationBanner;
