import { useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { USER_ROLES } from '../utils/permissions';

/**
 * Hook để quản lý theme/styling dựa trên role của user
 * Trả về theme colors, classes và utilities cho từng role
 */
export const useRoleTheme = () => {
  const { user } = useAuth();
  
  // Lấy role_id từ user, fallback về role string nếu cần
  const userRoleId = user?.role_id || user?.role;
  
  // Theme configuration cho từng role
  const roleThemes = useMemo(() => ({
    // Member theme (role_id: 2)
    2: {
      primary: 'bg-green-500',
      primaryHover: 'hover:bg-green-600',
      primaryText: 'text-green-600',
      primaryBg: 'bg-green-50',
      primaryBorder: 'border-green-200',
      badge: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      },
      gradient: 'from-green-400 to-green-600',
      shadow: 'shadow-green-200/50'
    },
    
    // Staff theme (role_id: 3)  
    3: {
      primary: 'bg-orange-500',
      primaryHover: 'hover:bg-orange-600',
      primaryText: 'text-orange-600',
      primaryBg: 'bg-orange-50',
      primaryBorder: 'border-orange-200',
      badge: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200'
      },
      gradient: 'from-orange-400 to-orange-600',
      shadow: 'shadow-orange-200/50'
    },
    
    // Admin theme (role_id: 4)
    4: {
      primary: 'bg-purple-500',
      primaryHover: 'hover:bg-purple-600',
      primaryText: 'text-purple-600',
      primaryBg: 'bg-purple-50',
      primaryBorder: 'border-purple-200',
      badge: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
      },
      gradient: 'from-purple-400 to-purple-600',
      shadow: 'shadow-purple-200/50'
    },
    
    // Default theme (guest hoặc không xác định)
    default: {
      primary: 'bg-gray-500',
      primaryHover: 'hover:bg-gray-600',
      primaryText: 'text-gray-600',
      primaryBg: 'bg-gray-50',
      primaryBorder: 'border-gray-200',
      badge: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      },
      gradient: 'from-gray-400 to-gray-600',
      shadow: 'shadow-gray-200/50'
    }
  }), []);

  // Lấy theme cho role hiện tại
  const currentTheme = useMemo(() => {
    // Xử lý trường hợp role_id là số
    if (typeof userRoleId === 'number') {
      return roleThemes[userRoleId] || roleThemes.default;
    }
    
    // Xử lý trường hợp role là string (fallback)
    const roleMapping = {
      [USER_ROLES.MEMBER]: 2,
      [USER_ROLES.STAFF]: 3, 
      [USER_ROLES.ADMIN]: 4
    };
    
    const mappedRoleId = roleMapping[userRoleId];
    return roleThemes[mappedRoleId] || roleThemes.default;
  }, [userRoleId, roleThemes]);

  // Role-specific button styles
  const getButtonClasses = (variant = 'primary') => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} ${currentTheme.primary} text-white ${currentTheme.primaryHover} focus:ring-2`;
      case 'outline':
        return `${baseClasses} border ${currentTheme.primaryBorder} ${currentTheme.primaryText} hover:${currentTheme.primaryBg}`;
      case 'ghost':
        return `${baseClasses} ${currentTheme.primaryText} hover:${currentTheme.primaryBg}`;
      default:
        return baseClasses;
    }
  };

  // Role-specific card styles
  const getCardClasses = () => {
    return `bg-white border ${currentTheme.primaryBorder} rounded-lg ${currentTheme.shadow}`;
  };

  // Role-specific input styles
  const getInputClasses = () => {
    return `border ${currentTheme.primaryBorder} focus:border-2 focus:${currentTheme.primaryText} focus:ring-1 focus:ring-opacity-50`;
  };

  // Apply CSS custom properties for dynamic theming
  useEffect(() => {
    if (typeof window !== 'undefined' && currentTheme) {
      const root = document.documentElement;
      
      // Set CSS custom properties
      root.style.setProperty('--role-primary', getRoleColorValue(currentTheme.primary));
      root.style.setProperty('--role-primary-text', getRoleColorValue(currentTheme.primaryText));
      root.style.setProperty('--role-primary-bg', getRoleColorValue(currentTheme.primaryBg));
    }
  }, [currentTheme]);

  // Helper function to extract color value from Tailwind class
  const getRoleColorValue = (tailwindClass) => {
    // This is a simplified implementation
    // In a real app, you might want to use a more sophisticated mapping
    const colorMap = {
      'bg-green-500': '#10b981',
      'text-green-600': '#059669',
      'bg-green-50': '#f0fdf4',
      'bg-orange-500': '#f97316',
      'text-orange-600': '#ea580c', 
      'bg-orange-50': '#fff7ed',
      'bg-purple-500': '#8b5cf6',
      'text-purple-600': '#7c3aed',
      'bg-purple-50': '#faf5ff',
      'bg-gray-500': '#6b7280',
      'text-gray-600': '#4b5563',
      'bg-gray-50': '#f9fafb'
    };
    
    return colorMap[tailwindClass] || '#6b7280';
  };

  return {
    theme: currentTheme,
    getButtonClasses,
    getCardClasses,
    getInputClasses,
    roleId: userRoleId,
    roleName: user?.role || 'Guest',
    isAdmin: userRoleId === 4 || userRoleId === USER_ROLES.ADMIN,
    isStaff: userRoleId === 3 || userRoleId === USER_ROLES.STAFF,
    isMember: userRoleId === 2 || userRoleId === USER_ROLES.MEMBER
  };
};

export default useRoleTheme;