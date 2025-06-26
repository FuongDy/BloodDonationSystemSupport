// src/components/common/RoleBadge.jsx
import React from 'react';
import { Crown, Shield, User, Heart } from 'lucide-react';
import { USER_ROLES } from '../../utils/permissions';

const RoleBadge = ({ role, roleId, size = 'sm', showIcon = true, className = '' }) => {
  // Hỗ trợ cả role string và roleId number
  const currentRoleId = roleId || role;
  
  const getRoleConfig = (roleId) => {
    switch (roleId) {
      case USER_ROLES.ADMIN: // 4
        return {
          label: 'Admin',
          icon: Crown,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600'
        };
      case USER_ROLES.STAFF: // 3
        return {
          label: 'Staff',
          icon: Shield,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200',
          iconColor: 'text-orange-600'
        };
      case USER_ROLES.MEMBER: // 2
      case USER_ROLES.USER: // 2
      default:
        return {
          label: 'Member',
          icon: User,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600'
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return {
          badge: 'px-1.5 py-0.5 text-xs',
          icon: 'w-3 h-3'
        };
      case 'sm':
        return {
          badge: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3'
        };
      case 'md':
        return {
          badge: 'px-2.5 py-1 text-sm',
          icon: 'w-4 h-4'
        };
      case 'lg':
        return {
          badge: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4'
        };
      default:
        return {
          badge: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3'
        };
    }
  };
  const config = getRoleConfig(currentRoleId);  // Sử dụng currentRoleId thay vì role
  const sizeClasses = getSizeClasses(size);
  const IconComponent = config.icon;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses.badge} ${className}
      `}
    >
      {showIcon && (
        <IconComponent 
          className={`${sizeClasses.icon} ${config.iconColor} mr-1`} 
        />
      )}
      {config.label}
    </span>
  );
};

export default RoleBadge;
