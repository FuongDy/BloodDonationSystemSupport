// src/components/common/EmptyIllustration.jsx
import React from 'react';
import { Heart, Calendar, FileX, AlertCircle, CheckCircle } from 'lucide-react';

const EmptyIllustration = ({
  type = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const illustrations = {
    donations: {
      icon: Heart,
      color: 'text-red-300',
      bg: 'bg-red-50',
      description: 'Chưa có lịch sử hiến máu nào',
    },
    appointments: {
      icon: Calendar,
      color: 'text-blue-300',
      bg: 'bg-blue-50',
      description: 'Chưa có lịch hẹn nào',
    },
    requests: {
      icon: AlertCircle,
      color: 'text-orange-300',
      bg: 'bg-orange-50',
      description: 'Chưa có yêu cầu máu nào',
    },
    results: {
      icon: CheckCircle,
      color: 'text-green-300',
      bg: 'bg-green-50',
      description: 'Chưa có kết quả nào',
    },
    default: {
      icon: FileX,
      color: 'text-gray-300',
      bg: 'bg-gray-50',
      description: 'Không có dữ liệu',
    },
  };

  const config = illustrations[type] || illustrations.default;
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${config.bg} rounded-full ${className}`}
    >
      <IconComponent
        className={`${sizeClasses[size]} ${config.color}`}
      />
    </div>
  );
};

export default EmptyIllustration;
