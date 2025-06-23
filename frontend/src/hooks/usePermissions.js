// src/hooks/usePermissions.js
import { useAuth } from './useAuth';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canManageBloodRequests,
  canManageDonations,
  canViewReports,
  canManageUsers,
  isAdmin,
  isStaff,
  isStaffOrAdmin,
  isDonor,
  isUser,
  getRoleName
} from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  // Lấy role_id từ user object - có thể là user.role_id hoặc user.role
  const userRoleId = user?.role_id || user?.role;

  return {
    // Basic permission checks
    hasPermission: (permission) => hasPermission(userRoleId, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRoleId, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRoleId, permissions),
    
    // Role checks
    isAdmin: () => isAdmin(userRoleId),
    isStaff: () => isStaff(userRoleId),
    isStaffOrAdmin: () => isStaffOrAdmin(userRoleId),
    isDonor: () => isDonor(userRoleId),
    isUser: () => isUser(userRoleId),
    
    // Feature-specific permission checks
    canManageBloodRequests: () => canManageBloodRequests(userRoleId),
    canManageDonations: () => canManageDonations(userRoleId),
    canViewReports: () => canViewReports(userRoleId),
    canManageUsers: () => canManageUsers(userRoleId),
    
    // Get current user role
    getCurrentRole: () => getRoleName(userRoleId),
    getCurrentRoleId: () => userRoleId,
    
    // Get user info
    getCurrentUser: () => user
  };
};
